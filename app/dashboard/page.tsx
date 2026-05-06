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
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { generateAIInsight } from "@/lib/ai-engine";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tasks: {
        where: {
          date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        orderBy: { priority: "asc" },
      },
    },
  });

  if (!user) redirect("/login");

  const todaysTasks = user.tasks.slice(0, 3);
  const aiInsightText = await generateAIInsight({
    skill: user.skill || "freelancing",
    platforms: user.platforms,
    currentDay: user.currentDay,
    firstClientProgress: user.firstClientProgress,
  });

  return (
    <AppShell activePath="/dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Good morning, {user.name || "Friend"} 👋
        </h1>
        <p className="text-slate-400">
          Day {user.currentDay} of your 30-day plan. You&apos;re {user.firstClientProgress}% there — keep executing.
        </p>
      </div>
      {!user.quickWinCompleted && (
        <div className="mb-8">
          <Card className="p-4 border-amber-400/30 bg-gradient-to-r from-amber-400/10 to-amber-600/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-amber-400/20 text-amber-400">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-amber-400 font-bold">Complete your Quick Win 🎯</h3>
                <p className="text-sm text-slate-300">Takes 15 minutes. Start building real momentum right now.</p>
              </div>
            </div>
            <Link href="/quickwin" className="flex-shrink-0">
              <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-2">
                Do It Now <ArrowRight size={16} />
              </Button>
            </Link>
          </Card>
        </div>
      )}
      <div className="mb-8 rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-400/10 via-transparent to-violet-400/10 p-5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-orange-400/15 text-orange-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">🔥 {user.currentStreak} days</p>
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
              <span className="text-sky-300">{user.xpTotal} XP</span>
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
        <div className="lg:col-span-2 space-y-8">
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
              {todaysTasks.length === 0 ? (
                <div className="text-slate-400 text-sm py-4">No tasks found for today. Check your Tasks page to generate them!</div>
              ) : (
                todaysTasks.map((task) => (
                  <Card key={task.id} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {task.status === "COMPLETED" ? (
                        <CheckCircle2 size={20} className="text-sky-400" />
                      ) : (
                        <Circle size={20} className="text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm ${task.status === "COMPLETED" ? "line-through text-slate-500" : "text-white"}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">{task.estimatedMinutes} min</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs flex-shrink-0 ${
                        task.priority === "HIGH"
                          ? "bg-red-500/15 text-red-400"
                          : task.priority === "MEDIUM"
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-slate-500/15 text-slate-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </Card>
                ))
              )}
            </div>
          </section>

          <AIInsight content={aiInsightText} />
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              Momentum Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Day Streak"
                value={`🔥 ${user.currentStreak}`}
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
        </div>
      </div>
    </AppShell>
  );
}
