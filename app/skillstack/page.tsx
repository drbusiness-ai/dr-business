"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpRight, TrendingUp, Sparkles, BookOpen, Clock } from "lucide-react";

type StackRecommendation = {
  skill: string;
  whyItPairs: string;
  incomeBoost: string;
  timeToLearn: string;
  freeResource: { name: string; url: string };
  paidResource: { name: string; url: string };
};

export default function SkillStackPage() {
  const [stacks, setStacks] = useState<StackRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [primarySkill, setPrimarySkill] = useState("Your Primary Skill");

  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(user => {
        if (user && user.skill) setPrimarySkill(user.skill);
      })
      .catch(() => {});

    fetch("/api/skillstack", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.stacks) setStacks(data.stacks);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppShell activePath="/skillstack">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1C1917] mb-2">Skill Stacking Roadmap</h1>
        <p className="text-[#78716C] text-sm">
          Multiply your value. Combine your primary skill with these to 3x your rates.
        </p>
      </div>

      <div className="relative mb-12">
        {/* Core Skill Node */}
        <div className="flex justify-center mb-8 relative z-10">
          <Card className="p-4 px-8 border-violet-200 bg-violet-50 shadow-md text-center inline-block">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-1">
              Core Foundation
            </p>
            <h2 className="text-xl font-black text-[#1C1917]">{primarySkill}</h2>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            <p className="ml-3 text-sm text-[#78716C] font-medium">Analyzing market trends...</p>
          </div>
        ) : stacks.length === 0 ? (
          <div className="text-center py-10 text-[#78716C]">
            Failed to generate stack. Please try again later.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {stacks.map((stack, i) => (
              <Card key={i} className="p-6 border-[#E8E4DC] hover:border-violet-200 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-amber-100 text-violet-600 shadow-inner">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#78716C] uppercase tracking-wider">Stack with</p>
                    <h3 className="text-lg font-bold text-[#1C1917]">{stack.skill}</h3>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4 flex gap-3 items-start">
                  <TrendingUp className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-0.5">Income Boost</p>
                    <p className="text-sm font-medium text-emerald-700">{stack.incomeBoost}</p>
                  </div>
                </div>

                <p className="text-sm text-[#1C1917] mb-6 leading-relaxed">
                  {stack.whyItPairs}
                </p>

                <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
                  <div className="flex items-center gap-2 text-sm text-[#78716C] font-semibold">
                    <Clock size={16} /> Estimated Time: {stack.timeToLearn}
                  </div>
                  
                  <div className="grid gap-3">
                    <a href={stack.freeResource?.url || "#"} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full justify-start text-sm border-[#E8E4DC] hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                        <BookOpen className="mr-2" size={16} />
                        Free: {stack.freeResource?.name || "YouTube Crash Course"}
                        <ArrowUpRight className="ml-auto opacity-50" size={14} />
                      </Button>
                    </a>
                    
                    <a href={stack.paidResource?.url || "#"} target="_blank" rel="noreferrer">
                      <Button className="w-full justify-start text-sm bg-stone-900 hover:bg-stone-800 text-white">
                        <Sparkles className="mr-2 text-amber-400" size={16} />
                        Pro: {stack.paidResource?.name || "Premium Masterclass"}
                        <ArrowUpRight className="ml-auto opacity-50" size={14} />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
