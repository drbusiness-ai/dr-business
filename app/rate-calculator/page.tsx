"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Loader2, ChevronDown } from "lucide-react";

const SKILLS = [
  "Graphic Design",
  "Web Development",
  "Content Writing",
  "Video Editing",
  "Digital Marketing",
  "UI/UX Design",
  "Social Media Management",
  "Data Entry",
  "SEO",
  "Photography",
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner (0–6 months)" },
  { value: "intermediate", label: "Intermediate (6–18 months)" },
  { value: "experienced", label: "Experienced (1.5–3 years)" },
  { value: "expert", label: "Expert (3+ years)" },
];

const PLATFORMS = ["Upwork", "Fiverr", "LinkedIn", "Direct"];
const CLIENT_LOCATIONS = ["India", "USA", "UK", "Australia", "Global"];

interface RateResult {
  minRate: number;
  maxRate: number;
  sweetSpot: number;
  currency: string;
  unit: string;
  projectMin: number;
  projectMax: number;
  insight: string;
  howToPresent: string;
  nextLevel: string;
}

export default function RateCalculatorPage() {
  const [form, setForm] = useState({
    skill: "",
    experience: "beginner",
    platform: "Upwork",
    projectType: "",
    clientLocation: "India",
  });
  const [result, setResult] = useState<RateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [howToOpen, setHowToOpen] = useState(false);

  // Pre-fill from user profile
  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((user) => {
        if (user.skill) setForm((f) => ({ ...f, skill: user.skill }));
        if (user.experienceLevel)
          setForm((f) => ({ ...f, experience: user.experienceLevel }));
        if (user.platforms?.[0])
          setForm((f) => ({ ...f, platform: user.platforms[0] }));
      })
      .catch(() => {});
  }, []);

  const calculate = async () => {
    if (!form.skill || !form.projectType) {
      setError("Please fill in Skill and Project Type.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/rate-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PillSelect = ({
    options,
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            value === opt
              ? "bg-violet-600 text-white border-violet-600 shadow-sm"
              : "border-[#E8E4DC] text-[#78716C] hover:border-violet-300 hover:text-violet-700"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <AppShell activePath="/rate-calculator">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1C1917]">💰 Know Your Worth</h1>
        <p className="text-sm text-[#78716C] mt-0.5">
          Real market rates for your skill — right now, powered by AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-5">
          {/* Skill */}
          <div>
            <label className="text-sm font-semibold text-[#1C1917] block mb-2">
              1. Your Skill
            </label>
            <div className="relative">
              <select
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                className="w-full appearance-none border border-[#E8E4DC] rounded-xl px-4 py-2.5 text-sm text-[#1C1917] bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
              >
                <option value="">Select your skill...</option>
                {SKILLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="text-sm font-semibold text-[#1C1917] block mb-2">
              2. Experience Level
            </label>
            <div className="space-y-2">
              {EXPERIENCE_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  onClick={() => setForm({ ...form, experience: lvl.value })}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                    form.experience === lvl.value
                      ? "border-violet-500 bg-violet-50 text-violet-800 font-semibold"
                      : "border-[#E8E4DC] text-[#78716C] hover:border-violet-200"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="text-sm font-semibold text-[#1C1917] block mb-2">
              3. Platform
            </label>
            <PillSelect
              options={PLATFORMS}
              value={form.platform}
              onChange={(v) => setForm({ ...form, platform: v })}
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="text-sm font-semibold text-[#1C1917] block mb-2">
              4. Project Type
            </label>
            <input
              value={form.projectType}
              onChange={(e) => setForm({ ...form, projectType: e.target.value })}
              placeholder="e.g. Logo Design, Blog Post, React Website"
              className="w-full border border-[#E8E4DC] rounded-xl px-4 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          {/* Client Location */}
          <div>
            <label className="text-sm font-semibold text-[#1C1917] block mb-2">
              5. Client Location
            </label>
            <PillSelect
              options={CLIENT_LOCATIONS}
              value={form.clientLocation}
              onChange={(v) => setForm({ ...form, clientLocation: v })}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            onClick={calculate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold text-sm transition-all shadow-md shadow-violet-200 btn-violet-glow"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Checking market rates...
              </>
            ) : (
              "💰 Calculate My Rate →"
            )}
          </button>
        </div>

        {/* Result */}
        <div>
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-2xl border-2 border-dashed border-[#E8E4DC]">
              <div className="text-5xl mb-3">💰</div>
              <h3 className="font-semibold text-[#1C1917] mb-1">Your rate will appear here</h3>
              <p className="text-sm text-[#78716C]">
                Fill in the form and click Calculate to see AI-powered market rates.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <Loader2 size={40} className="animate-spin text-violet-500 mb-3" />
              <p className="text-sm text-[#78716C]">Checking market rates...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Main rate card */}
              <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                <h3 className="text-sm font-semibold text-[#78716C] mb-3 uppercase tracking-wide">
                  Your Rate Range
                </h3>
                <div className="flex items-end gap-6 mb-4">
                  <div>
                    <p className="text-xs text-[#78716C]">Min</p>
                    <p className="text-2xl font-bold text-[#1C1917]">
                      {result.currency}{result.minRate}/{result.unit}
                    </p>
                  </div>
                  <div className="text-[#A8A29E] text-xl">→</div>
                  <div>
                    <p className="text-xs text-[#78716C]">Max</p>
                    <p className="text-2xl font-bold text-[#1C1917]">
                      {result.currency}{result.maxRate}/{result.unit}
                    </p>
                  </div>
                </div>

                {/* Sweet spot */}
                <div className="bg-amber-400 text-white rounded-xl px-4 py-3 text-center">
                  <p className="text-xs font-semibold opacity-80 uppercase tracking-wide mb-0.5">
                    Charge This ⭐
                  </p>
                  <p className="text-3xl font-black">
                    {result.currency}{result.sweetSpot}/{result.unit}
                  </p>
                </div>

                {/* Project rate */}
                <div className="mt-3 text-center text-sm text-amber-800">
                  Per project: <strong>{result.currency}{result.projectMin.toLocaleString("en-IN")}–{result.currency}{result.projectMax.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              {/* AI Insight */}
              <div className="rounded-2xl bg-white border border-[#E8E4DC] p-4">
                <h4 className="text-sm font-bold text-[#1C1917] mb-2">💡 Market Insight</h4>
                <p className="text-sm text-[#78716C] leading-relaxed">{result.insight}</p>
              </div>

              {/* How to present */}
              <div className="rounded-2xl bg-white border border-[#E8E4DC] p-4">
                <button
                  onClick={() => setHowToOpen(!howToOpen)}
                  className="w-full flex items-center justify-between text-sm font-bold text-[#1C1917]"
                >
                  <span>🗣️ How to Present This Rate</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#78716C] transition-transform ${howToOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {howToOpen && (
                  <div className="mt-3 bg-violet-50 border border-violet-100 rounded-xl p-3">
                    <p className="text-sm text-violet-900 italic leading-relaxed">
                      &ldquo;{result.howToPresent}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Next level */}
              <div className="rounded-2xl bg-white border border-[#E8E4DC] p-4">
                <h4 className="text-sm font-bold text-[#1C1917] mb-1">🚀 Next Level</h4>
                <p className="text-sm text-[#78716C]">{result.nextLevel}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
