
"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  Tag,
  TrendingUp,
  Layers3,
  Store,
  ShieldCheck,
  Truck,
  SlidersHorizontal,
  Palette,
  Weight,
  Ruler,
  Globe2,
  Package,
  Droplets,
  Shapes,
  Star,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  productCount: number;
  children: CategoryNode[];
};

export type SidebarBrand = {
  id: string;
  name: string;
  slug?: string;
  logo?: string | null;
};

export type SidebarVendor = {
  id: string;
  name: string;
};

export type DeliveryOption = {
  id: string;
  label: string;
};

export type AttributeFilter = {
  key: string;
  label: string;
  options: string[];
};

export const SORT_OPTIONS = [
  { value: "best-seller", label: "Best Seller" },
  { value: "new-released", label: "New Released" },
  { value: "price-low-high", label: "Price - Low to High" },
  { value: "price-high-low", label: "Price - High to Low" },
  { value: "discount-high-low", label: "Discount - High to Low" },
  { value: "discount-low-high", label: "Discount - Low to High" },
];

const WARRANTY_OPTIONS = [
  { value: "all", label: "All Products" },
  { value: "warranty", label: "Warranty Available" },
  { value: "no-warranty", label: "No Warranty" },
];

const DEFAULT_DELIVERY_OPTIONS: DeliveryOption[] = [
  { id: "cod", label: "Cash on Delivery" },
  { id: "free-delivery", label: "Free Delivery" },
  { id: "fast-delivery", label: "Fast Delivery" },
];

/*
 * এগুলো আপাতত সাধারণ উদাহরণ।
 * তোমার ডেটাবেসের প্রকৃত পণ্যের বৈশিষ্ট্য অনুযায়ী
 * options পরিবর্তন করবে।
 */
const DEFAULT_ATTRIBUTE_FILTERS: AttributeFilter[] = [
  {
    key: "colorVariation",
    label: "Color Variation",
    options: ["Black", "White", "Red", "Blue", "Green", "Pink"],
  },
  {
    key: "weight",
    label: "Weight",
    options: ["Under 500 g", "500 g - 1 kg", "1 - 5 kg", "Above 5 kg"],
  },
  {
    key: "numberOfPcs",
    label: "Number Of Pcs",
    options: ["1 Piece", "2 Pieces", "3 Pieces", "6 Pieces", "12 Pieces"],
  },
  {
    key: "size",
    label: "Size",
    options: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    key: "countryOfOrigin",
    label: "Country of Origin",
    options: ["Bangladesh"],
  },
  {
    key: "colourOnly",
    label: "Colour Only",
    options: ["Black", "White", "Red", "Blue", "Green", "Other"],
  },
  {
    key: "material",
    label: "Material",
    options: ["Cotton", "Plastic", "Metal", "Wood", "Leather", "Glass"],
  },
  {
    key: "volume",
    label: "Volume",
    options: ["Under 250 ml", "250 - 500 ml", "500 ml - 1 L", "Above 1 L"],
  },
  {
    key: "productType",
    label: "Product Type",
    options: ["Regular", "Premium", "Organic", "Reusable"],
  },
  {
    key: "rating",
    label: "Rating",
    options: ["5 Stars", "4 Stars & Up", "3 Stars & Up", "2 Stars & Up"],
  },
];

/* ─── Props ─────────────────────────────────────── */

type CategorySidebarProps = {
  categories: CategoryNode[];
  categoriesLoading: boolean;
  selectedCategoryId?: string;

  brands: SidebarBrand[];
  selectedBrandId: string;
  onBrandChange: (brandId: string) => void;

  sortBy?: string;
  onSortChange?: (sort: string) => void;

  hasActiveFilters?: boolean;
  onClearFilters?: () => void;

  vendors?: SidebarVendor[];
  selectedVendorId?: string;
  onVendorChange?: (vendorId: string) => void;

  warrantyFilter?: string;
  onWarrantyChange?: (value: string) => void;

  deliveryOptions?: DeliveryOption[];
  selectedDeliveryOptions?: string[];
  onDeliveryOptionsChange?: (options: string[]) => void;

  // নতুন attribute filter props
  attributeFilters?: AttributeFilter[];
  selectedAttributeFilters?: Record<string, string[]>;
  onAttributeFiltersChange?: (
    filters: Record<string, string[]>,
  ) => void;
};

