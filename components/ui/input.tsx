import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-brand-green/15 bg-white px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition focus-visible:border-brand-yellow",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
