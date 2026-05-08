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
      "bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-200 focus:ring-violet-300",
    secondary:
      "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-200 focus:ring-amber-300",
    ghost:
      "bg-transparent text-[#78716C] hover:bg-[#F5F5F4] hover:text-[#1C1917] focus:ring-stone-200",
    outline:
      "border border-[#E8E4DC] bg-white text-[#1C1917] hover:border-violet-300 hover:bg-violet-50 focus:ring-violet-200",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    icon: "size-9 p-0",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
