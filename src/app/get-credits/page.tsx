"use client"
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SignIn from '@/components/sign-in';
import Script from 'next/script';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

interface UserProfile {
    id: string;
    name: string;
    email: string;
    creditBalance: number;
}

const GetCredits = () => {

    const [credits, setCredits] = useState(0);

    const getCredits = async () => {
        const response: { data: { user: UserProfile } } = await axios.get('/api/user/profile');
        setCredits(response.data?.user?.creditBalance);
    };

    useEffect(() => {
        getCredits();
    }, []);
    const session = useSession();

    if (session.status === "loading") {
        return <div>Loading...</div>;
    }
    if (session.status !== "authenticated") {
    return <>
        <div>Please log in to purchase credits.</div>;
        <div><SignIn /></div>
    </>    }

    const handlePayment = async (plan: string) => {
        let amount = 999999;

        if (plan === "basic") {
            amount = 500;
        } else if (plan === "premium") {
            amount = 900;
        } else if (plan === "ultra") {
            amount = 1;
        }
        const response = await axios.post<{ orderId: string }>('/api/create-order', { amount: amount });
        const { orderId } = response.data;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: amount * 100,
            currency: "INR",
            name: "MindSpark",
            description: "Purchase Credits",
            order_id: orderId,
            handler: async function (response: {razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, plan: string}) {
                try {
                    const verifyResponse = await axios.post('/api/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        plan
                    });

                    const data = verifyResponse.data as { success: boolean };
                    if (data.success) {
                        
                        alert("Credits added successfully!");
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                } catch (error) {
                    console.error("Error verifying payment:", error);
                    alert("An error occurred while verifying the payment. Please try again.");
                }
            },
            prefill: {
                name: session?.data?.user?.name || "",
                email: session?.data?.user?.email || ""
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <h1 className="text-3xl font-bold mb-8">Buy Credits</h1>
            <div>Credits: {credits}</div>
            <div className="flex gap-8">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-64 shadow-lg flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Basic</h2>
                    <p className="text-lg mb-1">50 Credits</p>
                    <p className="text-2xl font-bold mb-4">₹500</p>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
                        onClick={() => handlePayment("basic")}
                    >
                        Buy Now
                    </button>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-64 shadow-lg flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Premium</h2>
                    <p className="text-lg mb-1">100 Credits</p>
                    <p className="text-2xl font-bold mb-4">₹900</p>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
                        onClick={() => handlePayment("premium")}
                    >
                        Buy Now
                    </button>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-64 shadow-lg flex flex-col items-center">
                    <h2 className="text-xl font-semibold mb-2">Ultra</h2>
                    <p className="text-lg mb-1">200 Credits</p>
                    <p className="text-2xl font-bold mb-4">₹1700</p>
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
                        onClick={() => handlePayment("ultra")}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GetCredits