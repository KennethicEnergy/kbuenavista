import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer",
        variant === "primary" &&
          "bg-brand text-bg-base hover:bg-brand/90",
        variant === "ghost" &&
          "bg-transparent text-text-primary hover:bg-bg-elevated",
        variant === "outline" &&
          "border border-brand/40 bg-transparent text-brand hover:bg-brand/10",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
