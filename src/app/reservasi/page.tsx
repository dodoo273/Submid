'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/lib/utils'

export default function ReservationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    reservationDate: '',
    arrivalTime: '',
    numberOfGuests: 1,
    areaChoice: 'Indoor',
    additionalNotes: '',
    agreement: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: target.checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreement) {
      alert('Anda harus setuju dengan syarat dan ketentuan kami.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSuccess(true)
        
        // Prepare WhatsApp Message
        const message = `Halo SUBMID Coffee,
Saya ingin melakukan reservasi:

Nama: ${formData.fullName}
Tanggal: ${formData.reservationDate}
Jam: ${formData.arrivalTime}
Jumlah Tamu: ${formData.numberOfGuests}
Area: ${formData.areaChoice}
Catatan: ${formData.additionalNotes || '-'}

Terima kasih!`
        
        const encodedMessage = encodeURIComponent(message)
        const waLink = `https://wa.me/62${siteConfig.whatsapp.replace(/\D/g, '').startsWith('0') ? siteConfig.whatsapp.replace(/\D/g, '').substring(1) : siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodedMessage}`
        
        // Timeout to allow user to see success message before redirecting to WhatsApp
        setTimeout(() => {
          window.open(waLink, '_blank')
        }, 1500)
      } else {
        const error = await response.json()
        alert(error.error || 'Terjadi kesalahan saat membuat reservasi.')
      }
    } catch (error) {
      console.error('Reservation error:', error)
      alert('Terjadi kesalahan koneksi. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-amber-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-3xl font-bold font-playfair text-stone-900 mb-4">Reservasi Berhasil!</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Data reservasi Anda telah kami terima. Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => {
                const message = `Halo SUBMID Coffee, saya ingin konfirmasi reservasi atas nama ${formData.fullName}.`
                const waNumber = siteConfig.whatsapp.replace(/\D/g, '').startsWith('0') ? '62' + siteConfig.whatsapp.replace(/\D/g, '').substring(1) : siteConfig.whatsapp.replace(/\D/g, '')
                window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank')
              }}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fab fa-whatsapp text-xl"></i> Hubungi WhatsApp Sekarang
            </button>
            <Link 
              href="/"
              className="block w-full text-stone-500 hover:text-stone-800 font-semibold transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold font-playfair text-stone-900 mb-4">Reservasi Meja</h1>
          <p className="text-stone-600 max-w-2xl mx-auto italic">
            Nikmati momen berharga Anda di tempat yang tepat. Pesan meja Anda sekarang untuk memastikan kenyamanan Anda.
          </p>
          <div className="w-24 h-1 bg-amber-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-amber-100 grid md:grid-cols-5">
          {/* Info Sidebar */}
          <div className="md:col-span-2 bg-stone-900 text-white p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold font-playfair mb-8">Informasi Reservasi</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-100">Jam Operasional</h3>
                    <p className="text-stone-400 text-sm">Setiap Hari: 08:00 - 22:00</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-100">Lokasi Kami</h3>
                    <p className="text-stone-400 text-sm">Jl. Kopi Nikmat No. 123, Bandung</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-100">WhatsApp</h3>
                    <p className="text-stone-400 text-sm">{siteConfig.whatsapp}</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 italic text-stone-400 text-sm">
              "Kopi yang baik adalah awal dari percakapan yang baik."
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">No. WhatsApp</label>
                  <input
                    required
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Tanggal Reservasi</label>
                  <input
                    required
                    type="date"
                    name="reservationDate"
                    value={formData.reservationDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Jam Kedatangan</label>
                  <input
                    required
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Jumlah Tamu</label>
                  <input
                    required
                    type="number"
                    name="numberOfGuests"
                    min="1"
                    max="20"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Pilihan Area</label>
                  <select
                    name="areaChoice"
                    value={formData.areaChoice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50 appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
                  >
                    <option value="Indoor">Indoor (AC)</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="VIP Root">VIP Room</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Contoh: Kursi bayi, dekorasi ulang tahun, dll."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all bg-stone-50"
                ></textarea>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreement"
                  id="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="agreement" className="text-sm text-stone-600 leading-tight">
                  Saya setuju bahwa data yang saya masukkan adalah benar dan bersedia datang tepat waktu sesuai jadwal yang telah ditentukan.
                </label>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className={`w-full bg-amber-800 text-white py-4 rounded-xl font-bold hover:bg-stone-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Memproses...</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Kirim Reservasi</>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-stone-500 hover:text-amber-800 transition-colors font-semibold flex items-center justify-center gap-2">
            <i className="fas fa-arrow-left text-sm"></i> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
