"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Plus,
  X,
  Loader2,
  Copy,
  Check,
  Trash2,
  Trophy,
  RefreshCw,
} from "lucide-react";

type LeadStage =
  | "PROSPECT"
  | "PROPOSAL_SENT"
  | "IN_CONVERSATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

interface Lead {
  id: string;
  clientName: string;
  platform: string;
  projectType?: string;
  description?: string;
  stage: LeadStage;
  lastContactAt: string;
  won: boolean;
  wonAmount?: number;
  createdAt: string;
}

const COLUMNS: { stage: LeadStage; label: string; emoji: string; color: string; bg: string }[] = [
  { stage: "PROSPECT", label: "Prospect", emoji: "📋", color: "text-stone-600", bg: "bg-stone-50 border-stone-200" },
  { stage: "PROPOSAL_SENT", label: "Proposal Sent", emoji: "📤", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { stage: "IN_CONVERSATION", label: "Talking", emoji: "💬", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  { stage: "CLOSED_WON", label: "Won 🎉", emoji: "🤝", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { stage: "CLOSED_LOST", label: "Lost", emoji: "❌", color: "text-red-500", bg: "bg-red-50 border-red-200" },
];

const PLATFORMS = ["Upwork", "Fiverr", "LinkedIn", "Direct", "Instagram", "Other"];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [followupLoading, setFollowupLoading] = useState<string | null>(null);
  const [followupMsg, setFollowupMsg] = useState<{ id: string; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [wonModal, setWonModal] = useState<{ id: string; name: string } | null>(null);
  const [wonAmount, setWonAmount] = useState("");

  const [form, setForm] = useState({
    clientName: "",
    platform: "Upwork",
    projectType: "",
    description: "",
  });
  const [adding, setAdding] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/crm");
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async () => {
    if (!form.clientName || !form.platform) return;
    setAdding(true);
    const res = await fetch("/api/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newLead = await res.json();
    setLeads((prev) => [newLead, ...prev]);
    setForm({ clientName: "", platform: "Upwork", projectType: "", description: "" });
    setShowAddModal(false);
    setAdding(false);
  };

  const updateStage = async (id: string, stage: LeadStage) => {
    if (stage === "CLOSED_WON") {
      const lead = leads.find((l) => l.id === id);
      if (lead) setWonModal({ id, name: lead.clientName });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    await fetch(`/api/crm/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
  };

  const confirmWon = async () => {
    if (!wonModal) return;
    const { id } = wonModal;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, stage: "CLOSED_WON", won: true, wonAmount: Number(wonAmount) } : l
      )
    );
    await fetch(`/api/crm/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "CLOSED_WON", wonAmount: Number(wonAmount) }),
    });
    setWonModal(null);
    setWonAmount("");
  };

  const deleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/crm/${id}`, { method: "DELETE" });
  };

  const generateFollowup = async (id: string) => {
    setFollowupLoading(id);
    const res = await fetch(`/api/crm/followup/${id}`, { method: "POST" });
    const data = await res.json();
    setFollowupMsg({ id, msg: data.message });
    setFollowupLoading(null);
  };

  const copyFollowup = () => {
    if (followupMsg) {
      navigator.clipboard.writeText(followupMsg.msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const daysSince = (dateStr: string) => {
    const days = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / 86400000
    );
    return days;
  };

  // Drag and drop
  const onDragStart = (id: string) => setDraggedId(id);
  const onDrop = (stage: LeadStage) => {
    if (draggedId) {
      updateStage(draggedId, stage);
      setDraggedId(null);
    }
  };

  return (
    <AppShell activePath="/crm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1917]">📊 My Client Pipeline</h1>
          <p className="text-sm text-[#78716C] mt-0.5">
            Track every lead until it closes. {leads.filter((l) => l.won).length} clients won so far 🏆
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all shadow-md shadow-violet-200"
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-violet-500" size={32} />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
          {COLUMNS.map((col) => {
            const colLeads = leads.filter((l) => l.stage === col.stage);
            return (
              <div
                key={col.stage}
                className="flex-shrink-0 w-64"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(col.stage)}
              >
                <div className={`rounded-2xl border-2 ${col.bg} p-3 h-full min-h-96`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{col.emoji}</span>
                      <h3 className={`text-sm font-bold ${col.color}`}>{col.label}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white border ${col.color}`}>
                      {colLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {colLeads.map((lead) => {
                      const days = daysSince(lead.lastContactAt);
                      const needsFollowup = lead.stage === "PROPOSAL_SENT" && days >= 2;

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => onDragStart(lead.id)}
                          className="bg-white rounded-xl border border-[#E8E4DC] p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#1C1917] text-sm truncate">
                                {lead.clientName}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                <span className="text-xs bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded-full border border-violet-100">
                                  {lead.platform}
                                </span>
                                {lead.projectType && (
                                  <span className="text-xs text-[#78716C] truncate">
                                    {lead.projectType}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-red-400 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <p className="text-xs text-[#A8A29E] mt-1.5">
                            {days === 0 ? "Today" : `${days}d ago`}
                          </p>

                          {lead.won && lead.wonAmount && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                              <Trophy size={11} />
                              ₹{lead.wonAmount.toLocaleString("en-IN")}
                            </div>
                          )}

                          {needsFollowup && (
                            <div className="mt-2">
                              <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                                ⏰ Follow up!
                              </span>
                              <button
                                onClick={() => generateFollowup(lead.id)}
                                disabled={followupLoading === lead.id}
                                className="mt-2 w-full flex items-center justify-center gap-1 text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg py-1.5 transition-colors"
                              >
                                {followupLoading === lead.id ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  <RefreshCw size={11} />
                                )}
                                Generate Follow-up
                              </button>
                            </div>
                          )}

                          {/* Stage change quick buttons */}
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {COLUMNS.filter((c) => c.stage !== lead.stage).slice(0, 2).map((c) => (
                              <button
                                key={c.stage}
                                onClick={() => updateStage(lead.id, c.stage)}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F5F4] hover:bg-violet-50 text-[#78716C] hover:text-violet-700 border border-[#E8E4DC] transition-colors"
                              >
                                → {c.label.replace(" 🎉", "")}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {colLeads.length === 0 && (
                      <div className="text-center py-8 text-xs text-[#A8A29E]">
                        Drop leads here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[#E8E4DC]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1C1917]">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg text-[#78716C] hover:bg-[#F5F5F4]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-[#1C1917] block mb-1">Client Name *</label>
                <input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1C1917] block mb-1">Platform *</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm({ ...form, platform: p })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        form.platform === p
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-[#E8E4DC] text-[#78716C] hover:border-violet-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1C1917] block mb-1">Project Type</label>
                <input
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  placeholder="e.g. Logo Design, Web Development"
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#1C1917] block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief note about this lead..."
                  rows={3}
                  className="w-full border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                />
              </div>
            </div>

            <button
              onClick={addLead}
              disabled={adding || !form.clientName}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold transition-all"
            >
              {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Add Lead
            </button>
          </div>
        </div>
      )}

      {/* Follow-up Message Modal */}
      {followupMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setFollowupMsg(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-[#E8E4DC]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#1C1917]">✉️ AI Follow-up Message</h2>
              <button onClick={() => setFollowupMsg(null)} className="p-1.5 rounded-lg text-[#78716C] hover:bg-[#F5F5F4]">
                <X size={16} />
              </button>
            </div>
            <div className="bg-[#FAFAF7] border border-[#E8E4DC] rounded-xl p-4 text-sm text-[#1C1917] leading-relaxed mb-4">
              {followupMsg.msg}
            </div>
            <button
              onClick={copyFollowup}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy Message"}
            </button>
          </div>
        </div>
      )}

      {/* Won Celebration Modal */}
      {wonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-emerald-200 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-[#1C1917] mb-1">Amazing Work!</h2>
            <p className="text-sm text-[#78716C] mb-4">
              You landed <strong>{wonModal.name}</strong> as a client! How much did you earn?
            </p>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C] font-bold">₹</span>
              <input
                value={wonAmount}
                onChange={(e) => setWonAmount(e.target.value)}
                type="number"
                placeholder="5000"
                className="w-full pl-8 pr-4 py-3 border-2 border-emerald-200 rounded-xl text-[#1C1917] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-300 text-center"
              />
            </div>
            <button
              onClick={confirmWon}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all mb-2"
            >
              🏆 Save Win (+100 XP)
            </button>
            <button
              onClick={() => setWonModal(null)}
              className="w-full py-2 text-sm text-[#78716C] hover:text-[#1C1917]"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
