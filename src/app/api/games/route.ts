"use server";

import getAllGames from "@/server/games/getAllGames";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// create game
export async function POST(request: Request) {
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
    .insert([
      { ...body, created_by: user_id, created_at: new Date().toISOString() },
    ])
    .select("*");

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Game created", game: data?.[0] ?? null },
    { status: 201 }
  );
}

export async function GET() {
  try {
    const data = await getAllGames();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 401 });
  }
}
