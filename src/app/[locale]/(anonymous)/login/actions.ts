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

export async function loginUserEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw Error;
    return { errorMessage: null };
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

    if (!decoded?.userId) return { errorMessage: "Invalid or expired token" };

    const supabase = await createClient();

    // find associated profile
    const { data: profileData, error: findError } = await supabase
      .from("profiles")
      .select("id, joined_at, auth_user_id")
      .eq("id", decoded.userId)
      .single();

    if (findError) return { errorMessage: "Can't find profile", user: null };

    if (profileData?.joined_at || profileData?.auth_user_id)
      return { errorMessage: "User is already activated", user: profileData };

    // create auth user
    const { data: authUserData } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/${profileData.id}`,
      },
    });

    return { errorMessage: null, url: authUserData.url };
  } catch {
    return { errorMessage: "Can't activate current user", user: null };
  }
}

export async function registerUserEmail(
  token: string,
  user: { email: string; password: string }
) {
  try {
    const decoded = verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as {
      userId: string;
    };

    if (!decoded?.userId) return { errorMessage: "Invalid or expired token" };

    const supabase = await createClient();

    // find associated profile
    const { data: profileData, error: findError } = await supabase
      .from("profiles")
      .select("id, joined_at, auth_user_id")
      .eq("id", decoded.userId)
      .single();

    if (findError) return { errorMessage: "Can't find profile", user: null };

    if (profileData?.joined_at || profileData?.auth_user_id)
      return { errorMessage: "User is already activated", user: profileData };

    // create auth user
    const { data } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      // options: {
      //   emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      // },
    });

    await supabase
      .from("profiles")
      .update({
        auth_user_id: data.user?.id,
        email: user.email,
        joined_at: new Date().toISOString(),
      })
      .eq("id", profileData.id);

    return { errorMessage: null };
  } catch {
    return { errorMessage: "Can't activate current user", user: null };
  }
}
