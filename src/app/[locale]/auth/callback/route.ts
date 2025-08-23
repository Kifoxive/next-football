import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { config } from "@/config";
import { createAdminClient } from "@/utils/supabase/admin";

// Handles the OAuth callback after user signs in
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // If a redirect target is provided (e.g., ?next=/dashboard), use it; otherwise default to "/"
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // Exchange the code from the URL for a user session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return redirect("/login?error=unauthorized");
    }

    // Check if user is registered in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError || !profile) {
      // Not found in profiles → sign out and redirect
      await supabase.auth.signOut();

      const adminClient = createAdminClient();
      await adminClient.auth.admin.deleteUser(user.id);

      return redirect(config.routes.unauthorized);
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      // const isLocalEnv = process.env.NODE_ENV === "development";

      // console.log(isLocalEnv);
      // console.log(origin);
      // console.log(next);
      // console.log(forwardedHost);
      // // In development, use the original origin directly
      // if (isLocalEnv) {
      //   return NextResponse.redirect(`${origin}${next}`);
      // }

      // In production, use forwarded host to construct the correct domain
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      // Fallback: use origin
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something fails, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
