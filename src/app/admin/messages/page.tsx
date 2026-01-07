'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact')
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="container mx-auto px-0 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 font-playfair text-amber-800">
                <i className="fas fa-inbox mr-2"></i> Inbox ({messages.length})
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-amber-600"></i>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMessage?.id === msg.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{msg.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{msg.email}</p>
                      <p className="text-sm text-gray-500 overflow-hidden break-words">{msg.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6 font-playfair text-amber-800">
                <i className="fas fa-envelope-open mr-2"></i> Detail
              </h2>

              {selectedMessage ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">From</label>
                    <p className="font-semibold">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date</label>
                    <p>{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Message</label>
                    <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap overflow-hidden break-words">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message to SUBMID Coffee`}
                    className="block w-full text-center bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
                  >
                    <i className="fas fa-reply mr-2"></i> Reply
                  </a>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Select a message to view details
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
