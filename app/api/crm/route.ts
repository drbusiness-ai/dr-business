import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch all leads for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(leads);
}

// POST — create new lead
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientName, platform, projectType, description } = body;

  if (!clientName || !platform) {
    return NextResponse.json(
      { error: "clientName and platform are required" },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.create({
    data: {
      userId: session.user.id,
      clientName,
      platform,
      projectType: projectType || null,
      description: description || null,
      stage: "PROSPECT",
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
