"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { TaskCard } from "@/components/task-card";
import { Card } from "@/components/ui/card";
import { tasks as initialTasks } from "@/lib/mock-data";
import type { Task } from "@/lib/mock-data";
import { CheckCircle2, Target } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Daily Tasks</h1>
        <p className="text-slate-400">
          Your mission control for today. Execute these and you&apos;re 1 step closer.
        </p>
      </div>

      {/* Progress overview */}
      <div className="mb-8 grid sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center border-sky-400/20 bg-sky-400/5">
          <p className="text-3xl font-bold text-white">
            {completed}/{total}
          </p>
          <p className="text-xs text-slate-400 mt-1">Tasks completed today</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-white">{progress}%</p>
          <p className="text-xs text-slate-400 mt-1">Daily completion rate</p>
        </Card>
        <Card className="p-4 text-center border-emerald-400/20 bg-emerald-400/5">
          <p className="text-3xl font-bold text-emerald-400">
            {tasks.filter((t) => t.priority === "High" && !t.completed).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">High-priority remaining</p>
        </Card>
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>

      {/* Completion state */}
      {completed === total && (
        <Card className="mt-8 p-8 text-center border-emerald-400/30 bg-emerald-400/10">
          <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            All tasks complete! 🎉
          </h2>
          <p className="text-slate-400">
            You&apos;re on a roll. Your streak just grew. Come back tomorrow for new tasks.
          </p>
        </Card>
      )}

      {/* No tasks remaining partial view */}
      {completed > 0 && completed < total && (
        <Card className="mt-6 p-5 border-sky-400/20 bg-sky-400/5 flex items-center gap-4">
          <Target size={24} className="text-sky-400 flex-shrink-0" />
          <div>
            <p className="text-white font-medium text-sm">
              {total - completed} task{total - completed > 1 ? "s" : ""} remaining
            </p>
            <p className="text-xs text-slate-400">
              Complete your high-priority tasks first for maximum impact.
            </p>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
