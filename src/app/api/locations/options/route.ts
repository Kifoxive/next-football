import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// get list of all locations
export async function GET() {
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.player,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .select("id, name")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch list of locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch list of locations" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    data.map(({ id, name }) => ({ label: name, value: id })),
    { status: 200 }
  );
}
