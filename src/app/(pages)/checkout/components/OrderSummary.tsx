"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Tag, Banknote, AlertCircle } from "lucide-react";
import { createClient } from "../../../../../lib/supabase-client";
import { getValidImageUrl } from "../../../../../lib/image-util";
import { Package } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type AnyObject = Record<string, any>;
type Role = "customer" | "wholesaler" | "dropshipper";

type DeliveryRate = {
  minDistanceKm: number;
  maxDistanceKm: number;
  firstKgCharge: number;
  additionalKgCharge: number;
};

type DeliverySettings = {
  scope?: string;
  weightKg?: number | null;
  nationwideCharge?: number | null;
  rates?: DeliveryRate[];
  deliveryRates?: DeliveryRate[];
  [key: string]: any;
};

type CartItem = {
  id: string;
  cartItemId?: string;
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  deliverySettings?: DeliverySettings | null;
  selectedRateMinDistanceKm?: number | null;
  product?: AnyObject;
  vendor?: AnyObject;
};

export type CustomerShippingData = {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postalCode?: string;
};

type Props = {
  role: Role;
  shipping: CustomerShippingData;
};

const money = (value: number) =>
  `৳${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getAuthToken = async (): Promise<string> => {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw new Error(error.message);
  if (!session?.access_token) {
    throw new Error("অর্ডার করার আগে দয়া করে লগইন করুন।");
  }

  return session.access_token;
};

async function readJsonResponse(
  response: Response,
): Promise<AnyObject> {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server থেকে সঠিক response পাওয়া যায়নি।");
  }
}

const getProductPrice = (product: AnyObject): number => {
  const pricing = product?.pricing ?? {};

  const salePrice =
    pricing.customerSalePrice ?? product?.customerSalePrice;

  if (
    salePrice !== null &&
    salePrice !== undefined &&
    salePrice !== "" &&
    Number.isFinite(Number(salePrice)) &&
    Number(salePrice) > 0
  ) {
    return Number(salePrice);
  }

  const regularPrice =
    pricing.customerRegularPrice ??
    product?.customerRegularPrice ??
    pricing.regularPrice ??
    product?.regularPrice ??
    product?.price;

  const price = Number(regularPrice);
  return Number.isFinite(price) && price >= 0 ? price : 0;
};

const getVendorId = (item: AnyObject): string => {
  const product = item?.product ?? item?.Product ?? {};
  const vendor =
    product?.vendor ??
    product?.Vendor ??
    item?.vendor ??
    item?.Vendor ??
    {};

  return String(
    item?.vendorId ??
      item?.vendorID ??
      product?.vendorId ??
      product?.vendorID ??
      vendor?.id ??
      "",
  );
};

const getDeliverySettings = (
  item: AnyObject,
): DeliverySettings | null => {
  const product = item?.product ?? item?.Product ?? {};

  return (
    product?.deliverySettings ??
    product?.deliverySetting ??
    item?.deliverySettings ??
    item?.deliverySetting ??
    null
  );
};

const getRates = (
  settings: DeliverySettings | null | undefined,
): DeliveryRate[] => {
  const rates = Array.isArray(settings?.rates)
    ? settings.rates
    : Array.isArray(settings?.deliveryRates)
      ? settings.deliveryRates
      : [];

  return [...rates].sort(
    (a, b) =>
      Number(a.minDistanceKm) - Number(b.minDistanceKm),
  );
};

const getDeliveryScope = (
  settings: DeliverySettings | null | undefined,
): string => String(settings?.scope ?? "").toUpperCase();

const normalizeServerCartItem = (
  raw: AnyObject,
  previousItems: CartItem[] = [],
): CartItem => {
  const product =
    raw?.product ?? raw?.Product ?? raw?.variant?.product ?? {};

  const vendor =
    product?.vendor ??
    product?.Vendor ??
    raw?.vendor ??
    raw?.Vendor ??
    {};

  const productId = String(
    raw?.productId ?? product?.id ?? "",
  );

  const cartItemId = String(raw?.id ?? "");
  const vendorId = getVendorId({ ...raw, product, vendor });

  const previousItem = previousItems.find(
    (item) =>
      (cartItemId &&
        (item.cartItemId === cartItemId ||
          item.id === cartItemId)) ||
      (productId &&
        item.productId === productId &&
        item.vendorId === vendorId),
  );

  const deliverySettings =
    getDeliverySettings({ ...raw, product }) ??
    previousItem?.deliverySettings ??
    null;

  const rawSlab =
    raw?.selectedRateMinDistanceKm ??
    raw?.selectedRate?.minDistanceKm ??
    raw?.deliverySelection?.selectedRateMinDistanceKm ??
    null;

  const rawImage =
    product?.images?.[0]?.url ??
    product?.images?.[0] ??
    product?.image ??
    raw?.image ??
    previousItem?.image ??
    "";
  const image = getValidImageUrl(rawImage);

  return {
    id: cartItemId || productId,
    cartItemId,
    productId,
    vendorId,
    name: String(
      product?.name ??
        product?.title ??
        raw?.name ??
        previousItem?.name ??
        "Product",
    ),
    price: getProductPrice(product),
    quantity: Math.max(
      1,
      Number(raw?.quantity ?? raw?.qty ?? previousItem?.quantity ?? 1),
    ),
    image: typeof image === "string" ? image : "",
    deliverySettings,
    selectedRateMinDistanceKm:
      rawSlab !== null
        ? Number(rawSlab)
        : (previousItem?.selectedRateMinDistanceKm ?? null),
    product,
    vendor,
  };
};

const getDeliveryCharge = (item: CartItem): number => {
  const settings = item.deliverySettings;
  if (!settings) return 0;

  const quantity = Math.max(1, Number(item.quantity) || 1);
  const scope = getDeliveryScope(settings);

  if (scope === "NATIONWIDE") {
    const charge = Number(settings.nationwideCharge);

    return Number.isFinite(charge) && charge >= 0
      ? charge * quantity
      : 0;
  }

  if (scope === "UPAZILA_BASED") {
    const slab = item.selectedRateMinDistanceKm;
    if (slab == null) return 0;

    const rate = getRates(settings).find(
      (entry) => Number(entry.minDistanceKm) === Number(slab),
    );

    if (!rate) return 0;

    const weight = Number(settings.weightKg);
    const firstCharge = Number(rate.firstKgCharge);
    const additionalCharge = Number(rate.additionalKgCharge);

    if (
      !Number.isFinite(weight) ||
      weight <= 0 ||
      !Number.isFinite(firstCharge) ||
      !Number.isFinite(additionalCharge) ||
      firstCharge < 0 ||
      additionalCharge < 0
    ) {
      return 0;
    }

    const additionalKg = Math.max(
      0,
      Math.ceil(weight * quantity) - 1,
    );

    return firstCharge + additionalKg * additionalCharge;
  }

  return 0;
};

const getDeliveryError = (item: CartItem): string | null => {
  const settings = item.deliverySettings;

  if (!settings) {
    return `${item.name}: ডেলিভারি সেটিংস পাওয়া যায়নি।`;
  }

  const scope = getDeliveryScope(settings);

  if (scope === "NATIONWIDE") {
    const charge = Number(settings.nationwideCharge);

    if (!Number.isFinite(charge) || charge < 0) {
      return `${item.name}: Nationwide delivery charge সঠিক নয়।`;
    }

    return null;
  }

  if (scope === "UPAZILA_BASED") {
    if (item.selectedRateMinDistanceKm == null) {
      return `${item.name}: Cart Page থেকে Delivery Slab নির্বাচন করো।`;
    }

    const rate = getRates(settings).find(
      (entry) =>
        Number(entry.minDistanceKm) ===
        Number(item.selectedRateMinDistanceKm),
    );

    if (!rate) {
      return `${item.name}: নির্বাচিত Delivery Slab পাওয়া যায়নি।`;
    }

    const weight = Number(settings.weightKg);
    const firstCharge = Number(rate.firstKgCharge);
    const additionalCharge = Number(rate.additionalKgCharge);

    if (!Number.isFinite(weight) || weight <= 0) {
      return `${item.name}: পণ্যের ওজন সঠিক নয়।`;
    }

    if (
      !Number.isFinite(firstCharge) ||
      !Number.isFinite(additionalCharge) ||
      firstCharge < 0 ||
      additionalCharge < 0
    ) {
      return `${item.name}: Delivery Rate সঠিক নয়।`;
    }

    return null;
  }

  return `${item.name}: Delivery Scope সঠিক নয়।`;
};

export default function OrderSummary({
  role,
  shipping,
}: Props) {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    couponName: string;
    discount: number;
    productId: string;
    productTitle: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let previousItems: CartItem[] = [];

      try {
        const storedCart = localStorage.getItem("cart");

        if (storedCart) {
          const parsed: unknown = JSON.parse(storedCart);
          if (Array.isArray(parsed)) {
            previousItems = parsed as CartItem[];
          }
        }
      } catch {
        previousItems = [];
      }

      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE_URL}/api/customer/cart`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      const result = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(
          result?.message ??
            result?.error ??
            "Cart load করা যায়নি।",
        );
      }

      const serverItems: AnyObject[] = Array.isArray(result)
        ? result
        : (result?.items ??
          result?.cart?.items ??
          result?.data?.items ??
          result?.data ??
          []);

      if (!Array.isArray(serverItems)) {
        throw new Error("Server Cart Response সঠিক নয়।");
      }

      const normalized = serverItems.map((item) =>
        normalizeServerCartItem(item, previousItems),
      );

      setItems(normalized);
      localStorage.setItem("cart", JSON.stringify(normalized));
    } catch (err) {
      console.error("Load cart error:", err);
      setError(
        err instanceof Error ? err.message : "Cart load করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const deliveryCharge = items.reduce(
    (sum, item) => sum + getDeliveryCharge(item),
    0,
  );

  const deliveryErrors = items
    .map(getDeliveryError)
    .filter((message): message is string => Boolean(message));

  const deliveryReady =
    items.length > 0 && deliveryErrors.length === 0;

  const discount = appliedCoupon ? Number(appliedCoupon.discount) : 0;
  const total = Math.max(
    0,
    subtotal + deliveryCharge - discount,
  );

  const applyCoupon = async () => {
    setCouponMessage("");

    if (!coupon.trim()) {
      setCouponMessage("কুপন কোড লিখুন।");
      return;
    }

    setCouponLoading(true);

    try {
      const token = await getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/api/customer/orders/validate-coupon`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ couponCode: coupon.trim() }),
        },
      );

      const result = await readJsonResponse(response);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ?? result?.error ?? "কুপন কোডটি সঠিক নয়।",
        );
      }

      setAppliedCoupon(result.data);
      setCouponMessage(result.message ?? "কুপন সফলভাবে প্রয়োগ হয়েছে!");
    } catch (err: unknown) {
      setAppliedCoupon(null);
      setCouponMessage(
        err instanceof Error ? err.message : "কুপন প্রয়োগ করা যায়নি।",
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponMessage("");
  };

  const handlePlaceOrder = async () => {
    setError("");
    setSuccess("");

    if (role !== "customer") {
      setError("এই Checkout Order শুধু Customer account-এর জন্য।");
      return;
    }

    if (items.length === 0) {
      setError("আপনার Cart খালি।");
      return;
    }

    if (!deliveryReady) {
      setError("আগে Delivery Settings ঠিক করুন।");
      return;
    }

    if (
      !shipping.fullName?.trim() ||
      !shipping.phone?.trim() ||
      !shipping.division?.trim() ||
      !shipping.district?.trim() ||
      !shipping.upazila?.trim() ||
      !shipping.address?.trim()
    ) {
      setError("Shipping Address-এর প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    const vendorSlabs = new Map<string, number>();

    for (const item of items) {
      if (!item.productId || !item.vendorId) {
        setError(
          `${item.name}: Product অথবা Vendor ID পাওয়া যায়নি। Cart reload করুন।`,
        );
        return;
      }

      if (item.selectedRateMinDistanceKm == null) continue;

      const slab = Number(item.selectedRateMinDistanceKm);
      const existingSlab = vendorSlabs.get(item.vendorId);

      if (existingSlab !== undefined && existingSlab !== slab) {
        setError(
          "একই Vendor-এর সব Product-এর জন্য একই Delivery Slab নির্বাচন করুন।",
        );
        return;
      }

      vendorSlabs.set(item.vendorId, slab);
    }

    setSubmitting(true);

    try {
      const token = await getAuthToken();

      const deliverySelections = Array.from(
        vendorSlabs.entries(),
      ).map(([vendorId, selectedRateMinDistanceKm]) => ({
        vendorId,
        selectedRateMinDistanceKm,
      }));

      const response = await fetch(
        `${API_BASE_URL}/api/customer/orders/cod`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipping: {
              fullName: shipping.fullName.trim(),
              phone: shipping.phone.trim(),
              email: shipping.email?.trim() ?? "",
              division: shipping.division.trim(),
              district: shipping.district.trim(),
              upazila: shipping.upazila.trim(),
              area: shipping.postalCode?.trim() ?? "",
              address: shipping.address.trim(),
              note: "",
            },
            deliverySelections,
            couponCode: appliedCoupon?.couponName ?? undefined,
          }),
        },
      );

      const result = await readJsonResponse(response);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ??
            result?.error ??
            "অর্ডার সম্পন্ন করা যায়নি।",
        );
      }

      setSuccess("ক্যাশ অন ডেলিভারি অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
      localStorage.setItem("cart", "[]");
      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        router.push("/orders");
        router.refresh();
      }, 1200);
    } catch (err) {
      console.error("Place order error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-600">
          Order Summary লোড হচ্ছে...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#12233F]">
          Order Summary
        </h2>

        {items.length === 0 ? (
          <p className="py-4 text-sm text-gray-500">
            আপনার Cart খালি।
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={
                  item.cartItemId ||
                  item.id ||
                  `${item.productId}-${index}`
                }
                className="flex gap-3 border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  {getValidImageUrl(item.image) ? (
                    <img
                      src={getValidImageUrl(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        const fallback = event.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="flex flex-col items-center justify-center text-[10px] text-gray-400"
                    style={{ display: getValidImageUrl(item.image) ? "none" : "flex" }}
                  >
                    <Package size={20} className="text-gray-300" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {money(item.price)} × {item.quantity}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Delivery: {money(getDeliveryCharge(item))}
                  </p>

                  {item.selectedRateMinDistanceKm != null && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected Slab:{" "}
                      {item.selectedRateMinDistanceKm} km
                    </p>
                  )}

                  {getDeliveryError(item) && (
                    <p className="mt-1 text-xs text-red-600">
                      {getDeliveryError(item)}
                    </p>
                  )}
                </div>

                <p className="whitespace-nowrap font-bold text-[#12233F]">
                  {money(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-[#12233F] flex items-center gap-2">
          <Tag className="h-5 w-5 text-[#D6A419]" />
          Coupon Code
        </h2>

        <div className="flex gap-2">
          <input
            value={coupon}
            onChange={(event) => setCoupon(event.target.value.toUpperCase())}
            placeholder="Enter coupon code (যেমন: SAVE50)"
            disabled={Boolean(appliedCoupon) || couponLoading}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-[#D6A419] disabled:bg-gray-100 disabled:text-gray-500"
          />

          {appliedCoupon ? (
            <button
              type="button"
              onClick={removeCoupon}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponLoading}
              className="rounded-lg bg-[#12233F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c365e] disabled:opacity-50"
            >
              {couponLoading ? "যাচাই হচ্ছে..." : "Apply"}
            </button>
          )}
        </div>

        {couponMessage && (
          <p
            className={`mt-2 text-sm ${
              appliedCoupon
                ? "font-medium text-emerald-600"
                : "text-red-600"
            }`}
          >
            {couponMessage}
          </p>
        )}
      </section>

      {/* Cash on Delivery Payment Method Section */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-[#12233F] flex items-center gap-2">
          <Banknote className="h-5 w-5 text-emerald-600" />
          Payment Method
        </h2>

        <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-50/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-emerald-600 p-1 text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-gray-900">
                Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-600">
                কোনো অগ্রিম পেমেন্ট নেই। পণ্য এবং ডেলিভারি চার্জের সর্বমোট টাকা পার্সেলটি রিসিভ করার সময় ডেলিভারি ম্যানের কাছে পরিশোধ করবেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Summary & Order Placement */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-[#12233F]">
          Order Summary & Payment
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{money(subtotal)}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-600">Delivery Charge</span>
            <span className="font-medium">
              {deliveryReady
                ? money(deliveryCharge)
                : "স্ল্যাব যাচাই করো"}
            </span>
          </div>

          {!deliveryReady && deliveryErrors.length > 0 && (
            <div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              {deliveryErrors.map((message, index) => (
                <p key={`${index}-${message}`}>{message}</p>
              ))}
            </div>
          )}

          {discount > 0 && (
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Coupon Discount</span>
              <span className="font-medium text-emerald-600">
                -{money(discount)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between gap-3 text-base">
              <span className="font-bold text-[#12233F]">
                সর্বমোট পরিশোধযোগ্য (COD)
              </span>
              <span className="text-xl font-extrabold text-[#12233F]">
                {money(total)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={!deliveryReady || submitting || items.length === 0}
          className="mt-5 w-full rounded-xl bg-[#12233F] py-3.5 px-4 text-center text-base font-bold text-white shadow-md transition hover:bg-[#1a345e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "অর্ডার প্রসেস হচ্ছে..."
            : `Confirm Order — ${money(total)} (Cash on Delivery)`}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>১০০% নিরাপদ ক্যাশ অন ডেলিভারি কেনাকাটা</span>
        </div>
      </section>
    </div>
  );
}
