"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from "@/components/onboarding-step";

const steps = [
  {
    id: 1,
    title: "What freelance skill do you want to focus on?",
    description: "Pick the one skill you want to monetize first. You can add more later.",
    options: [
      { value: "Graphic Design", label: "Graphic Design", emoji: "🎨" },
      { value: "Video Editing", label: "Video Editing", emoji: "🎬" },
      { value: "Copywriting", label: "Copywriting", emoji: "✍️" },
      { value: "Web Development", label: "Web Development", emoji: "💻" },
      { value: "Social Media Management", label: "Social Media", emoji: "📱" },
      { value: "UI/UX Design", label: "UI/UX Design", emoji: "🖌️" },
      { value: "LinkedIn Ghostwriting", label: "LinkedIn Writing", emoji: "🔗" },
      { value: "AI Automation", label: "AI Automation", emoji: "🤖" },
    ],
  },
  {
    id: 2,
    title: "How many hours per day can you commit?",
    description: "Be honest — consistency beats intensity every time.",
    options: [
      { value: "1", label: "1 hour", emoji: "🕐" },
      { value: "2", label: "2 hours", emoji: "🕑" },
      { value: "3", label: "3–4 hours", emoji: "🕒" },
      { value: "5", label: "5+ hours", emoji: "🚀" },
    ],
  },
  {
    id: 3,
    title: "What's your current experience level?",
    description: "Your plan will be tailored to where you are right now.",
    options: [
      { value: "Beginner", label: "Complete Beginner", emoji: "🌱" },
      { value: "Some Skills", label: "Some Skills", emoji: "🌿" },
      { value: "Intermediate", label: "Intermediate", emoji: "🌳" },
      { value: "Advanced", label: "Advanced", emoji: "🔥" },
    ],
  },
  {
    id: 4,
    title: "What is your current monthly income?",
    description: "This helps us understand your baseline and set realistic targets.",
    options: [
      { value: "₹0", label: "₹0 — Not earning yet", emoji: "😤" },
      { value: "₹5,000–₹15,000", label: "₹5,000 – ₹15,000", emoji: "💸" },
      { value: "₹15,000–₹40,000", label: "₹15,000 – ₹40,000", emoji: "💰" },
      { value: "₹40,000+", label: "₹40,000+", emoji: "🏆" },
    ],
  },
  {
    id: 5,
    title: "What's your income goal in the next 30 days?",
    description: "Set a real target. Dr. Business will build your plan around it.",
    options: [
      { value: "₹5,000", label: "₹5,000", emoji: "💰" },
      { value: "₹10,000", label: "₹10,000", emoji: "💵" },
      { value: "₹25,000", label: "₹25,000", emoji: "🏆" },
      { value: "₹50,000+", label: "₹50,000+", emoji: "🚀" },
    ],
  },
  {
    id: 6,
    title: "Have you ever landed a paying client before?",
    description: "No judgment — this helps us know where to start your journey.",
    options: [
      { value: "never", label: "No, never", emoji: "🙅" },
      { value: "once", label: "Yes, once or twice", emoji: "🙋" },
      { value: "few", label: "Yes, a few times", emoji: "💼" },
      { value: "regularly", label: "Yes, regularly", emoji: "🔥" },
    ],
  },
  {
    id: 7,
    title: "Which platforms do you want to get clients from?",
    description: "Your daily tasks will be platform-specific for maximum results.",
    options: [
      { value: "Upwork", label: "Upwork", emoji: "🟢" },
      { value: "LinkedIn", label: "LinkedIn", emoji: "🔗" },
      { value: "Instagram", label: "Instagram", emoji: "📸" },
      { value: "Fiverr", label: "Fiverr", emoji: "🟢" },
      { value: "Direct Outreach", label: "Direct Outreach", emoji: "📧" },
      { value: "Not sure yet", label: "Not sure yet", emoji: "🤷" },
    ],
  },
  {
    id: 8,
    title: "Do you already have a portfolio?",
    description: "Even 1-2 sample projects count as a portfolio.",
    options: [
      { value: "no", label: "No portfolio yet", emoji: "📭" },
      { value: "partial", label: "Working on it", emoji: "🔨" },
      { value: "yes", label: "Yes, it's live", emoji: "✅" },
    ],
  },
  {
    id: 9,
    title: "What is your biggest challenge right now?",
    description: "Be honest — Dr. Business will address this directly in your plan.",
    options: [
      { value: "Finding clients", label: "Finding clients", emoji: "🔍" },
      { value: "Pricing my work", label: "Pricing my work", emoji: "💲" },
      { value: "Communication & proposals", label: "Writing proposals", emoji: "✍️" },
      { value: "Staying consistent", label: "Staying consistent", emoji: "🎯" },
      { value: "Building portfolio", label: "Building portfolio", emoji: "🗂️" },
    ],
  },
  {
    id: 10,
    title: "How many hours daily do you spend on social media (scrolling)?",
    description: "We'll help you turn passive scrolling time into active income activity.",
    options: [
      { value: "less than 1", label: "Less than 1 hour", emoji: "✅" },
      { value: "1-2", label: "1–2 hours", emoji: "😐" },
      { value: "3-4", label: "3–4 hours", emoji: "😬" },
      { value: "5+", label: "5+ hours", emoji: "📵" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const step = steps[currentStep];
  const selected = answers[step?.id] ?? null;
  const progress = (currentStep / steps.length) * 100;

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsGenerating(true);
      try {
        await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skill: answers[1],
            hoursPerDay: answers[2],
            experienceLevel: answers[3],
            currentIncome: answers[4],
            incomeGoal: answers[5],
            hadClientBefore: answers[6] !== "never",
            platforms: [answers[7]],
            hasPortfolio: answers[8] === "yes",
            biggestChallenge: answers[9],
            dailySocialHours: answers[10],
          }),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsGenerating(false);
        setShowResult(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-violet-500">
            <Sparkles size={36} className="text-slate-950" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Your Plan is Ready! 🎉
          </h1>
          <p className="text-slate-400 mb-8">
            Dr. Business has built your personalized 30-day execution plan
            based on your profile. Your daily tasks are waiting.
          </p>

          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-6 mb-8 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-4">
              Your Profile Summary
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Skill</span>
                <span className="font-medium">{answers[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily commitment</span>
                <span className="font-medium">{answers[2]} hr/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Experience</span>
                <span className="font-medium">{answers[3]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform focus</span>
                <span className="font-medium">{answers[7]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Biggest challenge</span>
                <span className="font-medium">{answers[9]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Income goal</span>
                <span className="font-medium text-emerald-400">{answers[5]}</span>
              </div>
            </div>
          </div>

          <div className="text-left mb-8">
            {[
              { week: "Week 1", label: "Profile & Portfolio Setup" },
              { week: "Week 2", label: "Outreach & First Proposals" },
              { week: "Week 3", label: "Follow Up & Close Deals" },
              { week: "Week 4", label: "Land Your First Client" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 mb-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-xs font-bold text-sky-400">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{item.week}</p>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="w-full gap-2 text-base h-14 shadow-[0_0_40px_rgba(14,165,233,0.3)]"
            onClick={() => router.push("/dashboard")}
          >
            Enter Your Dashboard
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-sky-300 to-violet-500 text-slate-950">
            <Sparkles size={15} />
          </div>
          <span className="font-bold text-white">Dr. Business</span>
        </Link>
        <span className="text-xs text-slate-500">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-violet-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <OnboardingStep
            title={step.title}
            description={step.description}
            options={step.options}
            selected={selected}
            onSelect={handleSelect}
          />

          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={!selected || isGenerating}
              className="gap-2 px-8 shadow-[0_0_30px_rgba(14,165,233,0.2)]"
            >
              {isGenerating
                ? "Building your plan..."
                : currentStep === steps.length - 1
                ? "Generate My Plan 🚀"
                : "Continue"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
