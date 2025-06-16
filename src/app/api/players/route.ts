"use server";

import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// get all players
export async function GET(request: Request) {
  const supabase = await createClient();
  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });
  console.log(request.headers);

  if (!isAllowed) return NextResponse.json({ error: errorMessage }, { status });

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// create player
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

  // Force add "player" role if creator is not admin
  if (role !== USER_ROLE.admin) {
    body.role = USER_ROLE.player;
  }

  // Creating user
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        ...body,
        created_by: user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select("*");

  if (error) {
    console.error("Insert error:", error);
    const isDuplicate = error.message.includes("duplicate key");
    return NextResponse.json(
      { error: isDuplicate ? "User already exists" : "Insert failed" },
      { status: isDuplicate ? 409 : 500 }
    );
  }

  return NextResponse.json(
    { message: "User created", user: data?.[0] ?? null },
    { status: 201 }
  );
}
