import { NextResponse } from "next/server";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { USER_ROLE } from "@/store/auth";
import { ISubscription } from "@/app/[locale]/(authenticated)/chats/types";

// subscribe use to notifications
export async function POST(request: Request) {
  const { user_id, isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player, // even players should be allowed to send
  });

  if (!isAllowed || !user_id) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const body: ISubscription = await request.json();

  if (!body || typeof body !== "object" || !body.keys) {
    return NextResponse.json(
      { error: "Invalid message data" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { endpoint, keys } = body; // subscription object

  // if exists, return
  const { data } = await supabase
    .from("push_subscriptions")
    .select()
    .eq("user_id", user_id)
    .single();

  if (data) {
    return NextResponse.json(
      { message: "Already subscribed" },
      { status: 200 }
    );
  }

  // if don't exist, create
  const { error } = await supabase.from("push_subscriptions").insert([
    {
      user_id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Insert subscription failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Subscription created" },
    { status: 201 }
  );
}

// unsubscribe from notifications
export async function DELETE() {
  const { user_id, isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player, // even players should be allowed to send
  });

  if (!isAllowed || !user_id) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  // if don't exist, create
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user_id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete subscription failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Subscription deleted" },
    { status: 200 }
  );
}