/* ─── Reusable Dropdown ─────────────────────────── */

function DropdownSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-[#12233F]">
          <span className="text-amber-500">{icon}</span>
          {title}
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 p-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Subcategory List ──────────────────────────── */

function SubcategoryList({
  categories,
  selectedCategoryId,
}: {
  categories: CategoryNode[];
  selectedCategoryId?: string;
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, 7);

  const hiddenCount = Math.max(0, categories.length - 7);

  if (categories.length === 0) {
    return (
      <p className="p-3 text-xs text-slate-500">
        No subcategories found.
      </p>
    );
  }

  return (
    <div>
      {visibleCategories.map((category) => {
        const isSelected = category.id === selectedCategoryId;

        return (
          <Link
            key={category.id}
            href={`/categories/${encodeURIComponent(category.slug)}`}
            aria-current={isSelected ? "page" : undefined}
            className={`flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
              isSelected
                ? "bg-amber-50 font-semibold text-[#12233F]"
                : "text-slate-600 hover:bg-slate-50 hover:text-[#12233F]"
            }`}
          >
            <span className="min-w-0 flex-1 truncate">
              {category.name}
            </span>

            <span className="shrink-0 text-[10px] text-slate-400">
              {category.productCount ?? 0}
            </span>
          </Link>
        );
      })}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="flex w-full items-center justify-start gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
        >
          {showAll ? "Show less" : `View ${hiddenCount} more`}

          <ChevronDown
            size={13}
            className={`transition-transform ${
              showAll ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}

/* ─── Main Sidebar ──────────────────────────────── */

export default function CategorySidebar({
  categories,
  categoriesLoading,
  selectedCategoryId,
  brands,
  selectedBrandId,
  onBrandChange,
  sortBy,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  vendors = [],
  selectedVendorId = "",
  onVendorChange,
  warrantyFilter = "all",
  onWarrantyChange,
  deliveryOptions = DEFAULT_DELIVERY_OPTIONS,
  selectedDeliveryOptions = [],
  onDeliveryOptionsChange,
  attributeFilters = DEFAULT_ATTRIBUTE_FILTERS,
  selectedAttributeFilters = {},
  onAttributeFiltersChange,
}: CategorySidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);

  // Parent callback না দেওয়া থাকলেও UI selection কাজ করবে।
  const [localAttributeFilters, setLocalAttributeFilters] =
    useState<Record<string, string[]>>({});

  const activeAttributeFilters =
    onAttributeFiltersChange
      ? selectedAttributeFilters
      : localAttributeFilters;

  const scrollPositionRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (scrollPositionRef.current !== null) {
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: "instant",
      });

      scrollPositionRef.current = null;
    }
  }, [showAllBrands]);

  const displayedBrands = useMemo(() => {
    const query = brandSearch.trim().toLowerCase();

    const filtered = query
      ? brands.filter((brand) =>
          brand.name.toLowerCase().includes(query),
        )
      : brands;

    return query || showAllBrands
      ? filtered
      : filtered.slice(0, 8);
  }, [brands, brandSearch, showAllBrands]);

  const handleShowMoreBrands = () => {
    scrollPositionRef.current = window.scrollY;
    setShowAllBrands((value) => !value);
  };

  const toggleDeliveryOption = (optionId: string) => {
    if (!onDeliveryOptionsChange) return;

    const next = selectedDeliveryOptions.includes(optionId)
      ? selectedDeliveryOptions.filter((id) => id !== optionId)
      : [...selectedDeliveryOptions, optionId];

    onDeliveryOptionsChange(next);
  };

  const toggleAttributeOption = (
    key: string,
    option: string,
  ) => {
    const current = activeAttributeFilters[key] ?? [];

    const nextValues = current.includes(option)
      ? current.filter((value) => value !== option)
      : [...current, option];

    const nextFilters = { ...activeAttributeFilters };

    if (nextValues.length > 0) {
      nextFilters[key] = nextValues;
    } else {
      delete nextFilters[key];
    }

    if (onAttributeFiltersChange) {
      onAttributeFiltersChange(nextFilters);
    } else {
      setLocalAttributeFilters(nextFilters);
    }
  };

  const clearAttributeSelections = () => {
    setLocalAttributeFilters({});
    onAttributeFiltersChange?.({});
  };

  const displayedCategories = useMemo(() => {
    const selectedParent = categories.find(
      (category) => category.id === selectedCategoryId,
    );

    if (selectedParent) {
      return selectedParent.children ?? [];
    }

    const selectedChildParent = categories.find((category) =>
      (category.children ?? []).some(
        (child) => child.id === selectedCategoryId,
      ),
    );

    if (selectedChildParent) {
      return selectedChildParent.children ?? [];
    }

    return categories.flatMap(
      (category) => category.children ?? [],
    );
  }, [categories, selectedCategoryId]);

  const filterIcons: Record<string, React.ReactNode> = {
    colorVariation: <Palette size={15} />,
    weight: <Weight size={15} />,
    numberOfPcs: <Package size={15} />,
    size: <Ruler size={15} />,
    countryOfOrigin: <Globe2 size={15} />,
    colourOnly: <Palette size={15} />,
    material: <Layers3 size={15} />,
    volume: <Droplets size={15} />,
    productType: <Shapes size={15} />,
    rating: <Star size={15} />,
  };

  return (
    <aside className="min-w-0 space-y-4">
      {/* Categories */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#12233F]">
            <Layers3 size={16} className="text-amber-500" />
            Categories
          </h2>
        </div>

        <div
          className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ overflowAnchor: "none" }}
        >
          {categoriesLoading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-8 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : displayedCategories.length > 0 ? (
            <SubcategoryList
              categories={displayedCategories}
              selectedCategoryId={selectedCategoryId}
            />
          ) : (
            <p className="p-3 text-xs text-slate-500">
              No subcategories found.
            </p>
          )}
        </div>
      </section>

      {/* Sort */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#12233F]">
            <TrendingUp size={16} className="text-amber-500" />
            Sort
          </h2>
        </div>

        <div className="space-y-0.5 p-3">
          {SORT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"
            >
              <input
                type="radio"
                name="category-sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={() => onSortChange?.(option.value)}
                className="h-4 w-4 shrink-0 accent-[#12233F]"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Shop by Brand */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#12233F]">
            <Tag size={16} className="text-amber-500" />
            Shop by Brand
          </h2>
        </div>

        <div className="p-3">
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
            <Search size={14} className="shrink-0 text-slate-400" />

            <input
              type="text"
              value={brandSearch}
              onChange={(event) => {
                setBrandSearch(event.target.value);
                setShowAllBrands(false);
              }}
              placeholder="Search brand..."
              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div
            className="max-h-72 space-y-0.5 overflow-y-auto"
            style={{ overflowAnchor: "none" }}
          >
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50">
              <input
                type="radio"
                name="category-brand"
                checked={!selectedBrandId}
                onChange={() => onBrandChange("")}
                className="h-4 w-4 shrink-0 accent-[#12233F]"
              />
              <span>All Brands</span>
            </label>

            {displayedBrands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="category-brand"
                  checked={selectedBrandId === brand.id}
                  onChange={() =>
                    onBrandChange(
                      selectedBrandId === brand.id ? "" : brand.id,
                    )
                  }
                  className="h-4 w-4 shrink-0 accent-[#12233F]"
                />

                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    className="h-5 w-5 shrink-0 rounded object-contain"
                  />
                )}

                <span className="truncate">{brand.name}</span>
              </label>
            ))}

            {displayedBrands.length === 0 && (
              <p className="px-2 py-3 text-xs text-slate-400">
                No brands found.
              </p>
            )}
          </div>

          {!brandSearch && brands.length > 8 && (
            <button
              type="button"
              onClick={handleShowMoreBrands}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
            >
              {showAllBrands
                ? "Show less"
                : `View ${brands.length - 8} more`}

              <ChevronDown
                size={13}
                className={`transition-transform ${
                  showAllBrands ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </section>

      {/* Filter */}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setFilterOpen((value) => !value)}
          aria-expanded={filterOpen}
          className="flex w-full items-center justify-between gap-2 px-4 py-4 text-left transition hover:bg-slate-50"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-[#12233F]">
            <SlidersHorizontal size={16} className="text-amber-500" />
            Filter
          </span>

          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform ${
              filterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {filterOpen && (
          <div className="space-y-2 border-t border-slate-100 p-3">
            {/* Color Variation, Weight, Size and other attributes */}

            {attributeFilters.map((filter) => (
              <DropdownSection
                key={filter.key}
                title={filter.label}
                icon={
                  filterIcons[filter.key] ?? (
                    <SlidersHorizontal size={15} />
                  )
                }
              >
                <div className="max-h-52 space-y-1 overflow-y-auto">
                  {filter.options.map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={(
                          activeAttributeFilters[filter.key] ?? []
                        ).includes(option)}
                        onChange={() =>
                          toggleAttributeOption(filter.key, option)
                        }
                        className="h-4 w-4 shrink-0 rounded accent-[#12233F]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </DropdownSection>
            ))}

            {/* Warranty */}

            <DropdownSection
              title="Warranty"
              icon={<ShieldCheck size={15} />}
            >
              <div className="space-y-1">
                {WARRANTY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="category-warranty"
                      value={option.value}
                      checked={warrantyFilter === option.value}
                      onChange={() => onWarrantyChange?.(option.value)}
                      className="h-4 w-4 shrink-0 accent-[#12233F]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </DropdownSection>

            {/* Vendor */}

            <DropdownSection
              title="Vendor"
              icon={<Store size={15} />}
            >
              {vendors.length > 0 ? (
                <div className="max-h-60 space-y-1 overflow-y-auto">
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="category-vendor"
                      checked={!selectedVendorId}
                      onChange={() => onVendorChange?.("")}
                      className="h-4 w-4 shrink-0 accent-[#12233F]"
                    />
                    <span>All Vendors</span>
                  </label>

                  {vendors.map((vendor) => (
                    <label
                      key={vendor.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name="category-vendor"
                        checked={selectedVendorId === vendor.id}
                        onChange={() => onVendorChange?.(vendor.id)}
                        className="h-4 w-4 shrink-0 accent-[#12233F]"
                      />
                      <span className="truncate">{vendor.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="px-2 py-2 text-xs text-slate-500">
                  No vendors available.
                </p>
              )}
            </DropdownSection>

            {/* Delivery */}

            <DropdownSection
              title="Delivery"
              icon={<Truck size={15} />}
            >
              <div className="space-y-1">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDeliveryOptions.includes(option.id)}
                      onChange={() => toggleDeliveryOption(option.id)}
                      className="h-4 w-4 shrink-0 rounded accent-[#12233F]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </DropdownSection>
          </div>
        )}
      </section>

      {/* Clear filters */}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            clearAttributeSelections();
            onClearFilters?.();
          }}
          className="w-full rounded-xl border border-rose-200 bg-white py-2.5 text-xs font-bold text-rose-500 transition hover:bg-rose-50"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
