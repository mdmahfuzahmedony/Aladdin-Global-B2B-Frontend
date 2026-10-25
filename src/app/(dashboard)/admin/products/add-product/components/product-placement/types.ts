// types.ts

// =========================================================
// Product Basic Information
// =========================================================

export type ProductBasicInfo = {
  title: string;
  slug: string;
 sku: string;
  shortDescription: string;
  description: string;

  regularPrice: string;
  salePrice: string;

  stockQuantity: string;
  categoryId: string;
  purchasePrice: string;

  // Customer Pricing
  customerRegularPrice: string;
  customerSalePrice: string;

  // Seller / Retailer Pricing
  sellerRegularPrice: string;
  sellerSalePrice: string;

  // Wholesaler Pricing
  wholesalerRegularPrice: string;
  wholesalerSalePrice: string;

  // Dropshipping
  dropshipPrice: string;

  // Affiliate
  affiliateCommissionType:
    | "PERCENTAGE"
    | "FIXED"
    | "";

  affiliateCommissionValue: string;
};


// =========================================================
// Demo Category
// =========================================================

export type DemoCategory = {
  id: string;
  name: string;
  parentId: string | null;
};


// =========================================================
// Custom Product Field
// =========================================================

export type ProductFieldDefinition = {
  name: string;
  key: string;
  type: string;

  placeholder?: string;
  description?: string;

  required?: boolean;

  options?: {
    label: string;
    value: string;
  }[];
};


// =========================================================
// Product Placements
// =========================================================

export type ProductPlacement =
  | "NEW_ARRIVAL"
  | "FLASH_SALE"
  | "FEATURED"
  | "TOP_SELLER"
  | "TOP_RATED"
  | "TRUSTED";


// =========================================================
// New Arrival
// =========================================================

export type NewArrivalData = {
  badgeText: string;
  displayOrder: string;
  startDate: string;
  endDate: string;
};


// =========================================================
// Flash Sale
// =========================================================

export type FlashSaleData = {
  flashSalePrice: string;
  flashSaleStock: string;
  startTime: string;
  endTime: string;
  discountBadge: string;
};


// =========================================================
// Featured
// =========================================================

export type FeaturedData = {
  featuredBadgeText: string;
  bannerImage: string;
  displayOrder: string;
};


// =========================================================
// Top Seller
// =========================================================

export type TopSellerData = {
  unitsSold: string;
  salesBadge: string;
  isExpressEligible: boolean;
};


// =========================================================
// Top Rated
// =========================================================

export type TopRatedData = {
  averageRating: string;
  totalReviews: string;
  reviewSnippet: string;
};


// =========================================================
// Trusted
// =========================================================

export type TrustedData = {
  trustBadgeText: string;
  warrantyInfo: string;
  officialStore: boolean;
};


// =========================================================
// Placement State
// =========================================================

export type ProductPlacementData = {
  newArrival: NewArrivalData;
  flashSale: FlashSaleData;
  featured: FeaturedData;
  topSeller: TopSellerData;
  topRated: TopRatedData;
  trusted: TrustedData;
};