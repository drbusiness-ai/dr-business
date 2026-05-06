import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateDailyTasks, assessUserCapability } from "@/lib/ai-engine";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      date: { gte: today },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });

  // Generate tasks for today if none exist
  if (tasks.length === 0) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.onboardingCompleted) {
      // Get recent task stats for capability assessment
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentTasks = await prisma.task.findMany({
        where: {
          userId: session.user.id,
          createdAt: { gte: weekAgo },
        },
      });

      const completed = recentTasks.filter(
        (t) => t.status === "COMPLETED"
      ).length;
      const skipped = recentTasks.filter((t) => t.status === "SKIPPED").length;

      const capability = await assessUserCapability({
        tasksCompleted: completed,
        tasksSkipped: skipped,
        totalTasksAssigned: recentTasks.length,
        currentStreak: user.currentStreak,
        averageCompletionTime: 0,
      });

      // Update user capability and increment day
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          capabilityLevel: capability,
          currentDay: { increment: 1 },
        },
      });

      try {
        const newTasks = await generateDailyTasks({
          name: user.name || "Friend",
          skill: user.skill || "Freelancing",
          experienceLevel: user.experienceLevel || "Beginner",
          incomeGoal: user.incomeGoal || "₹25,000",
          hoursPerDay: user.hoursPerDay || "2",
          platforms: user.platforms,
          biggestChallenge: user.biggestChallenge || "finding clients",
          currentDay: updatedUser.currentDay,
          capabilityLevel: capability,
          hadClientBefore: user.hadClientBefore || false,
          hasPortfolio: user.hasPortfolio || false,
          previousTasksCompleted: completed,
          previousTasksSkipped: skipped,
        });

        if (newTasks.length > 0) {
          await prisma.task.createMany({
            data: newTasks.map((task) => ({
              userId: session.user.id!,
              title: task.title,
              description: task.description,
              whyItMatters: task.whyItMatters,
              estimatedMinutes: task.estimatedMinutes,
              priority: task.priority as "HIGH" | "MEDIUM" | "LOW",
              tool: task.tool,
              toolUrl: task.toolUrl,
              generatedForDay: updatedUser.currentDay,
              skillContext: user.skill,
              aiGenerated: true,
            })),
          });
        }
      } catch (err) {
        console.error("[Tasks GET] Task generation error:", err);
      }

      tasks = await prisma.task.findMany({
        where: { userId: session.user.id, date: { gte: today } },
        orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
      });
    }
  }

  return NextResponse.json(tasks);
}
