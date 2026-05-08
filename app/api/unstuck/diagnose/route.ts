import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/ai-engine";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  try {
    const { problem } = await req.json();

    const prompt = `You are Dr. Business, a world-class freelance coach.
The user is feeling stuck on Day ${user.currentDay} of their 30-day plan.
Skill: ${user.skill}
Experience: ${user.experienceLevel}

The user says: "${problem}"

Diagnose the root cause of their block and provide exactly 3 micro-tasks (max 10 min each) to get them back in motion.

Return ONLY a valid JSON object with:
- "diagnosis": A 2-sentence empathetic but direct diagnosis.
- "unstuckTasks": An array of 3 strings (the micro-tasks).
- "motivationalQuote": One short, punchy sentence.

Do NOT return any other text, only the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content || '{"diagnosis":"", "unstuckTasks": [], "motivationalQuote": ""}';
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Unstuck Diagnose Error]", error);
    return NextResponse.json(
      { error: "Failed to diagnose" },
      { status: 500 }
    );
  }
}
