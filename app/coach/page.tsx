"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

const SUGGESTED_PROMPTS = [
  "What should I charge for this?",
  "Review my proposal",
  "Help me get my first client",
  "Give me an outreach script",
  "What to post on LinkedIn today?",
];

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial data
    Promise.all([
      fetch("/api/user/me").then((res) => res.json()),
      fetch("/api/coach/chat").then((res) => res.json()),
    ])
      .then(([userData, messagesData]) => {
        if (!userData.error) setUser(userData);
        if (Array.isArray(messagesData)) setMessages(messagesData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const reader = response.body?.getReader();
      if (!reader) return;

      let aiText = "";
      const aiMsgId = `temp-ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        aiText += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, content: aiText } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      // Fallback or error message could go here
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppShell activePath="/coach">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">AI Coach</h1>
        <p className="text-slate-400">
          Your personal freelance strategist. Ask anything — get real answers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Chat area */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 app-scrollbar">
              {messages.length === 0 && !isTyping && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Bot size={48} className="mb-4 text-sky-500/20" />
                  <p>Send a message to start your coaching session.</p>
                </div>
              )}

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
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask your AI coach anything..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/20"
                disabled={isTyping || !user}
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping || !user}
              >
                <Send size={16} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Context panel */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-violet-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                Your Context
              </p>
            </div>
            {!user ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {[
                  ["Skill", user.skill],
                  ["Goal", user.incomeGoal + " in 30 days"],
                  ["Streak", `🔥 ${user.currentStreak} days`],
                  ["Level", `Level ${user.level}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Suggested Prompts
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isTyping || !user}
                  className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-left text-xs text-slate-300 hover:border-sky-400/30 hover:bg-sky-400/5 hover:text-white transition-all disabled:opacity-50"
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
