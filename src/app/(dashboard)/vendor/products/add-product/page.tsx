"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Loader2, Package, Save } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import ProductInformation, {
  type Category,
} from "@/app/(dashboard)/admin/products/add-product/components/ProductInformation";

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

import { createClient } from "../../../../../../lib/supabase-client";

import ProductPricing from "@/app/(dashboard)/admin/products/add-product/components/ProductPricing";
import ProductPlacement from "./../../../admin/products/add-product/components/ProductPlacement";
import ProductInventory from "@/app/(dashboard)/admin/products/add-product/components/ProductInventory";
import ProductSummary from "@/app/(dashboard)/admin/products/add-product/components/ProductSummary";
import ProductDelivery from "@/app/(dashboard)/admin/products/add-product/components/ProductDelivery";

import type { ProductDeliveryData } from "@/app/(dashboard)/admin/products/add-product/components/ProductDelivery";
import ProductImageUploader from "@/app/(dashboard)/admin/products/add-product/components/product-field/ProductImageUploader";

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
  const router = useRouter();

  const [form, setForm] = useState<ProductBasicInfo>({
    title: "",
    slug: "",
    sku: "",
    shortDescription: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    purchasePrice: "",
    stockQuantity: "",
    categoryId: "",
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

  // Product image URLs returned by the uploader API.
  const [images, setImages] = useState<string[]>([]);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const [productAttributes, setProductAttributes] = useState<
    Record<string, any>
  >({});

  const [customFields, setCustomFields] = useState<ProductFieldDefinition[]>(
    [],
  );

  // Product Coupon
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");

  const [delivery, setDelivery] = useState<ProductDeliveryData>({
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

  const updateField = (field: keyof ProductBasicInfo, value: string) => {
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

  const validate = () => {
    const newErrors: string[] = [];

    if (!form.title.trim()) {
      newErrors.push("Product title is required.");
    }

    if (!form.customerRegularPrice.trim()) {
      newErrors.push("Regular price is required.");
    } else if (
      !Number.isFinite(Number(form.customerRegularPrice)) ||
      Number(form.customerRegularPrice) < 0
    ) {
      newErrors.push("Regular price cannot be negative.");
    }

    if (form.customerSalePrice.trim()) {
      if (!Number.isFinite(Number(form.customerSalePrice))) {
        newErrors.push("Sale price must be a valid number.");
      } else if (
        Number(form.customerSalePrice) >= Number(form.customerRegularPrice)
      ) {
        newErrors.push("Sale price must be less than the regular price.");
      } else if (Number(form.customerSalePrice) < 0) {
        newErrors.push("Sale price cannot be negative.");
      }
    }

    if (!form.stockQuantity.trim()) {
      newErrors.push("Stock quantity is required.");
    } else if (
      !Number.isFinite(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    ) {
      newErrors.push("Stock quantity cannot be negative.");
    }

    if (!form.categoryId) {
      newErrors.push("Category is required.");
    }

    // Product Coupon validation
    if (couponEnabled) {
      if (!couponName.trim()) {
        newErrors.push("Coupon name is required.");
      }

      if (
        !couponDiscount.trim() ||
        !Number.isFinite(Number(couponDiscount)) ||
        Number(couponDiscount) <= 0
      ) {
        newErrors.push("Coupon discount must be greater than 0.");
      } else {
        const sellingPrice = hasValue(form.customerSalePrice)
          ? Number(form.customerSalePrice)
          : Number(form.customerRegularPrice);

        if (
          Number.isFinite(sellingPrice) &&
          Number(couponDiscount) >= sellingPrice
        ) {
          newErrors.push(
            "Coupon discount must be less than the selling price.",
          );
        }
      }
    }

    if (!delivery.scope) {
      newErrors.push("Delivery scope is required.");
    } else if (delivery.scope === "NATIONWIDE") {
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
      if (!hasValue(delivery.weightKg)) {
        newErrors.push("Delivery weight is required.");
      } else if (
        !Number.isFinite(Number(delivery.weightKg)) ||
        Number(delivery.weightKg) <= 0
      ) {
        newErrors.push("Delivery weight must be greater than 0.");
      }

      if (!delivery.rates || delivery.rates.length === 0) {
        newErrors.push("At least one delivery rate is required.");
      }

      delivery.rates.forEach((rate, index) => {
        const label = `Delivery rate ${index + 1}`;

        if (!hasValue(rate.minDistanceKm)) {
          newErrors.push(`${label}: minimum distance is required.`);
        }

        if (!hasValue(rate.maxDistanceKm)) {
          newErrors.push(`${label}: maximum distance is required.`);
        }

        if (!hasValue(rate.firstKgCharge)) {
          newErrors.push(`${label}: first kg charge is required.`);
        }

        if (!hasValue(rate.additionalKgCharge)) {
          newErrors.push(`${label}: additional kg charge is required.`);
        }

        if (
          hasValue(rate.minDistanceKm) &&
          hasValue(rate.maxDistanceKm) &&
          Number(rate.maxDistanceKm) < Number(rate.minDistanceKm)
        ) {
          newErrors.push(
            `${label}: maximum distance cannot be less than minimum distance.`,
          );
        }

        if (hasValue(rate.minDistanceKm) && Number(rate.minDistanceKm) < 0) {
          newErrors.push(`${label}: minimum distance cannot be negative.`);
        }

        if (hasValue(rate.maxDistanceKm) && Number(rate.maxDistanceKm) < 0) {
          newErrors.push(`${label}: maximum distance cannot be negative.`);
        }

        if (hasValue(rate.firstKgCharge) && Number(rate.firstKgCharge) < 0) {
          newErrors.push(`${label}: first kg charge cannot be negative.`);
        }

        if (
          hasValue(rate.additionalKgCharge) &&
          Number(rate.additionalKgCharge) < 0
        ) {
          newErrors.push(`${label}: additional kg charge cannot be negative.`);
        }
      });
    }

    if (isPlacementSelected("NEW_ARRIVAL")) {
      if (!hasValue(newArrival.badgeText)) {
        newErrors.push("New Arrival badge text is required.");
      }

      if (!hasValue(newArrival.displayOrder)) {
        newErrors.push("New Arrival display order is required.");
      } else if (Number(newArrival.displayOrder) < 0) {
        newErrors.push("New Arrival display order cannot be negative.");
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
        new Date(newArrival.endDate) <= new Date(newArrival.startDate)
      ) {
        newErrors.push("New Arrival end date must be after start date.");
      }
    }

    if (isPlacementSelected("FLASH_SALE")) {
      if (!hasValue(flashSale.flashSalePrice)) {
        newErrors.push("Flash Sale price is required.");
      } else if (Number(flashSale.flashSalePrice) < 0) {
        newErrors.push("Flash Sale price cannot be negative.");
      }

      if (!hasValue(flashSale.flashSaleStock)) {
        newErrors.push("Flash Sale stock is required.");
      } else if (Number(flashSale.flashSaleStock) < 0) {
        newErrors.push("Flash Sale stock cannot be negative.");
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
        new Date(flashSale.endTime) <= new Date(flashSale.startTime)
      ) {
        newErrors.push("Flash Sale end time must be after start time.");
      }
    }

    if (isPlacementSelected("FEATURED")) {
      if (!hasValue(featured.featuredBadgeText)) {
        newErrors.push("Featured badge text is required.");
      }

      if (!hasValue(featured.bannerImage)) {
        newErrors.push("Featured banner image is required.");
      }

      if (!hasValue(featured.displayOrder)) {
        newErrors.push("Featured display order is required.");
      } else if (Number(featured.displayOrder) < 0) {
        newErrors.push("Featured display order cannot be negative.");
      }
    }

    if (isPlacementSelected("TOP_SELLER")) {
      if (!hasValue(topSeller.unitsSold)) {
        newErrors.push("Top Seller units sold is required.");
      } else if (Number(topSeller.unitsSold) < 0) {
        newErrors.push("Top Seller units sold cannot be negative.");
      }

      if (!hasValue(topSeller.salesBadge)) {
        newErrors.push("Top Seller sales badge is required.");
      }
    }

    if (isPlacementSelected("TOP_RATED")) {
      if (!hasValue(topRated.averageRating)) {
        newErrors.push("Top Rated average rating is required.");
      } else if (
        Number(topRated.averageRating) < 0 ||
        Number(topRated.averageRating) > 5
      ) {
        newErrors.push("Top Rated average rating must be between 0 and 5.");
      }

      if (!hasValue(topRated.totalReviews)) {
        newErrors.push("Top Rated total reviews is required.");
      } else if (Number(topRated.totalReviews) < 0) {
        newErrors.push("Top Rated total reviews cannot be negative.");
      }

      if (!hasValue(topRated.reviewSnippet)) {
        newErrors.push("Top Rated review snippet is required.");
      }
    }

    if (isPlacementSelected("TRUSTED")) {
      if (!hasValue(trusted.trustBadgeText)) {
        newErrors.push("Trusted trust badge text is required.");
      }

      if (!hasValue(trusted.warrantyInfo)) {
        newErrors.push("Trusted warranty information is required.");
      }
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSaving) return;

    const validationErrors = validate();

    if (validationErrors.length > 0) {
      toast.error("Please fix the required fields before continuing.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      sku: form.sku.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description,
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId,

      // Uploaded image URLs are saved with the product.
      images: images.filter(
        (image) => typeof image === "string" && image.trim().length > 0,
      ),

      attributes: productAttributes,

      // Product Coupon
      coupon: couponEnabled
        ? {
            couponName: couponName.trim().toUpperCase(),
            discount: Number(couponDiscount),
            isActive: true,
          }
        : null,

      customerRegularPrice: hasValue(form.customerRegularPrice)
        ? Number(form.customerRegularPrice)
        : null,

      customerSalePrice: hasValue(form.customerSalePrice)
        ? Number(form.customerSalePrice)
        : null,

      wholesalerRegularPrice: hasValue(form.wholesalerRegularPrice)
        ? Number(form.wholesalerRegularPrice)
        : null,

      wholesalerSalePrice: hasValue(form.wholesalerSalePrice)
        ? Number(form.wholesalerSalePrice)
        : null,

      dropshipPrice: hasValue(form.dropshipPrice)
        ? Number(form.dropshipPrice)
        : null,

      affiliateCommissionType: form.affiliateCommissionType || null,

      affiliateCommissionValue: hasValue(form.affiliateCommissionValue)
        ? Number(form.affiliateCommissionValue)
        : null,

      customFields,

      deliverySettings: {
        scope: delivery.scope,

        weightKg:
          delivery.scope === "UPAZILA_BASED" ? Number(delivery.weightKg) : null,

        nationwideCharge:
          delivery.scope === "NATIONWIDE"
            ? Number(delivery.nationwideCharge)
            : null,

        rates:
          delivery.scope === "UPAZILA_BASED"
            ? delivery.rates.map((rate) => ({
                minDistanceKm: Number(rate.minDistanceKm),
                maxDistanceKm: Number(rate.maxDistanceKm),
                firstKgCharge: Number(rate.firstKgCharge),
                additionalKgCharge: Number(rate.additionalKgCharge),
              }))
            : [],
      },

      placements: {
        newArrival: isPlacementSelected("NEW_ARRIVAL")
          ? {
              badgeText: String(newArrival.badgeText ?? "").trim(),
              displayOrder: Number(newArrival.displayOrder),
              startDate: newArrival.startDate,
              endDate: newArrival.endDate,
            }
          : null,

        flashSale: isPlacementSelected("FLASH_SALE")
          ? {
              flashSalePrice: Number(flashSale.flashSalePrice),
              flashSaleStock: Number(flashSale.flashSaleStock),
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
              averageRating: hasValue(topRated.averageRating)
                ? Number(topRated.averageRating)
                : 0,
              totalReviews: hasValue(topRated.totalReviews)
                ? Number(topRated.totalReviews)
                : 0,
              reviewSnippet:
                String(topRated.reviewSnippet ?? "").trim() || null,
            }
          : null,

        trusted: isPlacementSelected("TRUSTED")
          ? {
              trustBadgeText:
                String(trusted.trustBadgeText ?? "").trim() || null,
              warrantyInfo: String(trusted.warrantyInfo ?? "").trim() || null,
              officialStore: trusted.officialStore,
            }
          : null,
      },
    };

    setIsSaving(true);

    try {
      const supabase = createClient();

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (!session?.access_token) {
        toast.error("You are not logged in.");
        router.push("/login");
        return;
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.error || result?.message || "Failed to create product.",
        );
      }

      toast.success("Product created successfully.");

      router.push("/vendor/products");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 transition hover:border-[#D6A419] hover:text-[#12233F]"
        >
          <ArrowLeft size={15} />
          Back to Products
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D6A419]">
              Vendor Dashboard
            </p>

            <h1 className="mt-1 text-xl font-bold text-[#12233F]">
              Add Product
            </h1>

            <p className="mt-1 text-[12px] text-slate-500">
              Create a new product and configure its details.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#D6A419]">
              <Package size={19} />
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Product Setup</p>

              <p className="mt-0.5 text-[12px] font-bold text-[#12233F]">
                Basic Information
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.length > 0 && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 p-4"
          >
            <p className="mb-2 text-[12px] font-bold text-rose-700">
              Please fix the following:
            </p>

            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error, index) => (
                <li
                  key={`${error}-${index}`}
                  className="text-[11.5px] leading-5 text-rose-600"
                >
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-5">
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
            <ProductImageUploader images={images} onChange={setImages} />

            <ProductPricing
              form={form}
              onFieldChange={updateField}
              ownershipType="SELLER_PRODUCT"
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

          <aside className="min-w-0 lg:sticky lg:top-6">
            <ProductSummary
              form={form}
              selectedCategory={selectedCategory}
              customFields={customFields}
              selectedPlacements={selectedPlacements}
            />
          </aside>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#1b345b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={15} />
                Continue
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
