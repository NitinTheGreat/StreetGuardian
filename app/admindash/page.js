'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MapPin, X, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false })

const AdminDashboard = () => {
  const [reportedCasesMap, setReportedCasesMap] = useState([])
  const [reportedCases, setReportedCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)

  const router = useRouter()

  const emergencyData = [
    { id: 1, text: 'Emergency situation reported at Main St.' },
    { id: 2, text: 'Fire alarm triggered in Building A' },
    { id: 3, text: 'Medical assistance needed at Park Ave.' },
    { id: 4, text: 'Security breach detected in Sector 7' },
    { id: 5, text: 'Traffic accident reported on Highway 101' },
  ]

  useEffect(() => {
    fetchReportedCasesMap()
    fetchReportedCases()
    checkAdminStatus()
  }, [])

  const fetchReportedCasesMap = async () => {
    try {
      const response = await fetch('/api/reportsMap')
      const data = await response.json()
      setReportedCasesMap(data)
    } catch (error) {
      console.error('Error fetching reported cases map:', error)
    }
  }

  const fetchReportedCases = async () => {
    try {
      const response = await fetch('/api/reports')
      const data = await response.json()
      setReportedCases(data)
    } catch (error) {
      console.error('Error fetching reported cases:', error)
    }
  }

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsAdmin(false)
        return
      }

      const response = await fetch('/api/admin-login', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    } catch (error) {
      console.error('Error verifying admin status:', error)
      setIsAdmin(false)
    }
  }

  const openModal = (caseData) => {
    if (isAdmin) {
      setSelectedCase(caseData)
      setShowModal(true)
    } else {
      setShowUnauthorizedModal(true)
    }
  }

  const closeModal = () => {
    setSelectedCase(null)
    setShowModal(false)
    setShowUnauthorizedModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-500 p-8">
      <main className="container mx-auto pt-20 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">SOS: Emergencies</h2>
            <div className="h-[400px] overflow-y-auto space-y-4">
              {emergencyData.map((item) => (
                <EmergencyCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Map Overview</h2>
            <div className="h-[400px] w-full rounded-md overflow-hidden">
              <MapComponent locations={reportedCasesMap} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Reported Cases</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportedCases.map((item) => (
              <ReportedCaseCard key={item._id} item={item} openModal={openModal} />
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && selectedCase && (
          <CaseDetailsModal selectedCase={selectedCase} closeModal={closeModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUnauthorizedModal && (
          <UnauthorizedModal closeModal={closeModal} router={router} />
        )}
      </AnimatePresence>
    </div>
  )
}

const EmergencyCard = ({ item }) => (
  <motion.div
    className="bg-blue-50 rounded-lg shadow-md p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: item.id * 0.1 }}
  >
    <p className="text-blue-800 mb-4">{item.text}</p>
    <div className="flex justify-end space-x-2">
      <button className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200">
        <Check className="w-4 h-4 mr-2 inline" />
        Approve
      </button>
      <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
        <MapPin className="w-4 h-4 mr-2 inline" />
        Locate
      </button>
    </div>
  </motion.div>
)

const ReportedCaseCard = ({ item, openModal }) => (
  <motion.div
    className="bg-blue-50 rounded-lg shadow-md p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <p className="text-blue-800 mb-4">{item.landmark}</p>
    <div className="flex justify-end">
      <button
        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        onClick={() => openModal(item)}
      >
        <Check className="w-4 h-4 mr-2 inline" />
        View Details
      </button>
    </div>
  </motion.div>
)

const CaseDetailsModal = ({ selectedCase, closeModal }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">Case Details</h2>
        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p><strong>Reported by:</strong> {selectedCase.userId}</p>
          <p><strong>Landmark:</strong> {selectedCase.landmark}</p>
          <p><strong>Comments:</strong> {selectedCase.comments}</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Images:</h3>
            <ImageCarousel images={selectedCase.images} />
          </div>
        </div>
        <div className="h-[300px]">
          <MapComponent location={selectedCase.location} />
        </div>
      </div>
    </motion.div>
  </motion.div>
)

const UnauthorizedModal = ({ closeModal, router }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
      <p className="mb-6 text-gray-700">You are not authorized to view these details.</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => router.push('/adminlogin')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Go to Admin Login
        </button>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  </motion.div>
)

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="relative w-full h-64">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        onClick={prevImage}
      >
        <ChevronLeft className="w-6 h-6 text-blue-600" />
      </button>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        onClick={nextImage}
      >
        <ChevronRight className="w-6 h-6 text-blue-600" />
      </button>
    </div>
  )
}

export default AdminDashboard

