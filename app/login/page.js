'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const inputVariants = {
  focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
  blur: { scale: 1 }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
  tap: { scale: 0.95 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.07
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

const GlowingHeading = ({ children }) => {
  return (
    <h1 className="text-3xl font-bold mb-2 text-center relative">
      <span className="relative z-10 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
        {children}
      </span>
      <span className="absolute inset-0 bg-blue-200 filter blur-lg opacity-50 animate-pulse"></span>
    </h1>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.status === 200) {
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => {
          router.push('/rewards');
        }, 2000);
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
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 to-blue-500 py-12 px-4 sm:px-6 lg:px-8 mt-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl w-full flex rounded-2xl overflow-hidden shadow-2xl">
        <motion.div 
          className="hidden md:block w-1/2 relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ev-IWJH-l-vb4k-unsplash.jpg-ejQIMknTEXHczqRoUpKmOzKPz0dlqL.jpeg"
            alt="Street scene at night"
            layout="fill"
            objectFit="cover"
            priority={true} 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-300/40 to-blue-400/40 mix-blend-overlay"></div>
        </motion.div>
        <motion.div 
          className="w-full md:w-1/2 bg-white p-8 md:p-10"
          variants={childVariants}
        >
          <motion.div variants={childVariants}>
            <GlowingHeading>Welcome back</GlowingHeading>
            <p className="text-gray-600 mb-6 text-center">
              Log in to access StreetGuardian&apos;s services. Let&apos;s get back to helping those in need.
            </p>
          </motion.div>

          <motion.h2 variants={childVariants} className="text-2xl font-semibold text-blue-600 mb-4 text-center">LOGIN</motion.h2>

          {message && (
            <motion.div 
              variants={childVariants}
              className={`p-3 rounded-xl mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message}
            </motion.div>
          )}

          <motion.form onSubmit={handleSubmit} variants={childVariants}>
            <motion.div className="mb-4" variants={inputVariants} whileFocus="focus" whileBlur="blur">
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                />
              </div>
            </motion.div>
            <motion.div className="mb-4" variants={inputVariants} whileFocus="focus" whileBlur="blur">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <FiLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                </button>
              </div>
            </motion.div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-blue-600 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200">Forgot Password?</a>
            </div>
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group"
            >
              <span className="relative z-10">Log In</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
            </motion.button>
          </motion.form>

          <motion.p variants={childVariants} className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? {' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Sign up
            </a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}

