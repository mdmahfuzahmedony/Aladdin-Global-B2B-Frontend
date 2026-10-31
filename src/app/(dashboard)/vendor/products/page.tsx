"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Store,
  Boxes,
  ShoppingBag,
  Star,
  TrendingUp,
  X,
  Loader2,
  Pencil,
  Tag,
  Barcode,
  CalendarDays,
  ExternalLink,
  Eye,
  TicketPercent,
  Save,
  Power,
} from "lucide-react";

import AdminStatCard from "@/components/cards/AdminStatCard";
import ConfirmModal from "@/components/common/ConfirmModal";
import { toast } from "react-toastify";
import { createClient } from "../../../../../lib/supabase-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const ADD_PRODUCT_PATH = "/vendor/products/add-product";

type ProductStatus = "ACTIVE" | "OUT_OF_STOCK";
type DeleteMode = "single" | "bulk";

type Category = {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
};

type ProductCoupon = {
  id: string;
  productId: string;
  couponName: string;
  discount: number | string;
  isActive: boolean;
};

type ApiPricing = {
  price?: string | number | null;
  regularPrice?: string | number | null;
  salePrice?: string | number | null;
  sellingPrice?: string | number | null;
  basePrice?: string | number | null;
  finalPrice?: string | number | null;
  customerRegularPrice?: string | number | null;
  customerSalePrice?: string | number | null;
};

type ApiProduct = {
  id: string;
  title?: string | null;
  name?: string | null;
  sku?: string | null;
  slug?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  stockQuantity?: number | string | null;
  category?: Category | null;
  categoryId?: string | null;
  pricing?: ApiPricing | null;
  price?: number | string | null;
  regularPrice?: number | string | null;
  salePrice?: number | string | null;
  sellingPrice?: number | string | null;
  images?: string[] | null;
  image?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  coupon?: ProductCoupon | null;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryId?: string | null;
  price: number | null;
  stock: number;
  status: ProductStatus;
  image?: string;
  images: string[];
  slug?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  coupon?: ProductCoupon | null;
};

type VendorInfo = {
  storeName: string;
  status: string;
  rating?: number | null;
  totalReviews?: number | null;
  totalSales?: number | null;
};

function formatMoney(amount?: number | null): string {
  if (amount == null || !Number.isFinite(amount)) return "৳0";
  return `৳${Number(amount).toLocaleString("en-BD")}`;
}

function getProductPrice(product: ApiProduct): number | null {
  const pricing = product.pricing;

  const value =
    pricing?.customerSalePrice ??
    pricing?.salePrice ??
    pricing?.finalPrice ??
    pricing?.sellingPrice ??
    pricing?.price ??
    pricing?.customerRegularPrice ??
    pricing?.regularPrice ??
    pricing?.basePrice ??
    product.sellingPrice ??
    product.salePrice ??
    product.price ??
    product.regularPrice;

  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    if ("error" in data && typeof data.error === "string") {
      return data.error;
    }

    if ("message" in data && typeof data.message === "string") {
      return data.message;
    }
  }

  return fallback;
}

function getCategoryList(data: unknown): Category[] {
  if (Array.isArray(data)) return data as Category[];
  if (!data || typeof data !== "object") return [];

  const response = data as {
    categories?: Category[];
    data?: Category[] | { categories?: Category[] };
  };

  if (Array.isArray(response.categories)) return response.categories;
  if (Array.isArray(response.data)) return response.data;

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.categories)
  ) {
    return response.data.categories;
  }

  return [];
}

function getProductList(data: unknown): ApiProduct[] {
  if (Array.isArray(data)) return data as ApiProduct[];
  if (!data || typeof data !== "object") return [];

  const response = data as {
    products?: ApiProduct[];
    data?: ApiProduct[] | { products?: ApiProduct[] };
  };

  if (Array.isArray(response.products)) return response.products;
  if (Array.isArray(response.data)) return response.data;

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.products)
  ) {
    return response.data.products;
  }

  return [];
}

function getCouponFromResponse(data: any): ProductCoupon | null {
  const coupon = data?.data?.coupon ?? data?.data ?? data?.coupon;

  if (
    coupon &&
    typeof coupon.id === "string" &&
    typeof coupon.couponName === "string"
  ) {
    return coupon as ProductCoupon;
  }

  return null;
}

