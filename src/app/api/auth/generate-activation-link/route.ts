import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { config } from "@/config";

// generate activation link
export async function POST(request: Request) {
  const { userId, inviterId } = await request.json();

  const token = sign(
    { userId, inviterId },
    process.env.NEXT_PUBLIC_JWT_SECRET!,
    {
      expiresIn: "12h",
    }
  );

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${config.routes.profile.activate}?token=${token}`;

  return NextResponse.json({ url, token });
}
