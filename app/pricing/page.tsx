"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, GraduationCap } from "lucide-react";
import Script from "next/script";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (plan: "STUDENT" | "PRO") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Dr. Business",
        description: `${plan} Plan Subscription`,
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            window.location.href = "/dashboard";
          }
        },
        theme: { color: "#7C3AED" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert("Payment failed or gateway not configured.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 py-20 px-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in your execution.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your stage. Both plans include the full AI execution engine, daily tasks, and progress tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Student Plan */}
          <div className="bg-[#111118] border border-slate-800 rounded-3xl p-8 flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap className="w-24 h-24 text-blue-500" />
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-2">Student Plan</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">$9</span>
              <span className="text-slate-400">/mo</span>
              <span className="text-sm text-slate-500 ml-2">(₹749)</span>
            </div>
            
            <p className="text-sm text-blue-400 mb-8 font-medium">
              Requires valid .edu or .ac.in email
            </p>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Personalized 30-day plan",
                "Daily AI-generated tasks",
                "Full Tool Vault access",
                "Streak & XP tracking",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment("STUDENT")}
              disabled={!!loading}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === "STUDENT" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Student Plan"}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-[#1c1c28] to-[#111118] border border-blue-500/30 rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-blue-500/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600" />
            
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium w-fit mb-6 border border-blue-500/20">
              <Sparkles className="w-4 h-4" /> Most Popular
            </div>
            
            <h3 className="text-2xl font-semibold text-white mb-2">Pro Plan</h3>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-bold text-white">$19</span>
              <span className="text-slate-400">/mo</span>
              <span className="text-sm text-slate-500 ml-2">(₹1,585)</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Student",
                "Priority AI processing",
                "Advanced Market Insights",
                "Unlimited chat history",
                "Direct API access (Soon)",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment("PRO")}
              disabled={!!loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {loading === "PRO" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Pro Plan"}
            </button>
          </div>
        </div>
        
        <div className="mt-16 text-center text-sm text-slate-500">
          Secure payments powered by Razorpay. Entity: Builders Bazar.
        </div>
      </div>
    </div>
  );
}
