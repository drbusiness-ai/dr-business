import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { skill, experience, platform, projectType, clientLocation } = await req.json();

  if (!skill || !experience || !platform || !projectType || !clientLocation) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  try {
    // 1. Check Cache
    const existingCache = await prisma.rateCache.findFirst({
      where: {
        userId: session.user.id,
        skill,
        experience,
        platform,
        projectType,
        clientLocation,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (existingCache) {
      return Response.json(existingCache.result);
    }

    // 2. Call AI
    const openai = getOpenAI();
    let result;

    if (!openai) {
      // Fallback for development without API key
      result = {
        minRate: "$15/hr",
        maxRate: "$45/hr",
        sweetSpotRate: "$25/hr",
        projectRateRange: "$200 - $800",
        marketInsight: "The market is hot for this right now. Don't lowball yourself.",
        presentationScript: "I charge $25/hr for this. It's an investment in quality."
      };
    } else {
      const prompt = `You are Dr. Business — an elite, no-nonsense AI execution coach. Calculate freelance rates based on the current market (2026).

User inputs:
- Skill: ${skill}
- Experience: ${experience}
- Platform: ${platform}
- Project Type: ${projectType}
- Client Location: ${clientLocation}

Return ONLY a valid JSON object matching exactly this structure:
{
  "minRate": "amount with currency symbol per hour (e.g., $15/hr or ₹1000/hr based on client location)",
  "maxRate": "amount with currency symbol per hour",
  "sweetSpotRate": "amount with currency symbol per hour",
  "projectRateRange": "amount range with currency symbol for the project type",
  "marketInsight": "2-line warm, personal, specific market insight for this skill/platform using Dr. Business persona",
  "presentationScript": "A script for telling the client their rate confidently (How to Present This Rate)"
}`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = aiResponse.choices[0].message.content || "{}";
      result = JSON.parse(content);
    }

    // 3. Save to Cache
    await prisma.rateCache.create({
      data: {
        userId: session.user.id,
        skill,
        experience,
        platform,
        projectType,
        clientLocation,
        result: result,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }
    });

    return Response.json(result);
  } catch (error) {
    console.error("[Rate Calculator API] Error:", error);
    return new Response(JSON.stringify({ error: "Failed to calculate rate" }), { status: 500 });
  }
}
