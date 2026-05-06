import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { AIInsight } from "@/components/ai-insight";
import { MilestoneCard } from "@/components/milestone-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  CheckSquare,
  Send,
  User,
  ArrowRight,
  CheckCircle2,
  Circle,
  Zap,
} from "lucide-react";
import { user, tasks, milestones } from "@/lib/mock-data";
import Link from "next/link";

const todaysTasks = tasks.slice(0, 3);

export default function DashboardPage() {
  return (
    <AppShell>
      {/* Header greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Good morning, {user.name} 👋
        </h1>
        <p className="text-slate-400">
          Day 12 of your 30-day plan. You&apos;re 42% there — keep executing.
        </p>
      </div>

      {/* XP / Streak Banner */}
      <div className="mb-8 rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-400/10 via-transparent to-violet-400/10 p-5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-orange-400/15 text-orange-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">🔥 {user.streak} days</p>
            <p className="text-xs text-slate-400">Current streak</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-sky-400/15 text-sky-300">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              Level {user.level} —{" "}
              <span className="text-sky-300">{user.xp} XP</span>
            </p>
            <p className="text-xs text-slate-400">Experience points</p>
          </div>
        </div>
        <div className="flex-1 min-w-48">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progress toward First Client</span>
            <span className="text-white font-semibold">
              {user.firstClientProgress}%
            </span>
          </div>
          <Progress value={user.firstClientProgress} className="h-2" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Focus */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Focus
              </h2>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all
                  <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <Card key={task.id} className="p-4 flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-sky-400" />
                    ) : (
                      <Circle size={20} className="text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-sm ${task.completed ? "line-through text-slate-500" : "text-white"}`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-500">{task.duration}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs flex-shrink-0 ${
                      task.priority === "High"
                        ? "bg-red-500/15 text-red-400"
                        : task.priority === "Medium"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-slate-500/15 text-slate-400"
                    }`}
                  >
                    {task.priority}
                  </span>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Win Card */}
          <Card className="p-6 border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 to-sky-400/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
                  Quick Win
                </p>
                <h3 className="text-white font-semibold text-lg mb-1">
                  Send your first Upwork proposal today
                </h3>
                <p className="text-sm text-slate-400">
                  Takes 20 minutes. Could change your entire trajectory.
                </p>
              </div>
              <Link href="/tasks" className="flex-shrink-0">
                <Button variant="outline" size="sm" className="gap-1 border-emerald-400/30">
                  Do This Now
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </Card>

          {/* AI Insight */}
          <AIInsight content="Based on your skill (Graphic Design), Upwork has 2,400+ active jobs this week. Your best window to apply is Tuesday–Thursday morning — competition is 34% lower than weekends." />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Stats */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Momentum Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Day Streak"
                value={`🔥 ${user.streak}`}
                icon={Flame}
              />
              <MetricCard
                label="Tasks Done"
                value={`${user.tasksCompleted}`}
                icon={CheckSquare}
              />
              <MetricCard
                label="Proposals"
                value={`${user.proposalsSent}`}
                icon={Send}
              />
              <MetricCard
                label="Profile"
                value={`${user.profileCompletion}%`}
                icon={User}
              />
            </div>
          </section>

          {/* Upcoming Milestone */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Next Milestone
            </h2>
            <MilestoneCard milestone={milestones[2]} index={2} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
