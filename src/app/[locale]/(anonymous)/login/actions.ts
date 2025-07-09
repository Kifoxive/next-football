"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { verify } from "jsonwebtoken";

export async function loginUser(provider: Provider) {
  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) throw Error;
    return { errorMessage: null, url: data.url };
  } catch {
    return { errorMessage: "Login failed" };
  }
}

export async function getMe() {
  try {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.getUser();

    if (error) throw Error;
    return { errorMessage: null, user: data.user };
  } catch {
    return { errorMessage: "Can't get current user", user: null };
  }
}

export async function activateUser(provider: Provider, token: string) {
  try {
    const decoded = verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as {
      userId: string;
    };
    if (!decoded) return { errorMessage: "Invalid or expired token" };

    const supabase = await createClient();

    // find associated profile
    const { data: profileData, error: findError } = await supabase
      .from("profiles")
      .select("id, joined_at")
      .eq("id", decoded.userId)
      .single();

    if (findError) return { errorMessage: "Can't find profile ", user: null };

    // create auth user
    const { data: authUserData } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/${profileData.id}`,
      },
    });

    // //  update existed user
    // await supabase
    //   .from("profiles")
    //   .update({
    //     auth_user_id: data.auth_user_id, // there is no such property!
    //   })
    //   .eq("id", decoded.userId)
    //   .select("*");

    //  update existed user
    // const { error: updateError } = await supabase
    //   .from("profiles")
    //   .update({
    //     joined_at: new Date().toISOString(),
    //     auth_user_id: "I DON'T KNOW",
    //   })
    //   .eq("id", decoded.userId)
    //   .select("*");

    // if (updateError)
    //   return { errorMessage: "Can't update profile", user: null };

    return { errorMessage: null, url: authUserData.url };
  } catch {
    return { errorMessage: "Can't activate current user", user: null };
  }
}
