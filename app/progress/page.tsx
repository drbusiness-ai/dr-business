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
    <Card className="p-6 bg-white border-[#E8E4DC]">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-orange-500" />
        <h3 className="font-bold text-[#1C1917]">Activity — Last 30 Days</h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            title={day.date}
            className={`h-5 w-5 rounded-md ${
              day.active
                ? "bg-violet-500 shadow-sm"
                : "bg-[#F5F5F4] border border-[#E8E4DC]"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#78716C]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-[#F5F5F4] border border-[#E8E4DC]" />
          No activity
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-violet-500" />
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
    <Card className="p-6 bg-white border-[#E8E4DC]">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={18} className="text-amber-500" />
        <h3 className="font-bold text-[#1C1917]">XP Earned — Last 7 Days</h3>
      </div>
      <div className="flex items-end justify-between gap-2 h-28">
        {days.map((d, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-bold text-[#78716C]">{d.xp}</span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-amber-400 to-orange-400 transition-all"
              style={{ height: `${(d.xp / maxXP) * 80}px`, minHeight: "8px" }}
            />
            <span className="text-xs font-bold text-[#A8A29E]">{d.day}</span>
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
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell activePath="/progress">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1C1917] mb-2">My Progress</h1>
        <p className="text-[#78716C] font-medium">
          Every day you show up, you&apos;re compounding your way to your first client.
        </p>
      </div>

      {/* First client big bar */}
      <Card className="p-8 mb-8 border-violet-200 bg-gradient-to-br from-violet-50 to-amber-50 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-violet-600 mb-1">
              Overall Goal
            </p>
            <h2 className="text-2xl font-black text-[#1C1917]">
              First Client Progress
            </h2>
          </div>
          <span className="text-5xl font-black text-[#1C1917]">
            {user.firstClientProgress}%
          </span>
        </div>
        <div className="h-4 bg-white rounded-full border border-violet-100 overflow-hidden shadow-inner">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-violet-600" 
            style={{ width: `${user.firstClientProgress}%` }}
          />
        </div>
        <p className="mt-4 text-sm font-semibold text-[#78716C]">
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
          { label: "Tasks Completed", value: user.tasksCompleted, icon: CheckSquare, color: "text-violet-600", bg: "bg-violet-100" },
          { label: "Proposals Sent", value: user.proposalsSent, icon: Send, color: "text-sky-600", bg: "bg-sky-100" },
          { label: "Day Streak", value: `${user.currentStreak} 🔥`, icon: Flame, color: "text-orange-600", bg: "bg-orange-100" },
          { label: "Days Active", value: user.streakHistory?.length || 0, icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center bg-white border-[#E8E4DC] hover:border-violet-200 transition-colors">
            <div className={`grid size-12 place-items-center rounded-full mx-auto mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-black text-[#1C1917]">{stat.value}</p>
            <p className="text-xs font-bold text-[#78716C] mt-1 uppercase tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Milestones */}
        <section>
          <h2 className="text-xl font-black text-[#1C1917] mb-5">
            Roadmap Milestones
          </h2>
          <div className="space-y-4">
            {user.milestones && user.milestones.length > 0 ? user.milestones.map((m: any, i: number) => (
              <MilestoneCard key={m.id} milestone={m.milestone} index={i} />
            )) : (
              <div className="p-6 text-center bg-[#FAFAF7] border-2 border-dashed border-[#E8E4DC] rounded-2xl">
                <p className="text-[#1C1917] font-bold">No milestones unlocked yet.</p>
                <p className="text-sm text-[#78716C] mt-1">Keep working, they will appear here!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
