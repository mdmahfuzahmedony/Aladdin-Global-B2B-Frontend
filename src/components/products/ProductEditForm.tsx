"use client";

import React, { useEffect, useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Package,
  Save,
  Store,
  UserRound,
  ChevronDown,
} from "lucide-react";

import type {
  ProductBasicInfo,
  ProductFieldDefinition,
  ProductPlacement as PlacementType,
  NewArrivalData,
  FlashSaleData,
  FeaturedData,
  TopSellerData,
  TopRatedData,
  TrustedData,
} from "@/app/(dashboard)/admin/products/add-product/components/product-placement/types";

import ProductInformation, {
  type Category,
} from "@/app/(dashboard)/admin/products/add-product/components/ProductInformation";
import ProductPricing from "@/app/(dashboard)/admin/products/add-product/components/ProductPricing";
import ProductInventory from "@/app/(dashboard)/admin/products/add-product/components/ProductInventory";
import ProductPlacement from "@/app/(dashboard)/admin/products/add-product/components/ProductPlacement";
import ProductSummary from "@/app/(dashboard)/admin/products/add-product/components/ProductSummary";
import ProductDelivery, {
  type ProductDeliveryData,
} from "@/app/(dashboard)/admin/products/add-product/components/ProductDelivery";
import ProductImageUploader from "@/app/(dashboard)/admin/products/add-product/components/product-field/ProductImageUploader";
import { createClient } from "../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type VendorOption = {
  id: string;
  userId: string;
  name: string;
  storeName: string;
  businessCategory?: string | null;
  status?: string;
  email?: string | null;
  phone?: string | null;
};

type ProductOwnershipType = "MY_STORE" | "SELLER_PRODUCT";

