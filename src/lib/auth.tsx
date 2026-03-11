import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { EmailType, UserKind } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { sendTransactionalEmail } from "@/lib/email/mailer";
import { MagicLinkEmailTemplate } from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/guest/login",
    verifyRequest: "/guest/login/check-email",
  },
  providers: [
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
  ],
  callbacks: {
    async signIn({ user }) {
      const candidateEmail = (user.email ?? "").toLowerCase().trim();

      if (!candidateEmail) {
        return false;
      }

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
      });

      return Boolean(attendee || admin);
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

      if (!dbUser) {
        return token;
      }

      token.sub = dbUser.id;
      token.email = dbUser.email;
      token.name = dbUser.name ?? token.name;
      token.kind = dbUser.kind;
      token.roles = dbUser.memberships.map((membership) => membership.role);
      token.attendeeId = dbUser.attendee?.id ?? null;
      token.eventId = dbUser.attendee?.eventId ?? dbUser.memberships[0]?.eventId ?? null;

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
  const session = await requireUserSession();

  if (!session.user.roles.length) {
    redirect("/guest/login?reason=admin");
  }

  return session;
}
