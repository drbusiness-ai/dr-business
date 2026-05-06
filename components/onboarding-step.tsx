"use client";

import { cn } from "@/components/ui/utils";

interface OnboardingStepProps {
  title: string;
  description?: string;
  options: { value: string; label: string; emoji?: string }[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function OnboardingStep({
  title,
  description,
  options,
  selected,
  onSelect,
}: OnboardingStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      {description && (
        <p className="text-slate-400 mb-8">{description}</p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all duration-200 hover:border-sky-400/40 hover:bg-sky-400/5",
              selected === opt.value
                ? "border-sky-400/60 bg-sky-400/15 text-white shadow-[0_0_30px_rgba(56,189,248,0.15)]"
                : "border-white/10 bg-white/[0.03] text-slate-300"
            )}
          >
            {opt.emoji && (
              <span className="text-2xl mb-2 block">{opt.emoji}</span>
            )}
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
