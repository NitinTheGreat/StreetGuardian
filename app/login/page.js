'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    console.log('Checking tokens:', { accessToken, refreshToken });

    if (accessToken && refreshToken) {
      const checkAuth = async () => {
        try {
          const response = await fetch('https://ao3-chrome-extension-backend.onrender.com/auth/validate', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Tokens': JSON.stringify({ accessToken, refreshToken }),
            },
          });

          if (response.ok) {
            window.location.href = '/dashboard';
          } else {
            console.log('Token validation failed:', response.status);
            alert('Token validation failed');
          }
        } catch (error) {
          console.error('Error during token validation:', error);
        }
      };

      checkAuth();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://ao3-chrome-extension-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });
  
      const data = await response.json();
      console.log('Response:', response);
      console.log('Response data:', data);
  
      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        if (typeof chrome !== 'undefined' && chrome.runtime) {
          chrome.runtime.sendMessage("nnmmeljlhmhpnfphcpifdahblfmhlilm", 
            { action: "storeTokens", accessToken: data.accessToken, refreshToken: data.refreshToken }, 
            function(response) {
              if (chrome.runtime.lastError) {
                console.error('Error sending message:', chrome.runtime.lastError);
              } else {
                console.log('Tokens sent to extension:', response);
              }
          });
        }
        
        setMessage('Login successful');
        setMessageType('success');
  
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setMessage(data.message || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
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
          <Image
            src="/images/login1.png"
            alt="Login illustration"
            layout="fill"
            objectFit="cover"
            priority
          />
        </motion.div>
        <motion.div 
          className="w-full md:w-1/2 bg-white p-8 md:p-10"
          variants={childVariants}
        >
          <motion.div variants={childVariants}>
            <h1 className="text-3xl font-bold text-purple-600 mb-2">Welcome back!</h1>
            <p className="text-gray-600 mb-6">
              Log in to access your personalized AO3 tools. Continue your fanfiction journey right where you left off.
            </p>
          </motion.div>

          <motion.h2 variants={childVariants} className="text-2xl font-semibold text-purple-600 mb-4">LOGIN</motion.h2>

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
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-500">Forgot Password?</a>
            </div>
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Log In
            </motion.button>
          </motion.form>

          <motion.p variants={childVariants} className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <a href="/register" className="font-medium text-purple-600 hover:text-purple-500">Sign up</a>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}