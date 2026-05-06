import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateDailyTasks } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // Save onboarding data to user profile
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      skill: data.skill,
      hoursPerDay: data.hoursPerDay,
      experienceLevel: data.experienceLevel,
      incomeGoal: data.incomeGoal,
      currentIncome: data.currentIncome || "₹0",
      hadClientBefore: data.hadClientBefore ?? false,
      platforms: data.platforms || ["Upwork"],
      hasPortfolio: data.hasPortfolio ?? false,
      biggestChallenge: data.biggestChallenge || "finding clients",
      dailySocialHours: data.dailySocialHours,
      onboardingCompleted: true,
      capabilityLevel: "UNKNOWN",
    },
  });

  // Generate Day 1 tasks using AI
  try {
    const tasks = await generateDailyTasks({
      name: user.name || "Friend",
      skill: data.skill || "Graphic Design",
      experienceLevel: data.experienceLevel || "Beginner",
      incomeGoal: data.incomeGoal || "₹25,000",
      hoursPerDay: data.hoursPerDay || "2",
      platforms: data.platforms || ["Upwork"],
      biggestChallenge: data.biggestChallenge || "finding clients",
      currentDay: 1,
      capabilityLevel: "UNKNOWN",
      hadClientBefore: data.hadClientBefore ?? false,
      hasPortfolio: data.hasPortfolio ?? false,
      previousTasksCompleted: 0,
      previousTasksSkipped: 0,
    });

    if (tasks.length > 0) {
      await prisma.task.createMany({
        data: tasks.map((task) => ({
          userId: session.user.id!,
          title: task.title,
          description: task.description,
          whyItMatters: task.whyItMatters,
          estimatedMinutes: task.estimatedMinutes,
          priority: task.priority as "HIGH" | "MEDIUM" | "LOW",
          tool: task.tool,
          toolUrl: task.toolUrl,
          generatedForDay: 1,
          skillContext: data.skill,
          aiGenerated: true,
        })),
      });
    }
  } catch (err) {
    console.error("[Onboarding] Task generation failed:", err);
    // Continue — tasks can be generated later
  }

  return NextResponse.json({ success: true });
}
