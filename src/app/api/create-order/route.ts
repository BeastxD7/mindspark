import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const rzp = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});


export const POST = async (req:NextRequest) => {
    try {

        const { amount } = await req.json();
        const order = rzp.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()+Math.floor(Math.random()*1000)}`,
        })

        return NextResponse.json({orderId:(await order).id},{status:200});
    } catch (error) {
        console.log(error);
        
        const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
        return NextResponse.json({error: errorMessage},{status:500});
    }
}