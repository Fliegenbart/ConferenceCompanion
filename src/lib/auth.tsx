import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { EmailType, UserKind } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { sendTransactionalEmail } from "@/lib/email/mailer";
import { MagicLinkEmailTemplate } from "@/lib/email/templates";
import { logPilotEvent, reportPilotError } from "@/lib/observability";
import { prisma } from "@/lib/prisma";

const authProviders: NonNullable<NextAuthOptions["providers"]> = [
  EmailProvider({
    from: process.env.EMAIL_FROM ?? "ConferenceCompanion <no-reply@example.com>",
    maxAge: 15 * 60,
    async sendVerificationRequest({ identifier, url }) {
      await sendTransactionalEmail({
        to: identifier,
        subject: "Ihr Zugang zu ConferenceCompanion",
        type: EmailType.MAGIC_LINK,
        react: <MagicLinkEmailTemplate url={url} />,
        metadata: { url },
      });
    },
  }),
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  providers: authProviders,
  callbacks: {
    async signIn({ user, account }) {
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

        if (!attendee && !admin) {
          await logPilotEvent("warn", "auth.magic_link.denied", "Magic link denied because no attendee or admin membership was found.", {
            email: candidateEmail,
          });
          return false;
        }

        await logPilotEvent("info", "auth.magic_link.allowed", "Magic link sign-in allowed.", {
          email: candidateEmail,
          hasAdminRole: Boolean(admin),
          hasAttendeeAccess: Boolean(attendee),
        });

        return true;
      }
      return false;
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
    async signIn({ user }) {
      if (!user.email) {
        return;
      }

      const attendee = await prisma.attendee.findFirst({
        where: {
          email: user.email.toLowerCase(),
        },
      });
      const admin = await prisma.user.findFirst({
        where: {
          email: user.email.toLowerCase(),
          memberships: {
            some: {},
          },
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name ?? admin?.name ?? (attendee ? `${attendee.firstName} ${attendee.lastName}` : user.name),
          kind: admin ? UserKind.ADMIN : UserKind.ATTENDEE,
          ...(attendee && attendee.userId !== user.id
            ? {
                attendee: {
                  connect: {
                    id: attendee.id,
                  },
                },
              }
            : {}),
        },
      });
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
    redirect("/login");
  }

  return session;
}

export async function requireAttendeeSession() {
  const session = await requireUserSession();

  if (session.user.kind !== UserKind.ATTENDEE || !session.user.attendeeId) {
    redirect("/login?reason=attendee");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!session.user.roles.length) {
    redirect("/login?reason=admin");
  }

  return session;
}
