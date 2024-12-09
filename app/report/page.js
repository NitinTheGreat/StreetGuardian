"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { MapPin, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
const Map = dynamic(() => import('../../components/MapComponent'), { ssr: false })

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

const GlowingHeading = ({ children }) => {
  return (
    <h1 className="text-3xl font-bold mb-6 text-center relative">
      <span className="relative z-10 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
        {children}
      </span>
      <span className="absolute inset-0 bg-blue-200 filter blur-lg opacity-50 animate-pulse"></span>
    </h1>
  );
};

function ReportPage() {
  const [location, setLocation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [images, setImages] = useState([])
  const [comments, setComments] = useState('')
  const [landmark, setLandmark] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [badgeMessage, setBadgeMessage] = useState('');
  const router = useRouter()

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length + images.length > 3) {
      alert("You can only upload a maximum of 3 images.")
      return
    }
    const newImages = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))
    setImages(prevImages => [...prevImages, ...newImages])
  }, [images])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 3 - images.length
  })

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(images.length - 2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("Please log in to submit the report.");
      return;
    }
  
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          location,
          images: images.map(img => img.preview),
          comments,
          landmark,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setBadgeMessage('Thanks for submitting!');
        setTimeout(() => setBadgeMessage(''),4000); 
        setTimeout(() => {
          router.push('/rewards');
        }, 4000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report.');
    }
  };

  const handleMapClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setShowModal(true)
        },
        error => {
          console.error("Error getting location:", error)
          setShowModal(true)
        }
      )
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 to-blue-500 p-8 mt-14">
      <motion.div
        className="max-w-7xl mx-auto bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="w-full md:w-1/2 h-[800px] relative">
          <div 
            className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleMapClick}
          >
            {location ? (
              <Map location={location} setLocation={setLocation} />
            ) : (
              <MapPin className="w-12 h-12 text-blue-600" />
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full md:w-1/2">
          <GlowingHeading>Report Homeless</GlowingHeading>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Images (Max 3)</label>
              <motion.div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                whileHover={{ boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)' }}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto w-12 h-12 text-blue-600" />
                <p className="mt-2 text-sm text-gray-600">
                  {isDragActive ? 'Drop the files here' : 'Drag & drop images here, or click to select files'}
                </p>
              </motion.div>
            </div>

            {images.length > 0 && (
              <motion.div className="relative h-48 bg-gray-100 rounded-2xl overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex].preview}
                    alt={`Preview ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                <motion.button
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                  onClick={() => removeImage(currentImageIndex)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-red-500" />
                </motion.button>
                {images.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-6 h-6 text-blue-600" />
                    </motion.button>
                    <motion.button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-6 h-6 text-blue-600" />
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label htmlFor="landmark" className="block text-sm font-bold text-gray-700 mb-2">Nearest Landmark</label>
              <input
                id="landmark"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter the nearest landmark"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="comments" className="block text-sm font-bold text-gray-700 mb-2">Comments</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows="4"
                placeholder="Provide any additional details"
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Submit Report</span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
            </motion.button>
            <AnimatePresence>
              {badgeMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="fixed top-14 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
                >
                  {badgeMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white bg-opacity-90 rounded-xl shadow-lg p-4"
      >
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="whitespace-nowrap"
          >
            <span className="text-blue-600 font-bold mr-8">🎉 15 cases solved today!</span>
            <span className="text-blue-600 font-bold mr-8">🏆 Earn rewards by reporting homeless individuals</span>
            <span className="text-blue-600 font-bold mr-8">💪 Join our community effort to help those in need</span>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white p-8 rounded-2xl w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Confirm Location</h2>
              <div className="h-64 mb-4 rounded-xl overflow-hidden">
                <Map location={location} setLocation={setLocation} />
              </div>
              <p className="mb-4 text-sm text-gray-600">Click on the map to adjust the pin location.</p>
              <motion.button
                className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 relative overflow-hidden group"
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Confirm Location</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ReportPage
