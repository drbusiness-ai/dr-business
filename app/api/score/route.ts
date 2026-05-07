import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function calculateScore(user: {
  tasksCompleted: number;
  currentStreak: number;
  proposalsSent: number;
  quickWinCompleted: boolean;
}): { score: number; level: string; breakdown: Record<string, number> } {
  const taskPoints = Math.min(user.tasksCompleted * 5, 300);
  const streakPoints = Math.min(user.currentStreak * 10, 200);
  const proposalPoints = Math.min(user.proposalsSent * 8, 160);
  const quickWinPoints = user.quickWinCompleted ? 100 : 0;

  const score = taskPoints + streakPoints + proposalPoints + quickWinPoints;

  let level = "Starter";
  if (score >= 600) level = "Elite";
  else if (score >= 400) level = "Pro";
  else if (score >= 200) level = "Rising";
  else if (score >= 80) level = "Active";

  return {
    score,
    level,
    breakdown: {
      tasks: taskPoints,
      streak: streakPoints,
      proposals: proposalPoints,
      quickWin: quickWinPoints,
    },
  };
}

export async function GET() {
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

  const { score, level, breakdown } = calculateScore(user);

  // Persist score
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      drBusinessScore: score,
      scoreLevel: level,
      lastActiveAt: new Date(),
    },
  });

  return NextResponse.json({
    score,
    level,
    breakdown,
    maxScore: 760,
    percentile: Math.round((score / 760) * 100),
  });
}
