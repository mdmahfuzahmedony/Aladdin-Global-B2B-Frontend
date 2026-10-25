"use client";

import {
  Check,
  Eye,
  Image as ImageIcon,
  Trash2,
  Video,
} from "lucide-react";

export type MediaFile = {
  id: string;
  fileName: string;
  originalName: string;
  type: "IMAGE" | "VIDEO";
  category: string;
  url: string;
  path: string;
  mimeType: string;
  size: number;
  altText?: string | null;
  createdAt: string;
  updatedAt: string;
};

type MediaCardProps = {
  media: MediaFile;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDelete: () => void;
};

const styles = {
  blue: {
    card: "border-blue-100 bg-blue-50/70",
    icon: "bg-blue-100 text-blue-600",
    circle: "bg-blue-100/50",
  },
  green: {
    card: "border-emerald-100 bg-emerald-50/70",
    icon: "bg-emerald-100 text-emerald-600",
    circle: "bg-emerald-100/50",
  },
  purple: {
    card: "border-violet-100 bg-violet-50/70",
    icon: "bg-violet-100 text-violet-600",
    circle: "bg-violet-100/50",
  },
  orange: {
    card: "border-orange-100 bg-orange-50/70",
    icon: "bg-orange-100 text-orange-600",
    circle: "bg-orange-100/50",
  },
  pink: {
    card: "border-pink-100 bg-pink-50/70",
    icon: "bg-pink-100 text-pink-600",
    circle: "bg-pink-100/50",
  },
  yellow: {
    card: "border-amber-100 bg-amber-50/70",
    icon: "bg-amber-100 text-amber-600",
    circle: "bg-amber-100/50",
  },
};

const formatSize = (bytes: number) => {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getVariant = (category: string) => {
  switch (category) {
    case "PRODUCT":
      return styles.blue;

    case "CATEGORY":
      return styles.green;

    case "BRAND":
      return styles.purple;

    case "BANNER":
      return styles.orange;

    case "SLIDER":
      return styles.pink;

    case "STORE":
      return styles.yellow;

    case "PROMOTION":
      return styles.orange;

    default:
      return styles.blue;
  }
};

export default function MediaCard({
  media,
  selected,
  onSelect,
  onPreview,
  onDelete,
}: MediaCardProps) {
  const s = getVariant(media.category);

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        ${s.card}
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${selected ? "ring-2 ring-[#D6A419]" : ""}
      `}
    >
      {/* Preview */}
      <div className="relative aspect-square overflow-hidden bg-white/70">
        {media.type === "IMAGE" ? (
          <img
            src={media.url}
            alt={media.altText || media.originalName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <video
            src={media.url}
            className="h-full w-full object-cover"
            muted
            preload="metadata"
          />
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

        {/* Select */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`
            absolute
            left-3
            top-3
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            border
            shadow-sm
            transition
            ${
              selected
                ? "border-[#D6A419] bg-[#D6A419]"
                : "border-white/80 bg-white/90"
            }
          `}
        >
          {selected && (
            <Check
              size={15}
              strokeWidth={3}
              className="text-white"
            />
          )}
        </button>

        {/* Type badge */}
        <div
          className={`
            absolute
            right-3
            top-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            shadow-sm
            ${s.icon}
          `}
        >
          {media.type === "IMAGE" ? (
            <ImageIcon size={16} />
          ) : (
            <Video size={16} />
          )}
        </div>

        {/* Preview button */}
        <button
          type="button"
          onClick={onPreview}
          className="
            absolute
            bottom-3
            left-1/2
            flex
            -translate-x-1/2
            translate-y-2
            items-center
            gap-1.5
            rounded-lg
            bg-white/95
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#12233F]
            opacity-0
            shadow-md
            transition-all
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <Eye size={14} />
          Preview
        </button>
      </div>

      {/* Card content */}
      <div className="relative p-4">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Category */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {media.category}
            </p>

            {/* File name */}
            <p
              title={media.originalName}
              className="mt-1 truncate text-[14px] font-bold leading-5 text-[#12233F]"
            >
              {media.originalName}
            </p>

            {/* Size */}
            <p className="mt-1 text-[11.5px] leading-5 text-slate-500">
              {formatSize(media.size)}
            </p>
          </div>

          {/* Media icon */}
          <div
            className={`
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${s.icon}
            `}
          >
            {media.type === "IMAGE" ? (
              <ImageIcon size={19} strokeWidth={2} />
            ) : (
              <Video size={19} strokeWidth={2} />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 mt-3 flex items-center justify-between border-t border-black/5 pt-3">
          <button
            type="button"
            onClick={onPreview}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 transition hover:text-[#12233F]"
          >
            <Eye size={14} />
            View
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-red-500 transition hover:text-red-700"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        {/* Decorative circle */}
        <div
          className={`
            pointer-events-none
            absolute
            -bottom-10
            -right-10
            h-24
            w-24
            rounded-full
            ${s.circle}
          `}
        />
      </div>
    </div>
  );
}