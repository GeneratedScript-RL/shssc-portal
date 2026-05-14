import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-2xl border border-brand-green/15 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition focus-visible:border-brand-yellow",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
