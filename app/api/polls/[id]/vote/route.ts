import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const voteSchema = z.object({
  option_ids: z.array(z.string().uuid()).min(1),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { error, context } = await requireApiUser();
  if (error || !context) {
    return error;
  }

  const payload = voteSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const [{ data: poll }, { data: existingVotes }] = await Promise.all([
    supabase.from("polls").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("poll_votes").select("id").eq("poll_id", params.id).eq("user_id", context.user.id),
  ]);

  if (!poll) {
    return jsonError("Poll not found.", 404);
  }

  if (existingVotes?.length) {
    return jsonError("You have already voted on this poll.", 409);
  }

  if (poll.poll_type === "single" && payload.option_ids.length !== 1) {
    return jsonError("Single-choice polls accept one option only.", 400);
  }

  const { error: insertError } = await supabase.from("poll_votes").insert(
    payload.option_ids.map((optionId) => ({
      poll_id: params.id,
      option_id: optionId,
      user_id: context.user.id,
    })),
  );

  if (insertError) {
    return jsonError(insertError.message, 400);
  }

  const { data: results } = await supabase
    .from("poll_options")
    .select("id, label, poll_votes(count)")
    .eq("poll_id", params.id)
    .order("order_index");

  return NextResponse.json({
    results: (results ?? []).map((option: any) => ({
      option_id: option.id,
      label: option.label,
      votes: option.poll_votes?.[0]?.count ?? 0,
    })),
  });
}
