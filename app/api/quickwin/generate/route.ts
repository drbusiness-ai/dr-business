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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return new Response("User not found", { status: 404 });

  if (!process.env.OPENAI_API_KEY) {
    // Fallback response for testing without API keys
    const fallbackJSON = JSON.stringify({
      title: "Optimize Your Profile Headline",
      steps: [
        "Go to your primary freelancing platform (e.g., Upwork or LinkedIn).",
        "Change your headline to: 'I help [Target Audience] achieve [Desired Result] using [Your Skill].'",
        "Save the changes."
      ],
      estimatedMinutes: 5,
      winStatement: "I just optimized my freelancing profile for maximum conversion using Dr. Business!",
      shareText: "Just updated my profile headline using the exact formula from Dr. Business. Getting 1% better every day! 🚀 #freelance #drbusiness"
    });

    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(fallbackJSON));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const prompt = `You are Dr. Business, a pragmatic, high-level freelance coach.
    
The user needs a "Quick Win" task they can complete in under 20 minutes right now.
User Profile:
- Skill: ${user.skill || "freelancer"}
- Experience Level: ${user.experienceLevel || "beginner"}
- Platforms: ${user.platforms.join(", ") || "various"}

Create a highly actionable, specific 15-minute task that will give them a quick win today. 
The task MUST produce a visible, shareable output.
Do not use generic tone. Be direct, authoritative, and helpful.

Return ONLY a valid JSON object matching this schema exactly:
{
  "title": "Task title (e.g., Write your first Upwork headline)",
  "steps": ["Step 1 description", "Step 2 description", "Step 3..."],
  "estimatedMinutes": 15,
  "winStatement": "What they can say after (e.g., I just wrote my first client-ready Upwork headline in 15 minutes...)",
  "shareText": "A pre-written tweet/post they can share to LinkedIn or Twitter"
}
`;

    if (!openai) {
      throw new Error("OpenAI is not configured");
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("[QuickWin] Stream error:", error);
    return new Response("AI service temporarily unavailable.", { status: 503 });
  }
}
