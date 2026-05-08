"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/components/ui/utils";

type ContentIdea = {
  type: string;
  hook: string;
  structure: string;
  potential: "High" | "Medium" | "Low";
};

const platforms = ["LinkedIn", "Twitter", "Instagram"];

export default function ContentPage() {
  const [platform, setPlatform] = useState("LinkedIn");
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchIdeas(platform);
  }, [platform]);

  const fetchIdeas = async (p: string) => {
    setLoading(true);
    setIdeas([]);
    try {
      const res = await fetch(`/api/content/ideas?platform=${p.toLowerCase()}`);
      const data = await res.json();
      if (data.ideas) {
        setIdeas(data.ideas);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (index: number, idea: ContentIdea) => {
    setGeneratingFor(index);
    setGeneratedContent("");
    setCopied(false);
    
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platform.toLowerCase(),
          hook: idea.hook,
          type: idea.type,
          structure: idea.structure,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to generate");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          fullContent += chunk;
          setGeneratedContent(fullContent);
        }
      }
    } catch (e) {
      console.error(e);
      setGeneratingFor(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell activePath="/content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1C1917] mb-2">Content Accelerator</h1>
        <p className="text-[#78716C] text-sm">
          Inbound leads beat cold outreach. Turn these viral ideas into ready-to-post content.
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
              platform === p
                ? "bg-violet-600 text-white"
                : "bg-white border border-[#E8E4DC] text-[#78716C] hover:border-violet-200"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[#1C1917]">30 Content Ideas</h2>
            {loading && <Loader2 size={16} className="text-[#78716C] animate-spin" />}
          </div>

          {!loading && ideas.length === 0 && (
            <Card className="p-8 text-center text-[#78716C] border-dashed border-2">
              Failed to load ideas. Try refreshing.
            </Card>
          )}

          {ideas.map((idea, i) => (
            <Card
              key={i}
              className={cn(
                "p-5 transition-all",
                generatingFor === i ? "border-violet-400 bg-violet-50/30" : "border-[#E8E4DC]"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-100 px-2 py-0.5 rounded">
                  {idea.type}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  <TrendingUp size={12} /> {idea.potential} Potential
                </div>
              </div>
              <p className="font-bold text-[#1C1917] mb-2">&quot;{idea.hook}&quot;</p>
              <p className="text-xs text-[#78716C] mb-4 font-medium font-mono bg-[#FAFAF7] p-2 rounded">
                {idea.structure}
              </p>
              <Button
                variant={generatingFor === i ? "primary" : "outline"}
                className={cn(
                  "w-full text-sm font-semibold",
                  generatingFor === i && "bg-violet-600 text-white"
                )}
                onClick={() => generateContent(i, idea)}
                disabled={generatingFor !== null && generatingFor !== i}
              >
                {generatingFor === i ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="mr-2 text-amber-500" /> Generate Post
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <h2 className="text-base font-bold text-[#1C1917] mb-4">Generated Content</h2>
          <Card className="p-6 border-[#E8E4DC] min-h-[400px] flex flex-col bg-white">
            {generatingFor === null && !generatedContent ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#A8A29E]">
                <Sparkles size={32} className="mb-3 opacity-50" />
                <p className="font-medium">Select an idea to generate a post.</p>
                <p className="text-sm mt-1">Dr. Business AI will write it for you.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 whitespace-pre-wrap text-[#1C1917] text-[15px] leading-relaxed mb-6">
                  {generatedContent}
                  {generatingFor !== null && (
                    <span className="inline-block w-2 h-4 ml-1 bg-violet-600 animate-pulse" />
                  )}
                </div>
                
                {generatingFor === null && generatedContent && (
                  <div className="pt-4 border-t border-[#E8E4DC] flex gap-3">
                    <Button 
                      className="flex-1 bg-[#1C1917] hover:bg-[#292524] text-white"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <><CheckCircle2 size={16} className="mr-2 text-emerald-400" /> Copied!</>
                      ) : (
                        <><Copy size={16} className="mr-2" /> Copy to Clipboard</>
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
