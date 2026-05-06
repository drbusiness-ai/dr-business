import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { Tool } from "@/lib/mock-data";

interface ToolCardProps {
  tool: Tool;
}

const badgeConfig = {
  Free: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  "Free/Paid": "bg-sky-400/15 text-sky-400 border-sky-400/20",
  Paid: "bg-violet-400/15 text-violet-400 border-violet-400/20",
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="flex flex-col p-5 gap-4">
      <div className="flex items-start gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-white/5 text-2xl flex-shrink-0">
          {tool.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white">{tool.name}</h3>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs font-medium",
                badgeConfig[tool.badge]
              )}
            >
              {tool.badge}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{tool.description}</p>
        </div>
      </div>
      <a href={tool.url} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
        >
          Open Tool
          <ExternalLink size={13} />
        </Button>
      </a>
    </Card>
  );
}
