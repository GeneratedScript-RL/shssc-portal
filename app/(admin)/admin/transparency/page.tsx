"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/types";

const financialSchema = z.object({
  period: z.string().min(4),
  total_income: z.coerce.number(),
  total_expenses: z.coerce.number(),
  summary_text: z.string().optional(),
});

const resolutionSchema = z.object({
  title: z.string().min(4),
  resolution_number: z.string().min(2),
  body: z.string().min(8),
});

export default function AdminTransparencyPage() {
  const [financials, setFinancials] = useState<Tables<"financial_summaries">[]>([]);
  const [resolutions, setResolutions] = useState<Tables<"resolutions">[]>([]);
  const financialForm = useForm<z.infer<typeof financialSchema>>({
    resolver: zodResolver(financialSchema),
    defaultValues: { period: "", total_income: 0, total_expenses: 0, summary_text: "" },
  });
  const resolutionForm = useForm<z.infer<typeof resolutionSchema>>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: { title: "", resolution_number: "", body: "" },
  });

  useEffect(() => {
    void fetch("/api/transparency")
      .then((response) => response.json())
      .then((data) => {
        setFinancials(data.financials ?? []);
        setResolutions(data.resolutions ?? []);
      });
  }, []);

  async function submitFinancial(values: z.infer<typeof financialSchema>) {
    const response = await fetch("/api/transparency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "financial", ...values }),
    });
    const data = await response.json();
    if (response.ok) {
      setFinancials((current) => [data.financial, ...current]);
      financialForm.reset();
    }
  }

  async function submitResolution(values: z.infer<typeof resolutionSchema>) {
    const response = await fetch("/api/transparency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "resolution", ...values }),
    });
    const data = await response.json();
    if (response.ok) {
      setResolutions((current) => [data.resolution, ...current]);
      resolutionForm.reset();
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Admin Transparency</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Publish financial reports and official resolutions.</h1>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={financialForm.handleSubmit(submitFinancial)} className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-brand-green">New financial summary</h2>
          <div className="space-y-2">
            <Label htmlFor="financial-period">Period</Label>
            <Input id="financial-period" {...financialForm.register("period")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="financial-income">Total income</Label>
              <Input id="financial-income" type="number" step="0.01" {...financialForm.register("total_income")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financial-expenses">Total expenses</Label>
              <Input id="financial-expenses" type="number" step="0.01" {...financialForm.register("total_expenses")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="financial-summary">Summary</Label>
            <Textarea id="financial-summary" {...financialForm.register("summary_text")} />
          </div>
          <Button type="submit">Publish financial summary</Button>
        </form>
        <form onSubmit={resolutionForm.handleSubmit(submitResolution)} className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-brand-green">New resolution</h2>
          <div className="space-y-2">
            <Label htmlFor="resolution-title">Title</Label>
            <Input id="resolution-title" {...resolutionForm.register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resolution-number">Resolution number</Label>
            <Input id="resolution-number" {...resolutionForm.register("resolution_number")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resolution-body">Body</Label>
            <Textarea id="resolution-body" {...resolutionForm.register("body")} />
          </div>
          <Button type="submit">Publish resolution</Button>
        </form>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="roblox-panel grid gap-3">
          {financials.map((item) => (
            <article key={item.id} className="rounded-2xl border border-brand-green/10 p-4">
              <h2 className="text-xl font-semibold text-brand-green">{item.period}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.summary_text}</p>
            </article>
          ))}
        </div>
        <div className="roblox-panel grid gap-3">
          {resolutions.map((item) => (
            <article key={item.id} className="rounded-2xl border border-brand-green/10 p-4">
              <h2 className="text-xl font-semibold text-brand-green">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
