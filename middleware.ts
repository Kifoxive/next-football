import { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Supabase session update
  const response = await updateSession(request);

  // 2. next-intl routing
  const intlResponse = intlMiddleware(request);

  return intlResponse ?? response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|trpc|_vercel|.*\\..*).*)",
  ],
};
