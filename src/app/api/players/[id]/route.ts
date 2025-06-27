"use server";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// get one player

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const { isAllowed, errorMessage, status } = await getIsAllowed({
    permission: USER_ROLE.player,
  });

  if (!isAllowed) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", targetId)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// update player
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.player,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const body = await request.json();
  const { id: targetId } = await params;

  if (!body || typeof body !== "object" || !targetId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const supabase = await createClient();

  const isSelfUpdate = targetId === user_id;

  // Admin: no restrictions
  if (role === USER_ROLE.admin) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", targetId)
      .select("*");

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User updated", user: data?.[0] ?? null },
      { status: 200 }
    );
  }

  // Moderator: can change himself or the player, but not the role
  if (role === USER_ROLE.moderator) {
    // we get the role of the player we want to change
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", targetId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ❌ you can't change roles
    if ("role" in body) {
      delete body.role;
    }

    // ❌ you cannot change the admin or other moderator
    if (!isSelfUpdate && targetUser.role !== USER_ROLE.player) {
      return NextResponse.json(
        { error: "Forbidden to edit this user" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", targetId)
      .select("*");

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User updated", user: data?.[0] ?? null },
      { status: 200 }
    );
  }

  // Player: can only change himself, no role
  if (!isSelfUpdate) {
    return NextResponse.json(
      { error: "You can only update your own profile" },
      { status: 403 }
    );
  }

  if ("role" in body) {
    delete body.role;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", targetId)
    .select("*");

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "User updated", user: data?.[0] ?? null },
    { status: 200 }
  );
}

// remove player
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.player,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const { id: targetId } = await params;

  const supabase = await createClient();

  const isSelfDelete = targetId === user_id;

  // Admin: no restrictions
  if (role === USER_ROLE.admin) {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", targetId);
    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  }

  // Moderator: only players can be deleted
  if (role === USER_ROLE.moderator) {
    const { data: targetUser } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", targetId)
      .single();

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role !== USER_ROLE.player) {
      return NextResponse.json(
        { error: "Forbidden to delete this user" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", targetId);
    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  }

  // Player: can only delete himself
  if (!isSelfDelete) {
    return NextResponse.json(
      { error: "You can only delete your own profile" },
      { status: 403 }
    );
  }

  const { error } = await supabase.from("profiles").delete().eq("id", targetId);
  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Your profile was deleted" },
    { status: 200 }
  );
}
