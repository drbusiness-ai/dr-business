"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Copy, 
  Save, 
  RefreshCw, 
  Check, 
  Sparkles, 
  FileText,
  Clock,
  ExternalLink,
  Target,
  BarChart3,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/components/ui/utils";

interface ProposalScore {
  score: number;
  breakdown: {
    hook: number;
    relevance: number;
    cta: number;
  };
}

export default function ProposalsPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [platform, setPlatform] = useState("Upwork");
  const [angle, setAngle] = useState("Quality-focused");
  const [generating, setGenerating] = useState(false);
  const [proposal, setProposal] = useState("");
  const [scoreData, setScoreData] = useState<ProposalScore | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedProposals, setSavedProposals] = useState<any[]>([]);

  useEffect(() => {
    fetchSavedProposals();
  }, []);

  const fetchSavedProposals = async () => {
    try {
      const res = await fetch("/api/proposals");
      if (res.ok) {
        const data = await res.json();
        setSavedProposals(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription) return;
    
    setGenerating(true);
    setProposal("");
    setScoreData(null);
    setSaved(false);

    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, platform, angle }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const reader = res.body?.getReader();
      if (!reader) return;

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        accumulated += text;
        setProposal(accumulated);
      }

      // After stream finished, get the score
      const scoreRes = await fetch("/api/proposals/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: accumulated, jobDescription }),
      });

      if (scoreRes.ok) {
        const score = await scoreRes.json();
        setScoreData(score);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!proposal || saved) return;
    
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          platform,
          angle,
          content: proposal,
          score: scoreData?.score || 0
        }),
      });
      if (res.ok) {
        setSaved(true);
        fetchSavedProposals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell activePath="/proposals">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Proposal AI Builder</h1>
          <p className="text-slate-400">Transform job descriptions into high-status, winning proposals in seconds.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium">
          <Sparkles size={14} />
          GPT-4o Powered
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* LEFT: Input Form */}
        <section className="space-y-6">
          <Card className="p-6 border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText size={18} className="text-sky-400" />
              Job Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Job Post or Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements here..."
                  className="w-full h-48 bg-slate-900 border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-900 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none cursor-pointer"
                  >
                    <option>Upwork</option>
                    <option>LinkedIn</option>
                    <option>Fiverr</option>
                    <option>Direct Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Your Angle
                  </label>
                  <select
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    className="w-full bg-slate-900 border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 appearance-none cursor-pointer"
                  >
                    <option>Quality-focused</option>
                    <option>Speed-focused</option>
                    <option>Price-focused</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={generating || !jobDescription}
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold h-12 gap-2 mt-4"
              >
                {generating ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                Generate Proposal
              </Button>
            </div>
          </Card>

          {savedProposals.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Recently Saved</h3>
              <div className="space-y-3">
                {savedProposals.map((p) => (
                  <Card key={p.id} className="p-4 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{p.content.split('\n')[0]}</p>
                        <p className="text-xs text-slate-500 mt-1">{p.platform} • {p.angle}</p>
                      </div>
                      <div className="text-sky-400 font-bold text-sm">
                        {p.score}%
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </section>

        {/* RIGHT: Output Display */}
        <section className="space-y-6">
          <Card className="p-6 border-white/5 bg-slate-900/50 backdrop-blur-xl min-h-[500px] flex flex-col relative overflow-hidden">
             {/* Glow effect when generating */}
             {generating && (
               <div className="absolute inset-0 bg-sky-500/5 animate-pulse" />
             )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target size={18} className="text-sky-400" />
                Live Proposal
              </h2>
              {scoreData && (
                <div className="flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Score:</span>
                  <span className="text-sky-400 font-black">{scoreData.score}</span>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950/50 rounded-xl border border-white/5 p-6 mb-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-300 min-h-[300px]">
              {proposal || (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-center">
                  <FileText size={40} className="mb-4 opacity-20" />
                  <p>Generate a proposal to see the magic happen.</p>
                </div>
              )}
            </div>

            {proposal && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                {scoreData && (
                   <div className="grid grid-cols-3 gap-4 mb-8 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hook</p>
                        <Progress value={scoreData.breakdown.hook} className="h-1 bg-white/5" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Relevance</p>
                        <Progress value={scoreData.breakdown.relevance} className="h-1 bg-white/5" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CTA</p>
                        <Progress value={scoreData.breakdown.cta} className="h-1 bg-white/5" />
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button variant="outline" onClick={handleGenerate} className="gap-2 border-white/10 hover:bg-white/5">
                    <RefreshCw size={16} />
                    Regenerate
                  </Button>
                  <Button variant="outline" onClick={handleCopy} className="gap-2 border-white/10 hover:bg-white/5">
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={saved}
                    className={cn(
                      "col-span-2 sm:col-span-1 gap-2 font-bold",
                      saved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-sky-500 hover:bg-sky-400 text-slate-950"
                    )}
                  >
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    {saved ? "Saved" : "Save Proposal"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
