"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GitCompareArrows,
  Trash2,
  ShoppingCart,
  Star,
  CheckCircle2,
  XCircle,
  Package,
  Store,
  Layers,
  ArrowRight,
  Plus,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useCompare, CompareProduct } from "@/context/CompareContext";
import { createClient } from "../../../../lib/supabase-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface EnrichedDetails {
  category?: string;
  brand?: string;
  storeName?: string;
  stock?: number;
  description?: string;
  sku?: string;
  warranty?: string;
}

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare, isHydrated } = useCompare();
  const [enrichedData, setEnrichedData] = useState<Record<string, EnrichedDetails>>({});
  const [addingCartId, setAddingCartId] = useState<string | null>(null);

  // Fetch full details for compared products in the background
  useEffect(() => {
    if (!isHydrated || items.length === 0) return;

    items.forEach(async (item: CompareProduct) => {
      // If already fetched or already has category, brand, storeName, skip
      if (enrichedData[item.id]) return;

      const identifier = item.slug || item.id;
      if (!identifier) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${identifier}`);
        if (!res.ok) return;
        const json = await res.json();
        const p = json?.product;
        if (!p) return;

        setEnrichedData((prev) => ({
          ...prev,
          [item.id]: {
            category: p.category?.name || p.category || item.category,
            brand: p.brand || item.brand,
            storeName:
              p.vendor?.storeName ||
              p.vendor?.shopName ||
              p.vendor?.companyName ||
              p.vendor?.user?.fullName ||
              item.storeName,
            stock: typeof p.stock === "number" ? p.stock : item.stock,
            description: p.shortDescription || p.description || item.description,
            sku: p.sku,
            warranty: p.warranty,
          },
        }));
      } catch (e) {
        console.error("Failed to fetch product details for compare:", e);
      }
    });
  }, [items, isHydrated]);

  const handleAddToCart = async (product: CompareProduct) => {
    if (addingCartId) return;
    setAddingCartId(product.id);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.warning("কার্টে যোগ করতে অনুগ্রহ করে প্রথমে লগইন করুন।");
        return;
      }

      // Try customer cart endpoint first
      let response = await fetch(`${API_BASE_URL}/api/customer/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      // Fallback to /api/cart
      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
          }),
        });
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "কার্টে যোগ করা যায়নি");
      }

      // Also update localStorage cart fallback
      try {
        const rawCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = rawCart.find((c: any) => c.id === product.id);
        if (existing) {
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          rawCart.push({
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: 1,
            image: product.image,
          });
        }
        localStorage.setItem("cart", JSON.stringify(rawCart));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch {
        // ignore
      }

      toast.success(`"${product.title.slice(0, 25)}..." কার্টে যোগ হয়েছে!`);
    } catch (err: any) {
      toast.error(err?.message || "কার্টে পণ্য যোগ করতে সমস্যা হয়েছে");
    } finally {
      setAddingCartId(null);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-inner">
            <GitCompareArrows size={44} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            তুলনার তালিকায় কোনো পণ্য নেই
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base leading-relaxed">
            পণ্য ব্রাউজ করার সময় ছবির উপরে থাকা Compare (তুলনা) আইকনে ক্লিক করে একসাথে সর্বোচ্চ ৪টি পণ্যের দাম, স্পেসিফিকেশন এবং রেটিং পাশাপাশি তুলনা করতে পারেন।
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600 hover:shadow-lg"
            >
              <ShoppingCart size={18} />
              <span>পণ্য ব্রাউজ করুন</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>হোম পেজে যান</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6 sm:pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-amber-600">
            হোম
          </Link>
          <span>/</span>
          <span className="text-slate-800">পণ্য তুলনা (Compare)</span>
        </div>

        {/* Header Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <GitCompareArrows size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  পণ্য তুলনা করুন
                </h1>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {items.length} / 4
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                এক নজরে একাধিক পণ্যের দাম, স্পেসিফিকেশন ও রেটিং যাচাই করুন
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {items.length < 4 && (
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 px-4 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                <Plus size={15} />
                <span>আরও পণ্য যোগ করুন ({4 - items.length}টি বাকি)</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                if (window.confirm("আপনি কি তুলনার তালিকা থেকে সব পণ্য মুছতে চান?")) {
                  clearCompare();
                  toast.info("তুলনার তালিকা খালি করা হয়েছে");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 shadow-2xs transition hover:bg-rose-50"
            >
              <Trash2 size={15} />
              <span>সব মুছুন</span>
            </button>
          </div>
        </div>

        {/* COMPARISON TABLE CONTAINER */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="sticky left-0 z-20 w-44 bg-slate-50/90 p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 backdrop-blur-xs sm:w-52">
                    বৈশিষ্ট্য / Features
                  </th>
                  {items.map((item: CompareProduct) => (
                    <th
                      key={item.id}
                      className="min-w-[260px] max-w-[320px] p-4 text-left align-top"
                    >
                      {/* Product Header Card */}
                      <div className="relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition hover:border-amber-200">
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCompare(item.id)}
                          title="তুলনা থেকে সরান"
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                        >
                          ✕
                        </button>

                        {/* Product Image */}
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="group mx-auto mb-3 flex h-36 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-2"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <Package size={40} className="text-slate-300" />
                          )}
                        </Link>

                        {/* Title */}
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="line-clamp-2 min-h-[38px] text-xs font-bold leading-5 text-slate-800 transition hover:text-amber-600 sm:text-sm"
                          title={item.title}
                        >
                          {item.title}
                        </Link>

                        {/* Price */}
                        <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
                          <span className="text-base font-extrabold text-amber-600 sm:text-lg">
                            ৳{Number(item.price || 0).toLocaleString("en-BD")}
                          </span>
                          {item.regularPrice && item.regularPrice > item.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳{Number(item.regularPrice).toLocaleString("en-BD")}
                            </span>
                          )}
                        </div>

                        {/* Cart CTA */}
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            disabled={addingCartId === item.id}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 disabled:opacity-60"
                          >
                            {addingCartId === item.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <ShoppingCart size={14} />
                            )}
                            <span>কার্টে যোগ করুন</span>
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}

                  {/* Empty slots for missing columns if less than 4 */}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <th
                      key={`empty-slot-${idx}`}
                      className="min-w-[260px] max-w-[320px] p-4 text-center align-middle"
                    >
                      <Link
                        href="/products"
                        className="flex h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-slate-400 transition hover:border-amber-400 hover:bg-amber-50/30 hover:text-amber-700"
                      >
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xs">
                          <Plus size={20} />
                        </div>
                        <span className="text-xs font-semibold">পণ্য যোগ করুন</span>
                        <span className="mt-1 text-[11px] text-slate-400">
                          ব্রাউজ করে তুলনা করুন
                        </span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 sm:text-sm">
                {/* 1. Rating & Reviews */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    রেটিং ও রিভিউ
                  </td>
                  {items.map((item: CompareProduct) => (
                    <td key={item.id} className="p-4 align-top">
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Math.round(item.rating || 0) ? "currentColor" : "none"}
                              className={i < Math.round(item.rating || 0) ? "text-amber-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-slate-800">
                          {(item.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({item.reviewsCount || 0} রিভিউ)
                        </span>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-rating-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 2. Availability / Stock */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    স্টক ও প্রাপ্যতা
                  </td>
                  {items.map((item: CompareProduct) => {
                    const enriched = enrichedData[item.id];
                    const stock = enriched?.stock ?? item.stock;
                    const isAvailable = stock === undefined || stock > 0;

                    return (
                      <td key={item.id} className="p-4 align-top">
                        {isAvailable ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={13} />
                            <span>
                              ইন স্টক {stock !== undefined && stock > 0 ? `(${stock}টি)` : ""}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                            <XCircle size={13} />
                            <span>স্টকে নেই</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-stock-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 3. Minimum Order Quantity (MOQ) */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    ন্যূনতম অর্ডার (MOQ)
                  </td>
                  {items.map((item: CompareProduct) => (
                    <td key={item.id} className="p-4 align-top font-medium text-slate-800">
                      {item.moq ? `${item.moq} Pcs` : "১ টি"}
                    </td>
                  ))}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-moq-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 4. Category */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    ক্যাটাগরি
                  </td>
                  {items.map((item: CompareProduct) => {
                    const enriched = enrichedData[item.id];
                    const category = enriched?.category || item.category || "General";
                    return (
                      <td key={item.id} className="p-4 align-top">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          <Layers size={13} className="text-slate-500" />
                          <span>{category}</span>
                        </span>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-cat-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 5. Brand */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    ব্র্যান্ড
                  </td>
                  {items.map((item: CompareProduct) => {
                    const enriched = enrichedData[item.id];
                    const brand = enriched?.brand || item.brand || "Non-branded";
                    return (
                      <td key={item.id} className="p-4 align-top font-semibold text-slate-800">
                        {brand}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-brand-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 6. Seller / Store */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    বিক্রেতা / স্টোর
                  </td>
                  {items.map((item: CompareProduct) => {
                    const enriched = enrichedData[item.id];
                    const store = enriched?.storeName || item.storeName || "Aladin Verified Vendor";
                    return (
                      <td key={item.id} className="p-4 align-top">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                          <Store size={14} className="text-amber-600" />
                          <span>{store}</span>
                        </span>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-store-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 7. Description / Overview */}
                <tr className="hover:bg-slate-50/50">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    বিবরণ ও ফিচার
                  </td>
                  {items.map((item: CompareProduct) => {
                    const enriched = enrichedData[item.id];
                    const desc = enriched?.description || item.description || "";
                    // Strip HTML tags if any
                    const plainDesc = desc.replace(/<[^>]*>?/gm, "").trim();

                    return (
                      <td key={item.id} className="p-4 align-top">
                        <p className="line-clamp-4 text-xs leading-relaxed text-slate-600">
                          {plainDesc || "বিস্তারিত জানতে পণ্যের পেজ দেখুন।"}
                        </p>
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
                        >
                          <span>পুরো বিবরণ পড়ুন</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-desc-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>

                {/* 8. Bottom Action */}
                <tr className="bg-slate-50/30">
                  <td className="sticky left-0 z-10 bg-slate-50/90 p-4 font-semibold text-slate-900 backdrop-blur-xs">
                    পদক্ষেপ
                  </td>
                  {items.map((item: CompareProduct) => (
                    <td key={item.id} className="p-4 align-top">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={addingCartId === item.id}
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-amber-600 disabled:opacity-60"
                        >
                          {addingCartId === item.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ShoppingCart size={14} />
                          )}
                          <span>কার্টে যোগ করুন</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCompare(item.id)}
                          className="text-center text-xs font-medium text-slate-400 hover:text-rose-600"
                        >
                          তুলনা থেকে বাদ দিন
                        </button>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 4 - items.length }).map((_, idx) => (
                    <td key={`empty-action-${idx}`} className="p-4 text-center text-slate-300">
                      —
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative Footer */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 sm:text-sm">
                ১০০% আসল ও যাচাইকৃত পণ্য
              </h4>
              <p className="text-[11px] text-slate-500">
                ভেরিফাইড সেলারদের কাছ থেকে সরাসরি পণ্য পান
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 sm:text-sm">
                সঠিক সিদ্ধান্ত নিন
              </h4>
              <p className="text-[11px] text-slate-500">
                দাম, রেটিং ও স্পেসিফিকেশন তুলনা করে সেরা পছন্দ করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <GitCompareArrows size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 sm:text-sm">
                সহজে পণ্য নির্বাচন
              </h4>
              <p className="text-[11px] text-slate-500">
                যেকোনো পণ্য ব্রাউজ করার সময় সরাসরি তালিকায় যোগ করুন
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
