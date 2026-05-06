import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

interface AIInsightProps {
  content: string;
  className?: string;
}

export function AIInsight({ content, className }: AIInsightProps) {
  return (
    <Card
      className={cn(
        "p-5 border-violet-400/20 bg-gradient-to-br from-violet-400/10 to-sky-400/5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="grid size-8 place-items-center rounded-xl bg-violet-400/20 text-violet-300">
          <Sparkles size={15} />
        </div>
        <div>
          <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
            AI Insight
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
    </Card>
  );
}
