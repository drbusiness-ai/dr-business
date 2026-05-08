import { Metadata } from "next";
import { signIn } from "@/auth";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Dr. Business",
  description:
    "Log in to Dr. Business — India's AI Freelance Coach. Land your first client in 30 days.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center p-4">
      {/* Warm background blobs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[120px] opacity-40 pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-amber-100 rounded-full blur-[120px] opacity-50 pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-amber-400 text-white shadow-xl shadow-violet-200">
              <Sparkles size={26} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-[#1C1917] mb-1">Dr. Business</h1>
          <p className="text-[#78716C] text-sm">
            India&apos;s AI Freelance Coach 🚀
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-7 shadow-lg shadow-stone-100">
          <h2 className="text-xl font-bold text-[#1C1917] mb-1 text-center">
            Start Your 30-Day Journey
          </h2>
          <p className="text-sm text-[#78716C] text-center mb-6">
            7-day free trial. No credit card needed.
          </p>

          {/* Google OAuth */}
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#FAFAF7] border-2 border-[#E8E4DC] hover:border-violet-300 text-[#1C1917] font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm group mb-4 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#E8E4DC]" />
            <span className="text-xs text-[#A8A29E] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#E8E4DC]" />
          </div>

          {/* Email Magic Link */}
          <form
            action={async (formData) => {
              "use server";
              await signIn("resend", formData);
            }}
            className="space-y-3"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#1C1917] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full border-2 border-[#E8E4DC] focus:border-violet-400 rounded-xl px-4 py-3 text-[#1C1917] text-sm placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-md shadow-violet-200"
            >
              Send Magic Link →
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#A8A29E]">
          Join 847+ freelancers building real income on Dr. Business 🚀
        </p>
      </div>
    </div>
  );
}
