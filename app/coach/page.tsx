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
        <h1 className="text-3xl font-black text-[#1C1917] mb-1">AI Coach</h1>
        <p className="text-[#78716C] font-medium">
          Your personal freelance strategist. Ask anything — get real answers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Chat area */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden bg-white shadow-md">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 app-scrollbar bg-[#FAFAF7]">
              {messages.length === 0 && !isTyping && (
                <div className="h-full flex flex-col items-center justify-center text-[#78716C]">
                  <div className="grid size-16 place-items-center rounded-2xl bg-violet-100 text-violet-500 mb-4 shadow-inner">
                    <Bot size={32} />
                  </div>
                  <p className="font-bold">Send a message to start your coaching session.</p>
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
                      "grid size-8 flex-shrink-0 place-items-center rounded-full shadow-sm",
                      msg.role === "user"
                        ? "bg-[#1C1917] text-white"
                        : "bg-gradient-to-br from-violet-600 to-amber-400 text-white"
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
                      "max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm",
                      msg.role === "user"
                        ? "bg-[#1C1917] text-white rounded-tr-sm"
                        : "bg-white border border-[#E8E4DC] text-[#1C1917] rounded-tl-sm"
                    )}
                  >
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                    <p className={cn("mt-1.5 text-[10px] font-bold uppercase", msg.role === "user" ? "text-stone-400" : "text-[#A8A29E]")}>
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
                  <div className="grid size-8 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-amber-400 text-white shadow-sm">
                    <Bot size={15} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white border border-[#E8E4DC] px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-2 w-2 rounded-full bg-violet-400 animate-bounce"
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
            <div className="border-t border-[#E8E4DC] bg-white p-4 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder="Ask your AI coach anything..."
                className="flex-1 rounded-xl border-2 border-[#E8E4DC] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1C1917] placeholder-[#A8A29E] font-medium outline-none focus:border-violet-300 focus:bg-white transition-all"
                disabled={isTyping || !user}
              />
              <Button
                size="icon"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping || !user}
                className="size-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md flex-shrink-0"
              >
                <Send size={18} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Context panel */}
        <div className="space-y-4">
          <Card className="p-6 bg-white border-[#E8E4DC] shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={18} className="text-amber-500" />
              <p className="text-xs font-black uppercase tracking-widest text-[#1C1917]">
                Your Context
              </p>
            </div>
            {!user ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                {[
                  ["Skill", user.skill],
                  ["Goal", user.incomeGoal + " in 30 days"],
                  ["Streak", `🔥 ${user.currentStreak} days`],
                  ["Level", `Level ${user.level}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-[#F5F5F4] last:border-0 last:pb-0">
                    <span className="text-[#78716C] font-medium">{k}</span>
                    <span className="text-[#1C1917] font-bold bg-[#FAFAF7] px-2 py-1 rounded-lg border border-[#E8E4DC]">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-white border-[#E8E4DC] shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-[#1C1917] mb-4">
              Suggested Prompts
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isTyping || !user}
                  className="w-full rounded-xl border-2 border-[#E8E4DC] bg-[#FAFAF7] px-4 py-3 text-left text-sm font-semibold text-[#78716C] hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all disabled:opacity-50"
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
