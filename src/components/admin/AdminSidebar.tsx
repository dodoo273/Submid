'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { name: 'Menu Items', href: '/admin', icon: 'fa-list' },
    { name: 'Categories', href: '/admin/categories', icon: 'fa-folder' },
    { name: 'Promos', href: '/admin/promos', icon: 'fa-tags' },
    { name: 'Messages', href: '/admin/messages', icon: 'fa-envelope' },
    { name: 'Reservations', href: '/admin/reservations', icon: 'fa-calendar-check' },
  ]

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-gray-800 text-white rounded-lg shadow-lg transition-all hover:bg-gray-700"
        aria-label="Open admin menu"
      >
        <i className="fas fa-bars text-xl"></i>
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white p-6 shadow-2xl z-50 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center mb-10">
          <i className="fas fa-coffee text-3xl text-amber-500 mr-3"></i>
          <h1 className="text-2xl font-bold font-playfair">Admin Panel</h1>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden ml-auto text-gray-400 hover:text-white focus:outline-none"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold
                  ${isActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700 flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
          >
            <i className="fas fa-home"></i>
            <span>Back to Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

