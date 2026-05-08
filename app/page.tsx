"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { testimonials, faqs } from "@/lib/mock-data";

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-600">
            <Sparkles size={18} />
          </div>
          <span className="font-bold text-stone-900 text-lg">Dr. Business</span>
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-500">
          <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-stone-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-stone-900 transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-semibold text-stone-600 hover:text-stone-900">Sign in</Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="secondary" size="sm" className="font-semibold">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-6 bg-[#FAFAF7]">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 mb-8">
          <Flame size={14} className="text-amber-500" />
          <span>2,400+ freelancers earning their first ₹10K+ this month</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 leading-[1.08] tracking-tight mb-6">
          Stop Watching Gurus.{" "}
          <span className="bg-gradient-to-r from-violet-600 to-amber-500 bg-clip-text text-transparent">
            Start Building Income.
          </span>
        </h1>

        <p className="text-xl text-stone-600 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
          Dr. Business gives you a personalized daily execution system to land
          your first freelance client — in 30 days or less.
        </p>

        <WaitlistForm />
      </div>

      {/* Floating dashboard preview */}
      <div className="mx-auto mt-20 max-w-5xl px-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-1 shadow-xl shadow-stone-200/50">
          <div className="rounded-xl bg-[#FAFAF7] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {["🔥 7-day streak", "✅ 23 tasks done", "📤 5 proposals"].map(
                (m) => (
                  <div
                    key={m}
                    className="rounded-xl border border-stone-200 bg-white p-3 text-xs font-medium text-stone-600 shadow-sm"
                  >
                    {m}
                  </div>
                )
              )}
            </div>
            <div className="space-y-2">
              {[
                { t: "Optimize Upwork headline", p: "High", done: true },
                { t: "Create portfolio sample", p: "High", done: false },
                { t: "Send 5 cold DMs", p: "Medium", done: false },
              ].map((task) => (
                <div
                  key={task.t}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div
                    className={`size-5 rounded-full border-2 ${task.done ? "bg-violet-600 border-violet-600" : "border-stone-300"} flex items-center justify-center`}
                  >
                    {task.done && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span
                    className={`flex-1 text-sm font-medium ${task.done ? "line-through text-stone-400" : "text-stone-700"}`}
                  >
                    {task.t}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${task.p === "High" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
                  >
                    {task.p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist Form ─────────────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [count, setCount] = useState<number>(2400);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setCount(Math.max(2400, data.count));
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setPosition(data.position);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">You&apos;re on the list!</h3>
        <p className="text-emerald-700 font-medium">You are #{position} in line. Keep an eye on your inbox.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full h-14 pl-6 pr-32 bg-white border-2 border-stone-200 focus:border-violet-500 rounded-full text-stone-900 font-medium placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all shadow-sm"
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="absolute right-1.5 h-11 px-6 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Joining..." : "Join Waitlist"}
          </Button>
        </div>
        {status === "error" && (
          <p className="text-red-500 font-medium text-sm mt-1">Something went wrong. Please try again.</p>
        )}
      </form>
      <p className="mt-4 text-sm font-medium text-stone-500 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-stone-700">{count.toLocaleString()}</span> freelancers already joined
      </p>
    </div>
  );
}

// ─── Wins Feed ─────────────────────────────────────────────────────────────
function WinsFeedSection() {
  const [wins, setWins] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/wins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWins(data);
      })
      .catch(() => {});
  }, []);

  if (wins.length === 0) return null;

  return (
    <section className="py-12 border-y border-stone-200 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs text-amber-600 font-bold uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
          <Flame size={16} className="text-amber-500" /> Live Execution Feed
        </p>
        <div className="flex gap-6 animate-[scroll_40s_linear_infinite] w-max hover:[animation-play-state:paused]">
          {[...wins, ...wins].map((win, i) => (
            <div key={i} className="flex-shrink-0 w-[300px] rounded-2xl bg-[#FAFAF7] border border-stone-200 p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {win.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{win.userName}</p>
                  <p className="text-xs font-medium text-stone-500">{win.userSkill}</p>
                </div>
              </div>
              <p className="text-sm text-stone-700 mt-2 font-medium">
                <span className="text-emerald-600 font-bold mr-1">{win.winType}</span>
                {win.winText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Bar ──────────────────────────────────────────────────────
function SocialProof() {
  const platforms = [
    "Upwork", "Fiverr", "LinkedIn", "Toptal", "Freelancer.com", "99designs",
  ];
  return (
    <section className="border-b border-stone-200 bg-[#FAFAF7] py-8 px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
          Our users land clients on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {platforms.map((p) => (
            <span key={p} className="text-stone-400 font-bold text-sm tracking-wide">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ───────────────────────────────────────────────────────
function Problem() {
  const problems = [
    {
      icon: "📺",
      title: "You've watched 100+ hours of tutorials",
      desc: "But you still haven't sent a single proposal.",
    },
    {
      icon: "🔁",
      title: "You're stuck in the 'learning loop'",
      desc: "More content, more confusion, zero clients.",
    },
    {
      icon: "😰",
      title: "You don't know what to do NEXT",
      desc: "No clear system = no momentum = no income.",
    },
    {
      icon: "👻",
      title: "You ghost your own goals",
      desc: "Day 1 energy dies by Day 3 without structure.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white" id="problem">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Why most people{" "}
            <span className="text-red-500">never earn online</span>
          </h2>
          <p className="text-stone-500 font-medium max-w-xl mx-auto text-lg">
            It&apos;s not a lack of talent. It&apos;s a lack of system. Here&apos;s what&apos;s
            really happening:
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {problems.map((p) => (
            <Card key={p.title} className="p-6 bg-[#FAFAF7] border-stone-200 shadow-sm">
              <span className="text-3xl mb-4 block">{p.icon}</span>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">{p.title}</h3>
              <p className="text-sm font-medium text-stone-500 leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <Target size={28} className="text-violet-600" />,
      title: "Build your personalized plan",
      desc: "Answer 5 questions about your skill, time, and goals. Dr. Business generates your custom 30-day roadmap in seconds.",
      bg: "bg-violet-100"
    },
    {
      num: "02",
      icon: <CheckCircle2 size={28} className="text-amber-600" />,
      title: "Execute daily tasks",
      desc: "Every morning, 3–5 high-leverage tasks await you. No decision fatigue — just open the app and start.",
      bg: "bg-amber-100"
    },
    {
      num: "03",
      icon: <Zap size={28} className="text-emerald-600" />,
      title: "Land your first client",
      desc: "Follow the system. Your AI coach guides every step. Most users land their first client in 21–30 days.",
      bg: "bg-emerald-100"
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#FAFAF7] border-y border-stone-200" id="how-it-works">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            How Dr. Business works
          </h2>
          <p className="text-stone-500 font-medium text-lg">
            A 3-step system designed for real execution, not passive learning.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${s.bg} shadow-sm`}>
                {s.icon}
              </div>
              <div className="text-xs font-extrabold text-stone-400 mb-3 uppercase tracking-widest">
                Step {s.num}
              </div>
              <h3 className="font-bold text-stone-900 text-xl mb-3">{s.title}</h3>
              <p className="text-sm font-medium text-stone-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Real users. Real income.
          </h2>
          <p className="text-stone-500 font-medium text-lg">Not theory. Not hype. Execution results.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-6 flex flex-col gap-5 border-stone-200 bg-[#FAFAF7] shadow-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm font-medium text-stone-700 leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-amber-500 text-xs font-bold text-white shadow-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{t.name}</p>
                  <p className="text-xs font-semibold text-emerald-600">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section className="py-24 px-6 bg-[#FAFAF7] border-y border-stone-200" id="pricing">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="text-stone-500 font-medium text-lg">Start free. Upgrade when you&apos;re ready.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Free */}
          <Card className="p-8 border-stone-200 bg-white shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-widest text-stone-400 mb-4">
              Free
            </p>
            <p className="text-5xl font-extrabold text-stone-900 mb-2">₹0</p>
            <p className="text-stone-500 font-medium text-sm mb-8">Forever free, no card needed</p>
            <ul className="space-y-4 mb-10">
              {[
                "Personalized 30-day roadmap",
                "5 daily tasks",
                "Basic AI coach (5 msgs/day)",
                "Tool vault access",
                "Progress tracker",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm font-medium text-stone-700">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="block w-full">
              <Button variant="outline" className="w-full h-12 font-bold text-stone-700 border-2">
                Get Started Free
              </Button>
            </Link>
          </Card>

          {/* Pro */}
          <Card className="p-8 border-violet-200 bg-violet-50 relative overflow-hidden shadow-md">
            <div className="absolute top-5 right-5 rounded-full bg-violet-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              Most Popular
            </div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-violet-600 mb-4">
              Pro
            </p>
            <p className="text-5xl font-extrabold text-stone-900 mb-2">
              ₹499
              <span className="text-lg text-stone-500 font-medium">/mo</span>
            </p>
            <p className="text-stone-500 font-medium text-sm mb-8">Cancel anytime</p>
            <ul className="space-y-4 mb-10">
              {[
                "Everything in Free",
                "Unlimited AI coach messages",
                "Advanced execution analytics",
                "Client email scripts",
                "Proposal AI Builder",
                "CRM Kanban Board",
                "Rate Calculator",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm font-medium text-stone-900">
                  <CheckCircle2 size={18} className="text-violet-600 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="block w-full">
              <Button
                variant="primary"
                className="w-full h-12 font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20"
              >
                Start Pro — 7 Days Free
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-white" id="faq">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="overflow-hidden border-stone-200 bg-[#FAFAF7] shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
              >
                <span className="font-bold text-stone-900 text-[15px]">{faq.q}</span>
                {open === i ? (
                  <ChevronUp size={20} className="text-stone-400 flex-shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-stone-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-6 pt-2">
                  <p className="text-sm font-medium text-stone-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Footer ───────────────────────────────────────────────────────────
function CTAFooter() {
  return (
    <section className="py-24 px-6 text-center border-t border-stone-200 bg-[#FAFAF7]">
      <div className="mx-auto max-w-2xl">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-amber-100 shadow-inner">
          <Sparkles size={36} className="text-violet-600" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 tracking-tight">
          Your first client is 30 days away.
        </h2>
        <p className="text-stone-500 font-medium text-lg mb-10 max-w-xl mx-auto">
          Stop waiting for the perfect moment. The system is ready. You just
          need to start.
        </p>
        <Link href="/onboarding" className="inline-block">
          <Button
            size="lg"
            variant="secondary"
            className="gap-3 text-base font-bold h-14 px-10 shadow-lg shadow-amber-500/20"
          >
            Start Your 30-Day Plan
            <ArrowRight size={20} />
          </Button>
        </Link>
        <p className="mt-6 text-sm font-bold text-stone-400">
          Free · No card required · Takes 3 minutes
        </p>
      </div>
      <div className="mt-20 border-t border-stone-200 pt-8 text-xs font-bold text-stone-400">
        © 2026 Dr. Business. All rights reserved. · Stop consuming. Start executing.
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WinsFeedSection />
      <SocialProof />
      <Problem />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTAFooter />
    </div>
  );
}
