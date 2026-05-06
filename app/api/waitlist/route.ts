import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { z } from "zod";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  skill: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const count = await prisma.waitlistEntry.count();

    const entry = await prisma.waitlistEntry.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        skill: data.skill,
        source: data.source,
        position: count + 1,
      },
    });

    // Send confirmation email if Resend is configured
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: data.email,
          subject: "You're on the Dr. Business waitlist! 🔥",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f1f5f9; padding: 40px; border-radius: 16px;">
              <h1 style="color: #7C3AED; font-size: 28px;">You're #${entry.position} on the list.</h1>
              <p>Hey ${data.name || "there"},</p>
              <p>You just made a smart move. Dr. Business is an AI execution system that builds your personal 30-day freelance plan and keeps you accountable until you land your first paying client.</p>
              <p><strong>No courses. No fluff. Just daily execution.</strong></p>
              <p>We're launching soon. You'll be among the first to get access.</p>
              <p style="margin: 24px 0; padding: 16px; background: rgba(124,58,237,0.1); border-radius: 8px; border-left: 4px solid #7C3AED;">
                Pricing at launch:<br>
                Students: $9/month (₹749)<br>
                Everyone else: $19/month (₹1,585)
              </p>
              <p>— Dr. Business Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("[Waitlist] Email failed:", emailErr);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      position: entry.position,
      total: count + 1,
    });
  } catch (error) {
    console.error("[Waitlist POST]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const count = await prisma.waitlistEntry.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
