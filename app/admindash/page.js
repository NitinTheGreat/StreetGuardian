"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, MapPinIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

const AdminDashboard = () => {
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  const emergencyData = [
    { id: 1, text: 'Emergency situation reported at Main St.' },
    { id: 2, text: 'Fire alarm triggered in Building A' },
    { id: 3, text: 'Medical assistance needed at Park Ave.' },
    { id: 4, text: 'Security breach detected in Sector 7' },
    { id: 5, text: 'Traffic accident reported on Highway 101' },
  ]

  const notificationData = [
    { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { id: 3, text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
    { id: 4, text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' },
    { id: 5, text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
  ]

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet/dist/leaflet.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet/dist/leaflet.js'
    script.onload = initializeMap
    document.body.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [])

  const initializeMap = () => {
    const mapInstance = L.map('map').setView([20.5937, 78.9629], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance)
    setMap(mapInstance)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          mapInstance.setView([latitude, longitude], 15)
          addMarker(mapInstance, latitude, longitude)
          submitLocation(latitude, longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }

  const addMarker = (mapInstance, lat, lon) => {
    mapInstance.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapInstance.removeLayer(layer)
      }
    })

    L.marker([lat, lon]).addTo(mapInstance)
      .bindPopup('You\'re here!')
      .openPopup()
  }

  const submitLocation = (latitude, longitude) => {
    fetch('/submit-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude, longitude })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      if (data.success) {
        console.log('Location saved successfully!')
        checkNearbyLocations(latitude, longitude)
      } else {
        console.error('Failed to save location')
      }
    })
    .catch(error => {
      console.error('Error saving location:', error)
    })
  }

  const checkNearbyLocations = (lat, lon) => {
    fetch('/get-locations')
      .then(response => response.json())
      .then(locations => {
        let count = 0
        locations.forEach(loc => {
          const distance = calculateDistance(lat, lon, loc.latitude, loc.longitude)
          if (distance <= 10) {
            count++
          }
        })

        if (count >= 10) {
          drawCircle(lat, lon)
        }
      })
      .catch(error => {
        console.error('Error fetching locations:', error)
      })
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = degreesToRadians(lat2 - lat1)
    const dLon = degreesToRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180)
  }

  const drawCircle = (lat, lon) => {
    if (map) {
      L.circle([lat, lon], {
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.2,
        radius: 1500
      }).addTo(map)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 to-blue-500">
      <main className="pt-20 px-4 md:px-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="w-full md:w-1/3 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">
                SOS : Emergencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-green-500 hover:text-white transition-colors duration-200 border-blue-500 text-blue-500"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-red-500 hover:text-white transition-colors duration-200 border-blue-500 text-blue-500"
                      >
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        Locate
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="w-full md:w-2/3 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">
                Map Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="map" className="h-[400px] w-full rounded-md"></div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-600">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {notificationData.map((item) => (
                <motion.div
                  key={item.id}
                  className="mb-4 p-4 bg-blue-50 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.id * 0.1 }}
                >
                  <p className="text-blue-800 mb-4">{item.text}</p>
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-green-500 hover:text-white transition-colors duration-200 border-blue-500 text-blue-500"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-red-500 hover:text-white transition-colors duration-200 border-blue-500 text-blue-500"
                    >
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      Locate
                    </Button>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AdminDashboard