import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ivpbzmxvwslevrjhdqpt.supabase.co"],
  },
  allowedDevOrigins: [
    "https://next-football-eosin.vercel.app",
    "http://localhost:3000",
    "https://nice-satyr-lovely.ngrok-free.app",
    "nice-satyr-lovely.ngrok-free.app",
  ],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
