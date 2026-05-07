import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { skill, experience, platform, projectType, clientLocation } = body;

  if (!skill || !experience || !platform || !projectType || !clientLocation) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  // Check cache (valid for 24h)
  const cached = await prisma.rateCache.findFirst({
    where: {
      userId: session.user.id,
      skill,
      experience,
      platform,
      projectType,
      clientLocation,
      expiresAt: { gt: new Date() },
    },
  });

  if (cached) {
    return NextResponse.json(cached.result);
  }

  // Fallback if no OpenAI key
  if (!openai) {
    const fallback = {
      minRate: 800,
      maxRate: 1500,
      sweetSpot: 1100,
      currency: "₹",
      unit: "hour",
      projectMin: 3000,
      projectMax: 6000,
      insight: `At your level, most ${skill} freelancers on ${platform} charge ₹900–₹1,200/hr. Start at ₹1,000/hr and increase after 2 successful projects.`,
      howToPresent: `"I typically charge ₹1,100/hour for ${projectType} projects. For this scope, that works out to ₹${Math.round(4500 / 1000) * 1000}–₹6,000. I can start immediately."`,
      nextLevel: "At Intermediate: ₹2,000/hr — complete 5 more tasks to unlock",
    };

    return NextResponse.json(fallback);
  }

  try {
    const prompt = `You are Dr. Business, a pragmatic freelance market rate expert for India.

Calculate realistic market rates for this freelancer:
- Skill: ${skill}
- Experience Level: ${experience}
- Platform: ${platform}
- Project Type: ${projectType}
- Client Location: ${clientLocation}

Return ONLY a valid JSON object:
{
  "minRate": <number in INR per hour>,
  "maxRate": <number in INR per hour>,
  "sweetSpot": <number — recommended rate>,
  "currency": "₹",
  "unit": "hour",
  "projectMin": <number — typical project minimum>,
  "projectMax": <number — typical project maximum>,
  "insight": "<2-sentence market insight, specific to their skill+platform>",
  "howToPresent": "<exact script for telling client the rate>",
  "nextLevel": "<what they can charge at next experience level>"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Cache for 24h
    await prisma.rateCache.create({
      data: {
        userId: session.user.id,
        skill,
        experience,
        platform,
        projectType,
        clientLocation,
        result,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[RateCalculator] Error:", error);
    return NextResponse.json(
      { error: "Rate calculation failed. Please try again." },
      { status: 503 }
    );
  }
}
