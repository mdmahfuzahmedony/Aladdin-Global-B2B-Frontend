"use client";

import { X } from "lucide-react";
import { MediaFile } from "./MediaCard";

type Props = {
  media: MediaFile | null;
  onClose: () => void;
};

export default function MediaPreviewModal({
  media,
  onClose,
}: Props) {
  if (!media) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5">
      <div className="relative max-h-[90vh] max-w-5xl rounded-xl bg-white p-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow"
        >
          <X size={18} />
        </button>

        {media.type === "IMAGE" ? (
          <img
            src={media.url}
            alt={media.altText || media.originalName}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
          />
        ) : (
          <video
            src={media.url}
            controls
            className="max-h-[80vh] max-w-full rounded-lg"
          />
        )}

        <div className="mt-3">
          <p className="font-medium text-slate-800">
            {media.originalName}
          </p>

          <p className="text-sm text-slate-500">
            {media.category}
          </p>
        </div>
      </div>
    </div>
  );
}