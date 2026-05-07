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
          <h1 className="text-3xl font-black text-[#1C1917] mb-1">Proposal AI Builder</h1>
          <p className="text-[#78716C] font-medium">Transform job descriptions into high-status, winning proposals in seconds.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm font-bold shadow-sm">
          <Sparkles size={14} />
          GPT-4o Powered
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* LEFT: Input Form */}
        <section className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-[#1C1917] mb-4 flex items-center gap-2">
              <FileText size={18} className="text-violet-600" />
              Job Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1C1917] mb-2">
                  Job Post or Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements here..."
                  className="w-full h-48 bg-[#FAFAF7] border border-[#E8E4DC] rounded-xl p-4 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1C1917] mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-[#E8E4DC] rounded-xl px-4 py-3 text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 appearance-none cursor-pointer"
                  >
                    <option>Upwork</option>
                    <option>LinkedIn</option>
                    <option>Fiverr</option>
                    <option>Direct Client</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1C1917] mb-2">
                    Your Angle
                  </label>
                  <select
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    className="w-full bg-[#FAFAF7] border border-[#E8E4DC] rounded-xl px-4 py-3 text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 appearance-none cursor-pointer"
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
                className="w-full h-12 gap-2 mt-4 font-bold shadow-md shadow-violet-200 btn-violet-glow"
              >
                {generating ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                Generate Proposal
              </Button>
            </div>
          </Card>

          {savedProposals.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-4">Recently Saved</h3>
              <div className="space-y-3">
                {savedProposals.map((p) => (
                  <Card key={p.id} className="p-4 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer group bg-[#FAFAF7]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1C1917] font-bold text-sm truncate">{p.content.split('\n')[0]}</p>
                        <p className="text-xs text-[#78716C] font-medium mt-1">{p.platform} • {p.angle}</p>
                      </div>
                      <div className="bg-violet-100 text-violet-700 px-2 py-1 rounded-lg font-black text-sm border border-violet-200">
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
          <Card className="p-6 min-h-[500px] flex flex-col relative overflow-hidden bg-white">
             {/* Glow effect when generating */}
             {generating && (
               <div className="absolute inset-0 bg-violet-50/50 animate-pulse" />
             )}

            <div className="flex items-center justify-between mb-6 z-10">
              <h2 className="text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <Target size={18} className="text-amber-500" />
                Live Proposal
              </h2>
              {scoreData && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-sm">
                  <span className="text-xs text-emerald-700 uppercase font-bold tracking-wider">Score:</span>
                  <span className="text-emerald-600 font-black">{scoreData.score}</span>
                </div>
              )}
            </div>

            <div className="flex-1 bg-[#FAFAF7] rounded-2xl border border-[#E8E4DC] p-6 mb-6 font-medium text-sm leading-relaxed whitespace-pre-wrap text-[#1C1917] min-h-[300px] shadow-inner z-10">
              {proposal || (
                <div className="h-full flex flex-col items-center justify-center text-[#A8A29E] italic text-center">
                  <FileText size={40} className="mb-4 opacity-50" />
                  <p>Generate a proposal to see the magic happen.</p>
                </div>
              )}
            </div>

            {proposal && (
              <div className="animate-in fade-in slide-in-from-bottom-4 z-10">
                {scoreData && (
                   <div className="grid grid-cols-3 gap-4 mb-8 bg-[#FAFAF7] p-5 rounded-2xl border border-[#E8E4DC]">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-[#78716C] uppercase tracking-widest">Hook</p>
                        <div className="h-2 bg-[#E8E4DC] rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500" style={{ width: `${scoreData.breakdown.hook}%` }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-[#78716C] uppercase tracking-widest">Relevance</p>
                        <div className="h-2 bg-[#E8E4DC] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${scoreData.breakdown.relevance}%` }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-[#78716C] uppercase tracking-widest">CTA</p>
                        <div className="h-2 bg-[#E8E4DC] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${scoreData.breakdown.cta}%` }} />
                        </div>
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button variant="outline" onClick={handleGenerate} className="gap-2 font-bold bg-white">
                    <RefreshCw size={16} />
                    Regenerate
                  </Button>
                  <Button variant="outline" onClick={handleCopy} className="gap-2 font-bold bg-white">
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={saved}
                    className={cn(
                      "col-span-2 sm:col-span-1 gap-2 font-bold",
                      saved ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" : "bg-[#1C1917] hover:bg-black text-white"
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
