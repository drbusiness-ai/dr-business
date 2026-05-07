import * as React from "react";
import { cn } from "@/components/ui/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8E4DC] bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}
