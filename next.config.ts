// import { NextConfig } from "next";
// import createNextIntlPlugin from "next-intl/plugin";

// const nextConfig: NextConfig = {
//   i18n: {
//     locales: ["cz", "uk", "en"],
//     defaultLocale: "cz",
//   },
// };

// const withNextIntl = createNextIntlPlugin();
// export default withNextIntl(nextConfig);
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["ivpbzmxvwslevrjhdqpt.supabase.co"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
