import type { ProductPlacement } from "./components/product-placement/types";

export const PLACEMENT_OPTIONS: {
  id: ProductPlacement;
  label: string;
  description: string;
}[] = [
  {
    id: "NEW_ARRIVAL",
    label: "New Arrival",
    description: "Show this product as a new arrival.",
  },
  {
    id: "FLASH_SALE",
    label: "Flash Sale",
    description: "Add this product to flash sale.",
  },
  {
    id: "FEATURED",
    label: "Featured",
    description: "Show this product in featured products.",
  },
  {
    id: "TOP_SELLER",
    label: "Top Seller",
    description: "Show this product as a top seller.",
  },
  {
    id: "TOP_RATED",
    label: "Top Rated",
    description: "Show this product as a top rated product.",
  },
  {
    id: "TRUSTED",
    label: "Trusted",
    description: "Show this product as a trusted product.",
  },
];