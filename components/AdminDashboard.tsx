'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MapPin, X, ChevronLeft, ChevronRight, AlertTriangle, Menu } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false })

const AdminDashboard = () => {
  const [reportedCasesMap, setReportedCasesMap] = useState([])
  const [reportedCases, setReportedCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)

  const router = useRouter()

  const emergencyData = [
    { id: 1, text: 'Emergency situation reported at Main St.', type: 'urgent' },
    { id: 2, text: 'Fire alarm triggered in Building A', type: 'critical' },
    { id: 3, text: 'Medical assistance needed at Park Ave.', type: 'urgent' },
    { id: 4, text: 'Security breach detected in Sector 7', type: 'warning' },
    { id: 5, text: 'Traffic accident reported on Highway 101', type: 'urgent' },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-4 left-4 z-50 lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col space-y-4">
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Reports</Button>
            <Button variant="ghost">Analytics</Button>
            <Button variant="ghost">Settings</Button>
          </nav>
        </SheetContent>
      </Sheet>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Crisis Command Center</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>SOS: Emergencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {emergencyData.map((item) => (
                      <EmergencyCard key={item.id} item={item} />
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Active Cases" value="23" change="+5" />
                    <StatCard title="Resolved Today" value="17" change="+3" />
                    <StatCard title="Response Time" value="8m" change="-2m" />
                    <StatCard title="Team Members" value="12" change="0" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Crisis Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full rounded-md overflow-hidden">
                  <MapComponent locations={reportedCasesMap} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reported Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {reportedCases.map((item) => (
                    <ReportedCaseCard key={item._id} item={item} openModal={openModal} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

const EmergencyCard = ({ item }) => {
  const bgColor = item.type === 'critical' ? 'bg-red-100' : item.type === 'urgent' ? 'bg-orange-100' : 'bg-yellow-100'
  const textColor = item.type === 'critical' ? 'text-red-800' : item.type === 'urgent' ? 'text-orange-800' : 'text-yellow-800'

  return (
    <motion.div
      className={`${bgColor} rounded-lg shadow-md p-4 mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.id * 0.1 }}
    >
      <p className={`${textColor} mb-4`}>{item.text}</p>
      <div className="flex justify-end space-x-2">
        <Button size="sm" variant="outline">
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button>
        <Button size="sm" variant="outline">
          <MapPin className="w-4 h-4 mr-2" />
          Locate
        </Button>
      </div>
    </motion.div>
  )
}

const ReportedCaseCard = ({ item, openModal }) => (
  <Card>
    <CardContent className="pt-6">
      <h3 className="font-semibold mb-2">{item.landmark}</h3>
      <p className="text-sm text-gray-500 mb-4">Reported by: {item.userId}</p>
      <Button onClick={() => openModal(item)} className="w-full">
        View Details
      </Button>
    </CardContent>
  </Card>
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
        <h2 className="text-2xl font-bold text-gray-800">Case Details</h2>
        <Button variant="ghost" onClick={closeModal}>
          <X className="h-6 w-6" />
        </Button>
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
        <Button onClick={() => router.push('/adminlogin')} variant="default">
          Go to Admin Login
        </Button>
        <Button onClick={closeModal} variant="outline">
          Cancel
        </Button>
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
      <Button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full"
        size="icon"
        variant="outline"
        onClick={prevImage}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full"
        size="icon"
        variant="outline"
        onClick={nextImage}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

const StatCard = ({ title, value, change }) => {
  const isPositive = change.startsWith('+')
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline mt-4">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className={`ml-2 flex items-baseline text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminDashboard

