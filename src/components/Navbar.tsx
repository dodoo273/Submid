'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isHeroPage = pathname === '/' || pathname === '/promo'

  useEffect(() => {
    if (isAdminPage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAdminPage])

  if (isAdminPage) return null

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : ''
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      {/* Mobile Hamburger Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b bg-white border-gray-100 shadow-sm transition-all duration-300">
        <div className="flex justify-end items-center px-5 py-3">
          <button
            onClick={toggleMobileMenu}
            className="text-2xl text-gray-900 p-2.5 hover:bg-gray-100 rounded-lg transition-all active:scale-95"
            aria-label="Open menu"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>


      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHeroPage
            ? 'bg-black/70 shadow-2xl backdrop-blur-2xl border-b border-white/10 py-3'
            : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-90 transition-all duration-300 group">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className={`h-14 w-auto drop-shadow-2xl transition-all duration-500 group-hover:scale-105 ${isScrolled ? 'scale-100' : 'scale-110'}`}
                style={{ transformOrigin: 'left center' }}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="flex items-center gap-8 xl:gap-12">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Menu', href: '/menu' },
                { name: 'Promos', href: '/promo' },
                { name: 'Reservasi', href: '/reservasi' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`text-sm tracking-[0.15em] uppercase transition-all duration-300 font-semibold hover:text-amber-400 relative group ${
                    pathname === item.href ? 'text-amber-500' : 'text-white'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${
                    pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Admin Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-amber-600/30 active:scale-95 border border-white/20"
              >
                <i className="fas fa-user-shield mr-2"></i>
                <span>Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gradient-to-br from-[#1a1410] to-[#0f0b09] shadow-2xl transform transition-transform duration-500 ease-in-out z-[70] overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Menu Header */}
        <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 px-6 py-8 border-b border-white/10 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="h-11 w-auto drop-shadow-lg" />
            <span className="text-white font-bold text-xl tracking-tight">SUBMID</span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="text-white/70 text-2xl p-2 hover:bg-white/10 rounded-full transition-all active:scale-95"
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-3">
          {[
            { name: 'Home', href: '/', icon: 'fa-home' },
            { name: 'About', href: '/about', icon: 'fa-info-circle' },
            { name: 'Menu', href: '/menu', icon: 'fa-mug-hot' },
            { name: 'Promos', href: '/promo', icon: 'fa-tags' },
            { name: 'Reservasi', href: '/reservasi', icon: 'fa-calendar-check' },
            { name: 'Contact', href: '/contact', icon: 'fa-envelope' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${
                pathname === item.href 
                  ? 'bg-gradient-to-r from-amber-600/30 to-amber-700/20 text-amber-400 border border-amber-600/40 shadow-lg shadow-amber-900/20' 
                  : 'text-white/80 hover:bg-white/5 hover:text-white active:scale-95'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-base`}></i>
              <span className="tracking-wide text-base">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Admin Section */}
        <div className="mt-8 px-6 pb-6">
          <Link
            href="/admin"
            onClick={closeMobileMenu}
            className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-bold tracking-widest uppercase text-sm hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-900/30 active:scale-95"
          >
            <i className="fas fa-sign-in-alt"></i>
            <span>Admin Access</span>
          </Link>
        </div>
      </div>

      {/* Spacer for non-hero pages */}
      {!isHeroPage && <div className="h-[72px] lg:h-[88px]"></div>}
    </>
  )
}
