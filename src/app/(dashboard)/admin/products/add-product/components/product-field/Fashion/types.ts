// types.ts

export type ProductBasicInfo = {
  title: string;
  slug: string;

  shortDescription: string;
  description: string;

  regularPrice: string;
  salePrice: string;

  stockQuantity: string;
  categoryId: string;

  customerRegularPrice: string;
  customerSalePrice: string;

  wholesalerRegularPrice: string;
  wholesalerSalePrice: string;

  dropshipPrice: string;

  affiliateCommissionType:
    | "PERCENTAGE"
    | "FIXED"
    | "";

  affiliateCommissionValue: string;
};

export type DemoCategory = {
  id: string;
  name: string;
  parentId: string | null;
};

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

export type ProductPlacement =
  | "NEW_ARRIVAL"
  | "FLASH_SALE"
  | "FEATURED"
  | "TOP_SELLER"
  | "TOP_RATED"
  | "TRUSTED";

export type NewArrivalData = {
  badgeText: string;
  displayOrder: string;
  startDate: string;
  endDate: string;
};

export type FlashSaleData = {
  flashSalePrice: string;
  flashSaleStock: string;
  startTime: string;
  endTime: string;
  discountBadge: string;
};

export type FeaturedData = {
  featuredBadgeText: string;
  bannerImage: string;
  displayOrder: string;
};

export type TopSellerData = {
  unitsSold: string;
  salesBadge: string;
  isExpressEligible: boolean;
};

export type TopRatedData = {
  averageRating: string;
  totalReviews: string;
  reviewSnippet: string;
};

export type TrustedData = {
  trustBadgeText: string;
  warrantyInfo: string;
  officialStore: boolean;
};

export type ProductPlacementData = {
  newArrival: NewArrivalData;
  flashSale: FlashSaleData;
  featured: FeaturedData;
  topSeller: TopSellerData;
  topRated: TopRatedData;
  trusted: TrustedData;
};