import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getForumChannels } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const channelSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});

export async function GET() {
  const channels = await getForumChannels();
  return NextResponse.json({ channels });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MODERATE_FORUMS);
  if (error) {
    return error;
  }

  const payload = channelSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: channel, error: createError } = await supabase
    .from("forum_channels")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ channel }, { status: 201 });
}
