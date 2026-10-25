"use client";


import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image as ImageIcon,
  Video,
  HardDrive,
  Files,
  Search,
  Upload,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";

import AdminStatCard from "@/components/cards/AdminStatCard";
import MediaCard, { MediaFile } from "./component/MediaCard";
import MediaUploadModal from "./component/MediaUploadModal";
import MediaPreviewModal from "./component/MediaPreviewModal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const categories = [
  "ALL",
  "PRODUCT",
  "CATEGORY",
  "BRAND",
  "BANNER",
  "SLIDER",
  "STORE",
  "PROMOTION",
  "GENERAL",
];

const formatStorage = (bytes: number) => {
  if (!bytes || bytes <= 0) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const parseResponse = async (response: Response): Promise<any> => {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid response.");
  }
};

const ensureSuccess = (response: Response, result: any) => {
  if (!response.ok || result?.success !== true) {
    throw new Error(
      result?.message ||
        result?.error ||
        `Request failed (${response.status}).`,
    );
  }
};

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<
    "ALL" | "IMAGE" | "VIDEO"
  >("ALL");

  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: string; isBulk?: boolean }>({ isOpen: false });

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // ========================================
  // FETCH MEDIA
  // ========================================

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (typeFilter !== "ALL") {
        params.set("type", typeFilter);
      }

      if (categoryFilter !== "ALL") {
        params.set("category", categoryFilter);
      }

      const query = params.toString();
      const endpoint = `${API_BASE_URL}/api/media${
        query ? `?${query}` : ""
      }`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const result = await parseResponse(response);
      ensureSuccess(response, result);

      setMedia(Array.isArray(result.data) ? result.data : []);
      setSelectedIds([]);
    } catch (error) {
      console.error("Media fetch error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load media!",
      );
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    void fetchMedia();
  }, [fetchMedia]);

  // ========================================
  // STATISTICS
  // ========================================

  const totalMedia = media.length;

  const imageCount = media.filter(
    (item) => item.type === "IMAGE",
  ).length;

  const videoCount = media.filter(
    (item) => item.type === "VIDEO",
  ).length;

  const storageUsed = media.reduce(
    (total, item) => total + (Number(item.size) || 0),
    0,
  );

  // ========================================
  // SEARCH FILTER
  // ========================================

  const filteredMedia = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return media;

    return media.filter((item) => {
      return (
        (item.originalName || "").toLowerCase().includes(keyword) ||
        (item.fileName || "").toLowerCase().includes(keyword) ||
        (item.category || "").toLowerCase().includes(keyword) ||
        (item.mimeType || "").toLowerCase().includes(keyword)
      );
    });
  }, [media, search]);

  // ========================================
  // SELECT MEDIA
  // ========================================

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredMedia.map((item) => item.id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...visibleIds]),
      ]);
    }
  };

  const allVisibleSelected =
    filteredMedia.length > 0 &&
    filteredMedia.every((item) => selectedIds.includes(item.id));

  // ========================================
  // DELETE SINGLE MEDIA
  // ========================================

  const deleteMedia = async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/media/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = await parseResponse(response);
      ensureSuccess(response, result);

      setMedia((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));

      if (previewMedia?.id === id) {
        setPreviewMedia(null);
      }

      toast.success("Media deleted successfully!");
    } catch (error) {
      console.error("Delete media error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete media!",
      );
    }
  };

  // ========================================
  // BULK DELETE
  // ========================================

  const bulkDelete = async () => {
    if (!selectedIds.length || deleting) return;

    const idsToDelete = [...selectedIds];
    setDeleting(true);

    try {
      const results = await Promise.all(
        idsToDelete.map(async (id) => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/media/${encodeURIComponent(id)}`,
              {
                method: "DELETE",
                headers: {
                  Accept: "application/json",
                },
              },
            );

            const result = await parseResponse(response);
            ensureSuccess(response, result);

            return { id, success: true };
          } catch (error) {
            console.error(`Delete media ${id} failed:`, error);
            return { id, success: false };
          }
        }),
      );

      const deletedIds = results
        .filter((item) => item.success)
        .map((item) => item.id);

      const failedCount = results.filter(
        (item) => !item.success,
      ).length;

      setMedia((prev) =>
        prev.filter((item) => !deletedIds.includes(item.id)),
      );

      setSelectedIds((prev) =>
        prev.filter((id) => !deletedIds.includes(id)),
      );

      if (previewMedia && deletedIds.includes(previewMedia.id)) {
        setPreviewMedia(null);
      }

      if (deletedIds.length > 0) {
        toast.success(
          `${deletedIds.length} media deleted successfully!`,
        );
      }

      if (failedCount > 0) {
        toast.error(
          `${failedCount} media could not be deleted!`,
        );
      }
    } catch (error) {
      console.error("Bulk delete error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete selected media!",
      );
    } finally {
      setDeleting(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Media Library
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage images and videos used across your marketplace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchMedia()}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#12233F] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1b3155]"
          >
            <Upload size={17} />
            Upload Media
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Media"
          value={String(totalMedia)}
          icon={Files}
          variant="blue"
        />

        <AdminStatCard
          label="Images"
          value={String(imageCount)}
          icon={ImageIcon}
          variant="green"
        />

        <AdminStatCard
          label="Videos"
          value={String(videoCount)}
          icon={Video}
          variant="purple"
        />

        <AdminStatCard
          label="Storage Used"
          value={formatStorage(storageUsed)}
          icon={HardDrive}
          variant="orange"
        />
      </div>

      {/* TOOLBAR */}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(
                e.target.value as "ALL" | "IMAGE" | "VIDEO",
              )
            }
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
          >
            <option value="ALL">All Types</option>
            <option value="IMAGE">Images</option>
            <option value="VIDEO">Videos</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "ALL" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BULK ACTION */}

      {selectedIds.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-red-700">
            {selectedIds.length} media selected
          </span>

          <button
            type="button"
            onClick={() => void bulkDelete()}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      )}

      {/* MEDIA GRID */}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {!loading && filteredMedia.length > 0 && (
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border ${
                  allVisibleSelected
                    ? "border-[#D6A419] bg-[#D6A419]"
                    : "border-slate-300 bg-white"
                }`}
              >
                {allVisibleSelected && (
                  <span className="text-xs text-white">✓</span>
                )}
              </span>
              Select All
            </button>

            <span className="text-xs text-slate-500">
              {filteredMedia.length} media
            </span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#D6A419]" />

            <p className="text-sm text-slate-500">
              Loading media...
            </p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon
              size={42}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="text-sm font-medium text-slate-700">
              No media found
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Upload your first image or video.
            </p>

            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#12233F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1b3155]"
            >
              <Upload size={15} />
              Upload Media
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredMedia.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
                selected={selectedIds.includes(item.id)}
                onSelect={() => toggleSelect(item.id)}
                onPreview={() => setPreviewMedia(item)}
                onDelete={() => setDeleteModal({ isOpen: true, id: item.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* UPLOAD MODAL */}

      <MediaUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => {
          setUploadOpen(false);
          toast.success("Media uploaded successfully!");
          void fetchMedia();
        }}
      />

      {/* PREVIEW MODAL */}

      <MediaPreviewModal
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={async () => {
          if (deleteModal.isBulk) {
            await bulkDelete();
          } else if (deleteModal.id) {
            await deleteMedia(deleteModal.id);
          }
          setDeleteModal({ isOpen: false });
        }}
        isLoading={deleting}
        title={deleteModal.isBulk ? "নির্বাচিত ফাইলগুলো ডিলিট করবেন?" : "মিডিয়া ফাইল ডিলিট করবেন?"}
        description={deleteModal.isBulk ? `আপনি কি নিশ্চিতভাবে ${selectedIds.length}টি ফাইল মুছে ফেলতে চান?` : "আপনি কি নিশ্চিতভাবে এই মিডিয়া ফাইলটি মুছে ফেলতে চান?"}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
      />
    </div>
  );
}
