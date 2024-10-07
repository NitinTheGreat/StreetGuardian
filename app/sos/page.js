'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FiMapPin, FiPhone, FiAlertCircle } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then((mod) => mod.useMap), { ssr: false });

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

// Custom icon for markers
const createIcon = (iconUrl) => {
  return new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to add routing
const RoutingMachine = ({ userLocation, nearestLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !nearestLocation) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(nearestLocation.lat, nearestLocation.lng)
      ],
      lineOptions: {
        styles: [{ color: 'red', opacity: 0.6, weight: 4 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, userLocation, nearestLocation]);

  return null;
};

export default function SOSPage() {
  const [selectedService, setSelectedService] = useState('hospital');
  const [nearestLocation, setNearestLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
          }),
        });

        if (response.ok) {
          alert('SOS request submitted successfully!');
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
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full py-2 px-4 bg-red-600 text-white rounded-md shadow-md flex items-center justify-center"
              onClick={handleSOSSubmit}
              disabled={!nearestLocation || isLoading}
            >
              <FiAlertCircle className="mr-2" />
              Send SOS Alert
            </motion.button>
          </motion.div>
          <motion.div variants={childVariants} className="h-[600px] relative">
            {typeof window !== 'undefined' && userLocation && (
              <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker 
                  position={[userLocation.lat, userLocation.lng]} 
                  icon={createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png')}
                >
                  <Popup>Your Location</Popup>
                </Marker>
                {nearestLocation && (
                  <Marker 
                    position={[nearestLocation.lat, nearestLocation.lng]}
                    icon={createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png')}
                  >
                    <Popup>{nearestLocation.name}</Popup>
                  </Marker>
                )}
                {userLocation && nearestLocation && (
                  <RoutingMachine userLocation={userLocation} nearestLocation={nearestLocation} />
                )}
              </MapContainer>
            )}
            {(!userLocation || isLoading) && (
              <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <FiMapPin className="text-4xl text-gray-400 animate-bounce" />
                <p className="ml-2 text-gray-600">Loading map...</p>
              </div>
            )}
            {error && (
              <div className="h-full flex items-center justify-center bg-red-100 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}