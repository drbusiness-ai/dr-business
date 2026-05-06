"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Command, Flame, Menu, Sparkles, LayoutDashboard, CheckSquare, Target, Settings, MessageSquare, FileText } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Daily Tasks", href: "/tasks", icon: CheckSquare },
  { label: "Proposals", href: "/proposals", icon: FileText },
  { label: "AI Coach", href: "/coach", icon: MessageSquare },
  { label: "Progress", href: "/progress", icon: Target },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({ children, activePath }: { children: React.ReactNode; activePath?: string }) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;
  
  const [user, setUser] = useState<any>({
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

  return (
    <main className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950/65 px-4 py-5 backdrop-blur-2xl lg:block">
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-300 to-violet-500 text-slate-950">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-semibold text-white">Dr. Business</p>
            <p className="text-xs text-slate-400">Freelancer Launch OS</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = currentPath === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                  active
                    ? "bg-white text-slate-950"
                    : "text-slate-400 hover:bg-white/7 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Flame size={17} className="text-sky-300" />
            {user.currentStreak}-day execution streak
          </div>
          <Progress value={user.firstClientProgress} className="mt-4 h-1.5" />
          <p className="mt-3 text-xs leading-5 text-slate-400">
            {user.firstClientProgress}% toward first freelance client.
          </p>
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/55 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={19} />
              </Button>
              <div>
                <p className="text-sm text-slate-400">Welcome back, {user.name || "Friend"}</p>
                <h1 className="text-lg font-semibold text-white sm:text-xl">
                  Today is for proof, outreach, and one clean win.
                </h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="outline" size="sm">
                <Command size={15} />
                Quick action
              </Button>
              <Button variant="ghost" size="icon">
                <Bell size={18} />
              </Button>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </section>
    </main>
  );
}
