"use client";

import React, { useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  Leaf,
  Clock,
  ShieldCheck,
  Scale,
  Layers,
  Tag,
  Box,
  Shirt,
  Utensils,
  Award,
  PackageCheck,
  AlertCircle,
  Scissors,
  Check,
  Droplets,
  Calendar,
  MapPin,
  Flame,
  Info,
} from "lucide-react";
import type { ProductDetails, ProductAttributes } from "../types";

// ============================================================================
// TYPES
// ============================================================================

export type CategoryDomain =
  | "BAKERY_BISCUITS"
  | "FRESH_PRODUCE"
  | "BEVERAGES"
  | "COOKING_ESSENTIALS"
  | "DAIRY_EGGS"
  | "MEAT_FISH"
  | "SNACKS_PACKAGED"
  | "FASHION_APPAREL"
  | "FASHION_FOOTWEAR"
  | "ACCESSORIES"
  | "HOUSEHOLD_PET"
  | "GENERAL";

export interface HighlightItem {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: "amber" | "emerald" | "blue" | "indigo" | "rose" | "slate";
}

export interface SpecRow {
  key: string;
  label: string;
  value: string | React.ReactNode;
  isBadge?: boolean;
  badgeVariant?: "success" | "warning" | "info" | "default";
}

export interface SpecGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  rows: SpecRow[];
}

// ============================================================================
// DICTIONARY & NORMALIZATION
// ============================================================================

const KNOWN_LABELS: Record<string, string> = {
  // Biscuits & Bakery
  biscuitType: "Biscuit Type",
  breadType: "Bread Type",
  bakeryProductType: "Bakery Product Type",
  bunType: "Bun Type",
  cakeType: "Cake Type",
  pastryType: "Pastry Type",
  cookieType: "Cookie Type",
  flavor: "Flavor / Taste",
  filling: "Filling",
  sweetness: "Sweetness",
  netWeight: "Net Weight",
  weightUnit: "Weight Unit",
  packType: "Packaging Type",
  dietaryPreference: "Dietary Preference",
  texture: "Texture",
  keyIngredients: "Key Ingredients",
  allergenInfo: "Allergen Information",
  packCount: "Package Count",
  manufacturingDate: "Manufacturing Date",
  expiryDate: "Expiry Date",
  shelfLife: "Shelf Life",
  storageCondition: "Storage Condition",
  countryOfOrigin: "Country of Origin",
  certification: "Certifications",
  isHalal: "Halal Certified",

  // Produce / Vegetables / Fruits
  vegetableType: "Vegetable Type",
  fruitType: "Fruit Type",
  cutType: "Cut / Style",
  mixType: "Mix Variety",
  blanched: "Blanched",
  preparation: "Preparation",
  organic: "Organic Status",
  freshnessGuarantee: "Freshness Guarantee",
  grade: "Produce Grade",
  origin: "Origin / Farm Source",

  // Beverages
  beverageType: "Beverage Type",
  productType: "Product Type",
  teaType: "Tea Variety",
  coffeeType: "Coffee Variety",
  drinkType: "Drink Type",
  juiceType: "Juice Type",
  caffeineContent: "Caffeine Content",
  caffeineLevel: "Caffeine Level",
  mineralContent: "Mineral Content",
  electrolyteContent: "Electrolyte Content",
  netVolume: "Net Volume",
  volume: "Volume / Net Qty",
  packaging: "Packaging Type",
  source: "Source",
  sugarLevel: "Sugar Level",
  phLevel: "pH Level",
  carbonated: "Carbonated",
  roastLevel: "Roast Level",
  addedSugar: "Added Sugar",

  // Cooking & Essentials
  riceType: "Rice Variety",
  grainSize: "Grain Size",
  grainType: "Grain Type",
  dalType: "Lentil / Dal Type",
  flourType: "Flour Type",
  oilType: "Oil Variety",
  extractionMethod: "Extraction Method",
  purity: "Purity Grade",
  processing: "Processing Method",
  aroma: "Aroma Profile",
  brokenPercentage: "Broken Grain %",
  fortified: "Fortified with Vitamins",
  spiceType: "Spice Type",
  saltType: "Salt Variety",
  form: "Form / Texture",

  // Dairy & Eggs
  milkType: "Milk Variety",
  dairyType: "Dairy Variety",
  eggType: "Egg Variety",
  fatContent: "Fat Content",
  pasteurized: "Pasteurization",

  // Meat & Fish
  meatType: "Meat Variety",
  fishType: "Fish Variety",
  freshnessStatus: "Freshness Status",
  sourcing: "Sourcing Method",

  // Snacks & Packaged
  snackType: "Snack Type",
  noodleType: "Noodle Variety",
  cookingTime: "Cooking Time",
  spiceLevel: "Spice Level",
  preservativeFree: "Preservative Free",

  // Fashion - Apparel
  fabric: "Fabric / Material",
  pattern: "Pattern",
  fit: "Fit Type",
  sleeveType: "Sleeve Type",
  collarType: "Collar Type",
  neckType: "Neckline",
  gender: "Target Gender",
  occasion: "Occasion / Use",
  careInstruction: "Care Instructions",
  washCare: "Wash & Care",
  stretchable: "Stretchable",
  length: "Length",
  waistType: "Waistline",
  kameezFabric: "Kameez Fabric",
  salwarFabric: "Salwar Fabric",
  dupattaFabric: "Dupatta Fabric",
  workType: "Work / Embellishment",

  // Fashion - Footwear
  upperMaterial: "Upper Material",
  soleMaterial: "Sole Material",
  insole: "Insole Type",
  closureType: "Closure Type",
  shoeType: "Shoe Style",
  heelType: "Heel Type",
  heelHeight: "Heel Height",
  toeShape: "Toe Shape",
  waterproof: "Waterproof / Water Resistant",

  // Accessories
  movement: "Movement",
  dialShape: "Dial Shape",
  dialColor: "Dial Color",
  strapMaterial: "Strap Material",
  waterResistance: "Water Resistance",
  warranty: "Warranty",
  capacity: "Capacity / Compartments",
  plating: "Plating",
  stoneType: "Stone / Gem Type",

  // Household & Pet
  cleaningType: "Cleaning Purpose",
  scent: "Fragrance / Scent",
  safetyInstructions: "Safety Instructions",
  petType: "Pet Animal",
  foodType: "Food Type",
  lifeStage: "Life Stage",
};

