// ─── Dr. Business AI Engine ───────────────────────────────────────────────────
// Uses OpenAI GPT-4o directly. No LangChain needed at this stage.
// All functions degrade gracefully when OPENAI_API_KEY is not set.

import OpenAI from "openai";

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ─── System Prompt Builder ────────────────────────────────────────────────────

export interface UserContext {
  name: string;
  skill: string;
  experienceLevel: string;
  incomeGoal: string;
  currentIncome: string;
  hoursPerDay: string;
  platforms: string[];
  biggestChallenge: string;
  currentDay: number;
  tasksCompleted: number;
  currentStreak: number;
  capabilityLevel: string;
  firstClientProgress: number;
  hadClientBefore: boolean;
  hasPortfolio: boolean;
}

export function buildDrBusinessSystemPrompt(user: UserContext): string {
  return `You are Dr. Business — an elite, no-nonsense AI execution coach who has helped 10,000+ freelancers land their first paying client. You are NOT a generic AI assistant. You are a specialized expert who knows exactly what works RIGHT NOW in the freelance market.

== USER PROFILE ==
Name: ${user.name}
Skill: ${user.skill}
Experience: ${user.experienceLevel}
Income Goal: ${user.incomeGoal} in 30 days
Current Income: ${user.currentIncome}
Daily Hours: ${user.hoursPerDay}
Platforms: ${user.platforms.join(", ")}
Biggest Challenge: ${user.biggestChallenge}
Had Client Before: ${user.hadClientBefore ? "Yes" : "No"}
Has Portfolio: ${user.hasPortfolio ? "Yes" : "No"}

== CURRENT PROGRESS ==
Day: ${user.currentDay}/30
Tasks Completed: ${user.tasksCompleted}
Current Streak: ${user.currentStreak} days
Capability Level: ${user.capabilityLevel}
First Client Progress: ${user.firstClientProgress}%

== YOUR RULES — NEVER BREAK THESE ==
1. NEVER give generic advice — always reference their specific skill, platform, and progress
2. ALWAYS give ONE specific action they can take in the next 60 minutes
3. Use INR for Indian context, USD for international
4. Be direct and urgent — like a mentor who genuinely wants results
5. If user is STUCK — diagnose the root cause, don't just motivate
6. If user is INCONSISTENT — give smaller tasks + accountability
7. If user is EXECUTOR — push harder, give advanced strategies
8. Reference current platform algorithms when relevant
9. Never say "Great question!" or any filler phrases
10. End every response with ONE clear next action

== CURRENT MARKET KNOWLEDGE (2026) ==
- Instagram algorithm: Reels with 7-second hooks get 3x reach
- YouTube Shorts: Consistency beats virality — 1 video/day wins
- Upwork: Specialized profiles get 5x more invites than generic ones
- LinkedIn: Commenting on posts beats cold outreach by 4x
- Fiverr: Video gigs get 2x more clicks than image gigs
- Top niches: AI content, short-form video, landing page design, automation, LinkedIn ghostwriting

== TONE ==
Direct. Specific. Urgent. Empathetic but no-nonsense. Like a coach who KNOWS you can do it but won't let you make excuses.`;
}

// ─── Daily Task Generation ────────────────────────────────────────────────────

export interface TaskGenInput {
  name: string;
  skill: string;
  experienceLevel: string;
  incomeGoal: string;
  hoursPerDay: string;
  platforms: string[];
  biggestChallenge: string;
  currentDay: number;
  capabilityLevel: string;
  hadClientBefore: boolean;
  hasPortfolio: boolean;
  previousTasksCompleted: number;
  previousTasksSkipped: number;
}

export interface GeneratedTask {
  title: string;
  description: string;
  whyItMatters: string;
  estimatedMinutes: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  tool?: string;
  toolUrl?: string;
}

// Fallback tasks when OpenAI is not configured
function getFallbackTasks(user: TaskGenInput): GeneratedTask[] {
  const day = user.currentDay;
  const skill = user.skill || "Freelancing";

  if (day <= 7) {
    return [
      {
        title: `Optimize your ${skill} profile headline`,
        description: `Rewrite your profile headline to include your specific niche and target client. Make it outcome-focused, not role-focused.`,
        whyItMatters: "First impression = more profile clicks = more clients",
        estimatedMinutes: 15,
        priority: "HIGH",
        tool: "Upwork",
        toolUrl: "https://upwork.com",
      },
      {
        title: "Create 1 portfolio sample",
        description: `Create one strong portfolio piece that showcases your ${skill} skills. Use Canva, Figma, or your preferred tool. Focus on quality over quantity.`,
        whyItMatters: "Proof of work = trust = conversions",
        estimatedMinutes: 45,
        priority: "HIGH",
        tool: "Canva",
        toolUrl: "https://canva.com",
      },
      {
        title: "Write your first cold outreach message",
        description:
          "Draft a personalized outreach message for 3 potential clients. Reference their specific business, not a generic template.",
        whyItMatters: "Outreach is the fastest path to income",
        estimatedMinutes: 25,
        priority: "MEDIUM",
      },
    ];
  } else if (day <= 14) {
    return [
      {
        title: "Send 5 targeted proposals",
        description: `Search for ${skill} jobs on Upwork or Fiverr. Apply to 5 that match your skill level. Personalize each proposal in the first 2 sentences.`,
        whyItMatters: "Volume + personalization = responses",
        estimatedMinutes: 30,
        priority: "HIGH",
        tool: "Upwork",
        toolUrl: "https://upwork.com",
      },
      {
        title: "Post one LinkedIn update",
        description:
          "Share a short post about a lesson learned or a project you worked on. Keep it authentic and specific.",
        whyItMatters: "Visibility = inbound opportunities",
        estimatedMinutes: 20,
        priority: "MEDIUM",
        tool: "LinkedIn",
        toolUrl: "https://linkedin.com",
      },
    ];
  } else {
    return [
      {
        title: "Follow up on all open proposals",
        description:
          "Send a follow-up message to every proposal you haven't heard back from. Keep it short: 2 sentences max.",
        whyItMatters: "80% of deals close after the follow-up",
        estimatedMinutes: 15,
        priority: "HIGH",
      },
      {
        title: "Research your ideal client avatar",
        description: `Find 5 businesses that would benefit from ${skill}. Note their current pain points and how you could solve them.`,
        whyItMatters: "Knowing your client = better pitches = more wins",
        estimatedMinutes: 25,
        priority: "MEDIUM",
      },
    ];
  }
}

