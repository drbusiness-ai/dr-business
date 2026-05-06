"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, Share2, Loader2, Target, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/components/ui/utils";

interface QuickWin {
  title: string;
  steps: string[];
  estimatedMinutes: number;
  winStatement: string;
  shareText: string;
}

export default function QuickWinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<QuickWin | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateQuickWin = async () => {
      try {
        const res = await fetch("/api/quickwin/generate", { method: "POST" });
        if (!res.ok) throw new Error("Failed to generate");
        
        const reader = res.body?.getReader();
        if (!reader) return;

        let accumulated = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += new TextDecoder().decode(value);
          // Try to parse partial JSON? No, wait until done for simplicity,
          // or try parsing safely.
        }

        const parsed = JSON.parse(accumulated);
        setData(parsed);
      } catch (error) {
        console.error(error);
        // Fallback data if generation fails
        setData({
          title: "Optimize Your Profile Headline",
          steps: [
            "Go to your primary freelancing platform (e.g., Upwork or LinkedIn).",
            "Change your headline to: 'I help [Target Audience] achieve [Desired Result] using [Your Skill].'",
            "Save the changes."
          ],
          estimatedMinutes: 5,
          winStatement: "I just optimized my freelancing profile for maximum conversion using Dr. Business!",
          shareText: "Just updated my profile headline using the exact formula from Dr. Business. Getting 1% better every day! 🚀 #freelance #drbusiness"
        });
      } finally {
        setLoading(false);
      }
    };

    generateQuickWin();
  }, []);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/quickwin/complete", { method: "POST" });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#8b5cf6', '#ffffff']
      });
      
      setIsCompleted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data?.shareText || "")}`;
    window.open(url, "_blank");
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
            <Sparkles size={16} />
            Your 48-Hour Activation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Let&apos;s get your first win.
          </h1>
          <p className="text-lg text-slate-400">
            The #1 reason freelancers fail is overthinking. We&apos;re going to execute something right now.
          </p>
        </div>

        {loading ? (
          <Card className="p-12 flex flex-col items-center justify-center border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Dr. Business is analyzing your profile...</p>
            <p className="text-sm text-slate-500 mt-2">Generating a custom quick-win task.</p>
          </Card>
        ) : !isCompleted && data ? (
          <Card className="p-8 border-sky-400/20 bg-sky-950/20 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full">
                <Target size={14} />
                {data.estimatedMinutes} min
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 pr-24">
              {data.title}
            </h2>

            <div className="space-y-4 mb-8">
              {data.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-slate-300 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={handleComplete}
              disabled={isSubmitting}
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-lg h-14"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "I Did It! 🎉"}
            </Button>
          </Card>
        ) : (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
              <CheckCircle2 size={48} />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Incredible work.</h2>
              <p className="text-slate-400 text-lg">
                You took action. That puts you ahead of 90% of beginners.
              </p>
            </div>

            <Card className="p-6 border-white/10 bg-white/5 text-left">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Win</p>
              <p className="text-white text-lg font-medium italic">"{data?.winStatement}"</p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" onClick={handleShare} className="gap-2 font-semibold">
                <Share2 size={18} />
                Share on X (Twitter)
              </Button>
              <Button size="lg" onClick={() => router.push("/dashboard")} className="gap-2 font-semibold bg-white text-slate-950 hover:bg-slate-200">
                Go to Dashboard
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
