'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        // Store the token and display success message
        const { token } = data;
        localStorage.setItem('token', token);  // You can use localStorage or sessionStorage as needed

        setMessage('Login successful!');
        setMessageType('success');
        
        // Redirect or perform any additional logic after successful login
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
      <div className="max-w-6xl w-full flex rounded-xl overflow-hidden shadow-2xl">
        <motion.div 
          className="hidden md:block w-1/2 relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Image placeholder */}
          <Image
        src="/images/loginuser.png" 
        alt="Description of the image"
        layout='fill'
        priority={true} 
      />
          <div className="w-full h-full bg-gradient-to-br from-teal-300 to-blue-400"></div>
        </motion.div>
        <motion.div 
          className="w-full md:w-1/2 bg-white p-8 md:p-10"
          variants={childVariants}
        >
          <motion.div variants={childVariants}>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome back</h1>
            <p className="text-gray-600 mb-6">
              Log in to access your personalized AO3 tools. Continue your fanfiction journey right where you left off.
            </p>
          </motion.div>

          <motion.h2 variants={childVariants} className="text-2xl font-semibold text-blue-600 mb-4">LOGIN</motion.h2>

          {message && (
            <motion.div 
              variants={childVariants}
              className={`p-3 rounded-md mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
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
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot Password?</a>
            </div>
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </motion.button>
          </motion.form>

          <motion.p variants={childVariants} className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">Sign up</a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}