export async function generateDailyTasks(
  user: TaskGenInput
): Promise<GeneratedTask[]> {
  const openai = getOpenAI();

  if (!openai) {
    console.warn("[AI Engine] OPENAI_API_KEY not set — using fallback tasks");
    return getFallbackTasks(user);
  }

  const hoursNum = parseFloat(user.hoursPerDay) || 2;
  const totalMinutes = hoursNum * 60;

  const prompt = `Generate exactly 4-6 personalized daily tasks for this freelancer. Return ONLY a valid JSON object with a "tasks" array.

User: ${user.name}
Skill: ${user.skill}
Experience: ${user.experienceLevel}
Day: ${user.currentDay}/30
Capability: ${user.capabilityLevel}
Available time: ${totalMinutes} minutes total
Platform focus: ${user.platforms.join(", ")}
Has portfolio: ${user.hasPortfolio}
Had client before: ${user.hadClientBefore}
Biggest challenge: ${user.biggestChallenge}
Recently completed: ${user.previousTasksCompleted} tasks
Recently skipped: ${user.previousTasksSkipped} tasks

Rules:
- Total task time must NOT exceed ${totalMinutes} minutes
- Day 1-7: Focus on profile + portfolio setup
- Day 8-14: Focus on outreach + proposals  
- Day 15-21: Focus on follow-up + closing
- Day 22-30: Focus on scaling + second client
- If capabilityLevel is STUCK: make tasks smaller (max 20 min each)
- If capabilityLevel is EXECUTOR: make tasks challenging
- Tasks must be specific to ${user.skill} — not generic
- Include platform-specific tasks

Return this exact JSON format:
{
  "tasks": [
    {
      "title": "Task title (specific, action-oriented)",
      "description": "Exactly what to do in 2-3 sentences",
      "whyItMatters": "One sentence on why this moves the needle",
      "estimatedMinutes": 15,
      "priority": "HIGH",
      "tool": "Tool name",
      "toolUrl": "https://tool-url.com"
    }
  ]
}

Priority must be: HIGH, MEDIUM, or LOW
Only return the JSON object. No other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content =
      response.choices[0].message.content || '{"tasks":[]}';
    const parsed = JSON.parse(content);
    return parsed.tasks || [];
  } catch (error) {
    console.error("[AI Engine] Task generation failed:", error);
    return getFallbackTasks(user);
  }
}

// ─── Streaming Coach Response ─────────────────────────────────────────────────

export async function streamCoachResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  userContext: UserContext
) {
  const openai = getOpenAI();

  if (!openai) {
    throw new Error("AI service not configured. Please add OPENAI_API_KEY.");
  }

  const systemPrompt = buildDrBusinessSystemPrompt(userContext);

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream: true,
    temperature: 0.8,
    max_tokens: 1000,
  });

  return stream;
}

// ─── AI Market Insight ────────────────────────────────────────────────────────

export async function generateAIInsight(user: {
  skill: string;
  platforms: string[];
  currentDay: number;
  firstClientProgress: number;
}): Promise<string> {
  const openai = getOpenAI();

  const fallback = `Based on your skill (${user.skill || "freelancing"}), the best platforms are actively hiring right now. Focus on quality proposals over quantity — personalized pitches get 3x more responses than templates.`;

  if (!openai) return fallback;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Generate ONE specific, actionable market insight for a ${user.skill} freelancer on Day ${user.currentDay} of their 30-day plan. Platform focus: ${user.platforms.join(", ")}. Progress: ${user.firstClientProgress}%.

The insight must:
- Be specific to their skill and current stage
- Reference a real current trend or data point
- Tell them exactly what to do with this insight
- Be 2-3 sentences maximum
- Feel like insider knowledge, not generic advice

Return only the insight text, nothing else.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 150,
    });

    return response.choices[0].message.content || fallback;
  } catch {
    return fallback;
  }
}

// ─── Capability Assessment ────────────────────────────────────────────────────

export async function assessUserCapability(stats: {
  tasksCompleted: number;
  tasksSkipped: number;
  totalTasksAssigned: number;
  currentStreak: number;
  averageCompletionTime: number;
}): Promise<"EXECUTOR" | "INCONSISTENT" | "STUCK"> {
  const completionRate =
    stats.totalTasksAssigned > 0
      ? stats.tasksCompleted / stats.totalTasksAssigned
      : 0;

  if (completionRate >= 0.7 && stats.currentStreak >= 3) {
    return "EXECUTOR";
  } else if (completionRate >= 0.3) {
    return "INCONSISTENT";
  } else {
    return "STUCK";
  }
}
