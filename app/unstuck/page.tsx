"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Brain, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UnstuckPage() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    diagnosis: string;
    unstuckTasks: string[];
    motivationalQuote: string;
  } | null>(null);

  const handleDiagnose = async () => {
    if (!problem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/unstuck/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data = await res.json();
      if (!data.error) setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell activePath="/unstuck">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-[#1C1917] mb-2">Dr. Business Intervention</h1>
          <p className="text-[#78716C] text-sm">
            Getting stuck is part of the process. Staying stuck is a choice. Let&apos;s fix it.
          </p>
        </div>

        {!result ? (
          <Card className="p-8 border-[#E8E4DC] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                <Brain size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#1C1917]">Tell me what&apos;s stopping you</h2>
            </div>
            
            <Textarea 
              placeholder="e.g. 'I'm afraid to send my first proposal' or 'I feel like my portfolio isn't good enough yet'..."
              className="min-h-[150px] mb-6 text-base"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />

            <Button 
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 text-base"
              onClick={handleDiagnose}
              disabled={loading || !problem}
            >
              {loading ? (
                <><Loader2 size={20} className="mr-2 animate-spin" /> Diagnosing...</>
              ) : (
                <><Sparkles size={20} className="mr-2 text-amber-400" /> Get Intervention</>
              )}
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-8 border-violet-200 bg-violet-50/50">
              <h3 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">The Diagnosis</h3>
              <p className="text-lg font-bold text-[#1C1917] italic">
                &quot;{result.diagnosis}&quot;
              </p>
            </Card>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#1C1917] uppercase tracking-wider mb-2">Your 3 Micro-Tasks</h3>
              {result.unstuckTasks.map((task, i) => (
                <Card key={i} className="p-5 border-[#E8E4DC] flex items-center gap-4 bg-white">
                  <div className="size-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-[#1C1917] font-semibold flex-1">{task}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 border-stone-200 bg-stone-900 text-white text-center">
              <p className="text-xl font-black italic mb-2">&quot;{result.motivationalQuote}&quot;</p>
              <p className="text-xs font-bold text-stone-400 uppercase">— Dr. Business</p>
            </Card>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-[#E8E4DC]"
                onClick={() => {
                  setResult(null);
                  setProblem("");
                }}
              >
                Reset Intervention
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold">
                  Go to Dashboard <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
