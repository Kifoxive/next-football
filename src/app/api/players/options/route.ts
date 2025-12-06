"use server";

import { PlayerOptionType } from "@/app/[locale]/(authenticated)/players/types";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// get options of all players
export async function GET() {
  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, role")
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Fetch options of players error:", error);
    return NextResponse.json(
      { error: "Failed to fetch options of players" },
      { status: 500 }
    );
  }

  const formatted: PlayerOptionType[] = data.map((player) => ({
    label: `${player.first_name || "---"} ${player.last_name || "---"}`,
    value: player.id,
    role: player.role,
  }));

  return NextResponse.json(formatted, { status: 200 });
}
