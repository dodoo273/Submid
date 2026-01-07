'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MainCategory {
  id: number
  name: string
  description: string | null
  displayOrder: number
  subCategories: SubCategory[]
}

interface SubCategory {
  id: number
  name: string
  description: string | null
  mainCategoryId: number
  displayOrder: number
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<MainCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [flash, setFlash] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [formType, setFormType] = useState<'main' | 'sub'>('main')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mainCategoryId: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', mainCategoryId: '' })
    setEditingId(null)
  }

  const handleEdit = (cat: MainCategory | SubCategory, type: 'main' | 'sub') => {
    setFormType(type)
    setEditingId(cat.id)
    setFormData({
      name: cat.name,
      description: cat.description || '',
      mainCategoryId: type === 'sub' ? (cat as SubCategory).mainCategoryId.toString() : ''
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingId 
        ? `/api/categories/${editingId}` 
        : '/api/categories'
      
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          name: formData.name,
          description: formData.description,
          mainCategoryId: formData.mainCategoryId
        })
      })

      if (res.ok) {
        setFlash({ 
          message: editingId ? 'Kategori berhasil diperbarui!' : 'Kategori berhasil ditambahkan!', 
          type: 'success' 
        })
        resetForm()
        fetchCategories()
        router.refresh()
      } else {
        const data = await res.json()
        setFlash({ message: data.error || 'Gagal menyimpan kategori', type: 'error' })
      }
    } catch {
      setFlash({ message: 'Network error', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number, type: 'main' | 'sub', name: string) => {
    if (!confirm(`Yakin ingin menghapus kategori "${name}"?`)) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      const data = await res.json()

      if (res.ok) {
        setFlash({ message: 'Kategori berhasil dihapus!', type: 'success' })
        fetchCategories()
        router.refresh()
      } else {
        setFlash({ message: data.error || 'Gagal menghapus kategori', type: 'error' })
      }
    } catch {
      setFlash({ message: 'Network error', type: 'error' })
    }
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
            } border px-4 py-3 rounded-lg mb-6 flex items-center justify-between`}
          >
            <span>{flash.message}</span>
            <button onClick={() => setFlash(null)} className="text-xl font-bold ml-4">×</button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Add/Edit Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 sticky top-4 border border-gray-100">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 font-playfair text-gray-800 flex items-center gap-3">
                <i className={`fas ${editingId ? 'fa-edit' : 'fa-plus-circle'} text-amber-600`}></i>
                {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
              </h2>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">Tipe Kategori</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formType === 'main'}
                      onChange={() => setFormType('main')}
                      className="mr-2 w-4 h-4 text-amber-600"
                      disabled={!!editingId}
                    />
                    <span className="text-sm">Main Category</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={formType === 'sub'}
                      onChange={() => setFormType('sub')}
                      className="mr-2 w-4 h-4 text-amber-600"
                      disabled={!!editingId}
                    />
                    <span className="text-sm">Sub Category</span>
                  </label>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {formType === 'sub' && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Main Category</label>
                    <select
                      required
                      value={formData.mainCategoryId}
                      onChange={(e) => setFormData({ ...formData, mainCategoryId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="">Pilih Main Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nama</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nama kategori"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Deskripsi (Opsional)</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    placeholder="Masukkan deskripsi kategori"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl font-bold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
                    {isSubmitting ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Simpan'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 font-playfair text-gray-800 flex items-center gap-3">
                <i className="fas fa-folder-open text-amber-600"></i> Daftar Kategori
              </h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <i className="fas fa-spinner fa-spin text-4xl text-amber-600 mb-4"></i>
                  <p className="text-gray-500">Loading categories...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {categories.map((mainCat) => (
                    <div key={mainCat.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-amber-200 transition-all">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 font-semibold flex justify-between items-center">
                        <span className="flex items-center gap-3">
                          <i className="fas fa-folder text-amber-600 text-lg"></i>
                          <span className="text-lg">{mainCat.name}</span>
                          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                            {mainCat.subCategories.length} sub{mainCat.subCategories.length !== 1 ? 's' : ''}
                          </span>
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(mainCat, 'main')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold"
                            title="Edit main category"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(mainCat.id, 'main', mainCat.name)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                            title="Delete main category"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      {mainCat.subCategories.length > 0 && (
                        <ul className="divide-y divide-gray-100">
                          {mainCat.subCategories.map((subCat) => (
                            <li key={subCat.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                              <span className="flex items-center gap-3">
                                <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                                <span>{subCat.name}</span>
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(subCat, 'sub')}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-xs font-semibold"
                                  title="Edit sub category"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(subCat.id, 'sub', subCat.name)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-xs font-semibold"
                                  title="Delete sub category"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <div className="text-center py-12">
                      <i className="fas fa-folder-open text-5xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg">Belum ada kategori. Silakan tambahkan kategori baru.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
