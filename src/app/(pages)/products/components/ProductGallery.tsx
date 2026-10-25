"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ProductImage } from "../types";

type Props = {
  images: ProductImage[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages =
    images.length > 0
      ? images
      : [
          {
            id: "placeholder",
            url: "",
            alt: productName,
          },
        ];

  const activeImage = safeImages[activeIndex] || safeImages[0];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image Container */}
      <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        {/* Slide Counter (e.g., 1 / 4) */}
        {safeImages.length > 1 && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm shadow-sm">
            {activeIndex + 1} / {safeImages.length}
          </div>
        )}

        {/* Maximize Button */}
        {activeImage.url && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="ছবি বড় করে দেখুন"
            title="ছবি বড় করে দেখুন"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Maximize2 size={16} />
          </button>
        )}

        {/* Main Display Image */}
        {activeImage.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt || productName}
            onClick={() => setLightboxOpen(true)}
            className="h-full w-full cursor-zoom-in object-contain p-2.5 sm:p-5 lg:p-8 transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50">
            <div className="text-center p-4">
              <div className="mx-auto mb-3 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-slate-100 text-4xl sm:text-5xl">
                📦
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400">
                ছবি সংযুক্ত নেই
              </p>
            </div>
          </div>
        )}

        {/* Prev / Next Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              aria-label="পূর্ববর্তী ছবি"
              className="absolute left-2.5 top-1/2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900 active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="পরবর্তী ছবি"
              className="absolute right-2.5 top-1/2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-slate-900 active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {safeImages.map((image, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={image.id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition duration-150 ${
                  isSelected
                    ? "border-amber-500 ring-2 ring-amber-400/30 shadow-sm"
                    : "border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-400"
                }`}
              >
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.alt || `${productName} thumbnail ${index + 1}`}
                    className="h-full w-full object-contain p-1 sm:p-1.5"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-50 text-base">
                    📦
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && activeImage.url && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm transition-opacity"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-white p-3 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="বন্ধ করুন"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <div className="flex max-h-[78vh] items-center justify-center">
              <img
                src={activeImage.url}
                alt={activeImage.alt || productName}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {safeImages.length > 1 && (
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-500">
                  ছবি {activeIndex + 1} / {safeImages.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousImage}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
