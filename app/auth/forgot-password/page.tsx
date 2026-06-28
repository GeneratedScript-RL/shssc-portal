"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@gendejesus.edu.ph"), "Use your school email address."),
});

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setStatus("sending");
    setMessage("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error ?? "Unable to send reset email right now.");
      return;
    }

    setStatus("sent");
    setMessage("Check your school inbox for the password reset link.");
  }

  return (
    <div className="container py-16">
      <div className="panel mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
          Account Recovery
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Reset your password</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your school email and we will send a secure link to create a new password.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">School email</Label>
            <Input id="forgot-email" type="email" {...form.register("email")} />
            <p className="text-sm text-red-600">{form.formState.errors.email?.message}</p>
          </div>
          {message ? (
            <p className={status === "error" ? "text-sm text-red-600" : "text-sm text-brand-green"}>
              {message}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/auth/login" className="font-semibold text-brand-green">
            Back to login
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
