import { redirect } from "next/navigation";
import { getMe } from "../(anonymous)/login/actions";
import { DashboardLayoutWrapper } from "./Dashboard";
import { config } from "@/config";

// export const metadata: Metadata = {
//   title: "Next Football",
//   description: "Local Football Website",
//   icons: {
//     icon: "/favicon/favicon.ico",
//     // shortcut: "/favicon/icon1.png",
//     // apple: "/favicon/apple-icon.png",
//   },
//   manifest: "/favicon/site.webmanifest.json",
// };

// import { Geist, Geist_Mono } from "next/font/google";
// import "@/app/[locale]/globals.css";
// import { locales } from "@/i18n/i18n";

// import { notFound } from "next/navigation";
// import { Metadata } from "next";

// import { LocalesType } from "@/utils/types";
// import { Providers } from "@/app/Providers";
// import { AuthInitializer } from "@/hooks";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default async function AuthenticatedLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: { locale: LocalesType };
// }) {
//   const { locale } = await params;

//   if (!locales.includes(locale)) {
//     return notFound();
//   }

//   const { user } = await getMe();
//   if (!user) redirect(config.routes.login);

//   return (
//     <html lang={locale} suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
//       >
//         <Providers locale={locale}>
//           {/* <AuthProvider> */}
//           <AuthInitializer id={user?.id} />
//           <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
//           {/* </AuthProvider> */}
//         </Providers>
//       </body>
//     </html>
//   );
// }

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getMe();

  if (!user) redirect(config.routes.login);

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
