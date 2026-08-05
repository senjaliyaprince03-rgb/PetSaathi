import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold tracking-[-0.01em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper shadow-lifted hover:-translate-y-0.5 hover:bg-indigo hover:shadow-soft",
      accent: "bg-[#b64f38] text-white shadow-lifted hover:-translate-y-0.5 hover:bg-[#9f3f2c] hover:shadow-soft",
        outline: "border border-ink/15 bg-paper/70 text-ink backdrop-blur hover:-translate-y-0.5 hover:border-indigo/30 hover:bg-paper",
        ghost: "text-ink hover:bg-ink/5"
      },
      size: {
        default: "min-h-12 px-6",
        lg: "min-h-14 px-8 text-base",
        sm: "min-h-10 px-4 text-xs"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
