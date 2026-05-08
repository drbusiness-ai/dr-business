import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { AIInsight } from "@/components/ai-insight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Flame,
  CheckSquare,
  Send,
  User,
  ArrowRight,
  CheckCircle2,
  Circle,
  Zap,
  Trophy,
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

  // Update lastActiveAt
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActiveAt: new Date() },
  });

  const todaysTasks = user.tasks.slice(0, 3);
  const aiInsightText = await generateAIInsight({
    skill: user.skill || "freelancing",
    platforms: user.platforms,
    currentDay: user.currentDay,
    firstClientProgress: user.firstClientProgress,
  });

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <AppShell activePath="/dashboard">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1C1917] mb-0.5">
          {greeting}, {user.name || "Friend"} 👋
        </h1>
        <p className="text-[#78716C] text-sm">
          Day {user.currentDay} of your 30-day plan — {user.firstClientProgress}% toward your first client.
        </p>
      </div>

      {/* Quick Win Banner */}
      {!user.quickWinCompleted && (
        <div className="mb-6">
          <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-amber-400/20 text-amber-500">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-amber-700 font-bold text-sm">⚡ Complete your Quick Win</h3>
                <p className="text-xs text-amber-600">Takes 15 minutes. Start your momentum now.</p>
              </div>
            </div>
            <Link href="/quickwin" className="flex-shrink-0">
              <Button className="bg-amber-500 hover:bg-amber-400 text-white font-bold gap-2 shadow-md shadow-amber-200 text-sm">
                Do It Now <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Streak + XP bar */}
      <div className="mb-6 rounded-2xl border border-[#E8E4DC] bg-white p-5 flex flex-wrap items-center gap-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-500">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1C1917]">🔥 {user.currentStreak} days</p>
            <p className="text-xs text-[#78716C]">Current streak</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1C1917]">
              Level {user.level} —{" "}
              <span className="text-violet-600">{user.xpTotal} XP</span>
            </p>
            <p className="text-xs text-[#78716C]">Experience points</p>
          </div>
        </div>
        <div className="flex-1 min-w-48">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#78716C]">Progress toward First Client</span>
            <span className="text-[#1C1917] font-bold">{user.firstClientProgress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#E8E4DC] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${user.firstClientProgress}%`,
                background: "linear-gradient(90deg, #F59E0B, #7C3AED)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's tasks */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#1C1917]">
                Today&apos;s Focus
              </h2>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50">
                  View all <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {todaysTasks.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-[#E8E4DC] p-6 text-center">
                  <p className="text-[#78716C] text-sm mb-2">No tasks yet for today.</p>
                  <Link href="/tasks">
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white text-xs">
                      Generate Tasks
                    </Button>
                  </Link>
                </div>
              ) : (
                todaysTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`p-4 flex items-center gap-4 border transition-all ${
                      task.status === "COMPLETED"
                        ? "border-emerald-200 bg-emerald-50/50 opacity-80"
                        : "border-[#E8E4DC] hover:border-violet-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {task.status === "COMPLETED" ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : (
                        <Circle size={20} className="text-[#A8A29E]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm ${
                          task.status === "COMPLETED"
                            ? "line-through text-[#A8A29E]"
                            : "text-[#1C1917]"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-[#78716C]">{task.estimatedMinutes} min</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs flex-shrink-0 font-medium ${
                        task.priority === "HIGH"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : task.priority === "MEDIUM"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
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

        {/* Momentum stats */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#1C1917]">Momentum Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Day Streak"
              value={`🔥 ${user.currentStreak}`}
              icon={Flame}
              href="/progress"
            />
            <MetricCard
              label="Tasks Done"
              value={`${user.tasksCompleted}`}
              icon={CheckSquare}
              href="/tasks"
            />
            <MetricCard
              label="Proposals"
              value={`${user.proposalsSent}`}
              icon={Send}
              href="/proposals"
            />
            <MetricCard
              label="Profile"
              value={`${user.profileCompletion}%`}
              icon={User}
              href="/settings"
            />
          </div>

          {/* Dr. Business Score */}
          <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-violet-600" />
              <h3 className="text-sm font-bold text-violet-700">Dr. Business Score</h3>
            </div>
            <p className="text-3xl font-black text-[#1C1917]">{user.drBusinessScore}</p>
            <p className="text-xs text-violet-600 font-semibold mt-0.5">{user.scoreLevel}</p>
            <Link href="/progress">
              <button className="mt-3 text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
                View full breakdown <ArrowRight size={12} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
