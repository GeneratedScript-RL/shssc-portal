"use client";

import { forwardRef, useEffect, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

interface EmailInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ className, label = "School Email", value, onBlur, ...props }, ref) => {
    const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
    const [isPending, startTransition] = useTransition();
    const email = typeof value === "string" ? value : "";

    useEffect(() => {
      if (!email) {
        setStatus("idle");
      }
    }, [email]);

    async function checkAvailability() {
      if (!email) {
        return;
      }

      startTransition(async () => {
        setStatus("checking");
        try {
          const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`, {
            cache: "no-store",
          });
          const data = await response.json();
          setStatus(data.exists ? "taken" : "available");
        } catch {
          setStatus("idle");
        }
      });
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id}>{label}</Label>
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              status === "taken" && "border-red-300 focus-visible:ring-red-300",
              className,
            )}
            value={value}
            onBlur={(event) => {
              onBlur?.(event);
              void checkAvailability();
            }}
            {...props}
          />
          {status === "taken" ? (
            <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
          ) : null}
          {status === "available" ? (
            <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-green" />
          ) : null}
        </div>
        <p className="min-h-5 text-xs text-muted-foreground">
          {status === "checking" || isPending ? "Checking email availability..." : null}
          {status === "taken" ? "This school email is already registered." : null}
          {status === "available" ? "This school email is available." : null}
        </p>
      </div>
    );
  },
);

EmailInput.displayName = "EmailInput";

export default EmailInput;
