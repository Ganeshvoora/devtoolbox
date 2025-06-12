"use client"
import React from 'react'
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const HeroSection = () => {
    const [username, setUsername] = useState<string | null>(null);

  // Get session data if using NextAuth
  const { data: session } = useSession();

  useEffect(() => {
    // First try to get user from NextAuth session
    if (session?.user?.name) {
      setUsername(session.user.name);
      return;
    }

    // Otherwise try localStorage as fallback
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      // If we have any user data in localStorage, try to get the name
      // You might need to adjust this depending on your storage structure
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUsername(storedName);
      }
    }
  }, [session]);
  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
        <div className="md:w-1/2 space-y-4 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-400">Developer Toolbox</h1>
          {/* display user name and greet him */}
          {/* {username &&
            <p className="text-xl text-gray-300">
              Welcome back, <span className="text-blue-400 font-semibold">{username}</span>!
            </p>
          } */}
          UserName /
          <p className="text-xl text-gray-300">Your All-in-One Developer Toolkit</p>
          <p className="text-gray-400 max-w-md">
            Access powerful development tools, AI assistance, and resources - all in one place.
          </p>
          <Link href="/tools" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200">
            Explore Tools
          </Link>
          {
            username && <p>press ctrl+k for quick search</p>
          }



        </div>
        <div className="md:w-1/2">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/coverpage.jpg"
              alt="Code editor screenshot"
              width={600}
              height={350}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
  )
}

export default HeroSection
