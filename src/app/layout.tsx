import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";

import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConferenceCompanion",
  description: "Private invitation-only conference companion for registrations, agenda, logistics and participant communication.",
  applicationName: "ConferenceCompanion",
};

export const dynamic = "force-dynamic";

export const viewport = {
  themeColor: "#163224",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${manrope.variable} ${newsreader.variable} antialiased`}
      >
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
