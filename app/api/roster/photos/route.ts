import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

export async function POST(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error) {
    return error;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonError("Please attach an image file.", 400);
  }

  if (!file.type.startsWith("image/")) {
    return jsonError("Only image files are allowed.", 400);
  }

  if (file.size > 5 * 1024 * 1024) {
    return jsonError("Image uploads must be 5 MB or smaller.", 400);
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() ?? "jpg" : "jpg";
  const path = `roster-photos/${crypto.randomUUID()}.${extension}`;
  const supabase = createServiceRoleClient();
  const { error: uploadError } = await supabase.storage
    .from("legacy-media")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return jsonError(uploadError.message, 400);
  }

  const { data } = supabase.storage.from("legacy-media").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
