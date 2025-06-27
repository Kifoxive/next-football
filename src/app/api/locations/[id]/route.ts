import { config } from "@/config";
import { USER_ROLE } from "@/store/auth";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// get all locations
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.player,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const { id: targetId } = await params;

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", targetId)
    .single();

  if (error) {
    console.error("Error fetching location:", error.message);
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// update location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.moderator,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const { id: targetId } = await params;
  const supabase = await createClient();

  const formData = await request.formData();
  const rawLocation = formData.get("location");

  if (!rawLocation || typeof rawLocation !== "string") {
    return NextResponse.json(
      { error: "Missing location data" },
      { status: 400 }
    );
  }

  const updatedLocation = JSON.parse(rawLocation);

  // 1. Get old photos from the database
  const { data: existing, error: fetchError } = await supabase
    .from("locations")
    .select("image_list")
    .eq("id", targetId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const oldImageList: string[] = existing.image_list || [];

  // 2. Read new and saved images
  const newImageList: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("file_") && value instanceof File) {
      const file = value;
      const ext = file.name.split(".").pop();
      const fileName = `${randomUUID()}.${ext}`;
      const path = fileName;

      const { error: uploadError } = await supabase.storage
        .from(config.buckets.locations)
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        console.error("Upload error", uploadError);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
      }

      newImageList.push(path);
    }

    if (key.startsWith("existing_") && typeof value === "string") {
      newImageList.push(value);
    }
  }

  // 3. Delete photos that are no longer used
  const toDelete = oldImageList.filter(
    (oldPath) => !newImageList.includes(oldPath)
  );
  for (const path of toDelete) {
    const { error: deleteError } = await supabase.storage
      .from(config.buckets.locations)
      .remove([path]);
    if (deleteError) {
      console.warn("Failed to delete unused image", path, deleteError);
    }
  }

  // 4. Update location
  const updatePayload = {
    ...updatedLocation,
    image_list: newImageList,
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("locations")
    .update(updatePayload)
    .eq("id", targetId);

  if (updateError) {
    console.error("Update error", updateError);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Location updated", image_list: newImageList },
    { status: 200 }
  );
}

// remove location
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await params;

  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.moderator,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const supabase = await createClient();

  // 1. Remove associated photos from the database
  const { data: existing, error: fetchError } = await supabase
    .from("locations")
    .select("image_list")
    .eq("id", targetId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  const oldImageList: string[] = existing.image_list || [];

  for (const path of oldImageList) {
    const { error: deleteError } = await supabase.storage
      .from(config.buckets.locations)
      .remove([path]);
    if (deleteError) {
      console.warn("Failed to delete unused image", path, deleteError);
    }
  }

  // 2. Remove the location
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", targetId);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete location failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Location deleted" }, { status: 200 });
}
