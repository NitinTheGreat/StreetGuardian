'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Confetti from 'react-confetti'
import { MapPin, Heart, Users, Phone, ChevronDown, Home, Briefcase, Book, Coffee, Menu, X, Clock, Gift, Star, CheckCircle, ArrowRight } from 'lucide-react'

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('Wel')
  const [index, setIndex] = useState(3)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDeleting && index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        setIndex(index + 1)
      } else if (isDeleting && index > 3) {
        setDisplayText(text.slice(0, index - 1))
        setIndex(index - 1)
      } else if (index === text.length) {
        setIsDeleting(true)
      } else if (index === 3) {
        setIsDeleting(false)
      }
    }, isDeleting ? 50 : 150)

    return () => clearTimeout(timer)
  }, [index, isDeleting, text])

  return <span>{displayText}</span>
}

const Section = ({ children, id = '' }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    } else {
      controls.start('hidden')
    }
  }, [controls, inView])

  return (
    <motion.section
      id={id}
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="py-16 md:py-24"
    >
      {children}
    </motion.section>
  )
}

const springAnimation = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 300, damping: 10 }
}

const StepArrow = () => (
  <svg className="w-16 h-16 text-pink-400 mx-auto my-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StreetGuardian
            </a>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-white" />
                ) : (
                  <Menu size={24} className="text-white" />
                )}
              </button>
            </div>
            <ul className="hidden md:flex space-x-6">
              {['About', 'Services', 'Contact', 'Login'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-md"
          >
            <ul className="py-2">
              {['About', 'Services', 'Contact', 'Login'].map((item) => (
                <li key={item} className="px-4 py-2">
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </header>

      <main>
        <Section>
          <div className="container mx-auto px-4 pt-20 text-center relative overflow-hidden min-h-screen flex items-center justify-center">
            <motion.div 
              className="absolute inset-0 z-0"
              style={{ y: y1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1949&q=80')",
                  filter: 'grayscale(50%)'
                }}
              ></div>
            </motion.div>
            <div className="relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                <TypewriterEffect text="Welcome to StreetGuardian" />
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xl md:text-2xl mb-8 text-gray-700"
              >
                Empowering communities to support those in need
              </motion.p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={springAnimation}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={springAnimation}
                  className="w-full sm:w-auto border-2 border-purple-600 text-purple-600 font-semibold py-3 px-8 rounded-full hover:bg-purple-600 hover:text-white transition duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              <ChevronDown size={32} className="text-white" />
            </motion.div>
          </div>
        </Section>

        <Section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Mission</h2>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="grid md:grid-cols-2">
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Bridging the Gap</h3>
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
                        <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" size={20} />
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"></div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">How StreetGuardian Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, title: 'Locate', description: 'Identify individuals in need of assistance through our user-friendly app' },
                { icon: Heart, title: 'Connect', description: 'Link them with appropriate support services tailored to their specific needs' },
                { icon: Users, title: 'Support', description: 'Provide ongoing community care and resources for sustainable recovery' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg"
                  whileHover={springAnimation}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-3 rounded-full mb-4">
                    <item.icon size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Step-by-Step Approach</h2>
            <div className="space-y-8">
              {[
                { step: 1, title: 'Report', description: 'Users can report individuals in need through our easy-to-use mobile app or website.', icon: Phone },
                { step: 2, title: 'Assess', description: 'Our trained team quickly assesses the situation and determines the most appropriate course of action.', icon: Briefcase },
                { step: 3, title: 'Connect', description: 'We connect the individual with nearby shelters, healthcare providers, or other relevant support services.', icon: MapPin },
                { step: 4, title: 'Follow-up', description: 'Our team conducts regular follow-ups to ensure the individual is receiving the necessary support and care.', icon: Clock },
                { step: 5, title: 'Community Engagement', description: 'We involve local communities in providing long-term support and reintegration assistance.', icon: Users }
              ].map((item, index) => (
                <div key={index}>
                  <motion.div
                    className="flex items-center bg-white p-6 rounded-2xl shadow-lg"
                    whileHover={springAnimation}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-4 rounded-full mr-6 flex-shrink-0">
                      <item.icon size={32} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Step {item.step}: {item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                  {index < 4 && <StepArrow />}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Rewards Program</h2>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Earn Points, Make a Difference</h3>
                  <p className="text-gray-600 mb-4">
                    Our rewards program recognizes and incentivizes your contributions to the community. Earn points for various activities and redeem them for exclusive benefits or donate them to causes you care about.
                  </p>
                  <ul className="space-y-4">
                    {[
                      { text: 'Volunteer hours', icon: Clock, points: 100 },
                      { text: 'Donations', icon: Gift, points: 50 },
                      { text: 'Referrals', icon: Users, points: 75 },
                      { text: 'Community engagement', icon: Heart, points: 25 }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center bg-purple-50 p-3 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <item.icon size={24} className="text-purple-600 mr-3" />
                        <span className="text-gray-700 flex-grow">{item.text}</span>
                        <span className="text-purple-600 font-semibold">{item.points} pts</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={springAnimation}
                    className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                    onClick={() => setShowConfetti(true)}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"></div>
                  <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                    <Star size={32} className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Join Our Community</h2>
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <p className="text-lg mb-6 text-center text-gray-600">
                Stay updated with our latest initiatives, success stories, and volunteer opportunities. Together, we can make a lasting difference in the lives of those experiencing homelessness.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <motion.button
                  whileHover={springAnimation}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>
        </Section>
      </main>

      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 rounded-t-3xl mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StreetGuardian</h3>
              <p className="text-purple-100">Empowering communities to support those in need</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['About', 'Services', 'Contact', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-purple-100 hover:text-white transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-purple-100 not-italic">
                <p>123 Compassion Street</p>
                <p>Kindness City, KC 12345</p>
                <p>contact@streetguardian.org</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((item) => (
                  <a key={item} href="#" className="text-purple-100 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-500 text-center text-purple-100">
            <p>&copy; {new Date().getFullYear()} StreetGuardian. All rights reserved.</p>
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