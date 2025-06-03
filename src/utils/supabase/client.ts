import { createBrowserClient } from "@supabase/ssr";
import "client-only";

// Client Component client -
// To access Supabase from Client Components, which run in the browser.

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
