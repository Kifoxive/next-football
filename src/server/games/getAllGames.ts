import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";

export default async function getAllGames() {
  const supabase = await createClient();
  const { isAllowed } = await getIsAllowed({ permission: USER_ROLE.player });

  if (!isAllowed) throw new Error("Unauthorized");

  const query = supabase
    .from("games")
    .select("*, locations(name)")
    .order("date", { ascending: false });

  const { data, error } = await query;

  if (error) throw new Error("Fetch error");

  return data;
}
