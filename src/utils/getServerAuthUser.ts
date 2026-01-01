import { IUser } from "@/app/[locale]/(authenticated)/players/types";
import { createClient } from "./supabase/server";

export default async function getServerAuthUser(): Promise<IUser | null> {
  try {
    const supabase = await createClient();

    // Retrieve the current authenticated user
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }

    if (!data.user) {
      console.log("No user is currently signed in.");
      return null;
    }

    console.log(data.user.id);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile user:", profileError.message);
      return null;
    }

    if (!profileData) {
      console.log("No profile user is currently signed in.");
      return null;
    }

    return profileData;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}