export type ProductEditFormProps = {
  role: "ADMIN" | "VENDOR";
  slugOrId: string;
};

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function hasValue(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

export default function ProductEditForm({
  role,
  slugOrId,
}: ProductEditFormProps) {
  const router = useRouter();

  const [productId, setProductId] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [form, setForm] = useState<ProductBasicInfo>({
    title: "",
    slug: "",
    sku: "",
    shortDescription: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    stockQuantity: "",
    categoryId: "",
    purchasePrice: "",
    customerRegularPrice: "",
    customerSalePrice: "",
    sellerRegularPrice: "",
    sellerSalePrice: "",
    wholesalerRegularPrice: "",
    wholesalerSalePrice: "",
    dropshipPrice: "",
    affiliateCommissionType: "",
    affiliateCommissionValue: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  // Product Images
  const [images, setImages] = useState<string[]>([]);

  // Category
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  // Dynamic Attributes & Custom fields
  const [productAttributes, setProductAttributes] = useState<
    Record<string, any>
  >({});
  const [customFields, setCustomFields] = useState<ProductFieldDefinition[]>(
    [],
  );

  // Coupon
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");

  // Delivery
  const [delivery, setDelivery] = useState<ProductDeliveryData>({
    scope: "UPAZILA_BASED",
    weightKg: "",
    nationwideCharge: "",
    rates: [
      {
        minDistanceKm: "1",
        maxDistanceKm: "3",
        firstKgCharge: "3",
        additionalKgCharge: "33.98",
      },
    ],
  });

  // Placements
  const [selectedPlacements, setSelectedPlacements] = useState<PlacementType[]>(
    [],
  );
  const [newArrival, setNewArrival] = useState<NewArrivalData>({
    badgeText: "",
    displayOrder: "",
    startDate: "",
    endDate: "",
  });
  const [flashSale, setFlashSale] = useState<FlashSaleData>({
    flashSalePrice: "",
    flashSaleStock: "",
    startTime: "",
    endTime: "",
    discountBadge: "",
  });
  const [featured, setFeatured] = useState<FeaturedData>({
    featuredBadgeText: "",
    bannerImage: "",
    displayOrder: "",
  });
  const [topSeller, setTopSeller] = useState<TopSellerData>({
    unitsSold: "",
    salesBadge: "",
    isExpressEligible: false,
  });
  const [topRated, setTopRated] = useState<TopRatedData>({
    averageRating: "",
    totalReviews: "",
    reviewSnippet: "",
  });
  const [trusted, setTrusted] = useState<TrustedData>({
    trustBadgeText: "",
    warrantyInfo: "",
    officialStore: false,
  });

  // Admin Ownership
  const [ownershipType, setOwnershipType] =
    useState<ProductOwnershipType>("MY_STORE");
  const [selectedSellerId, setSelectedSellerId] = useState("");
  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [myVendor, setMyVendor] = useState<VendorOption | null>(null);

  const updateField = useCallback(
    (field: keyof ProductBasicInfo, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors([]);
    },
    [],
  );

  const handleTitleChange = useCallback((value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug ? prev.slug : generateSlug(value),
    }));
    setErrors([]);
  }, []);

  const togglePlacement = (placement: PlacementType) => {
    setSelectedPlacements((prev) =>
      prev.includes(placement)
        ? prev.filter((item) => item !== placement)
        : [...prev, placement],
    );
  };

  const isPlacementSelected = (placement: PlacementType) =>
    selectedPlacements.includes(placement);

  // Load vendors for admin
  useEffect(() => {
    if (role !== "ADMIN") return;

    let cancelled = false;
    async function loadVendors() {
      try {
        setIsLoadingVendors(true);
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const res = await fetch(`${API_BASE_URL}/api/vendors`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json().catch(() => null);
        if (res.ok && Array.isArray(json?.data) && !cancelled) {
          const list: VendorOption[] = json.data.map((v: any) => ({
            id: String(v.id),
            userId: String(v.userId || ""),
            name: String(v.user?.fullName || v.storeName || "Unknown"),
            storeName: String(v.storeName || "Store"),
            businessCategory: v.businessCategory || null,
            status: v.status || "APPROVED",
            email: v.user?.email || null,
            phone: v.user?.phone || null,
          }));
          setVendors(list);

          const currentUserId = session.user?.id;
          const matched = list.find((v) => v.userId === currentUserId);
          if (matched) setMyVendor(matched);
        }
      } catch (e) {
        console.error("Failed to load vendors:", e);
      } finally {
        if (!cancelled) setIsLoadingVendors(false);
      }
    }
    loadVendors();
    return () => {
      cancelled = true;
    };
  }, [role]);

  // Load product details
  useEffect(() => {
    if (!slugOrId) return;

    let cancelled = false;
    async function loadProduct() {
      setInitialLoading(true);
      setFetchError("");

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/api/products/${encodeURIComponent(slugOrId)}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success || !json?.data) {
          throw new Error(
            json?.error || json?.message || "Product পাওয়া যায়নি।",
          );
        }

        if (cancelled) return;
        const p = json.data;

        setProductId(p.id);

        setForm({
          title: p.title || "",
          slug: p.slug || "",
          sku: p.sku || "",
          shortDescription: p.shortDescription || "",
          description: p.description || "",
          regularPrice: String(p.pricing?.customerRegularPrice ?? ""),
          salePrice: String(p.pricing?.customerSalePrice ?? ""),
          stockQuantity: String(p.stockQuantity ?? 0),
          categoryId: p.categoryId || "",
          purchasePrice: String(p.pricing?.purchasePrice ?? ""),
          customerRegularPrice: String(p.pricing?.customerRegularPrice ?? ""),
          customerSalePrice: String(p.pricing?.customerSalePrice ?? ""),
          sellerRegularPrice: String(p.pricing?.sellerRegularPrice ?? ""),
          sellerSalePrice: String(p.pricing?.sellerSalePrice ?? ""),
          wholesalerRegularPrice: String(
            p.pricing?.wholesalerRegularPrice ?? "",
          ),
          wholesalerSalePrice: String(p.pricing?.wholesalerSalePrice ?? ""),
          dropshipPrice: String(p.pricing?.dropshipPrice ?? ""),
          affiliateCommissionType: p.pricing?.affiliateCommissionType || "",
          affiliateCommissionValue: String(
            p.pricing?.affiliateCommissionValue ?? "",
          ),
        });

        if (Array.isArray(p.images)) {
          setImages(
            p.images.filter(
              (img: unknown) => typeof img === "string" && img.trim(),
            ),
          );
        }

        if (p.category) {
          setSelectedCategory({
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
            type: p.category.type || null,
            fieldsConfig: p.category.fieldsConfig || null,
            parentId: p.category.parentId || null,
          });
        }

        if (p.attributes && typeof p.attributes === "object") {
          setProductAttributes(p.attributes);
        }

        if (Array.isArray(p.customFields)) {
          setCustomFields(p.customFields);
        }

        // Delivery
        if (p.deliverySettings) {
          const ds = p.deliverySettings;
          setDelivery({
            scope: ds.scope === "NATIONWIDE" ? "NATIONWIDE" : "UPAZILA_BASED",
            weightKg: ds.weightKg != null ? String(ds.weightKg) : "",
            nationwideCharge:
              ds.nationwideCharge != null ? String(ds.nationwideCharge) : "",
            rates: Array.isArray(ds.rates)
              ? ds.rates.map((r: any) => ({
                  minDistanceKm: String(r.minDistanceKm ?? ""),
                  maxDistanceKm: String(r.maxDistanceKm ?? ""),
                  firstKgCharge: String(r.firstKgCharge ?? ""),
                  additionalKgCharge: String(r.additionalKgCharge ?? ""),
                }))
              : [],
          });
        }

        // Coupon
        if (p.coupon) {
          setCouponEnabled(true);
          setCouponName(p.coupon.couponName || "");
          setCouponDiscount(
            p.coupon.discount != null ? String(p.coupon.discount) : "",
          );
        } else {
          setCouponEnabled(false);
          setCouponName("");
          setCouponDiscount("");
        }

        // Placements
        const activePlacements: PlacementType[] = [];
        if (p.newArrivalAttribute) {
          activePlacements.push("NEW_ARRIVAL");
          setNewArrival({
            badgeText: p.newArrivalAttribute.badgeText || "",
            displayOrder: String(p.newArrivalAttribute.displayOrder ?? ""),
            startDate: p.newArrivalAttribute.startDate
              ? new Date(p.newArrivalAttribute.startDate)
                  .toISOString()
                  .slice(0, 10)
              : "",
            endDate: p.newArrivalAttribute.endDate
              ? new Date(p.newArrivalAttribute.endDate)
                  .toISOString()
                  .slice(0, 10)
              : "",
          });
        }
        if (p.flashSaleAttribute) {
          activePlacements.push("FLASH_SALE");
          setFlashSale({
            flashSalePrice: String(p.flashSaleAttribute.flashSalePrice ?? ""),
            flashSaleStock: String(p.flashSaleAttribute.flashSaleStock ?? ""),
            startTime: p.flashSaleAttribute.startTime
              ? new Date(p.flashSaleAttribute.startTime)
                  .toISOString()
                  .slice(0, 16)
              : "",
            endTime: p.flashSaleAttribute.endTime
              ? new Date(p.flashSaleAttribute.endTime)
                  .toISOString()
                  .slice(0, 16)
              : "",
            discountBadge: p.flashSaleAttribute.discountBadge || "",
          });
        }
        if (p.featuredAttribute) {
          activePlacements.push("FEATURED");
          setFeatured({
            featuredBadgeText:
              p.featuredAttribute.featuredBadgeText ||
              p.featuredAttribute.badgeText ||
              "",
            bannerImage: p.featuredAttribute.bannerImage || "",
            displayOrder: String(p.featuredAttribute.displayOrder ?? ""),
          });
        }
        if (p.topSellerAttribute) {
          activePlacements.push("TOP_SELLER");
          setTopSeller({
            unitsSold: String(
              p.topSellerAttribute.unitsSold ??
                p.topSellerAttribute.soldCount ??
                "",
            ),
            salesBadge:
              p.topSellerAttribute.salesBadge ||
              p.topSellerAttribute.badgeText ||
              "",
            isExpressEligible: Boolean(p.topSellerAttribute.isExpressEligible),
          });
        }
        if (p.topRatedAttribute) {
          activePlacements.push("TOP_RATED");
          setTopRated({
            averageRating: String(p.topRatedAttribute.averageRating ?? ""),
            totalReviews: String(p.topRatedAttribute.totalReviews ?? ""),
            reviewSnippet: p.topRatedAttribute.reviewSnippet || "",
          });
        }
        if (p.trustedAttribute) {
          activePlacements.push("TRUSTED");
          setTrusted({
            trustBadgeText: p.trustedAttribute.trustBadgeText || "",
            warrantyInfo: p.trustedAttribute.warrantyInfo || "",
            officialStore: Boolean(p.trustedAttribute.officialStore),
          });
        }
        setSelectedPlacements(activePlacements);

        // Vendor / Ownership
        if (p.vendorId) {
          setSelectedSellerId(p.vendorId);
          setOwnershipType("SELLER_PRODUCT");
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(
            err instanceof Error
              ? err.message
              : "Product লোড করতে সমস্যা হয়েছে।",
          );
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [slugOrId, router]);

  // Validation
  const validate = () => {
    const list: string[] = [];

    if (!hasValue(form.title)) list.push("Product title is required.");
    if (!hasValue(form.slug)) list.push("Product slug is required.");
    if (!hasValue(form.sku)) list.push("Product SKU is required.");
    if (!hasValue(form.categoryId)) list.push("Please select a category.");
    if (!hasValue(form.customerRegularPrice)) {
      list.push("Regular customer price is required.");
    } else {
      const regPrice = Number(form.customerRegularPrice);
      if (!Number.isFinite(regPrice) || regPrice < 0) {
        list.push("Regular customer price must be 0 or greater.");
      }
    }

    if (hasValue(form.customerSalePrice)) {
      const sale = Number(form.customerSalePrice);
      const reg = Number(form.customerRegularPrice);
      if (!Number.isFinite(sale) || sale < 0) {
        list.push("Sale price must be a valid amount.");
      } else if (Number.isFinite(reg) && sale > reg) {
        list.push("Sale price cannot be greater than regular price.");
      }
    }

    const stock = Number(form.stockQuantity);
    if (
      !hasValue(form.stockQuantity) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      list.push("Stock quantity must be a non-negative whole number.");
    }

    if (couponEnabled) {
      if (!hasValue(couponName))
        list.push("Coupon name is required when coupon is enabled.");
      const discount = Number(couponDiscount);
      if (
        !hasValue(couponDiscount) ||
        !Number.isFinite(discount) ||
        discount <= 0
      ) {
        list.push("Coupon discount must be greater than 0.");
      }
    }

    if (delivery.scope === "NATIONWIDE") {
      const charge = Number(delivery.nationwideCharge);
      if (
        !hasValue(delivery.nationwideCharge) ||
        !Number.isFinite(charge) ||
        charge < 0
      ) {
        list.push("Nationwide delivery charge must be 0 or greater.");
      }
    } else if (delivery.scope === "UPAZILA_BASED") {
      const weight = Number(delivery.weightKg);
      if (
        !hasValue(delivery.weightKg) ||
        !Number.isFinite(weight) ||
        weight <= 0
      ) {
        list.push("Product weight (kg) must be greater than 0.");
      }
      if (!delivery.rates || delivery.rates.length === 0) {
        list.push(
          "At least one delivery distance slab is required for Upazila-based delivery.",
        );
      }
    }

    setErrors(list);
    return list;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveSuccess("");

    const validationErrors = validate();
    if (validationErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const payload: Record<string, any> = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        sku: form.sku.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description,
        stockQuantity: Number(form.stockQuantity),
        categoryId: form.categoryId,
        images: images.filter(
          (img) => typeof img === "string" && img.trim().length > 0,
        ),
        attributes: productAttributes,
        customFields,

        customerRegularPrice: form.customerRegularPrice
          ? Number(form.customerRegularPrice)
          : null,
        customerSalePrice: form.customerSalePrice
          ? Number(form.customerSalePrice)
          : null,
        sellerRegularPrice: form.sellerRegularPrice
          ? Number(form.sellerRegularPrice)
          : null,
        sellerSalePrice: form.sellerSalePrice
          ? Number(form.sellerSalePrice)
          : null,
        wholesalerRegularPrice: form.wholesalerRegularPrice
          ? Number(form.wholesalerRegularPrice)
          : null,
        wholesalerSalePrice: form.wholesalerSalePrice
          ? Number(form.wholesalerSalePrice)
          : null,
        dropshipPrice: form.dropshipPrice ? Number(form.dropshipPrice) : null,
        affiliateCommissionType: form.affiliateCommissionType || null,
        affiliateCommissionValue: form.affiliateCommissionValue
          ? Number(form.affiliateCommissionValue)
          : null,

        coupon: couponEnabled
          ? {
              couponName: couponName.trim().toUpperCase(),
              discount: Number(couponDiscount),
              isActive: true,
            }
          : null,

        deliverySettings: {
          scope: delivery.scope,
          weightKg:
            delivery.scope === "NATIONWIDE" ? null : Number(delivery.weightKg),
          nationwideCharge:
            delivery.scope === "NATIONWIDE"
              ? Number(delivery.nationwideCharge)
              : null,
          rates:
            delivery.scope === "NATIONWIDE"
              ? []
              : delivery.rates.map((r: any) => ({
                  minDistanceKm: Number(r.minDistanceKm),
                  maxDistanceKm: Number(r.maxDistanceKm),
                  firstKgCharge: Number(r.firstKgCharge),
                  additionalKgCharge: Number(r.additionalKgCharge),
                })),
        },

        placements: {
          newArrival: isPlacementSelected("NEW_ARRIVAL")
            ? {
                badgeText: String(newArrival.badgeText ?? "").trim(),
                displayOrder: Number(newArrival.displayOrder || 1),
                startDate: newArrival.startDate,
                endDate: newArrival.endDate,
              }
            : null,
          flashSale: isPlacementSelected("FLASH_SALE")
            ? {
                flashSalePrice: Number(flashSale.flashSalePrice || 0),
                flashSaleStock: Number(flashSale.flashSaleStock || 0),
                soldCount: 0,
                startTime: flashSale.startTime,
                endTime: flashSale.endTime,
                discountBadge:
                  String(flashSale.discountBadge ?? "").trim() || null,
              }
            : null,
          featured: isPlacementSelected("FEATURED")
            ? {
                featuredBadgeText:
                  String(featured.featuredBadgeText ?? "").trim() || null,
                bannerImage: String(featured.bannerImage ?? "").trim() || null,
                displayOrder: hasValue(featured.displayOrder)
                  ? Number(featured.displayOrder)
                  : null,
              }
            : null,
          topSeller: isPlacementSelected("TOP_SELLER")
            ? {
                unitsSold: hasValue(topSeller.unitsSold)
                  ? Number(topSeller.unitsSold)
                  : 0,
                salesBadge: String(topSeller.salesBadge ?? "").trim() || null,
                isExpressEligible: topSeller.isExpressEligible,
              }
            : null,
          topRated: isPlacementSelected("TOP_RATED")
            ? {
                averageRating: Number(topRated.averageRating || 0),
                totalReviews: Number(topRated.totalReviews || 0),
                reviewSnippet:
                  String(topRated.reviewSnippet ?? "").trim() || null,
              }
            : null,
          trusted: isPlacementSelected("TRUSTED")
            ? {
                trustBadgeText:
                  String(trusted.trustBadgeText ?? "").trim() || null,
                warrantyInfo: String(trusted.warrantyInfo ?? "").trim() || null,
                officialStore: Boolean(trusted.officialStore),
              }
            : null,
        },
      };

      if (role === "ADMIN" && selectedSellerId) {
        payload.vendorId = selectedSellerId;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/products/${encodeURIComponent(productId || slugOrId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          json?.error || json?.message || "Product update করা যায়নি।",
        );
      }

      setSaveSuccess("Product সফলভাবে update করা হয়েছে!");

      window.setTimeout(() => {
        if (role === "ADMIN") {
          router.push("/admin/products");
        } else {
          router.push("/vendor/products");
        }
        router.refresh();
      }, 800);
    } catch (err: any) {
      console.error("Save product error:", err);
      setErrors([err?.message || "Product update করতে সমস্যা হয়েছে।"]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSaving(false);
    }
  };

  const backUrl = role === "ADMIN" ? "/admin/products" : "/vendor/products";

  if (initialLoading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center p-8 text-center">
        <Loader2 size={36} className="animate-spin text-[#12233F]" />
        <p className="mt-4 text-sm font-semibold text-slate-600">
          Product-এর তথ্য লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Package size={28} />
        </div>
        <h2 className="text-lg font-bold text-[#12233F]">
          Product লোড করা যায়নি
        </h2>
        <p className="mt-2 text-sm text-slate-500">{fetchError}</p>
        <button
          type="button"
          onClick={() => router.push(backUrl)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1b345b]"
        >
          <ArrowLeft size={15} />
          Products তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push(backUrl)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              aria-label="Back to products"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#12233F]">
                  Edit Product
                </h1>
                {role === "ADMIN" ? (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                    Admin Mode
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Vendor Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Product ID:{" "}
                <span className="font-mono text-slate-600">{productId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(backUrl)}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => {
                const formElem = document.getElementById(
                  "product-edit-form",
                ) as HTMLFormElement;
                if (formElem) formElem.requestSubmit();
              }}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1b345b] disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {saveSuccess && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
            {saveSuccess}
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="mb-2 text-xs font-bold text-rose-700">
              নিচের ত্রুটিগুলো সমাধান করুন:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error, idx) => (
                <li
                  key={`${error}-${idx}`}
                  className="text-xs leading-5 text-rose-600"
                >
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Admin Vendor Ownership Section */}
        {role === "ADMIN" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#12233F]">
                Product Owner (Vendor)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                এই প্রোডাক্টটি কোন সেলার/ভেন্ডরের আওতায় থাকবে তা নির্বাচন করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setOwnershipType("MY_STORE");
                  if (myVendor) setSelectedSellerId(myVendor.id);
                }}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                  ownershipType === "MY_STORE"
                    ? "border-[#12233F] bg-slate-50 ring-1 ring-[#12233F]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    ownershipType === "MY_STORE"
                      ? "bg-[#12233F] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Store size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#12233F]">My Store</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Product will belong to your own store.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOwnershipType("SELLER_PRODUCT")}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                  ownershipType === "SELLER_PRODUCT"
                    ? "border-[#12233F] bg-slate-50 ring-1 ring-[#12233F]"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    ownershipType === "SELLER_PRODUCT"
                      ? "bg-[#12233F] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <UserRound size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#12233F]">
                    Seller Product
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Product belongs to an external vendor.
                  </p>
                </div>
              </button>
            </div>

            {ownershipType === "SELLER_PRODUCT" && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <label className="mb-2 block text-xs font-semibold text-slate-700">
                  Select Seller / Vendor{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserRound
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={selectedSellerId}
                    onChange={(e) => setSelectedSellerId(e.target.value)}
                    disabled={isLoadingVendors}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-xs text-slate-700 outline-none transition focus:border-[#D6A419] disabled:bg-slate-50"
                  >
                    <option value="">
                      {isLoadingVendors
                        ? "Loading vendors..."
                        : "Select a seller"}
                    </option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.storeName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <form id="product-edit-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex min-w-0 flex-col gap-5">
              <ProductInformation
                form={form}
                isCategoryOpen={isCategoryOpen}
                openCategoryIds={openCategoryIds}
                onToggleCategory={() => setIsCategoryOpen((prev) => !prev)}
                onCategorySelect={(selected) => {
                  updateField("categoryId", selected.id);
                  setSelectedCategory(selected);
                  setIsCategoryOpen(false);
                }}
                setOpenCategoryIds={setOpenCategoryIds}
                onTitleChange={handleTitleChange}
                onFieldChange={updateField}
                productAttributes={productAttributes}
                setProductAttributes={setProductAttributes}
                couponEnabled={couponEnabled}
                setCouponEnabled={setCouponEnabled}
                couponName={couponName}
                setCouponName={setCouponName}
                couponDiscount={couponDiscount}
                setCouponDiscount={setCouponDiscount}
              />

              {/* Product Images with Uploader */}
              <ProductImageUploader images={images} onChange={setImages} />

              <ProductPricing
                form={form}
                onFieldChange={updateField}
                ownershipType={ownershipType}
              />

              <ProductInventory form={form} onFieldChange={updateField} />

              <ProductDelivery value={delivery} onChange={setDelivery} />

              <ProductPlacement
                selectedPlacements={selectedPlacements}
                onTogglePlacement={togglePlacement}
                newArrival={newArrival}
                setNewArrival={setNewArrival}
                flashSale={flashSale}
                setFlashSale={setFlashSale}
                featured={featured}
                setFeatured={setFeatured}
                topSeller={topSeller}
                setTopSeller={setTopSeller}
                topRated={topRated}
                setTopRated={setTopRated}
                trusted={trusted}
                setTrusted={setTrusted}
              />
            </div>

            <aside className="min-w-0 lg:sticky lg:top-24">
              <ProductSummary
                form={form}
                selectedCategory={selectedCategory}
                customFields={customFields}
                selectedPlacements={selectedPlacements}
              />
            </aside>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 bg-white p-4 rounded-2xl">
            <button
              type="button"
              onClick={() => router.push(backUrl)}
              disabled={isSaving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-6 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-[#1b345b] disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
