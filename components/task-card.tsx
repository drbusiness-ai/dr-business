"use client";

import { useState } from "react";
import { Clock, Sparkles, CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { Task, Priority } from "@/lib/mock-data";

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  High: {
    label: "High",
    className: "bg-red-500/15 text-red-400 border border-red-400/20",
  },
  Medium: {
    label: "Medium",
    className:
      "bg-amber-500/15 text-amber-400 border border-amber-400/20",
  },
  Low: {
    label: "Low",
    className: "bg-slate-500/15 text-slate-400 border border-slate-400/20",
  },
};

export function TaskCard({ task, onToggle }: TaskCardProps) {
  const [completed, setCompleted] = useState(task.completed);

  const handleToggle = () => {
    setCompleted((v) => !v);
    onToggle?.(task.id);
  };

  const p = priorityConfig[task.priority];

  return (
    <Card
      className={cn(
        "p-5 transition-all duration-300",
        completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-sky-400 transition-colors"
          aria-label="Toggle task"
        >
          {completed ? (
            <CheckCircle2 size={22} className="text-sky-400" />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className={cn(
                "font-semibold text-white",
                completed && "line-through text-slate-500"
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
          <p className="text-sm text-slate-400 mb-3">{task.why}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} />
              {task.duration}
            </span>
            {!completed && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs px-3"
                  onClick={handleToggle}
                >
                  Start Task
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs px-3 border border-white/10"
                >
                  <Sparkles size={12} />
                  Ask AI
                </Button>
              </div>
            )}
            {completed && (
              <span className="text-xs text-sky-400 font-medium flex items-center gap-1">
                <CheckCircle2 size={12} />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
