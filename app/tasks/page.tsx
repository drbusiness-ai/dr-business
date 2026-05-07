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
        <h1 className="text-3xl font-black text-[#1C1917] mb-2">Daily Tasks</h1>
        <p className="text-[#78716C] font-medium">
          Your mission control for today. Execute these and you&apos;re 1 step closer.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Progress overview */}
          <div className="mb-8 grid sm:grid-cols-3 gap-4">
            <Card className="p-5 text-center border-violet-200 bg-violet-50">
              <p className="text-3xl font-black text-violet-700">
                {completed}/{total}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600/70 mt-1">Tasks completed today</p>
            </Card>
            <Card className="p-5 text-center bg-white">
              <p className="text-3xl font-black text-[#1C1917]">{progress}%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A8A29E] mt-1">Daily completion rate</p>
            </Card>
            <Card className="p-5 text-center border-amber-200 bg-amber-50">
              <p className="text-3xl font-black text-amber-600">
                {tasks.filter((t) => t.priority === "HIGH" && t.status !== "COMPLETED").length}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700/70 mt-1">High-priority remaining</p>
            </Card>
          </div>

          {/* Task list */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-[#E8E4DC] rounded-2xl bg-[#FAFAF7]">
                <p className="text-[#1C1917] font-bold mb-2">Generating today's tasks...</p>
                <p className="text-sm text-[#78716C]">Refresh the page in a few seconds.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={handleToggle} />
              ))
            )}
          </div>

          {/* Completion state */}
          {total > 0 && completed === total && (
            <Card className="mt-8 p-10 text-center border-emerald-200 bg-emerald-50 shadow-md">
              <div className="grid size-16 place-items-center rounded-full bg-emerald-100 mx-auto mb-4 text-emerald-600 shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-[#1C1917] mb-2">
                All tasks complete! 🎉
              </h2>
              <p className="text-[#78716C] font-medium max-w-sm mx-auto">
                You&apos;re on a roll. Your streak just grew. Come back tomorrow for new tasks.
              </p>
            </Card>
          )}

          {/* No tasks remaining partial view */}
          {completed > 0 && completed < total && (
            <Card className="mt-6 p-5 border-violet-200 bg-violet-50 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-white text-violet-500 shadow-sm flex-shrink-0">
                <Target size={24} />
              </div>
              <div>
                <p className="text-violet-900 font-bold text-base">
                  {total - completed} task{total - completed > 1 ? "s" : ""} remaining
                </p>
                <p className="text-sm text-violet-700">
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
