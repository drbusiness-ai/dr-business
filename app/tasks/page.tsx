"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { TaskCard } from "@/components/task-card";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Target, Loader2 } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string, status: string) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <AppShell activePath="/tasks">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Daily Tasks</h1>
        <p className="text-slate-400">
          Your mission control for today. Execute these and you&apos;re 1 step closer.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      ) : (
        <>
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
                {tasks.filter((t) => t.priority === "HIGH" && t.status !== "COMPLETED").length}
              </p>
              <p className="text-xs text-slate-400 mt-1">High-priority remaining</p>
            </Card>
          </div>

          {/* Task list */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-10 border border-white/10 rounded-xl bg-[#111118]">
                <p className="text-slate-400 mb-2">Generating today's tasks...</p>
                <p className="text-xs text-slate-500">Refresh the page in a few seconds.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={handleToggle} />
              ))
            )}
          </div>

          {/* Completion state */}
          {total > 0 && completed === total && (
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
        </>
      )}
    </AppShell>
  );
}
