"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";

import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";
import AdminStatCard from "@/components/cards/AdminStatCard";
import { createClient } from "../../../../../../lib/supabase-client";

// =====================================================
// TYPES
// =====================================================

type BannerStatus = "ACTIVE" | "INACTIVE";

type BannerPlacement =
  | "TOP_BANNER"
  | "HOMEPAGE_HERO"
  | "FLASH_SALE"
  | "NEW_ARRIVALS"
  | "BEST_SELLERS"
  | "FEATURED_PRODUCTS"
  | "TOP_RATED_PRODUCTS";

type Banner = {
  id: string;
  name: string;
  image: string;
  link: string;
  placement: BannerPlacement;
  status: BannerStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
};

type BannerForm = {
  name: string;
  image: string;
  link: string;
  placement: BannerPlacement;
  status: BannerStatus;
  startDate: string;
  endDate: string;
};

// =====================================================
// API
// =====================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// =====================================================
// PLACEMENTS
// =====================================================

const PLACEMENTS: {
  value: BannerPlacement;
  label: string;
  description: string;
}[] = [
  {
    value: "TOP_BANNER",
    label: "Top Banner",
    description: "Website-এর একদম উপরের বিজ্ঞাপন অংশ",
  },
  {
    value: "HOMEPAGE_HERO",
    label: "Homepage Hero",
    description: "হোমপেজের প্রধান বড় ব্যানার",
  },
  {
    value: "FLASH_SALE",
    label: "Flash Sale",
    description: "Flash Sale section-এর উপরে banner",
  },
  {
    value: "NEW_ARRIVALS",
    label: "New Arrivals",
    description: "New Arrivals section-এর উপরে banner",
  },
  {
    value: "BEST_SELLERS",
    label: "Best Sellers",
    description: "Best Sellers section-এর উপরে banner",
  },
  {
    value: "FEATURED_PRODUCTS",
    label: "Featured Products",
    description: "Featured Products section-এর উপরে banner",
  },
  {
    value: "TOP_RATED_PRODUCTS",
    label: "Top Rated Products",
    description: "Top Rated Products section-এর উপরে banner",
  },
];

// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM: BannerForm = {
  name: "",
  image: "",
  link: "",
  placement: "TOP_BANNER",
  status: "ACTIVE",
  startDate: "",
  endDate: "",
};

// =====================================================
// HELPERS
// =====================================================

const placementLabel = (placement: BannerPlacement) =>
  PLACEMENTS.find((item) => item.value === placement)?.label ?? placement;

const supabase = createClient();

// =====================================================
// PAGE
// =====================================================

