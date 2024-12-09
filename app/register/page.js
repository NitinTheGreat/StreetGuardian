'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
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
  const router = useRouter();

  useEffect(() => {
 
    const token = localStorage.getItem('token');
    if (token) {
     
      router.push('/rewards');
    }
  }, [router]);
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormValid) {
      setMessage('Please check all inputs and ensure they are valid.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('OTP sent to your email. Please verify.')
        setShowOtpVerification(true)
      } else {
        setMessage(data.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()

    const otpString = otp.join('')

    setIsSubmitting(true)

    try {
      const response = await fetch('api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Registration successful. Redirecting to login...')
        setTimeout(() => window.location.href = '/login', 2000)
      } else {
        setMessage(data.message || 'OTP verification failed. Please try again.')
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 to-blue-500 py-12 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-6xl w-full flex rounded-xl overflow-hidden shadow-2xl">
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-300 to-blue-400"></div>
          <Image
        src="/images/loginuser.png" 
        alt="Description of the image"
        layout='fill'
        priority={true} 
      />
        </div>
        
        <motion.div
          className="w-full md:w-1/2 bg-white p-8 md:p-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
           
          <motion.div variants={childVariants}>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">Sign up</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join now to start helping the unsheltered!!!
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              </div>

              <div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.form className="mt-8 space-y-6" onSubmit={handleOtpSubmit} variants={childVariants}>
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
              <div>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={otp.join('').length !== 6 || isSubmitting}
                >
                  {isSubmitting ? 'Verifying OTP...' : 'Verify OTP'}
                </motion.button>
              </div>
            </motion.form>
          )}
          <motion.div className="text-center mt-4" variants={childVariants}>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}