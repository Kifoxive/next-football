"use server";

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

// get all games
export async function GET() {
  const supabase = await createClient();
  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed) return NextResponse.json({ error: errorMessage }, { status });

  const { data, error } = await supabase.from("games").select(`
    *,
    locations (
      name
    )
  `);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  return NextResponse.json(data);
}
