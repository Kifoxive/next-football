import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const locationId = params.id;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", locationId)
    .single();

  if (error) {
    console.error("Error fetching location:", error.message);
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
