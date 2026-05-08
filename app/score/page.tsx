"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Loader2, Trophy, Share2, CheckSquare, Flame, Send, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScoreData = {
  score: number;
  level: string;
  breakdown: {
    tasks: number;
    streak: number;
    proposals: number;
    quickWin: number;
  };
  maxScore: number;
  percentile: number;
};

export default function ScorePage() {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/score")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleShare = () => {
    if (!data) return;
    const text = `My Dr. Business Score: ${data.score} ⚡\nI reached the ${data.level} Level on my freelance journey.\nBuilding in public. 🔥\nJoin me: drbusiness.online`;
    navigator.clipboard.writeText(text);
    alert("Score text copied to clipboard! Share it on LinkedIn or Twitter.");
  };

  if (loading) {
    return (
      <AppShell activePath="/score">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!data) return null;

  return (
    <AppShell activePath="/score">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#1C1917] mb-2">Dr. Business Score</h1>
          <p className="text-[#78716C]">Your freelance identity, quantified.</p>
        </div>

        {/* Big Score Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-xl shadow-violet-200 border-none overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-white/20 backdrop-blur-md mb-4 shadow-inner border border-white/30">
              <Trophy size={32} className="text-amber-300 drop-shadow-md" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-200 mb-1">
              Current Level
            </p>
            <h2 className="text-3xl font-black mb-6">{data.level}</h2>

            <div className="text-[5rem] leading-none font-black tracking-tighter drop-shadow-lg mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-violet-200">
              {data.score}
            </div>

            <p className="text-violet-200 font-medium max-w-sm mx-auto mb-8">
              You are in the top {data.percentile}% of all Dr. Business users.
            </p>

            <Button
              onClick={handleShare}
              className="bg-white text-violet-800 hover:bg-violet-50 font-bold px-8 py-6 h-auto text-base shadow-lg hover:shadow-xl transition-all"
            >
              <Share2 className="mr-2" size={18} />
              Share My Score
            </Button>
          </div>
        </Card>

        {/* Breakdown */}
        <h3 className="text-xl font-bold text-[#1C1917] mb-4">Score Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <ScoreBreakdownCard
            title="Daily Tasks"
            icon={CheckSquare}
            value={data.breakdown.tasks}
            color="text-emerald-500"
            bg="bg-emerald-100"
            max={300}
          />
          <ScoreBreakdownCard
            title="Consistency Streak"
            icon={Flame}
            value={data.breakdown.streak}
            color="text-orange-500"
            bg="bg-orange-100"
            max={200}
          />
          <ScoreBreakdownCard
            title="Proposals Sent"
            icon={Send}
            value={data.breakdown.proposals}
            color="text-sky-500"
            bg="bg-sky-100"
            max={160}
          />
          <ScoreBreakdownCard
            title="Quick Win Engine"
            icon={Zap}
            value={data.breakdown.quickWin}
            color="text-amber-500"
            bg="bg-amber-100"
            max={100}
          />
        </div>
      </div>
    </AppShell>
  );
}

function ScoreBreakdownCard({ title, icon: Icon, value, color, bg, max }: any) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <Card className="p-5 border-[#E8E4DC]">
      <div className="flex items-center gap-3 mb-4">
        <div className={`grid size-10 place-items-center rounded-lg ${bg} ${color}`}>
          <Icon size={18} />
        </div>
        <div>
          <h4 className="font-bold text-[#1C1917]">{title}</h4>
          <p className="text-xs text-[#78716C]">Max {max} pts</p>
        </div>
        <div className="ml-auto text-xl font-black text-[#1C1917]">
          {value}
        </div>
      </div>
      <div className="h-2 w-full bg-[#FAFAF7] rounded-full overflow-hidden border border-[#E8E4DC]">
        <div
          className={`h-full ${bg.replace('100', '500')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}
