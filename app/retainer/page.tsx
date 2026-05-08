"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Sparkles, Copy, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { cn } from "@/components/ui/utils";

export default function RetainerPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [duration, setDuration] = useState("3 months");
  const [rate, setRate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [proposal, setProposal] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((user) => {
        // Unlock condition: Day 25+ or first client progress 100%
        if (user.currentDay >= 25 || user.firstClientProgress >= 100) {
          setUnlocked(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const generateProposal = async () => {
    if (!clientName || !projectType || !rate) return;
    setGenerating(true);
    setProposal("");
    setCopied(false);

    try {
      const res = await fetch("/api/retainer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, projectType, duration, rate }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to generate");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          fullText += chunk;
          setProposal(fullText);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <AppShell activePath="/retainer">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!unlocked) {
    return (
      <AppShell activePath="/retainer">
        <div className="max-w-xl mx-auto py-12 text-center">
          <div className="size-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6 text-stone-400">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#1C1917] mb-3">Locked — Retainer Formula</h1>
          <p className="text-[#78716C] mb-8">
            The Retainer Formula unlocks once you&apos;ve landed your first client or reached Day 25. Focus on your daily tasks to unlock this advanced module.
          </p>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-violet-500 w-[60%]" />
          </div>
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">Keep going! You&apos;re close.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activePath="/retainer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1C1917] mb-2">Retainer Formula</h1>
        <p className="text-[#78716C] text-sm">
          Stop the feast-or-famine cycle. Convert one-off projects into monthly recurring revenue.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-[#E8E4DC]">
            <h2 className="text-base font-bold text-[#1C1917] mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" /> Retainer Builder
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#78716C] uppercase mb-1.5 block">Client Name</label>
                <Input 
                  placeholder="e.g. Acme Corp" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#78716C] uppercase mb-1.5 block">Project Type</label>
                <Input 
                  placeholder="e.g. Video Editing / Social Media" 
                  value={projectType} 
                  onChange={(e) => setProjectType(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#78716C] uppercase mb-1.5 block">Duration</label>
                <div className="flex gap-2">
                  {["3 months", "6 months", "1 year"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={cn(
                        "flex-1 py-2 text-xs font-bold rounded-lg border transition-all",
                        duration === d 
                          ? "bg-violet-600 border-violet-600 text-white shadow-sm" 
                          : "bg-white border-[#E8E4DC] text-[#78716C] hover:border-violet-200"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#78716C] uppercase mb-1.5 block">Monthly Rate (INR)</label>
                <Input 
                  placeholder="e.g. ₹25,000" 
                  value={rate} 
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-11"
                onClick={generateProposal}
                disabled={generating || !clientName || !projectType || !rate}
              >
                {generating ? (
                  <><Loader2 size={18} className="mr-2 animate-spin" /> Writing Proposal...</>
                ) : (
                  <><Sparkles size={18} className="mr-2 text-amber-400" /> Generate Proposal</>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex gap-3">
              <Info className="text-amber-500 flex-shrink-0" size={18} />
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase mb-1">Pro Tip</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Offer a &quot;Beta Client&quot; discount of 15% if they commit to a 6-month retainer today. It locks in the revenue instantly.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-8 border-[#E8E4DC] min-h-[500px] flex flex-col bg-white">
            {!proposal && !generating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#A8A29E]">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <h3 className="font-bold text-[#1C1917] mb-1">Ready to scale?</h3>
                <p className="text-sm max-w-xs mx-auto">
                  Fill in the details on the left to generate a professional retainer proposal for your client.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 whitespace-pre-wrap text-[#1C1917] text-[15px] leading-relaxed mb-8 font-medium">
                  {proposal}
                  {generating && (
                    <span className="inline-block w-2 h-4 ml-1 bg-violet-600 animate-pulse" />
                  )}
                </div>
                {!generating && proposal && (
                  <div className="pt-6 border-t border-[#E8E4DC]">
                    <Button 
                      className="bg-[#1C1917] hover:bg-[#292524] text-white px-8 font-bold"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <><CheckCircle2 size={18} className="mr-2 text-emerald-400" /> Copied!</>
                      ) : (
                        <><Copy size={18} className="mr-2" /> Copy Proposal</>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
