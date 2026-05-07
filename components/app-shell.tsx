"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Flame,
  Menu,
  Sparkles,
  LayoutDashboard,
  CheckSquare,
  Settings,
  MessageSquare,
  FileText,
  Calculator,
  Kanban,
  TrendingUp,
  X,
  Archive,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Daily Tasks", href: "/tasks", icon: CheckSquare },
  { label: "AI Coach", href: "/coach", icon: MessageSquare },
  { label: "Proposals", href: "/proposals", icon: FileText },
  { label: "Rate Calculator", href: "/rate-calculator", icon: Calculator },
  { label: "My CRM", href: "/crm", icon: Kanban },
  { label: "My Progress", href: "/progress", icon: TrendingUp },
  { label: "Tool Vault", href: "/vault", icon: Archive },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({
  children,
  activePath,
}: {
  children: React.ReactNode;
  activePath?: string;
}) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState<{
    name?: string;
    currentStreak?: number;
    firstClientProgress?: number;
  }>({
    name: "User",
    currentStreak: 0,
    firstClientProgress: 0,
  });

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUser(data);
      })
      .catch(() => {});
  }, []);

  const SidebarContent = () => (
    <>
      <Link
        href="/"
        className="flex items-center gap-3 px-2 mb-6"
        onClick={() => setMobileOpen(false)}
      >
        <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-amber-400 text-white flex-shrink-0 shadow-md">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="font-bold text-[#1C1917] text-[15px]">Dr. Business</p>
          <p className="text-xs text-[#78716C]">Freelancer Launch OS</p>
        </div>
      </Link>

      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => {
          const active = currentPath === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "text-[#78716C] hover:bg-[#F5F5F4] hover:text-[#1C1917]"
              )}
            >
              <item.icon
                size={16}
                className={active ? "text-violet-600" : "text-[#A8A29E]"}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Streak card at bottom */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 mt-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1917] mb-1">
          <Flame size={15} className="text-orange-500" />
          <span>{user.currentStreak ?? 0}-day streak 🔥</span>
        </div>
        <p className="text-xs text-[#78716C] mb-3">Keep the momentum going!</p>
        <div className="h-1.5 rounded-full bg-[#E8E4DC] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${user.firstClientProgress ?? 0}%`,
              background: "linear-gradient(90deg, #F59E0B, #7C3AED)",
            }}
          />
        </div>
        <p className="mt-2 text-xs text-[#78716C]">
          {user.firstClientProgress ?? 0}% toward first client
        </p>
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#E8E4DC] bg-white px-4 py-5 lg:flex overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-[#E8E4DC] bg-white px-4 py-5 overflow-y-auto">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#78716C] hover:bg-[#F5F5F4]"
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main section */}
      <section className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#E8E4DC] bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-xl text-[#78716C] hover:bg-[#F5F5F4] lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="text-sm text-[#78716C]">
                  Welcome back, {user.name || "Friend"} 👋
                </p>
                <p className="text-base font-semibold text-[#1C1917] hidden sm:block">
                  Build. Execute. Win. 🚀
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-[#78716C] hover:bg-[#F5F5F4] transition-colors">
                <Bell size={18} />
              </button>
              <Link
                href="/settings"
                className="flex items-center justify-center size-8 rounded-full bg-violet-100 text-violet-700 text-sm font-bold border border-violet-200"
              >
                {(user.name || "U")[0].toUpperCase()}
              </Link>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </div>
      </section>
    </main>
  );
}
