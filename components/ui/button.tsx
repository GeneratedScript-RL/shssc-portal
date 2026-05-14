import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "touch-target inline-flex items-center justify-center rounded-full text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-green px-5 py-2.5 text-white hover:bg-brand-green/90",
        secondary: "bg-brand-yellow px-5 py-2.5 text-brand-green hover:bg-brand-yellow/90",
        outline:
          "border border-brand-green/30 bg-white px-5 py-2.5 text-brand-green hover:bg-brand-green/5",
        ghost: "px-4 py-2.5 text-brand-green hover:bg-brand-green/10",
        destructive: "bg-red-600 px-5 py-2.5 text-white hover:bg-red-500",
      },
      size: {
        default: "h-11",
        sm: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
