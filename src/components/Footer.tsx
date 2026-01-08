"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-10 md:py-16 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-12 mb-8 md:mb-12 text-center md:text-left">
          {/* Coffee Shop Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-5 font-playfair text-center md:text-left">
              SUBMID
            </h3>
            <div className="space-y-3 text-gray-400 text-center md:text-left">
              <p className="flex items-start gap-2 text-sm leading-relaxed justify-center md:justify-start">
                <i className="fas fa-map-marker-alt mt-1 text-amber-500"></i>
                <span>
                  123 E, Brooklyn Avenue
                  <br />
                  Jakarta, Indonesia
                </span>
              </p>
              <p className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors justify-center md:justify-start">
                <i className="fas fa-phone text-amber-500"></i>
                <a href="tel:+62123456789">+62 123 456 789</a>
              </p>
              <p className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors justify-center md:justify-start">
                <i className="fas fa-envelope text-amber-500"></i>
                <a href="mailto:submid@coffereo.com">submid@coffereo.com</a>
              </p>
            </div>
          </div>

          {/* Our Coffee */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5 font-playfair text-center md:text-left">
              Our Coffee
            </h3>
            <div className="flex flex-col space-y-3">
              <Link
                href="/menu"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Premium Beans
              </Link>
              <Link
                href="/menu"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Specialty Drinks
              </Link>
              <Link
                href="/menu"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Cold Brews
              </Link>
              <Link
                href="/menu"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Hot Beverages
              </Link>   
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5 font-playfair text-center md:text-left">
              Quick Links
            </h3> 
            <div className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Contact Us
              </Link>
              <Link
                href="/menu"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Our Menu
              </Link>
              <Link
                href="/promo"
                className="text-sm text-gray-400 hover:text-amber-400 hover:translate-x-1 transition-all flex items-center gap-2"
              >
                <i className="fas fa-chevron-right text-xs text-amber-500"></i>{" "}
                Promotions
              </Link>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-5 font-playfair text-center md:text-left">
              Follow Us
            </h3>
            <p className="text-sm mb-5 text-gray-400 leading-relaxed">
              Brewing excellence since 2020. Join our community for the latest
              updates and exclusive offers.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="#"
                className="w-11 h-11 bg-gray-800 hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-900/30"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-11 h-11 bg-gray-800 hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-900/30"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-11 h-11 bg-gray-800 hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-900/30"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 sm:gap-4">
          <p className="text-sm text-gray-500 text-center">
            &copy; 2025 Submid Coffee. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500 items-center">
            <a href="#" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
