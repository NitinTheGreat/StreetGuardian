'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link'; // Import Link from Next.js

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            StreetGuardian
          </Link>
          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6 text-white" />
              ) : (
                <MenuIcon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8 ml-auto"> {/* Increased space and moved items away from the right */}
            <li>
              <Link href="/adminlogin" className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200">
                Admin Login
              </Link>
            </li>
            <li>
              <Link href="/admindash" className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200">
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200">
                Sign Up
              </Link>
            </li>
            <li>
              <Link href="login" className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-md"
        >
          <ul className="py-2">
            <li className="px-4 py-2">
              <Link href="/about" className="block text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link href="/services" className="block text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link href="/contact" className="block text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link href="login" className="block text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
