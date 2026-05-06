import { CheckCircle2, Lock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";
import { Progress } from "@/components/ui/progress";
import type { Milestone } from "@/lib/mock-data";

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    iconClass: "text-emerald-400",
    bgClass: "bg-emerald-400/15 border-emerald-400/20",
    label: "Complete",
  },
  active: {
    icon: Loader2,
    iconClass: "text-sky-400 animate-spin",
    bgClass: "bg-sky-400/15 border-sky-400/20",
    label: "In Progress",
  },
  locked: {
    icon: Lock,
    iconClass: "text-slate-500",
    bgClass: "bg-slate-500/10 border-slate-500/15",
    label: "Locked",
  },
};

export function MilestoneCard({ milestone, index }: MilestoneCardProps) {
  const config = statusConfig[milestone.status];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "grid size-10 place-items-center rounded-full border",
            config.bgClass
          )}
        >
          <Icon size={18} className={config.iconClass} />
        </div>
        {index < 4 && (
          <div
            className={cn(
              "w-0.5 h-8 mt-1",
              milestone.status === "completed"
                ? "bg-emerald-400/40"
                : "bg-white/10"
            )}
          />
        )}
      </div>
      <Card
        className={cn(
          "flex-1 p-4 mb-2",
          milestone.status === "locked" && "opacity-50"
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">{milestone.title}</h3>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              milestone.status === "completed" &&
                "bg-emerald-400/15 text-emerald-400",
              milestone.status === "active" && "bg-sky-400/15 text-sky-400",
              milestone.status === "locked" && "bg-slate-700 text-slate-500"
            )}
          >
            {config.label}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-2">{milestone.description}</p>
        {milestone.status === "active" &&
          milestone.progress !== undefined &&
          milestone.total !== undefined && (
            <div>
              <Progress
                value={(milestone.progress / milestone.total) * 100}
                className="h-1.5"
              />
              <p className="mt-1 text-xs text-slate-500">
                {milestone.progress}/{milestone.total} completed
              </p>
            </div>
          )}
      </Card>
    </div>
  );
}
