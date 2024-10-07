'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FiMapPin, FiPhone, FiAlertCircle } from 'react-icons/fi';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('./Map'), { ssr: false });

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.07
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400 } },
  tap: { scale: 0.95 }
};

// Custom hook for getting user's location
const useGeoLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return location;
};

export default function Component() {
  const [selectedService, setSelectedService] = useState('hospital');
  const [nearestLocation, setNearestLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const userLocation = useGeoLocation();

  useEffect(() => {
    if (userLocation) {
      fetchNearestLocation();
    }
  }, [userLocation, selectedService]);

  const fetchNearestLocation = async () => {
    if (!userLocation) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/nearest?lat=${userLocation.lat}&lon=${userLocation.lng}&type=${selectedService}`);
      if (!response.ok) throw new Error('Failed to fetch nearest location');
      const data = await response.json();
      setNearestLocation({
        lat: data.lat,
        lng: data.lon,
        name: data.name,
      });
    } catch (err) {
      console.error('Error fetching nearest location:', err);
      setError('Failed to fetch nearest location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSOSSubmit = async () => {
    if (userLocation && nearestLocation) {
      try {
        const response = await fetch('/api/sos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userLocation,
            nearestLocation,
            serviceType: selectedService,
            description,
          }),
        });

        if (response.ok) {
          alert('SOS request submitted successfully!');
          setDescription('');
        } else {
          throw new Error('Failed to submit SOS request');
        }
      } catch (error) {
        console.error('Error submitting SOS request:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-teal-200 to-blue-500 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
        variants={childVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <motion.div variants={childVariants} className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-600">SOS Emergency Assistance</h1>
            <p className="text-gray-600">
              Use this service to quickly locate and contact the nearest hospital or police station in case of an emergency.
            </p>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-600">Select Service</h2>
              <div className="flex space-x-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`py-2 px-4 rounded-md ${selectedService === 'hospital' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedService('hospital')}
                >
                  Hospital
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`py-2 px-4 rounded-md ${selectedService === 'police' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedService('police')}
                >
                  Police Station
                </motion.button>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-600">Emergency Contact Numbers</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>Police: 100</span>
                </li>
                <li className="flex items-center">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>Ambulance: 102</span>
                </li>
                <li className="flex items-center">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>Fire: 101</span>
                </li>
                <li className="flex items-center">
                  <FiPhone className="mr-2 text-blue-600" />
                  <span>Women Helpline: 1091</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-600">Describe Your Emergency</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
                placeholder="Please briefly describe your emergency..."
              ></textarea>
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md shadow-md flex items-center justify-center"
              onClick={handleSOSSubmit}
              disabled={!nearestLocation || isLoading || !description.trim()}
            >
              <FiAlertCircle className="mr-2" />
              Send SOS Alert
            </motion.button>
          </motion.div>
          <motion.div variants={childVariants} className="h-[600px] relative">
            {userLocation ? (
              <Map userLocation={userLocation} nearestLocation={nearestLocation} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <FiMapPin className="text-4xl text-gray-400 animate-bounce" />
                <p className="ml-2 text-gray-600">Loading map...</p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-75 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}