'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AdminHeader from "@/components/admin/AdminHeader"
import { formatDate, getImageUrl } from '@/lib/utils'

interface Promo {
  id: number
  title: string
  description: string | null
  imageUrl: string | null
  startAt: string
  endAt: string
  createdAt: string
}

export default function PromosPage() {
  const router = useRouter()
  const [promos, setPromos] = useState<Promo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [flash, setFlash] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startAt: '',
    endAt: ''
  })

  useEffect(() => {
    fetchPromos()
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const data = new FormData()
    data.append('file', file)
    data.append('folder', 'promos')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })
      if (res.ok) {
        const json = await res.json()
        setFormData(prev => ({ ...prev, imageUrl: json.filename }))
      } else {
        alert('Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/promos?all=true')
      const data = await res.json()
      setPromos(data)
    } catch (error) {
      console.error('Error fetching promos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (promo: Promo) => {
    setEditingId(promo.id)
    setFormData({
      title: promo.title,
      description: promo.description || '',
      imageUrl: promo.imageUrl || '',
      startAt: promo.startAt.substring(0, 16), // Format for datetime-local
      endAt: promo.endAt.substring(0, 16)
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus promo ini?')) return

    try {
      const res = await fetch(`/api/promos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFlash({ message: 'Promo berhasil dihapus!', type: 'success' })
        fetchPromos()
        router.refresh()
      } else {
        setFlash({ message: 'Gagal menghapus promo', type: 'error' })
      }
    } catch {
      setFlash({ message: 'Network error', type: 'error' })
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ title: '', description: '', imageUrl: '', startAt: '', endAt: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingId ? `/api/promos/${editingId}` : '/api/promos'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFlash({ 
          message: editingId ? 'Promo berhasil diupdate!' : 'Promo berhasil ditambahkan!', 
          type: 'success' 
        })
        setFormData({ title: '', description: '', imageUrl: '', startAt: '', endAt: '' })
        setEditingId(null)
        fetchPromos()
        router.refresh()
      } else {
        setFlash({ message: `Gagal ${editingId ? 'update' : 'menambah'} promo`, type: 'error' })
      }
    } catch {
      setFlash({ message: 'Network error', type: 'error' })
    }
  }

  const isActive = (promo: Promo) => {
    const now = new Date()
    return new Date(promo.startAt) <= now && new Date(promo.endAt) >= now
  }

  return (
    <div className="p-4 lg:p-8">

      <div className="container mx-auto px-0 py-8">
        {/* Flash Message */}
        {flash && (
          <div
            className={`${
              flash.type === 'success'
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
            } border px-4 py-3 rounded-lg mb-6`}
          >
            <div className="flex justify-between items-center">
              <span>{flash.message}</span>
              <button onClick={() => setFlash(null)} className="text-lg">&times;</button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add/Edit Promo Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 font-playfair text-amber-800">
                <i className={`fas ${editingId ? 'fa-edit' : 'fa-plus-circle'} mr-2`}></i> 
                {editingId ? 'Edit Promo' : 'Tambah Promo'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Judul</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Gambar</label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Atau masukkan filename/URL..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm text-gray-600 bg-gray-50"
                    />
                    {isUploading && <p className="text-sm text-amber-600">Mengupload...</p>}
                    {formData.imageUrl && (
                      <div className="relative h-32 w-full mt-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                          src={getImageUrl(formData.imageUrl, 'promo')}
                          alt="Preview"
                          fill
                          quality={90}
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Tanggal Mulai</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startAt}
                    onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Tanggal Berakhir</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endAt}
                    onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition shadow-md"
                  >
                    <i className="fas fa-save mr-2"></i> {editingId ? 'Update Promo' : 'Simpan Promo'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Promos List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 font-playfair text-amber-800">
                <i className="fas fa-tags mr-2"></i> Daftar Promo
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-spinner fa-spin text-2xl text-amber-600"></i>
                </div>
              ) : promos.length > 0 ? (
                <div className="grid gap-4">
                  {promos.map((promo) => (
                    <div
                      key={promo.id}
                      className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-lg transition ${
                        editingId === promo.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(promo.imageUrl, 'promo')}
                          alt={promo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-800 text-lg leading-tight">{promo.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                              isActive(promo)
                                ? 'bg-green-100 text-green-700 font-medium'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {isActive(promo) ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {promo.description}
                        </p>
                        <div className="text-xs text-gray-500 mt-3 flex items-center gap-2">
                          <i className="far fa-calendar text-amber-600"></i>
                          <span>{formatDate(promo.startAt)} - {formatDate(promo.endAt)}</span>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(promo)}
                            className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1"
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(promo.id)}
                            className="text-red-500 hover:text-red-600 text-sm font-semibold flex items-center gap-1"
                          >
                            <i className="fas fa-trash-alt"></i> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No promos found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
