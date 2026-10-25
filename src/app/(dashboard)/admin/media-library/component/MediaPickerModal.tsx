"use client";

import { useEffect, useState } from "react";
import { Search, X, Check } from "lucide-react";

import { MediaFile, MediaCategory } from "./MediaCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type MediaPickerModalProps = {
  open: boolean;
  category?: MediaCategory;
  multiple?: boolean;
  selectedIds?: string[];
  onClose: () => void;
  onSelect: (media: MediaFile[]) => void;
};

export default function MediaPickerModal({
  open,
  category,
  multiple = false,
  selectedIds = [],
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [selected, setSelected] = useState<string[]>(selectedIds);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setSelected(selectedIds);
  }, [open, selectedIds]);

  useEffect(() => {
    if (!open) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        // Picker only shows images
        params.set("type", "IMAGE");

        if (category) {
          params.set("category", category);
        }

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `${API_BASE_URL}/api/media?${params.toString()}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load media");
        }

        setMedia(result.data || []);
      } catch (error) {
        console.error("Media picker error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [open, category, search]);

  if (!open) return null;

  const toggleMedia = (id: string) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );

      return;
    }

    setSelected([id]);
  };

  const handleSelect = () => {
    const selectedMedia = media.filter((item) => selected.includes(item.id));

    onSelect(selectedMedia);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Select Media
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select existing media from your library
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#D6A419]"
            />
          </div>
        </div>

        {/* Media */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="py-20 text-center text-sm text-slate-500">
              Loading media...
            </div>
          ) : media.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-slate-700">
                No media found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Upload some images to the Media Library first.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {media.map((item) => {
                const isSelected = selected.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleMedia(item.id)}
                    className={`group relative overflow-hidden rounded-xl border-2 text-left transition ${
                      isSelected
                        ? "border-[#D6A419]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Image */}
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={item.url}
                        alt={item.altText || item.originalName}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Selected */}
                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#D6A419] text-white shadow">
                        <Check size={15} />
                      </div>
                    )}

                    {/* Filename */}
                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {item.originalName}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <span className="text-sm text-slate-500">
            {selected.length} selected
          </span>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSelect}
              disabled={!selected.length}
              className="rounded-lg bg-[#12233F] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Select Media
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
