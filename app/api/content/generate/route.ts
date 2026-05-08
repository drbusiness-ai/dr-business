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
    const { platform, hook, type, structure } = body;

    const systemPrompt = `You are an elite ghostwriter specializing in viral ${platform} content for freelancers.
The user is a ${user.experienceLevel} ${user.skill}.
Your task is to write a highly engaging ${type} post using the provided hook and structure.

Rules:
- Write in a natural, authoritative, but conversational tone.
- Use spacing to make it readable on mobile.
- Provide relevant emojis.
- Provide 3-5 platform-specific hashtags at the end.
- End with a Call-To-Action (CTA).
- Do not add conversational filler like "Here is your post". Output ONLY the post content.`;

    const userPrompt = `Hook: ${hook}
Structure: ${structure}
Platform: ${platform}`;

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
    console.error("[Content Generate API Error]", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
