"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { config } from "@/config";
import { Provider } from "@supabase/supabase-js";

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
  } catch (e) {
    return { errorMessage: "Login failed" };
  }
}

export async function getMe() {
  try {
    const supabase = await createClient();

    const { error, data } = await supabase.auth.getUser();

    if (error) throw Error;
    return { errorMessage: null, user: data.user };
  } catch (e) {
    return { errorMessage: "Can't get current user", user: null };
  }
}

export async function signupUser(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