export default function HomepageBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [search, setSearch] = useState("");
  const [placementFilter, setPlacementFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [imageName, setImageName] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // ===================================================
  // ACCESS TOKEN
  // ===================================================

  const getAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("লগইন করা নেই। আবার লগইন করুন।");
    }

    return token;
  };

  // ===================================================
  // API ERROR MESSAGE
  // ===================================================

  const getErrorMessage = async (response: Response, fallback: string) => {
    const text = await response.text();

    if (!text) {
      return fallback;
    }

    try {
      const result = JSON.parse(text);
      return result?.message || result?.error || fallback;
    } catch {
      return fallback;
    }
  };

  // ===================================================
  // LOAD BANNERS
  // ===================================================

  const loadBanners = async () => {
    setIsLoading(true);

    try {
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/api/banners`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "ব্যানার লোড করা যায়নি।"),
        );
      }

      const result = await response.json();

      const backendBanners = Array.isArray(result)
        ? result
        : result?.data || result?.banners || [];

      const normalizedBanners: Banner[] = backendBanners.map((banner: any) => ({
        id: banner.id,
        name: banner.name ?? "",
        image: banner.image ?? "",
        link: banner.link ?? "",
        placement:
          banner.placementKey ??
          (typeof banner.placement === "string"
            ? banner.placement
            : banner.placement?.key) ??
          "TOP_BANNER",
        status: banner.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        startDate: banner.startDate
          ? String(banner.startDate).slice(0, 10)
          : "",
        endDate: banner.endDate ? String(banner.endDate).slice(0, 10) : "",
        createdAt: banner.createdAt ?? "",
      }));

      setBanners(normalizedBanners);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "ব্যানার লোড করা যায়নি।",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBanners();
    // Initial load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===================================================
  // COUNTS
  // ===================================================

  const activeCount = useMemo(
    () => banners.filter((banner) => banner.status === "ACTIVE").length,
    [banners],
  );

  const inactiveCount = banners.length - activeCount;

  // ===================================================
  // FILTER
  // ===================================================

  const filteredBanners = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return banners.filter((banner) => {
      const matchesSearch =
        !keyword ||
        banner.name.toLowerCase().includes(keyword) ||
        banner.link.toLowerCase().includes(keyword);

      const matchesPlacement =
        placementFilter === "ALL" || banner.placement === placementFilter;

      const matchesStatus =
        statusFilter === "ALL" || banner.status === statusFilter;

      return matchesSearch && matchesPlacement && matchesStatus;
    });
  }, [banners, search, placementFilter, statusFilter]);

  // ===================================================
  // CREATE MODAL
  // ===================================================

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageName("");
    setFormError("");
    setIsModalOpen(true);
  };

  // ===================================================
  // EDIT MODAL
  // ===================================================

  const openEditModal = (banner: Banner) => {
    setEditingId(banner.id);

    setForm({
      name: banner.name,
      image: banner.image,
      link: banner.link,
      placement: banner.placement,
      status: banner.status,
      startDate: banner.startDate,
      endDate: banner.endDate,
    });

    setImageName("");
    setFormError("");
    setIsModalOpen(true);
  };

  // ===================================================
  // IMAGE UPLOAD
  // ===================================================

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে একটি image file নির্বাচন করো।");
      event.target.value = "";
      return;
    }

    setFormError("");
    setIsUploadingImage(true);
    setImageName(file.name);

    try {
      const token = await getAccessToken();
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/uploads/banner-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "ব্যানার ইমেজ আপলোড করা যায়নি।"),
        );
      }

      const result = await response.json();

      const uploadedUrl =
        result?.data?.url || result?.url || result?.data?.publicUrl;

      if (!uploadedUrl) {
        throw new Error("ইমেজ আপলোড হয়েছে, কিন্তু image URL পাওয়া যায়নি।");
      }

      setForm((current) => ({
        ...current,
        image: uploadedUrl,
      }));

      toast.success("ব্যানার ইমেজ সফলভাবে আপলোড হয়েছে!");
    } catch (error: unknown) {
      setImageName("");

      toast.error(
        error instanceof Error ? error.message : "ইমেজ আপলোড করা যায়নি।",
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  // ===================================================
  // SUBMIT CREATE / UPDATE
  // ===================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("ব্যানারের নাম দিতে হবে।");
      return;
    }

    if (!form.image) {
      toast.error("আগে একটি ব্যানার ইমেজ আপলোড করো।");
      return;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      toast.error("শেষ তারিখ শুরুর তারিখের আগে হতে পারবে না।");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const isEditing = Boolean(editingId);

    try {
      const token = await getAccessToken();

      const payload = {
        name: form.name.trim(),
        image: form.image,
        link: form.link.trim(),
        placementKey: form.placement,
        status: form.status,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      const url = isEditing
        ? `${API_URL}/api/banners/${editingId}`
        : `${API_URL}/api/banners`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            isEditing
              ? "ব্যানার আপডেট করা যায়নি।"
              : "ব্যানার তৈরি করা যায়নি।",
          ),
        );
      }

      const result = await response.json();

      if (result?.success === false) {
        throw new Error(
          result?.message || result?.error || "ব্যানার সংরক্ষণ করা যায়নি।",
        );
      }

      setIsModalOpen(false);
      setForm(EMPTY_FORM);
      setImageName("");
      setEditingId(null);
      setFormError("");

      toast.success(
        isEditing
          ? "ব্যানার সফলভাবে আপডেট হয়েছে!"
          : "ব্যানার সফলভাবে যোগ হয়েছে!",
      );

      await loadBanners();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "ব্যানার সংরক্ষণ করা যায়নি।",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================================================
  // TOGGLE STATUS
  // ===================================================

  const toggleStatus = async (id: string) => {
    const banner = banners.find((item) => item.id === id);

    if (!banner) {
      toast.error("ব্যানারটি খুঁজে পাওয়া যায়নি।");
      return;
    }

    try {
      const token = await getAccessToken();

      const nextStatus: BannerStatus =
        banner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const response = await fetch(`${API_URL}/api/banners/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "ব্যানারের স্ট্যাটাস পরিবর্তন করা যায়নি।",
          ),
        );
      }

      const result = await response.json();

      if (result?.success === false) {
        throw new Error(
          result?.message ||
            result?.error ||
            "ব্যানারের স্ট্যাটাস পরিবর্তন করা যায়নি।",
        );
      }

      toast.success(
        nextStatus === "ACTIVE"
          ? "ব্যানার সক্রিয় করা হয়েছে!"
          : "ব্যানার নিষ্ক্রিয় করা হয়েছে!",
      );

      await loadBanners();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ব্যানারের স্ট্যাটাস পরিবর্তন করা যায়নি।",
      );
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const deleteBanner = async (banner: Banner) => {
    try {
      const token = await getAccessToken();

      const response = await fetch(`${API_URL}/api/banners/${banner.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, "ব্যানার ডিলিট করা যায়নি।"),
        );
      }

      const result = await response.json();

      if (result?.success === false) {
        throw new Error(
          result?.message || result?.error || "ব্যানার ডিলিট করা যায়নি।",
        );
      }

      toast.success("ব্যানার সফলভাবে ডিলিট হয়েছে!");

      await loadBanners();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "ব্যানার ডিলিট করা যায়নি।",
      );
    }
  };

  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDate = (date: string) => {
    if (!date) return "নির্ধারিত নয়";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ===================================================
  // STATUS UI
  // ===================================================

  const renderStatus = (status: BannerStatus) =>
    status === "ACTIVE" ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
        <XCircle size={13} />
        Inactive
      </span>
    );

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8">
      <div className="mb-7">
        <Link
          href="/admin/marketing"
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Back to Marketing
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <ImageIcon size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#12233F]">
                Homepage Banners
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create and manage advertisements across your website sections.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
          >
            <Plus size={18} />
            Add Banner
          </button>
        </div>
      </div>

      {/* OVERVIEW */}

      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#12233F]">Banner Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Overview of all promotional banners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total Banners"
            value={banners.length}
            icon={ImageIcon}
            variant="blue"
            description="Total banners created"
          />

          <AdminStatCard
            label="Active Banners"
            value={activeCount}
            icon={CheckCircle2}
            variant="green"
            description="Currently enabled banners"
          />

          <AdminStatCard
            label="Inactive Banners"
            value={inactiveCount}
            icon={XCircle}
            variant="orange"
            description="Currently disabled banners"
          />

          <AdminStatCard
            label="Showing"
            value={filteredBanners.length}
            icon={Search}
            variant="purple"
            description="Banners matching your filters"
          />
        </div>
      </section>

      {/* ALL BANNERS */}

      <section>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#12233F]">
                  All Banners
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select a website section for each banner and control its
                  status.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="relative sm:col-span-1">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search banner..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <select
                  value={placementFilter}
                  onChange={(event) => setPlacementFilter(event.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Sections</option>
                  {PLACEMENTS.map((placement) => (
                    <option key={placement.value} value={placement.value}>
                      {placement.label}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-sm font-semibold text-slate-500">
                Loading banners...
              </div>
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ImageIcon size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-[#12233F]">
                {banners.length === 0
                  ? "No banners created yet"
                  : "No banners found"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {banners.length === 0
                  ? "Create your first banner and choose where it should appear on the website."
                  : "Try changing your search or filters."}
              </p>

              {banners.length === 0 && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
                >
                  <Plus size={17} />
                  Add Banner
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Banner
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Website Section
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Schedule
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredBanners.map((banner) => (
                      <tr
                        key={banner.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-[58px] w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                              <img
                                src={banner.image}
                                alt={banner.name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#12233F]">
                                {banner.name}
                              </p>
                              <p className="mt-1 max-w-[250px] truncate text-xs text-slate-400">
                                {banner.link || "No destination link"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                            {placementLabel(banner.placement)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock3 size={14} />
                            {banner.startDate || banner.endDate
                              ? `${formatDate(banner.startDate)} – ${formatDate(banner.endDate)}`
                              : "Always"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {renderStatus(banner.status)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void toggleStatus(banner.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                              title="Toggle status"
                            >
                              {banner.status === "ACTIVE" ? (
                                <ToggleRight
                                  size={16}
                                  className="text-emerald-600"
                                />
                              ) : (
                                <ToggleLeft size={16} />
                              )}
                              {banner.status === "ACTIVE"
                                ? "Disable"
                                : "Enable"}
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(banner)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setBannerToDelete(banner)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}

              <div className="space-y-3 p-4 md:hidden">
                {filteredBanners.map((banner) => (
                  <div
                    key={banner.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={banner.image}
                        alt={banner.name}
                        className="h-[72px] w-28 shrink-0 rounded-lg border border-slate-200 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-[#12233F]">
                          {banner.name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {banner.link || "No destination link"}
                        </p>
                        <div className="mt-2">
                          {renderStatus(banner.status)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <div className="text-xs text-slate-500">
                        <p className="font-semibold text-slate-700">
                          {placementLabel(banner.placement)}
                        </p>
                        <p className="mt-1">
                          {banner.startDate || banner.endDate
                            ? `${formatDate(banner.startDate)} – ${formatDate(banner.endDate)}`
                            : "Always"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void toggleStatus(banner.id)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600"
                          aria-label="Toggle banner status"
                        >
                          {banner.status === "ACTIVE" ? (
                            <ToggleRight
                              size={17}
                              className="text-emerald-600"
                            />
                          ) : (
                            <ToggleLeft size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(banner)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600"
                          aria-label="Edit banner"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setBannerToDelete(banner)}
                          className="rounded-lg bg-red-50 p-2 text-red-600"
                          aria-label="Delete banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#12233F]">
                  {editingId ? "Edit Banner" : "Add New Banner"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Set the image and choose its website placement.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* NAME */}

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Banner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Eid Mega Sale"
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* PLACEMENT */}

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Website Section <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.placement}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        placement: event.target.value as BannerPlacement,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  >
                    {PLACEMENTS.map((placement) => (
                      <option key={placement.value} value={placement.value}>
                        {placement.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {
                      PLACEMENTS.find((item) => item.value === form.placement)
                        ?.description
                    }
                  </p>
                </div>

                {/* IMAGE */}

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Banner Image <span className="text-red-500">*</span>
                  </label>

                  <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-amber-400 hover:bg-amber-50/40">
                    {form.image ? (
                      <div className="relative w-full p-2">
                        <img
                          src={form.image}
                          alt="Banner preview"
                          className="max-h-48 w-full rounded-lg object-contain"
                        />
                        <span className="mt-2 block text-xs font-medium text-slate-500">
                          {isUploadingImage
                            ? "Uploading image..."
                            : imageName || "Current banner image"}
                          {!isUploadingImage && " · Click to change"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center px-4 py-7">
                        <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-600 shadow-sm">
                          <UploadCloud size={21} />
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          Click to upload banner image
                        </span>
                        <span className="mt-1 text-xs text-slate-400">
                          PNG, JPG, WEBP
                        </span>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploadingImage || isSubmitting}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* LINK */}

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Destination Link
                  </label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        link: event.target.value,
                      }))
                    }
                    placeholder="https://yourstore.com/offer (optional)"
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                {/* START DATE */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        startDate: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>

                {/* END DATE */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        endDate: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* STATUS */}

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Banner Status
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Enable this banner for its selected section.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      status:
                        current.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                    }))
                  }
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    form.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {form.status === "ACTIVE" ? (
                    <ToggleRight size={18} />
                  ) : (
                    <ToggleLeft size={18} />
                  )}
                  {form.status === "ACTIVE" ? "Active" : "Inactive"}
                </button>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting || isUploadingImage}
                  className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={17} />
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={Boolean(bannerToDelete)}
        onClose={() => setBannerToDelete(null)}
        onConfirm={async () => {
          if (bannerToDelete) {
            await deleteBanner(bannerToDelete);
            setBannerToDelete(null);
          }
        }}
        isLoading={Boolean(deletingId)}
        title="ব্যানার মুছে ফেলতে চান?"
        description={`আপনি কি নিশ্চিতভাবে "${bannerToDelete?.name}" ব্যানারটি ডিলিট করতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
      />
    </div>
  );
}
