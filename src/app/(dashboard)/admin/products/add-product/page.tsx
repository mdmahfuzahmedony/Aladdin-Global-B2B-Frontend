"use client";

import { toast } from "react-toastify";

import { useEffect, useState, type FormEvent } from "react";

import {
  ArrowLeft,
  Save,
  Store,
  UserRound,
  ChevronDown,
} from "lucide-react";

import ProductInformation, {
  type Category,
} from "./components/ProductInformation";

import ProductPricing from "./components/ProductPricing";
import ProductInventory from "./components/ProductInventory";
import ProductPlacement from "./components/ProductPlacement";
import ProductSummary from "./components/ProductSummary";

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
} from "./components/product-placement/types";

import { createClient } from "../../../../../../lib/supabase-client";

import ProductDelivery from "./components/ProductDelivery";
import ProductImageUploader from "./components/product-field/ProductImageUploader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

type VendorsResponse = {
  success: boolean;
  count?: number;
  data?: VendorOption[];
  error?: string;
  message?: string;
};

type ProductOwnershipType = "MY_STORE" | "SELLER_PRODUCT";

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

export default function AddProductPage() {
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

  const [ownershipType, setOwnershipType] =
    useState<ProductOwnershipType>("MY_STORE");

  const [selectedSellerId, setSelectedSellerId] = useState("");

  const [vendors, setVendors] = useState<VendorOption[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [vendorLoadError, setVendorLoadError] = useState("");
  const [myVendor, setMyVendor] = useState<VendorOption | null>(null);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const [productAttributes, setProductAttributes] = useState<
    Record<string, any>
  >({});

  const [customFields, setCustomFields] = useState<
    ProductFieldDefinition[]
  >([]);

  const [selectedPlacements, setSelectedPlacements] = useState<
    PlacementType[]
  >([]);

  // =====================================================
  // PRODUCT COUPON STATE
  // =====================================================

  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");

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

  const [images, setImages] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<any>({
    scope: "UPAZILA_BASED",
    weightKg: "",
    nationwideCharge: "",
    rates: [
      {
        minDistanceKm: "",
        maxDistanceKm: "",
        firstKgCharge: "",
        additionalKgCharge: "",
      },
    ],
  });

  // =====================================================
  // LOAD VENDORS
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const loadVendors = async () => {
      setIsLoadingVendors(true);
      setVendorLoadError("");

      try {
        const supabase = createClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (isMounted) {
            setVendorLoadError("You are not logged in.");
          }
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/vendors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        const result: VendorsResponse = await response
          .json()
          .catch(() => ({ success: false }));

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || result.message || "Failed to fetch vendors",
          );
        }

        const vendorList = Array.isArray(result.data)
          ? result.data.map((vendor: any) => ({
              id: String(vendor.id),
              userId: String(vendor.userId),
              name:
                vendor.fullName ||
                vendor.user?.fullName ||
                vendor.storeName ||
                "Unknown Vendor",
              storeName: vendor.storeName || "Unnamed Store",
              businessCategory: vendor.businessCategory ?? null,
              status: vendor.status,
              email: vendor.email ?? vendor.user?.email ?? null,
              phone: vendor.phone ?? vendor.user?.phone ?? null,
            }))
          : [];

        if (!isMounted) return;

        setVendors(vendorList);

        const currentUserId = session.user.id;

        const currentVendor =
          vendorList.find(
            (vendor) => vendor.userId === currentUserId,
          ) || null;

        setMyVendor(currentVendor);
      } catch (error: any) {
        console.error("LOAD VENDORS ERROR:", error);

        if (isMounted) {
          setVendorLoadError(
            error?.message || "Failed to load vendors.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingVendors(false);
        }
      }
    };

    loadVendors();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // FIELD HANDLERS
  // =====================================================

  const updateField = (
    field: keyof ProductBasicInfo,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors([]);
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));

    setErrors([]);
  };

  const handleOwnershipChange = (type: ProductOwnershipType) => {
    setOwnershipType(type);

    if (type === "MY_STORE") {
      setSelectedSellerId("");
    }

    setErrors([]);
  };

  const handleSellerChange = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setErrors([]);
  };

  const togglePlacement = (placement: PlacementType) => {
    setSelectedPlacements((prev) =>
      prev.includes(placement)
        ? prev.filter((item) => item !== placement)
        : [...prev, placement],
    );

    setErrors([]);
  };

  const isPlacementSelected = (placement: PlacementType) =>
    selectedPlacements.includes(placement);

  const selectedSeller = vendors.find(
    (vendor) => vendor.id === selectedSellerId,
  );

  // =====================================================
  // VALIDATION
  // =====================================================

  const validate = () => {
    const newErrors: string[] = [];

    if (ownershipType === "MY_STORE" && !myVendor) {
      newErrors.push(
        "Your vendor/store profile could not be found.",
      );
    }

    if (
      ownershipType === "SELLER_PRODUCT" &&
      !selectedSellerId
    ) {
      newErrors.push("Please select a seller.");
    }

    if (
      ownershipType === "SELLER_PRODUCT" &&
      selectedSellerId &&
      !selectedSeller
    ) {
      newErrors.push("Selected vendor could not be found.");
    }

    if (!form.title.trim()) {
      newErrors.push("Product title is required.");
    }

    if (!form.sku.trim()) {
      newErrors.push("Product SKU is required.");
    }

    if (!form.customerRegularPrice.trim()) {
      newErrors.push("Regular price is required.");
    } else if (
      !Number.isFinite(Number(form.customerRegularPrice)) ||
      Number(form.customerRegularPrice) < 0
    ) {
      newErrors.push(
        "Regular price must be a valid non-negative number.",
      );
    }

    if (
      form.customerSalePrice.trim() &&
      Number(form.customerSalePrice) >=
        Number(form.customerRegularPrice)
    ) {
      newErrors.push(
        "Sale price must be less than the regular price.",
      );
    }

    if (!form.stockQuantity.trim()) {
      newErrors.push("Stock quantity is required.");
    } else if (
      !Number.isInteger(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    ) {
      newErrors.push(
        "Stock quantity must be a valid non-negative whole number.",
      );
    }

    if (!form.categoryId) {
      newErrors.push("Category is required.");
    }

    // -----------------------------------------------------
    // COUPON VALIDATION
    // -----------------------------------------------------

    if (couponEnabled) {
      const normalizedCouponName = couponName.trim();
      const discount = Number(couponDiscount);
      const productPrice = Number(
        form.customerSalePrice.trim()
          ? form.customerSalePrice
          : form.customerRegularPrice,
      );

      if (!normalizedCouponName) {
        newErrors.push(
          "Coupon name is required when the coupon is enabled.",
        );
      } else if (!/^[A-Z0-9_-]{2,40}$/.test(normalizedCouponName)) {
        newErrors.push(
          "Coupon name must be 2–40 characters and contain only letters, numbers, hyphens, or underscores.",
        );
      }

      if (!couponDiscount.trim()) {
        newErrors.push("Coupon discount amount is required.");
      } else if (
        !Number.isFinite(discount) ||
        discount <= 0
      ) {
        newErrors.push(
          "Coupon discount must be a number greater than zero.",
        );
      } else if (
        Number.isFinite(productPrice) &&
        productPrice > 0 &&
        discount >= productPrice
      ) {
        newErrors.push(
          "Coupon discount must be less than the product selling price.",
        );
      }
    }

    // -----------------------------------------------------
    // DELIVERY VALIDATION
    // -----------------------------------------------------

    if (delivery.scope === "NATIONWIDE") {
      if (
        !hasValue(delivery.nationwideCharge) ||
        !Number.isFinite(Number(delivery.nationwideCharge)) ||
        Number(delivery.nationwideCharge) < 0
      ) {
        newErrors.push(
          "Nationwide delivery charge must be a valid amount of 0 or greater.",
        );
      }
    } else {
      if (
        !hasValue(delivery.weightKg) ||
        !Number.isFinite(Number(delivery.weightKg)) ||
        Number(delivery.weightKg) <= 0
      ) {
        newErrors.push(
          "Product delivery weight must be greater than 0 kg.",
        );
      }

      if (!delivery.rates.length) {
        newErrors.push(
          "At least one delivery distance slab is required.",
        );
      }

      delivery.rates.forEach((rate: any, index: number) => {
      const slabNumber = index + 1;
      const min = Number(rate.minDistanceKm);
      const max = Number(rate.maxDistanceKm);
      const firstCharge = Number(rate.firstKgCharge);
      const additionalCharge = Number(
        rate.additionalKgCharge,
      );

      if (
        !hasValue(rate.minDistanceKm) ||
        !Number.isInteger(min) ||
        min < 0
      ) {
        newErrors.push(
          `Delivery slab ${slabNumber}: minimum distance must be a valid non-negative whole number.`,
        );
      }

      if (
        !hasValue(rate.maxDistanceKm) ||
        !Number.isInteger(max) ||
        max <= min
      ) {
        newErrors.push(
          `Delivery slab ${slabNumber}: maximum distance must be greater than minimum distance.`,
        );
      }

      if (
        !hasValue(rate.firstKgCharge) ||
        !Number.isFinite(firstCharge) ||
        firstCharge < 0
      ) {
        newErrors.push(
          `Delivery slab ${slabNumber}: first kg charge must be a valid non-negative amount.`,
        );
      }

      if (
        !hasValue(rate.additionalKgCharge) ||
        !Number.isFinite(additionalCharge) ||
        additionalCharge < 0
      ) {
        newErrors.push(
          `Delivery slab ${slabNumber}: additional kg charge must be a valid non-negative amount.`,
        );
      }

      if (index > 0) {
        const previousRate = delivery.rates[index - 1];
        const previousMax = Number(previousRate.maxDistanceKm);

        if (
          Number.isInteger(min) &&
          Number.isInteger(previousMax) &&
          min < previousMax
        ) {
          newErrors.push(
            `Delivery slab ${slabNumber}: distance range overlaps with the previous slab.`,
          );
        }
      }
    });
    }

    // -----------------------------------------------------
    // NEW ARRIVAL
    // -----------------------------------------------------

    if (isPlacementSelected("NEW_ARRIVAL")) {
      if (!hasValue(newArrival.badgeText)) {
        newErrors.push("New Arrival badge text is required.");
      }

      if (!hasValue(newArrival.displayOrder)) {
        newErrors.push("New Arrival display order is required.");
      }

      if (!newArrival.startDate) {
        newErrors.push("New Arrival start date is required.");
      }

      if (!newArrival.endDate) {
        newErrors.push("New Arrival end date is required.");
      }

      if (
        newArrival.startDate &&
        newArrival.endDate &&
        new Date(newArrival.endDate) <=
          new Date(newArrival.startDate)
      ) {
        newErrors.push(
          "New Arrival end date must be after start date.",
        );
      }
    }

    // -----------------------------------------------------
    // FLASH SALE
    // -----------------------------------------------------

    if (isPlacementSelected("FLASH_SALE")) {
      if (!hasValue(flashSale.flashSalePrice)) {
        newErrors.push("Flash Sale price is required.");
      }

      if (!hasValue(flashSale.flashSaleStock)) {
        newErrors.push("Flash Sale stock is required.");
      }

      if (!flashSale.startTime) {
        newErrors.push("Flash Sale start time is required.");
      }

      if (!flashSale.endTime) {
        newErrors.push("Flash Sale end time is required.");
      }

      if (
        flashSale.startTime &&
        flashSale.endTime &&
        new Date(flashSale.endTime) <=
          new Date(flashSale.startTime)
      ) {
        newErrors.push(
          "Flash Sale end time must be after start time.",
        );
      }
    }

    // -----------------------------------------------------
    // FEATURED
    // -----------------------------------------------------

    if (isPlacementSelected("FEATURED")) {
      if (!hasValue(featured.featuredBadgeText)) {
        newErrors.push("Featured badge text is required.");
      }

      if (!hasValue(featured.bannerImage)) {
        newErrors.push("Featured banner image is required.");
      }

      if (!hasValue(featured.displayOrder)) {
        newErrors.push("Featured display order is required.");
      }
    }

    // -----------------------------------------------------
    // TOP SELLER
    // -----------------------------------------------------

    if (isPlacementSelected("TOP_SELLER")) {
      if (!hasValue(topSeller.unitsSold)) {
        newErrors.push("Top Seller units sold is required.");
      } else if (
        !Number.isFinite(Number(topSeller.unitsSold)) ||
        Number(topSeller.unitsSold) < 0
      ) {
        newErrors.push(
          "Top Seller units sold cannot be negative.",
        );
      }

      if (!hasValue(topSeller.salesBadge)) {
        newErrors.push("Top Seller sales badge is required.");
      }
    }

    // -----------------------------------------------------
    // TOP RATED
    // -----------------------------------------------------

    if (isPlacementSelected("TOP_RATED")) {
      if (!hasValue(topRated.averageRating)) {
        newErrors.push(
          "Top Rated average rating is required.",
        );
      } else if (
        Number(topRated.averageRating) < 0 ||
        Number(topRated.averageRating) > 5
      ) {
        newErrors.push(
          "Top Rated average rating must be between 0 and 5.",
        );
      }

      if (!hasValue(topRated.totalReviews)) {
        newErrors.push("Top Rated total reviews is required.");
      }

      if (!hasValue(topRated.reviewSnippet)) {
        newErrors.push(
          "Top Rated review snippet is required.",
        );
      }
    }

    // -----------------------------------------------------
    // TRUSTED
    // -----------------------------------------------------

    if (isPlacementSelected("TRUSTED")) {
      if (!hasValue(trusted.trustBadgeText)) {
        newErrors.push("Trusted badge text is required.");
      }

      if (!hasValue(trusted.warrantyInfo)) {
        newErrors.push(
          "Trusted warranty information is required.",
        );
      }
    }

    setErrors(newErrors);

    return newErrors;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const validationErrors = validate();

    if (validationErrors.length > 0) {
      console.log("VALIDATION FAILED:", validationErrors);
      return;
    }

    const finalVendorId =
      ownershipType === "MY_STORE"
        ? myVendor?.id
        : selectedSeller?.id;

    if (!finalVendorId) {
      setErrors([
        "A valid vendor is required before creating the product.",
      ]);
      return;
    }

    const payload = {
      vendorId: finalVendorId,
      ownershipType,

      title: form.title.trim(),
      slug: form.slug.trim(),
      sku: form.sku.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description,
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId,

      images: images.filter(
        (image) => typeof image === "string" && image.trim().length > 0,
      ),

      attributes: productAttributes,

      customerRegularPrice: form.customerRegularPrice.trim()
        ? Number(form.customerRegularPrice)
        : null,

      customerSalePrice: form.customerSalePrice.trim()
        ? Number(form.customerSalePrice)
        : null,

      wholesalerRegularPrice:
        form.wholesalerRegularPrice.trim()
          ? Number(form.wholesalerRegularPrice)
          : null,

      wholesalerSalePrice: form.wholesalerSalePrice.trim()
        ? Number(form.wholesalerSalePrice)
        : null,

      dropshipPrice: form.dropshipPrice.trim()
        ? Number(form.dropshipPrice)
        : null,

      affiliateCommissionType:
        form.affiliateCommissionType || null,

      affiliateCommissionValue:
        form.affiliateCommissionValue.trim()
          ? Number(form.affiliateCommissionValue)
          : null,

      customFields,

      // =================================================
      // COUPON PAYLOAD
      // =================================================

      coupon: couponEnabled
        ? {
            couponName: couponName.trim().toUpperCase(),
            discount: Number(couponDiscount),
            isActive: true,
          }
        : null,

      // =================================================
      // DELIVERY SETTINGS
      // =================================================

      deliverySettings: {
        scope: delivery.scope,
        weightKg:
          delivery.scope === "NATIONWIDE"
            ? null
            : Number(delivery.weightKg),
        nationwideCharge:
          delivery.scope === "NATIONWIDE"
            ? Number(delivery.nationwideCharge)
            : null,
        rates:
          delivery.scope === "NATIONWIDE"
            ? []
            : delivery.rates.map((rate: any) => ({
                minDistanceKm: Number(rate.minDistanceKm),
                maxDistanceKm: Number(rate.maxDistanceKm),
                firstKgCharge: Number(rate.firstKgCharge),
                additionalKgCharge: Number(
                  rate.additionalKgCharge,
                ),
              })),
      },

      // =================================================
      // PRODUCT PLACEMENTS
      // =================================================

      placements: {
        newArrival: isPlacementSelected("NEW_ARRIVAL")
          ? {
              badgeText: String(
                newArrival.badgeText ?? "",
              ).trim(),
              displayOrder: Number(newArrival.displayOrder),
              startDate: newArrival.startDate,
              endDate: newArrival.endDate,
            }
          : null,

        flashSale: isPlacementSelected("FLASH_SALE")
          ? {
              flashSalePrice: Number(
                flashSale.flashSalePrice,
              ),
              flashSaleStock: Number(
                flashSale.flashSaleStock,
              ),
              soldCount: 0,
              startTime: flashSale.startTime,
              endTime: flashSale.endTime,
              discountBadge:
                String(flashSale.discountBadge ?? "").trim() ||
                null,
            }
          : null,

        featured: isPlacementSelected("FEATURED")
          ? {
              featuredBadgeText:
                String(
                  featured.featuredBadgeText ?? "",
                ).trim() || null,
              bannerImage:
                String(featured.bannerImage ?? "").trim() ||
                null,
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
              salesBadge:
                String(topSeller.salesBadge ?? "").trim() ||
                null,
              isExpressEligible:
                topSeller.isExpressEligible,
            }
          : null,

        topRated: isPlacementSelected("TOP_RATED")
          ? {
              averageRating: hasValue(topRated.averageRating)
                ? Number(topRated.averageRating)
                : 0,
              totalReviews: hasValue(topRated.totalReviews)
                ? Number(topRated.totalReviews)
                : 0,
              reviewSnippet:
                String(topRated.reviewSnippet ?? "").trim() ||
                null,
            }
          : null,

        trusted: isPlacementSelected("TRUSTED")
          ? {
              trustBadgeText:
                String(
                  trusted.trustBadgeText ?? "",
                ).trim() || null,
              warrantyInfo:
                String(trusted.warrantyInfo ?? "").trim() ||
                null,
              officialStore: trusted.officialStore,
            }
          : null,
      },
    };

    console.log("PRODUCT ATTRIBUTES:", productAttributes);
    console.log("PRODUCT PAYLOAD:", payload);

    setIsSaving(true);

    try {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.warning("You are not logged in.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Failed to create product",
        );
      }

      console.log(
        "PRODUCT CREATED SUCCESSFULLY:",
        result,
      );

      toast.success("Product created successfully.");
    } catch (error: any) {
      console.error("CREATE PRODUCT ERROR:", error);

      toast.error(error?.message || "Failed to create product.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <h1 className="text-base font-bold text-slate-900">
                Add Product
              </h1>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Create a new product
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#12233F] text-[10px] font-bold text-white">
              1
            </div>
            <span className="text-xs font-semibold text-[#12233F]">
              Basic Information
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          {errors.length > 0 && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
              <p className="mb-1 text-xs font-semibold text-rose-700">
                Please fix the following:
              </p>

              <ul className="list-disc space-y-0.5 pl-4">
                {errors.map((error, index) => (
                  <li
                    key={`${index}-${error}`}
                    className="text-[11px] text-rose-600"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PRODUCT OWNERSHIP */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#12233F]">
                Add Product For
              </h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Choose who will own this product.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  handleOwnershipChange("MY_STORE")
                }
                className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                  ownershipType === "MY_STORE"
                    ? "border-[#12233F] bg-slate-50 ring-1 ring-[#12233F]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
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
                  <p className="text-[13px] font-bold text-[#12233F]">
                    My Store
                  </p>
                  <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                    Product will belong to your own vendor store.
                  </p>

                  {myVendor && (
                    <p className="mt-1 text-[10px] font-semibold text-[#12233F]">
                      {myVendor.storeName}
                    </p>
                  )}
                </div>

                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    ownershipType === "MY_STORE"
                      ? "border-[#12233F] bg-[#12233F]"
                      : "border-slate-300"
                  }`}
                >
                  {ownershipType === "MY_STORE" && (
                    <div className="m-[3px] h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleOwnershipChange("SELLER_PRODUCT")
                }
                className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition ${
                  ownershipType === "SELLER_PRODUCT"
                    ? "border-[#12233F] bg-slate-50 ring-1 ring-[#12233F]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
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
                  <p className="text-[13px] font-bold text-[#12233F]">
                    Seller Product
                  </p>
                  <p className="mt-0.5 text-[11px] leading-5 text-slate-400">
                    Product will belong to a selected seller/store.
                  </p>
                </div>

                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    ownershipType === "SELLER_PRODUCT"
                      ? "border-[#12233F] bg-[#12233F]"
                      : "border-slate-300"
                  }`}
                >
                  {ownershipType === "SELLER_PRODUCT" && (
                    <div className="m-[3px] h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>

            {ownershipType === "SELLER_PRODUCT" && (
              <div className="mt-5 border-t border-slate-100 pt-5">
                <label className="mb-2 block text-[12px] font-semibold text-slate-700">
                  Select Seller
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={selectedSellerId}
                    onChange={(event) =>
                      handleSellerChange(event.target.value)
                    }
                    disabled={isLoadingVendors}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-10 text-[12px] text-slate-700 outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419] disabled:cursor-not-allowed disabled:bg-slate-50"
                  >
                    <option value="">
                      {isLoadingVendors
                        ? "Loading vendors..."
                        : "Select a seller"}
                    </option>

                    {vendors.map((vendor) => (
                      <option
                        key={vendor.id}
                        value={vendor.id}
                      >
                        {vendor.name} — {vendor.storeName}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {vendorLoadError && (
                  <p className="mt-2 text-[10.5px] text-rose-500">
                    {vendorLoadError}
                  </p>
                )}

                {!isLoadingVendors &&
                  !vendorLoadError &&
                  vendors.length === 0 && (
                    <p className="mt-2 text-[10.5px] text-slate-400">
                      No vendors found.
                    </p>
                  )}

                {selectedSeller && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Store size={15} />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#12233F]">
                        {selectedSeller.storeName}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Product owner: {selectedSeller.name}
                      </p>

                      {selectedSeller.email && (
                        <p className="mt-0.5 text-[9.5px] text-slate-400">
                          {selectedSeller.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <p className="mt-2 text-[10.5px] text-slate-400">
                  Product ownership will use the selected vendor&apos;s
                  database ID.
                </p>
              </div>
            )}
          </div>

          {/* PRODUCT FORM */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <ProductInformation
  form={form}
  isCategoryOpen={isCategoryOpen}
  openCategoryIds={openCategoryIds}
  onToggleCategory={() => setIsCategoryOpen((prev) => !prev)}
  onCategorySelect={(selected) => {
    updateField("categoryId", selected.id);
    setSelectedCategory(selected);
    setProductAttributes({});
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

              {/* Product images */}
              <ProductImageUploader
                images={images}
                onChange={setImages}
              />

              <ProductPricing
                form={form}
                onFieldChange={updateField}
                ownershipType={ownershipType}
              />

              <ProductInventory
                form={form}
                onFieldChange={updateField}
              />

              <ProductDelivery
                value={delivery}
                onChange={setDelivery}
              />

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

            <ProductSummary
              form={form}
              selectedCategory={selectedCategory}
              customFields={customFields}
              selectedPlacements={selectedPlacements}
            />
          </div>
        </div>

        {/* FOOTER */}

        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-[#12233F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0d1b31] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
