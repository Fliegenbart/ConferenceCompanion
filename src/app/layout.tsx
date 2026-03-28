import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const manrope = Sora({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConferenceCompanion",
  description: "Privater, einladungsbasierter Konferenzbegleiter für Registrierung, Agenda, Logistik und Teilnehmerkommunikation.",
  applicationName: "ConferenceCompanion",
};

export const dynamic = "force-dynamic";

export const viewport = {
  themeColor: "#111315",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
    <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
      >
        <Providers>
          <PwaRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
