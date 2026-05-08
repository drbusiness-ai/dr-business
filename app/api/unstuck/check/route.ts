import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  // Verify Cron Auth (Vercel sets CRON_SECRET)
  const authHeader = req.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Find users inactive for 2+ days
    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastActiveAt: {
          lt: twoDaysAgo
        },
        onboardingCompleted: true
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // Create "UNSTUCK" notifications for them
    const notifications = inactiveUsers.map(user => ({
      userId: user.id,
      type: "STREAK_ALERT" as any, // Closest existing type
      title: "You're getting stuck! 😤",
      message: `Hey ${user.name}, you haven't been active for 2 days. Don't let your streak die. Click here for an AI intervention.`,
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications
      });
    }

    return NextResponse.json({
      success: true,
      usersNotified: inactiveUsers.length
    });
  } catch (error) {
    console.error("[Unstuck Check Error]", error);
    return NextResponse.json({ error: "Failed to check unstuck users" }, { status: 500 });
  }
}
