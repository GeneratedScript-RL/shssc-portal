"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailInput from "@/components/shared/EmailInput";

const registerSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@gendejesus.edu.ph"), "Use your school email address."),
  password: z.string().min(8),
  full_name: z.string().min(2),
  privacy_consent: z
    .boolean()
    .refine(
      (value) => value === true,
      "You must consent to the collection and use of your personal information as described in the Privacy Policy.",
    ),
});

export default function RegisterPage() {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      privacy_consent: true,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError("");
    setStatus("saving");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      setStatus("success");
      form.reset();
      return;
    }

    const data = await response.json().catch(() => ({ error: "Registration failed." }));
    setError(data.error ?? "Registration failed.");
    setStatus("error");
  }

  return (
    <div className="container py-16">
      <div className="panel mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">New Student Access</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Create your portal account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Registration is limited to official school email addresses and requires privacy consent.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="register-name">Full name</Label>
            <Input id="register-name" {...form.register("full_name")} />
            <p className="text-sm text-red-600">{form.formState.errors.full_name?.message}</p>
          </div>
          <EmailInput id="register-email" type="email" value={form.watch("email")} {...form.register("email")} />
          <p className="text-sm text-red-600">{form.formState.errors.email?.message}</p>
          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input id="register-password" type="password" {...form.register("password")} />
            <p className="text-sm text-red-600">{form.formState.errors.password?.message}</p>
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] px-4 py-4">
            <Checkbox
              checked={form.watch("privacy_consent")}
              onCheckedChange={(value) => form.setValue("privacy_consent", value === true)}
            />
            <span className="text-sm text-brand-green">
              I consent to the collection and use of my personal information as described in the
              Privacy Policy.
            </span>
          </label>
          <p className="text-sm text-red-600">{form.formState.errors.privacy_consent?.message}</p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full">
            {status === "saving" ? "Creating account..." : status === "success" ? "Registered" : "Register"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href="/auth/login" className="font-semibold text-brand-green">
            Log in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
