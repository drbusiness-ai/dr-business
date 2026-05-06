import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Next.js 15 — params are async
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await req.json();
  const { status, skippedReason } = data;

  const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const task = await prisma.task.update({
    where: { id, userId: session.user.id },
    data: {
      status,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
      ...(status === "IN_PROGRESS" && { startedAt: new Date() }),
      ...(status === "SKIPPED" && {
        skippedAt: new Date(),
        skippedReason,
      }),
    },
  });

  // Update user stats when task is completed
  if (status === "COMPLETED") {
    const xpGain =
      task.priority === "HIGH" ? 50 : task.priority === "MEDIUM" ? 30 : 20;
    const progressGain = task.priority === "HIGH" ? 3 : 2;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        tasksCompleted: { increment: 1 },
        xpTotal: { increment: xpGain },
        firstClientProgress: { increment: progressGain },
        lastActiveDate: new Date(),
      },
    });

    // Upsert streak history for today
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    await prisma.streakHistory.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: todayDate,
        },
      },
      update: {
        tasksCompleted: { increment: 1 },
        xpEarned: { increment: xpGain },
      },
      create: {
        userId: session.user.id,
        date: todayDate,
        tasksCompleted: 1,
        xpEarned: xpGain,
      },
    });
  }

  return NextResponse.json(task);
}
