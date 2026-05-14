import { z } from "zod";
import { NextResponse } from "next/server";
import { requireApiUser, jsonError } from "@/app/api/_helpers";
import { createServiceRoleClient } from "@/lib/supabase/server";

const permissionSchema = z.object({
  permission: z.string().min(2),
  granted: z.boolean(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = permissionSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  const { error: upsertError } = await supabase.from("access_level_permissions").upsert({
    access_level_id: params.id,
    permission: payload.permission,
    granted: payload.granted,
  });

  if (upsertError) {
    return jsonError(upsertError.message, 400);
  }

  return NextResponse.json({ ok: true });
}
