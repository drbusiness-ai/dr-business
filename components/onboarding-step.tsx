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
      <h2 className="text-2xl font-bold text-[#1C1917] mb-2">{title}</h2>
      {description && (
        <p className="text-[#78716C] mb-8">{description}</p>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={cn(
              "rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:border-violet-300 hover:bg-violet-50",
              selected === opt.value
                ? "border-violet-500 bg-violet-50 text-[#1C1917] shadow-md shadow-violet-100"
                : "border-[#E8E4DC] bg-white text-[#1C1917] hover:shadow-sm"
            )}
          >
            {opt.emoji && (
              <span className="text-2xl mb-2 block">{opt.emoji}</span>
            )}
            <span className="text-sm font-medium">{opt.label}</span>
            {selected === opt.value && (
              <span className="block mt-1 text-xs text-violet-600 font-semibold">✓ Selected</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
