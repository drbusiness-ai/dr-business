"use client";

import { useState } from "react";
import { Clock, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

interface TaskProps {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  estimatedMinutes: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
}

interface TaskCardProps {
  task: TaskProps;
  onToggle?: (id: string, newStatus: string) => void;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH: {
    label: "High",
    className: "bg-red-50 text-red-600 border border-red-200",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  LOW: {
    label: "Low",
    className: "bg-stone-100 text-stone-600 border border-stone-200",
  },
};

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const [completed, setCompleted] = useState(task.status === "COMPLETED");
  const [expanded, setExpanded] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1200);
    }
    const newStatus = completed ? "PENDING" : "COMPLETED";
    setCompleted(!completed);
    onToggle?.(task.id, newStatus);
  };

  const p = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  return (
    <div
      className={cn(
        "relative p-5 rounded-2xl border bg-white transition-all duration-300 hover:shadow-md",
        completed
          ? "border-emerald-200 bg-emerald-50/30 opacity-80"
          : "border-[#E8E4DC] hover:border-violet-200"
      )}
    >
      {/* XP Float animation */}
      {showXP && (
        <div className="absolute top-2 right-4 text-violet-600 font-bold text-sm xp-float pointer-events-none z-10">
          +15 XP ⚡
        </div>
      )}

      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className="mt-0.5 flex-shrink-0 text-[#A8A29E] hover:text-violet-600 transition-colors"
          aria-label="Toggle task"
        >
          {completed ? (
            <CheckCircle2 size={22} className="text-emerald-500" />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "font-semibold text-[#1C1917] cursor-pointer hover:text-violet-700 transition-colors",
                completed && "line-through text-[#A8A29E]"
              )}
            >
              {task.title}
            </h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                p.className
              )}
            >
              {p.label}
            </span>
          </div>

          {expanded && (
            <div className="mt-2 mb-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-sm text-[#78716C]">{task.description}</p>
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
                <span className="text-amber-500 text-base">💡</span>
                <p className="text-xs text-amber-800 italic">Why this matters: {task.whyItMatters}</p>
              </div>
            </div>
          )}

          {!expanded && (
            <p className="text-sm text-[#78716C] mb-1 line-clamp-1">{task.description}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap mt-2">
            <span className="flex items-center gap-1 text-xs text-[#A8A29E]">
              <Clock size={12} />
              {task.estimatedMinutes} min
            </span>
            {!completed && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                  onClick={handleToggle}
                >
                  ✓ Complete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-3 border border-[#E8E4DC] text-[#78716C] hover:bg-violet-50 hover:text-violet-700 rounded-lg"
                >
                  <Sparkles size={11} className="mr-1" />
                  AI Tip
                </Button>
              </div>
            )}
            {completed && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} />
                Completed ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
