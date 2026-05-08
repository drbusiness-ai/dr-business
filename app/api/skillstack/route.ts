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
    const prompt = `You are Dr. Business, a strategic career advisor for freelancers.
The user's primary skill is: ${user.skill || "Freelancing"}
Their current experience level is: ${user.experienceLevel || "Beginner"}
Their income goal is: ${user.incomeGoal || "₹50k/month"}

Recommend exactly 2 highly profitable complementary skills they should stack with their primary skill to multiply their income.

Return ONLY a valid JSON object with a "stacks" array containing exactly 2 objects with:
- "skill": Name of the new skill
- "whyItPairs": 2-3 sentences explaining why it pairs perfectly with their primary skill
- "incomeBoost": Estimated income boost (e.g., "Charge ₹15,000 per project vs ₹5,000")
- "timeToLearn": Estimated time to learn (e.g., "3 weeks")
- "freeResource": { "name": string, "url": string } (A real, valid link to a free resource like YouTube or free course)
- "paidResource": { "name": string, "url": string } (A real, valid link to a premium course)

Do NOT return any other text, only the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content || '{"stacks":[]}';
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Skill Stack API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate skill stack" },
      { status: 500 }
    );
  }
}
