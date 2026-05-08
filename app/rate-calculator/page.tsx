"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, Loader2, Sparkles, DollarSign } from "lucide-react";
import Link from "next/link";

interface RateResult {
  minRate: string;
  maxRate: string;
  sweetSpotRate: string;
  projectRateRange: string;
  marketInsight: string;
  presentationScript: string;
}

const platforms = ["Upwork", "Fiverr", "LinkedIn", "Direct"];
const clientLocations = ["India", "USA", "UK", "Australia", "Global"];
const projectTypesMap: Record<string, string[]> = {
  "Copywriting": ["Landing Page", "Email Sequence", "Blog Post", "Ad Copy"],
  "Design": ["Logo Design", "UI/UX", "Social Media Graphics", "Full Website"],
  "Development": ["Web App", "Mobile App", "Bug Fixes", "API Integration"],
  "Video Editing": ["Short Form (Reels/Shorts)", "YouTube Long Form", "Vlog", "Ad Creative"],
  "Default": ["Small Project", "Medium Project", "Large Project", "Retainer"]
};

export default function RateCalculatorPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [result, setResult] = useState<RateResult | null>(null);

  const [formData, setFormData] = useState({
    skill: "",
    experience: "",
    platform: "",
    projectType: "",
    clientLocation: ""
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            skill: data.skill || "",
            experience: data.experienceLevel || ""
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsFetchingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const getProjectTypes = () => {
    for (const key in projectTypesMap) {
      if (formData.skill.toLowerCase().includes(key.toLowerCase())) {
        return projectTypesMap[key];
      }
    }
    return projectTypesMap["Default"];
  };

  const calculateRate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rate-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setStep(6);
      } else {
        alert("Failed to calculate rate");
      }
    } catch (error) {
      console.error("Rate calculation error", error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] pt-20 pb-12 px-4 max-w-lg mx-auto sm:max-w-xl text-[#1C1917]">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-amber-500" />
          Rate Calculator
        </h1>
      </div>

      {step < 6 && (
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm">
          <div className="mb-6 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-amber-500' : 'bg-slate-100'}`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-2">What is your core skill?</h2>
                <p className="text-sm text-slate-500">We pre-filled this from your profile.</p>
              </div>
              <input
                type="text"
                value={formData.skill}
                onChange={(e) => setFormData({...formData, skill: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-[#1C1917]"
                placeholder="e.g. UX Design, Copywriting..."
              />
              <button
                onClick={handleNext}
                disabled={!formData.skill}
                className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-2">Experience level?</h2>
                <p className="text-sm text-slate-500">Be honest, clients pay for outcomes.</p>
              </div>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 appearance-none text-[#1C1917]"
              >
                <option value="" disabled>Select experience...</option>
                <option value="Beginner (0-1 year)">Beginner (0-1 year)</option>
                <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
                <option value="Advanced (3-5 years)">Advanced (3-5 years)</option>
                <option value="Expert (5+ years)">Expert (5+ years)</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.experience}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-2">Where are you finding this client?</h2>
                <p className="text-sm text-slate-500">Rates vary wildly by platform.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setFormData({...formData, platform: p})}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      formData.platform === p
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#E8E4DC]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleBack} className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">Back</button>
                <button
                  onClick={handleNext}
                  disabled={!formData.platform}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-2">What's the project type?</h2>
                <p className="text-sm text-slate-500">Select what matches closest.</p>
              </div>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 appearance-none text-[#1C1917]"
              >
                <option value="" disabled>Select project type...</option>
                {getProjectTypes().map(pt => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button onClick={handleBack} className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">Back</button>
                <button
                  onClick={handleNext}
                  disabled={!formData.projectType}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-bold mb-2">Client location?</h2>
                <p className="text-sm text-slate-500">Purchasing power determines budget.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {clientLocations.map(cl => (
                  <button
                    key={cl}
                    onClick={() => setFormData({...formData, clientLocation: cl})}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      formData.clientLocation === cl
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-[#E8E4DC]'
                    }`}
                  >
                    {cl}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleBack} className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors">Back</button>
                <button
                  onClick={calculateRate}
                  disabled={!formData.clientLocation || isLoading}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Get My Rate</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results View */}
      {step === 6 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

          {/* Main Rate Card */}
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <h2 className="text-slate-500 font-medium mb-1 text-sm uppercase tracking-wider">Your Sweet Spot Rate</h2>
            <div className="text-5xl font-black text-[#1C1917] mb-6">
              {result.sweetSpotRate}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs mb-1">Hourly Range</p>
                <p className="text-[#1C1917] font-semibold">{result.minRate} - {result.maxRate}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-slate-500 text-xs mb-1">Per Project Range</p>
                <p className="text-[#1C1917] font-semibold">{result.projectRateRange}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-700">Dr. Business Insight</span>
              </div>
              <p className="text-amber-900/80 text-sm leading-relaxed">
                {result.marketInsight}
              </p>
            </div>
          </div>

          {/* Presentation Script */}
          <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-[#1C1917]">
              How to Present This Rate
            </h3>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
              <p className="text-slate-600 italic text-[15px] leading-relaxed">
                "{result.presentationScript}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full py-4 text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            Calculate Another Rate
          </button>
        </div>
      )}
    </div>
  );
}
