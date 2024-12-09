'use client'
import ProtectedComponent from '@/components/UnifiedProtectedComponent'
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

        {/* Main Heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-white mb-4 sm:mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Unlock Your Rewards
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
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Rewards Section */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Available Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredRewards.map((item, index) => (
              <motion.div
                key={item.type}
                className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mb-2 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-blue-450 mb-1 sm:mb-2">{item.type}</h3>
                <p className="text-blue-350 mb-2 sm:mb-4">{item.points} points</p>
                <button 
                  className={`w-full ${userPoints >= item.points ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg`}
                  onClick={() => handleRedeem(item)}
                  disabled={userPoints < item.points}
                >
                  {userPoints >= item.points ? 'Redeem Now' : 'Not Enough Points'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Unique Feature: Point Estimator */}
        <motion.div 
          className="mt-8 sm:mt-12 bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Points Estimator</h3>
          <p className="text-white mb-4">See how long it`&apos;`ll take to earn your next reward!</p>
          <div className="flex flex-wrap gap-4">
            <select 
              className="bg-white text-blue-600 rounded-lg px-3 py-2"
              onChange={(e) => {
                const selectedReward = rewardItems.find(item => item.type === e.target.value)
                if (selectedReward) {
                  const pointsNeeded = Math.max(0, selectedReward.points - userPoints)
                  const daysEstimate = Math.ceil(pointsNeeded / 50) // Assuming average 50 points earned per day
                  const newToast = {
                    id: Date.now(),
                    message: `Estimated ${daysEstimate} days to earn ${selectedReward.type}`
                  }
                  setToasts(prevToasts => [...prevToasts, newToast])
                  setTimeout(() => setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id)), 5000)
                }
              }}
            >
              <option value="">Select a reward</option>
              {rewardItems.map(item => (
                <option key={item.type} value={item.type}>{item.type}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg mb-2"
              >
                <p className="text-sm text-gray-800">{toast.message}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ProtectedComponent(RewardsProgram);
