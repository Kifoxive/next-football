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

// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
// import Navbar from "@/components/Navbar";
import { locales } from "@/i18n/i18n";

import { notFound } from "next/navigation";
// import Footer from "@/components/Footer";
import AuthLayout from "@/components/AuthProvider";
import { Metadata } from "next";
import { Providers } from "../themeRegistry";
import DashboardLayoutWrapper from "./Dashboard";

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
  params: { locale: "en" | "uk" | "cz" };
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
      >
        <Providers>
          {/* <AppRouterCacheProvider options={{ enableCssLayer: true }}> */}
          <NextIntlClientProvider locale={locale}>
            <AuthLayout>
              <>
                {/* <Navbar />
                {children}
                <Footer /> */}
                <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
              </>
            </AuthLayout>
          </NextIntlClientProvider>
          {/* </AppRouterCacheProvider> */}
        </Providers>
      </body>
    </html>
  );
}
