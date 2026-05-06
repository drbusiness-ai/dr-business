import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Razorpay from "razorpay";

// Pricing in paise (INR)
const PRICING = {
  STUDENT: { amount: 74900, currency: "INR", label: "₹749/month" },
  PRO: { amount: 158500, currency: "INR", label: "₹1,585/month" },
} as const;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payment gateway not configured yet." },
      { status: 503 }
    );
  }

  const { plan } = await req.json();

  if (!["STUDENT", "PRO"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const planPricing = PRICING[plan as keyof typeof PRICING];

  const order = await razorpay.orders.create({
    amount: planPricing.amount,
    currency: planPricing.currency,
    receipt: `rcpt_${session.user.id.slice(-8)}_${Date.now()}`,
    notes: {
      userId: session.user.id,
      plan,
      userEmail: session.user.email || "",
      entity: "Builders Bazar",
    },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
