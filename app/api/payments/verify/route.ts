import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Payment gateway not configured" },
      { status: 503 }
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
    await req.json();

  // Verify Razorpay signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json(
      { error: "Invalid payment signature" },
      { status: 400 }
    );
  }

  const subscriptionEnds = new Date();
  subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1);

  // Update user plan
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      plan,
      planStatus: "ACTIVE",
      subscriptionEndsAt: subscriptionEnds,
    },
  });

  // Record the payment
  await prisma.payment.create({
    data: {
      userId: session.user.id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: plan === "STUDENT" ? 74900 : 158500,
      currency: "INR",
      plan,
      status: "CAPTURED",
    },
  });

  return NextResponse.json({ success: true, plan });
}
