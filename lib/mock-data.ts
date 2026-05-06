import {
  LayoutDashboard,
  CheckSquare,
  Bot,
  Archive,
  TrendingUp,
} from "lucide-react";

// ─── User Profile ───────────────────────────────────────────────────────────
export const user = {
  name: "Aqib",
  skill: "Graphic Design",
  hoursPerDay: 2,
  experience: "Beginner",
  device: "Laptop/Desktop",
  incomeGoal: "₹25,000",
  streak: 7,
  xp: 1240,
  level: 4,
  firstClientProgress: 42,
  tasksCompleted: 23,
  proposalsSent: 5,
  profileCompletion: 68,
  daysActive: 12,
};

// ─── Nav Items ───────────────────────────────────────────────────────────────
export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Daily Tasks", href: "/tasks", icon: CheckSquare },
  { label: "AI Coach", href: "/coach", icon: Bot },
  { label: "Tool Vault", href: "/vault", icon: Archive },
  { label: "My Progress", href: "/progress", icon: TrendingUp },
];

// ─── Tasks ───────────────────────────────────────────────────────────────────
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  title: string;
  why: string;
  duration: string;
  priority: Priority;
  completed: boolean;
}

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Optimize Upwork Headline",
    why: "First impression = more clicks from clients",
    duration: "15 min",
    priority: "High",
    completed: false,
  },
  {
    id: "t2",
    title: "Create 1 Portfolio Sample",
    why: "Proof of work = trust = conversions",
    duration: "45 min",
    priority: "High",
    completed: false,
  },
  {
    id: "t3",
    title: "Send 5 Cold DMs on LinkedIn",
    why: "Outreach = pipeline = income",
    duration: "20 min",
    priority: "High",
    completed: true,
  },
  {
    id: "t4",
    title: "Write a LinkedIn Post",
    why: "Visibility = inbound leads without effort",
    duration: "25 min",
    priority: "Medium",
    completed: false,
  },
  {
    id: "t5",
    title: "Research 3 Competitors",
    why: "Know your market = better pricing strategy",
    duration: "20 min",
    priority: "Medium",
    completed: false,
  },
  {
    id: "t6",
    title: "Update Profile Photo",
    why: "Professional photo = 40% more client responses",
    duration: "10 min",
    priority: "Low",
    completed: true,
  },
];

// ─── Milestones ───────────────────────────────────────────────────────────────
export type MilestoneStatus = "completed" | "active" | "locked";

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  progress?: number;
  total?: number;
}

export const milestones: Milestone[] = [
  {
    id: "m1",
    title: "Profile Setup Complete",
    description: "Your foundation is set. Clients can find you.",
    status: "completed",
  },
  {
    id: "m2",
    title: "First Portfolio Sample",
    description: "You proved you can do the work.",
    status: "completed",
  },
  {
    id: "m3",
    title: "Send 10 Proposals",
    description: "Fill your pipeline with real opportunities.",
    status: "active",
    progress: 5,
    total: 10,
  },
  {
    id: "m4",
    title: "Get First Response",
    description: "A client replied — now close the deal.",
    status: "locked",
  },
  {
    id: "m5",
    title: "Land First Client",
    description: "₹0 → First paid freelance project.",
    status: "locked",
  },
];

// ─── Chat Messages ────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export const chatMessages: ChatMessage[] = [
  {
    id: "c1",
    role: "user",
    content: "Help me get my first client",
    timestamp: "10:32 AM",
  },
  {
    id: "c2",
    role: "ai",
    content: `Based on your skill (Graphic Design) and 2 hours/day availability, here's your exact action plan for the next 7 days:

**Day 1–2:** Optimize your Upwork profile headline and bio. Use keywords like "Brand Identity Designer" or "Social Media Graphics Expert."

**Day 3–4:** Create 2 portfolio samples using Canva or Figma. Pick a real local business and redesign their social post — this shows initiative.

**Day 5–6:** Send 10 targeted proposals with personalized intros. Reference the client's brand specifically — this alone triples response rates.

**Day 7:** Follow up on all proposals + apply to 5 more fresh listings.

Your pricing sweet spot right now: ₹1,500–₹3,000 per project. Don't underprice — clients associate price with quality. You're not competing on cost, you're competing on clarity.`,
    timestamp: "10:32 AM",
  },
  {
    id: "c3",
    role: "user",
    content: "What should I charge for a logo design?",
    timestamp: "10:35 AM",
  },
  {
    id: "c4",
    role: "ai",
    content: `Logo pricing depends on your stage and positioning. Here's a real breakdown:

**Beginner (first 5 clients):** ₹800–₹2,000 — build portfolio, collect reviews, refine your process.

**Intermediate (5–20 clients):** ₹2,500–₹6,000 — you now have social proof. Charge for it.

**Established (20+ clients):** ₹8,000–₹25,000+ — brand identity packages, not just logos.

For now, I'd recommend pricing at ₹1,500 for your first 3 clients. Deliver exceptional quality, get testimonials, then raise to ₹3,500. The goal isn't max income today — it's building leverage for next month.`,
    timestamp: "10:36 AM",
  },
];

