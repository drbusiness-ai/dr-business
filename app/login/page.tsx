import { Metadata } from "next";
import { signIn } from "@/auth";
import { LogIn, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Dr. Business",
  description: "Log in to your Dr. Business account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Welcome Back</h1>
          <p className="text-slate-400">Log in to continue executing your plan.</p>
        </div>

        <div className="bg-[#111118] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form
            action={async (formData) => {
              "use server";
              await signIn("resend", formData);
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full bg-[#0a0a0f] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Continue with Email
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-sm text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full bg-[#1e1e24] hover:bg-[#25252b] border border-slate-800 text-slate-200 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Join 2,400+ freelancers building real income.</p>
          <p className="mt-2 text-slate-600 font-medium">Powered by Builders Bazar</p>
        </div>
      </div>
    </div>
  );
}
