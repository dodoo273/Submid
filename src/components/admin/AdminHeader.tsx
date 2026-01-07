'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function AdminHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-b border-gray-700 lg:ml-72">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold font-playfair mb-1">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
        </div>
    </header>
  )
}