// ─── Tool Categories ──────────────────────────────────────────────────────────
export interface Tool {
  id: string;
  name: string;
  description: string;
  badge: "Free" | "Free/Paid" | "Paid";
  url: string;
  emoji: string;
  category: string;
}

export const tools: Tool[] = [
  // Portfolio
  {
    id: "tool1",
    name: "Behance",
    description: "Best platform to showcase design work to global clients",
    badge: "Free",
    url: "https://behance.net",
    emoji: "🎨",
    category: "Portfolio",
  },
  {
    id: "tool2",
    name: "Dribbble",
    description: "Premium portfolio destination for top designers",
    badge: "Free/Paid",
    url: "https://dribbble.com",
    emoji: "🏀",
    category: "Portfolio",
  },
  {
    id: "tool3",
    name: "Canva",
    description: "Create stunning portfolio samples in minutes",
    badge: "Free/Paid",
    url: "https://canva.com",
    emoji: "✨",
    category: "Portfolio",
  },
  // Outreach
  {
    id: "tool4",
    name: "LinkedIn",
    description: "Primary B2B outreach and personal branding channel",
    badge: "Free",
    url: "https://linkedin.com",
    emoji: "💼",
    category: "Outreach",
  },
  {
    id: "tool5",
    name: "Hunter.io",
    description: "Find verified email addresses of potential clients",
    badge: "Free/Paid",
    url: "https://hunter.io",
    emoji: "🔍",
    category: "Outreach",
  },
  {
    id: "tool6",
    name: "Lemlist",
    description: "Automated cold email sequences with personalization",
    badge: "Paid",
    url: "https://lemlist.com",
    emoji: "📧",
    category: "Outreach",
  },
  // Proposals
  {
    id: "tool7",
    name: "Upwork",
    description: "Largest freelance marketplace with global clients",
    badge: "Free",
    url: "https://upwork.com",
    emoji: "🌍",
    category: "Proposals",
  },
  {
    id: "tool8",
    name: "Fiverr",
    description: "Perfect entry point for beginners to get first orders",
    badge: "Free",
    url: "https://fiverr.com",
    emoji: "🟢",
    category: "Proposals",
  },
  {
    id: "tool9",
    name: "Proposify",
    description: "Create polished, professional client proposals",
    badge: "Paid",
    url: "https://proposify.com",
    emoji: "📄",
    category: "Proposals",
  },
  // Productivity
  {
    id: "tool10",
    name: "Notion",
    description: "Track clients, tasks, and freelance pipeline",
    badge: "Free",
    url: "https://notion.so",
    emoji: "📓",
    category: "Productivity",
  },
  {
    id: "tool11",
    name: "Toggl",
    description: "Track billable hours and improve time estimation",
    badge: "Free",
    url: "https://toggl.com",
    emoji: "⏱️",
    category: "Productivity",
  },
  {
    id: "tool12",
    name: "Calendly",
    description: "Let clients book discovery calls without back-and-forth",
    badge: "Free",
    url: "https://calendly.com",
    emoji: "📅",
    category: "Productivity",
  },
];

// ─── Badges ───────────────────────────────────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: boolean;
  earnedDate?: string;
}

export const badges: Badge[] = [
  {
    id: "b1",
    name: "Early Bird",
    description: "Completed your first task within 24 hours of joining",
    emoji: "🌅",
    earned: true,
    earnedDate: "Apr 30, 2026",
  },
  {
    id: "b2",
    name: "Streak Master",
    description: "Maintained a 7-day execution streak",
    emoji: "🔥",
    earned: true,
    earnedDate: "May 6, 2026",
  },
  {
    id: "b3",
    name: "Portfolio Pro",
    description: "Created your first 3 portfolio samples",
    emoji: "🎨",
    earned: true,
    earnedDate: "May 4, 2026",
  },
  {
    id: "b4",
    name: "Outreach King",
    description: "Sent 25+ proposals across platforms",
    emoji: "👑",
    earned: false,
  },
  {
    id: "b5",
    name: "First Reply",
    description: "Got your first positive client response",
    emoji: "📩",
    earned: false,
  },
];

