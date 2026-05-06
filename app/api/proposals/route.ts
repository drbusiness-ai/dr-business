import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — Fetch last 20 proposals
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const proposals = await prisma.proposal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return Response.json(proposals);
  } catch (error) {
    console.error("Failed to fetch proposals", error);
    return new Response("Error", { status: 500 });
  }
}

// POST — Save a proposal
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { jobDescription, platform, angle, content, score } = await req.json();

  try {
    const proposal = await prisma.proposal.create({
      data: {
        userId: session.user.id,
        jobDescription,
        platform,
        angle,
        content,
        score: score || 0,
      },
    });
    return Response.json(proposal);
  } catch (error) {
    console.error("Failed to save proposal", error);
    return new Response("Error", { status: 500 });
  }
}
