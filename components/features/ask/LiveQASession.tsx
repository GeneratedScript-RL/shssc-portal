"use client";

import { useLiveQA } from "@/hooks/useLiveQA";
import type { Tables } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface LiveQASessionProps {
  sessionId: string;
  initialQuestions: Tables<"qa_questions">[];
}

export default function LiveQASession({ sessionId, initialQuestions }: LiveQASessionProps) {
  const { questions } = useLiveQA(sessionId, initialQuestions);

  return (
    <div className="grid gap-4">
      {questions.map((question) => (
        <article
          key={question.id}
          className={cn(
            "forum-card transition duration-300",
            question.status === "answered" && "border-brand-lime/40 bg-brand-lime/5",
            question.status === "skipped" && "border-brand-orange/30 bg-brand-orange/5",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Badge variant={question.status === "queued" ? "outline" : "default"}>
              {question.status}
            </Badge>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {question.is_anonymous ? "Anonymous" : "Named"}
            </span>
          </div>
          <p className="mt-4 text-sm text-foreground">{question.body}</p>
        </article>
      ))}
    </div>
  );
}
