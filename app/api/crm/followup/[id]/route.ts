import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || lead.userId !== session.user.id) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const fallbackMessage = `Hi! I wanted to follow up on the ${lead.projectType || "project"} we discussed. I'm still very interested and available to get started. Would love to know if you're ready to move forward? — ${user?.name || "Your Name"}`;

  if (!openai) {
    return NextResponse.json({ message: fallbackMessage });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Dr. Business helping a freelancer write a follow-up message to a potential client.
          
Freelancer: ${user?.name || "Freelancer"} (${user?.skill || "Freelancer"})
Client: ${lead.clientName}
Platform: ${lead.platform}
Project: ${lead.projectType || "freelance project"}
Lead stage: ${lead.stage}
Days since last contact: ${Math.floor((Date.now() - lead.lastContactAt.getTime()) / 86400000)}

Write a short (3-4 sentences), warm but professional follow-up message. Make it feel personal, not templated. Don't be pushy. End with a soft call to action.

Return ONLY the message text, no quotes or labels.`,
        },
      ],
      max_tokens: 200,
    });

    const message =
      completion.choices[0].message.content?.trim() || fallbackMessage;

    // Update last contact
    await prisma.lead.update({
      where: { id },
      data: { lastContactAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[CRM Followup] Error:", error);
    return NextResponse.json({ message: fallbackMessage });
  }
}
