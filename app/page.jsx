'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Confetti from 'react-confetti'
import { MapPin, Heart, Users, Phone, ChevronDown, Briefcase, Clock, Gift, Star, CheckCircle } from 'lucide-react'
import { Playfair_Display, Libre_Baskerville } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] })
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400'] })

const FadeInEffect = ({ children }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {children}
    </motion.span>
  )
}

const FadeInSection = ({ children }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

const GlowingHeading = ({ children }) => {
  return (
    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center relative">
      <span className="relative z-10 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
        {children}
      </span>
      <span className="absolute inset-0 bg-teal-200 filter blur-lg opacity-50 animate-pulse"></span>
    </h2>
  )
}

const springAnimation = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 300, damping: 10 }
}

const LandingPage = () => {
  const [showConfetti, setShowConfetti] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: y1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 opacity-30"></div>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zac-durant-76HhAKI5JXI-unsplash.jpg-776aXZLPFQggyMmX4jays47SpD7Zva.jpeg')",
                filter: 'grayscale(30%)'
              }}
            ></div>
          </motion.div>
          <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-4xl mx-4">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold mb-6 text-teal-800 text-center relative"
            >
              <FadeInEffect>
                <span className="relative z-10 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  Welcome to StreetGuardian
                </span>
                <span className="absolute inset-0 bg-teal-200 filter blur-lg opacity-50 animate-pulse"></span>
              </FadeInEffect>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl mb-8 text-gray-700 text-center"
            >
              Empowering communities to support those in need
            </motion.p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={springAnimation}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 relative overflow-hidden group"
              >
              <Link href="/login">
  <span className="relative z-10">Get Started</span>
</Link>
                <span className="absolute inset-0 bg-white opacity-25 group-hover:animate-pulse"></span>
              </motion.button>
              {/* <motion.button
                whileHover={springAnimation}
                className="w-full sm:w-auto border-2 border-teal-600 text-teal-600 font-semibold py-3 px-8 rounded-full hover:bg-teal-600 hover:text-white transition duration-300"
              >
                Learn More
              </motion.button> */}
            </div>
          </div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown size={32} className="text-white" />
          </motion.div>
        </motion.div>

        <FadeInSection>
          <div className="container mx-auto px-4 py-16">
            <GlowingHeading>Our Mission</GlowingHeading>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="grid md:grid-cols-2">
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Bridging the Gap</h3>
                  <p className="text-gray-600 mb-4">
                    At StreetGuardian, we believe that everyone deserves a safe place to call home. Our mission is to bridge the gap between those experiencing homelessness and the resources they need to rebuild their lives.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Provide immediate assistance to those in crisis',
                      'Connect individuals with long-term support',
                      'Empower communities to address homelessness',
                      'Advocate for systemic changes'
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <CheckCircle className="text-teal-500 mr-2 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Community support illustration"
                    className="w-full h-full object-cover rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-20 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"></div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="container mx-auto px-4 py-16">
            <GlowingHeading>How StreetGuardian Works</GlowingHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: 'Locate', description: 'Identify individuals in need of assistance through our user-friendly app' },
                { icon: Heart, title: 'Connect', description: 'Link them with appropriate support services tailored to their specific needs' },
                { icon: Users, title: 'Support', description: 'Provide ongoing community care and resources for sustainable recovery' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="bg-gradient-to-r from-teal-200 to-blue-200 p-3 rounded-full mb-4">
                    <item.icon size={32} className="text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="container mx-auto px-4 py-16">
            <GlowingHeading>Our Step-by-Step Approach</GlowingHeading>
            <div className="w-full">
              {[
                { step: 1, title: 'Report', description: 'Users report individuals in need via our app', icon: Phone },
                { step: 2, title: 'Assess', description: 'Our team assesses the situation quickly', icon: Briefcase },
                { step: 3, title: 'Connect', description: 'We link individuals with support services', icon: MapPin },
                { step: 4, title: 'Follow-up', description: 'Regular check-ins ensure ongoing support', icon: Clock },
                { step: 5, title: 'Engage', description: 'Community involvement for long-term support', icon: Users }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg w-full flex items-center mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="bg-gradient-to-r from-teal-200 to-blue-200 p-3 rounded-full mr-4 flex-shrink-0">
                    <item.icon size={24} className="text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Step {item.step}: {item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="container mx-auto px-4 py-16">
            <GlowingHeading>Rewards Program</GlowingHeading>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Earn Points, Make a Difference</h3>
                  <p className="text-gray-600 mb-4">
                    Our rewards program recognizes and incentivizes your contributions to the community. Earn points for various activities and redeem them for exclusive benefits or donate them to causes you care about.
                  </p>
                  <ul className="space-y-4">
                    {[
                      { text: 'Volunteer hours', icon: Clock, points: 100 },
                      { text: 'Donations', icon: Gift, points: 50 },
                      { text: 'Referrals', icon: Users, points: 75 },
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center bg-teal-50 p-3 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <item.icon size={24} className="text-teal-600 mr-3" />
                        <span className="text-gray-700 flex-grow">{item.text}</span>
                        <span className="text-teal-600 font-semibold">{item.points} pts</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={springAnimation}
                    className="mt-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                    onClick={() => window.location.href = '/rewards'}
                  >
                    Join Rewards Program
                  </motion.button>
                </div>
                <div className="relative h-64 md:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                    alt="Rewards program illustration"
                    className="w-full h-full object-cover rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-20 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"></div>
                  <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                    <Star size={32} className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="container mx-auto px-4 py-16">
            <GlowingHeading>Join Our Community</GlowingHeading>
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <p className="text-lg mb-6 text-center text-gray-600">
                Stay updated with our latest initiatives, success stories, and volunteer opportunities. Together, we can make a lasting difference in the lives of those experiencing homelessness.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(0, 255, 255, 0.5)" }}
                  transition={{ duration: 0.01 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                >
                  Send me an e-mail!
                </motion.button>
              </form>
            </div>
          </div>
        </FadeInSection>
      </main>

      <footer className={`bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12 rounded-t-3xl mt-16`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className={`text-lg font-bold mb-4 ${playfair.className}`}>StreetGuardian</h3>
              <p className={`text-teal-100 ${libreBaskerville.className}`}>Empowering communities to support those in need</p>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-4 ${playfair.className}`}>Quick Links</h3>
              <ul className="space-y-2">
                {['About', 'Services', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`text-teal-100 hover:text-white transition-colors duration-200 ${libreBaskerville.className}`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-4 ${playfair.className}`}>Contact Us</h3>
              <address className={`text-teal-100 not-italic ${libreBaskerville.className}`}>
                <p>Nitin, Mahin, Shambhavi, Srijan</p>
                <p>Students at VIT, Vellore</p>
                <p>street.guardian.tech@gmail.com</p>
              </address>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-4 ${playfair.className}`}>Follow Us</h3>
              <div className="flex space-x-4">
                {[
              
                  { name: 'Instagram', href: 'https://instagram.com/nexnode01' },
                  { name: 'LinkedIn', href: 'https://linkedin.com/company/nexnode' },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-teal-100 hover:text-white transition-colors duration-200 ${libreBaskerville.className}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

            </div>
          </div>
          <div className={`mt-8 pt-8 border-t border-teal-500 text-center text-teal-100 ${libreBaskerville.className}`}>
            <p>&copy; {new Date().getFullYear()} StreetGuardian ©2024. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
    </div>
  )
}

export default LandingPage

