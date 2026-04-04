"use client";

import { useCallback, useState } from "react";
import type { Tables } from "@/types";
import { useRealtime } from "@/hooks/useRealtime";

export function useLiveQA(sessionId: string, initialQuestions: Tables<"qa_questions">[]) {
  const [questions, setQuestions] = useState(initialQuestions);

  const onChange = useCallback((payload: { new?: Tables<"qa_questions"> }) => {
    if (!payload.new) {
      return;
    }

    setQuestions((current) => {
      const existing = current.find((question) => question.id === payload.new?.id);
      if (existing) {
        return current.map((question) =>
          question.id === payload.new?.id ? payload.new! : question,
        );
      }

      return [payload.new, ...current];
    });
  }, []);

  useRealtime({
    channel: `qa-session-${sessionId}`,
    table: "qa_questions",
    event: "*",
    filter: `session_id=eq.${sessionId}`,
    onChange,
  });

  return { questions, setQuestions };
}
