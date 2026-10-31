"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import LocationModal from "@/app/(pages)/set-location/LocationModal";
import { createClient } from "../../../../../lib/supabase-client";
import { ProductDetails, ProductVariant, ProductImage } from "../types";
import ProductTabs from "../components/ProductTabs";
import RelatedProducts from "../components/RelatedProducts";
import DeliveryOptions from "../components/DeliveryOptions";
import ProductInfo from "../components/ProductInfo";
import ProductGallery from "../components/ProductGallery";
import ProductBreadcrumb from "../components/ProductBreadcrumb";
import FrequentlyBought from "../components/FrequentlyBought";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type CustomerLocation = {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
  area?: string | null;
  address?: string | null;
};

type CustomerLocationResponse = {
  success?: boolean;
  customer?: CustomerLocation | null;
  error?: string;
  message?: string;
};

const supabase = createClient();

export default function ProductDetailsPage({ params }: Props) {
  const { slug } = React.use(params);

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customerLocation, setCustomerLocation] =
    useState<CustomerLocation | null>(null);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // =====================================================
  // CUSTOMER LOCATION
  // =====================================================

  const fetchCustomerLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session?.access_token) {
        setCustomerLocation(null);
        return;
      }

      const response = await fetch(`${API_URL}/api/customers/location`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 404) {
        setCustomerLocation(null);
        return;
      }

      const result: CustomerLocationResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || result.message || "Customer location লোড করা যায়নি।",
        );
      }

      const location = result.customer;

      setCustomerLocation(
        location
          ? {
              division: location.division ?? null,
              district: location.district ?? null,
              upazila: location.upazila ?? null,
              area: location.area ?? null,
              address: location.address ?? null,
            }
          : null,
      );
    } catch (err) {
      console.error("CUSTOMER LOCATION ERROR:", err);

      setCustomerLocation(null);
      setLocationError(
        err instanceof Error ? err.message : "Customer location লোড করা যায়নি।",
      );
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCustomerLocation();
  }, [fetchCustomerLocation]);

  // =====================================================
  // PRODUCT DATA
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/api/products/${encodeURIComponent(slug)}`,
          { cache: "no-store" },
        );

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const responseText = await response.text();

          console.error("PRODUCT API NON-JSON RESPONSE:", responseText);

          throw new Error(
            `Product API returned ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Failed to fetch product");
        }

        if (!result.success || !result.data) {
          throw new Error("Product not found");
        }

        const item = result.data;

        // IMAGES

        const imageList: ProductImage[] = [];

        if (Array.isArray(item.images)) {
          item.images.forEach((url: unknown, index: number) => {
            if (typeof url === "string" && url.trim()) {
              imageList.push({
                id: `product-image-${index}`,
                url,
                alt: item.title || "Product",
              });
            }
          });
        }

        const colors = item.attributes?.colors;

        if (Array.isArray(colors)) {
          colors.forEach((color: any, colorIndex: number) => {
            if (!Array.isArray(color?.images)) return;

            color.images.forEach((url: unknown, imageIndex: number) => {
              if (typeof url !== "string" || !url.trim()) {
                return;
              }

              const alreadyExists = imageList.some(
                (image) => image.url === url,
              );

              if (!alreadyExists) {
                imageList.push({
                  id: `color-${colorIndex}-image-${imageIndex}`,
                  url,
                  alt: `${item.title || "Product"}${
                    color?.name ? ` - ${color.name}` : ""
                  }`,
                });
              }
            });
          });
        }

        // PRICING

        const regularPrice = Number(item.pricing?.customerRegularPrice ?? 0);

        const salePrice =
          item.pricing?.customerSalePrice !== null &&
          item.pricing?.customerSalePrice !== undefined
            ? Number(item.pricing.customerSalePrice)
            : undefined;

        const currentPrice = salePrice ?? regularPrice;

        let discount: number | undefined;

        if (
          salePrice !== undefined &&
          regularPrice > 0 &&
          salePrice < regularPrice
        ) {
          discount = Math.round(
            ((regularPrice - salePrice) / regularPrice) * 100,
          );
        }

        // RATINGS & REVIEWS (Real calculation from DB reviews)
        const publishedReviews = Array.isArray(item.reviews)
          ? item.reviews.filter(
              (r: any) => r.status === "PUBLISHED" || !r.status,
            )
          : [];

        const totalReviewsCount =
          publishedReviews.length > 0
            ? publishedReviews.length
            : Number(item.topRatedAttribute?.totalReviews ?? 0);

        const calculatedAvgRating =
          publishedReviews.length > 0
            ? Number(
                (
                  publishedReviews.reduce(
                    (sum: number, r: any) => sum + Number(r.rating || 0),
                    0,
                  ) / publishedReviews.length
                ).toFixed(1),
              )
            : Number(item.topRatedAttribute?.averageRating ?? 0);

        const rating = calculatedAvgRating;
        const reviewCount = totalReviewsCount;

        // SPECIFICATIONS

        const specifications: {
          label: string;
          value: string;
        }[] = [];

        if (item.category?.name) {
          specifications.push({
            label: "Category",
            value: item.category.name,
          });
        }

        specifications.push(
          {
            label: "Product ID",
            value: String(item.id ?? ""),
          },
          {
            label: "Product SKU",
            value: String(item.sku ?? ""),
          },
          {
            label: "Product Slug",
            value: String(item.slug ?? ""),
          },
          {
            label: "Stock",
            value: String(item.stockQuantity ?? 0),
          },
        );

        if (
          item.attributes &&
          typeof item.attributes === "object" &&
          !Array.isArray(item.attributes)
        ) {
          Object.entries(item.attributes).forEach(([key, value]) => {
            if (key === "colors" || value === null || value === undefined) {
              return;
            }

            let displayValue = "";

            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              displayValue = String(value);
            } else {
              try {
                displayValue = JSON.stringify(value);
              } catch {
                displayValue = String(value);
              }
            }

            if (displayValue) {
              const formattedLabel = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (char) => char.toUpperCase());

              specifications.push({
                label: formattedLabel,
                value: displayValue,
              });
            }
          });
        }

        // VARIANTS

        const variants: ProductVariant[] = Array.isArray(colors)
          ? colors.map((color: any, index: number) => ({
              id: String(color?.id || `color-${index}`),
              name: "Color",
              value: color?.name || color?.color || `Option ${index + 1}`,
              available: color?.available !== false,
            }))
          : [];

        // LEGACY DELIVERY DATA

        const deliveryData = item.attributes?.delivery;

        const delivery = {
          availableArea:
            deliveryData?.availableArea ||
            "Delivery availability will be confirmed during checkout.",

          location: deliveryData?.location || "Bangladesh",

          deliveryTime:
            deliveryData?.deliveryTime ||
            "Delivery time will depend on your location.",

          shippingCharge: Number(deliveryData?.shippingCharge ?? 0),

          freeShippingMinimum:
            deliveryData?.freeShippingMinimum !== undefined
              ? Number(deliveryData.freeShippingMinimum)
              : undefined,

          collectionPoint: Boolean(deliveryData?.collectionPoint),

          cashOnDelivery: deliveryData?.cashOnDelivery !== false,
        };

        // RETURN POLICY

        const returnPolicy = Array.isArray(item.attributes?.returnPolicy)
          ? item.attributes.returnPolicy
          : ["Return policy information is not available yet."];

        // VENDOR

        const vendor = item.vendor ?? null;

        const sellerName =
          vendor?.storeName ||
          vendor?.user?.fullName ||
          "Seller information unavailable";

        const sellerId = vendor?.id ? String(vendor.id) : undefined;

        // VENDOR LOCATION

        const vendorLocationDetails = vendor?.location
          ? {
              division: vendor.location.division ?? null,
              district: vendor.location.district ?? null,
              upazila: vendor.location.upazila ?? null,
              area: vendor.location.area ?? null,
              fullAddress: vendor.location.fullAddress ?? null,
            }
          : null;

        const vendorLocationParts = [
          vendorLocationDetails?.area,
          vendorLocationDetails?.upazila,
          vendorLocationDetails?.district,
          vendorLocationDetails?.division,
        ].filter(
          (part): part is string =>
            typeof part === "string" && part.trim().length > 0,
        );

        const vendorLocation =
          vendorLocationParts.length > 0
            ? vendorLocationParts.join(", ")
            : vendorLocationDetails?.fullAddress ||
              "Location information unavailable";

        // DELIVERY SETTINGS

        const rawDeliverySettings = item.deliverySettings;
        const rawScope = rawDeliverySettings?.scope;

        const deliveryScope =
          rawScope === "NATIONWIDE" || rawScope === "UPAZILA_BASED"
            ? rawScope
            : null;

        const deliverySettings = rawDeliverySettings
          ? {
              scope: deliveryScope,

              weightKg:
                rawDeliverySettings.weightKg !== null &&
                rawDeliverySettings.weightKg !== undefined
                  ? Number(rawDeliverySettings.weightKg)
                  : null,

              rates: Array.isArray(rawDeliverySettings.rates)
                ? rawDeliverySettings.rates.map((rate: any) => ({
                    minDistanceKm: Number(rate.minDistanceKm),
                    maxDistanceKm: Number(rate.maxDistanceKm),
                    firstKgCharge: Number(rate.firstKgCharge),
                    additionalKgCharge: Number(rate.additionalKgCharge),
                  }))
                : [],

              nationwideCharge:
                rawDeliverySettings.nationwideCharge !== null &&
                rawDeliverySettings.nationwideCharge !== undefined
                  ? Number(rawDeliverySettings.nationwideCharge)
                  : null,
            }
          : null;

        // SELLER METRICS
        const vendorData = item.vendor as any;
        const positiveSellerRating =
          vendorData?.positiveSellerRating !== undefined &&
          Number(vendorData.positiveSellerRating) > 0
            ? Number(vendorData.positiveSellerRating)
            : item.reviews?.length
              ? Math.round(
                  (item.reviews.filter((r: any) => Number(r.rating) >= 4)
                    .length /
                    item.reviews.length) *
                    100,
                )
              : 96;

        const shippingOnTime =
          vendorData?.shippingOnTime !== undefined &&
          Number(vendorData.shippingOnTime) > 0
            ? Number(vendorData.shippingOnTime)
            : 98;

        const averageVendorRating =
          vendorData?.averageRating !== undefined &&
          Number(vendorData.averageRating) > 0
            ? Number(vendorData.averageRating)
            : 4.8;

        const totalVendorReviews =
          vendorData?.totalReviews !== undefined
            ? Number(vendorData.totalReviews)
            : item.reviews?.length || 0;

        // FINAL PRODUCT

        const mappedProduct: ProductDetails = {
          id: String(item.id),
          name: item.title || "Untitled Product",

          category: item.category?.name || "General",
          categorySlug: item.category?.slug || undefined,
          subcategory: item.attributes?.subcategory || undefined,

          sku: String(item.sku ?? ""),
          brand:
            item.brand?.name ||
            (typeof item.attributes?.brand === "string"
              ? item.attributes.brand
              : undefined),
          stock:
            item.stockQuantity !== undefined && item.stockQuantity !== null
              ? Number(item.stockQuantity)
              : undefined,
          soldCount:
            item.totalSold !== undefined
              ? Number(item.totalSold)
              : item.soldCount !== undefined
                ? Number(item.soldCount)
                : undefined,
          shortDescription:
            item.shortDescription ||
            (typeof item.attributes?.shortDescription === "string"
              ? item.attributes.shortDescription
              : undefined),
          attributes: item.attributes || null,

          sellerName,
          sellerId,

          price: currentPrice,

          oldPrice:
            salePrice !== undefined && salePrice < regularPrice
              ? regularPrice
              : undefined,

          discount,
          rating,
          reviewCount,

          images: imageList,

          description:
            item.description ||
            item.shortDescription ||
            "No product description available.",

          specifications,
          variants,
          delivery,
          returnPolicy,

          vendor: {
            id: sellerId,
            name: sellerName,
            location: vendorLocation,
            locationDetails: vendorLocationDetails,
            positiveSellerRating,
            shippingOnTime,
            averageRating: averageVendorRating,
            totalReviews: totalVendorReviews,
          },

          deliverySettings,

          relatedProducts: [],
          boughtTogether: [],
        };

        console.log("Vendor location from API:", vendor?.location);
        console.log("Delivery settings from API:", item.deliverySettings);
        console.log("Mapped vendor location:", vendorLocationDetails);

        if (!cancelled) {
          setProduct(mappedProduct);
        }
      } catch (err: unknown) {
        console.error("PRODUCT DETAILS ERROR:", err);

        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load product",
          );

          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      void fetchProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#12233f]" />
              <p className="mt-4 text-sm text-slate-500">Loading product...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">
              !
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#12233f]">
              Product Not Found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || "The requested product could not be found."}
            </p>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="mt-6 rounded-lg bg-[#12233f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1b3155]"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-50 pb-24 sm:pb-12">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <ProductBreadcrumb
          category={product.category}
          subcategory={product.subcategory}
          productName={product.name}
        />

        <section className="mt-4 sm:mt-5 grid gap-4 lg:gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(310px,0.75fr)]">
          {/* GALLERY */}

          <div className="min-w-0">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xs">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>
          </div>

          {/* PRODUCT INFO */}

          <div className="min-w-0">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-6 shadow-xs">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* DELIVERY + SELLER */}

          <div className="min-w-0 space-y-4">
            <DeliveryOptions
              delivery={product.delivery}
              deliverySettings={product.deliverySettings}
              vendorLocation={product.vendor.locationDetails}
              customerLocation={customerLocation}
              returnPolicy={product.returnPolicy}
              onChangeLocation={() => setLocationModalOpen(true)}
            />

            {locationLoading && (
              <p className="mt-2 text-xs text-slate-500">
                Customer location লোড হচ্ছে...
              </p>
            )}

            {locationError && (
              <p className="mt-2 text-xs text-red-600">
                লোকেশন লোড করা যায়নি। আবার চেষ্টা করো।
              </p>
            )}

            {/* SELLER CARD */}

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sold by Seller
                  </p>

                  <h3 className="mt-0.5 text-base font-bold text-[#12233f] truncate">
                    {product.vendor.name}
                  </h3>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12233f] text-sm font-bold text-white shadow-xs">
                  {product.vendor.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              </div>

              <div className="mt-3.5 space-y-2.5 border-t border-slate-100 pt-3.5 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="shrink-0 text-slate-500">Location</span>

                  <span className="text-right font-medium text-slate-800 truncate">
                    {product.vendor.location}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Seller rating</span>

                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    {product.vendor.positiveSellerRating > 0
                      ? `${product.vendor.positiveSellerRating}% Positive`
                      : "96% Positive"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Shipping on time</span>

                  <span className="font-semibold text-emerald-600">
                    {product.vendor.shippingOnTime > 0
                      ? `${product.vendor.shippingOnTime}%`
                      : "98%"}
                  </span>
                </div>
              </div>

              {product.sellerId ? (
                <Link
                  href={`/vendor/store/${product.sellerId}`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#12233f] px-4 py-2.5 text-xs font-bold text-[#12233f] transition hover:bg-[#12233f] hover:text-white"
                >
                  View Seller Store
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-4 w-full cursor-not-allowed rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-400"
                >
                  Seller Store Unavailable
                </button>
              )}
            </div>
          </div>
        </section>

        {/* TABS */}

        <section className="mt-7">
          <ProductTabs product={product} />
        </section>

        {/* FREQUENTLY BOUGHT */}

        {product.boughtTogether.length > 0 && (
          <section className="mt-10">
            <FrequentlyBought products={product.boughtTogether} />
          </section>
        )}

        {/* RELATED PRODUCTS */}

        {product.relatedProducts.length > 0 && (
          <section className="mt-10">
            <RelatedProducts
              title="Related Products"
              products={product.relatedProducts}
            />
          </section>
        )}
      </div>

      {/* EXISTING LOCATION MODAL */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSaved={() => {
          void fetchCustomerLocation();
        }}
      />
    </main>
  );
}
