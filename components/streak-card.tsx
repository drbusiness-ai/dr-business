"use client";

import { Flame, Zap } from "lucide-react";

interface StreakCardProps {
  streak: number;
  xp: number;
  level: number;
  className?: string;
}

export function StreakCard({ streak, xp, level, className }: StreakCardProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 ${className ?? ""}`}
    >
      <div className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-500">
        <Flame size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1C1917]">
          {streak}{" "}
          <span className="text-sm font-normal text-[#78716C]">day streak</span>
        </p>
        <p className="text-xs text-[#78716C]">Keep going — don&apos;t break it 🔥</p>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <div className="flex items-center gap-1 text-violet-600">
          <Zap size={14} />
          <span className="text-sm font-semibold">{xp} XP</span>
        </div>
        <p className="text-xs text-[#78716C]">Level {level}</p>
      </div>
    </div>
  );
}
