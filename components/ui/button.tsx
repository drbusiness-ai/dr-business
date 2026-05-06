import * as React from "react";
import { cn } from "@/components/ui/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-white text-slate-950 shadow-[0_16px_50px_rgba(255,255,255,0.16)] hover:bg-sky-100",
    secondary:
      "bg-sky-500 text-white shadow-[0_16px_50px_rgba(14,165,233,0.28)] hover:bg-sky-400",
    ghost: "bg-transparent text-slate-300 hover:bg-white/8 hover:text-white",
    outline:
      "border border-white/12 bg-white/[0.03] text-white hover:border-sky-300/50 hover:bg-sky-400/10",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    icon: "size-10 p-0",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300/50 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
