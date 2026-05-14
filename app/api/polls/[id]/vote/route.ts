import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const voteSchema = z.object({
  option_ids: z.array(z.string().uuid()).min(1),
});

async function getPollResults(supabase: ReturnType<typeof createServiceRoleClient>, pollId: string) {
  const { data: results } = await supabase
    .from("poll_options")
    .select("id, label, poll_votes(count)")
    .eq("poll_id", pollId)
    .order("order_index");

  return (results ?? []).map((option: any) => ({
    option_id: option.id,
    label: option.label,
    votes: option.poll_votes?.[0]?.count ?? 0,
  }));
}

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
  const [{ data: poll }, { data: existingVotes }, { data: pollOptions }] = await Promise.all([
    supabase.from("polls").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("poll_votes")
      .select("id, option_id")
      .eq("poll_id", params.id)
      .eq("user_id", context.user.id),
    supabase.from("poll_options").select("id").eq("poll_id", params.id),
  ]);

  if (!poll) {
    return jsonError("Poll not found.", 404);
  }

  if (poll.closes_at && new Date(poll.closes_at) <= new Date()) {
    return jsonError("This poll is already closed.", 409);
  }

  const allowedOptionIds = new Set((pollOptions ?? []).map((option) => option.id));
  const hasInvalidOption = payload.option_ids.some((optionId) => !allowedOptionIds.has(optionId));
  if (hasInvalidOption) {
    return jsonError("One or more selected options do not belong to this poll.", 400);
  }

  if (poll.poll_type === "multiple") {
    const uniqueCount = new Set(payload.option_ids).size;
    if (uniqueCount !== payload.option_ids.length) {
      return jsonError("Duplicate options are not allowed.", 400);
    }
  }

  if (poll.poll_type === "single" && payload.option_ids.length !== 1) {
    return jsonError("Single-choice polls accept one option only.", 400);
  }

  if (existingVotes?.length) {
    const results = await getPollResults(supabase, params.id);
    return NextResponse.json({
      alreadyVoted: true,
      results,
      message: "Your vote has already been recorded for this poll.",
    });
  }

  const { error: insertError } = await supabase.from("poll_votes").insert(
    payload.option_ids.map((optionId) => ({
      poll_id: params.id,
      option_id: optionId,
      user_id: context.user.id,
    })),
  );

  if (insertError) {
    if ((insertError as { code?: string }).code === "23505") {
      const results = await getPollResults(supabase, params.id);
      return NextResponse.json({
        alreadyVoted: true,
        results,
        message: "Your vote has already been recorded for this poll.",
      });
    }

    return jsonError(insertError.message, 400);
  }

  return NextResponse.json({
    alreadyVoted: false,
    results: await getPollResults(supabase, params.id),
    message: "Vote recorded.",
  });
}
