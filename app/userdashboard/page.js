'use client'
import ProtectedComponent from '@/components/UnifiedProtectedComponent'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Fetch user data and reports
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/user')
        const userData = await userRes.json()
        setUser(userData)

        const reportsRes = await fetch('/api/reports')
        const reportsData = await reportsRes.json()
        setReports(reportsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01579b] via-[#0277bd] to-[#e0f2f1] p-8 mt-16">
      <motion.div
        className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-2xl p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold text-[#01579b] mb-6">
          Welcome back, {user?.username || 'User'}!
        </motion.h1>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#e0f2f1] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <p className="text-4xl font-bold">{reports.length}</p>
            <p className="text-sm text-gray-600">Total reports submitted</p>
          </div>
          <div className="bg-[#e0f2f1] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Rewards</h2>
            <p className="text-4xl font-bold">{user?.rewards || 0}</p>
            <p className="text-sm text-gray-600">Points earned</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#01579b] text-white px-6 py-2 rounded-lg shadow"
            onClick={() => router.push('/report')}
          >
            Report Homeless
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#0277bd] text-white px-6 py-2 rounded-lg shadow"
            onClick={() => router.push('/rewards')}
          >
            Your Rewards
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4">History</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {reports.map((report, index) => (
              <div key={report.id} className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <p className="font-semibold">{report.location}</p>
                <p className="text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
Dashboard.Layout = ProtectedComponent;