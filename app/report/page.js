"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { MapPin, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import ProtectedRoute from "../../components/ProtectedComponent";

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

function ReportPage() {
  const [location, setLocation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [images, setImages] = useState([])
  const [comments, setComments] = useState('')
  const [landmark, setLandmark] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
  
    // Get JWT token from localStorage or auth state
    const token = localStorage.getItem('token'); // Adjust this based on how you're storing the JWT
  
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
          images: images.map(img => img.preview), // Send image URLs (update this if you upload images to cloud storage)
          comments,
          landmark,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
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
          setShowModal(true) // Still show modal even if there's an error
        }
      )
    } else {
      setShowModal(true) // Show modal even if geolocation is not available
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2f1] via-[#01579b] to-[#e0f2f1] p-8 mt-14">
      <motion.div
        className="max-w-7xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 flex flex-col md:flex-row gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="w-full md:w-1/2 h-[800px] relative">
          <div 
            className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={handleMapClick}
          >
            {location ? (
              <Map location={location} setLocation={setLocation} />
            ) : (
              <MapPin className="w-12 h-12 text-[#01579b]" />
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-[#01579b] mb-6">Report Homeless</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Max 3)</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                  isDragActive ? 'border-[#01579b]' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {isDragActive ? 'Drop the files here' : 'Drag & drop images here, or click to select files'}
                </p>
              </div>
            </div>

            {images.length > 0 && (
              <motion.div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
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
                <button
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                  onClick={() => removeImage(currentImageIndex)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    >
                      <ChevronLeft className="w-6 h-6 text-[#01579b]" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    >
                      <ChevronRight className="w-6 h-6 text-[#01579b]" />
                    </button>
                  </>
                )}
              </motion.div>
            )}

            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">Nearest Landmark</label>
              <input
                id="landmark"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter the nearest landmark"
              />
            </div>

            <div>
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                placeholder="Provide any additional details"
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#01579b] text-white px-6 py-2 rounded-lg shadow"
            >
              Submit Report
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white bg-opacity-90 rounded-lg shadow-lg p-4"
      >
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="whitespace-nowrap"
          >
            <span className="text-[#01579b] font-bold mr-8">🎉 15 cases solved today!</span>
            <span className="text-[#01579b] font-bold mr-8">🏆 Earn rewards by reporting homeless individuals</span>
            <span className="text-[#01579b] font-bold mr-8">💪 Join our community effort to help those in need</span>
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
              className="bg-white p-8 rounded-lg w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4">Confirm Location</h2>
              <div className="h-64 mb-4">
                <Map location={location} setLocation={setLocation} />
              </div>
              <p className="mb-4 text-sm text-gray-600">Click on the map to adjust the pin location.</p>
              <button
                className="w-full bg-[#01579b] text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Confirm Location
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default ProtectedRoute(ReportPage);
