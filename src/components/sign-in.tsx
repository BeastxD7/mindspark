"use client"

import { signIn } from "next-auth/react"

export default function SignIn() {
    return (
        <button
            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-md dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
            Sign in with Google
        </button>
    )
}    
