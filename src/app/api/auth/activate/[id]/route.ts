import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// check if user is activated
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("joined_at, invited_at, language, user_name")
    .eq("id", targetId)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  return NextResponse.json(data);
}
