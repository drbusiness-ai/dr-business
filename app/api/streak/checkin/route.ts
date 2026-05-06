import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.lastActiveDate
    ? new Date(user.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  const msInDay = 86400000;
  let newStreak = user.currentStreak;

  if (lastActive) {
    const diff = today.getTime() - lastActive.getTime();
    if (diff === msInDay) {
      // Consecutive day
      newStreak += 1;
    } else if (diff > msInDay) {
      // Streak broken
      newStreak = 1;
    }
  } else {
    // First active day
    newStreak = 1;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastActiveDate: new Date(),
    },
  });

  return NextResponse.json({ streak: newStreak });
}
