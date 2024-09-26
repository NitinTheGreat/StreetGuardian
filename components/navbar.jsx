'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuIcon, XIcon } from '@heroicons/react/solid';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-400 to-blue-500 shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-teal-100 transition-colors duration-300">
            StreetGuardian
          </Link>
          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white p-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6 text-teal-500" />
              ) : (
                <MenuIcon className="h-6 w-6 text-teal-500" />
              )}
            </button>
          </div>
          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li>
              <Link href="/report" className="text-white hover:text-teal-100 transition-colors duration-300">Report</Link>
            </li>
            <li>
              <Link href="/admindash" className="text-white hover:text-teal-100 transition-colors duration-300">
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white hover:text-teal-100 transition-colors duration-300">
                Login
              </Link>
            </li>
            <li>
              <Link href="/Support" className="text-white hover:text-teal-100 transition-colors duration-300">
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/sos"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                SOS
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
          className="md:hidden bg-white shadow-lg rounded-b-lg"
        >
          <ul className="py-2">
            <li className="px-4 py-2">
              <Link
                href="/admindash"
                className="block text-teal-600 hover:text-teal-800 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                href="/login"
                className="block text-teal-600 hover:text-teal-800 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                href="/support"
                className="block text-teal-600 hover:text-teal-800 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                href="/sos"
                className="block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 text-center shadow-md hover:shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                SOS
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
