'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function SupportPageComponent() {
  const [showMoreFAQ, setShowMoreFAQ] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-200 to-blue-500 p-6 mt-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">StreetGuardian Support</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Contact Support</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700">Issue</label>
              <select id="issue" name="issue" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option value="">Select an issue</option>
                <option value="technical">Technical problem</option>
                <option value="account">Account related</option>
                <option value="billing">Billing inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowMoreFAQ(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              See More FAQs
            </button>
          </div>
        </div>
      </div>

      {showMoreFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-600">More FAQs</h2>
              <button
                onClick={() => setShowMoreFAQ(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {moreFaqItems.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 text-center text-white">
        <p>© 2023 StreetGuardian. All rights reserved.</p>
      </footer>
    </div>
  )
}