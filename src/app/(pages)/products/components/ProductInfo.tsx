"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  MapPin,
  Share2,
  Zap,
  CheckCircle2,
  AlertCircle,
  Palette,
  GitCompareArrows,
} from "lucide-react";
import { useCompare } from "@/context/CompareContext";

import type {
  ProductDetails,
  ProductDeliverySettings,
  VendorLocation,
  ProductAttributes,
} from "../types";
import { createClient } from "../../../../../lib/supabase-client";
import { ProductCategoryHighlights } from "./ProductCategoryAttributes";

type Props = {
  product: ProductDetails;
};

export interface StoredCartItem {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  deliverySettings?: ProductDeliverySettings | null;
  vendorLocation?: VendorLocation | null;
  selectedRateMinDistanceKm?: number | null;
}

interface CustomerLocation {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
  area?: string | null;
  address?: string | null;
}

type StatusType = "success" | "error" | "";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const normalize = (value?: string | null) =>
  (value ?? "").trim().toLocaleLowerCase("en");

const getStock = (stock: string | number | undefined): number => {
  const parsed = Number(stock ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getValidImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image.url === "string") return image.url;
  return "";
};

export default function ProductInfo({ product }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { isInCompare, toggleCompare } = useCompare();
  const inCompare = isInCompare(product.id);

  const [customerLocation, setCustomerLocation] =
    useState<CustomerLocation | null>(null);
  const [checkingLocation, setCheckingLocation] = useState(true);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("");

  const attributes: ProductAttributes = product.attributes ?? {};

  const colors = Array.isArray(attributes.colors)
    ? attributes.colors.filter(
        (color): color is NonNullable<ProductAttributes["colors"]>[number] =>
          isRecord(color) &&
          typeof color.color === "string" &&
          Array.isArray(color.sizes),
      )
    : [];

  const defaultColor = useMemo(() => {
    if (!colors.length) return "";
    const withStock = colors.find((c) =>
      c.sizes?.some((s) => getStock(s.stock) > 0),
    );
    return withStock?.color || colors[0]?.color || "";
  }, [colors]);

  const defaultSize = useMemo(() => {
    if (!defaultColor) return "";
    const colorObj = colors.find((c) => c.color === defaultColor);
    const withStock = colorObj?.sizes?.find((s) => getStock(s.stock) > 0);
    return withStock?.size || colorObj?.sizes?.[0]?.size || "";
  }, [colors, defaultColor]);

  // Color & Size Variant states
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  // Sync default variant if not selected
  useEffect(() => {
    if (defaultColor && !selectedColor) {
      setSelectedColor(defaultColor);
    }
  }, [defaultColor, selectedColor]);

  useEffect(() => {
    if (defaultSize && !selectedSize) {
      setSelectedSize(defaultSize);
    }
  }, [defaultSize, selectedSize]);

  const hasColorVariants = colors.length > 0;
  const activeColor =
    colors.find((color) => color.color === selectedColor) ?? null;
  const sizes = activeColor?.sizes ?? [];
  const selectedSizeData =
    sizes.find((size) => size.size === selectedSize) ?? null;
  const selectedStock = selectedSizeData ? getStock(selectedSizeData.stock) : 0;

  const totalVariantStock = useMemo(() => {
    if (!hasColorVariants) return getStock(product.stock);
    let sum = 0;
    colors.forEach((c) => {
      if (Array.isArray(c.sizes)) {
        c.sizes.forEach((s) => {
          sum += getStock(s.stock);
        });
      }
    });
    return sum > 0 ? sum : getStock(product.stock);
  }, [colors, hasColorVariants, product.stock]);

  const availableStockCount = useMemo(() => {
    if (hasColorVariants) {
      if (selectedSizeData) {
        return selectedStock;
      }
      return totalVariantStock;
    }
    return getStock(product.stock);
  }, [
    hasColorVariants,
    selectedSizeData,
    selectedStock,
    totalVariantStock,
    product.stock,
  ]);

  const hasVariantSelection = hasColorVariants;
  const variantStockInvalid =
    hasVariantSelection &&
    (!selectedColor ||
      !selectedSize ||
      !selectedSizeData ||
      selectedStock < quantity);

  // ------------------------------------------------------------
  // LOAD CUSTOMER LOCATION
  // ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const loadCustomerLocation = async () => {
      try {
        setCheckingLocation(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (!cancelled) setCustomerLocation(null);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/customers/location`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (!cancelled) setCustomerLocation(null);
          return;
        }

        const result = await response.json();
        if (!cancelled) {
          setCustomerLocation(
            result?.success && result?.customer ? result.customer : null,
          );
        }
      } catch (error) {
        if (!cancelled) setCustomerLocation(null);
      } finally {
        if (!cancelled) setCheckingLocation(false);
      }
    };

    void loadCustomerLocation();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // ------------------------------------------------------------
  // LOCATION & DELIVERY CALCULATION
  // ------------------------------------------------------------
  const deliveryScope = product.deliverySettings?.scope;
  const sellerLocation = product.vendor?.locationDetails ?? null;
  const sellerUpazila = sellerLocation?.upazila?.trim() ?? "";
  const customerUpazila = customerLocation?.upazila?.trim() ?? "";

  const isNationwide = deliveryScope === "NATIONWIDE";
  const hasCustomerLocation = Boolean(customerUpazila);

  const isUpazilaMismatch =
    deliveryScope === "UPAZILA_BASED" &&
    hasCustomerLocation &&
    Boolean(sellerUpazila) &&
    normalize(sellerUpazila) !== normalize(customerUpazila);

  const sellerLocationMissing =
    deliveryScope === "UPAZILA_BASED" && hasCustomerLocation && !sellerUpazila;
  const deliveryScopeMissing = hasCustomerLocation && !deliveryScope;
  const locationRestricted =
    isUpazilaMismatch || sellerLocationMissing || deliveryScopeMissing;

  const getLocationMessage = () => {
    if (deliveryScopeMissing) return "Delivery scope is unavailable.";
    if (isUpazilaMismatch)
      return `Your location is ${customerUpazila}, but seller delivers in ${sellerUpazila}.`;
    if (sellerLocationMissing) return "Seller location is unavailable.";
    return "";
  };

  // ------------------------------------------------------------
  // CALCULATIONS & PRICING
  // ------------------------------------------------------------
  const currentPrice = Number(product.price ?? 0);
  const oldPrice =
    product.oldPrice !== undefined ? Number(product.oldPrice) : null;
  const hasOldPrice = oldPrice !== null && oldPrice > currentPrice;
  const savingAmount = hasOldPrice ? oldPrice - currentPrice : 0;
  const discountPercent =
    product.discount && product.discount > 0
      ? product.discount
      : hasOldPrice
        ? Math.round((savingAmount / oldPrice) * 100)
        : 0;

  const brandName =
    product.brand ||
    (typeof attributes.brand === "string"
      ? attributes.brand
      : "Aladdin Global");

  const soldCount =
    product.soldCount !== undefined && product.soldCount !== null
      ? product.soldCount
      : 0;

  const hasReviews = (product.reviewCount ?? 0) > 0;
  const ratingValue = Number(product.rating ?? 0);
  const displayRating = hasReviews ? ratingValue.toFixed(1) : "0.0";

  // ------------------------------------------------------------
  // ACTIONS
  // ------------------------------------------------------------
  const decrease = () => {
    setQuantity((value) => Math.max(1, value - 1));
  };

  const increase = () => {
    if (hasVariantSelection && selectedSizeData) {
      setQuantity((value) => Math.min(selectedStock, value + 1));
      return;
    }
    setQuantity((value) => Math.min(availableStockCount, value + 1));
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch {
      toast.info("Failed to copy link.");
    }
  };

  const handleToggleWishlist = () => {
    setLiked((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Added to wishlist!");
      } else {
        toast.info("Removed from wishlist");
      }
      return next;
    });
  };

  const handleToggleCompare = () => {
    const primaryImg =
      (typeof product.images?.[0] === "string"
        ? product.images[0]
        : product.images?.[0]?.url) || "";

    const currentSlug =
      typeof window !== "undefined"
        ? window.location.pathname.split("/").filter(Boolean).pop()
        : undefined;

    toggleCompare({
      id: product.id,
      slug: currentSlug || product.id,
      title: product.name,
      image: primaryImg,
      price: product.price,
      regularPrice: product.oldPrice,
      rating: product.rating,
      reviewsCount: product.reviewCount,
      moq: "1",
      category: product.category,
      brand: product.brand,
      storeName: product.sellerName || product.vendor?.name,
      stock: product.stock,
      description: product.shortDescription || product.description,
    });
  };

  // ------------------------------------------------------------
  // ADD TO CART & BUY NOW
  // ------------------------------------------------------------
  const handleAddToCart = async (goToCheckout = false) => {
    if (checkingLocation || locationRestricted || addingToCart) {
      return;
    }

    setStatusMessage("");
    setStatusType("");

    if (variantStockInvalid) {
      setStatusType("error");
      if (!selectedColor) {
        setStatusMessage("Please select a color before adding to cart.");
      } else if (!selectedSize) {
        setStatusMessage("Please select a size before adding to cart.");
      } else if (selectedStock <= 0) {
        setStatusMessage("Selected size is currently out of stock.");
      } else {
        setStatusMessage(
          `Only ${selectedStock} item(s) available in selected size.`,
        );
      }
      return;
    }

    setAddingToCart(true);

    try {
      const productId = String(product.id ?? "").trim();
      const vendorId = String(
        product.sellerId || product.vendor?.id || "",
      ).trim();

      if (!productId || productId === "undefined" || productId === "null") {
        setStatusType("error");
        setStatusMessage("Product ID not found.");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setStatusType("error");
        setStatusMessage("Please login to add items to your cart.");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/customer/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        setStatusType("error");
        setStatusMessage(
          result?.message || result?.error || "Failed to add product to cart.",
        );
        return;
      }

      // Update localStorage fallback
      let rawCart: unknown = [];
      try {
        rawCart = JSON.parse(localStorage.getItem("cart") || "[]");
      } catch {
        rawCart = [];
      }

      const cart: StoredCartItem[] = Array.isArray(rawCart)
        ? rawCart.filter((item): item is StoredCartItem => isRecord(item))
        : [];

      const productImage = getValidImageUrl(
        product.images?.find(
          (img: any) => img?.url || typeof img === "string",
        ) || product.images?.[0],
      );

      const variantKey = `${productId}:${selectedColor}:${selectedSize}`;
      const existingIndex = cart.findIndex((item) => item.id === variantKey);

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: hasVariantSelection ? variantKey : productId,
          vendorId: vendorId || "default",
          name: hasVariantSelection
            ? `${product.name} - ${selectedColor} / ${selectedSize}`
            : product.name,
          price: product.price,
          quantity,
          image: getValidImageUrl(activeColor?.images?.[0]) || productImage,
          deliverySettings: product.deliverySettings ?? null,
          vendorLocation: product.vendor?.locationDetails ?? null,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success(
        goToCheckout
          ? "Redirecting to checkout..."
          : "Product added to cart successfully!",
      );

      if (goToCheckout) {
        router.push("/checkout");
      } else {
        router.push("/cart");
      }
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      setStatusType("error");
      setStatusMessage("Error adding product to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="space-y-4">
      {/* 1. PRODUCT TITLE */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#12233f] leading-snug tracking-tight">
          {product.name}
        </h1>
      </div>

      {/* 2. RATING, REVIEWS, SOLD & ACTIONS (SHARE & LIKE) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        {/* Left: Star rating | Reviews | Sold */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 border border-amber-200/60">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill={
                    hasReviews && index < Math.round(ratingValue)
                      ? "currentColor"
                      : "none"
                  }
                  className={
                    hasReviews && index < Math.round(ratingValue)
                      ? "text-amber-500"
                      : "text-slate-300"
                  }
                />
              ))}
            </div>
            <span className="font-bold text-amber-950">{displayRating}</span>
          </div>

          <span className="text-slate-300">|</span>

          <span className="text-slate-600 font-medium">
            <b className="text-slate-900">{product.reviewCount ?? 0}</b> Reviews
          </span>

          <span className="text-slate-300">|</span>

          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-100">
            {soldCount} Sold
          </span>
        </div>

        {/* Right: Compare, Share & Like buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleCompare}
            title={inCompare ? "Remove from comparison" : "Add to comparison"}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition ${
              inCompare
                ? "border-amber-300 bg-amber-50 text-amber-700 font-bold"
                : "border-slate-200 bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700"
            }`}
          >
            <GitCompareArrows
              size={14}
              className={inCompare ? "text-amber-600" : "text-slate-500"}
            />
            <span>{inCompare ? "Compared" : "Compare"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            title="Share"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Share2 size={14} className="text-slate-500" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={handleToggleWishlist}
            title={liked ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition ${
              liked
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Heart
              size={14}
              fill={liked ? "currentColor" : "none"}
              className={liked ? "text-rose-500" : "text-slate-500"}
            />
            <span>{liked ? "Liked" : "Like"}</span>
          </button>
        </div>
      </div>

      {/* 3. VERTICAL PRODUCT META (Category, SKU, Brand, Short des, Sold by) */}
      <div className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs">
        {/* Category */}
        <div className="flex items-start gap-2">
          <span className="w-24 sm:w-28 shrink-0 font-medium text-slate-400">
            Category:
          </span>
          <span className="font-semibold text-slate-800">
            {product.category || "General"}
            {product.subcategory ? ` / ${product.subcategory}` : ""}
          </span>
        </div>

        {/* SKU */}
        <div className="flex items-start gap-2">
          <span className="w-24 sm:w-28 shrink-0 font-medium text-slate-400">
            SKU:
          </span>
          <span className="font-mono font-semibold text-slate-700">
            {product.sku || "N/A"}
          </span>
        </div>

        {/* Brand */}
        <div className="flex items-start gap-2">
          <span className="w-24 sm:w-28 shrink-0 font-medium text-slate-400">
            Brand:
          </span>
          <span className="font-bold text-blue-700">{brandName}</span>
        </div>

        {/* Short description */}
        <div className="flex items-start gap-2">
          <span className="w-24 sm:w-28 shrink-0 font-medium text-slate-400">
            Short des:
          </span>
          <p className="font-normal text-slate-700 leading-relaxed">
            {product.shortDescription ||
              product.description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
              "Quality product from verified supplier."}
          </p>
        </div>

        {/* Sold by */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5 border-t border-slate-200/60">
          <span className="w-24 sm:w-28 shrink-0 font-medium text-slate-400">
            Sold by:
          </span>
          <div className="flex flex-wrap items-center gap-2 font-semibold text-[#12233f]">
            <span>
              {product.sellerName || product.vendor?.name || "Official Store"}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
              Verified Seller
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200/60">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>
                {product.vendor?.positiveSellerRating
                  ? `${product.vendor.positiveSellerRating}% Positive Rating`
                  : "96% Positive Rating"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 3.5. CATEGORY SPECIFIC HIGHLIGHT BADGES */}
      <ProductCategoryHighlights product={product} />

      {/* 4. PRICING SECTION */}
      <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50/60 via-orange-50/30 to-amber-50/10 p-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-extrabold text-[#12233f]">
            ৳{currentPrice.toLocaleString()}
          </span>

          {hasOldPrice && (
            <span className="text-base font-semibold text-slate-400 line-through">
              ৳{oldPrice.toLocaleString()}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}

          {savingAmount > 0 && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              ({savingAmount} tk off)
            </span>
          )}
        </div>
      </div>

      {/* 5. COLOR & SIZE VARIANTS */}
      {hasColorVariants && (
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-[#12233f]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Color &amp; Size
            </h3>
          </div>

          {/* Color Selection */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-600">
              Color:{" "}
              {selectedColor ? (
                <span className="font-bold text-slate-900">
                  {selectedColor}
                </span>
              ) : (
                <span className="text-amber-600 font-normal">
                  (Select a color)
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => {
                const isSelected = selectedColor === color.color;
                return (
                  <button
                    key={color.color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color.color);
                      const firstAvailableSize =
                        color.sizes?.find((s) => getStock(s.stock) > 0) ||
                        color.sizes?.[0];
                      setSelectedSize(firstAvailableSize?.size || "");
                      setQuantity(1);
                      setStatusMessage("");
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? "border-[#12233f] bg-[#12233f] text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    {color.color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          {activeColor && (
            <div>
              <p className="mb-1.5 text-xs font-semibold text-slate-600">
                Size:{" "}
                {selectedSize ? (
                  <span className="font-bold text-slate-900">
                    {selectedSize}
                  </span>
                ) : (
                  <span className="text-amber-600 font-normal">
                    (Select a size)
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const stock = getStock(size.stock);
                  const outOfStock = stock <= 0;
                  const selected = selectedSize === size.size;

                  return (
                    <button
                      key={`${activeColor.color}-${size.size}`}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => {
                        setSelectedSize(size.size);
                        setQuantity(1);
                        setStatusMessage("");
                      }}
                      className={`min-w-12 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        outOfStock
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                          : selected
                            ? "border-[#12233f] bg-[#12233f] font-bold text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <span>{size.size}</span>
                      {!outOfStock && (
                        <span
                          className={`ml-1 text-[10px] ${
                            selected ? "text-amber-200" : "text-slate-400"
                          }`}
                        >
                          ({stock})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 7. QUANTITY & IN STOCK */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Quantity:</span>

          <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={decrease}
              disabled={quantity <= 1}
              className="flex h-full w-9 items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>

            <span className="flex w-10 justify-center text-xs font-bold text-slate-900">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increase}
              disabled={
                hasVariantSelection &&
                Boolean(selectedSizeData) &&
                quantity >= selectedStock
              }
              className="flex h-full w-9 items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Stock Status Badge */}
        {availableStockCount > 0 ? (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>In Stock ({availableStockCount} available)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200/70">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* 8. ACTION CTA BUTTONS (DESKTOP & INLINE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => void handleAddToCart(true)}
          disabled={
            addingToCart ||
            checkingLocation ||
            locationRestricted ||
            variantStockInvalid ||
            availableStockCount <= 0
          }
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#12233f] text-sm font-extrabold shadow-sm transition hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap size={18} className="fill-[#12233f]" />
          <span>Buy Now</span>
        </button>

        <button
          type="button"
          onClick={() => void handleAddToCart(false)}
          disabled={
            addingToCart ||
            checkingLocation ||
            locationRestricted ||
            variantStockInvalid ||
            availableStockCount <= 0
          }
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#12233f] hover:bg-[#1b3155] text-white text-sm font-extrabold shadow-sm transition hover:shadow active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={18} />
          <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>

      {/* 9. COMPACT DELIVERY SUMMARY */}
      <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-2.5 text-xs space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">
              Delivery Location:{" "}
              <b className="text-slate-800">
                {customerUpazila ||
                  customerLocation?.district ||
                  "All Bangladesh"}
              </b>
            </span>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700">
            {isNationwide ? "Nationwide Delivery" : "Cash on Delivery"}
          </span>
        </div>

        {locationRestricted && (
          <p className="text-[11px] text-red-600 font-medium">
            {getLocationMessage()}
          </p>
        )}
      </div>

      {/* Inline status message */}
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-2 rounded-lg border p-3 text-xs font-semibold ${
            statusType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statusType === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle size={16} className="shrink-0 text-red-600" />
          )}
          <p>{statusMessage}</p>
        </div>
      )}

      {/* 10. MOBILE FLOATING STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-2.5">
          {/* Price & Stock info */}
          <div className="min-w-0 pr-1">
            <p className="text-xs text-slate-400 font-medium leading-none">
              Total Price
            </p>
            <p className="text-lg font-black text-[#12233f] leading-tight">
              ৳{(currentPrice * quantity).toLocaleString()}
            </p>
            {hasOldPrice && (
              <p className="text-[10px] text-slate-400 line-through leading-none">
                ৳{(oldPrice * quantity).toLocaleString()}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleAddToCart(false)}
              disabled={
                addingToCart ||
                checkingLocation ||
                locationRestricted ||
                variantStockInvalid ||
                availableStockCount <= 0
              }
              className="flex h-10 px-3 items-center justify-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#12233f] text-xs font-bold transition active:scale-95 disabled:opacity-40"
              title="Add to Cart"
            >
              <ShoppingCart size={15} />
              <span>Cart</span>
            </button>

            <button
              type="button"
              onClick={() => void handleAddToCart(true)}
              disabled={
                addingToCart ||
                checkingLocation ||
                locationRestricted ||
                variantStockInvalid ||
                availableStockCount <= 0
              }
              className="flex h-10 px-4 items-center justify-center gap-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#12233f] text-xs font-extrabold shadow-sm transition active:scale-95 disabled:opacity-40"
            >
              <Zap size={15} className="fill-[#12233f]" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
