import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { streamCoachResponse } from "@/lib/ai-engine";

// POST — Streaming AI Coach response
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return new Response("Message required", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) return new Response("User not found", { status: 404 });

  // Save user message first
  await prisma.message.create({
    data: {
      userId: session.user.id,
      role: "USER",
      content: message,
    },
  });

  // Build conversation history (chronological)
  const history = [...user.messages]
    .reverse()
    .map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant",
      content: m.content,
    }));
  history.push({ role: "user", content: message });

  // Check if AI is configured
  if (!process.env.OPENAI_API_KEY) {
    const fallback = `I'm Dr. Business. Your AI coaching is almost ready — the team just needs to configure the AI backend. In the meantime, focus on your next task in the dashboard.\n\n**Your immediate action:** Open your Daily Tasks tab and complete the first HIGH priority task. That's the fastest path to your first client.`;

    // Save fallback response
    await prisma.message.create({
      data: {
        userId: session.user.id,
        role: "ASSISTANT",
        content: fallback,
      },
    });

    return new Response(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const stream = await streamCoachResponse(history, {
      name: user.name || "Friend",
      skill: user.skill || "freelancing",
      experienceLevel: user.experienceLevel || "beginner",
      incomeGoal: user.incomeGoal || "$1000",
      currentIncome: user.currentIncome || "$0",
      hoursPerDay: user.hoursPerDay || "2",
      platforms: user.platforms,
      biggestChallenge: user.biggestChallenge || "finding clients",
      currentDay: user.currentDay,
      tasksCompleted: user.tasksCompleted,
      currentStreak: user.currentStreak,
      capabilityLevel: user.capabilityLevel,
      firstClientProgress: user.firstClientProgress,
      hadClientBefore: user.hadClientBefore || false,
      hasPortfolio: user.hasPortfolio || false,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";
    const userId = session.user.id;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              fullResponse += text;
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          // Save complete AI response to DB
          await prisma.message.create({
            data: {
              userId,
              role: "ASSISTANT",
              content: fullResponse || "I couldn't generate a response. Please try again.",
            },
          });
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[Coach] Stream error:", error);
    return new Response("AI service temporarily unavailable.", { status: 503 });
  }
}

// GET — Fetch message history
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return Response.json(messages);
}
