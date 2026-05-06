import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function GET(req: NextRequest) {
  // Simple cron secret check could go here
  
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const pingType = url.searchParams.get("type") || "morning";

  const messages = {
    morning: {
      subject: "☀️ Aaj ka pehla task ready hai",
      body: (name: string, taskCount: number) =>
        `Hey ${name}, aaj ke ${taskCount} tasks ready hain. Pehla task sirf 15 min ka hai — shuru karo.`,
    },
    afternoon: {
      subject: "⚡ Afternoon check-in — kya chal raha hai?",
      body: (name: string, remaining: number) =>
        `${name}, abhi bhi ${remaining} tasks baaki hain. Shaam se pehle ek khatam karo.`,
    },
    evening: {
      subject: "🌙 Aaj ka report — streak bachao",
      body: (name: string, completed: number, total: number) =>
        `${name}, aaj ka score: ${completed}/${total}. Kal fresh start hoga — streak mat todna.`,
    },
  };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: {
        onboardingCompleted: true,
        planStatus: "ACTIVE", // Only ping paying/active users
      },
      include: {
        tasks: {
          where: {
            date: { gte: today },
          },
        },
      },
    });

    const emailPromises = users.map((user) => {
      if (!user.email) return Promise.resolve();

      const pending = user.tasks.filter((t) => t.status === "PENDING").length;
      const completed = user.tasks.filter(
        (t) => t.status === "COMPLETED"
      ).length;
      const total = user.tasks.length;

      const msg = messages[pingType as keyof typeof messages];
      const count =
        pingType === "morning"
          ? total
          : pingType === "afternoon"
          ? pending
          : completed;

      // Skip if nothing to report
      if (pingType === "afternoon" && pending === 0) return Promise.resolve();

      return resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: user.email,
        subject: msg.subject,
        html: `
          <div style="font-family: sans-serif; background: #0a0a0f; color: #f1f5f9; padding: 40px; text-align: center;">
            <p style="font-size: 18px; margin-bottom: 30px;">${msg.body(
              user.name || "Friend",
              count,
              total
            )}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
              Open Dr. Business →
            </a>
          </div>
        `,
      });
    });

    await Promise.allSettled(emailPromises);

    return NextResponse.json({ success: true, pinged: users.length });
  } catch (error) {
    console.error("[Notifications Ping]", error);
    return NextResponse.json({ error: "Ping failed" }, { status: 500 });
  }
}
