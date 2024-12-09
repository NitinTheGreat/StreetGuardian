'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation' // Import the useRouter hook

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

const BackgroundShapes = () => (
  <>
    <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#e0f2f1] opacity-50 blur-xl"></div>
    <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-[#0277bd] opacity-30 blur-xl"></div>
    <div className="absolute top-1/2 left-1/4 w-0 h-0 border-l-[50px] border-l-transparent border-b-[100px] border-b-[#01579b] border-r-[50px] border-r-transparent opacity-20 blur-sm"></div>
  </>
)

export default function EnhancedAdminLogin() {
  const router = useRouter(); // Initialize useRouter
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Redirect to admin dashboard if token exists
      router.push('/admindash');
    }
  }, [router]); // Add router to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem('adminToken', data.token);
        setMessage('Admin login successful!');
        setMessageType('success');
        router.push('/admindash'); // Redirect after successful login
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred during login.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-14 bg-gradient-to-br from-[#01579b] via-[#0277bd] to-[#e0f2f1] relative overflow-hidden">
      <BackgroundShapes />
      <motion.div
        className="w-full max-w-md p-8 mt-14 bg-white bg-opacity-90 rounded-2xl shadow-2xl relative z-10 h-1/2"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold text-center text-[#01579b] mb-6"
          variants={itemVariants}
        >
          Admin Login
        </motion.h2>
        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0277bd]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0277bd]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
          {message && (
            <motion.div 
              variants={itemVariants}
              className={`p-3 rounded-full ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message}
            </motion.div>
          )}
          <motion.button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#01579b] to-[#0277bd] hover:from-[#014f8c] hover:to-[#026da8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0277bd]"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>
        </motion.form>
        <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-gray-600">
          Forgot your password? <a href="/admin/reset-password" className="font-medium text-[#0277bd] hover:text-[#01579b]">Reset it here</a>
        </motion.p>
      </motion.div>
    </div>
  )
}
