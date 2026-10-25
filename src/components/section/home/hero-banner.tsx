"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type HeroBanner = {
  id: string;
  name: string;
  image: string;
  link?: string | null;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");

export default function HeroImageSlider() {
  const [sliderImages, setSliderImages] = useState<HeroBanner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadHeroBanners = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/banners/public/homepage-hero`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const data = await response.json();

        console.log("HERO BANNER API RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data?.message || "Hero banner load করতে সমস্যা হয়েছে",
          );
        }

        const banners: HeroBanner[] = Array.isArray(data?.banners)
          ? data.banners.filter(
              (banner: HeroBanner) =>
                banner &&
                typeof banner.id === "string" &&
                typeof banner.image === "string" &&
                banner.image.trim() !== "",
            )
          : [];

        setSliderImages(banners);
        setCurrentIndex(0);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Homepage Hero Banner Load Error:", error);
        setSliderImages([]);
        setCurrentIndex(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadHeroBanners();

    return () => {
      controller.abort();
    };
  }, []);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (sliderImages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex(
        (previousIndex) => (previousIndex + 1) % sliderImages.length,
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const prevSlide = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? sliderImages.length - 1 : previousIndex - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex(
      (previousIndex) => (previousIndex + 1) % sliderImages.length,
    );
  };

  // Do not render an empty slider
  if (loading || sliderImages.length === 0) {
    return null;
  }

  const currentSlide = sliderImages[currentIndex];

  if (!currentSlide) {
    return null;
  }

  return (
    <div className="group relative mx-3 mt-2 h-[220px] w-auto overflow-hidden rounded-lg sm:mx-0 sm:mt-0 sm:h-[300px] sm:w-full sm:rounded-none lg:h-[380px] xl:h-[420px]">
      {/* Images container */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {sliderImages.map((slide) => (
          <div key={slide.id} className="relative h-full min-w-full">
            <img
              src={slide.image}
              alt={slide.name || "Homepage hero banner"}
              className="h-full w-full object-cover"
              loading="eager"
              onError={() => {
                console.error("Hero banner image failed to load:", slide.image);
              }}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#12233F]/90 via-[#12233F]/30 to-transparent" />

            {/* Banner content */}
            <div className="absolute bottom-6 left-4 right-4 z-10 text-left sm:bottom-8 sm:left-8 sm:right-8">
              <span className="rounded-full bg-[#d6a419] px-3 py-1 text-xs font-extrabold text-[#12233F]">
                Featured Offer
              </span>

              <h2 className="mt-2 text-xl font-extrabold text-white sm:text-3xl">
                {slide.name}
              </h2>

              <p className="mt-1 max-w-lg text-xs text-slate-200 sm:text-sm">
                Discover quality products and great deals from verified sellers.
              </p>

              {slide.link && (
                <a
                  href={slide.link}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#12233F] transition hover:bg-[#d6a419] sm:mt-4 sm:px-5 sm:py-2.5"
                >
                  Shop Now
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Previous button */}
      {sliderImages.length > 1 && (
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#12233F] opacity-100 shadow-md transition hover:bg-white sm:left-4 sm:h-10 sm:w-10 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Next button */}
      {sliderImages.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#12233F] opacity-100 shadow-md transition hover:bg-white sm:right-4 sm:h-10 sm:w-10 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dots indicator */}
      {sliderImages.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex gap-2 sm:right-8">
          {sliderImages.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === index
                  ? "w-8 bg-[#d6a419]"
                  : "w-2.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
