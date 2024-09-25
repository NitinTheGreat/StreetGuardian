'use client'

import React, { useState } from 'react'
// import Image from 'next/image'
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi'
import { motion } from 'framer-motion'

const inputVariants = {
  focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
  blur: { scale: 1 }
}

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
  tap: { scale: 0.95 }
}

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.07
    }
  }
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone)
  const isFormValid = password === confirmPassword && isEmailValid(email) && isPhoneValid(phone) && username && password

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('OTP sent to your email. Please verify.')
        setShowOtpVerification(true)
      } else {
        setMessage(data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Registration successful. Please log in.')
        setTimeout(() => { window.location.href = '/login' }, 2000)
      } else {
        setMessage(data.message || 'OTP verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex rounded-xl overflow-hidden shadow-2xl">
        <div className="hidden md:block w-1/2 relative">
          {/* <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80"
            alt="Colorful abstract"
            layout="fill"
            objectFit="cover"
          /> */}
        </div>
        <motion.div 
          className="w-full md:w-1/2 bg-white p-8 md:p-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={childVariants}>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join now to unlock exclusive tools and keep your AO3 fanfiction journey organized!
            </p>
          </motion.div>
          {message && <motion.p variants={childVariants} className="text-center text-sm text-red-600">{message}</motion.p>}
          {!showOtpVerification ? (
            <motion.form className="mt-8 space-y-6" onSubmit={handleSubmit} variants={childVariants}>
              <div className="rounded-md shadow-sm space-y-4">
                <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                  <label htmlFor="username" className="sr-only">Username</label>
                  <div className="relative">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
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
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
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
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
                    </button>
                  </div>
                </motion.div>
              </div>

              <div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.form className="mt-8 space-y-6" onSubmit={handleOtpSubmit} variants={childVariants}>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    variants={inputVariants}
                    whileFocus="focus"
                    whileBlur="blur"
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                  />
                ))}
              </div>
              <div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Verify OTP
                </motion.button>
              </div>
            </motion.form>
          )}
          <motion.div className="text-center mt-4" variants={childVariants}>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Login
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}