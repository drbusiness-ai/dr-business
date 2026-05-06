"use client";

import { Flame, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/components/ui/utils";

interface StreakCardProps {
  streak: number;
  xp: number;
  level: number;
  className?: string;
}

export function StreakCard({ streak, xp, level, className }: StreakCardProps) {
  return (
    <Card
      className={cn(
        "flex items-center gap-4 p-4 border-orange-400/20 bg-gradient-to-r from-orange-400/10 to-amber-400/5",
        className
      )}
    >
      <div className="grid size-12 place-items-center rounded-2xl bg-orange-400/15 text-orange-400">
        <Flame size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">
          {streak}{" "}
          <span className="text-sm font-normal text-slate-400">day streak</span>
        </p>
        <p className="text-xs text-slate-400">Keep going — don't break it</p>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <div className="flex items-center gap-1 text-sky-300">
          <Zap size={14} />
          <span className="text-sm font-semibold">{xp} XP</span>
        </div>
        <p className="text-xs text-slate-400">Level {level}</p>
      </div>
    </Card>
  );
}
