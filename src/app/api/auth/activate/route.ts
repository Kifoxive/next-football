import { verify } from "jsonwebtoken";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// activate user (register)
export async function POST(req: Request) {
  const { token } = await req.json();

  const decoded = verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as {
    userId: string;
  };

  if (!decoded)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ joined_at: new Date().toISOString() })
    .eq("id", decoded.userId)
    .select("*");

  if (error)
    return NextResponse.json({ error: "Can't find user " }, { status: 404 });

  return NextResponse.json({ success: true });
}
