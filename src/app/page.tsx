import SignIn from '@/components/sign-in'
import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <main className='h-screen w-screen flex  flex-col  justify-center items-center'>
      <h1 className='text-4xl font-bold'> Home</h1>
<div>
      <SignIn/>
  </div>
  <div>
    <Link href="/dashboard">
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold">
        Go to Dashboard
      </button>
    </Link>
  </div>
    </main>
  )
}

export default Home