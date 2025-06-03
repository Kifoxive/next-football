// import { cookies } from "next/headers";
import { USER_ROLE } from "@/store/auth";
import { createClient } from "./server";
import { permissions } from "@/config";
// import { createServerClient } from "@supabase/ssr";

type getUserRoleProps = {
  // supabaseClient: SupabaseClient
  permission: USER_ROLE;
};

type getUserRoleResult = {
  role: USER_ROLE | null;
  isAllowed: boolean;
  errorMessage: string | null;
  status: number;
  user_id: string | null;
};

export async function getIsAllowed({
  permission,
}: getUserRoleProps): Promise<getUserRoleResult> {
  const supabase = await createClient();

  // Отримуємо користувача з cookie
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      role: null,
      isAllowed: false,
      errorMessage: "Unauthorized",
      status: 401,
      user_id: null,
    };
  }

  // Отримуємо роль з таблиці profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      role: null,
      isAllowed: false,
      errorMessage: "Unauthorized",
      status: 401,
      user_id: null,
    };
  } else if (!permissions[permission].includes(profile.role)) {
    return {
      role: profile.role,
      isAllowed: false,
      errorMessage: "Forbidden",
      status: 403,
      user_id: profile.id,
    };
  }

  return {
    role: profile.role,
    isAllowed: true,
    errorMessage: null,
    status: 200,
    user_id: profile.id,
  };
}
