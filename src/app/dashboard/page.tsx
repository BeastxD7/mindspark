"use client"
import { SignOut } from '@/components/sign-out'
import { useSession } from 'next-auth/react'
import React from 'react'

const Dashboard = () => {

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
    <div className="bg-gray-900 text-white h-screen w-screen flex justify-center items-center">
      <p>Loading...</p>
    </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    if (typeof window !== "undefined") {
    window.location.href = "/signin";
    }
    return null;
  }

  return (
    <main className='h-screen w-screen flex flex-col justify-center items-center bg-gray-900 text-white'>
    <h1 className='text-4xl font-bold'>Dashboard</h1>
    <p className='mt-4 text-lg'>Welcome {session.user?.name}!</p>
    <p>{JSON.stringify(session, null, 2)}</p>
    <div>
      <SignOut />
    </div>
    </main>
  );
}

export default Dashboard