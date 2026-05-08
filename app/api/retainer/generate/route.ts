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
    const body = await req.json();
    const { clientName, projectType, duration, rate } = body;

    const systemPrompt = `You are Dr. Business, an elite freelance coach.
Your job is to write a highly persuasive retainer proposal for the user to send to their client.
The user's skill: ${user.skill || "Freelancing"}

Rules:
- Write it as a direct message/email to the client.
- The tone should be professional, confident, and focused on ROI (Return on Investment).
- Emphasize that a retainer guarantees priority, consistency, and better results than one-off projects.
- Include the duration (${duration}) and the monthly rate (${rate}).
- Structure it cleanly with short paragraphs and bullet points if necessary.
- Do NOT include conversational filler like "Here is your proposal". Output ONLY the proposal text.`;

    const userPrompt = `Client Name: ${clientName}
Project/Service Type: ${projectType}
Proposed Duration: ${duration}
Proposed Monthly Rate: ${rate}`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.8,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("[Retainer Generate API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate retainer proposal" },
      { status: 500 }
    );
  }
}
