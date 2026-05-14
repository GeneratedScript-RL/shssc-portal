"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [redirectTarget] = useState(() => {
    if (typeof window === "undefined") {
      return "/portal";
    }

    return new URLSearchParams(window.location.search).get("redirectedFrom") ?? "/portal";
  });
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("");
    const supabase = createBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword(values);

    if (signInError) {
      if (signInError.message.includes("Email not confirmed")) {
        setError("Email not confirmed. Check your inbox for the confirmation link.");
        setShowResend(true);
      } else {
        setError(signInError.message);
      }
      return;
    }

    router.push(redirectTarget);
    router.refresh();
  }

  const [showResend, setShowResend] = useState(false);

  async function handleResendConfirmation() {
    setError("");
    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.getValues("email") }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setShowResend(false);
        setError("Confirmation email resent! Check your inbox.");
      }
    } catch {
      setError("Failed to resend confirmation email.");
    }
  }

  return (
    <div className="container py-16">
      <div className="panel mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Account Access</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Log in to SHSSC Portal</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use your school email account to access portal, profile, and council workflows.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email">School email</Label>
            <Input id="login-email" type="email" {...form.register("email")} />
            <p className="text-sm text-red-600">{form.formState.errors.email?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" {...form.register("password")} />
            <p className="text-sm text-red-600">{form.formState.errors.password?.message}</p>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {showResend && (
            <button
              type="button"
              onClick={handleResendConfirmation}
              className="text-sm text-brand-green underline"
            >
              Resend confirmation email
            </button>
          )}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Need an account?{" "}
          <Link href="/auth/register" className="font-semibold text-brand-green">
            Register here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
