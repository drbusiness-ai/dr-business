"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { chatMessages, user } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/mock-data";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { cn } from "@/components/ui/utils";

const SUGGESTED_PROMPTS = [
  "What should I charge for this?",
  "Review my proposal",
  "Help me get my first client",
  "Give me an outreach script",
  "What to post on LinkedIn today?",
];

const MOCK_RESPONSES: Record<string, string> = {
  "What should I charge for this?": `For Graphic Design at your level, here's a realistic pricing framework:

**Logo Design:** ₹1,500–₹3,000 (beginner) → ₹8,000+ (established)
**Social Media Posts (10):** ₹2,000–₹5,000/month
**Brand Identity Package:** ₹8,000–₹25,000

Start at the lower end of each range, deliver exceptional quality, collect 3–5 testimonials, then raise prices by 50%. Most clients associate higher prices with higher quality — so never race to the bottom.`,

  "Review my proposal": `Here's what makes a winning proposal:

1. **Open with their problem**, not your skills. "I noticed your social media posts lack consistent branding..."
2. **Show relevant work** — 1–2 samples that match what they're asking for
3. **State a clear deliverable** with a timeline: "5 social media posts designed and delivered in 3 days"
4. **End with a question** to start a conversation: "Would a quick 10-minute call work this week?"

Avoid: generic intros, spelling errors, pricing in the first message.`,

  "Help me get my first client": chatMessages[1].content,

  "Give me an outreach script": `Here's a proven DM template for LinkedIn:

---
Hi [Name],

I noticed [Company] is growing its social media presence — your content is solid, but I think consistent branded visuals could 2x your engagement.

I'm a Graphic Designer specializing in social content for [niche]. I recently helped a similar brand increase their LinkedIn impressions by 40%.

Would you be open to a quick 10-minute call this week?

[Your name]

---

Key: personalize line 2 for each prospect. Generic = ignored.`,

  "What to post on LinkedIn today?": `Here's a post that will perform well for a Graphic Designer:

---
📌 I redesigned [Brand X]'s social presence in 48 hours.

Before: Inconsistent colors. No brand identity. Low engagement.
After: Clean templates. Recognizable aesthetic. 3x more saves.

The difference? Systems, not just design skills.

If you're a business owner struggling with inconsistent branding, DM me. I'll do a free 15-minute brand audit this week.

---

Post at 8–9 AM or 6–7 PM for maximum reach. Add 1–2 images or a before/after graphic.`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key.toLowerCase().substring(0, 15))) return val;
  }
  return `Great question! Based on your focus on ${user.skill} and your goal of ${user.incomeGoal} in 30 days, here's my honest take:

The fastest path forward right now is to stop optimizing and start sending. Most beginners overthink their portfolio or profile before they've even tested the market.

**My recommendation for the next 48 hours:**
1. Send 5 targeted proposals with your best 1–2 samples
2. Post one LinkedIn piece showing your process or a transformation
3. Follow up on any previous outreach you've done

The market will give you better feedback than any course or AI. Go test it.`;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "ai",
        content: getAIResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">AI Coach</h1>
        <p className="text-slate-400">
          Your personal freelance strategist. Ask anything — get real answers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Chat area */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 app-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "grid size-8 flex-shrink-0 place-items-center rounded-full",
                      msg.role === "user"
                        ? "bg-sky-400/20 text-sky-300"
                        : "bg-violet-400/20 text-violet-300"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User size={15} />
                    ) : (
                      <Bot size={15} />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      msg.role === "user"
                        ? "bg-sky-500/20 text-white"
                        : "bg-white/5 text-slate-200"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{msg.timestamp}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="grid size-8 flex-shrink-0 place-items-center rounded-full bg-violet-400/20 text-violet-300">
                    <Bot size={15} />
                  </div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Ask your AI coach anything..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/20"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
              >
                <Send size={16} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Context panel */}
        <div className="space-y-4">
          {/* User context */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-violet-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                Your Context
              </p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Skill", user.skill],
                ["Goal", user.incomeGoal + " in 30 days"],
                ["Streak", `🔥 ${user.streak} days`],
                ["Level", `Level ${user.level}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Suggested prompts */}
          <Card className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Suggested Prompts
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-left text-xs text-slate-300 hover:border-sky-400/30 hover:bg-sky-400/5 hover:text-white transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