function formatPrice(price: number | null): string {
  if (price === null || !Number.isFinite(price)) {
    return "দাম দেওয়া নেই";
  }

  return `৳${price.toLocaleString("en-BD")}`;
}

function formatDate(value?: string | null): string {
  if (!value) return "তথ্য পাওয়া যায়নি";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "তথ্য পাওয়া যায়নি";

  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {active ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
      {active ? "In Stock" : "Out of Stock"}
    </span>
  );
}

function ProductImage({ name, image }: { name: string; image?: string }) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <div
        title={name}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400"
      >
        <Package size={19} />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-xl border border-slate-100 bg-white object-cover"
    />
  );
}

function DetailRow({
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
      <span className="w-24 shrink-0 text-[11.5px] text-slate-500">
        {label}
      </span>
      <span className="min-w-0 flex-1 break-words text-right text-[12px] font-semibold text-[#12233F]">
        {value}
      </span>
    </div>
  );
}

/* =========================
   PRODUCT DETAILS + COUPON
========================= */

function ProductDetailsSidebar({
  product,
  onClose,
  onEdit,
  onCouponChange,
}: {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onCouponChange: (productId: string, coupon: ProductCoupon | null) => void;
}) {
  const [coupon, setCoupon] = useState<ProductCoupon | null>(null);
  const [couponName, setCouponName] = useState("");
  const [discount, setDiscount] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [isDeleteCouponModalOpen, setIsDeleteCouponModalOpen] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [showCouponForm, setShowCouponForm] = useState(false);

  useEffect(() => {
    if (!product) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  useEffect(() => {
    document.body.style.overflow = product ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  useEffect(() => {
    setCoupon(product?.coupon ?? null);
    setCouponName(product?.coupon?.couponName ?? "");
    setDiscount(product?.coupon ? String(product.coupon.discount) : "");
    setCouponError("");
    setCouponMessage("");
    setShowCouponForm(false);
  }, [product?.id, product?.coupon]);

  if (!product) return null;

  const images = product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  async function getToken(): Promise<string> {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    if (!session?.access_token) {
      throw new Error("সেশন পাওয়া যায়নি। আবার লগইন করো।");
    }

    return session.access_token;
  }

  async function couponRequest(
    path: string,
    method: "POST" | "PUT" | "PATCH" | "DELETE",
    body?: Record<string, unknown>,
  ) {
    const token = await getToken();

    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        getErrorMessage(
          result,
          `Coupon request ব্যর্থ হয়েছে (HTTP ${response.status})`,
        ),
      );
    }

    return result;
  }

  function startAddCoupon() {
    setCouponName("");
    setDiscount("");
    setCouponError("");
    setCouponMessage("");
    setShowCouponForm(true);
  }

  function startEditCoupon() {
    if (!coupon) return;

    setCouponName(coupon.couponName);
    setDiscount(String(coupon.discount));
    setCouponError("");
    setCouponMessage("");
    setShowCouponForm(true);
  }

  async function saveCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product || couponLoading) return;

    const name = couponName.trim().toUpperCase();
    const amount = Number(discount);

    if (!name) {
      setCouponError("কুপনের নাম লিখতে হবে।");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setCouponError("ডিসকাউন্ট শূন্যের চেয়ে বেশি হতে হবে।");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setCouponMessage("");

    try {
      const result = await couponRequest(
        `/api/vendors/me/products/${product.id}/coupon`,
        coupon ? "PUT" : "POST",
        {
          couponName: name,
          discount: amount,
          ...(!coupon ? { isActive: true } : {}),
        },
      );

      const savedCoupon = getCouponFromResponse(result);

      if (!savedCoupon) {
        throw new Error(
          "সার্ভার কুপন সংরক্ষণের নিশ্চিত তথ্য দেয়নি। Backend response যাচাই করো।",
        );
      }

      setCoupon(savedCoupon);
      setCouponName(savedCoupon.couponName);
      setDiscount(String(savedCoupon.discount));
      setShowCouponForm(false);
      setCouponMessage(coupon ? "কুপন আপডেট হয়েছে।" : "কুপন যোগ হয়েছে।");

      onCouponChange(product.id, savedCoupon);
    } catch (error) {
      setCouponError(
        error instanceof Error ? error.message : "কুপন সংরক্ষণ করা যায়নি।",
      );
    } finally {
      setCouponLoading(false);
    }
  }

  async function toggleCoupon() {
    if (!product || !coupon || couponLoading) return;

    const nextStatus = !coupon.isActive;
    setCouponLoading(true);
    setCouponError("");
    setCouponMessage("");

    try {
      const result = await couponRequest(
        `/api/vendors/me/products/${product.id}/coupon/status`,
        "PATCH",
        { isActive: nextStatus },
      );

      const updatedCoupon = getCouponFromResponse(result);
      const nextCoupon = updatedCoupon ?? {
        ...coupon,
        isActive: nextStatus,
      };

      setCoupon(nextCoupon);
      onCouponChange(product.id, nextCoupon);
      setCouponMessage(
        nextStatus ? "কুপন চালু করা হয়েছে।" : "কুপন বন্ধ করা হয়েছে।",
      );
    } catch (error) {
      setCouponError(
        error instanceof Error
          ? error.message
          : "কুপনের স্ট্যাটাস বদলানো যায়নি।",
      );
    } finally {
      setCouponLoading(false);
    }
  }

  async function removeCoupon() {
    if (!product || !coupon || couponLoading) return;

    // window.confirm removed

    setCouponLoading(true);
    setCouponError("");
    setCouponMessage("");

    try {
      await couponRequest(
        `/api/vendors/me/products/${product.id}/coupon`,
        "DELETE",
      );

      setCoupon(null);
      setCouponName("");
      setDiscount("");
      setShowCouponForm(false);
      setCouponMessage("কুপন ডিলিট হয়েছে।");
      onCouponChange(product.id, null);
    } catch (error) {
      setCouponError(
        error instanceof Error ? error.message : "কুপন ডিলিট করা যায়নি।",
      );
    } finally {
      setCouponLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close product details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="product-details-title"
              className="text-[15px] font-bold text-[#12233F]"
            >
              Product Details
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              প্রোডাক্টের বিস্তারিত তথ্য
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {images.length > 0 ? (
              <img
                src={images[0]}
                alt={product.name}
                className="h-48 w-full object-contain p-4"
              />
            ) : (
              <div className="flex h-48 items-center justify-center text-slate-300">
                <Package size={54} strokeWidth={1.2} />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="h-16 w-full object-contain p-1.5"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 break-words text-[16px] font-bold text-[#12233F]">
                {product.name}
              </h3>
              <ProductStatusBadge status={product.status} />
            </div>
            <p className="mt-2 break-all text-[10.5px] text-slate-400">
              ID: {product.id}
            </p>
          </div>

          <div className="rounded-xl bg-[#12233F] p-4 text-white">
            <p className="text-[11px] text-slate-300">Current Price</p>
            <p className="mt-1 text-2xl font-bold">
              {formatPrice(product.price)}
            </p>
          </div>

          <section>
            <h4 className="mb-1 text-[12.5px] font-bold text-[#12233F]">
              Basic Information
            </h4>
            <DetailRow
              icon={<Barcode size={15} />}
              label="SKU"
              value={product.sku || "তথ্য নেই"}
            />
            <DetailRow
              icon={<Tag size={15} />}
              label="Category"
              value={product.category || "Uncategorized"}
            />
            <DetailRow
              icon={<Boxes size={15} />}
              label="Stock"
              value={`${product.stock} units`}
            />
            {product.slug && (
              <DetailRow
                icon={<ExternalLink size={15} />}
                label="Slug"
                value={product.slug}
              />
            )}
          </section>

          <section>
            <h4 className="mb-2 text-[12.5px] font-bold text-[#12233F]">
              Description
            </h4>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="whitespace-pre-wrap break-words text-[12px] leading-5 text-slate-600">
                {product.description ||
                  product.shortDescription ||
                  "এই প্রোডাক্টের বিবরণ API থেকে পাওয়া যায়নি।"}
              </p>
            </div>
          </section>

          {/* COUPON MANAGEMENT */}
          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <div className="rounded-xl bg-amber-50 p-2.5 text-[#12233F]">
                <TicketPercent size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#12233F]">
                  Coupon Management
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  এই প্রোডাক্টের কুপন পরিচালনা করো।
                </p>
              </div>
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

              {coupon && !showCouponForm && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500">Coupon Code</p>
                      <p className="mt-1 break-all text-lg font-bold text-[#12233F]">
                        {coupon.couponName}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        coupon.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">Discount Amount</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    ৳{Number(coupon.discount).toLocaleString("en-BD")}
                  </p>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={coupon.isActive}
                    disabled={couponLoading}
                    onClick={toggleCoupon}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold disabled:opacity-50 ${
                      coupon.isActive
                        ? "bg-amber-50 text-amber-800"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {couponLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Power size={14} />
                    )}
                    {coupon.isActive ? "কুপন বন্ধ করো" : "কুপন চালু করো"}
                  </button>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={couponLoading}
                      onClick={startEditCoupon}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
                    >
                      <Pencil size={14} />
                      Edit Coupon
                    </button>
                    <button
                      type="button"
                      disabled={couponLoading}
                      onClick={() => setIsDeleteCouponModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                    >
                      {couponLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {!coupon && !showCouponForm && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                  <TicketPercent size={28} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    এখনো কোনো কুপন নেই
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    এই প্রোডাক্টের জন্য নতুন কুপন যোগ করো।
                  </p>
                  <button
                    type="button"
                    onClick={startAddCoupon}
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1b3154]"
                  >
                    <Plus size={15} />
                    Add Coupon
                  </button>
                </div>
              )}

              {showCouponForm && (
                <form
                  onSubmit={saveCoupon}
                  className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-[#12233F]">
                      {coupon ? "Edit Coupon" : "Add Coupon"}
                    </h5>
                    <button
                      type="button"
                      disabled={couponLoading}
                      onClick={() => {
                        setShowCouponForm(false);
                        setCouponError("");
                      }}
                      aria-label="Close coupon form"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-coupon-name"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Coupon Name
                    </label>
                    <input
                      id="vendor-coupon-name"
                      value={couponName}
                      onChange={(event) =>
                        setCouponName(
                          event.target.value.toUpperCase().replace(/\s+/g, ""),
                        )
                      }
                      placeholder="যেমন SAVE50"
                      maxLength={40}
                      required
                      disabled={couponLoading}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-coupon-discount"
                      className="mb-1.5 block text-xs font-semibold text-slate-700"
                    >
                      Discount Amount (৳)
                    </label>
                    <input
                      id="vendor-coupon-discount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={discount}
                      onChange={(event) => setDiscount(event.target.value)}
                      placeholder="যেমন 50"
                      required
                      disabled={couponLoading}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 disabled:opacity-50"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      এখানে নির্দিষ্ট টাকার ছাড় দেওয়া হচ্ছে, শতাংশ নয়।
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={couponLoading}
                      onClick={() => setShowCouponForm(false)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {couponLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      {couponLoading ? "Saving..." : "Save Coupon"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          <section>
            <h4 className="mb-1 text-[12.5px] font-bold text-[#12233F]">
              Product History
            </h4>
            <DetailRow
              icon={<CalendarDays size={15} />}
              label="Created"
              value={formatDate(product.createdAt)}
            />
            <DetailRow
              icon={<CalendarDays size={15} />}
              label="Updated"
              value={formatDate(product.updatedAt)}
            />
          </section>
        </div>

        <div className="flex gap-2.5 border-t border-slate-100 bg-white p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#1b3154]"
          >
            <Pencil size={14} />
            Edit Product
          </button>
        </div>

        <ConfirmModal
          isOpen={isDeleteCouponModalOpen}
          onClose={() => setIsDeleteCouponModalOpen(false)}
          onConfirm={async () => {
            await removeCoupon();
            setIsDeleteCouponModalOpen(false);
            toast.success("কুপন সফলভাবে ডিলিট হয়েছে!");
          }}
          isLoading={couponLoading}
          title="কুপন ডিলিট করবেন?"
          description={`আপনি কি নিশ্চিতভাবে "${coupon?.couponName}" কুপনটি ডিলিট করতে চান?`}
          confirmText="হ্যাঁ, ডিলিট করুন"
          cancelText="বাতিল"
          variant="danger"
        />
      </aside>
    </div>
  );
}

/* =========================
   VENDOR PRODUCTS PAGE
========================= */

export default function VendorProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProductStatus>(
    "ALL",
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const [deleteMode, setDeleteMode] = useState<DeleteMode>("single");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      };

      const [
        productsResponse,
        categoriesResponse,
        storeResponse,
        dashboardResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/api/vendors/me/products`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/categories`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/vendors/store/settings`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
        fetch(`${API_URL}/api/vendors/dashboard/overview`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
      ]);

      const [productsResult, categoriesResult, storeResult, dashboardResult] =
        await Promise.all([
          productsResponse.json().catch(() => null),
          categoriesResponse.json().catch(() => null),
          storeResponse.json().catch(() => null),
          dashboardResponse.json().catch(() => null),
        ]);

      if (!productsResponse.ok) {
        throw new Error(
          getErrorMessage(productsResult, "Vendor products load করা যায়নি।"),
        );
      }

      const apiProducts = getProductList(productsResult);

      const mappedProducts: Product[] = apiProducts
        .filter(
          (item) => item && typeof item.id === "string" && item.id.length > 0,
        )
        .map((item) => {
          const stock = Math.max(0, Number(item.stockQuantity ?? 0) || 0);

          const images = Array.isArray(item.images)
            ? item.images.filter(
                (image): image is string =>
                  typeof image === "string" && image.length > 0,
              )
            : typeof item.image === "string" && item.image
              ? [item.image]
              : [];

          return {
            id: item.id,
            name: item.title ?? item.name ?? "Untitled Product",
            sku: item.sku ?? "—",
            category: item.category?.name ?? "Uncategorized",
            categoryId: item.categoryId ?? item.category?.id ?? null,
            price: getProductPrice(item),
            stock,
            status: stock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
            image: images[0],
            images,
            slug: item.slug ?? null,
            description: item.description ?? null,
            shortDescription: item.shortDescription ?? null,
            createdAt: item.createdAt ?? null,
            updatedAt: item.updatedAt ?? null,
            coupon: item.coupon ?? null,
          };
        });

      setProducts(mappedProducts);
      setSelectedIds([]);

      setCategories(
        categoriesResponse.ok ? getCategoryList(categoriesResult) : [],
      );

      const dashboardData = dashboardResult?.data;
      const store =
        storeResult?.data ??
        storeResult?.vendor ??
        storeResult?.settings ??
        storeResult?.data?.vendor ??
        storeResult?.data?.settings ??
        storeResult;

      const rawRating =
        dashboardData?.storeRating ??
        store?.storeRating ??
        store?.rating ??
        (productsResult as any)?.storeRating ??
        (productsResult as any)?.rating ??
        null;
      const resolvedRating =
        rawRating != null && !Number.isNaN(Number(rawRating))
          ? Number(rawRating)
          : null;

      const rawReviews =
        dashboardData?.totalReviews ??
        store?.totalReviews ??
        (productsResult as any)?.totalReviews ??
        0;
      const resolvedReviews =
        rawReviews != null && !Number.isNaN(Number(rawReviews))
          ? Number(rawReviews)
          : 0;

      const resolvedSales =
        dashboardData?.monthlySales != null
          ? Number(dashboardData.monthlySales)
          : dashboardData?.todaySales != null
            ? Number(dashboardData.todaySales)
            : 0;

      const storeName =
        typeof store?.storeName === "string" ? store.storeName : "My Store";
      const status =
        typeof store?.status === "string" ? store.status : "APPROVED";

      setVendorInfo({
        storeName,
        status,
        rating: resolvedRating,
        totalReviews: resolvedReviews,
        totalSales: resolvedSales,
      });
    } catch (err) {
      console.error("Vendor products fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Products load করতে সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "ACTIVE",
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.status === "OUT_OF_STOCK",
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= 10,
  ).length;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchText = search.toLowerCase().trim();

      const searchMatch =
        product.name.toLowerCase().includes(searchText) ||
        product.sku.toLowerCase().includes(searchText);

      const categoryMatch =
        categoryFilter === "ALL" || product.category === categoryFilter;

      const statusMatch =
        statusFilter === "ALL" || product.status === statusFilter;

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => selectedIds.includes(product.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !filteredProducts.some((product) => product.id === id),
        ),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...filteredProducts.map((product) => product.id)]),
      ]);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  const openProductDetails = useCallback((product: Product) => {
    setViewProduct(product);
  }, []);

  const closeProductDetails = useCallback(() => {
    setViewProduct(null);
  }, []);

  const handleCouponChange = useCallback(
    (productId: string, coupon: ProductCoupon | null) => {
      setProducts((previous) =>
        previous.map((item) =>
          item.id === productId ? { ...item, coupon } : item,
        ),
      );

      setViewProduct((previous) =>
        previous?.id === productId ? { ...previous, coupon } : previous,
      );
    },
    [],
  );

  function handleEditProduct(product: Product) {
    setViewProduct(null);
    router.push(`/vendor/products/${encodeURIComponent(product.id)}/edit`);
  }

  function deleteProduct(product: Product) {
    setDeleteError("");
    setSuccessMessage("");
    setDeleteTarget(product);
    setDeleteMode("single");
  }

  function bulkDelete() {
    if (selectedIds.length === 0 || isDeleting) return;

    setDeleteError("");
    setSuccessMessage("");
    setDeleteTarget(null);
    setDeleteMode("bulk");
  }

  function closeDeleteModal() {
    if (isDeleting) return;

    setDeleteTarget(null);
    setDeleteMode("single");
  }

  async function confirmDelete() {
    if (isDeleting) return;

    const idsToDelete =
      deleteMode === "single"
        ? deleteTarget
          ? [deleteTarget.id]
          : []
        : [...selectedIds];

    if (idsToDelete.length === 0) {
      closeDeleteModal();
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");
      setSuccessMessage("");

      const supabase = createClient();
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const deletedIds: string[] = [];
      const failedProducts: { id: string; message: string }[] = [];

      for (const id of idsToDelete) {
        try {
          const response = await fetch(
            `${API_URL}/api/products/${encodeURIComponent(id)}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
                Accept: "application/json",
              },
            },
          );

          const result = await response.json().catch(() => null);

          if (!response.ok || result?.success === false) {
            let message =
              result?.error ||
              result?.message ||
              `পণ্য Delete করা যায়নি (HTTP ${response.status})`;

            if (response.status === 401) {
              message = "সেশন শেষ হয়েছে। আবার লগইন করো।";
            } else if (response.status === 403) {
              message = "এই পণ্য Delete করার অনুমতি তোমার নেই।";
            } else if (response.status === 404) {
              message = "পণ্যটি আর পাওয়া যাচ্ছে না।";
            } else if (response.status === 409) {
              message =
                result?.error ||
                "সম্পর্কিত রেকর্ড থাকায় পণ্যটি Delete করা যায়নি।";
            }

            failedProducts.push({ id, message });
            continue;
          }

          deletedIds.push(id);
        } catch (err) {
          failedProducts.push({
            id,
            message:
              err instanceof Error
                ? err.message
                : "সার্ভারের সঙ্গে যোগাযোগ করা যায়নি।",
          });
        }
      }

      if (deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);

        setProducts((previous) =>
          previous.filter((product) => !deletedSet.has(product.id)),
        );

        setSelectedIds((previous) =>
          previous.filter((id) => !deletedSet.has(id)),
        );

        setViewProduct((previous) =>
          previous && deletedSet.has(previous.id) ? null : previous,
        );
      }

      if (failedProducts.length > 0) {
        const uniqueMessages = [
          ...new Set(failedProducts.map((item) => item.message)),
        ];

        setDeleteError(
          `${deletedIds.length}টি পণ্য Delete হয়েছে, ${failedProducts.length}টি Delete হয়নি। ${uniqueMessages.join(" ")}`,
        );

        setDeleteTarget(null);
        setDeleteMode("single");
      } else {
        setSuccessMessage(
          deletedIds.length === 1
            ? "পণ্য সফলভাবে Delete হয়েছে।"
            : `${deletedIds.length}টি পণ্য সফলভাবে Delete হয়েছে।`,
        );

        setDeleteTarget(null);
        setSelectedIds((previous) =>
          previous.filter((id) => !deletedIds.includes(id)),
        );
        setDeleteMode("single");
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "পণ্য Delete করার সময় সমস্যা হয়েছে।",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const modalProductCount =
    deleteMode === "single" ? (deleteTarget ? 1 : 0) : selectedIds.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#12233F]">Products</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Manage your store products
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(ADD_PRODUCT_PATH)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#1b3154]"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void loadPageData()}
            className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-semibold hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700"
        >
          <p>{deleteError}</p>
          <button
            type="button"
            onClick={() => setDeleteError("")}
            className="shrink-0 rounded p-1 hover:bg-red-100"
            aria-label="Dismiss delete error"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700"
        >
          <p>{successMessage}</p>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="shrink-0 rounded p-1 hover:bg-emerald-100"
            aria-label="Dismiss success message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* STORE INFORMATION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Store size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-[15px] font-bold text-[#12233F]">
                  {loading
                    ? "Loading store..."
                    : (vendorInfo?.storeName ?? "My Store")}
                </h2>
                {vendorInfo?.status && vendorInfo.status !== "—" && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {vendorInfo.status}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11.5px] text-slate-500">
                Store information from your account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 sm:gap-8">
            <div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                Rating
              </div>
              <p className="mt-1 text-[14px] font-bold text-[#12233F]">
                {loading
                  ? "—"
                  : vendorInfo?.rating != null && vendorInfo.rating > 0
                    ? vendorInfo.rating.toFixed(1)
                    : "0.0"}
              </p>
              <p className="text-[10px] text-slate-400">
                {vendorInfo?.totalReviews
                  ? `${vendorInfo.totalReviews} reviews`
                  : "No reviews yet"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                <TrendingUp size={12} className="text-emerald-500" />
                Total Sales
              </div>
              <p className="mt-1 text-[14px] font-bold text-[#12233F]">
                {loading ? "—" : formatMoney(vendorInfo?.totalSales)}
              </p>
              <p className="text-[10px] text-slate-400">Completed sales</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400">
                <ShoppingBag size={12} className="text-blue-500" />
                Products
              </div>
              <p className="mt-1 text-[14px] font-bold text-[#12233F]">
                {loading ? "—" : totalProducts}
              </p>
              <p className="text-[10px] text-slate-400">Store products</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT STATS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Total Products"
          value={loading ? "—" : totalProducts}
          icon={Boxes}
          variant="blue"
          description="All your products"
        />
        <AdminStatCard
          label="In Stock"
          value={loading ? "—" : activeProducts}
          icon={CheckCircle2}
          variant="green"
          description="Products with available stock"
        />
        <AdminStatCard
          label="Approval Status"
          value={loading ? "—" : (vendorInfo?.status ?? "APPROVED")}
          icon={Clock3}
          variant="orange"
          description="Vendor store status"
        />
        <AdminStatCard
          label="Out of Stock"
          value={loading ? "—" : outOfStockProducts}
          icon={AlertTriangle}
          variant="yellow"
          description="Needs restocking"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Low Stock"
          value={loading ? "—" : lowStockProducts}
          icon={AlertTriangle}
          variant="yellow"
          description="Less than 10 units"
        />
        <AdminStatCard
          label="Store Rating"
          value={
            loading
              ? "—"
              : vendorInfo?.rating != null && vendorInfo.rating > 0
                ? vendorInfo.rating.toFixed(1)
                : "0.0"
          }
          icon={Star}
          variant="purple"
          description={
            vendorInfo?.totalReviews
              ? `${vendorInfo.totalReviews} customer reviews`
              : "No reviews yet"
          }
        />
        <AdminStatCard
          label="Total Sales"
          value={loading ? "—" : formatMoney(vendorInfo?.totalSales)}
          icon={TrendingUp}
          variant="green"
          description="Monthly sales revenue"
        />
        <AdminStatCard
          label="Store Products"
          value={loading ? "—" : totalProducts}
          icon={ShoppingBag}
          variant="blue"
          description="Products in your store"
        />
      </div>

      {/* PRODUCT TABLE */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#12233F]">
                My Products
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                {loading
                  ? "Loading..."
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative min-w-0 sm:w-56">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[11.5px] text-[#12233F] outline-none placeholder:text-slate-400 focus:border-[#D6A419] focus:bg-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11.5px] text-slate-600 outline-none focus:border-[#D6A419] sm:w-auto sm:min-w-[145px]"
              >
                <option value="ALL">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "ALL" | ProductStatus)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11.5px] text-slate-600 outline-none focus:border-[#D6A419] sm:w-auto"
              >
                <option value="ALL">All Stock Status</option>
                <option value="ACTIVE">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 px-4 py-3 sm:px-5">
            <p className="text-[11.5px] font-semibold text-rose-700">
              {selectedIds.length} product
              {selectedIds.length > 1 ? "s" : ""} selected
            </p>
            <button
              type="button"
              onClick={bulkDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              <Trash2 size={13} />
              Delete Selected
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 accent-[#D6A419]"
                    aria-label="Select all visible products"
                  />
                </th>
                {["Product", "Category", "Price", "Stock", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-[12px] text-slate-400"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Loader2
                        size={15}
                        className="animate-spin text-[#D6A419]"
                      />
                      Loading your products...
                    </span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-[12px] text-red-500"
                  >
                    Products load করা যায়নি।
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-[12px] text-slate-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => openProductDetails(product)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openProductDetails(product);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                    className="cursor-pointer transition hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D6A419]"
                  >
                    <td
                      className="px-4 py-3.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 accent-[#D6A419]"
                        aria-label={`Select ${product.name}`}
                      />
                    </td>

                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <ProductImage
                          name={product.name}
                          image={product.image}
                        />
                        <div className="min-w-0">
                          <p className="max-w-[230px] truncate text-[11.5px] font-semibold text-[#12233F]">
                            {product.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5">
                      <span className="inline-block max-w-[145px] truncate rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                        {product.category}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3.5">
                      <span className="text-[11.5px] font-bold text-[#12233F]">
                        {formatPrice(product.price)}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <span
                        className={`text-[11.5px] font-semibold ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock < 10
                              ? "text-amber-600"
                              : "text-slate-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-3 py-3.5">
                      <ProductStatusBadge status={product.status} />
                    </td>

                    <td
                      className="px-4 py-3.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex justify-end gap-0.5">
                        <button
                          type="button"
                          title="View details"
                          aria-label={`View ${product.name}`}
                          onClick={() => openProductDetails(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          title="More actions"
                          aria-label={`More actions for ${product.name}`}
                          onClick={() => openProductDetails(product)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#12233F]"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => deleteProduct(product)}
                          disabled={isDeleting}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[10.5px] text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">
              {loading ? "—" : filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-600">
              {loading ? "—" : products.length}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-200 p-1.5 text-slate-300"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="rounded-lg bg-[#12233F] px-3 py-1.5 text-[10.5px] font-semibold text-white">
              1
            </span>
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-200 p-1.5 text-slate-300"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <ProductDetailsSidebar
        product={viewProduct}
        onClose={closeProductDetails}
        onEdit={handleEditProduct}
        onCouponChange={handleCouponChange}
      />

      {(deleteTarget !== null || deleteMode === "bulk") && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDeleteModal();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !isDeleting) closeDeleteModal();
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-3.5 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id="delete-modal-title"
                  className="text-[15px] font-bold text-[#12233F]"
                >
                  তুমি কি নিশ্চিত?
                </h2>
                <p
                  id="delete-modal-description"
                  className="mt-2 text-[12px] leading-5 text-slate-500"
                >
                  {deleteMode === "single" ? (
                    <>
                      তুমি কি সত্যিই{" "}
                      <span className="font-semibold text-slate-800">
                        {deleteTarget?.name ?? "এই পণ্যটি"}
                      </span>{" "}
                      Delete করতে চাও?
                    </>
                  ) : (
                    <>
                      তুমি কি সত্যিই নির্বাচিত{" "}
                      <span className="font-semibold text-red-600">
                        {modalProductCount}টি পণ্য
                      </span>{" "}
                      Delete করতে চাও?
                    </>
                  )}
                </p>
                <p className="mt-2 text-[10.5px] text-slate-400">
                  Delete সফল হলে পণ্যটি তালিকা থেকে সরিয়ে দেওয়া হবে।
                </p>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                aria-label="Close delete confirmation"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11.5px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting || modalProductCount === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-[11.5px] font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    {deleteMode === "bulk"
                      ? `Delete ${modalProductCount} Products`
                      : "Yes, Delete"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
