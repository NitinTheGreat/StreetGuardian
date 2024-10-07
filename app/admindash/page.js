'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const AdminDashboard = () => {
  const [map, setMap] = useState(null)
  const [reportedCases, setReportedCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const emergencyData = [
    { id: 1, text: 'Emergency situation reported at Main St.' },
    { id: 2, text: 'Fire alarm triggered in Building A' },
    { id: 3, text: 'Medical assistance needed at Park Ave.' },
    { id: 4, text: 'Security breach detected in Sector 7' },
    { id: 5, text: 'Traffic accident reported on Highway 101' },
  ]

  // Dynamically import Leaflet with no SSR
  const MapComponent = dynamic(
    () => import('../../components/MapComponent'),
    { ssr: false }
  )

  useEffect(() => {
    fetchReportedCases()
  }, [])

  const fetchReportedCases = async () => {
    try {
      // Fetch the locations from the CSV-based API
      const response = await fetch('/api/reports');
      const data = await response.json();

      // Set the reported cases (locations) in state
      setReportedCases(data);
    } catch (error) {
      console.error('Error fetching reported cases:', error);
    }
  };


  const openModal = (caseData) => {
    setSelectedCase(caseData)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedCase(null)
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-500 p-8">
      <main className="pt-20 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">SOS : Emergencies</h2>
            <div className="h-[400px] overflow-y-auto">
              {emergencyData.map((item) => (
                <motion.div
                  key={item.id}
                  className="mb-4 p-4 bg-blue-50 rounded-lg shadow-md"
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
              ))}
            </div>
          </div>

          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Map Overview</h2>
            <div className="h-[400px] w-full rounded-md">
              <MapComponent locations={reportedCases} />
            </div>

          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Reported Cases</h2>
          <div className="h-[400px] overflow-y-auto">
            {reportedCases.map((item) => (
              <motion.div
                key={item._id}
                className="mb-4 p-4 bg-blue-50 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-blue-800 mb-4">{item.landmark}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => openModal(item)}
                  >
                    <Check className="w-4 h-4 mr-2 inline" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
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
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                  <p><strong>Reported by:</strong> {selectedCase.userId}</p>
                  <p><strong>Landmark:</strong> {selectedCase.landmark}</p>
                  <p><strong>Comments:</strong> {selectedCase.comments}</p>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Images:</h3>
                    <ImageCarousel images={selectedCase.images} />
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-[300px]">
                  <MapComponent location={selectedCase.location} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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