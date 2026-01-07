'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

interface Reservation {
  id: number
  fullName: string
  whatsappNumber: string
  reservationDate: string | Date
  arrivalTime: string
  numberOfGuests: number
  areaChoice: string
  additionalNotes: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations')
      const data = await res.json()
      if (Array.isArray(data)) {
        setReservations(data)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setReservations(prev => 
          prev.map(rev => rev.id === id ? { ...rev, status: newStatus as any } : rev)
        )
        if (selectedReservation?.id === id) {
          setSelectedReservation(prev => prev ? { ...prev, status: newStatus as any } : null)
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteReservation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return

    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setReservations(prev => prev.filter(rev => rev.id !== id))
        setSelectedReservation(null)
      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(rev => rev.status === filterStatus)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-amber-100 text-amber-800 border-amber-200'
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="container mx-auto px-0 py-8">
        {/* Statistics & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium font-inter">Total</p>
              <h3 className="text-2xl font-bold font-playfair">{reservations.length}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium font-inter">Pending</p>
              <h3 className="text-2xl font-bold font-playfair">
                {reservations.filter(r => r.status === 'pending').length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium font-inter">Confirmed</p>
              <h3 className="text-2xl font-bold font-playfair">
                {reservations.filter(r => r.status === 'confirmed').length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 font-inter">Filter Status</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reservation List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold font-playfair text-amber-900">
                  <i className="fas fa-list-ul mr-2 text-amber-600"></i> Recent Bookings
                </h2>
                <button 
                  onClick={fetchReservations}
                  className="p-2 hover:bg-white rounded-full transition-colors text-amber-600"
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-20">
                  <i className="fas fa-circle-notch fa-spin text-4xl text-amber-600"></i>
                  <p className="mt-4 text-gray-500 font-medium">Loading reservations...</p>
                </div>
              ) : filteredReservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date & Time</th>
                        <th className="px-6 py-4">Guests</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredReservations.map((rev) => (
                        <tr key={rev.id} onClick={() => setSelectedReservation(rev)} className={`hover:bg-amber-50/30 cursor-pointer transition-colors ${selectedReservation?.id === rev.id ? 'bg-amber-50' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 font-playfair">{rev.fullName}</div>
                            <div className="text-xs text-gray-500">{rev.whatsappNumber}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-700 font-medium font-inter">{formatDate(rev.reservationDate)}</div>
                            <div className="text-xs text-amber-700 font-bold">{rev.arrivalTime}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold">
                              <i className="fas fa-users text-gray-400"></i> {rev.numberOfGuests}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(rev.status)}`}>
                              {rev.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <i className="fas fa-chevron-right text-gray-300"></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    <i className="fas fa-calendar-times"></i>
                  </div>
                  <p className="font-medium">No reservations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Reservation Detail Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-4 overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-amber-900 to-stone-900 text-white">
                <h2 className="text-xl font-bold font-playfair">Reservation Detail</h2>
                <p className="text-amber-200/60 text-xs mt-1">Review and manage booking</p>
              </div>

              {selectedReservation ? (
                <div className="p-6 space-y-6">
                  {/* Status & Quick Actions */}
                  <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border ${getStatusBadgeClass(selectedReservation.status)}`}>
                      {selectedReservation.status}
                    </span>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => deleteReservation(selectedReservation.id)}
                        className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Customer Name</label>
                      <p className="font-bold text-gray-900 font-playfair">{selectedReservation.fullName}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Guests</label>
                      <p className="font-bold text-gray-900 font-playfair">{selectedReservation.numberOfGuests} Persons</p>
                    </div>
                  </div>

                  <div>
                     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">WhatsApp Number</label>
                     <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900">{selectedReservation.whatsappNumber}</p>
                        <a 
                          href={`https://wa.me/${selectedReservation.whatsappNumber.replace(/\D/g, '').startsWith('0') ? '62' + selectedReservation.whatsappNumber.replace(/\D/g, '').substring(1) : selectedReservation.whatsappNumber.replace(/\D/g, '')}`} 
                          target="_blank"
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fab fa-whatsapp"></i> Chat
                        </a>
                     </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Date</label>
                        <p className="text-sm font-bold text-stone-800">{formatDate(selectedReservation.reservationDate)}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Arrival Time</label>
                        <p className="text-sm font-bold text-amber-700">{selectedReservation.arrivalTime}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Selected Area</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                        <i className={`fas ${selectedReservation.areaChoice === 'Outdoor' ? 'fa-sun' : selectedReservation.areaChoice === 'VIP Room' ? 'fa-crown' : 'fa-couch'}`}></i>
                      </div>
                      <p className="font-bold text-gray-800">{selectedReservation.areaChoice}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Special Notes</label>
                    <p className="text-sm text-gray-600 italic bg-stone-50 p-4 rounded-xl border border-stone-100 min-h-[80px]">
                      {selectedReservation.additionalNotes || 'No additional notes provided.'}
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-inter">Update Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => updateStatus(selectedReservation.id, 'confirmed')}
                        disabled={selectedReservation.status === 'confirmed'}
                        className={`py-3 rounded-xl text-xs font-bold transition-all ${
                          selectedReservation.status === 'confirmed' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                         Confirm Booking
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedReservation.id, 'cancelled')}
                        disabled={selectedReservation.status === 'cancelled'}
                        className={`py-3 rounded-xl text-xs font-bold transition-all ${
                          selectedReservation.status === 'cancelled' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <i className="fas fa-hand-pointer text-4xl mb-4 opacity-20"></i>
                  <p className="text-sm font-medium">Select a reservation to view full detail</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
