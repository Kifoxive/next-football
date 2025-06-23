"use server";

import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// update game
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  if (!targetId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

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

  if (!targetId) {
    return NextResponse.json({ error: "Missing game ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.moderator,
  });

  if (!isAllowed) return NextResponse.json({ error: errorMessage }, { status });

  const { data, error } = await supabase
    .from("games")
    .select(
      `
        *,
        locations (
        *
        )
  `
    )
    .eq("id", targetId)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// remove game
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.moderator,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const { id: targetId } = await params;

  if (!targetId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase.from("games").delete().eq("id", targetId);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete game failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Game deleted" }, { status: 200 });
}
