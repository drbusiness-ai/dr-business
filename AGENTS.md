# Dr. Business — AGENTS.md
> Jules, read this FIRST before touching any file. This is your complete context.

## 🎯 What Is This Project?
**Dr. Business** = India's First AI Freelance Coach — Land Your First Client in 30 Days.
- NOT a course. It's an **AI-Powered Execution System**.
- Target User: Indian freelancer, 18–30 yrs, 0–2 yrs experience, wants ₹10K–₹50K/month
- Monetization: 7-day free trial → ₹749/month or ₹5,999/year (Razorpay)
- Live at: drbusiness.online

---

## 🛠️ Tech Stack
```
Next.js 15 | TypeScript (STRICT — zero `any` types)
Tailwind CSS | Prisma ORM | Neon PostgreSQL
OpenAI GPT-4o (streaming) | NextAuth v5 | Razorpay
```

---

## 🎨 Design System — Apply to EVERY Page
```
Background:  #FAFAF7  (warm off-white)
Cards:       #FFFFFF  with shadow-sm
Border:      #E8E4DC  (warm grey)
Primary:     #7C3AED  (violet)
Accent:      #F59E0B  (amber — streak, energy, highlights)
Success:     #059669  (emerald)
Text:        #1C1917  (warm near-black)
Muted:       #78716C  (warm grey)
```
- Theme: **LIGHT + WARM** — never dark mode
- **Mobile-first** — every page must work at 375px
- Bottom tab bar on mobile (5 icons)

---

## ✅ What's Already Built — DO NOT Break
- Google OAuth via NextAuth v5
- Onboarding (10 questions → GPT-4o generates 30-day plan)
- Dashboard (streak, XP, daily tasks widget)
- Daily Tasks API + completion logic
- AI Coach (GPT-4o streaming, Dr. Business persona)
- Streak system + XP system
- Payments via Razorpay
- Wins Feed
- Progress API
- Proposals API (basic + Proposal AI Builder)
- Quick Win Engine
- Light+Warm theme applied to landing page
- Growth features finalized
- Vercel build fixes (Prisma config, DB URL fallbacks)

---

## 🔨 What Still Needs Work (Check codebase first before assuming)
- Rate Calculator UI + API (`/rate-calculator`)
- Client CRM — Kanban board UI (`/crm`)
- Dr. Business Score system + UI (`/progress` page enhancement)
- Unstuck AI feature
- Super Admin Dashboard (`/admin`)
- Tool Vault (`/vault`)
- Settings page polish (`/settings`)
- Any pages missing loading/error states
- Mobile responsiveness audit across all pages

---

## 🤖 Dr. Business AI Persona — Use in ALL GPT-4o Calls
```
You are Dr. Business — India's most trusted AI freelance coach.
Tone: Warm, direct, personal — like a mentor who genuinely cares.
NEVER say "As an AI...". NEVER give generic advice.
Always reference the user's actual skill + situation.
Use friendly but authoritative tone.
End every response with ONE motivating line.
User profile context: [inject dynamically]
```

---

## ⚙️ Build Rules — Follow Every Time
1. Auth check on **every** API route
2. Loading state on **every** async action
3. Error state handled **gracefully** everywhere
4. All AI responses must **stream** — no waiting for full response
5. TypeScript strict — **zero `any` types**
6. `npm run build` after every feature — fix ALL errors before next step
7. Commit each feature **separately** with a clear message
8. Final push: `git push origin main`
9. If you find improvements → implement and comment: `// JULES SUGGESTION: [explanation]`

---

## 📁 Page Structure
| Page | URL | Purpose |
|------|-----|--------|
| Landing | `/` | Convert visitor → signup in 60 sec |
| Login | `/login` | Google OAuth |
| Onboarding | `/onboarding` | 10 Qs → 30-day plan |
| Quick Win | `/quickwin` | First result in 15 min |
| Dashboard | `/dashboard` | Daily hub — tasks, streak, XP |
| Daily Tasks | `/tasks` | 3 tasks/day + streak logic |
| AI Coach | `/coach` | GPT-4o Dr. Business chat |
| Proposals | `/proposals` | AI proposal builder + scoring |
| Rate Calculator | `/rate-calculator` | Market rate + AI insight |
| CRM | `/crm` | Kanban client pipeline |
| Progress | `/progress` | 30-day calendar + milestones |
| Pricing | `/pricing` | Free vs Pro |
| Settings | `/settings` | Profile + notifications + billing |
| Admin | `/admin` | Super Admin Dashboard |
| Vault | `/vault` | Tools + resources |

---

## 🔑 API Routes Reference
```
✅ EXISTING:
/api/auth/[...nextauth]     — Google OAuth
/api/onboarding             — POST: save answers, generate plan
/api/tasks                  — GET: today's tasks
/api/tasks/[id]/complete    — POST: mark complete
/api/coach                  — POST: streaming chat
/api/progress               — GET: user stats
/api/streak                 — GET/POST: streak management
/api/payments               — Razorpay integration
/api/notifications          — GET: user notifications
/api/wins                   — GET/POST: wins feed
/api/user                   — GET/PATCH: user profile
/api/waitlist               — POST: waitlist signup
/api/proposals              — GET/POST: saved proposals
/api/proposals/generate     — POST: AI streaming generation
/api/quickwin               — Quick win generation

🔨 TO ADD (if not already present):
/api/rate-calculator        — POST: AI rate calculation
/api/crm                    — GET/POST: leads
/api/crm/[id]               — PATCH/DELETE
/api/crm/followup/[id]      — POST: AI follow-up generator
/api/score                  — GET: Dr. Business Score
/api/unstuck/check          — GET: cron check
/api/unstuck/diagnose       — POST: AI diagnosis
/api/admin                  — Admin-only routes
```

---

## ⏰ Vercel Cron Jobs (vercel.json already has these)
```json
{ "path": "/api/tasks/generate-daily",  "schedule": "0 2 * * *" }
{ "path": "/api/streak/check",          "schedule": "30 2 * * *" }
{ "path": "/api/unstuck/check",         "schedule": "0 4 * * *" }
{ "path": "/api/score/recalculate",     "schedule": "0 3 * * *" }
```

---

## 🧠 Task Format for Best Results
When given a task, always:
1. Check the existing code FIRST before writing new code
2. Build only what's missing — don't rewrite what works
3. Validate with `npm run build` before completing
4. Keep mobile layout at 375px in mind
5. Apply warm design system consistently

---
*Last updated: May 2026 | Repo: github.com/drbusiness-ai/dr-business*