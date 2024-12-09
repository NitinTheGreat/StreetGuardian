'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);
  const isFormValid = password === confirmPassword && isEmailValid(email) && isPhoneValid(phone) && username && password;
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/rewards');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setMessage('Please check all inputs and ensure they are valid.');
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('OTP sent to your email. Please verify.');
        setMessageType('success');
        setShowOtpVerification(true);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join('');

    setIsSubmitting(true);

    try {
      const response = await fetch('api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful. Redirecting to login...');
        setMessageType('success');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage(data.message || 'OTP verification failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
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
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shane-rounce-DNkoNXQti3c-unsplash.jpg-6IFvMY0Rina2bqlLInwjqiSRGWLF7N.jpeg"
            alt="Hands united on a tree trunk symbolizing community support"
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
            <GlowingHeading>Join StreetGuardian</GlowingHeading>
            <p className="text-gray-600 mb-6 text-center">
              Sign up now to start helping the unsheltered!
            </p>
          </motion.div>

          {message && (
            <motion.div 
              variants={childVariants}
              className={`p-3 rounded-xl mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {message}
            </motion.div>
          )}

          {!showOtpVerification ? (
            <motion.form className="space-y-4" onSubmit={handleSubmit} variants={childVariants}>
              <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                <label htmlFor="username" className="sr-only">Username</label>
                <div className="relative">
                  <FiUser className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative">
                  <FiMail className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                <label htmlFor="phone-number" className="sr-only">Phone number</label>
                <div className="relative">
                  <FiPhone className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <FiLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full px-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-blue-500/25"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 focus:outline-none"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isSubmitting}
              >
                <span className="relative z-10">{isSubmitting ? 'Signing Up...' : 'Sign Up'}</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.form className="space-y-4" onSubmit={handleOtpSubmit} variants={childVariants}>
              <p className="text-center text-sm text-gray-700">Enter the 6-digit OTP sent to your email:</p>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={otp.join('').length !== 6 || isSubmitting}
              >
                <span className="relative z-10">{isSubmitting ? 'Verifying OTP...' : 'Verify OTP'}</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
              </motion.button>
            </motion.form>
          )}
          <motion.div className="text-center mt-4" variants={childVariants}>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Login
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

