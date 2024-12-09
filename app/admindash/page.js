'use client'
import ProtectedComponent from '@/components/UnifiedProtectedComponent'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MapPin, X, ChevronLeft, ChevronRight, AlertTriangle, Menu, Activity, Users, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false })

const AdminDashboard = () => {
  const [reportedCasesMap, setReportedCasesMap] = useState([])
  const [reportedCases, setReportedCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)

  const router = useRouter()

  // Hardcoded data for fallback
  const hardcodedEmergencyData = [
    { id: 1, text: 'Emergency situation reported at Main St.', type: 'urgent' },
    { id: 2, text: 'Fire alarm triggered in Building A', type: 'critical' },
    { id: 3, text: 'Medical assistance needed at Park Ave.', type: 'urgent' },
    { id: 4, text: 'Security breach detected in Sector 7', type: 'warning' },
    { id: 5, text: 'Traffic accident reported on Highway 101', type: 'urgent' },
  ]
  const [emergencyData, setEmergencyData] = useState(hardcodedEmergencyData)

  useEffect(() => {
    fetchSOSCases()
    fetchReportedCasesMap()
    fetchReportedCases()
    checkAdminStatus()
  }, [])

  const fetchSOSCases = async () => {
    try {
      const response = await fetch('/api/sos')
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()
      setEmergencyData(data)
    } catch (error) {
      console.error('Error fetching SOS cases:', error)
      setEmergencyData(hardcodedEmergencyData) // Fallback to hardcoded data
    }
  }


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
    <div className="min-h-[calc(100vh-7vh)] bg-gradient-to-br from-cyan-200 to-blue-500 pt-[7vh]">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-[calc(7vh+1rem)] left-4 z-50 lg:hidden">
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
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Map</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-300 rounded-2xl overflow-hidden shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-600">SOS: Emergencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {emergencyData.map((item) => (
                      <EmergencyCard key={item.id} item={item} />
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-300 rounded-2xl overflow-hidden shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-600">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard title="Active Cases" value="23" change="+5" icon={Activity} />
                    <StatCard title="Resolved Today" value="17" change="+3" icon={Check} />
                    <StatCard title="Response Time" value="8m" change="-2m" icon={Clock} />
                    <StatCard title="Team Members" value="12" change="0" icon={Users} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="map">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-300 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-600">Crisis Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full rounded-xl overflow-hidden">
                  <MapComponent locations={reportedCasesMap} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-300 rounded-2xl overflow-hidden shadow-xl">
              <CardHeader>
                <CardTitle className="text-blue-600">Reported Cases</CardTitle>
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
  const borderColor = item.type === 'critical' ? 'border-red-300' : item.type === 'urgent' ? 'border-orange-300' : 'border-yellow-300'

  return (
    <motion.div
      className={`${bgColor} rounded-xl shadow-md p-4 mb-4 border-2 ${borderColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.id * 0.1 }}
    >
      <p className={`${textColor} mb-4`}>{item.text}</p>
      <div className="flex justify-end space-x-2">
        {/* <Button size="sm" variant="outline" className="rounded-full">
          <Check className="w-4 h-4 mr-2" />
          Approve
        </Button> */}
        <Button size="sm" variant="outline" className="rounded-full">
          <MapPin className="w-4 h-4 mr-2" />
          Locate
        </Button>
      </div>
    </motion.div>
  )
}

const ReportedCaseCard = ({ item, openModal }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="pt-6">
      <h3 className="font-semibold mb-2 text-blue-700">{item.landmark}</h3>
      <p className="text-sm text-gray-600 mb-4">Case ID: {item.userId}</p>
      <Button onClick={() => openModal(item)} className="w-full rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
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
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="bg-white p-8 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl border-4 border-blue-300"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Case Details</h2>
        <Button variant="ghost" onClick={closeModal} className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="mb-2"><strong className="text-blue-600">Case ID:</strong> {selectedCase.userId}</p>
          <p className="mb-2"><strong className="text-blue-600">Landmark:</strong> {selectedCase.landmark}</p>
          <p className="mb-4"><strong className="text-blue-600">Comments:</strong> {selectedCase.comments}</p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Images:</h3>
            <ImageCarousel images={selectedCase.images} />
          </div>
        </div>
        <div className="h-[300px] rounded-xl overflow-hidden shadow-lg">
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
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <motion.div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border-4 border-red-300">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
      <p className="mb-8 text-gray-700">You are not authorized to view these details.</p>
      <div className="flex justify-center space-x-4">
        <Button onClick={() => router.push('/adminlogin')} variant="default" className="rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
          Go to Admin Login
        </Button>
        <Button onClick={closeModal} variant="outline" className="rounded-full">
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
          className="w-full h-full object-cover rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
      <Button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/75 transition-colors duration-300"
        size="icon"
        variant="ghost"
        onClick={prevImage}
      >
        <ChevronLeft className="w-6 h-6 text-blue-600" />
      </Button>
      <Button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full bg-white/50 hover:bg-white/75 transition-colors duration-300"
        size="icon"
        variant="ghost"
        onClick={nextImage}
      >
        <ChevronRight className="w-6 h-6 text-blue-600" />
      </Button>
    </div>
  )
}

const StatCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change.startsWith('+')
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-xl overflow-hidden shadow-lg">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex items-baseline">
          <p className="text-2xl font-semibold text-blue-700">{value}</p>
          <p className={`ml-2 flex items-baseline text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProtectedComponent(AdminDashboard);
