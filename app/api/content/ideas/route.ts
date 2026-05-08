import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/ai-engine";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform") || "linkedin";

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
    const prompt = `Generate 10 viral content ideas for a ${user.skill} freelancer on ${platform}.
Return ONLY a valid JSON object with an "ideas" array containing objects with:
- type: e.g., "Carousel", "Reel", "Text Post", "Thread"
- hook: The first attention-grabbing sentence
- structure: e.g., "[Hook] -> [Story] -> [Lesson] -> [CTA]"
- potential: "High", "Medium", or "Low"

Do NOT return any other text, only the JSON.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content || '{"ideas":[]}';
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("[Content Ideas API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate ideas" },
      { status: 500 }
    );
  }
}
