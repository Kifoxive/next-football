import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";

// only for user activation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: profileId } = await params;

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // After successful OAuth sign-up
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!error && user) {
        const result = await supabase
          .from("profiles")
          .update({
            auth_user_id: user.id,
            joined_at: new Date().toISOString(),
          })
          .eq("id", profileId);
      }

      // Rest of your redirect logic
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
