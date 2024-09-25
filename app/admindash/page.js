'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, MapPinIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export const AdminDashboard = () => {
  const cardData = [
    { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
    { id: 4, text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' },
    { id: 5, text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <main className="pt-20 px-4 md:px-8 flex flex-col md:flex-row gap-8">
        {/* Left-side card */}
        <Card className="w-full md:w-1/3 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {cardData.map((item) => (
                <motion.div
                  key={item.id}
                  className="mb-4 p-4 bg-white rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.id * 0.1 }}
                >
                  <p className="text-gray-700 mb-4">{item.text}</p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      Locate
                    </Button>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right-side map card */}
        <div className="w-full md:w-2/3">
          <Card className="h-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Map Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Here, you can add your map component */}
              <div className="h-[400px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Map content goes here</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
