"use server";

import { PlayerOptionType } from "@/app/[locale]/(authenticated)/players/types";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { SimpleOptionType } from "@/utils/types";
import { NextResponse } from "next/server";

// update game
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.moderator,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const body = await request.json();

  // Checking basic data
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = await createClient();

  // Creating game
  const { data, error } = await supabase
    .from("games")
    .update([body])
    .eq("id", targetId);

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Game updated", game: data?.[0] ?? null },
    { status: 200 }
  );
}

// get one game
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const supabase = await createClient();
  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed) return NextResponse.json({ error: errorMessage }, { status });

  // 🔑 fetch game
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select(
      `
        *,
        locations (*),
        votes (vote, user_id)
      `
    )
    .eq("id", targetId)
    .single();

  if (gameError) {
    console.error(gameError);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  // 🔑 fetch profiles for participants and moderators
  let participants: SimpleOptionType[] = [];
  let moderators: PlayerOptionType[] = [];

  if (Array.isArray(game?.participants) && game.participants.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", game.participants);

    if (profilesError) {
      console.error("Fetch participants error:", profilesError);
    } else {
      participants = profiles.map((p) => ({
        label: `${p.first_name || "---"} ${p.last_name || "---"}`,
        value: p.id,
      }));
    }
  }

  if (Array.isArray(game?.moderators) && game.moderators.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role")
      .in("id", game.moderators);

    if (profilesError) {
      console.error("Fetch moderators error:", profilesError);
    } else {
      moderators = profiles.map((p) => ({
        label: `${p.first_name || "---"} ${p.last_name || "---"}`,
        value: p.id,
        role: p.role, // 🔑 include role for flexibility
      }));
    }
  }

  const transformed = {
    ...game,
    participants,
    moderators,
  };

  return NextResponse.json(transformed, { status: 200 });
}

// remove game
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.moderator,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("games").delete().eq("id", targetId);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete game failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Game deleted" }, { status: 200 });
}
