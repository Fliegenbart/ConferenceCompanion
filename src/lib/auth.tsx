import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { EmailType, UserKind } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { sendTransactionalEmail } from "@/lib/email/mailer";
import { MagicLinkEmailTemplate } from "@/lib/email/templates";
import {
  extractProfileGroups,
  extractProfileObjectId,
  extractProfileTenantId,
  getAdminProviderId,
  isAdminSsoConfigured,
  parseAllowedGroupIds,
} from "@/lib/entra";
import { logPilotEvent, reportPilotError } from "@/lib/observability";
import { prisma } from "@/lib/prisma";

const adminProviderId = getAdminProviderId();

const authProviders: NonNullable<NextAuthOptions["providers"]> = [
  EmailProvider({
    from: process.env.EMAIL_FROM ?? "E.ON Conference Companion <no-reply@example.com>",
    maxAge: 15 * 60,
    async sendVerificationRequest({ identifier, url }) {
      await sendTransactionalEmail({
        to: identifier,
        subject: "Ihr Zugang zum E.ON Conference Companion",
        type: EmailType.MAGIC_LINK,
        react: <MagicLinkEmailTemplate url={url} />,
        metadata: { url },
      });
    },
  }),
];

if (isAdminSsoConfigured()) {
  authProviders.push(
    AzureADProvider({
      clientId: process.env.ENTRA_ID_CLIENT_ID!,
      clientSecret: process.env.ENTRA_ID_CLIENT_SECRET!,
      tenantId: process.env.ENTRA_ID_TENANT_ID!,
      profilePhotoSize: 64,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/guest/login",
    verifyRequest: "/guest/login/check-email",
  },
  providers: authProviders,
  callbacks: {
    async signIn({ user, account, profile }) {
      const candidateEmail = (user.email ?? "").toLowerCase().trim();

      if (!candidateEmail) {
        await logPilotEvent("warn", "auth.signin.denied", "Missing email during sign-in.", {
          provider: account?.provider,
        });
        return false;
      }

      if (account?.provider === "email") {
        const attendee = await prisma.attendee.findFirst({
          where: {
            email: candidateEmail,
          },
        });

        if (!attendee) {
          await logPilotEvent("warn", "auth.magic_link.denied", "Magic link denied because attendee was not found.", {
            email: candidateEmail,
          });
        }

        return Boolean(attendee);
      }

      if (account?.provider === adminProviderId) {
        const admin = await prisma.user.findFirst({
          where: {
            email: candidateEmail,
            memberships: {
              some: {},
            },
          },
          include: {
            memberships: true,
          },
        });

        if (!admin) {
          await logPilotEvent("warn", "auth.admin.denied", "Entra sign-in denied because no admin membership was found.", {
            email: candidateEmail,
            provider: account.provider,
          });
          return false;
        }

        const tenantId = extractProfileTenantId(profile as Record<string, unknown> | undefined);
        const objectId = extractProfileObjectId(profile as Record<string, unknown> | undefined);
        const allowedTenantId = process.env.ENTRA_ALLOWED_TENANT_ID?.trim() || process.env.ENTRA_ID_TENANT_ID?.trim();

        if (allowedTenantId && tenantId && tenantId !== allowedTenantId) {
          await logPilotEvent("warn", "auth.admin.denied_tenant", "Entra sign-in denied because the tenant did not match the allowed tenant.", {
            email: candidateEmail,
            tenantId,
            allowedTenantId,
          });
          return false;
        }

        const allowedGroupIds = parseAllowedGroupIds();
        const profileGroups = extractProfileGroups(profile as Record<string, unknown> | undefined);

        if (allowedGroupIds.length && !allowedGroupIds.some((groupId) => profileGroups.includes(groupId))) {
          await logPilotEvent("warn", "auth.admin.denied_group", "Entra sign-in denied because required groups were missing.", {
            email: candidateEmail,
            groupCount: profileGroups.length,
          });
          return false;
        }

        await prisma.user.update({
          where: { id: admin.id },
          data: {
            kind: UserKind.ADMIN,
            name: user.name ?? admin.name,
            image: user.image ?? admin.image,
            entraObjectId: objectId ?? admin.entraObjectId,
            entraTenantId: tenantId ?? admin.entraTenantId,
            lastEntraSyncAt: new Date(),
          },
        });

        await logPilotEvent("info", "auth.admin.allowed", "Entra admin sign-in allowed.", {
          email: candidateEmail,
          roles: admin.memberships.map((membership) => membership.role),
        });

        return true;
      }

      const attendee = await prisma.attendee.findFirst({
        where: {
          email: candidateEmail,
        },
      });

      return Boolean(attendee);
    },
    async jwt({ token, user }) {
      const userId = user?.id ?? token.sub;

      if (!userId) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          memberships: true,
          attendee: true,
        },
      });

      const effectiveUser =
        dbUser && (dbUser.memberships.length > 0 || dbUser.attendee)
          ? dbUser
          : token.email
            ? await prisma.user.findUnique({
                where: { email: String(token.email).toLowerCase() },
                include: {
                  memberships: true,
                  attendee: true,
                },
              })
            : null;

      if (!effectiveUser) {
        return token;
      }

      token.sub = effectiveUser.id;
      token.email = effectiveUser.email;
      token.name = effectiveUser.name ?? token.name;
      token.kind = effectiveUser.kind;
      token.roles = effectiveUser.memberships.map((membership) => membership.role);
      token.attendeeId = effectiveUser.attendee?.id ?? null;
      token.eventId = effectiveUser.attendee?.eventId ?? effectiveUser.memberships[0]?.eventId ?? null;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.kind = (token.kind as UserKind | undefined) ?? UserKind.ATTENDEE;
        session.user.roles = (token.roles as never[]) ?? [];
        session.user.attendeeId = (token.attendeeId as string | null | undefined) ?? null;
        session.user.eventId = (token.eventId as string | null | undefined) ?? null;
      }

      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return;
      }

      if (account?.provider === adminProviderId) {
        const admin = await prisma.user.findUnique({
          where: {
            email: user.email.toLowerCase(),
          },
        });

        if (admin) {
          await prisma.user.update({
            where: { id: admin.id },
            data: {
              kind: UserKind.ADMIN,
              name: user.name ?? admin.name,
              image: user.image ?? admin.image,
              entraObjectId: extractProfileObjectId(profile as Record<string, unknown> | undefined) ?? admin.entraObjectId,
              entraTenantId: extractProfileTenantId(profile as Record<string, unknown> | undefined) ?? admin.entraTenantId,
              lastEntraSyncAt: new Date(),
            },
          });
        }

        return;
      }

      const attendee = await prisma.attendee.findFirst({
        where: {
          email: user.email.toLowerCase(),
        },
      });

      if (attendee && attendee.userId !== user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.name ?? `${attendee.firstName} ${attendee.lastName}`,
            kind: UserKind.ATTENDEE,
            attendee: {
              connect: {
                id: attendee.id,
              },
            },
          },
        });
      }
    },
  },
  logger: {
    error(code, metadata) {
      void reportPilotError("auth.logger.error", new Error(code), {
        metadata,
      });
    },
    warn(code) {
      void logPilotEvent("warn", "auth.logger.warn", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        void logPilotEvent("info", "auth.logger.debug", code, {
          metadata,
        });
      }
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

export async function requireUserSession() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/guest/login");
  }

  return session;
}

export async function requireAttendeeSession() {
  const session = await requireUserSession();

  if (session.user.kind !== UserKind.ATTENDEE || !session.user.attendeeId) {
    redirect("/guest/login?reason=attendee");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  if (!session.user.roles.length) {
    redirect("/admin/login?reason=admin");
  }

  return session;
}
