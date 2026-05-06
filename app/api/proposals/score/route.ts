import { NextRequest } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { content, jobDescription } = await req.json();

  if (!content || !jobDescription) {
    return new Response("Content and Job Description required", { status: 400 });
  }

  if (!openai) {
    return Response.json({
      score: 85,
      breakdown: {
        hook: 90,
        relevance: 80,
        cta: 85
      }
    });
  }

  try {
    const prompt = `Analyze the following freelance proposal against the job description.
Score it from 0-100 and provide a breakdown for Hook strength, Relevance, and CTA quality.

Job Description:
${jobDescription}

Proposal Content:
${content}

Return ONLY a valid JSON object:
{
  "score": number,
  "breakdown": {
    "hook": number,
    "relevance": number,
    "cta": number
  }
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return Response.json(result);
  } catch (error) {
    console.error("[Proposals] Scoring error:", error);
    return new Response("Scoring service unavailable", { status: 500 });
  }
}
