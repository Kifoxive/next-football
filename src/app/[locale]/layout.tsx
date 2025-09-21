export const metadata: Metadata = {
  title: "Next Football",
  description: "Local Football Website",
  icons: {
    icon: "/favicon/favicon.ico",
    // shortcut: "/favicon/icon1.png",
    // apple: "/favicon/apple-icon.png",
  },
  manifest: "/favicon/site.webmanifest.json",
};

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { locales } from "@/i18n/i18n";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Providers } from "../Providers";
import { LocalesType } from "@/utils/types";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: LocalesType };
}) {
  const { locale } = await params; // "await" fails in build  but needed for runtime

  if (!locales.includes(locale)) {
    return notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
      >
        <Providers locale={locale}>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
