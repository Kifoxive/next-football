"use server";

import { NextResponse } from "next/server";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { USER_ROLE } from "@/store/auth";

// add message
export async function POST(request: Request) {
  const { user_id, isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player, // even players should be allowed to send
  });

  if (!isAllowed || !user_id) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const body = await request.json();

  if (!body || typeof body !== "object" || !body.type) {
    return NextResponse.json(
      { error: "Invalid message data" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const insertData = {
    ...body,
    sender_id: user_id,
  };

  const { data, error } = await supabase
    .from("messages")
    .insert([insertData])
    .select("*")
    .single();

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// get all messages
export async function GET() {
  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player, // anyone who can chat
  });

  if (!isAllowed) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  // Fetch messages with sender (author)
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      sender_id,
      type,
      text,
      created_at,
      profiles (
        id,
        user_name,
        first_name,
        last_name,
        role,
        avatar_url
      )
      `
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