// ─── Streak Data (last 30 days) ───────────────────────────────────────────────
export interface StreakDay {
  date: string;
  active: boolean;
}

function generateStreakData(): StreakDay[] {
  const days: StreakDay[] = [];
  const now = new Date(2026, 4, 6); // May 6, 2026
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Last 7 days = all active, before that = ~70% chance
    const isRecent = i < 7;
    const active = isRecent ? true : Math.random() > 0.35;
    days.push({ date: dateStr, active });
  }
  return days;
}

export const streakData: StreakDay[] = [
  { date: "2026-04-07", active: true },
  { date: "2026-04-08", active: false },
  { date: "2026-04-09", active: true },
  { date: "2026-04-10", active: true },
  { date: "2026-04-11", active: false },
  { date: "2026-04-12", active: true },
  { date: "2026-04-13", active: true },
  { date: "2026-04-14", active: true },
  { date: "2026-04-15", active: false },
  { date: "2026-04-16", active: true },
  { date: "2026-04-17", active: false },
  { date: "2026-04-18", active: true },
  { date: "2026-04-19", active: true },
  { date: "2026-04-20", active: false },
  { date: "2026-04-21", active: true },
  { date: "2026-04-22", active: true },
  { date: "2026-04-23", active: false },
  { date: "2026-04-24", active: true },
  { date: "2026-04-25", active: true },
  { date: "2026-04-26", active: true },
  { date: "2026-04-27", active: false },
  { date: "2026-04-28", active: true },
  { date: "2026-04-29", active: true },
  { date: "2026-04-30", active: true },
  { date: "2026-05-01", active: true },
  { date: "2026-05-02", active: true },
  { date: "2026-05-03", active: true },
  { date: "2026-05-04", active: true },
  { date: "2026-05-05", active: true },
  { date: "2026-05-06", active: true },
];

// ─── XP History (last 7 days) ─────────────────────────────────────────────────
export interface XPDay {
  day: string;
  xp: number;
}

export const xpHistory: XPDay[] = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 200 },
  { day: "Wed", xp: 80 },
  { day: "Thu", xp: 240 },
  { day: "Fri", xp: 180 },
  { day: "Sat", xp: 300 },
  { day: "Sun", xp: 120 },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = [
  {
    id: "tm1",
    name: "Priya Sharma",
    role: "Graphic Designer → ₹35K/mo",
    avatar: "PS",
    content:
      "I spent 6 months watching YouTube tutorials and going nowhere. Dr. Business gave me a real daily plan. In 3 weeks, I landed my first Upwork client. The AI coach is like having a mentor on call 24/7.",
  },
  {
    id: "tm2",
    name: "Rohan Verma",
    role: "Video Editor → ₹22K/mo",
    avatar: "RV",
    content:
      "The streak system kept me accountable when no one else would. I completed my tasks every day for 21 days and landed 2 clients from LinkedIn alone. This is the most practical tool I've ever used.",
  },
  {
    id: "tm3",
    name: "Ananya Nair",
    role: "Copywriter → ₹18K/mo",
    avatar: "AN",
    content:
      "I was a complete beginner — zero experience, zero portfolio. The onboarding flow gave me a 30-day roadmap that actually made sense. I followed it step by step and got my first paid project in 25 days.",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Do I need any prior experience to start?",
    a: "No. Dr. Business is designed for complete beginners. The onboarding flow identifies your skill level and builds a personalized plan from ground zero.",
  },
  {
    q: "Is this a course? Will I be watching videos?",
    a: "Absolutely not. Dr. Business is an execution system — not another course. You get daily tasks, an AI coach, and real-time progress tracking. No passive consumption.",
  },
  {
    q: "How long until I get my first client?",
    a: "Most users following the system consistently land their first client in 21–30 days. Results depend on your effort, skill, and how consistently you complete daily tasks.",
  },
  {
    q: "What freelance skills does Dr. Business support?",
    a: "Currently supporting: Graphic Design, Video Editing, Copywriting, Web Development, Social Media Management, and UI/UX Design. More skills coming soon.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "The Free plan gives you the core execution system, daily tasks, and basic AI coaching. Pro unlocks unlimited AI coaching, advanced analytics, priority support, and exclusive client-finding strategies.",
  },
];
