export type ProductImage = {
  id: string;
  url: string;
  alt?: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  available?: boolean;
};

export type RelatedProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  sold?: number;
  discount?: number;
};

export type VendorLocation = {
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
  area?: string | null;
  fullAddress?: string | null;
};

export type ProductDeliveryRate = {
  minDistanceKm: number;
  maxDistanceKm: number;
  firstKgCharge: number;
  additionalKgCharge: number;
};

export type ProductDeliverySettings = {
  scope?: "UPAZILA_BASED" | "NATIONWIDE" | string | null;
  weightKg?: number | null;
  rates?: ProductDeliveryRate[];
  nationwideCharge?: number | null;
};

export type ProductAttributes = {
  brand?: string;
  fabric?: string;
  pattern?: string;
  fit?: string;
  sleeveType?: string;
  collarType?: string;

  colors?: {
    color: string;
    images?: string[];
    sizes?: {
      size: string;
      stock?: string | number;
    }[];
  }[];

  [key: string]: unknown;
};

export type ProductDetails = {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  soldCount?: number;
  stock?: number;

  sellerName: string;
  sellerId?: string;

  price: number;
  oldPrice?: number;
  discount?: number;

  rating: number;
  reviewCount: number;

  images: ProductImage[];
  description: string;
  shortDescription?: string;

  attributes?: ProductAttributes | null;

  specifications: {
    label: string;
    value: string;
  }[];

  variants?: ProductVariant[];

  delivery: {
    availableArea: string;
    location: string;
    deliveryTime: string;
    shippingCharge: number;
    freeShippingMinimum?: number;
    collectionPoint: boolean;
    cashOnDelivery: boolean;
  };

  returnPolicy: string[];

  vendor: {
    id?: string;
    name: string;
    location: string;
    locationDetails?: VendorLocation | null;
    positiveSellerRating: number;
    shippingOnTime: number;
    averageRating?: number;
    totalReviews?: number;
    sellerSize?: string;
  };

  deliverySettings?: ProductDeliverySettings | null;

  relatedProducts: RelatedProduct[];
  boughtTogether: RelatedProduct[];
};