// Ignore internal or already handled properties
const IGNORED_ATTRIBUTE_KEYS = new Set([
  "colors",
  "sizes",
  "delivery",
  "returnPolicy",
  "shortDescription",
  "brand",
  "subcategory",
  "pricing",
  "images",
  "id",
  "sku",
  "slug",
  "_count",
  "__v",
  "createdAt",
  "updatedAt",
  "status",
  "vendorId",
  "sellerId",
]);

export function formatKeyLabel(key: string): string {
  if (KNOWN_LABELS[key]) {
    return KNOWN_LABELS[key];
  }
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function formatAttributeValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "number") return String(val);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.toLowerCase() === "true" || trimmed.toLowerCase() === "yes") return "Yes";
    if (trimmed.toLowerCase() === "false" || trimmed.toLowerCase() === "no") return "No";
    return trimmed;
  }
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .filter(Boolean)
      .join(", ");
  }
  if (typeof val === "object") {
    try {
      const entries = Object.entries(val);
      if (entries.length === 0) return "";
      return entries.map(([k, v]) => `${formatKeyLabel(k)}: ${String(v)}`).join(", ");
    } catch {
      return String(val);
    }
  }
  return String(val);
}

// ============================================================================
// DOMAIN DETECTION
// ============================================================================

export function detectCategoryDomain(
  category = "",
  subcategory = "",
  attributes: Record<string, unknown> = {}
): CategoryDomain {
  const combined = `${category} ${subcategory}`.toLowerCase();
  const keys = Object.keys(attributes).map((k) => k.toLowerCase());

  // 1. Biscuits & Bakery
  if (
    combined.includes("biscuit") ||
    combined.includes("bakery") ||
    combined.includes("cookie") ||
    combined.includes("bread") ||
    combined.includes("cake") ||
    combined.includes("pastry") ||
    combined.includes("toast") ||
    combined.includes("sweet") ||
    combined.includes("chocolate") ||
    keys.includes("biscuittype") ||
    keys.includes("cookieType")
  ) {
    return "BAKERY_BISCUITS";
  }

  // 2. Fresh Produce / Vegetables / Fruits
  if (
    combined.includes("vegetable") ||
    combined.includes("produce") ||
    combined.includes("fruit") ||
    combined.includes("greens") ||
    combined.includes("shak") ||
    combined.includes("sobji") ||
    combined.includes("fresh produce") ||
    keys.includes("vegetabletype") ||
    keys.includes("fruittype")
  ) {
    return "FRESH_PRODUCE";
  }

  // 3. Beverages
  if (
    combined.includes("beverage") ||
    combined.includes("tea") ||
    combined.includes("coffee") ||
    combined.includes("juice") ||
    combined.includes("drink") ||
    combined.includes("water") ||
    keys.includes("teatype") ||
    keys.includes("coffeetype")
  ) {
    return "BEVERAGES";
  }

  // 4. Dairy & Eggs
  if (
    combined.includes("dairy") ||
    combined.includes("milk") ||
    combined.includes("egg") ||
    combined.includes("butter") ||
    combined.includes("cheese") ||
    combined.includes("ghee") ||
    keys.includes("milktype") ||
    keys.includes("eggtype")
  ) {
    return "DAIRY_EGGS";
  }

  // 5. Cooking & Essentials
  if (
    combined.includes("cooking") ||
    combined.includes("rice") ||
    combined.includes("dal") ||
    combined.includes("oil") ||
    combined.includes("flour") ||
    combined.includes("atta") ||
    combined.includes("spice") ||
    combined.includes("salt") ||
    combined.includes("masala") ||
    keys.includes("ricetype") ||
    keys.includes("oiltype") ||
    keys.includes("spicetype")
  ) {
    return "COOKING_ESSENTIALS";
  }

  // 6. Meat & Fish
  if (
    combined.includes("meat") ||
    combined.includes("fish") ||
    combined.includes("chicken") ||
    combined.includes("beef") ||
    combined.includes("mutton") ||
    keys.includes("cuttype") ||
    keys.includes("meattype")
  ) {
    return "MEAT_FISH";
  }

  // 7. Snacks & Packaged
  if (
    combined.includes("snack") ||
    combined.includes("chips") ||
    combined.includes("noodle") ||
    combined.includes("pasta") ||
    combined.includes("honey") ||
    combined.includes("jam") ||
    combined.includes("sauce") ||
    keys.includes("snacktype")
  ) {
    return "SNACKS_PACKAGED";
  }

  // 8. Footwear
  if (
    combined.includes("shoe") ||
    combined.includes("footwear") ||
    combined.includes("sandal") ||
    combined.includes("sneaker") ||
    combined.includes("boot") ||
    combined.includes("loafer") ||
    keys.includes("uppermaterial") ||
    keys.includes("solematerial")
  ) {
    return "FASHION_FOOTWEAR";
  }

  // 9. Apparel / Clothing
  if (
    combined.includes("shirt") ||
    combined.includes("pant") ||
    combined.includes("panjabi") ||
    combined.includes("fashion") ||
    combined.includes("clothing") ||
    combined.includes("apparel") ||
    combined.includes("dress") ||
    combined.includes("saree") ||
    combined.includes("t-shirt") ||
    combined.includes("jeans") ||
    keys.includes("fabric") ||
    keys.includes("sleevetype")
  ) {
    return "FASHION_APPAREL";
  }

  // 10. Accessories
  if (
    combined.includes("watch") ||
    combined.includes("bag") ||
    combined.includes("jewelry") ||
    combined.includes("cap") ||
    combined.includes("wallet") ||
    keys.includes("strapmaterial") ||
    keys.includes("dialshape")
  ) {
    return "ACCESSORIES";
  }

  // 11. Household & Pet
  if (
    combined.includes("clean") ||
    combined.includes("laundry") ||
    combined.includes("pet") ||
    combined.includes("detergent") ||
    keys.includes("cleaningtype") ||
    keys.includes("pettype")
  ) {
    return "HOUSEHOLD_PET";
  }

  return "GENERAL";
}

