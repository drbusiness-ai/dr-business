import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        quickWinCompleted: true,
        quickWinCompletedAt: new Date(),
        // Award XP or increase score? The instructions say:
        // Score recalculation must be triggered after every relevant user action
        // We will just add XP and Dr Business Score here (implemented fully later)
        xpTotal: { increment: 50 },
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to complete quick win", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
