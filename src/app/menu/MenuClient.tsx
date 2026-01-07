"use client";

import { useState } from "react";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { MainCategory, SubCategory, MenuItem } from "@prisma/client";

// Simplified types for serialized data
interface CategoryWithSubs {
  id: number;
  name: string;
  subCategories: any[]; // Serialized subcategories
  [key: string]: any;
}

interface MenuItemWithCategory {
  id: number;
  name: string;
  description: string | null;
  price: string | number; // Can be string after serialization
  imageUrl: string | null;
  subCategoryId: number;
  subCategory?: any;
  [key: string]: any;
}

interface MenuClientProps {
  categories: CategoryWithSubs[] | any[];
  menuItems: MenuItemWithCategory[] | any[];
  currentSubCategoryId: number;
  currentSubCategoryName: string;
}

export default function MenuClient({
  categories,
  menuItems,
  currentSubCategoryId,
  currentSubCategoryName,
}: MenuClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MenuItemWithCategory[]>(
    []
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white p-6 shadow-lg z-50 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none lg:w-72 lg:flex-shrink-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center mb-8 lg:mb-12">
          <div className="p-3 bg-orange-500 rounded-xl mr-4">
            <i className="fas fa-mug-hot text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Menu Kami</h1>
            <p className="text-sm text-gray-500">Pilih kategori favorit</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Categories */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {categories.map((mainCat) => (
            <div key={mainCat.id} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <i className="fas fa-utensils text-orange-400 mr-2"></i>
                {mainCat.name}
              </h2>
              <ul className="space-y-2">
                {mainCat.subCategories.map((subCat: any) => (
                  <li key={subCat.id}>
                    <Link
                      href={`/menu?sub_id=${subCat.id}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center py-2 px-3 rounded-lg text-gray-700 hover:bg-orange-500 hover:text-white transition-all
                        ${
                          currentSubCategoryId === subCat.id
                            ? "bg-orange-500 text-white shadow-md"
                            : ""
                        }
                      `}
                    >
                      <i className="fas fa-circle text-[8px] mr-3"></i>
                      <span className="font-medium">{subCat.name}</span>
                      {currentSubCategoryId === subCat.id && (
                        <i className="fas fa-chevron-right ml-auto"></i>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2024 Coffee Menu
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>

        {/* Main Content Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-flex items-center mb-2">
              <i className="fas fa-tag mr-2 text-orange-400"></i>
              Menu Pilihan
            </span>
            <h1 className="text-4xl font-bold font-playfair text-gray-800 mb-2">
              {currentSubCategoryName}
            </h1>
            <p className="text-gray-600">
              Temukan favorit Anda dari pilihan kami
            </p>
          </div>
          {/* Search Bar */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Cari Menu..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pb-12">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-56 w-full">
                  <SmartImage
                    src={getImageUrl(item.imageUrl, "menu")}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    {/* Placeholder for actual rating */}
                    <span>4.9</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold font-playfair text-gray-800 mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-3">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-500">
                      Rp {formatPrice(item.price)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Tersedia
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <i className="fas fa-coffee text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">
                Tidak ada menu tersedia di kategori ini.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
