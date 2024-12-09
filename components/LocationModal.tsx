import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false })

interface LocationModalProps {
  location: [number, number] // Assuming location is an array of two numbers [longitude, latitude]
  closeModal: () => void
}

const LocationModal: React.FC<LocationModalProps> = ({ location, closeModal }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="bg-white p-8 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl border-4 border-blue-300"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Location</h2>
        <Button variant="ghost" onClick={closeModal} className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
        <MapComponent location={location} locations={undefined} setLocation={undefined} />
      </div>
    </motion.div>
  </motion.div>
)

export default LocationModal

