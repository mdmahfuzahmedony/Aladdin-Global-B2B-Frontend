"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BannerPlacement =
  | "FLASH_SALE"
  | "NEW_ARRIVALS"
  | "BEST_SELLERS"
  | "FEATURED_PRODUCTS"
  | "TOP_RATED_PRODUCTS";

type SectionBannerItem = {
  id: string;
  name: string;
  image: string;
  link: string | null;
  placementKey?: string;
  status?: "ACTIVE" | "INACTIVE";
};

interface SectionBannerProps {
  placement: BannerPlacement;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");

export default function SectionBanner({ placement }: SectionBannerProps) {
  const [banners, setBanners] = useState<SectionBannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failedImageIds, setFailedImageIds] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBanners() {
      setLoading(true);

      try {
        const url = `${API_URL}/api/banners/public/${placement}`;

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || data?.success === false) {
          throw new Error(data?.message || `HTTP error: ${response.status}`);
        }

        const bannerList: SectionBannerItem[] = Array.isArray(data?.banners)
          ? data.banners.filter(
              (banner: SectionBannerItem) =>
                banner &&
                typeof banner.id === "string" &&
                typeof banner.image === "string" &&
                banner.image.trim().length > 0,
            )
          : [];

        setBanners(bannerList);
        setCurrentIndex(0);
        setFailedImageIds([]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error(`Failed to load ${placement} banners:`, error);
        setBanners([]);
        setCurrentIndex(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadBanners();

    return () => controller.abort();
  }, [placement]);

  // Automatic slideshow: every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((previousIndex) => {
        return (previousIndex + 1) % banners.length;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [banners.length]);

  if (loading || banners.length === 0) {
    return null;
  }

  const banner = banners[currentIndex];

  if (!banner) return null;

  const imageFailed = failedImageIds.includes(banner.id);

  const imageElement = (
    <img
      src={banner.image}
      alt={banner.name || "Promotional banner"}
      loading="eager"
      onError={() => {
        console.error(`Banner image failed: ${banner.name}`, banner.image);

        setFailedImageIds((previous) =>
          previous.includes(banner.id) ? previous : [...previous, banner.id],
        );
      }}
      className="block h-full w-full object-cover transition-transform duration-500 hover:scale-[1.01]"
    />
  );

  return (
    <section className="w-full px-3 py-2 sm:px-5 sm:py-3 lg:px-6">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Banner */}
        <div className="relative h-[115px] w-full overflow-hidden rounded-lg bg-slate-100 shadow-sm sm:h-[155px] sm:rounded-xl md:h-[175px] lg:h-[190px] xl:h-[205px]">
          {imageFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 px-4 text-center text-xs text-gray-500 sm:text-sm">
              ব্যানারের ছবি লোড হয়নি। Admin Panel-এ ছবির URL পরীক্ষা করো।
            </div>
          ) : banner.link ? (
            <Link
              href={banner.link}
              aria-label={banner.name}
              className="block h-full w-full"
            >
              {imageElement}
            </Link>
          ) : (
            <div className="h-full w-full">{imageElement}</div>
          )}

          {/* Subtle image overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#12233F]/10 via-transparent to-[#12233F]/5" />
        </div>

        {/* Slide indicators */}
        {banners.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`ব্যানার ${index + 1} দেখুন`}
                aria-current={currentIndex === index ? "true" : undefined}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-5 bg-[#D6A419]"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
