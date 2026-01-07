import { useState, useEffect, useCallback, useMemo } from "react";

type PromoSerialized = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startAt: string;
  endAt: string;
};

export function usePromoSlider(promos: PromoSerialized[]) {
  // We triplicate the array to handle the infinite loop visual transition smoothly
  const extendedPromos = useMemo(() => [...promos, ...promos, ...promos], [promos]);
  
  // Start in the middle set of promos
  const [activeIndex, setActiveIndex] = useState(promos.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState<PromoSerialized | null>(null);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  }, [isTransitioning]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Handle the infinite loop jump
  useEffect(() => {
    if (activeIndex >= promos.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(promos.length);
      }, 700);
      return () => clearTimeout(timer);
    } else if (activeIndex < promos.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(promos.length * 2 - 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, promos.length]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // Body scroll lock
  useEffect(() => {
    if (selectedPromo) {
      document.body.style.overflow = "hidden";
      document.body.classList.add('promo-detail-open');
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove('promo-detail-open');
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove('promo-detail-open');
    };
  }, [selectedPromo]);

  return {
    extendedPromos,
    activeIndex,
    baseIndex: activeIndex % promos.length,
    promosCount: promos.length,
    isTransitioning,
    mounted,
    windowWidth,
    selectedPromo,
    setSelectedPromo,
    handleNext,
    handlePrev,
    goToIndex: (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(promos.length + index);
    },
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}

