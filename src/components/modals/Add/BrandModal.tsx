"use client";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";

import { Award, X, Check, Loader2, ImageIcon } from "lucide-react";

import { createClient } from "../../../../lib/supabase-client";

type MediaType = "IMAGE" | "VIDEO";

type MediaCategory =
  | "PRODUCT"
  | "CATEGORY"
  | "BRAND"
  | "BANNER"
  | "SLIDER"
  | "STORE"
  | "PROMOTION"
  | "GENERAL";

type MediaFile = {
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

type BrandModalProps = {
  isOpen: boolean;
  onClose: () => void;

  onSave: (brandData: {
    name: string;
    slug: string;
    logoFile: File | null;
    status: string;
    mediaId: string | null;
    logo: string | null;
  }) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// =====================================================
// SAME CATEGORIES FROM MEDIA LIBRARY
// =====================================================

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
] as const;

type CategoryFilter = (typeof categories)[number];

export default function BrandModal({
  isOpen,
  onClose,
  onSave,
}: BrandModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Active");

  const [saving, setSaving] = useState(false);

  // =====================================================
  // MEDIA STATES
  // =====================================================

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("BRAND");

  const [media, setMedia] = useState<MediaFile[]>([]);

  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

  const [tempSelectedMedia, setTempSelectedMedia] = useState<MediaFile | null>(
    null,
  );

  const [mediaLoading, setMediaLoading] = useState(false);

  const [mediaError, setMediaError] = useState("");

  const [showMediaSection, setShowMediaSection] = useState(false);

  const supabase = createClient();

  // =====================================================
  // FETCH MEDIA
  // =====================================================

  const fetchMedia = async (category: CategoryFilter) => {
    try {
      setMediaLoading(true);
      setMediaError("");

      const params = new URLSearchParams();

      params.set("type", "IMAGE");

      if (category !== "ALL") {
        params.set("category", category);
      }

      const response = await fetch(`${API_URL}/api/media?${params.toString()}`);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.error || result?.message || "Failed to load media.",
        );
      }

      setMedia(result.data || []);
    } catch (error: any) {
      console.error("❌ FETCH MEDIA ERROR:", error);

      setMedia([]);

      setMediaError(error?.message || "Media load করা যাচ্ছে না।");
    } finally {
      setMediaLoading(false);
    }
  };

  // =====================================================
  // CATEGORY CHANGE
  // =====================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!showMediaSection) {
      return;
    }

    void fetchMedia(categoryFilter);
  }, [isOpen, showMediaSection, categoryFilter]);

  // =====================================================
  // BRAND NAME
  // =====================================================

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setName(val);

    setSlug(
      val
        .toLowerCase()
        .replace(/[\s]+/g, "-")
        .replace(/[^\w-]/g, ""),
    );
  };

  // =====================================================
  // OPEN MEDIA SECTION
  // =====================================================

  const handleOpenMedia = () => {
    setShowMediaSection(true);

    if (media.length === 0) {
      void fetchMedia(categoryFilter);
    }
  };

  // =====================================================
  // TEMP SELECT MEDIA
  // =====================================================

  const handleMediaSelect = (mediaItem: MediaFile) => {
    setTempSelectedMedia(mediaItem);
  };

  // =====================================================
  // ADD SELECTED MEDIA
  // =====================================================

  const handleAddMedia = () => {
    if (!tempSelectedMedia) {
      toast.warning("আগে একটি image select করুন।");
      return;
    }

    setSelectedMedia(tempSelectedMedia);

    setShowMediaSection(false);

    console.log("✅ SELECTED BRAND MEDIA:", tempSelectedMedia);
  };

  // =====================================================
  // REMOVE SELECTED MEDIA
  // =====================================================

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setTempSelectedMedia(null);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    // -------------------------------------------------
    // BRAND NAME VALIDATION
    // -------------------------------------------------

    if (!name.trim()) {
      toast.warning("Brand name is required.");
      return;
    }

    // -------------------------------------------------
    // MEDIA VALIDATION
    // -------------------------------------------------

    if (!selectedMedia) {
      toast.warning("Brand-এর জন্য একটি image select করুন।");
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // 1. GET SUPABASE SESSION
      // =================================================

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ SUPABASE SESSION ERROR:", sessionError);

        toast.error(sessionError.message || "Unable to get login session.");

        return;
      }

      if (!session?.access_token) {
        toast.warning("লগইন করা নেই। আগে login করুন।");

        return;
      }

      // =================================================
      // 2. CREATE BRAND
      // =================================================

      console.log("🟡 Creating brand...");

      console.log("Brand Name:", name.trim());

      console.log("Brand Slug:", slug.trim());

      console.log("Selected Media ID:", selectedMedia.id);

      console.log("Selected Media URL:", selectedMedia.url);

      const response = await fetch(`${API_URL}/api/brands`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          status,

          // IMPORTANT
          // Backend selected Media Library image
          // এই ID দিয়ে খুঁজবে
          mediaId: selectedMedia.id,
        }),
      });

      const result = await response.json();

      console.log("=================================");

      console.log("🔵 BRAND API RESPONSE");

      console.log("=================================");

      console.log("Status:", response.status);

      console.log("Response:", result);

      console.log("=================================");

      // =================================================
      // 3. ERROR
      // =================================================

      if (!response.ok || !result.success) {
        throw new Error(
          result?.message || result?.error || "Failed to create brand.",
        );
      }

      // =================================================
      // 4. SUCCESS
      // =================================================

      console.log("✅ BRAND SAVED");

      console.log("Created Brand:", result.data);

      console.log("Saved Logo:", result.data?.logo);

  

      // =================================================
      // 5. SEND DATA TO PARENT
      // =================================================

      onSave({
        name: name.trim(),
        slug: slug.trim(),
        logoFile: null,
        status,

        mediaId: selectedMedia.id,

        logo: result.data?.logo || selectedMedia.url || null,
      });

      // =================================================
      // 6. RESET
      // =================================================

      setName("");
      setSlug("");
      setStatus("Active");

      setSelectedMedia(null);
      setTempSelectedMedia(null);

      setMedia([]);
      setCategoryFilter("BRAND");
      setShowMediaSection(false);

      onClose();
    } catch (error: any) {
      console.error("❌ CREATE BRAND ERROR:", error);

      toast.error(error?.message || "Something went wrong while creating the brand.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    setName("");
    setSlug("");
    setStatus("Active");

    setSelectedMedia(null);
    setTempSelectedMedia(null);

    setMedia([]);
    setMediaError("");

    setCategoryFilter("BRAND");
    setShowMediaSection(false);

    onClose();
  };

  // =====================================================
  // UI
  // =====================================================

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#d6a419]">
              <Award size={20} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#12233F]">
                Add New Brand
              </h3>

              <p className="text-xs text-slate-400">
                Create a new brand so products can be added under it
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* ================================================= */}
          {/* BRAND NAME */}
          {/* ================================================= */}

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Brand Name <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Nike, Samsung"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#d6a419] disabled:bg-slate-50"
            />
          </div>

          {/* ================================================= */}
          {/* SLUG */}
          {/* ================================================= */}

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. nike"
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none disabled:opacity-70"
            />
          </div>

          {/* ================================================= */}
          {/* BRAND IMAGE */}
          {/* ================================================= */}

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Brand Image <span className="text-rose-500">*</span>
            </label>

            {/* ================================================= */}
            {/* SELECTED IMAGE */}
            {/* ================================================= */}

            {selectedMedia ? (
              <div className="rounded-2xl border border-[#d6a419] bg-amber-50/40 p-4">
                <div className="flex items-center gap-4">
                  {/* IMAGE */}

                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.originalName}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* INFO */}

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#d6a419]">
                      Selected Image
                    </p>

                    <p
                      className="mt-1 truncate text-sm font-bold text-slate-700"
                      title={selectedMedia.originalName}
                    >
                      {selectedMedia.originalName}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Category: {selectedMedia.category}
                    </p>
                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    disabled={saving}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#d6a419] shadow-sm">
                    <ImageIcon size={19} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-700">
                      Select from Media Library
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Media Library-এর existing image থেকে একটি image select
                      করুন।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenMedia}
                    disabled={saving}
                    className="shrink-0 rounded-xl bg-[#12233F] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#12233F]/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Select Image
                  </button>
                </div>
              </div>
            )}

            {/* ================================================= */}
            {/* MEDIA SELECTOR */}
            {/* ================================================= */}

            {showMediaSection && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Media Library Category
                  </label>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value as CategoryFilter)
                    }
                    disabled={mediaLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#d6a419]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "ALL" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MEDIA AREA */}

                <div className="mt-4">
                  {mediaLoading ? (
                    <div className="flex min-h-[180px] items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Loader2 size={25} className="animate-spin" />

                        <span className="text-xs">Images loading...</span>
                      </div>
                    </div>
                  ) : mediaError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                      <p className="text-xs font-medium text-red-600">
                        {mediaError}
                      </p>

                      <button
                        type="button"
                        onClick={() => void fetchMedia(categoryFilter)}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : media.length === 0 ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                      <ImageIcon size={32} className="text-slate-300" />

                      <p className="mt-3 text-xs font-semibold text-slate-600">
                        এই category-তে কোনো image নেই।
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Media Library থেকে আগে image upload করুন।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {media.map((item) => {
                        const isSelected = tempSelectedMedia?.id === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleMediaSelect(item)}
                            className={`group overflow-hidden rounded-xl border text-left transition ${
                              isSelected
                                ? "border-[#d6a419] bg-amber-50 ring-2 ring-[#d6a419]/20"
                                : "border-slate-200 bg-white hover:border-[#d6a419]"
                            }`}
                          >
                            {/* IMAGE */}

                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                              <img
                                src={item.url}
                                alt={item.originalName}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />

                              {/* SELECTED */}

                              {isSelected && (
                                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#d6a419] text-white shadow">
                                  <Check size={15} />
                                </div>
                              )}

                              {/* CATEGORY */}

                              <div className="absolute bottom-2 left-2">
                                <span className="rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            {/* NAME */}

                            <div className="p-2.5">
                              <p
                                className="truncate text-xs font-semibold text-slate-700"
                                title={item.originalName}
                              >
                                {item.originalName}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ================================================= */}
                {/* MEDIA ACTIONS */}
                {/* ================================================= */}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaSection(false);

                      setTempSelectedMedia(null);
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleAddMedia}
                    disabled={!tempSelectedMedia}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#d6a419] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#c49512] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check size={14} />
                    Add Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* STATUS */}
          {/* ================================================= */}

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              Status
            </label>

            <div className="flex gap-3">
              {["Active", "Inactive"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(item)}
                  disabled={saving}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition ${
                    status === item
                      ? "border-[#d6a419] bg-amber-50 text-[#12233F]"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {status === item && (
                    <Check size={14} className="text-[#d6a419]" />
                  )}

                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !selectedMedia}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#12233F]/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Brand"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
