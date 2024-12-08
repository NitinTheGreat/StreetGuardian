'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiMapPin } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import('./Map'), { ssr: false });

export default function SOSPage() {
  const [selectedService, setSelectedService] = useState('hospital');
  const [selectedSeverity, setSelectedSeverity] = useState('warning');
  const [description, setDescription] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please check your browser settings and try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }, []);

  const handleSOSSubmit = async () => {
    if (userLocation) {
      try {
        const response = await fetch('/api/sos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: userLocation,
            serviceType: selectedService,
            severity: selectedSeverity,
            description,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('SOS request submitted:', result);
          setDescription('');
          alert('SOS request submitted successfully!');
        } else {
          throw new Error('Failed to submit SOS request');
        }
      } catch (error) {
        console.error('Error submitting SOS request:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Unable to determine your location. Please ensure location services are enabled.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-7vh)] bg-gradient-to-br from-teal-200 to-blue-500 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <div className="space-y-8">
            <motion.h1 
              className="text-5xl font-extrabold text-white text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              SOS Emergency
            </motion.h1>
            <motion.p 
              className="text-xl text-white text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Quick help when you need it most. Stay safe, stay connected.
            </motion.p>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-white">Choose Service</h2>
              <div className="flex flex-wrap gap-4">
                {['hospital', 'police', 'fire', 'ambulance'].map((service) => (
                  <motion.button
                    key={service}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 px-6 rounded-full text-lg font-medium transition-colors duration-200 ${
                      selectedService === service 
                        ? 'bg-white text-blue-600' 
                        : 'bg-blue-600 bg-opacity-50 text-white hover:bg-opacity-75'
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-white">Emergency Level</h2>
              <div className="flex flex-wrap gap-4">
                {['urgent', 'critical', 'warning'].map((severity) => (
                  <motion.button
                    key={severity}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 px-6 rounded-full text-lg font-medium transition-colors duration-200 ${
                      selectedSeverity === severity 
                        ? 'bg-white text-blue-600' 
                        : 'bg-blue-600 bg-opacity-50 text-white hover:bg-opacity-75'
                    }`}
                    onClick={() => setSelectedSeverity(severity)}
                  >
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-white">Describe Your Emergency</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 text-blue-800 bg-white bg-opacity-75 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-opacity-100 transition-all duration-200"
                rows="4"
                placeholder="Please briefly describe your emergency..."
              ></textarea>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 px-6 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center text-xl font-bold transition-colors duration-200 hover:bg-red-600"
              onClick={handleSOSSubmit}
              disabled={!userLocation || !description.trim()}
            >
              <FiAlertCircle className="mr-2" />
              Send SOS Alert
            </motion.button>
          </div>
          <motion.div 
            className="h-[calc(100vh-15vh)] lg:h-auto relative rounded-2xl overflow-hidden shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {userLocation ? (
              <Map userLocation={userLocation} />
            ) : (
              <div className="h-full flex items-center justify-center bg-blue-100 bg-opacity-50">
                <FiMapPin className="text-6xl text-blue-600 animate-bounce" />
                <p className="ml-4 text-2xl font-semibold text-blue-800">Locating you...</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
