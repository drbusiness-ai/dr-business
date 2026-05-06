import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { jobDescription, platform, angle } = await req.json();

  if (!jobDescription) {
    return new Response("Job description required", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return new Response("User not found", { status: 404 });

  if (!openai) {
    const fallback = `Hi there,\n\nI saw your post for a ${user.skill || 'freelancer'} and I'm confident I can help. With my experience in ${user.experienceLevel || 'this field'}, I've delivered similar results for other clients.\n\nI can get started right away and ensure high quality. When are you free for a quick chat?\n\nBest,\n${user.name || 'Freelancer'}`;
    return new Response(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const prompt = `You are Dr. Business, a world-class freelance coach.
Write a winning proposal for the following job description.

User Profile:
- Skill: ${user.skill}
- Experience: ${user.experienceLevel}
- Focus Angle: ${angle} (Price-focused / Speed-focused / Quality-focused)
- Platform: ${platform}

Job Description:
${jobDescription}

Strict Proposal Structure:
Line 1: Hook (address their exact pain point immediately)
Line 2-3: Relevant proof/experience (why YOU)
Line 4-5: Specific solution for THEIR project
Line 6: Social proof or result
Line 7: Soft CTA (ask a strategic question, don't just pitch)

Constraints:
- Length: 80-120 words MAX.
- Tone: Dr. Business (Professional, confident, high-status, zero fluff).
- Format: Plain text with clear lines.
`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("[Proposals] Stream error:", error);
    return new Response("AI service temporarily unavailable.", { status: 503 });
  }
}
