'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Heart, Users, Gift } from 'lucide-react'

const RewardsProgram = () => {
  const [userPoints, setUserPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserPoints()
  }, [])

  const fetchUserPoints = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/get-user-points')
      if (response.ok) {
        const data = await response.json()
        setUserPoints(data.points)
        setError(null)
      } else {
        throw new Error('Failed to fetch user points')
      }
    } catch (error) {
      console.error('Error fetching user points:', error)
      setError('Failed to fetch user points. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const contributionCategories = [
    { icon: Heart, title: "Donations", value: "$1,500" },
    { icon: Users, title: "Referrals", value: "15 people" },
    { icon: Gift, title: "Community Engagement", value: "45 events" },
  ]

  const rewardItems = [
    ...Array(10).fill(null).map((_, i) => ({ type: 'Voucher', id: i + 1 })),
    ...Array(10).fill(null).map((_, i) => ({ type: 'GiftCard', id: i + 1 })),
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-200 to-blue-500">
        <div className="text-2xl font-bold text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Points Display */}
        <div className="absolute top-4 right-4 bg-white rounded-full p-4 shadow-lg mt-12">
          <p className="text-blue-600 font-bold">Your Points</p>
          <p className="text-3xl text-blue-800 font-bold">{userPoints}</p>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 mt-16">
          Earn Points, Make a Difference
        </h1>
        <p className="text-xl text-center text-white mb-12 max-w-3xl mx-auto">
          Our rewards program recognizes and incentivizes your contributions to the community. 
          Earn points for various activities and redeem them for exclusive benefits or donate 
          them to causes you care about.
        </p>

        {/* Contribution Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {contributionCategories.map((category, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="flex flex-col items-center p-6">
                <category.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{category.title}</h3>
                <p className="text-blue-600 font-bold">{category.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rewards Section */}
        <Card className="w-full bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">
              Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {rewardItems.map((item, index) => (
                  <motion.div
                    key={`${item.type}${item.id}`}
                    className="bg-blue-50 p-6 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">{item.type} {item.id}</h3>
                    <p className="text-blue-600 mb-4">1,000 points</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Redeem
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RewardsProgram