// ============================================================================
// HIGHLIGHTS EXTRACTION (For ProductInfo.tsx)
// ============================================================================

export function extractCategoryHighlights(product: ProductDetails): HighlightItem[] {
  const attrs = (product.attributes ?? {}) as Record<string, unknown>;
  const domain = detectCategoryDomain(
    product.category,
    product.subcategory,
    attrs
  );

  const getVal = (k: string) => {
    const v = attrs[k];
    return v !== null && v !== undefined && String(v).trim() !== ""
      ? formatAttributeValue(v)
      : null;
  };

  const highlights: HighlightItem[] = [];

  switch (domain) {
    case "BAKERY_BISCUITS": {
      const type = getVal("biscuitType") || getVal("cookieType") || getVal("breadType") || getVal("cakeType");
      if (type) highlights.push({ id: "type", label: "Type", value: type, icon: <Sparkles size={13} />, variant: "amber" });

      const flavor = getVal("flavor");
      if (flavor) highlights.push({ id: "flavor", label: "Flavor", value: flavor, icon: <Utensils size={13} />, variant: "rose" });

      const weight = getVal("netWeight") ? `${getVal("netWeight")} ${getVal("weightUnit") || ""}`.trim() : null;
      if (weight) highlights.push({ id: "weight", label: "Net Weight", value: weight, icon: <Scale size={13} />, variant: "blue" });

      const shelfLife = getVal("shelfLife");
      if (shelfLife) highlights.push({ id: "shelf", label: "Shelf Life", value: shelfLife, icon: <Clock size={13} />, variant: "slate" });

      const isHalal = getVal("isHalal");
      if (isHalal === "Yes" || isHalal === "Halal" || isHalal === "Halal Certified") {
        highlights.push({ id: "halal", label: "Certification", value: "Halal Certified", icon: <ShieldCheck size={13} />, variant: "emerald" });
      }
      break;
    }

    case "FRESH_PRODUCE": {
      const vegType = getVal("vegetableType") || getVal("fruitType");
      if (vegType) highlights.push({ id: "vegType", label: "Variety", value: vegType, icon: <Leaf size={13} />, variant: "emerald" });

      const organic = getVal("organic");
      if (organic === "Yes") highlights.push({ id: "organic", label: "Standard", value: "100% Organic", icon: <CheckCircle2 size={13} />, variant: "emerald" });

      const origin = getVal("origin");
      if (origin) highlights.push({ id: "origin", label: "Origin", value: origin, icon: <MapPin size={13} />, variant: "blue" });

      const freshness = getVal("freshnessGuarantee") || "Guaranteed Fresh";
      highlights.push({ id: "freshness", label: "Freshness", value: freshness, icon: <Sparkles size={13} />, variant: "emerald" });

      const storage = getVal("storageCondition");
      if (storage) highlights.push({ id: "storage", label: "Storage", value: storage, icon: <Box size={13} />, variant: "indigo" });
      break;
    }

    case "BEVERAGES": {
      const type = getVal("teaType") || getVal("coffeeType") || getVal("drinkType");
      if (type) highlights.push({ id: "drinkType", label: "Variety", value: type, icon: <Sparkles size={13} />, variant: "amber" });

      const flavor = getVal("flavor");
      if (flavor) highlights.push({ id: "flavor", label: "Flavor", value: flavor, icon: <Utensils size={13} />, variant: "rose" });

      const vol = getVal("volume") || getVal("netVolume");
      if (vol) highlights.push({ id: "vol", label: "Volume", value: vol, icon: <Scale size={13} />, variant: "blue" });

      const caffeine = getVal("caffeineContent");
      if (caffeine) highlights.push({ id: "caffeine", label: "Caffeine", value: caffeine, icon: <Flame size={13} />, variant: "indigo" });

      const shelf = getVal("shelfLife");
      if (shelf) highlights.push({ id: "shelf", label: "Shelf Life", value: shelf, icon: <Clock size={13} />, variant: "slate" });
      break;
    }

    case "COOKING_ESSENTIALS": {
      const type = getVal("riceType") || getVal("dalType") || getVal("oilType") || getVal("flourType") || getVal("spiceType");
      if (type) highlights.push({ id: "type", label: "Type", value: type, icon: <Sparkles size={13} />, variant: "amber" });

      const purity = getVal("purity") || getVal("extractionMethod") || getVal("processing");
      if (purity) highlights.push({ id: "purity", label: "Grade", value: purity, icon: <ShieldCheck size={13} />, variant: "emerald" });

      const weight = getVal("netWeight") || getVal("volume");
      if (weight) highlights.push({ id: "weight", label: "Net Qty", value: weight, icon: <Scale size={13} />, variant: "blue" });

      const shelf = getVal("shelfLife");
      if (shelf) highlights.push({ id: "shelf", label: "Shelf Life", value: shelf, icon: <Clock size={13} />, variant: "slate" });
      break;
    }

    case "DAIRY_EGGS": {
      const type = getVal("milkType") || getVal("dairyType") || getVal("eggType");
      if (type) highlights.push({ id: "type", label: "Type", value: type, icon: <Sparkles size={13} />, variant: "blue" });

      const fat = getVal("fatContent");
      if (fat) highlights.push({ id: "fat", label: "Fat Content", value: fat, icon: <Droplets size={13} />, variant: "indigo" });

      const pasteurized = getVal("pasteurized");
      if (pasteurized) highlights.push({ id: "pasteurized", label: "Processing", value: pasteurized, icon: <ShieldCheck size={13} />, variant: "emerald" });

      const vol = getVal("volume") || getVal("packCount");
      if (vol) highlights.push({ id: "vol", label: "Pack Size", value: vol, icon: <Scale size={13} />, variant: "slate" });
      break;
    }

    case "FASHION_APPAREL": {
      const fabric = getVal("fabric") || getVal("material");
      if (fabric) highlights.push({ id: "fabric", label: "Fabric", value: fabric, icon: <Shirt size={13} />, variant: "indigo" });

      const fit = getVal("fit");
      if (fit) highlights.push({ id: "fit", label: "Fit", value: fit, icon: <Scissors size={13} />, variant: "blue" });

      const sleeve = getVal("sleeveType");
      if (sleeve) highlights.push({ id: "sleeve", label: "Sleeve", value: sleeve, icon: <Tag size={13} />, variant: "amber" });

      const collar = getVal("collarType") || getVal("neckType");
      if (collar) highlights.push({ id: "collar", label: "Collar", value: collar, icon: <Layers size={13} />, variant: "slate" });

      const pattern = getVal("pattern");
      if (pattern) highlights.push({ id: "pattern", label: "Pattern", value: pattern, icon: <Sparkles size={13} />, variant: "rose" });
      break;
    }

    case "FASHION_FOOTWEAR": {
      const upper = getVal("upperMaterial");
      if (upper) highlights.push({ id: "upper", label: "Upper Material", value: upper, icon: <Layers size={13} />, variant: "amber" });

      const sole = getVal("soleMaterial");
      if (sole) highlights.push({ id: "sole", label: "Sole Material", value: sole, icon: <ShieldCheck size={13} />, variant: "indigo" });

      const closure = getVal("closureType");
      if (closure) highlights.push({ id: "closure", label: "Closure", value: closure, icon: <Tag size={13} />, variant: "blue" });

      const shoeType = getVal("shoeType");
      if (shoeType) highlights.push({ id: "shoeType", label: "Style", value: shoeType, icon: <Sparkles size={13} />, variant: "emerald" });
      break;
    }

    default: {
      // General highlights: extract first 4 valid scalar attributes
      const entries = Object.entries(attrs).filter(
        ([k, v]) => !IGNORED_ATTRIBUTE_KEYS.has(k) && v !== null && v !== undefined && String(v).trim() !== ""
      );

      entries.slice(0, 4).forEach(([k, v]) => {
        highlights.push({
          id: k,
          label: formatKeyLabel(k),
          value: formatAttributeValue(v),
          icon: <Tag size={13} />,
          variant: "indigo",
        });
      });
      break;
    }
  }

  return highlights;
}

