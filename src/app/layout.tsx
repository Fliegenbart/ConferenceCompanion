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
  title: "E.ON Conference Companion",
  description: "Private invitation-only event companion for the E.ON Vertriebskonferenz 2026.",
  applicationName: "E.ON Conference Companion",
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
