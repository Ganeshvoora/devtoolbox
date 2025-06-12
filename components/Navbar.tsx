"use client"
import React, { useState } from 'react';
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: "Home", href: "/" },
  { name: "AI Chat", href: "/chat" },
  { name: "Tech News", href: "/news" },
  { name: "Todos", href: "/todos" },
  { name: "Dev Tools", href: "/tools" },
  { name: "Contact", href: "/#contact" }
];

const Navbar = () => {
  const {  status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800 bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center space-x-2">
        <span className="text-blue-400 text-xl font-bold">{"</>"}</span>
        <span className="font-semibold">DevToolBox</span>
      </div>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-blue-300">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {status === "authenticated" ? (
          <>
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className={item.name === "Home" ? "text-blue-400 hover:text-blue-300" : "hover:text-blue-300"}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => signOut()} 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
            <div className="flex items-center space-x-3 ml-4">
              <Link 
                href="/signin" 
                className="text-blue-400 hover:text-blue-300 border border-blue-400 px-3 py-1 rounded-md"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 p-4 flex flex-col space-y-3 shadow-lg">
          {status === "authenticated" ? (
            <>
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="hover:text-blue-300 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button 
                onClick={() => signOut()} 
                className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm mt-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/" 
                className="hover:text-blue-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/signin" 
                className="hover:text-blue-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;