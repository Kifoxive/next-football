"use server";

import { IVote } from "@/app/[locale]/games/types";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// player votes the game OR changes vote
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Checking game ID
  const { id: gameId } = await params;
  if (!gameId) {
    return NextResponse.json({ error: "Missing game ID" }, { status: 400 });
  }

  // Checking if user is allowed to vote
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.player,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const body: IVote = await request.json();

  // Checking basic data
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = await createClient();

  // Checking if vote already exists
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", user_id)
    .eq("game_id", gameId)
    .single();

  if (existingVote) {
    // If vote exists, update it
    const { data, error } = await supabase
      .from("votes")
      .update([{ ...body, updated_at: new Date().toISOString() }])
      .eq("id", existingVote.id)
      .select("*");

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Vote updated", vote: data?.[0] ?? null },
      { status: 200 }
    );
  }

  // Creating vote
  const { data, error } = await supabase
    .from("votes")
    .insert([
      {
        ...body,
        game_id: gameId,
        user_id,
        created_at: new Date().toISOString(),
      },
    ])
    .select("*");

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Vote created", vote: data?.[0] ?? null },
    { status: 201 }
  );
}
