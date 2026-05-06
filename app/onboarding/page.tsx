"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from "@/components/onboarding-step";
import { Progress } from "@/components/ui/progress";

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
      { value: "Social Media", label: "Social Media", emoji: "📱" },
      { value: "UI/UX Design", label: "UI/UX Design", emoji: "🖌️" },
    ],
  },
  {
    id: 2,
    title: "How many hours per day can you commit?",
    description: "Be honest — consistency beats intensity every time.",
    options: [
      { value: "1 hour", label: "1 hour", emoji: "🕐" },
      { value: "2 hours", label: "2 hours", emoji: "🕑" },
      { value: "3-4 hours", label: "3–4 hours", emoji: "🕒" },
      { value: "5+ hours", label: "5+ hours", emoji: "🚀" },
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
    title: "What device will you primarily use?",
    description: "We'll optimize your experience for your setup.",
    options: [
      { value: "Laptop/Desktop", label: "Laptop / Desktop", emoji: "💻" },
      { value: "Smartphone", label: "Smartphone", emoji: "📱" },
      { value: "Both", label: "Both", emoji: "🔄" },
    ],
  },
  {
    id: 5,
    title: "What's your income goal in 30 days?",
    description: "Set a real target. Dr. Business will build your plan around it.",
    options: [
      { value: "₹5,000", label: "₹5,000", emoji: "💰" },
      { value: "₹10,000", label: "₹10,000", emoji: "💵" },
      { value: "₹25,000", label: "₹25,000", emoji: "🏆" },
      { value: "₹50,000+", label: "₹50,000+", emoji: "🚀" },
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
  const progress = ((currentStep) / steps.length) * 100;

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
            platforms: answers[4] === "Smartphone" ? ["Instagram", "Mobile"] : ["Upwork", "LinkedIn"],
            incomeGoal: answers[5]
          })
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
            Your personalized 30-Day Freelancer Launch Plan has been generated
            based on your answers.
          </p>

          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-6 mb-8 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-4">
              Your Roadmap Summary
            </p>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Skill</span>
                <span className="font-medium">{answers[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily commitment</span>
                <span className="font-medium">{answers[2]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Experience</span>
                <span className="font-medium">{answers[3]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Income goal</span>
                <span className="font-medium text-emerald-400">{answers[5]}</span>
              </div>
            </div>
          </div>

          {/* Roadmap timeline preview */}
          <div className="text-left mb-8">
            {[
              { day: "Week 1", label: "Profile & Portfolio Setup", done: false },
              { day: "Week 2", label: "Outreach & First Proposals", done: false },
              { day: "Week 3", label: "Follow Up & Close", done: false },
              { day: "Week 4", label: "Land First Client", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 mb-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-xs font-bold text-sky-400">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{item.day}</p>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                </div>
                {i < 3 && (
                  <div className="ml-3 h-0.5 flex-1 bg-sky-400/10" />
                )}
              </div>
            ))}
          </div>

          <Link href="/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="w-full gap-2 text-base h-14 shadow-[0_0_40px_rgba(14,165,233,0.3)]"
            >
              Enter Your Dashboard
              <ArrowRight size={18} />
            </Button>
          </Link>
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
              {isGenerating ? "Generating..." : currentStep === steps.length - 1 ? "Generate My Plan" : "Continue"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
