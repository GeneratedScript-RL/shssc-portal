"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from "@/lib/supabase/client";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string().min(8, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "saving" | "missing-session" | "error">(
    "checking",
  );
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  useEffect(() => {
    const supabase = createBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "ready" : "missing-session");
    });
  }, []);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setStatus("saving");
    setMessage("");

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    router.push("/auth/login?passwordReset=1");
    router.refresh();
  }

  return (
    <div className="container py-16">
      <div className="panel mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
          Account Recovery
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Create a new password</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use the reset link from your email, then set a new password for your portal account.
        </p>
        {status === "missing-session" ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] p-4">
            <p className="text-sm text-muted-foreground">
              This reset link is expired or missing its secure session. Request a new link and open
              it from the same browser.
            </p>
            <Button asChild>
              <Link href="/auth/forgot-password">Request a new link</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input id="new-password" type="password" {...form.register("password")} />
              <p className="text-sm text-red-600">{form.formState.errors.password?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                {...form.register("confirm_password")}
              />
              <p className="text-sm text-red-600">
                {form.formState.errors.confirm_password?.message}
              </p>
            </div>
            {message ? <p className="text-sm text-red-600">{message}</p> : null}
            <Button
              type="submit"
              className="w-full"
              disabled={status === "checking" || status === "saving"}
            >
              {status === "checking"
                ? "Checking reset link..."
                : status === "saving"
                  ? "Saving password..."
                  : "Save new password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
