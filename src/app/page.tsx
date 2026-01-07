import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { serializePrisma, getImageUrl, formatDate } from "@/lib/utils";
import prisma from "@/lib/prisma";
import PromoClient from "@/app/promo/PromoClient";

async function getActivePromos() {
  const now = new Date();
  return await prisma.promo.findMany({
    where: {
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: { startAt: "desc" },
  });
}

export default async function HomePage() {
  const promosRaw = await getActivePromos();
  const promos = promosRaw.map((p) => serializePrisma(p));

  const featured = [
    {
      title: "Espresso Masterpieces",
      desc: "Rich and aromatic espresso crafted with precision",
      image:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600",
    },
    {
      title: "Iced Favorites",
      desc: "Refreshing cold brews perfect for any season",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
    },
    {
      title: "Organic Beans",
      desc: "Sustainably sourced premium coffee beans",
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="font-playfair animate-slide-up">Brewed to Perfection,</h1>
          <p className="animate-slide-up" style={{ animationDelay: '0.1s' }}>Experienced barista delicacy</p>
        </div>
      </section>

      {/* Main Menu 1 (Layout Kanan – Gambar) */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Kolom Kiri: Teks */}
            <div className="w-full lg:w-1/2 space-y-8 animate-slide-up">
              <div className="space-y-4">
                <p className="text-amber-600 font-semibold tracking-widest uppercase text-sm">Welcome to Antigravity Coffee</p>
                <h1 className="text-5xl lg:text-7xl font-bold font-playfair text-gray-900 leading-tight">
                  Experience Coffee <span className="text-amber-600">Reimagined</span>
                </h1>
                <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-xl">
                  Discover the art of professional brewing. We craft every cup with precision and passion, 
                  bringing you the finest specialty beans from around the world.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/menu" 
                  className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition-all duration-300 shadow-xl hover:shadow-amber-600/20 transform hover:-translate-y-1"
                >
                  Explore Our Menu
                </Link>
                <Link 
                  href="/about" 
                  className="border-2 border-gray-200 text-gray-800 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Kolom Kanan: Gambar */}
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-amber-100 rounded-[2rem] transform rotate-3 -z-10"></div>
                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border-8 border-white">
                  <SmartImage
                    src="/images/hero-menu-1.png"
                    alt="Barista at work"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Micro-interaction element */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl animate-bounce-slow hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <i className="fas fa-star text-amber-600"></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">4.9 / 5.0</p>
                      <p className="text-xs text-gray-500">Customer Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Menu 2 (Layout Kiri – Gambar) */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            {/* Kolom Kanan: Teks */}
            <div className="w-full lg:w-1/2 space-y-8 animate-slide-up">
              <div className="space-y-4">
                <p className="text-amber-600 font-semibold tracking-widest uppercase text-sm">Why Choose Us</p>
                <h2 className="text-4xl lg:text-6xl font-bold font-playfair text-gray-900 leading-tight">
                  Premium Quality in <span className="text-amber-600">Every Drop</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We believe that great coffee starts with the details. From sustainably sourced organic beans 
                  to our state-of-the-art roasting process, we ensure a rich and aromatic experience 
                  that satisfies even the most discerning coffee lovers.
                </p>
              </div>
              
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center gap-3 font-medium">
                  <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                    <i className="fas fa-check text-xs"></i>
                  </div>
                  100% Organic Arabica Beans
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                    <i className="fas fa-check text-xs"></i>
                  </div>
                  Expertly Roasted Daily
                </li>
                <li className="flex items-center gap-3 font-medium">
                  <div className="bg-amber-100 p-1 rounded-full text-amber-600">
                    <i className="fas fa-check text-xs"></i>
                  </div>
                  Eco-friendly Packaging
                </li>
              </ul>

              <div className="pt-4">
                <Link 
                  href="/menu" 
                  className="inline-flex items-center gap-2 text-amber-600 font-bold text-lg hover:underline decoration-2 underline-offset-8"
                >
                  <span>View Our Features</span>
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>

            {/* Kolom Kiri: Gambar */}
            <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gray-200 rounded-[2rem] transform -rotate-3 -z-10"></div>
                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border-8 border-white">
                  <SmartImage
                    src="/images/hero-menu-2.png"
                    alt="Premium coffee cup"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -top-6 -right-6 bg-amber-600 text-white p-8 rounded-full shadow-2xl animate-spin-slow hidden md:flex items-center justify-center border-4 border-white">
                   <div className="text-center">
                    <p className="text-xl font-bold leading-none">100%</p>
                    <p className="text-[10px] uppercase tracking-tighter">Organic</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      {promos.length > 0 && (
        <section className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="text-left">
                <p className="text-amber-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Special Offers</p>
                <h2 className="text-5xl lg:text-7xl font-bold font-playfair text-gray-900 mb-6 leading-tight">
                  Taste the <span className="text-amber-600 italic">Exclusive</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
                  Discover our curated selection of seasonal promotions and limited-time 
                  specialties crafted just for you.
                </p>
              </div>
              <Link
                href="/promo"
                className="group inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-all duration-500 shadow-2xl hover:shadow-amber-500/20"
              >
                <span>View All Offers</span>
                <i className="fas fa-arrow-right text-sm group-hover:translate-x-2 transition-transform"></i>
              </Link>
            </div>

            <PromoClient promos={promos} compact />
          </div>
        </section>
      )}

{/* Maps Section */}
<section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
  <div className="container mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-14">
      <p className="section-subtitle">OUR LOCATION</p>
      <h2 className="section-title font-playfair mb-4">
        Visit Submid Coffee
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto text-lg">
        Kunjungi Submid Coffee dan rasakan suasana hangat kami secara langsung
      </p>
    </div>

    {/* Map Card */}
    <div className="flex justify-center">
      <div className="relative w-full max-w-6xl">
        {/* Card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
          {/* Map */}
          <div className="relative h-[450px]">
            <iframe
              title="Submid Coffee Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.441270271787!2d111.90304877572406!3d-8.05639019197115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e3006e563f75%3A0x3a7bffca60d7cbf!2ssubmid%20coff!5e0!3m2!1sid!2sid!4v1767697598773!5m2!1sid!2sid"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Info Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Submid Coffee
                </h3>
                <p className="text-gray-600">
                  Tulungagung, Jawa Timur, Indonesia
                </p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps?q=-8.05639019197115,111.90304877572406"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl"
            >
              <i className="fas fa-directions"></i>
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="section-subtitle">VISIT US</p>
          <h2 className="section-title font-playfair mb-6">Experience Coffee Perfection</h2>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            Step into our cozy atmosphere and let our expert baristas craft the perfect cup 
            for you. We're waiting to serve you the finest beverages made with love and dedication.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link 
              href="/menu" 
              className="btn-primary inline-flex items-center gap-2"
            >
              <i className="fas fa-mug-hot"></i>
              <span>Explore Menu</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-gray-800 text-gray-800 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              <i className="fas fa-envelope"></i>
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
