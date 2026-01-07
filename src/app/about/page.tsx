import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - SUBMID Coffee",
  description:
    "Learn about our story, values, and passion for brewing the perfect cup of coffee.",
};

export default function AboutPage() {
  const values = [
    {
      icon: "fa-leaf",
      title: "Quality First",
      description:
        "Kami hanya menggunakan biji kopi premium yang dipilih secara teliti dari perkebunan terbaik untuk memastikan setiap cangkir memiliki cita rasa yang sempurna.",
    },
    {
      icon: "fa-heart",
      title: "Passion & Care",
      description:
        "Setiap minuman dibuat dengan penuh perhatian dan dedikasi. Kami peduli dengan detail kecil yang membuat perbedaan besar dalam pengalaman Anda.",
    },
    {
      icon: "fa-users",
      title: "Community",
      description:
        "Coffee Reo adalah lebih dari kedai kopi. Kami menciptakan ruang hangat di mana komunitas dapat terhubung, berbagi, dan tumbuh bersama.",
    },
    {
      icon: "fa-recycle",
      title: "Sustainability",
      description:
        "Kami berkomitmen pada praktik berkelanjutan, dari sourcing biji kopi yang ethical hingga penggunaan kemasan ramah lingkungan.",
    },
    {
      icon: "fa-lightbulb",
      title: "Innovation",
      description:
        "Kami terus berinovasi dalam menciptakan menu baru dan metode seduh yang unik untuk memberikan pengalaman yang selalu fresh dan menarik.",
    },
    {
      icon: "fa-star",
      title: "Excellence",
      description:
        "Keunggulan adalah standar kami. Dari pelatihan barista hingga pelayanan pelanggan, kami selalu berusaha memberikan yang terbaik.",
    },
  ];

  const vibeImages = [
    "/images/vibes/vibe1.jpg",
    "/images/vibes/vibe2.jpg",
    "/images/vibes/vibe3.jpg",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-about">
        <div className="hero-content">
          <h1 className="text-5xl lg:text-6xl font-bold font-playfair mb-6">
            About Us
          </h1>
          <div className="flex items-center justify-center gap-3 text-white/90 text-lg">
            <Link
              href="/"
              className="hover:text-amber-300 transition-colors font-medium"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/menu"
              className="hover:text-amber-300 transition-colors font-medium"
            >
              Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative group">
              <SmartImage
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-amber-900/20 to-transparent"></div>
            </div>
            <div>
              <p className="section-subtitle">OUR STORY</p>
              <h2 className="text-4xl lg:text-5xl font-bold font-playfair text-left mb-6 text-gray-800">
                Brewing Excellence Since 2020
              </h2>
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  Coffee Reo dimulai dari passion sederhana: membawa pengalaman
                  kopi premium ke setiap pelanggan. Kami percaya bahwa setiap
                  cangkir kopi memiliki cerita, mulai dari petani yang
                  menanamnya hingga barista yang menyeduhnya dengan penuh
                  dedikasi.
                </p>
                <p>
                  Dengan menggunakan biji kopi pilihan dari berbagai belahan
                  dunia dan metode seduh yang tepat, kami menciptakan pengalaman
                  yang tak terlupakan dalam setiap tegukan. Komitmen kami adalah
                  menghadirkan kualitas terbaik sambil menciptakan suasana
                  hangat dan ramah.
                </p>
                <p>
                  Lebih dari sekadar kedai kopi, Coffee Reo adalah tempat
                  berkumpul, berbagi cerita, dan menciptakan kenangan indah
                  bersama orang-orang terkasih.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maps Section */}
<section className="py-24 lg:py-32 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <p className="section-subtitle"></p>
      <h2 className="section-title font-playfair mb-4">
        Our Location
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto text-lg">
        Kunjungi Submid Coffee dan rasakan suasana hangat kami secara langsung
      </p>
    </div>

    {/* Map Wrapper */}
    <div className="flex justify-center">
      <div className="w-full max-w-5xl h-[450px] rounded-3xl overflow-hidden shadow-2xl">
        <iframe
          title="Coffee Reo Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.441270271787!2d111.90304877572406!3d-8.05639019197115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e3006e563f75%3A0x3a7bffca60d7cbf!2ssubmid%20coff!5e0!3m2!1sid!2sid!4v1767697598773!5m2!1sid!2sid"
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </div>
</section>


      {/* Our Values Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="section-subtitle">OUR VALUES</p>
            <h2 className="section-title font-playfair mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our core values guide everything we do, from sourcing beans to
              serving our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <i className={`fas ${value.icon}`}></i>
                </div>
                <h3 className="value-title font-playfair">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Vibes Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title font-playfair mb-4">Our Vibes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experience the warm and welcoming atmosphere of our coffee shop
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {vibeImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
              >
                <SmartImage
                  src={`https://images.unsplash.com/photo-${
                    1495474472287 + index * 1000
                  }-4d71bcdd2085?w=400`}
                  alt={`Vibe ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Ready to Experience Our Coffee?
          </h2>
          <p className="mb-10 opacity-95 text-lg max-w-2xl mx-auto">
            Check out our menu and find your perfect brew. We can't wait to
            serve you!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-white text-amber-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <i className="fas fa-mug-hot"></i>
            <span>Explore Our Menu</span>
          </Link>
        </div>
      </section>
    </>
  );
}
