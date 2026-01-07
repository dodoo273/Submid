"use client";

import { createPortal } from "react-dom";

import { usePromoSlider } from "@/hooks/usePromoSlider";

import SmartImage from "@/components/SmartImage";
import { getImageUrl, formatDate } from "@/lib/utils";
import Link from "next/link";

type PromoSerialized = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startAt: string;
  endAt: string;
};

interface PromoClientProps {
  promos: PromoSerialized[];
  compact?: boolean;
}

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
};

export default function PromoClient({
  promos,
  compact = false,
}: PromoClientProps) {
  const {
    extendedPromos,
    activeIndex,
    baseIndex,
    promosCount,
    mounted,
    windowWidth,
    selectedPromo,
    setSelectedPromo,
    handleNext,
    handlePrev,
    goToIndex,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  } = usePromoSlider(promos);



  if (promos.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-2xl font-bold text-gray-500 font-playfair">No active promotions</h3>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-12 lg:py-20 select-none">


      {/* Navigation Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 lg:left-12 z-30 flex">
        <button
          onClick={handlePrev}
          className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-600 hover:scale-110 active:scale-95 transition-all shadow-2xl group"
        >
          <i className="fas fa-chevron-left text-sm md:text-xl group-hover:-translate-x-1 transition-transform"></i>
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 lg:right-12 z-30 flex">
        <button
          onClick={handleNext}
          className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-amber-600 hover:scale-110 active:scale-95 transition-all shadow-2xl group"
        >
          <i className="fas fa-chevron-right text-sm md:text-xl group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>



      {/* Slider Container */}
      <div className="relative h-[500px] md:h-[600px] lg:h-[850px] flex items-center justify-center px-4">
        <div 
          className="flex items-center justify-center w-full h-full relative"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {extendedPromos.map((promo, idx) => {
            const isCenter = idx === activeIndex;
            const isPrev = idx === activeIndex - 1;
            const isNext = idx === activeIndex + 1;
            const isVisible = isCenter || isPrev || isNext;

            // Offset calculation to keep the active item at center
            // Increased spacing for wide layout
            const spacing = windowWidth < 768 ? 85 : 75;
            const offset = (idx - activeIndex) * spacing;





            return (
              <div
                key={`${promo.id}-${idx}`}
                className={`absolute transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1) ${
                    isCenter ? "z-20 scale-100 md:scale-110 opacity-100 blur-0" : "z-10 scale-[0.85] md:scale-90 opacity-40 md:opacity-20 blur-[1px] md:blur-[2px]"
                } ${isCenter ? "pointer-events-auto" : "pointer-events-none"}`}
                style={{
                  transform: `translateX(${offset}%)`,
                  visibility: isVisible ? "visible" : "hidden",
                  width: windowWidth < 768 ? "min(90vw, 350px)" : "calc(min(95vw, 850px))",
                  height: windowWidth < 768 ? "min(60vh, 450px)" : "calc(min(70vh, 580px))",
                }}




              >

                <div 
                  onClick={() => isCenter && setSelectedPromo(promo)}
                  className={`relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-700 cursor-pointer ${
                    isCenter ? "ring-2 ring-amber-500/50" : ""
                }`}>
                  {/* Background Image */}
                  <SmartImage
                    src={getImageUrl(promo.imageUrl || "", "promo")}
                    alt={promo.title}
                    fill
                    quality={95}
                    priority={idx === activeIndex}
                    className="object-cover"
                    sizes="850px"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-700 ${
                      isCenter ? "opacity-100" : "opacity-40"
                  }`} />

                  {/* Day Tag */}
                  <div className="absolute top-8 left-8 z-10">
                    <span className="bg-[#e11d48] text-white px-5 py-2 rounded-full text-[11px] font-black tracking-[0.2em] uppercase shadow-2xl backdrop-blur-lg">
                      {getDayName(promo.startAt)}
                    </span>
                  </div>

                  {/* Content - Only visible on center */}
                  <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12 text-white z-10 transition-all duration-700 delay-100 ${
                      isCenter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-playfair uppercase tracking-wider mb-2 md:mb-4 drop-shadow-2xl leading-tight">
                      {promo.title}
                    </h3>
                    <p className="text-gray-100 text-xs md:text-sm lg:text-base font-light leading-relaxed mb-4 md:mb-8 line-clamp-2 max-w-sm drop-shadow-lg">
                       {promo.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/20 font-poppins">
                      <div className="flex items-center gap-3 text-[9px] md:text-[10px] tracking-[0.3em] text-white/60 uppercase font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Ends {formatDate(promo.endAt)}
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-amber-600 transition-colors">
                        <i className="fas fa-plus text-[10px] md:text-xs"></i>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-8 md:mt-12">
        {Array.from({ length: promosCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              baseIndex === i 
                ? "w-8 h-2 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>


      {/* Detail Side Panel - Using Portal with absolute maximum z-index to overlay everything */}
      {selectedPromo && mounted && createPortal(
        <div 
          className="fixed inset-0 flex justify-end overflow-hidden"
          style={{ zIndex: 2147483647 }}
        >



          {/* Backdrop Blur Over Whole Screen */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedPromo(null)}
          />
          
          {/* Right Panel (50% width on Desktop) */}
          <div className="relative w-full lg:w-1/2 bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] animate-slide-in-right flex flex-col h-full z-10">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPromo(null)}
              className="absolute top-6 right-6 lg:top-8 lg:left-8 z-50 w-12 h-12 rounded-full border border-gray-200 text-gray-900 flex items-center justify-center hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-all group lg:-translate-x-20 bg-white/80 backdrop-blur-md shadow-lg"
            >
              <i className="fas fa-times text-lg"></i>
            </button>






            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
              {/* Header Image */}
              <div className="relative w-full h-[45vh] lg:h-[50vh]">
                <SmartImage
                  src={getImageUrl(selectedPromo.imageUrl || "", "promo")}
                  alt={selectedPromo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute top-8 right-8 z-10">
                  <span className="bg-[#e11d48] text-white px-6 py-2.5 rounded-full text-[12px] font-black tracking-[0.2em] uppercase shadow-2xl">
                    {getDayName(selectedPromo.startAt)}
                  </span>
                </div>
              </div>

              {/* Promo Info */}
              <div className="px-6 md:px-8 lg:px-16 pt-8 pb-12">
                <p className="text-amber-600 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 md:mb-6 animate-fade-in [animation-delay:400ms]">Exclusive Member Offer</p>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-playfair text-gray-900 mb-6 md:mb-8 leading-[0.9] uppercase animate-fade-in [animation-delay:500ms]">
                  {selectedPromo.title}
                </h2>
                <div className="w-20 md:w-24 h-1 md:h-1.5 bg-amber-500 mb-8 md:mb-12 rounded-full animate-fade-in [animation-delay:600ms]" />


                
                <div className="prose prose-slate max-w-none mb-10 md:mb-16 animate-fade-in [animation-delay:700ms]">
                  <p className="text-gray-600 text-lg md:text-xl lg:text-2xl font-light leading-relaxed">
                    {selectedPromo.description}
                  </p>
                  <p className="text-gray-400 text-base md:text-lg mt-6 md:mt-8 leading-relaxed">
                    Explore our curated selection of premium coffee and seasonal treats. This promotion is available for a limited time at all our signature locations.
                  </p>
                </div>


                <div className="flex items-center gap-6 text-amber-600 font-black uppercase tracking-[0.3em] mb-12 animate-fade-in [animation-delay:800ms]">
                  <i className="far fa-hourglass-start animate-pulse"></i>
                  <span>Offer valid until {formatDate(selectedPromo.endAt)}</span>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-6 md:p-8 lg:p-12 bg-gray-50/80 backdrop-blur-3xl border-t border-gray-100 animate-fade-in [animation-delay:900ms]">
              <Link 
                href="/menu"
                className="inline-flex items-center justify-between w-full bg-gray-900 text-white px-8 md:px-12 py-5 md:py-7 rounded-[1.5rem] md:rounded-[2rem] font-black group hover:bg-amber-600 transition-all duration-700 shadow-2xl"
              >
                <span className="text-lg md:text-xl uppercase tracking-wider">Explore The Menu</span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <i className="fas fa-arrow-right text-base md:text-lg group-hover:translate-x-2 transition-transform"></i>
                </div>
              </Link>
            </div>

          </div>
        </div>,
        document.body
      )}


      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}
