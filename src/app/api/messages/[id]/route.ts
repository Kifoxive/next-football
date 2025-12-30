"use server";

import { NextResponse } from "next/server";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { USER_ROLE } from "@/store/auth";

// delete message
export async function DELETE(request: Request) {
  const { user_id, isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed || !user_id) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const url = new URL(request.url);
  const messageId = url.pathname.split("/").pop();

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Get the message to verify ownership
  const { data: message, error: fetchError } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("id", messageId)
    .single();

  if (fetchError || !message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  if (message.sender_id !== user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

// update message
export async function PUT(request: Request) {
  const { user_id, isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed || !user_id) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const url = new URL(request.url);
  const messageId = url.pathname.split("/").pop();

  if (!messageId) {
    return NextResponse.json(
      { error: "Message ID is required" },
      { status: 400 }
    );
  }

  const body = await request.json();

  if (!body || typeof body !== "object" || !body.text) {
    return NextResponse.json(
      { error: "Message text is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Get the message to verify ownership
  const { data: message, error: fetchError } = await supabase
    .from("messages")
    .select("sender_id")
    .eq("id", messageId)
    .single();

  if (fetchError || !message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  if (message.sender_id !== user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("messages")
    .update({ text: body.text })
    .eq("id", messageId)
    .select("*")
    .single();

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
