"use client";


import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/common/ConfirmModal";
import type { ReactNode, FormEvent } from "react";
import {
  X,
  Package,
  Pencil,
  Tag,
  Boxes,
  Barcode,
  CalendarDays,
  ExternalLink,
  TicketPercent,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { createClient } from "../../../../../../lib/supabase-client";

const supabase = createClient();

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/+$/, "");

export type ProductCoupon = {
  id: string;
  productId: string;
  couponName: string;
  discount: number | string;
  isActive: boolean;
};

export type ProductDetails = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  price: number | null;
  stock: number;
  status: "ACTIVE" | "OUT_OF_STOCK";
  image?: string;
  description?: string | null;
  shortDescription?: string | null;
  images?: string[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  coupon?: ProductCoupon | null;
};

type ProductDetailsSidebarProps = {
  product: ProductDetails | null;
  onClose: () => void;
  onEdit: (product: ProductDetails) => void;
  onCouponChange?: (productId: string, coupon: ProductCoupon | null) => void;
};

type CouponForm = {
  couponName: string;
  discount: string;
};

function formatDate(value?: string | null): string {
  if (!value) return "তথ্য নেই";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "তথ্য নেই";

  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number | null): string {
  if (price === null || !Number.isFinite(price)) {
    return "দাম দেওয়া নেই";
  }

  return `৳${price.toLocaleString("en-BD")}`;
}

function getValidImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return `${API_BASE_URL}${trimmed}`;
  }
  return `${API_BASE_URL}/${trimmed}`;
}

function getErrorMessage(data: any, fallback: string): string {
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  return fallback;
}

function getCouponFromResponse(data: any): ProductCoupon | null {
  const candidates = [
    data?.data?.coupon,
    data?.data,
    data?.coupon,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate.id === "string" &&
      typeof candidate.couponName === "string"
    ) {
      return candidate as ProductCoupon;
    }
  }

  return null;
}

