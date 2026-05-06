"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Bot,
  Archive,
  TrendingUp,
  Sparkles,
  Flame,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Progress } from "@/components/ui/progress";
import { user } from "@/lib/data";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Daily Tasks", href: "/tasks", icon: CheckSquare },
  { label: "AI Coach", href: "/coach", icon: Bot },
  { label: "Tool Vault", href: "/vault", icon: Archive },
  { label: "My Progress", href: "/progress", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 bg-slate-950/70 px-4 py-5 backdrop-blur-2xl lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2 mb-8">
        <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-300 to-violet-500 text-slate-950 flex-shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="font-semibold text-white">Dr. Business</p>
          <p className="text-xs text-slate-400">Freelancer Launch OS</p>
        </div>
      </Link>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-white border border-sky-400/20"
                  : "text-slate-400 hover:bg-white/7 hover:text-white"
              )}
            >
              <item.icon
                size={18}
                className={active ? "text-sky-300" : ""}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-400/10 to-violet-400/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white mb-1">
          <Flame size={17} className="text-orange-400" />
          <span>{user.streak}-day streak</span>
        </div>
        <p className="text-xs text-slate-400 mb-3">Keep the momentum going!</p>
        <Progress value={user.firstClientProgress} className="h-1.5" />
        <p className="mt-2 text-xs text-slate-400">
          {user.firstClientProgress}% toward first client
        </p>
      </div>
    </aside>
  );
}
