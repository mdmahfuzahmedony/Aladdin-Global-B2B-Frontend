"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase-client";
import { getValidImageUrl } from "../../../../lib/image-util";
import { useLanguage } from "@/context/LanguageContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

type DeliveryRate = {
  minDistanceKm: number;
  maxDistanceKm: number;
  firstKgCharge: number;
  additionalKgCharge: number;
};

type DeliverySettings = {
  scope: "UPAZILA_BASED" | "NATIONWIDE" | string;
  weightKg?: number | null;
  nationwideCharge?: number | null;
  rates?: DeliveryRate[];
};

type CartItem = {
  id: string;
  productId?: string;
  vendorId?: string;
  vendorID?: string;
  vendor?: {
    id?: string;
    userId?: string;
  } | null;
  name: string;
  price: number;
  quantity: number;
  image: string;
  deliverySettings?: DeliverySettings | null;
  distanceKm?: number | null;
  selectedRateMinDistanceKm?: number | null;
};

type DeliveryResult = {
  id: string;
  charge: number | null;
  error: string | null;
};

const money = (amount: number) =>
  `৳${amount.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

function getVendorId(item: CartItem): string | null {
  const id =
    item.vendorId ?? item.vendorID ?? item.vendor?.id ?? item.vendor?.userId;

  return id ? String(id) : null;
}

function getRates(item: CartItem): DeliveryRate[] {
  return [...(item.deliverySettings?.rates ?? [])].sort(
    (a, b) => Number(a.minDistanceKm) - Number(b.minDistanceKm),
  );
}

function calculateDelivery(item: CartItem): DeliveryResult {
  const settings = item.deliverySettings;

  if (!settings) {
    return {
      id: item.id,
      charge: null,
      error: `${item.name}: ডেলিভারি সেটিংস পাওয়া যায়নি।`,
    };
  }

  const quantity = Math.max(1, Number(item.quantity) || 1);

  if (settings.scope === "NATIONWIDE") {
    const charge = Number(settings.nationwideCharge);

    if (!Number.isFinite(charge) || charge < 0) {
      return {
        id: item.id,
        charge: null,
        error: `${item.name}: Nationwide delivery charge সঠিক নয়।`,
      };
    }

    return {
      id: item.id,
      charge: charge * quantity,
      error: null,
    };
  }

  if (settings.scope === "UPAZILA_BASED") {
    const rates = getRates(item);

    if (rates.length === 0) {
      return {
        id: item.id,
        charge: null,
        error: `${item.name}: কোনো ডেলিভারি স্ল্যাব পাওয়া যায়নি।`,
      };
    }

    const selectedRate = rates.find(
      (rate) =>
        Number(rate.minDistanceKm) === Number(item.selectedRateMinDistanceKm),
    );

    if (!selectedRate) {
      return {
        id: item.id,
        charge: null,
        error: `${item.name}: ডেলিভারি স্ল্যাব নির্বাচন করুন।`,
      };
    }

    const weightPerUnit = Number(settings.weightKg);

    if (!Number.isFinite(weightPerUnit) || weightPerUnit <= 0) {
      return {
        id: item.id,
        charge: null,
        error: `${item.name}: পণ্যের ওজন সঠিক নয়।`,
      };
    }

    const firstKgCharge = Number(selectedRate.firstKgCharge);
    const additionalKgCharge = Number(selectedRate.additionalKgCharge);

    if (
      !Number.isFinite(firstKgCharge) ||
      !Number.isFinite(additionalKgCharge) ||
      firstKgCharge < 0 ||
      additionalKgCharge < 0
    ) {
      return {
        id: item.id,
        charge: null,
        error: `${item.name}: নির্বাচিত স্ল্যাবের চার্জ সঠিক নয়।`,
      };
    }

    const totalWeight = weightPerUnit * quantity;
    const additionalKg = Math.max(0, Math.ceil(totalWeight) - 1);

    return {
      id: item.id,
      charge: firstKgCharge + additionalKg * additionalKgCharge,
      error: null,
    };
  }

  return {
    id: item.id,
    charge: null,
    error: `${item.name}: Delivery scope সঠিক নয়।`,
  };
}

export default function CartPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item: CartItem) => ({
              ...item,
              quantity: Math.max(1, Number(item.quantity) || 1),
              selectedRateMinDistanceKm: item.selectedRateMinDistanceKm ?? null,
            })),
          );
          return;
        }
      }
      setItems([]);
    } catch (error) {
      console.error("LOAD CART ERROR:", error);
      setItems([]);
    }
  };

  useEffect(() => {
    const fetchCartFromServer = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          loadLocalCart();
          setLoaded(true);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/customer/cart`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          loadLocalCart();
          setLoaded(true);
          return;
        }

        const data = await response.json();
        const serverItems = Array.isArray(data?.items) ? data.items : [];

        if (serverItems.length === 0) {
          setItems([]);
          localStorage.setItem("cart", "[]");
          setLoaded(true);
          return;
        }

        const mapped: CartItem[] = serverItems.map((sItem: any) => {
          const product = sItem.product || {};
          const regularPrice = Number(
            product.pricing?.customerRegularPrice ?? 0,
          );
          const salePrice =
            product.pricing?.customerSalePrice != null
              ? Number(product.pricing.customerSalePrice)
              : null;
          const price =
            salePrice != null && salePrice > 0 ? salePrice : regularPrice;
          const rawImage =
            product.images?.[0] || product.image || sItem.image || "";
          const image = getValidImageUrl(rawImage);

          return {
            id: sItem.id,
            productId: sItem.productId || product.id,
            vendorId: product.vendor?.id,
            name: product.title || product.name || "Product",
            price,
            quantity: sItem.quantity,
            image,
            deliverySettings: product.deliverySettings ?? null,
            selectedRateMinDistanceKm: null,
          };
        });

        setItems(mapped);
        localStorage.setItem("cart", JSON.stringify(mapped));
      } catch (e) {
        console.error("Cart server load failed, falling back to local:", e);
        loadLocalCart();
      } finally {
        setLoaded(true);
      }
    };

    fetchCartFromServer();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.error("SAVE CART ERROR:", error);
    }
  }, [items, loaded]);

  const updateQuantity = async (id: string, delta: number) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    const newQuantity = Math.max(1, (Number(target.quantity) || 1) + delta);

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item,
      ),
    );

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        await fetch(`${API_BASE_URL}/api/customer/cart/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });
      }
    } catch (err) {
      console.error("Update cart quantity server error:", err);
    }
  };

  const removeItem = async (id: string) => {
    const nextItems = items.filter(
      (item) => item.id !== id && item.productId !== id,
    );
    setItems(nextItems);
    localStorage.setItem("cart", JSON.stringify(nextItems));
    window.dispatchEvent(new Event("cartUpdated"));

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        if (nextItems.length === 0) {
          await fetch(`${API_BASE_URL}/api/customer/cart`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
        } else {
          await fetch(`${API_BASE_URL}/api/customer/cart/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
        }
      }
    } catch (err) {
      console.error("Delete cart item from server error:", err);
    }
  };

  // একই Vendor-এর UPAZILA_BASED পণ্যগুলোতে একই slab প্রয়োগ।
  const selectRate = (id: string, minDistanceKm: number) => {
    setItems((current) => {
      const selectedItem = current.find((item) => item.id === id);

      if (!selectedItem) return current;

      const selectedVendorId = getVendorId(selectedItem);

      return current.map((item) => {
        const sameItem = item.id === id;

        const sameVendor =
          selectedVendorId !== null && getVendorId(item) === selectedVendorId;

        if (
          item.deliverySettings?.scope === "UPAZILA_BASED" &&
          (sameItem || sameVendor)
        ) {
          // অন্য পণ্যে একই slab না থাকলে সেটি নির্বাচন করা হবে না।
          const matchingRate = getRates(item).some(
            (rate) => Number(rate.minDistanceKm) === Number(minDistanceKm),
          );

          if (matchingRate) {
            return {
              ...item,
              selectedRateMinDistanceKm: minDistanceKm,
            };
          }
        }

        return item;
      });
    });
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum +
          Math.max(0, Number(item.price) || 0) *
            Math.max(1, Number(item.quantity) || 1),
        0,
      ),
    [items],
  );

  const deliveryResults = useMemo(() => items.map(calculateDelivery), [items]);

  const deliveryReady =
    items.length > 0 &&
    deliveryResults.every((result) => result.charge !== null);

  const shippingFee = deliveryReady
    ? deliveryResults.reduce((sum, result) => sum + (result.charge ?? 0), 0)
    : null;

  const total = subtotal + (shippingFee ?? 0);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6fa]">
        <p className="text-sm font-medium text-gray-500">{t("loadingCart")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] py-8">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="transition-colors hover:text-[#F59E0B]">
              {t("homeBreadcrumb")}
            </Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-[#0F172A]">{t("cart")}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            {t("shoppingCart")}
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
              <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg font-bold text-[#0F172A]">{t("cartItems")}</h2>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-[#F59E0B]">
                  {items.length} {items.length === 1 ? t("item") : t("items")}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map((item) => {
                  const settings = item.deliverySettings;
                  const rates = getRates(item);

                  const vendorId = getVendorId(item);

                  const sameVendorItems = vendorId
                    ? items.filter(
                        (other) =>
                          getVendorId(other) === vendorId &&
                          other.deliverySettings?.scope === "UPAZILA_BASED",
                      )
                    : [item];

                  const hasSharedSlab =
                    sameVendorItems.length > 1 &&
                    sameVendorItems.every(
                      (other) =>
                        other.selectedRateMinDistanceKm != null &&
                        Number(other.selectedRateMinDistanceKm) ===
                          Number(item.selectedRateMinDistanceKm),
                    );

                  return (
                    <div key={item.id} className="group py-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            {getValidImageUrl(item.image) ? (
                              <img
                                src={getValidImageUrl(item.image)}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                  const fallback = event.currentTarget
                                    .nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="items-center justify-center text-gray-300"
                              style={{
                                display: getValidImageUrl(item.image)
                                  ? "none"
                                  : "flex",
                              }}
                            >
                              <ShoppingBag size={28} />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-sm font-bold text-[#0F172A] sm:text-base">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-400">
                              {t("product")}
                            </p>

                            <p className="mt-2 text-sm font-bold text-[#F59E0B]">
                              {money(Number(item.price) || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
                          <div className="flex h-10 items-center rounded-lg border border-gray-200 bg-gray-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-[#0F172A]"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus size={14} />
                            </button>

                            <span className="min-w-[38px] text-center text-sm font-bold text-[#0F172A]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-[#0F172A]"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="min-w-[90px] text-right">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                              {t("total")}
                            </p>

                            <p className="mt-1 text-base font-extrabold text-[#0F172A]">
                              {money(
                                (Number(item.price) || 0) *
                                  (Number(item.quantity) || 1),
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {settings?.scope === "UPAZILA_BASED" && (
                        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <label
                            htmlFor={`delivery-rate-${item.id}`}
                            className="mb-2 block text-sm font-bold text-[#0F172A]"
                          >
                            ডেলিভারি দূরত্বের স্ল্যাব নির্বাচন করুন
                          </label>

                          {rates.length > 0 ? (
                            <select
                              id={`delivery-rate-${item.id}`}
                              value={item.selectedRateMinDistanceKm ?? ""}
                              onChange={(event) => {
                                if (event.target.value !== "") {
                                  selectRate(
                                    item.id,
                                    Number(event.target.value),
                                  );
                                }
                              }}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#F59E0B]"
                            >
                              <option value="">স্ল্যাব নির্বাচন করুন</option>

                              {rates.map((rate) => (
                                <option
                                  key={rate.minDistanceKm}
                                  value={rate.minDistanceKm}
                                >
                                  {rate.minDistanceKm}–{rate.maxDistanceKm} কিমি
                                  {" — "}
                                  প্রথম ১ কেজি{" "}
                                  {money(Number(rate.firstKgCharge))}
                                  {"; "}
                                  অতিরিক্ত প্রতি কেজি{" "}
                                  {money(Number(rate.additionalKgCharge))}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-red-600">
                              এই পণ্যের জন্য কোনো ডেলিভারি স্ল্যাব নেই।
                            </p>
                          )}

                          {vendorId && sameVendorItems.length > 1 && (
                            <p className="mt-2 text-xs leading-5 text-blue-700">
                              একই Vendor-এর পণ্যগুলোর জন্য একই স্ল্যাব ব্যবহার
                              হবে।
                              {hasSharedSlab
                                ? " স্ল্যাব নির্বাচন সংরক্ষিত আছে।"
                                : " স্ল্যাব নির্বাচন করলে মিল থাকা স্ল্যাবগুলো একসঙ্গে আপডেট হবে।"}
                            </p>
                          )}

                          <p className="mt-2 text-xs leading-5 text-gray-500">
                            নির্বাচিত স্ল্যাবের চার্জ পণ্যের ওজন ও পরিমাণ
                            অনুযায়ী হিসাব করা হবে।
                          </p>
                        </div>
                      )}

                      {settings?.scope === "NATIONWIDE" && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                          দেশব্যাপী ডেলিভারি:{" "}
                          {Number.isFinite(Number(settings.nationwideCharge))
                            ? money(
                                Number(settings.nationwideCharge) *
                                  Math.max(1, Number(item.quantity) || 1),
                              )
                            : "চার্জ পাওয়া যায়নি"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 border-b border-gray-100 pb-4 text-lg font-bold text-[#0F172A]">
                  {t("orderSummary")}
                </h2>

                <div className="mb-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{t("subtotal")}</span>
                    <span className="font-semibold text-[#0F172A]">
                      {money(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <span>{t("estimatedShipping")}</span>
                    <span className="text-right font-semibold text-[#0F172A]">
                      {shippingFee === null
                        ? "হিসাব করা যায়নি"
                        : money(shippingFee)}
                    </span>
                  </div>

                  {!deliveryReady && (
                    <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                      {deliveryResults
                        .filter((result) => result.error)
                        .map((result) => (
                          <p key={result.id}>{result.error}</p>
                        ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-base font-bold text-[#0F172A]">
                    <span>{t("total")}</span>
                    <span className="text-lg text-[#F59E0B]">
                      {money(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!deliveryReady || items.length === 0}
                  onClick={() => router.push("/checkout")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#d97706] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("checkout")}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto my-12 max-w-lg rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-[#F59E0B]">
              <ShoppingBag size={32} />
            </div>

            <h2 className="mb-2 text-xl font-bold text-[#0F172A]">
              {t("cartEmpty")}
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              {t("emptyCartDescription")}
            </p>

            <Link
              href="/"
              className="inline-block rounded-xl bg-[#0F172A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
            >
              {t("startShopping")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
