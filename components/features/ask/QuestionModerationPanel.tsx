"use client";

import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import type { Tables } from "@/types";

type QuestionStatus = Tables<"qa_questions">["status"];

interface ColumnProps {
  id: QuestionStatus;
  questions: Tables<"qa_questions">[];
}

function QuestionCard({ question }: { question: Tables<"qa_questions"> }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: question.id,
    data: { question },
  });

  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
      className="rounded-2xl border border-brand-green/10 bg-white px-4 py-3 text-sm shadow-sm"
      {...listeners}
      {...attributes}
    >
      {question.body}
    </div>
  );
}

function Column({ id, questions }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-[1.5rem] border p-4 ${isOver ? "border-brand-yellow bg-brand-yellow/10" : "border-brand-green/10 bg-white"}`}
    >
      <h3 className="text-lg font-semibold capitalize text-brand-green">{id}</h3>
      <div className="mt-4 space-y-3">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}

interface QuestionModerationPanelProps {
  sessionId: string;
  initialQuestions: Tables<"qa_questions">[];
}

export default function QuestionModerationPanel({
  sessionId,
  initialQuestions,
}: QuestionModerationPanelProps) {
  const [questions, setQuestions] = useState(initialQuestions);

  async function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id as QuestionStatus | undefined;
    const activeQuestion = event.active.data.current?.question as Tables<"qa_questions"> | undefined;

    if (!overId || !activeQuestion || activeQuestion.status === overId) {
      return;
    }

    setQuestions((current) =>
      current.map((question) =>
        question.id === activeQuestion.id ? { ...question, status: overId } : question,
      ),
    );

    await fetch(`/api/ask/${sessionId}/questions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activeQuestion.id,
        status: overId,
      }),
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-3">
        <Column id="queued" questions={questions.filter((question) => question.status === "queued")} />
        <Column id="answered" questions={questions.filter((question) => question.status === "answered")} />
        <Column id="skipped" questions={questions.filter((question) => question.status === "skipped")} />
      </div>
    </DndContext>
  );
}
