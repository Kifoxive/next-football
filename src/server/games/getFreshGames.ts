import { GetFreshGames } from "@/app/[locale]/(authenticated)/games/types";
import { GAME_STATUS } from "@/config";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";

export default async function getFreshGames(): Promise<
  GetFreshGames["response"]
> {
  const supabase = await createClient();
  const { isAllowed } = await getIsAllowed({ permission: USER_ROLE.player });

  if (!isAllowed) throw new Error("Unauthorized");

  const query = supabase
    .from("games")
    .select("*, locations(name, image_list)")
    .order("date")
    .in("status", [
      GAME_STATUS.voting,
      GAME_STATUS.confirmed,
      GAME_STATUS.live,
    ]);

  const { data, error } = await query;

  if (error) throw new Error("Fetch error");

  return data;
}
