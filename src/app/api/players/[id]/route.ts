"use server";
import { config } from "@/config";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
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

  const formData = await request.formData();
  const rawProfile = formData.get("player");

  if (!rawProfile || typeof rawProfile !== "string") {
    return NextResponse.json({ error: "Missing player data" }, { status: 400 });
  }

  const { id: targetId } = await params;
  const supabase = await createClient();

  const isSelfUpdate = targetId === user_id;

  const updatedProfile = JSON.parse(rawProfile);

  // 1. Get old avatar from database
  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", targetId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  const oldAvatarPath: string = existing?.avatar_url || undefined;

  const newAvatar = formData.get("avatar");
  let newAvatarPath: string | undefined;

  // if new avatar, remove the old one
  if (existing && newAvatar) {
    const { error: deleteError } = await supabase.storage
      .from(config.buckets.profiles)
      .remove([oldAvatarPath]);
    if (deleteError) {
      console.warn(
        "Failed to delete unused image",
        existing.avatar_url,
        deleteError
      );
    }
  }

  // add a new avatar
  if (newAvatar && newAvatar instanceof File) {
    const ext = newAvatar.name.split(".").pop();
    const fileName = `${randomUUID()}.${ext}`;
    const path = fileName;

    const { data, error: uploadError } = await supabase.storage
      .from(config.buckets.profiles)
      .upload(path, newAvatar, { contentType: newAvatar.type });

    console.log(data);

    newAvatarPath = data?.path;
    if (uploadError) {
      console.error("Upload error", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  }

  const updatePayload = {
    ...updatedProfile,
    // TODO: in case old image deleted, and new image didn't upload
    avatar_url: newAvatarPath || oldAvatarPath,
    updated_at: new Date().toISOString(),
  };

  // Admin: no restrictions
  if (role === USER_ROLE.admin) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updatePayload)
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
    if ("role" in updatePayload) {
      delete updatePayload.role;
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
      .update(updatePayload)
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

  if ("role" in updatePayload) {
    delete updatePayload.role;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updatePayload)
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
