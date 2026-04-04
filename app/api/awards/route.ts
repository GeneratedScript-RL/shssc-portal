import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getAwards } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const awardSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  emblem_url: z.string().optional(),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const awards = await getAwards();
  return NextResponse.json({ awards });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = awardSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: award, error: createError } = await supabase
    .from("awards")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ award }, { status: 201 });
}
