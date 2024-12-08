'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Heart, Users, Gift } from 'lucide-react'

const RewardsProgram = () => {
  const [userPoints, setUserPoints] = useState(5280)
  const [notification, setNotification] = useState(null)
  const contributionCategories = [
    { icon: Heart, title: "Donations", value: "$1,500", points: 100 },
    { icon: Users, title: "Referrals", value: "15 people", points: 50 },
    { icon: Gift, title: "Community Engagement", value: "45 events", points: 75 },
  ]

  const rewardItems = [
    ...Array(10).fill(null).map((_, i) => ({ type: 'Voucher', id: i + 1 })),
    ...Array(10).fill(null).map((_, i) => ({ type: 'GiftCard', id: i + 1 })),
  ]

  const handleReport = async (category) => {
    try {
      const response = await fetch('/api/report-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category.title, points: category.points }),
      })

      if (response.ok) {
        const data = await response.json()
        setUserPoints(data.newPoints)
        setNotification({
          type: 'success',
          message: `You've earned ${category.points} points for your ${category.title}!`
        })
      } else {
        throw new Error('Failed to report contribution')
      }
    } catch (error) {
      console.error('Error reporting contribution:', error)
      setNotification({
        type: 'error',
        message: "Failed to report contribution. Please try again."
      })
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
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
                <p className="text-blue-600 font-bold mb-4">{category.value}</p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleReport(category)}
                >
                  Report {category.title}
                </Button>
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

