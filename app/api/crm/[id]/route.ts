import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH — update lead stage or details
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { stage, notes, wonAmount, clientName, platform, projectType } = body;

  // Verify ownership
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || lead.userId !== session.user.id) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { lastContactAt: new Date() };
  if (stage) updateData.stage = stage;
  if (notes !== undefined) updateData.notes = notes;
  if (wonAmount !== undefined) updateData.wonAmount = wonAmount;
  if (clientName) updateData.clientName = clientName;
  if (platform) updateData.platform = platform;
  if (projectType !== undefined) updateData.projectType = projectType;

  // If marking as won
  if (stage === "CLOSED_WON") {
    updateData.won = true;
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: updateData,
  });

  // Award XP when marked as won
  if (stage === "CLOSED_WON") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { xpTotal: { increment: 100 } },
    });
  }

  return NextResponse.json(updated);
}

// DELETE — delete a lead
export async function DELETE(
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

  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