export default function ProductDetailsSidebar({
  product,
  onClose,
  onEdit,
  onCouponChange,
}: ProductDetailsSidebarProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<ProductCoupon | null>(null);
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(false);
  const [isDeleteCouponModalOpen, setIsDeleteCouponModalOpen] = useState(false);

  const [couponForm, setCouponForm] = useState<CouponForm>({
    couponName: "",
    discount: "",
  });

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  useEffect(() => {
    setSelectedImage(null);
    setCoupon(product?.coupon ?? null);
    setCouponError("");
    setCouponMessage("");
    setShowCouponForm(false);
    setEditingCoupon(false);
    setCouponForm({
      couponName: "",
      discount: "",
    });

    if (product?.id) {
      (async () => {
        try {
          const token = await getAccessToken();
          const res = await fetch(`${API_BASE_URL}/api/vendors/me/products/${product.id}/coupon`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json().catch(() => null);
          if (res.ok) {
            const fetched = getCouponFromResponse(data);
            if (fetched) {
              setCoupon(fetched);
            }
          }
        } catch {
          // Ignore silent fallback
        }
      })();
    }
  }, [product?.id, product?.coupon]);

  if (!product) return null;

  const rawImages = Array.isArray(product.images)
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const images: string[] = rawImages
    .map((img: any) => (typeof img === "string" ? img : img?.url))
    .filter((img: unknown): img is string => typeof img === "string" && img.trim().length > 0);

  if (images.length === 0 && product.image && typeof product.image === "string" && product.image.trim().length > 0) {
    images.push(product.image.trim());
  }

  const handleEdit = () => {
    if (!product.slug?.trim()) {
      toast.info("এই প্রোডাক্টের slug পাওয়া যায়নি।");
      return;
    }

    onEdit(product);
  };

  async function getAccessToken(): Promise<string> {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session?.access_token) {
      throw new Error("প্রথমে লগইন করো।");
    }

    return session.access_token;
  }

  async function sendCouponRequest(
    url: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body?: Record<string, unknown>,
  ): Promise<any> {
    const token = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(
          data,
          `Coupon operation ব্যর্থ হয়েছে। HTTP ${response.status}`,
        ),
      );
    }

    return data;
  }

  function openAddCouponForm() {
    setCouponError("");
    setCouponMessage("");
    setEditingCoupon(false);
    setCouponForm({
      couponName: "",
      discount: "",
    });
    setShowCouponForm(true);
  }

  function openEditCouponForm() {
    if (!coupon) return;

    setCouponError("");
    setCouponMessage("");
    setEditingCoupon(true);
    setCouponForm({
      couponName: coupon.couponName,
      discount: String(coupon.discount),
    });
    setShowCouponForm(true);
  }

  async function handleCouponSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!product) return;

    const couponName = couponForm.couponName.trim().toUpperCase();
    const discount = Number(couponForm.discount);

    if (!couponName) {
      setCouponError("কুপনের নাম লিখতে হবে।");
      return;
    }

    if (!Number.isFinite(discount) || discount <= 0) {
      setCouponError("ডিসকাউন্ট শূন্যের চেয়ে বেশি হতে হবে।");
      return;
    }

    setCouponSaving(true);
    setCouponError("");
    setCouponMessage("");

    try {
      let data: any;

      if (editingCoupon && coupon) {
        // Edit: productId দিয়ে PUT request
        data = await sendCouponRequest(
          `/api/vendors/me/products/${product.id}/coupon`,
          "PUT",
          {
            couponName,
            discount,
          },
        );
      } else {
        // Add: productId দিয়ে POST request
        data = await sendCouponRequest(
          `/api/vendors/me/products/${product.id}/coupon`,
          "POST",
          {
            couponName,
            discount,
            isActive: true,
          },
        );
      }

      const savedCoupon = getCouponFromResponse(data);

      if (!savedCoupon) {
        throw new Error(
          "API response-এ কুপনের তথ্য পাওয়া যায়নি। Backend response যাচাই করো।",
        );
      }

      setCoupon(savedCoupon);
      setShowCouponForm(false);
      setEditingCoupon(false);
      setCouponMessage(
        editingCoupon
          ? "কুপন সফলভাবে আপডেট হয়েছে।"
          : "কুপন সফলভাবে যোগ হয়েছে।",
      );

      onCouponChange?.(product.id, savedCoupon);
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : "কুপন সংরক্ষণ করা যায়নি।";
      if (errMsg.includes("already has a coupon") || errMsg.includes("exist")) {
        try {
          const token = await getAccessToken();
          const res = await fetch(`${API_BASE_URL}/api/vendors/me/products/${product.id}/coupon`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json().catch(() => null);
          const existingCoupon = getCouponFromResponse(data);
          if (existingCoupon) {
            setCoupon(existingCoupon);
            setShowCouponForm(false);
            setEditingCoupon(false);
            setCouponMessage("বিদ্যমান কুপনটি লোড করা হয়েছে। আপনি চাইলে এডিট করতে পারেন।");
            return;
          }
        } catch {}
      }
      setCouponError(errMsg);
    } finally {
      setCouponSaving(false);
    }
  }

  async function handleCouponToggle() {
    if (!product || !coupon || couponSaving) return;

    const nextStatus = !coupon.isActive;

    setCouponSaving(true);
    setCouponError("");
    setCouponMessage("");

    try {
      const data = await sendCouponRequest(
        `/api/vendors/me/products/${product.id}/coupon/status`,
        "PATCH",
        { isActive: nextStatus },
      );

      const updatedCoupon = getCouponFromResponse(data);

      setCoupon(
        updatedCoupon ?? {
          ...coupon,
          isActive: nextStatus,
        },
      );

      setCouponMessage(
        nextStatus
          ? "কুপন চালু করা হয়েছে।"
          : "কুপন বন্ধ করা হয়েছে।",
      );

      onCouponChange?.(product.id, updatedCoupon ?? { ...coupon, isActive: nextStatus });
    } catch (error) {
      setCouponError(
        error instanceof Error
          ? error.message
          : "কুপনের স্ট্যাটাস পরিবর্তন করা যায়নি।",
      );
    } finally {
      setCouponSaving(false);
    }
  }

  async function handleCouponDelete() {
    if (!product || !coupon || couponSaving) return;

    // window.confirm removed

    setCouponSaving(true);
    setCouponError("");
    setCouponMessage("");

    try {
      await sendCouponRequest(
        `/api/vendors/me/products/${product.id}/coupon`,
        "DELETE",
      );

      setCoupon(null);
      setShowCouponForm(false);
      setEditingCoupon(false);
      setCouponMessage("কুপন মুছে ফেলা হয়েছে।");

      onCouponChange?.(product.id, null);
    } catch (error) {
      setCouponError(
        error instanceof Error
          ? error.message
          : "কুপন মুছে ফেলা যায়নি।",
      );
    } finally {
      setCouponSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="বিস্তারিত বন্ধ করুন"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2
              id="product-details-title"
              className="text-lg font-bold text-[#12233F]"
            >
              Product Details
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              প্রোডাক্টের সম্পূর্ণ তথ্য দেখো
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#12233F]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {images.length > 0 ? (
              <img
                src={getValidImageUrl(selectedImage || images[0])}
                alt={product.name}
                className="h-56 w-full object-contain p-4"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.3";
                }}
              />
            ) : (
              <div className="flex h-56 flex-col items-center justify-center gap-2 text-slate-300">
                <Package size={56} strokeWidth={1.2} />
                <span className="text-xs text-slate-400">ছবি দেওয়া হয়নি</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 break-words text-xl font-bold text-[#12233F]">
                {product.name}
              </h3>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  product.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {product.status === "ACTIVE"
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

            <p className="mt-2 break-all text-xs text-slate-500">
              Product Slug: {product.slug || "Slug পাওয়া যায়নি"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#12233F] p-4 text-white">
            <p className="text-xs text-slate-300">বর্তমান দাম</p>
            <p className="mt-1 text-3xl font-bold">
              {formatPrice(product.price)}
            </p>
          </div>

          <section className="space-y-1">
            <h4 className="mb-3 text-sm font-bold text-[#12233F]">
              Basic Information
            </h4>

            <InfoRow
              icon={<Barcode size={17} />}
              label="SKU"
              value={product.sku || "তথ্য নেই"}
            />
            <InfoRow
              icon={<Tag size={17} />}
              label="Category"
              value={product.category || "Uncategorized"}
            />
            <InfoRow
              icon={<Boxes size={17} />}
              label="Stock Quantity"
              value={`${product.stock ?? 0} units`}
            />
            <InfoRow
              icon={<ExternalLink size={17} />}
              label="Slug"
              value={product.slug || "তথ্য নেই"}
            />
          </section>

          <section>
            <h4 className="mb-2 text-sm font-bold text-[#12233F]">
              Description
            </h4>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                {product.description ||
                  product.shortDescription ||
                  "এই প্রোডাক্টের বিবরণ দেওয়া নেই।"}
              </p>
            </div>
          </section>

          {images.length > 1 && (
            <section>
              <h4 className="mb-3 text-sm font-bold text-[#12233F]">
                Product Images
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {images.map((image, index) => {
                  const isCurrent = (selectedImage || images[0]) === image;
                  return (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImage(image)}
                      className={`overflow-hidden rounded-xl border p-0 transition ${
                        isCurrent
                          ? "border-[#12233F] ring-2 ring-[#12233F]/20"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      <img
                        src={getValidImageUrl(image)}
                        alt={`${product.name} ${index + 1}`}
                        className="h-24 w-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLElement).style.opacity = "0.3";
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Coupon Management */}
          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#D6A419]/10 p-2.5 text-[#12233F]">
                  <TicketPercent size={20} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#12233F]">
                    Coupon Management
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    এই প্রোডাক্টের কুপন যোগ ও পরিচালনা করো।
                  </p>
                </div>
              </div>

              {coupon && (
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    coupon.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              )}
            </div>

            <div className="space-y-4 p-4">
              {couponError && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700"
                >
                  {couponError}
                </p>
              )}

              {couponMessage && (
                <p
                  role="status"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs leading-5 text-emerald-700"
                >
                  {couponMessage}
                </p>
              )}

              {!coupon && !showCouponForm && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                  <TicketPercent
                    size={28}
                    className="mx-auto text-slate-400"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    এখনো কোনো কুপন নেই
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    প্রোডাক্ট তৈরির পরে এখান থেকে কুপন যোগ করতে পারবে।
                  </p>

                  <button
                    type="button"
                    onClick={openAddCouponForm}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1b3154]"
                  >
                    <Plus size={15} />
                    Add Coupon
                  </button>
                </div>
              )}

              {coupon && !showCouponForm && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Coupon Code
                    </p>
                    <p className="mt-1 break-all text-lg font-bold tracking-wide text-[#12233F]">
                      {coupon.couponName}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Discount Amount
                        </p>
                        <p className="mt-1 text-2xl font-bold text-emerald-700">
                          ৳
                          {Number(coupon.discount).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          coupon.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700">
                        Coupon Status
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {coupon.isActive
                          ? "কুপন চালু আছে"
                          : "কুপন বন্ধ আছে"}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={coupon.isActive}
                      aria-label="Coupon Active বা Inactive করুন"
                      disabled={couponSaving}
                      onClick={handleCouponToggle}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        coupon.isActive
                          ? "bg-emerald-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                          coupon.isActive ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={couponSaving}
                      onClick={openEditCouponForm}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Pencil size={14} />
                      Edit Coupon
                    </button>

                    <button
                      type="button"
                      disabled={couponSaving}
                      onClick={() => setIsDeleteCouponModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {couponSaving ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete Coupon
                    </button>
                  </div>
                </div>
              )}

              {showCouponForm && (
                <form
                  onSubmit={handleCouponSubmit}
                  className="space-y-4 rounded-xl border border-[#D6A419]/40 bg-[#D6A419]/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h5 className="text-sm font-bold text-[#12233F]">
                      {editingCoupon ? "Edit Coupon" : "Add Coupon"}
                    </h5>

                    <button
                      type="button"
                      disabled={couponSaving}
                      onClick={() => {
                        setShowCouponForm(false);
                        setCouponError("");
                      }}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-white"
                      aria-label="ফর্ম বন্ধ করুন"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="sidebar-coupon-name"
                      className="mb-2 block text-xs font-semibold text-slate-700"
                    >
                      Coupon Name
                    </label>
                    <input
                      id="sidebar-coupon-name"
                      type="text"
                      value={couponForm.couponName}
                      onChange={(event) =>
                        setCouponForm((prev) => ({
                          ...prev,
                          couponName: event.target.value
                            .toUpperCase()
                            .replace(/\s+/g, ""),
                        }))
                      }
                      placeholder="যেমন: SAVE50"
                      maxLength={40}
                      required
                      disabled={couponSaving}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#D6A419] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sidebar-coupon-discount"
                      className="mb-2 block text-xs font-semibold text-slate-700"
                    >
                      Discount Amount (৳)
                    </label>
                    <input
                      id="sidebar-coupon-discount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={couponForm.discount}
                      onChange={(event) =>
                        setCouponForm((prev) => ({
                          ...prev,
                          discount: event.target.value,
                        }))
                      }
                      placeholder="যেমন: 50"
                      required
                      disabled={couponSaving}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-[#D6A419] disabled:opacity-50"
                    />
                    <p className="mt-2 text-[11px] text-slate-500">
                      এই ফর্মে নির্দিষ্ট টাকার ছাড় দেওয়া হচ্ছে, শতাংশ নয়।
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={couponSaving}
                      onClick={() => {
                        setShowCouponForm(false);
                        setCouponError("");
                      }}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={couponSaving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#1b3154] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {couponSaving ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Save size={15} />
                      )}
                      {couponSaving ? "Saving..." : "Save Coupon"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          <section className="space-y-1">
            <h4 className="mb-3 text-sm font-bold text-[#12233F]">
              Product History
            </h4>
            <InfoRow
              icon={<CalendarDays size={17} />}
              label="Created"
              value={formatDate(product.createdAt)}
            />
            <InfoRow
              icon={<CalendarDays size={17} />}
              label="Last Updated"
              value={formatDate(product.updatedAt)}
            />
          </section>
        </div>

        <div className="flex gap-3 border-t border-slate-200 bg-white p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3154]"
          >
            <Pencil size={16} />
            Edit Product
          </button>
        </div>

      <ConfirmModal
        isOpen={isDeleteCouponModalOpen}
        onClose={() => setIsDeleteCouponModalOpen(false)}
        onConfirm={async () => {
          await handleCouponDelete();
          setIsDeleteCouponModalOpen(false);
          toast.success("কুপন সফলভাবে মুছে ফেলা হয়েছে!");
        }}
        isLoading={couponSaving}
        title="কুপন মুছে ফেলতে চান?"
        description={`আপনি কি নিশ্চিতভাবে "${coupon?.couponName}" কুপনটি মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, মুছে ফেলুন"
        cancelText="বাতিল"
        variant="danger"
      />
      </aside>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-0">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <span className="w-28 shrink-0 text-xs text-slate-500">
        {label}
      </span>
      <span className="min-w-0 flex-1 break-words text-right text-sm font-medium text-[#12233F]">
        {value}
      </span>
    </div>
  );
}
