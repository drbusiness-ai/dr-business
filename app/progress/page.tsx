"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MilestoneCard } from "@/components/milestone-card";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, CheckSquare, Send, Calendar, Zap, Loader2 } from "lucide-react";

// ─── Streak Heatmap ─────────────────────────────────────────────────────────
function StreakHeatmap({ streakData }: { streakData: any[] }) {
  // Generate last 30 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const active = streakData.some(sd => new Date(sd.date).getTime() === d.getTime() && sd.active);
    return { date: d.toISOString().split('T')[0], active };
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-orange-400" />
        <h3 className="font-semibold text-white">Activity — Last 30 Days</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            title={day.date}
            className={`h-5 w-5 rounded-md ${
              day.active
                ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                : "bg-white/5"
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-white/5" />
          No activity
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-sky-400" />
          Active
        </span>
      </div>
    </Card>
  );
}

// ─── XP Bar Chart ────────────────────────────────────────────────────────────
function XPChart({ streakData }: { streakData: any[] }) {
  // Generate last 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const historyItem = streakData.find(sd => new Date(sd.date).getTime() === d.getTime());
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      xp: historyItem ? historyItem.xpEarned : 0
    };
  });

  const maxXP = Math.max(100, ...days.map((d) => d.xp));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <Zap size={18} className="text-sky-400" />
        <h3 className="font-semibold text-white">XP Earned — Last 7 Days</h3>
      </div>
      <div className="flex items-end justify-between gap-2 h-28">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-slate-500">{d.xp}</span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-sky-600 to-sky-400 transition-all"
              style={{ height: `${(d.xp / maxXP) * 80}px`, minHeight: "4px" }}
            />
            <span className="text-xs text-slate-500">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell activePath="/progress">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell activePath="/progress">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Progress</h1>
        <p className="text-slate-400">
          Every day you show up, you&apos;re compounding your way to your first client.
        </p>
      </div>

      {/* First client big bar */}
      <Card className="p-6 mb-8 border-sky-400/20 bg-gradient-to-r from-sky-400/10 to-violet-400/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">
              Overall Goal
            </p>
            <h2 className="text-xl font-bold text-white">
              First Client Progress
            </h2>
          </div>
          <span className="text-4xl font-black text-white">
            {user.firstClientProgress}%
          </span>
        </div>
        <Progress value={user.firstClientProgress} className="h-3" />
        <p className="mt-3 text-sm text-slate-400">
          Keep executing daily tasks to reach 100% and land your first paying client.
        </p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <StreakHeatmap streakData={user.streakHistory || []} />
        <XPChart streakData={user.streakHistory || []} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tasks Completed", value: user.tasksCompleted, icon: CheckSquare, color: "text-sky-400" },
          { label: "Proposals Sent", value: user.proposalsSent, icon: Send, color: "text-violet-400" },
          { label: "Day Streak", value: `${user.currentStreak} 🔥`, icon: Flame, color: "text-orange-400" },
          { label: "Days Active", value: user.streakHistory?.length || 0, icon: Calendar, color: "text-emerald-400" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 text-center">
            <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Milestones */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-5">
            Roadmap Milestones
          </h2>
          {user.milestones && user.milestones.length > 0 ? user.milestones.map((m: any, i: number) => (
            <MilestoneCard key={m.id} milestone={m.milestone} index={i} />
          )) : (
            <div className="text-slate-400 text-sm">No milestones unlocked yet. Keep working!</div>
          )}
        </section>

      </div>
    </AppShell>
  );
}
