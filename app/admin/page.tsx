import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  Zap,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

// Simple admin guard — check email whitelist from env
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Check admin access
  const isAdmin =
    ADMIN_EMAILS.includes(session.user.email) ||
    session.user.email === "aqibmeraj@gmail.com"; // fallback for founder

  if (!isAdmin) redirect("/dashboard");

  // Fetch stats
  const [
    totalUsers,
    proUsers,
    usersActiveToday,
    totalTasksCompleted,
    totalProposals,
    totalLeads,
    wonLeads,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "PRO" } }),
    prisma.user.count({
      where: {
        lastActiveAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.task.count({ where: { status: "COMPLETED" } }),
    prisma.proposal.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { won: true } }),
    prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        skill: true,
        currentStreak: true,
        tasksCompleted: true,
        onboardingCompleted: true,
        quickWinCompleted: true,
        createdAt: true,
        lastActiveAt: true,
      },
    }),
  ]);

  const conversionRate =
    totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      color: "bg-violet-50 text-violet-600 border-violet-100",
    },
    {
      label: "Pro Users",
      value: `${proUsers} (${conversionRate}%)`,
      icon: Zap,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      label: "Active Today",
      value: usersActiveToday.toString(),
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Clients Won",
      value: `${wonLeads} / ${totalLeads}`,
      icon: DollarSign,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <header className="border-b border-[#E8E4DC] bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to App
            </Link>
            <div className="h-5 w-px bg-[#E8E4DC]" />
            <div>
              <h1 className="text-lg font-bold text-[#1C1917]">
                🛡️ Super Admin Dashboard
              </h1>
              <p className="text-xs text-[#78716C]">Dr. Business — Founder Control Panel</p>
            </div>
          </div>
          <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-3 py-1 rounded-full font-semibold">
            ADMIN ACCESS
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-[#E8E4DC] p-5 flex items-center gap-4"
            >
              <div className={`grid size-12 place-items-center rounded-2xl border ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-xs text-[#78716C] font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-[#1C1917] mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
            <p className="text-xs text-[#78716C] uppercase tracking-wide font-medium mb-1">
              Tasks Completed
            </p>
            <p className="text-3xl font-black text-[#1C1917]">{totalTasksCompleted}</p>
            <p className="text-xs text-emerald-600 mt-1">across all users</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
            <p className="text-xs text-[#78716C] uppercase tracking-wide font-medium mb-1">
              Proposals Generated
            </p>
            <p className="text-3xl font-black text-[#1C1917]">{totalProposals}</p>
            <p className="text-xs text-violet-600 mt-1">AI-written proposals</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5">
            <p className="text-xs text-[#78716C] uppercase tracking-wide font-medium mb-1">
              Conversion Rate
            </p>
            <p className="text-3xl font-black text-[#1C1917]">{conversionRate}%</p>
            <p className="text-xs text-amber-600 mt-1">Free → Pro</p>
          </div>
        </div>

        {/* Recent Users Table */}
        <div>
          <h2 className="text-base font-bold text-[#1C1917] mb-4">
            Recent Users ({totalUsers} total)
          </h2>
          <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E4DC] bg-[#FAFAF7]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      Skill
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      Plan
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      Streak
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      Tasks
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#78716C] uppercase tracking-wide">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DC]">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFAF7] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-[#1C1917]">{u.name || "—"}</p>
                          <p className="text-xs text-[#78716C]">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#78716C]">{u.skill || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.plan === "PRO"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-stone-100 text-stone-600 border border-stone-200"
                          }`}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#1C1917] font-semibold">
                        🔥 {u.currentStreak}
                      </td>
                      <td className="px-4 py-3 text-[#1C1917]">{u.tasksCompleted}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {u.onboardingCompleted && (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                              <CheckCircle2 size={9} /> Onboarded
                            </span>
                          )}
                          {u.quickWinCompleted && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                              ⚡ Quick Win
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#78716C]">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-[#78716C]">
                        No users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
