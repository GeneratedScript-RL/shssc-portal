import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCommittees } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const committeeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const committees = await getCommittees();
  return NextResponse.json({ committees });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = committeeSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: committee, error: createError } = await supabase
    .from("committees")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ committee }, { status: 201 });
}
