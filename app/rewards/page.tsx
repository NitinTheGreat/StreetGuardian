'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Gift, Award, TrendingUp, Zap, Star, Coffee, Headphones, Ticket, Book } from 'lucide-react'

const RewardsProgram = () => {
  const [userPoints, setUserPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchUserRewards()
    launchConfetti()
  }, [])

  const fetchUserRewards = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await fetch('/api/get-user-rewards', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserPoints(data.rewardPoints)
        setError(null)
      } else {
        throw new Error('Failed to fetch user rewards')
      }
    } catch (error) {
      console.error('Error fetching user rewards:', error)
      setError('Failed to fetch your rewards. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const rewardItems = [
    { type: 'Exclusive Merch', points: 500, icon: Gift, category: 'Products' },
    { type: 'VIP Event Access', points: 1000, icon: Award, category: 'Experiences' },
    { type: 'Skill Boost Course', points: 750, icon: TrendingUp, category: 'Learning' },
    { type: 'Premium Account Upgrade', points: 1500, icon: Zap, category: 'Services' },
    { type: 'Limited Edition Badge', points: 300, icon: Star, category: 'Digital' },
    { type: 'Coffee with a Mentor', points: 2000, icon: Coffee, category: 'Experiences' },
    { type: 'Wireless Earbuds', points: 3000, icon: Headphones, category: 'Products' },
    { type: 'Concert Tickets', points: 5000, icon: Ticket, category: 'Experiences' },
    { type: 'E-book Bundle', points: 600, icon: Book, category: 'Learning' },
  ]

  const categories = ['All', ...Array.from(new Set(rewardItems.map(item => item.category)))]

  const filteredRewards = selectedCategory === 'All' 
    ? rewardItems 
    : rewardItems.filter(item => item.category === selectedCategory)

  const handleRedeem = async (item: typeof rewardItems[0]) => {
    if (userPoints >= item.points) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }

        const response = await fetch('/api/get-user-rewards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ points: item.points, rewardType: item.type })
        })

        if (response.ok) {
          const data = await response.json()
          setUserPoints(data.rewardPoints)
          const newToast = {
            id: Date.now(),
            message: `You've redeemed ${item.type} for ${item.points} points!`
          }
          setToasts(prevToasts => [...prevToasts, newToast])
        } else {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to redeem reward')
        }
      } catch (error) {
        console.error('Error redeeming reward:', error)
        const newToast = {
          id: Date.now(),
          message: (error as Error).message
        }
        setToasts(prevToasts => [...prevToasts, newToast])
      }
    } else {
      const newToast = {
        id: Date.now(),
        message: `Not enough points to redeem ${item.type}. Keep earning!`
      }
      setToasts(prevToasts => [...prevToasts, newToast])
      setTimeout(() => setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id)), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8.5vh)] bg-gradient-to-br from-cyan-200 to-blue-500">
        <div className="text-3xl font-bold text-white animate-pulse">Loading your rewards...</div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8.5vh)] bg-gradient-to-br from-cyan-200 to-blue-500 p-4 sm:p-8 pt-[calc(8.5vh+2rem)] mt-14">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Points Display */}
        <motion.div 
          className="fixed top-[calc(8.5vh+1rem)] right-4 bg-white rounded-full p-4 sm:p-6 shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <p className="text-blue-600 font-bold text-sm sm:text-lg">Your Points</p>
          <p className="text-2xl sm:text-4xl text-blue-800 font-bold">{userPoints}</p>
        </motion.div>

        {/* Glowing Heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white mb-4 sm:mb-8 relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="relative z-10 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Unlock Your Rewards
          </span>
          <span className="absolute inset-0 bg-teal-200 filter blur-lg opacity-50 animate-pulse"></span>
        </motion.h1>

        <motion.p 
          className="text-lg sm:text-xl text-center text-white mb-8 sm:mb-12 max-w-3xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Redeem your points for exclusive perks and experiences. 
          The more you engage, the more you earn!
        </motion.p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors transform duration-300 ease-in-out ${
        selectedCategory === category
          ? 'bg-blue-600 text-white'
          : 'bg-white text-blue-600 hover:bg-blue-100'
      } hover:shadow-lg hover:shadow-blue-500/50 focus:outline-none`}
    >
      {category}
    </button>
  ))}
</div>


        {/* Rewards Section */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Available Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRewards.map((item) => (
              <motion.div
                key={item.type}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="text-4xl sm:text-5xl text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-white">{item.type}</h3>
                <p className="text-sm text-white/70 mb-4">{item.points} Points</p>
                <button
                  onClick={() => handleRedeem(item)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 transition-colors hover:bg-blue-500"
                >
                  Redeem
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 mb-4 bg-teal-500 text-white px-6 py-4 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default RewardsProgram