// ============================================================================
// FULL SPECIFICATIONS GROUPING (For ProductTabs.tsx)
// ============================================================================

export function extractGroupedSpecifications(product: ProductDetails): SpecGroup[] {
  const attrs = (product.attributes ?? {}) as Record<string, unknown>;
  const domain = detectCategoryDomain(product.category, product.subcategory, attrs);

  const groups: SpecGroup[] = [];
  const processedKeys = new Set<string>();

  // 1. General Product Specifications (All products have these)
  const generalRows: SpecRow[] = [];

  if (product.brand) {
    generalRows.push({ key: "brand", label: "Brand", value: product.brand });
  }

  if (product.category) {
    generalRows.push({
      key: "category",
      label: "Category",
      value: product.subcategory
        ? `${product.category} > ${product.subcategory}`
        : product.category,
    });
  }

  if (product.sku) {
    generalRows.push({ key: "sku", label: "Product SKU", value: product.sku });
  }

  generalRows.push({
    key: "stockStatus",
    label: "Stock Availability",
    value: (product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock",
    isBadge: true,
    badgeVariant: (product.stock ?? 0) > 0 ? "success" : "default",
  });

  if (product.sellerName) {
    generalRows.push({
      key: "seller",
      label: "Sold By",
      value: product.sellerName,
    });
  }

  groups.push({
    id: "general",
    title: "General Information",
    icon: <Tag size={16} className="text-[#12233f]" />,
    rows: generalRows,
  });

  // Helper to extract rows for a list of target keys
  const buildRows = (keys: string[]): SpecRow[] => {
    const rows: SpecRow[] = [];
    keys.forEach((k) => {
      const v = attrs[k];
      if (v !== null && v !== undefined && String(v).trim() !== "") {
        processedKeys.add(k);
        const formattedVal = formatAttributeValue(v);
        const isCertBadge =
          k.toLowerCase().includes("halal") ||
          k.toLowerCase().includes("organic") ||
          k.toLowerCase().includes("waterproof") ||
          k.toLowerCase().includes("certified");

        rows.push({
          key: k,
          label: formatKeyLabel(k),
          value: formattedVal,
          isBadge: isCertBadge && (formattedVal === "Yes" || formattedVal.includes("Certified")),
          badgeVariant: "success",
        });
      }
    });
    return rows;
  };

  // 2. Domain-Specific Groups
  if (domain === "BAKERY_BISCUITS") {
    const foodRows = buildRows(["bakeryProductType", "biscuitType", "breadType", "cakeType", "cookieType", "flavor", "filling", "sweetness", "texture", "keyIngredients", "allergenInfo"]);
    if (foodRows.length > 0) {
      groups.push({
        id: "bakery-details",
        title: "Product Taste & Ingredients",
        icon: <Utensils size={16} className="text-amber-600" />,
        rows: foodRows,
      });
    }

    const packRows = buildRows(["netWeight", "weightUnit", "packType", "packCount"]);
    if (packRows.length > 0) {
      groups.push({
        id: "bakery-packaging",
        title: "Packaging & Measurement",
        icon: <Scale size={16} className="text-blue-600" />,
        rows: packRows,
      });
    }

    const qualRows = buildRows(["dietaryPreference", "isHalal", "certification", "countryOfOrigin", "shelfLife", "storageCondition", "manufacturingDate", "expiryDate"]);
    if (qualRows.length > 0) {
      groups.push({
        id: "bakery-storage",
        title: "Storage, Shelf Life & Quality",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        rows: qualRows,
      });
    }
  } else if (domain === "FRESH_PRODUCE") {
    const produceRows = buildRows(["vegetableType", "fruitType", "grade", "mixType", "cutType", "freshnessGuarantee", "organic", "origin"]);
    if (produceRows.length > 0) {
      groups.push({
        id: "produce-quality",
        title: "Produce Origin & Quality",
        icon: <Leaf size={16} className="text-emerald-600" />,
        rows: produceRows,
      });
    }

    const storageRows = buildRows(["storageCondition", "shelfLife", "preparation", "blanched"]);
    if (storageRows.length > 0) {
      groups.push({
        id: "produce-storage",
        title: "Freshness & Storage Guide",
        icon: <Box size={16} className="text-blue-600" />,
        rows: storageRows,
      });
    }
  } else if (domain === "BEVERAGES") {
    const bevRows = buildRows(["beverageType", "teaType", "coffeeType", "drinkType", "juiceType", "productType", "flavor", "fruitType", "caffeineContent", "caffeineLevel", "roastLevel", "mineralContent", "electrolyteContent", "preparation", "sugarLevel"]);
    if (bevRows.length > 0) {
      groups.push({
        id: "bev-flavor",
        title: "Beverage Profile & Type",
        icon: <Utensils size={16} className="text-amber-600" />,
        rows: bevRows,
      });
    }

    const packRows = buildRows(["volume", "netVolume", "packaging", "packType", "carbonated", "phLevel", "source", "addedSugar", "shelfLife", "storageCondition"]);
    if (packRows.length > 0) {
      groups.push({
        id: "bev-pack",
        title: "Packaging & Preservation",
        icon: <Scale size={16} className="text-blue-600" />,
        rows: packRows,
      });
    }
  } else if (domain === "COOKING_ESSENTIALS") {
    const cookRows = buildRows(["riceType", "grainSize", "dalType", "flourType", "oilType", "spiceType", "saltType", "purity", "extractionMethod", "processing", "aroma", "brokenPercentage", "fortified", "form"]);
    if (cookRows.length > 0) {
      groups.push({
        id: "cooking-specs",
        title: "Essential Quality & Processing",
        icon: <Sparkles size={16} className="text-amber-600" />,
        rows: cookRows,
      });
    }

    const cookStorage = buildRows(["netWeight", "volume", "origin", "shelfLife", "storageCondition"]);
    if (cookStorage.length > 0) {
      groups.push({
        id: "cooking-storage",
        title: "Quantity & Shelf Life",
        icon: <Scale size={16} className="text-blue-600" />,
        rows: cookStorage,
      });
    }
  } else if (domain === "DAIRY_EGGS") {
    const dairyRows = buildRows(["milkType", "dairyType", "eggType", "source", "fatContent", "pasteurized", "dietaryPreference", "grade"]);
    if (dairyRows.length > 0) {
      groups.push({
        id: "dairy-specs",
        title: "Dairy / Egg Quality & Content",
        icon: <ShieldCheck size={16} className="text-blue-600" />,
        rows: dairyRows,
      });
    }

    const dairyStorage = buildRows(["volume", "packCount", "packaging", "storageCondition", "shelfLife"]);
    if (dairyStorage.length > 0) {
      groups.push({
        id: "dairy-storage",
        title: "Packaging & Fresh Storage",
        icon: <Box size={16} className="text-emerald-600" />,
        rows: dairyStorage,
      });
    }
  } else if (domain === "FASHION_APPAREL") {
    const matRows = buildRows(["fabric", "material", "kameezFabric", "salwarFabric", "dupattaFabric", "lining", "stretchable"]);
    if (matRows.length > 0) {
      groups.push({
        id: "fashion-mat",
        title: "Fabric & Material Construction",
        icon: <Shirt size={16} className="text-indigo-600" />,
        rows: matRows,
      });
    }

    const cutRows = buildRows(["fit", "pattern", "sleeveType", "collarType", "neckType", "length", "waistType", "workType"]);
    if (cutRows.length > 0) {
      groups.push({
        id: "fashion-cut",
        title: "Fit, Cut & Design Details",
        icon: <Scissors size={16} className="text-blue-600" />,
        rows: cutRows,
      });
    }

    const careRows = buildRows(["occasion", "gender", "careInstruction", "washCare"]);
    if (careRows.length > 0) {
      groups.push({
        id: "fashion-care",
        title: "Care & Occasion",
        icon: <Sparkles size={16} className="text-amber-600" />,
        rows: careRows,
      });
    }
  } else if (domain === "FASHION_FOOTWEAR") {
    const footMat = buildRows(["upperMaterial", "soleMaterial", "insole", "liningMaterial"]);
    if (footMat.length > 0) {
      groups.push({
        id: "foot-mat",
        title: "Material & Construction",
        icon: <Layers size={16} className="text-amber-600" />,
        rows: footMat,
      });
    }

    const footStyle = buildRows(["shoeType", "closureType", "toeShape", "heelType", "heelHeight", "waterproof", "occasion", "gender"]);
    if (footStyle.length > 0) {
      groups.push({
        id: "foot-style",
        title: "Design, Style & Features",
        icon: <ShieldCheck size={16} className="text-indigo-600" />,
        rows: footStyle,
      });
    }
  } else if (domain === "ACCESSORIES") {
    const accRows = buildRows(["movement", "dialShape", "dialColor", "strapMaterial", "waterResistance", "capacity", "warranty", "plating", "stoneType", "closureType"]);
    if (accRows.length > 0) {
      groups.push({
        id: "acc-specs",
        title: "Technical Specifications & Materials",
        icon: <Sparkles size={16} className="text-amber-600" />,
        rows: accRows,
      });
    }
  }

  // 3. Fallback / Remaining Attributes
  const remainingRows: SpecRow[] = [];
  Object.entries(attrs).forEach(([k, v]) => {
    if (
      !IGNORED_ATTRIBUTE_KEYS.has(k) &&
      !processedKeys.has(k) &&
      v !== null &&
      v !== undefined &&
      String(v).trim() !== ""
    ) {
      remainingRows.push({
        key: k,
        label: formatKeyLabel(k),
        value: formatAttributeValue(v),
      });
    }
  });

  if (remainingRows.length > 0) {
    groups.push({
      id: "additional",
      title: "Additional Specifications",
      icon: <Layers size={16} className="text-slate-600" />,
      rows: remainingRows,
    });
  }

  return groups;
}

// ============================================================================
// COMPONENT 1: CATEGORY HIGHLIGHT BADGES (For ProductInfo.tsx)
// ============================================================================

export function ProductCategoryHighlights({ product }: { product: ProductDetails }) {
  const highlights = useMemo(() => extractCategoryHighlights(product), [product]);

  if (!highlights || highlights.length === 0) {
    return null;
  }

  const getVariantStyles = (variant: HighlightItem["variant"]) => {
    switch (variant) {
      case "amber":
        return "bg-amber-50/90 text-amber-900 border-amber-200/80 hover:bg-amber-100/80";
      case "emerald":
        return "bg-emerald-50/90 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/80";
      case "blue":
        return "bg-blue-50/90 text-blue-900 border-blue-200/80 hover:bg-blue-100/80";
      case "rose":
        return "bg-rose-50/90 text-rose-900 border-rose-200/80 hover:bg-rose-100/80";
      case "indigo":
        return "bg-indigo-50/90 text-indigo-900 border-indigo-200/80 hover:bg-indigo-100/80";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <Sparkles size={12} className="text-[#D6A419]" />
          Key Highlights
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          Category Specs
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {highlights.map((item) => (
          <div
            key={item.id}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${getVariantStyles(
              item.variant
            )}`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="text-slate-500 font-normal">{item.label}:</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 2: FULL CATEGORY SPECIFICATIONS (For ProductTabs.tsx)
// ============================================================================

export function ProductCategorySpecs({ product }: { product: ProductDetails }) {
  const groups = useMemo(() => extractGroupedSpecifications(product), [product]);
  const attrs = (product.attributes ?? {}) as Record<string, unknown>;
  const domain = useMemo(
    () => detectCategoryDomain(product.category, product.subcategory, attrs),
    [product.category, product.subcategory, attrs]
  );

  const getDomainBadge = () => {
    switch (domain) {
      case "BAKERY_BISCUITS":
        return "Bakery & Confectionery Standards";
      case "FRESH_PRODUCE":
        return "Fresh Agricultural Produce";
      case "BEVERAGES":
        return "Beverage Quality Standard";
      case "COOKING_ESSENTIALS":
        return "Kitchen & Grocery Essentials";
      case "DAIRY_EGGS":
        return "Dairy & Poultry Standard";
      case "MEAT_FISH":
        return "Meat & Seafood Quality";
      case "SNACKS_PACKAGED":
        return "Packaged Food Standard";
      case "FASHION_APPAREL":
        return "Apparel & Garment Standards";
      case "FASHION_FOOTWEAR":
        return "Footwear Quality Standards";
      case "ACCESSORIES":
        return "Accessory Specifications";
      case "HOUSEHOLD_PET":
        return "Household & Care Standards";
      default:
        return "Verified Product Specifications";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/20 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#12233f]">
              Product Specifications & Details
            </h3>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200/60">
              <Sparkles size={11} className="text-amber-600" />
              {getDomainBadge()}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tailored technical specifications for {product.name} ({product.category || "General"}).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/80">
            <Check size={13} className="text-emerald-600" />
            Verified Spec
          </span>
        </div>
      </div>

      {/* Specification Groups */}
      {groups.length > 0 ? (
        <div className="space-y-5">
          {groups.map((group) => (
            <div
              key={group.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                {group.icon}
                <h4 className="text-xs sm:text-sm font-bold text-[#12233f]">
                  {group.title}
                </h4>
              </div>

              <div className="divide-y divide-slate-100">
                {group.rows.map((row, index) => (
                  <div
                    key={`${row.key}-${index}`}
                    className={`grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 p-3 sm:px-4 sm:py-3 text-xs ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                    }`}
                  >
                    <span className="font-medium text-slate-500 flex items-center gap-1.5">
                      {row.label}
                    </span>

                    <div className="sm:col-span-2">
                      {row.isBadge ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          {String(row.value)}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-800 break-words">
                          {row.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <Info size={24} className="mx-auto text-slate-300" />
          <p className="mt-2 text-xs text-slate-500">
            No detailed specifications have been published for this item yet.
          </p>
        </div>
      )}

      {/* Quality Assurance Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-800">100% Authentic Product</h5>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sourced directly from verified distributors and genuine brands.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
          <PackageCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-800">Quality Checked</h5>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Carefully inspected for freshness, packaging integrity, and accuracy.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
          <Award className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-slate-800">Aladdin Protection</h5>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Comprehensive buyer protection with easy return policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCategorySpecs;
