import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const wins = await prisma.winsFeed.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(wins);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
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

  const { winType, winText, isPublic } = await req.json();

  const win = await prisma.winsFeed.create({
    data: {
      userId: session.user.id,
      userName: user.name || "Anonymous",
      userSkill: user.skill || "Freelancing",
      winType,
      winText,
      isPublic: isPublic ?? true,
    },
  });

  return NextResponse.json(win);
}
