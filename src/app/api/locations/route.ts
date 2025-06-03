import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getIsAllowed } from "@/utils/supabase/getIsAllowed";
import { USER_ROLE } from "@/store/auth";
import { randomUUID } from "crypto";
import { config } from "@/config";

export async function POST(request: Request) {
  const { user_id, role, isAllowed, errorMessage, status } = await getIsAllowed(
    {
      permission: USER_ROLE.moderator,
    }
  );

  if (!isAllowed || !user_id || !role) {
    return NextResponse.json({ error: errorMessage }, { status });
  }

  const formData = await request.formData();
  const rawLocation = formData.get("location");

  if (!rawLocation || typeof rawLocation !== "string") {
    return NextResponse.json(
      { error: "Missing location data" },
      { status: 400 }
    );
  }

  const locationData = JSON.parse(rawLocation);
  const supabase = await createClient();

  // Save image to the bucket
  const uploadedImagePaths: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("file_") && value instanceof File) {
      const file = value;
      const fileExt = file.name.split(".").pop();
      const fileName = `${randomUUID()}.${fileExt}`;
      const filePath = `${config.buckets.locations}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(config.buckets.locations)
        .upload(filePath, file, {
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
      }

      uploadedImagePaths.push(filePath);
    }
  }

  // Add list of images to location data
  const newLocation = {
    ...locationData,
    created_by: user_id,
    image_list: uploadedImagePaths, // text[]
  };

  const { data, error } = await supabase
    .from("locations")
    .insert([newLocation]);

  if (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Location created", location: data?.[0] ?? null },
    { status: 201 }
  );
}

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
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
