import { cn } from "@/components/ui/utils";

export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/8", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-sky-300 via-blue-500 to-violet-500 transition-all duration-700",
          indicatorClassName
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
