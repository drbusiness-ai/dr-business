import * as React from "react";
import { cn } from "@/components/ui/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
