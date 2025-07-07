// get me

import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { isAllowed, errorMessage, status, user_id } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed || !user_id) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  return NextResponse.json(data);
}
