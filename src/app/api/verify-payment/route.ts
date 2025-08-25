import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {razorpay_order_id,razorpay_payment_id, razorpay_signature, plan } = body;

    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, plan);

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret not configured" },
        { status: 500 }
      );
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (razorpay_signature === generated_signature) {
      // Payment is verified, increment user's credit balance

      console.log("Payment verified successfully.");
        
      const amount =
        plan === "basic"
          ? 50
          : plan === "premium"
          ? 100
          : plan === "ultra"
          ? 200
          : 0;

      if (amount === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid plan selected" },
          { status: 400 }
        );
      }

      console.log(amount);
      console.log(session);
      console.log("Updating user credit balance...");

      const updateUser = await prisma.user.update({
        where: { email: session?.user?.email ?? undefined },
        data: {
          creditBalance: {
            increment: amount,
          },
        },
      });

      console.log(updateUser);
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // Payment verification failed
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
