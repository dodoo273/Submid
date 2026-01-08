"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { MainCategory, SubCategory, MenuItem } from "@prisma/client";

type CategoryWithSubs = MainCategory & {
  subCategories: SubCategory[];
};

type MenuItemWithCategory = Omit<
  MenuItem,
  "price" | "createdAt" | "updatedAt" | "deletedAt"
> & {
  price: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  subCategory: SubCategory & {
    mainCategory: MainCategory;
  };
};

interface AdminClientProps {
  categories: CategoryWithSubs[];
  menuItems: MenuItemWithCategory[];
}

export default function AdminClient({
  categories,
  menuItems,
}: AdminClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flash, setFlash] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItemWithCategory | null>(
    null
  );

  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "", // price stored as string here to match serialized server data
    subCategoryId: "",
    imageUrl: "",
    isFeatured: false,
    isAvailable: true,
  });

// ... (rest of the component state and handlers)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "menu");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
        const json = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: json.url }));
      } else {
        alert("Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      subCategoryId: "",
      imageUrl: "",
      isFeatured: false,
      isAvailable: true,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItemWithCategory) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      subCategoryId: item.subCategoryId.toString(),
      imageUrl: item.imageUrl || "",
      isFeatured: item.isFeatured,
      isAvailable: item.isAvailable,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFlash(null);

    try {
      const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu";
      const method = editingItem ? "PUT" : "POST";

      // Ensure numeric values before sending
      const payload = {
        ...formData,
        price: formData.price !== "" ? parseFloat(formData.price) : null,
        subCategoryId:
          formData.subCategoryId !== ""
            ? parseInt(formData.subCategoryId)
            : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFlash({
          message: editingItem
            ? "Menu berhasil diperbarui!"
            : "Menu berhasil ditambahkan!",
          type: "success",
        });
        resetForm();
        router.refresh();
      } else {
        const data = await res.json();
        setFlash({
          message: data.error || "Gagal menyimpan menu",
          type: "error",
        });
      }
    } catch {
      setFlash({ message: "Network error", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus menu ini?")) return;

    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFlash({ message: "Menu berhasil dihapus!", type: "success" });
        router.refresh();
      } else {
        setFlash({ message: "Gagal menghapus menu", type: "error" });
      }
    } catch {
      setFlash({ message: "Network error", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 lg:p-8">

      <div className="container mx-auto px-0 py-8">
        {/* Flash Message */}
        {flash && (
          <div
            className={`${
              flash.type === "success"
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            } border px-4 py-3 rounded-lg mb-6`}
          >
            {flash.message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Add/Edit Menu Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 sticky top-4 border border-gray-100">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 font-playfair text-gray-800 flex items-center gap-3">
                <i className="fas fa-plus-circle text-amber-600"></i>
                {editingItem ? "Edit Menu" : "Tambah Menu"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Menu
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price} // string value representing price
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Kategori
                  </label>
                  <select
                    required
                    value={formData.subCategoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategoryId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((mainCat) => (
                      <optgroup key={mainCat.id} label={mainCat.name}>
                        {mainCat.subCategories.map((subCat) => (
                          <option key={subCat.id} value={subCat.id}>
                            {subCat.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Gambar
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Atau masukkan URL..."
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-600 bg-gray-50"
                    />
                    {isUploading && (
                      <p className="text-sm text-amber-600">Mengupload...</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="isFeatured" className="text-gray-700">
                    Tampilkan di Featured
                  </label>
                </div>

                {editingItem && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="isAvailable" className="text-gray-700">
                      Tersedia
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl font-bold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <i className="fas fa-save mr-2"></i>
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingItem
                    ? "Perbarui Menu"
                    : "Simpan Menu"}
                </button>

                {editingItem && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="block w-full text-center text-gray-600 hover:text-gray-800 text-sm"
                  >
                    <i className="fas fa-times mr-1"></i> Batal
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Menu List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 font-playfair text-gray-800 flex items-center gap-3">
                <i className="fas fa-list text-amber-600"></i> Daftar Menu
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200 first:rounded-tl-xl last:rounded-tr-xl">Gambar</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Nama</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Kategori</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Harga</th>
                      <th className="text-center py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menuItems.length > 0 ? (
                      menuItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-amber-50/30 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                              <SmartImage
                                src={getImageUrl(item.imageUrl, "menu")}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-800">{item.name}</div>
                            {item.isFeatured && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                <i className="fas fa-star text-[8px]"></i> Featured
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                              {item.subCategory.name}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-amber-700">Rp {formatPrice(item.price)}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="w-9 h-9 flex items-center justify-center bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                title="Edit"
                              >
                                <i className="fas fa-edit text-sm"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Hapus"
                              >
                                <i className="fas fa-trash text-sm"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-gray-400 italic"
                        >
                          <i className="fas fa-mug-hot text-4xl mb-3 block opacity-20"></i>
                          No menu items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
