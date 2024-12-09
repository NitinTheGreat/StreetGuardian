'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function SupportPageComponent() {
  const [showMoreFAQ, setShowMoreFAQ] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email."
    },
    {
      question: "What should I do if I encounter a technical issue?",
      answer: "If you experience any technical issues, please try clearing your browser cache and cookies. If the problem persists, contact our support team using the form above."
    },
    {
      question: "How can I update my account information?",
      answer: "You can update your account information by logging in and navigating to the 'Account Settings' page. From there, you can modify your personal details and preferences."
    },
    {
      question: "Is my data secure with StreetGuardian?",
      answer: "Yes, we take data security very seriously. We use industry-standard encryption and security measures to protect your personal information and ensure your data remains confidential."
    }
  ]

  const moreFaqItems = [
    {
      question: "How often is the StreetGuardian app updated?",
      answer: "We regularly update our app to improve performance, add new features, and fix any bugs. We recommend enabling automatic updates to ensure you're always using the latest version."
    },
    {
      question: "Can I use StreetGuardian on multiple devices?",
      answer: "Yes, you can use your StreetGuardian account on multiple devices. Simply log in with your credentials on each device to access your account."
    },
    {
      question: "What should I do if I notice suspicious activity in my neighborhood?",
      answer: "If you notice suspicious activity, report it immediately through the app. For emergencies, always contact your local law enforcement first."
    }
  ]

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-blue-300 to-blue-500 p-6 pt-16 mt-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600">
            StreetGuardian Support
          </h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-200 bg-white bg-opacity-50 backdrop-blur-sm px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-200 bg-white bg-opacity-50 backdrop-blur-sm px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700">Issue</label>
              <select 
                id="issue" 
                name="issue" 
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-200 bg-white bg-opacity-50 backdrop-blur-sm px-4 py-3"
              >
                <option value="">Select an issue</option>
                <option value="technical">Technical problem</option>
                <option value="account">Account related</option>
                <option value="billing">Billing inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent transition duration-200 bg-white bg-opacity-50 backdrop-blur-sm px-4 py-3"
              ></textarea>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-blue-600 hover:from-teal-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                Submit
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white bg-opacity-90 rounded-2xl shadow-lg p-8 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                  {expandedFAQ === index ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-gray-500" />}
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowMoreFAQ(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-400 to-blue-600 hover:from-teal-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              See More FAQs
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMoreFAQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600">More FAQs</h2>
                <button
                  onClick={() => setShowMoreFAQ(false)}
                  className="text-gray-500 hover:text-black transition duration-200"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {moreFaqItems.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-center text-white">
        <p>© 2024 StreetGuardian. All rights reserved.</p>
      </footer>
    </div>
  )
}

