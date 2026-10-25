"use client";


import { useState } from "react";
import {
  Check,
  MoreHorizontal,
  Trash2,
  Video,
  ImageOff,
} from "lucide-react";

export type MediaType = "IMAGE" | "VIDEO";

export type MediaCategory =
  | "PRODUCT"
  | "CATEGORY"
  | "BRAND"
  | "BANNER"
  | "SLIDER"
  | "STORE"
  | "PROMOTION"
  | "GENERAL";

export type MediaFile = {
  id: string;
  fileName: string;
  originalName: string;
  type: MediaType;
  category: MediaCategory;
  url: string;
  path: string;
  mimeType: string;
  size: number;
  altText?: string | null;
  createdAt: string;
};

type Props = {
  media: MediaFile;
  selected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
  onDelete?: () => void;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFormat = (media: MediaFile) => {
  if (media.type === "IMAGE") {
    return "WEBP";
  }

  if (media.mimeType) {
    return media.mimeType.split("/")[1]?.toUpperCase() || "FILE";
  }

  return media.fileName.split(".").pop()?.toUpperCase() || "FILE";
};

export default function MediaCard({
  media,
  selected = false,
  onSelect,
  onPreview,
  onDelete,
}: Props) {
  const [imageError, setImageError] = useState(false);

  const isImage = media.type === "IMAGE";
  const format = getFormat(media);

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Image / Video Preview */}
      <div
        className="relative aspect-square cursor-pointer overflow-hidden bg-slate-100"
        onClick={onPreview}
      >
        {isImage ? (
          !imageError && media.url ? (
            <img
              src={media.url}
              alt={media.altText || media.originalName}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <ImageOff size={42} />

              <span className="text-xs">
                ছবি লোড করা যায়নি
              </span>
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <Video
              size={42}
              className="text-slate-400"
            />
          </div>
        )}

        {/* Select Checkbox */}
        <button
          type="button"
          aria-label={
            selected
              ? "Deselect media"
              : "Select media"
          }
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          className={`absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border ${
            selected
              ? "border-[#D6A419] bg-[#D6A419] text-white"
              : "border-white bg-white/90 text-transparent"
          }`}
        >
          <Check size={16} />
        </button>

        {/* More Button */}
        <div className="absolute right-3 top-3">
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-slate-600 shadow-sm transition hover:bg-white"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>

        {/* Category + Format */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
            {media.category}
          </span>

          <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
            {format}
          </span>
        </div>
      </div>

      {/* Media Information */}
      <div className="space-y-2 p-3">
        {/* Original filename — এখানে নাম পরিবর্তন হবে না */}
        <div
          className="truncate text-sm font-medium text-slate-800"
          title={media.originalName}
        >
          {media.originalName}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {formatSize(media.size)}
          </span>

          <button
            type="button"
            aria-label="Delete media"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="text-red-500 transition hover:text-red-700"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
