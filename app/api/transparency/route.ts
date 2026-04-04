import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { getTransparencyData } from "@/lib/supabase/queries";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const financialSchema = z.object({
  type: z.literal("financial"),
  period: z.string().min(4),
  total_income: z.number(),
  total_expenses: z.number(),
  summary_text: z.string().optional(),
});

const resolutionSchema = z.object({
  type: z.literal("resolution"),
  title: z.string().min(4),
  resolution_number: z.string().min(2),
  body: z.string().min(8),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const data = await getTransparencyData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error, context } = await requireApiUser(PERMISSIONS.MANAGE_FINANCIALS);
  if (error || !context) {
    return error;
  }

  const body = await request.json();
  const supabase = createServiceRoleClient();

  if (body.type === "financial") {
    const payload = financialSchema.parse(body);
    const { data: financial, error: createError } = await supabase
      .from("financial_summaries")
      .insert({
        period: payload.period,
        total_income: payload.total_income,
        total_expenses: payload.total_expenses,
        summary_text: payload.summary_text ?? null,
        published_by: context.user.id,
      })
      .select("*")
      .single();

    if (createError) {
      return jsonError(createError.message, 400);
    }

    return NextResponse.json({ financial }, { status: 201 });
  }

  const payload = resolutionSchema.parse(body);
  const { data: resolution, error: createError } = await supabase
    .from("resolutions")
    .insert({
      title: payload.title,
      resolution_number: payload.resolution_number,
      body: payload.body,
      status: "approved",
      approved_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ resolution }, { status: 201 });
}
