'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios'

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/signin');
        }
    }, [status, router]);

    const [profile, setProfile] = useState<object | null>(null);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const { user } = session;

const handleRequest = async () => {
  try {
    const res = await axios.get('/api/user/profile');
    if (res.data) {
      setProfile(res.data);
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 max-w-md w-full">
                <div className="flex flex-col items-center">
                    {user?.image ? (
                        <Image
                            src={user.image}
                            alt={user.name || user.email || 'User'}
                            className="w-24 h-24 rounded-full shadow-lg mb-4 object-cover"
                            width={96}
                            height={96}
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4 text-3xl text-gray-500 dark:text-gray-300">
                            {user?.name ? user.name[0] : user?.email ? user.email[0] : 'U'}
                        </div>
                    )}
                    <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                        {user?.name || 'No Name'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-1">{user?.email || 'No Email'}</p>
                    {user?.id && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">User ID: {user.id}</p>
                    )}
                </div>
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Session Details</h2>
                    <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                        {Object.entries(user!).map(([key, value]) => (
                            <li key={key}>
                                <span className="font-medium capitalize">{key}:</span> {String(value)}
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleRequest} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Send Request
                </button>
            </div>

        <div>
            {JSON.stringify(profile, null, 2)   }
        </div>
        </div>
    );
};

export default ProfilePage;