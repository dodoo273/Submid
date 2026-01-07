'use client'

import { useState } from 'react'
import { Metadata } from 'next'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        const data = await res.json()
        setErrorMessage(data.error || 'Failed to send message')
        setStatus('error')
      }
    } catch {
      setErrorMessage('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="section-subtitle mb-3">GET IN TOUCH</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair text-gray-800 mb-5">
            CONTACT US
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
          {/* Form Section */}
           <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 font-playfair">
                Send Us A Message
              </h2>

              {/* Success Message */}
              {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                  <div className="flex items-start">
                    <i className="fas fa-check-circle text-xl mt-0.5 mr-3 flex-shrink-0"></i>
                    <p className="text-sm sm:text-base">Thank you! Your message has been sent successfully.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <div className="flex items-start">
                    <i className="fas fa-exclamation-circle text-xl mt-0.5 mr-3 flex-shrink-0"></i>
                    <p className="text-sm sm:text-base">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm sm:text-base mb-2 text-gray-700 font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    maxLength={255}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-b-2 border-gray-300 bg-transparent outline-none py-2 sm:py-3 text-sm sm:text-base transition-colors focus:border-amber-600"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base mb-2 text-gray-700 font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-b-2 border-gray-300 bg-transparent outline-none py-2 sm:py-3 text-sm sm:text-base transition-colors focus:border-amber-600"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm sm:text-base mb-2 text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength={20}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-b-2 border-gray-300 bg-transparent outline-none py-2 sm:py-3 text-sm sm:text-base transition-colors focus:border-amber-600"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm sm:text-base mb-2 text-gray-700 font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    maxLength={255}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border-b-2 border-gray-300 bg-transparent outline-none py-2 sm:py-3 text-sm sm:text-base transition-colors focus:border-amber-600"
                    placeholder="What is this about?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm sm:text-base mb-2 text-gray-700 font-medium">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border-2 border-gray-300 p-3 sm:p-4 outline-none rounded-lg text-sm sm:text-base transition-colors focus:border-amber-600 resize-none"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white px-10 sm:px-14 py-4 hover:from-amber-700 hover:to-amber-800 transition-all duration-300 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  >
                    {status === 'loading' ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>SUBMIT MESSAGE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            {/* Address Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-amber-600 text-lg sm:text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">OUR ADDRESS</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    SUBMID Coffee<br />
                    Jl. Kopi Nusantara No. 12<br />
                    Jakarta, Indonesia 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-envelope text-amber-600 text-lg sm:text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">EMAIL US</h3>
                  <a
                    href="mailto:support@coffeereo.com"
                    className="text-sm sm:text-base text-amber-600 hover:text-amber-700 break-all transition-colors"
                  >
                    support@coffeereo.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-phone-alt text-amber-600 text-lg sm:text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">CALL US</h3>
                  <a
                    href="tel:+6281234567890"
                    className="text-sm sm:text-base text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-clock text-amber-600 text-lg sm:text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">OPENING HOURS</h3>
                  <div className="text-sm sm:text-base text-gray-600 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Monday - Friday</span>
                      <span className="font-medium">07:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Saturday - Sunday</span>
                      <span className="font-medium">08:00 - 23:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-share-alt text-amber-600 text-lg sm:text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">FOLLOW US</h3>
                  <div className="flex gap-3">
                    <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-amber-100 rounded-full flex items-center justify-center transition-colors group">
                      <i className="fab fa-instagram text-gray-600 group-hover:text-amber-600"></i>
                    </a>
                    <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-amber-100 rounded-full flex items-center justify-center transition-colors group">
                      <i className="fab fa-facebook-f text-gray-600 group-hover:text-amber-600"></i>
                    </a>
                    <a href="#" className="w-9 h-9 bg-gray-100 hover:bg-amber-100 rounded-full flex items-center justify-center transition-colors group">
                      <i className="fab fa-twitter text-gray-600 group-hover:text-amber-600"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
