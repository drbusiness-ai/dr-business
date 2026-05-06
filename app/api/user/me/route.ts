import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateAIInsight } from "@/lib/ai-engine";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      milestones: {
        include: { milestone: true },
      },
      streakHistory: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate AI insight based on current state
  const insight = await generateAIInsight({
    skill: user.skill || "freelancing",
    platforms: user.platforms,
    currentDay: user.currentDay,
    firstClientProgress: user.firstClientProgress,
  });

  return NextResponse.json({ ...user, aiInsight: insight });
}
