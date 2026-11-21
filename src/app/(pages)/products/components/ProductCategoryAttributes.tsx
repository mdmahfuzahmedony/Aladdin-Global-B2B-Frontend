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
  BookOpen,
  User,
  PenTool,
  Bookmark,
  Pill,
  Building2,
  Sun,
  Activity,
  Smartphone,
  Zap,
  Cpu,
  Monitor,
  BatteryCharging,
  Power,
  Wifi,
  Gauge,
  Trophy,
  Dumbbell,
  Medal,
  Baby,
  Gamepad2,
  Brain,
  AlertTriangle,
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
  | "HOME_LIVING"
  | "BOOKS"
  | "STATIONERY"
  | "MEDICINE"
  | "BEAUTY_SKINCARE"
  | "ELECTRONICS_GADGETS"
  | "ELECTRICAL_APPLIANCES"
  | "FITNESS_GYM"
  | "SPORTS_OUTDOOR"
  | "TOYS_GAMES"
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
  keyIngredients: "Key Ingredients / উপাদান",
  allergenInfo: "Allergen Information",
  packCount: "Package Count",
  manufacturingDate: "Manufacturing Date",
  expiryDate: "Expiry Date",
  shelfLife: "Shelf Life",
  storageCondition: "Storage / সংরক্ষণ",
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
  origin: "Country of Origin",

  // Beverages
  beverageType: "Beverage Type",
  productType: "Product Type / ধরণ",
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

  // Home & Living / Furniture
  material: "Material",
  dimensions: "Dimensions",
  primaryMaterial: "Primary Material / মূল উপাদান",
  secondaryMaterial: "Secondary Material / Frame",
  finishType: "Color & Finish",
  width: "Width / Depth",
  height: "Height",
  thickness: "Thickness",
  dimensionUnit: "Dimension Unit",
  seatingCapacity: "Capacity / Size",
  bedSize: "Bed Size",
  weightCapacity: "Weight Capacity",
  storageType: "Storage Type",
  mobility: "Mobility / Wheels",
  assemblyType: "Assembly & Setup",
  termiteProof: "Protection (Termite / Water)",

  // Books & Publications
  author: "Author / লেখক",
  publisher: "Publisher / প্রকাশনী",
  translator: "Translator / Editor",
  edition: "Edition / সংস্করণ",
  publicationYear: "Publication Year / বছর",
  language: "Language / ভাষা",
  coverType: "Cover Type / কভার",
  numberOfPages: "Pages / পৃষ্ঠা",
  isbn: "ISBN / বারকোড",
  genre: "Genre / বিষয়",
  bookWeight: "Book Weight",
  paperType: "Paper Type",

  // Stationery & Office Supplies
  itemType: "Item Type / ধরণ",
  packSize: "Pack Size / পরিমাণ",
  paperGsm: "Paper Quality (GSM)",
  inkColor: "Ink / Color",

  // Medicine & Pharmaceuticals
  genericName: "Generic Name / জেনেরিক",
  manufacturer: "Pharma / প্রস্তুতকারক",
  dosageForm: "Dosage Form / ফরম",
  strength: "Strength / মাত্রা",
  prescriptionRequired: "Prescription / প্রেসক্রিপশন",
  darNo: "DAR / DGDA Reg. No",
  indications: "Therapeutic Indications / রোগ",
  sideEffectsWarnings: "Warnings & Precautions",

  // Beauty & Skincare
  skinType: "Skin Type / ত্বকের ধরণ",
  benefits: "Key Benefits / উপকারিতা",
  netWeightVolume: "Net Volume / Weight",
  spf: "SPF / Sun Protection",
  applicationTime: "Application / ব্যবহারের সময়",
  targetGender: "Target User / প্রযোজ্য",
  certifications: "Safety & Certifications",
  formulation: "Texture / ফর্মুলেশন",

  // Electronics & Gadgets
  deviceType: "Device Type / পণ্যের ধরণ",
  modelName: "Model / মডেল সংস্করণ",
  ram: "RAM / র‍্যাম মেমোরি",
  storage: "Storage / রম স্টোরেজ",
  screenSize: "Display / স্ক্রিন সাইজ",
  batteryCapacity: "Battery / ব্যাটারি ক্ষমতা",
  operatingSystem: "OS / অপারেটিং সিস্টেম",
  connectivity: "Connectivity / কানেক্টিভিটি",
  chargingPower: "Charging / পাওয়ার ইনপুট",
  colorVariant: "Color Variant / কালার",

  // Electrical & Appliances
  applianceType: "Appliance / যন্ত্রের ধরণ",
  modelNumber: "Model No / মডেল নম্বর",
  wattage: "Power / ওয়াট রেটিং",
  operatingVoltage: "Voltage / ভোল্টেজ রেটিং",
  capacitySize: "Capacity / সাইজ / টন",
  powerPhase: "Phase / পাওয়ার ফেজ",
  coilMaterial: "Coil / কয়েল মেটেরিয়াল",
  inverterTechnology: "Inverter / এনার্জি স্টার",
  safetyFeatures: "Safety / সুরক্ষা ফিচার",

  // Gym & Fitness
  fitnessItemType: "Fitness Item / ফিটনেস সরঞ্জাম",
  weightResistance: "Weight / ওজন বা রেজিস্ট্যান্স",
  dimensionsSize: "Dimensions / সাইজ ও পরিমাপ",
  gripAntiSlip: "Grip / গ্রিপ ও অ্যান্টি-স্লিপ",
  maxLoadCapacity: "Max Load / সর্বোচ্চ ধারণ ক্ষমতা",
  targetUser: "User Group / প্রযোজ্য",

  // Sports & Outdoor
  sportDiscipline: "Sport / খেলার ধরণ",
  equipmentType: "Equipment / সরঞ্জামের ধরণ",
  sizeAgeGroup: "Size / বয়স শ্রেণী",
  materialWoodType: "Wood / মূল উপাদান",
  weightBalance: "Weight & Balance / ওজন ব্যালেন্স",
  tournamentApproval: "Approval / টুর্নামেন্ট অনুমোদন",

  // Unified Grocery & Food
  groceryItemType: "Item Type / পণ্যের ধরণ",
  productVariant: "Variant / ভ্যারিয়েন্ট ও গ্রেড",
  packagingType: "Packaging / প্যাকেজিং এর ধরণ",
  servingUnit: "Serving Units / প্যাকের পিস সংখ্যা",
  foodCertification: "Certification / খাদ্যমান সনদ",
  dietaryTags: "Dietary Info / বিশেষ বৈশিষ্ট্য",
  ingredients: "Key Ingredients / মূল উপাদানসমূহ",
  manufacturerDetails: "Manufacturer / প্রস্তুতকারক",

  // Toys & Games
  toyItemType: "Item Type / খেলনার ধরণ",
  modelCharacter: "Model / Character / সিরিজ",
  recommendedAge: "Recommended Age / বয়স শ্রেণী",
  safetyCertifications: "Safety Standard / সুরক্ষা সনদ",
  chokingHazardWarning: "Choking Hazard / সতর্কতা",
  dimensionsWeight: "Dimensions & Weight / পরিমাপ ও ওজন",
  batteryPowerType: "Power / ব্যাটারি সিস্টেম",
  educationalSkillFocus: "Skill Focus / স্কিল ডেভেলপমেন্ট",
  interactiveFeatures: "Features / বিশেষ ফিচারসমূহ",
  piecesCount: "Pieces Count / পিস সংখ্যা",
  inTheBoxContents: "In-the-Box / বক্সের ভেতরের পণ্য",
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
  "customSpecs",
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
      .map(formatAttributeValue)
      .filter(Boolean)
      .join(", ");
  }
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([key, value]) => {
        const formattedValue = formatAttributeValue(value);
        return formattedValue
          ? `${formatKeyLabel(key)}: ${formattedValue}`
          : "";
      })
      .filter(Boolean)
      .join(", ");
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

  // 5. Cooking & Essentials / Unified Grocery
  if (
    combined.includes("cooking") ||
    combined.includes("grocery") ||
    combined.includes("groceries") ||
    combined.includes("food") ||
    combined.includes("মুদি") ||
    combined.includes("খাদ্য") ||
    combined.includes("rice") ||
    combined.includes("dal") ||
    combined.includes("oil") ||
    combined.includes("flour") ||
    combined.includes("atta") ||
    combined.includes("spice") ||
    combined.includes("salt") ||
    combined.includes("masala") ||
    keys.includes("groceryitemtype") ||
    keys.includes("netweightvolume") ||
    keys.includes("foodcertification") ||
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

  // 12. Home & Living / Furniture
  if (
    combined.includes("living") ||
    combined.includes("bedroom") ||
    combined.includes("furniture") ||
    combined.includes("sofa") ||
    combined.includes("bed") ||
    combined.includes("table") ||
    combined.includes("chair") ||
    combined.includes("wardrobe") ||
    combined.includes("almirah") ||
    combined.includes("cabinet") ||
    combined.includes("door") ||
    combined.includes("office") ||
    combined.includes("hospital") ||
    combined.includes("home") ||
    keys.includes("primarymaterial") ||
    keys.includes("finishtype") ||
    keys.includes("seatingcapacity") ||
    keys.includes("bedsize")
  ) {
    return "HOME_LIVING";
  }

  // 13. Books & Publications
  if (
    combined.includes("book") ||
    combined.includes("বই") ||
    combined.includes("novel") ||
    combined.includes("publication") ||
    combined.includes("academic") ||
    combined.includes("fiction") ||
    keys.includes("author") ||
    keys.includes("publisher") ||
    keys.includes("isbn") ||
    keys.includes("numberofpages") ||
    keys.includes("covertype")
  ) {
    return "BOOKS";
  }

  // 14. Stationery & Office Supplies
  if (
    combined.includes("stationery") ||
    combined.includes("স্টেশনারি") ||
    combined.includes("pen") ||
    combined.includes("pencil") ||
    combined.includes("notebook") ||
    combined.includes("calculator") ||
    combined.includes("diary") ||
    combined.includes("stapler") ||
    keys.includes("papergsm") ||
    keys.includes("inkcolor") ||
    keys.includes("packsize") ||
    keys.includes("itemtype")
  ) {
    return "STATIONERY";
  }

  // 15. Medicine & Pharmaceuticals
  if (
    combined.includes("medicine") ||
    combined.includes("otc") ||
    combined.includes("prescription") ||
    combined.includes("pharma") ||
    combined.includes("tablet") ||
    combined.includes("capsule") ||
    combined.includes("syrup") ||
    combined.includes("diabetes") ||
    combined.includes("herbal") ||
    combined.includes("ayurvedic") ||
    combined.includes("ওষুধ") ||
    combined.includes("ঔষধ") ||
    combined.includes("ফার্মেসি") ||
    keys.includes("genericname") ||
    keys.includes("dosageform") ||
    keys.includes("darno") ||
    keys.includes("indications")
  ) {
    return "MEDICINE";
  }

  // 16. Beauty, Skincare & Cosmetics
  if (
    combined.includes("beauty") ||
    combined.includes("skincare") ||
    combined.includes("cream") ||
    combined.includes("lotion") ||
    combined.includes("serum") ||
    combined.includes("cosmetic") ||
    combined.includes("makeup") ||
    combined.includes("sunscreen") ||
    combined.includes("facewash") ||
    combined.includes("women's care") ||
    combined.includes("men's care") ||
    combined.includes("kid's care") ||
    combined.includes("রূপচর্চা") ||
    combined.includes("ক্রিম") ||
    combined.includes("লোশন") ||
    keys.includes("skintype") ||
    keys.includes("keyingredients") ||
    keys.includes("spf") ||
    keys.includes("applicationtime") ||
    keys.includes("formulation")
  ) {
    return "BEAUTY_SKINCARE";
  }

  // 17. Consumer Electronics & Gadgets
  if (
    combined.includes("smartphone") ||
    combined.includes("laptop") ||
    combined.includes("gadget") ||
    combined.includes("smartwatch") ||
    combined.includes("earbuds") ||
    combined.includes("headphone") ||
    combined.includes("mobile") ||
    combined.includes("tablet") ||
    combined.includes("মোবাইল") ||
    combined.includes("ল্যাপটপ") ||
    combined.includes("গ্যাজেট") ||
    combined.includes("ট্যাবলেট") ||
    combined.includes("স্মার্টওয়াচ") ||
    combined.includes("কম্পিউটার") ||
    keys.includes("devicetype") ||
    keys.includes("ram") ||
    keys.includes("storage") ||
    keys.includes("screensize") ||
    keys.includes("batterycapacity") ||
    keys.includes("operatingsystem")
  ) {
    return "ELECTRONICS_GADGETS";
  }

  // 18. Electrical Appliances & Equipment
  if (
    combined.includes("electrical") ||
    combined.includes("electric") ||
    combined.includes("electronics") ||
    combined.includes("fan") ||
    combined.includes("ac") ||
    combined.includes("air conditioner") ||
    combined.includes("fridge") ||
    combined.includes("refrigerator") ||
    combined.includes("geyser") ||
    combined.includes("water heater") ||
    combined.includes("pump") ||
    combined.includes("motor") ||
    combined.includes("generator") ||
    combined.includes("ips") ||
    combined.includes("ups") ||
    combined.includes("solar") ||
    combined.includes("cable") ||
    combined.includes("wire") ||
    combined.includes("switch") ||
    combined.includes("socket") ||
    combined.includes("breaker") ||
    combined.includes("ইলেকট্রিক্যাল") ||
    combined.includes("ফ্যান") ||
    combined.includes("লাইট") ||
    combined.includes("এসি") ||
    combined.includes("ফ্রিজ") ||
    combined.includes("মোটর") ||
    combined.includes("পাম্প") ||
    combined.includes("তার") ||
    combined.includes("ক্যাবল") ||
    combined.includes("সুইচ") ||
    keys.includes("appliancetype") ||
    keys.includes("wattage") ||
    keys.includes("operatingvoltage") ||
    keys.includes("coilmaterial") ||
    keys.includes("invertertechnology")
  ) {
    return "ELECTRICAL_APPLIANCES";
  }

  // 19. Gym & Fitness Accessories
  if (
    combined.includes("fitness") ||
    combined.includes("gym") ||
    combined.includes("dumbbell") ||
    combined.includes("barbell") ||
    combined.includes("treadmill") ||
    combined.includes("yoga") ||
    combined.includes("cardio") ||
    combined.includes("workout") ||
    combined.includes("ফিটনেস") ||
    combined.includes("জিম") ||
    combined.includes("ডাম্বেল") ||
    combined.includes("ব্যায়াম") ||
    keys.includes("fitnessitemtype") ||
    keys.includes("weightresistance") ||
    keys.includes("maxloadcapacity") ||
    keys.includes("gripantislip")
  ) {
    return "FITNESS_GYM";
  }

  // 20. Sports & Outdoor Equipment
  if (
    combined.includes("cricket") ||
    combined.includes("football") ||
    combined.includes("soccer") ||
    combined.includes("badminton") ||
    combined.includes("tennis") ||
    combined.includes("carrom") ||
    combined.includes("volleyball") ||
    combined.includes("basketball") ||
    combined.includes("swimming") ||
    combined.includes("skating") ||
    combined.includes("sports") ||
    combined.includes("ক্রিকেট") ||
    combined.includes("ফুটবল") ||
    combined.includes("ব্যাডমিন্টন") ||
    combined.includes("টেনিস") ||
    combined.includes("ক্যারম") ||
    combined.includes("সাঁতার") ||
    combined.includes("খেলাধুলা") ||
    keys.includes("sportdiscipline") ||
    keys.includes("equipmenttype") ||
    keys.includes("materialwoodtype") ||
    keys.includes("weightbalance") ||
    keys.includes("tournamentapproval")
  ) {
    return "SPORTS_OUTDOOR";
  }

  // 19. Toys & Games
  if (
    combined.includes("toy") ||
    combined.includes("game") ||
    combined.includes("puzzle") ||
    combined.includes("lego") ||
    combined.includes("doll") ||
    combined.includes("action figure") ||
    combined.includes("plush") ||
    combined.includes("board game") ||
    combined.includes("rattle") ||
    combined.includes("teether") ||
    combined.includes("খেলনা") ||
    combined.includes("পুতুল") ||
    combined.includes("পাজল") ||
    keys.includes("toyitemtype") ||
    keys.includes("recommendedage") ||
    keys.includes("chokinghazardwarning") ||
    keys.includes("educationalskillfocus") ||
    keys.includes("piecescount")
  ) {
    return "TOYS_GAMES";
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

  const highlightedAttributeKeys = new Set<string>();
  const getVal = (k: string) => {
    highlightedAttributeKeys.add(k);
    const value = formatAttributeValue(attrs[k]);
    return value || null;
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
      } else if (isHalal) {
        highlights.push({ id: "halal", label: "Certification", value: isHalal, icon: <ShieldCheck size={13} />, variant: "slate" });
      }
      break;
    }

    case "FRESH_PRODUCE": {
      const vegType = getVal("vegetableType") || getVal("fruitType");
      if (vegType) highlights.push({ id: "vegType", label: "Variety", value: vegType, icon: <Leaf size={13} />, variant: "emerald" });

      const organic = getVal("organic");
      if (organic === "Yes") highlights.push({ id: "organic", label: "Standard", value: "100% Organic", icon: <CheckCircle2 size={13} />, variant: "emerald" });
      else if (organic) highlights.push({ id: "organic", label: "Organic Status", value: organic, icon: <CheckCircle2 size={13} />, variant: "slate" });

      const origin = getVal("origin");
      if (origin) highlights.push({ id: "origin", label: "Origin", value: origin, icon: <MapPin size={13} />, variant: "blue" });

      const freshness = getVal("freshnessGuarantee");
      if (freshness) highlights.push({ id: "freshness", label: "Freshness", value: freshness, icon: <Sparkles size={13} />, variant: "emerald" });

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
      const type = getVal("groceryItemType") || getVal("riceType") || getVal("dalType") || getVal("oilType") || getVal("flourType") || getVal("spiceType");
      if (type) highlights.push({ id: "type", label: "Type", value: type, icon: <Sparkles size={13} />, variant: "amber" });

      const purity = getVal("foodCertification") || getVal("purity") || getVal("extractionMethod") || getVal("processing");
      if (purity) highlights.push({ id: "purity", label: "Grade / Cert", value: purity, icon: <ShieldCheck size={13} />, variant: "emerald" });

      const weight = getVal("netWeightVolume") || getVal("netWeight") || getVal("volume");
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

    case "HOME_LIVING": {
      // 1. Material
      const mat = getVal("material") || getVal("primaryMaterial") || getVal("fabric");
      if (mat) highlights.push({ id: "material", label: "Material", value: mat, icon: <Layers size={13} />, variant: "amber" });

      // 2. Dimensions
      const dim = getVal("dimensions") || [getVal("length"), getVal("width"), getVal("height")].filter(Boolean).join(" × ");
      if (dim) highlights.push({ id: "dimensions", label: "Dimensions", value: dim, icon: <Box size={13} />, variant: "blue" });

      // 3. Product Type (Room Type er jaigai Product Type)
      const prodType = getVal("productType") || getVal("roomType") || getVal("itemType") || getVal("category");
      if (prodType) highlights.push({ id: "productType", label: "Product Type", value: prodType, icon: <Tag size={13} />, variant: "indigo" });

      // 4. Country of Origin (Origin / কোন দেশের পণ্য)
      const origin = getVal("countryOfOrigin") || getVal("origin") || getVal("country") || getVal("madeIn");
      ["countryOfOrigin", "origin", "country", "madeIn", "country_of_origin"].forEach((k) =>
        highlightedAttributeKeys.add(k)
      );
      if (origin) highlights.push({ id: "origin", label: "Country of Origin", value: origin, icon: <MapPin size={13} />, variant: "rose" });

      // 5. Care Instructions
      const care = getVal("careInstruction") || getVal("careInstructions") || getVal("washCare");
      if (care) highlights.push({ id: "careInstruction", label: "Care Instruction", value: care, icon: <Sparkles size={13} />, variant: "slate" });

      // 6. Optional: Warranty & Finish
      const warranty = getVal("warranty");
      if (warranty) highlights.push({ id: "warranty", label: "Warranty", value: warranty, icon: <ShieldCheck size={13} />, variant: "emerald" });
      break;
    }

    case "BOOKS": {
      // 1. Author (লেখক)
      const author = getVal("author");
      if (author) highlights.push({ id: "author", label: "Author", value: author, icon: <User size={13} />, variant: "amber" });

      // 2. Publisher (প্রকাশনী)
      const publisher = getVal("publisher");
      if (publisher) highlights.push({ id: "publisher", label: "Publisher", value: publisher, icon: <BookOpen size={13} />, variant: "indigo" });

      // 3. Cover Type (কভার)
      const cover = getVal("coverType");
      if (cover) highlights.push({ id: "coverType", label: "Cover", value: cover, icon: <Bookmark size={13} />, variant: "blue" });

      // 4. Number of Pages (পৃষ্ঠা)
      const pages = getVal("numberOfPages");
      if (pages) highlights.push({ id: "numberOfPages", label: "Pages", value: `${pages} Pages`, icon: <Layers size={13} />, variant: "slate" });

      // 5. Language (ভাষা)
      const lang = getVal("language");
      if (lang) highlights.push({ id: "language", label: "Language", value: lang, icon: <Sparkles size={13} />, variant: "emerald" });

      // 6. Country of Origin
      const origin = getVal("countryOfOrigin") || getVal("origin") || getVal("country") || getVal("madeIn");
      ["countryOfOrigin", "origin", "country", "madeIn", "country_of_origin"].forEach((k) =>
        highlightedAttributeKeys.add(k)
      );
      if (origin) highlights.push({ id: "origin", label: "Country of Origin", value: origin, icon: <MapPin size={13} />, variant: "rose" });
      break;
    }

    case "STATIONERY": {
      // 1. Brand (ব্র্যান্ড)
      const brand = getVal("brand");
      if (brand) highlights.push({ id: "brand", label: "Brand", value: brand, icon: <Tag size={13} />, variant: "indigo" });

      // 2. Item Type (পণ্যের ধরণ)
      const itemType = getVal("itemType") || getVal("productType");
      if (itemType) highlights.push({ id: "itemType", label: "Item Type", value: itemType, icon: <PenTool size={13} />, variant: "amber" });

      // 3. Pack Size (প্যাক)
      const pack = getVal("packSize");
      if (pack) highlights.push({ id: "packSize", label: "Pack Size", value: pack, icon: <Box size={13} />, variant: "blue" });

      // 4. Paper GSM / Material
      const gsm = getVal("paperGsm");
      const mat = getVal("material");
      if (gsm && gsm !== "N/A" && !gsm.includes("প্রযোজ্য নয়")) {
        highlights.push({ id: "paperGsm", label: "Paper GSM", value: gsm, icon: <Layers size={13} />, variant: "slate" });
      } else if (mat) {
        highlights.push({ id: "material", label: "Material", value: mat, icon: <Layers size={13} />, variant: "slate" });
      }

      // 5. Color / Ink
      const ink = getVal("inkColor");
      if (ink) highlights.push({ id: "inkColor", label: "Color / Ink", value: ink, icon: <Droplets size={13} />, variant: "rose" });

      // 6. Country of Origin
      const origin = getVal("countryOfOrigin") || getVal("origin") || getVal("country") || getVal("madeIn");
      ["countryOfOrigin", "origin", "country", "madeIn", "country_of_origin"].forEach((k) =>
        highlightedAttributeKeys.add(k)
      );
      if (origin) highlights.push({ id: "origin", label: "Country of Origin", value: origin, icon: <MapPin size={13} />, variant: "rose" });
      break;
    }

    case "MEDICINE": {
      // 1. Generic Name (জেনেরিক নাম)
      const generic = getVal("genericName");
      if (generic) {
        highlights.push({
          id: "genericName",
          label: "Generic",
          value: generic,
          icon: <Pill size={13} />,
          variant: "emerald",
        });
      }

      // 2. Dosage Form & Strength (ডোজ ফরম ও শক্তি)
      const dosage = getVal("dosageForm");
      const strength = getVal("strength");
      if (dosage || strength) {
        const val = [dosage, strength].filter(Boolean).join(" • ");
        highlights.push({
          id: "dosageForm",
          label: "Form & Strength",
          value: val,
          icon: <Layers size={13} />,
          variant: "blue",
        });
      }

      // 3. Manufacturer (প্রস্তুতকারক)
      const mfg = getVal("manufacturer") || getVal("pharma") || getVal("brand");
      if (mfg) {
        highlights.push({
          id: "manufacturer",
          label: "Manufacturer",
          value: mfg,
          icon: <Building2 size={13} />,
          variant: "indigo",
        });
      }

      // 4. Prescription Status (প্রেসক্রিপশন শর্ত)
      const rx = getVal("prescriptionRequired");
      if (rx) {
        const isRx = rx.toLowerCase().includes("rx") || rx.toLowerCase().includes("ডাক্তারের");
        highlights.push({
          id: "prescriptionRequired",
          label: "Prescription",
          value: rx,
          icon: <ShieldCheck size={13} />,
          variant: isRx ? "rose" : "amber",
        });
      }

      // 5. Pack Size (প্যাক সাইজ)
      const pack = getVal("packSize");
      if (pack) {
        highlights.push({
          id: "packSize",
          label: "Pack Size",
          value: pack,
          icon: <Box size={13} />,
          variant: "slate",
        });
      }

      // 6. Indications (রোগ/উপকারিতা)
      const indications = getVal("indications");
      if (indications) {
        highlights.push({
          id: "indications",
          label: "Indications",
          value: indications,
          icon: <Activity size={13} />,
          variant: "emerald",
        });
      }
      break;
    }

    case "BEAUTY_SKINCARE": {
      // 1. Brand (ব্র্যান্ড)
      const brand = getVal("brand");
      if (brand) {
        highlights.push({
          id: "brand",
          label: "Brand",
          value: brand,
          icon: <Tag size={13} />,
          variant: "rose",
        });
      }

      // 2. Skin Type (ত্বকের ধরণ)
      const skinType = getVal("skinType");
      if (skinType) {
        highlights.push({
          id: "skinType",
          label: "Skin Type",
          value: skinType,
          icon: <Droplets size={13} />,
          variant: "blue",
        });
      }

      // 3. Key Benefits (উপকারিতা)
      const benefits = getVal("benefits");
      if (benefits) {
        highlights.push({
          id: "benefits",
          label: "Key Benefit",
          value: benefits,
          icon: <Sparkles size={13} />,
          variant: "amber",
        });
      }

      // 4. Key Ingredients (মূল উপাদান)
      const ingredients = getVal("keyIngredients");
      if (ingredients) {
        highlights.push({
          id: "keyIngredients",
          label: "Active Ingredients",
          value: ingredients,
          icon: <CheckCircle2 size={13} />,
          variant: "emerald",
        });
      }

      // 5. Net Volume / Weight (পরিমাণ)
      const netWeight = getVal("netWeightVolume") || getVal("netWeight") || getVal("packSize");
      if (netWeight) {
        highlights.push({
          id: "netWeightVolume",
          label: "Net Weight/Vol",
          value: netWeight,
          icon: <Box size={13} />,
          variant: "slate",
        });
      }

      // 6. SPF / Sun Protection (সানস্ক্রিন)
      const spf = getVal("spf");
      if (spf && !spf.includes("প্রযোজ্য নয়") && spf !== "N/A") {
        highlights.push({
          id: "spf",
          label: "Sun Protection",
          value: spf,
          icon: <Sun size={13} />,
          variant: "rose",
        });
      }
      break;
    }

    case "ELECTRONICS_GADGETS": {
      // 1. Device Type & Brand
      const brand = getVal("brand");
      const devType = getVal("deviceType");
      if (brand || devType) {
        const val = [brand, devType].filter(Boolean).join(" • ");
        highlights.push({
          id: "deviceType",
          label: "Device",
          value: val,
          icon: <Smartphone size={13} />,
          variant: "blue",
        });
      }

      // 2. RAM & Storage Combo
      const ram = getVal("ram");
      const storage = getVal("storage");
      if ((ram && !ram.includes("N/A")) || (storage && !storage.includes("N/A"))) {
        const val = [ram, storage].filter((x) => x && !x.includes("N/A")).join(" / ");
        if (val) {
          highlights.push({
            id: "ramStorage",
            label: "RAM / ROM",
            value: val,
            icon: <Cpu size={13} />,
            variant: "indigo",
          });
        }
      }

      // 3. Screen / Display
      const screen = getVal("screenSize");
      if (screen && !screen.includes("N/A")) {
        highlights.push({
          id: "screenSize",
          label: "Display",
          value: screen,
          icon: <Monitor size={13} />,
          variant: "amber",
        });
      }

      // 4. Battery Capacity
      const battery = getVal("batteryCapacity");
      if (battery && !battery.includes("N/A")) {
        highlights.push({
          id: "batteryCapacity",
          label: "Battery",
          value: battery,
          icon: <BatteryCharging size={13} />,
          variant: "emerald",
        });
      }

      // 5. Fast Charging / Connectivity
      const charge = getVal("chargingPower");
      const conn = getVal("connectivity");
      if (charge && !charge.includes("N/A")) {
        highlights.push({
          id: "chargingPower",
          label: "Fast Charging",
          value: charge,
          icon: <Zap size={13} />,
          variant: "rose",
        });
      } else if (conn) {
        highlights.push({
          id: "connectivity",
          label: "Connectivity",
          value: conn,
          icon: <Wifi size={13} />,
          variant: "slate",
        });
      }

      // 6. Warranty
      const warranty = getVal("warranty");
      if (warranty && !warranty.includes("No Warranty")) {
        highlights.push({
          id: "warranty",
          label: "Warranty",
          value: warranty,
          icon: <ShieldCheck size={13} />,
          variant: "emerald",
        });
      }
      break;
    }

    case "ELECTRICAL_APPLIANCES": {
      // 1. Appliance Type & Brand
      const brand = getVal("brand");
      const appType = getVal("applianceType");
      if (brand || appType) {
        const val = [brand, appType].filter(Boolean).join(" • ");
        highlights.push({
          id: "applianceType",
          label: "Appliance",
          value: val,
          icon: <Zap size={13} />,
          variant: "amber",
        });
      }

      // 2. Power / Wattage
      const watt = getVal("wattage");
      if (watt && !watt.includes("N/A")) {
        highlights.push({
          id: "wattage",
          label: "Power Rating",
          value: watt,
          icon: <Power size={13} />,
          variant: "rose",
        });
      }

      // 3. Capacity / Size (Ton, Liters, Inch)
      const cap = getVal("capacitySize");
      if (cap) {
        highlights.push({
          id: "capacitySize",
          label: "Capacity / Size",
          value: cap,
          icon: <Gauge size={13} />,
          variant: "blue",
        });
      }

      // 4. Inverter / Energy Rating
      const inverter = getVal("inverterTechnology");
      if (inverter && !inverter.includes("N/A")) {
        highlights.push({
          id: "inverterTechnology",
          label: "Energy Tech",
          value: inverter,
          icon: <Sparkles size={13} />,
          variant: "emerald",
        });
      }

      // 5. Operating Voltage
      const volt = getVal("operatingVoltage");
      if (volt) {
        highlights.push({
          id: "operatingVoltage",
          label: "Voltage",
          value: volt,
          icon: <Zap size={13} />,
          variant: "slate",
        });
      }

      // 6. Warranty
      const warranty = getVal("warranty");
      if (warranty && !warranty.includes("No Warranty")) {
        highlights.push({
          id: "warranty",
          label: "Warranty",
          value: warranty,
          icon: <ShieldCheck size={13} />,
          variant: "emerald",
        });
      }
      break;
    }

    case "FITNESS_GYM": {
      // 1. Fitness Item Type & Brand
      const brand = getVal("brand");
      const fitType = getVal("fitnessItemType");
      if (brand || fitType) {
        const val = [brand, fitType].filter(Boolean).join(" • ");
        highlights.push({
          id: "fitnessItemType",
          label: "Fitness Gear",
          value: val,
          icon: <Dumbbell size={13} />,
          variant: "emerald",
        });
      }

      // 2. Weight or Resistance Level
      const weight = getVal("weightResistance");
      if (weight && !weight.includes("N/A")) {
        highlights.push({
          id: "weightResistance",
          label: "Weight/Resistance",
          value: weight,
          icon: <Scale size={13} />,
          variant: "indigo",
        });
      }

      // 3. Material
      const mat = getVal("material");
      if (mat) {
        highlights.push({
          id: "material",
          label: "Material",
          value: mat,
          icon: <Layers size={13} />,
          variant: "slate",
        });
      }

      // 4. Max Load Capacity
      const load = getVal("maxLoadCapacity");
      if (load && !load.includes("N/A")) {
        highlights.push({
          id: "maxLoadCapacity",
          label: "Max Load",
          value: load,
          icon: <Activity size={13} />,
          variant: "rose",
        });
      }

      // 5. Dimensions or Grip
      const dim = getVal("dimensionsSize");
      const grip = getVal("gripAntiSlip");
      if (dim) {
        highlights.push({
          id: "dimensionsSize",
          label: "Size",
          value: dim,
          icon: <Box size={13} />,
          variant: "blue",
        });
      } else if (grip) {
        highlights.push({
          id: "gripAntiSlip",
          label: "Grip Tech",
          value: grip,
          icon: <Sparkles size={13} />,
          variant: "amber",
        });
      }

      // 6. Warranty
      const warranty = getVal("warranty");
      if (warranty && !warranty.includes("No Warranty")) {
        highlights.push({
          id: "warranty",
          label: "Warranty",
          value: warranty,
          icon: <ShieldCheck size={13} />,
          variant: "emerald",
        });
      }
      break;
    }

    case "SPORTS_OUTDOOR": {
      // 1. Sport Discipline & Equipment
      const sport = getVal("sportDiscipline");
      const equip = getVal("equipmentType");
      if (sport || equip) {
        const val = [sport, equip].filter(Boolean).join(" • ");
        highlights.push({
          id: "equipmentType",
          label: "Sport Gear",
          value: val,
          icon: <Trophy size={13} />,
          variant: "amber",
        });
      }

      // 2. Brand & Model
      const brand = getVal("brand");
      const model = getVal("modelName");
      if (brand || model) {
        const val = [brand, model].filter(Boolean).join(" ");
        highlights.push({
          id: "brandModel",
          label: "Brand/Model",
          value: val,
          icon: <Medal size={13} />,
          variant: "indigo",
        });
      }

      // 3. Material or Wood Type
      const woodMat = getVal("materialWoodType");
      if (woodMat) {
        highlights.push({
          id: "materialWoodType",
          label: "Wood/Material",
          value: woodMat,
          icon: <Layers size={13} />,
          variant: "slate",
        });
      }

      // 4. Weight & Balance
      const weightBal = getVal("weightBalance");
      if (weightBal && !weightBal.includes("N/A")) {
        highlights.push({
          id: "weightBalance",
          label: "Weight/Balance",
          value: weightBal,
          icon: <Scale size={13} />,
          variant: "blue",
        });
      }

      // 5. Tournament Approval
      const approval = getVal("tournamentApproval");
      if (approval) {
        highlights.push({
          id: "tournamentApproval",
          label: "Standard",
          value: approval,
          icon: <Award size={13} />,
          variant: "rose",
        });
      }

      // 6. Warranty
      const warranty = getVal("warranty");
      if (warranty && !warranty.includes("No Warranty")) {
        highlights.push({
          id: "warranty",
          label: "Warranty",
          value: warranty,
          icon: <ShieldCheck size={13} />,
          variant: "emerald",
        });
      }
      break;
    }

    case "TOYS_GAMES": {
      // 1. Toy Item Type
      const itemType = getVal("toyItemType");
      if (itemType) {
        highlights.push({
          id: "toyItemType",
          label: "Toy Type",
          value: itemType,
          icon: <Baby size={13} />,
          variant: "rose",
        });
      }

      // 2. Recommended Age Group
      const ageGroup = getVal("recommendedAge");
      if (ageGroup) {
        highlights.push({
          id: "recommendedAge",
          label: "Age Group",
          value: ageGroup,
          icon: <Clock size={13} />,
          variant: "amber",
        });
      }

      // 3. Primary Material
      const material = getVal("primaryMaterial");
      if (material) {
        highlights.push({
          id: "primaryMaterial",
          label: "Material",
          value: material,
          icon: <Layers size={13} />,
          variant: "slate",
        });
      }

      // 4. Safety Certifications / Choking Hazard
      const safety = getVal("safetyCertifications");
      if (safety) {
        highlights.push({
          id: "safetyCertifications",
          label: "Safety Cert",
          value: safety,
          icon: <ShieldCheck size={13} />,
          variant: "emerald",
        });
      }

      // 5. Battery & Power System
      const power = getVal("batteryPowerType");
      if (power) {
        highlights.push({
          id: "batteryPowerType",
          label: "Power",
          value: power,
          icon: <BatteryCharging size={13} />,
          variant: "blue",
        });
      }

      // 6. Educational Skill Focus
      const skill = getVal("educationalSkillFocus");
      if (skill) {
        highlights.push({
          id: "educationalSkillFocus",
          label: "Skill Focus",
          value: skill,
          icon: <Brain size={13} />,
          variant: "indigo",
        });
      }
      break;
    }

    default:
      break;
  }

  Object.entries(attrs).forEach(([key, value]) => {
    const lk = key.toLowerCase();
    if (
      IGNORED_ATTRIBUTE_KEYS.has(key) ||
      highlightedAttributeKeys.has(key) ||
      lk === "countryoforigin" ||
      lk === "origin" ||
      lk === "country" ||
      lk === "madein" ||
      lk === "country_of_origin" ||
      lk.includes("origin")
    ) {
      return;
    }

    const label = formatKeyLabel(key);
    // Prevent duplicate badge labels
    if (
      highlights.some(
        (h) => h.id === key || h.label.toLowerCase() === label.toLowerCase()
      )
    ) {
      return;
    }

    const formattedValue = formatAttributeValue(value);
    if (!formattedValue) return;

    highlights.push({
      id: key,
      label,
      value: formattedValue,
      icon: <Tag size={13} />,
      variant: "indigo",
    });
  });

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
      const formattedVal = formatAttributeValue(v);
      if (formattedVal) {
        processedKeys.add(k);
        const label = formatKeyLabel(k);
        if (rows.some((r) => r.label.toLowerCase() === label.toLowerCase())) {
          return;
        }
        if (
          k.toLowerCase().includes("origin") ||
          k === "countryOfOrigin" ||
          k === "country" ||
          k === "madeIn"
        ) {
          ["countryOfOrigin", "origin", "country", "madeIn", "country_of_origin"].forEach((alias) =>
            processedKeys.add(alias)
          );
        }

        const isCertBadge =
          k.toLowerCase().includes("halal") ||
          k.toLowerCase().includes("organic") ||
          k.toLowerCase().includes("waterproof") ||
          k.toLowerCase().includes("certified");

        rows.push({
          key: k,
          label,
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
    const cookRows = buildRows([
      "groceryItemType",
      "productVariant",
      "riceType",
      "grainSize",
      "dalType",
      "flourType",
      "oilType",
      "spiceType",
      "saltType",
      "purity",
      "extractionMethod",
      "processing",
      "aroma",
      "brokenPercentage",
      "fortified",
      "form",
      "manufacturerDetails",
    ]);
    if (cookRows.length > 0) {
      groups.push({
        id: "cooking-specs",
        title: "পণ্যের ধরণ ও বৈশিষ্ট্য (Item & Processing Specs)",
        icon: <Sparkles size={16} className="text-amber-600" />,
        rows: cookRows,
      });
    }

    const cookStorage = buildRows([
      "netWeightVolume",
      "netWeight",
      "volume",
      "packagingType",
      "servingUnit",
      "origin",
      "countryOfOrigin",
      "shelfLife",
      "storageCondition",
      "foodCertification",
      "dietaryTags",
    ]);
    if (cookStorage.length > 0) {
      groups.push({
        id: "cooking-storage",
        title: "পরিমাণ, মান ও সংরক্ষণ (Quantity, Certification & Storage)",
        icon: <Scale size={16} className="text-blue-600" />,
        rows: cookStorage,
      });
    }

    const ingredientRows = buildRows(["ingredients"]);
    if (ingredientRows.length > 0) {
      groups.push({
        id: "cooking-ingredients",
        title: "মূল উপাদানসমূহ (Key Ingredients)",
        icon: <Layers size={16} className="text-emerald-600" />,
        rows: ingredientRows,
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
  } else if (domain === "HOME_LIVING") {
    const matRows = buildRows(["material", "primaryMaterial", "secondaryMaterial", "finishType", "color", "termiteProof"]);
    if (matRows.length > 0) {
      groups.push({
        id: "hl-material",
        title: "Material & Craftsmanship",
        icon: <Layers size={16} className="text-amber-600" />,
        rows: matRows,
      });
    }

    const dimRows = buildRows(["dimensions", "length", "width", "height", "thickness", "dimensionUnit", "seatingCapacity", "bedSize", "weightCapacity"]);
    if (dimRows.length > 0) {
      groups.push({
        id: "hl-dimensions",
        title: "Dimensions, Size & Capacity",
        icon: <Box size={16} className="text-blue-600" />,
        rows: dimRows,
      });
    }

    const featRows = buildRows(["productType", "countryOfOrigin", "origin", "careInstruction", "warranty", "storageType", "mobility", "assemblyType"]);
    if (featRows.length > 0) {
      groups.push({
        id: "hl-features",
        title: "Product Type, Origin & Care",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        rows: featRows,
      });
    }
  } else if (domain === "BOOKS") {
    const bookPubRows = buildRows(["author", "publisher", "translator", "edition", "publicationYear", "language", "genre"]);
    if (bookPubRows.length > 0) {
      groups.push({
        id: "book-pub",
        title: "Book & Publication Details",
        icon: <BookOpen size={16} className="text-amber-600" />,
        rows: bookPubRows,
      });
    }

    const bookPhysicalRows = buildRows(["numberOfPages", "coverType", "isbn", "paperType", "bookWeight", "countryOfOrigin", "origin"]);
    if (bookPhysicalRows.length > 0) {
      groups.push({
        id: "book-physical",
        title: "Physical Specification & Binding",
        icon: <Layers size={16} className="text-indigo-600" />,
        rows: bookPhysicalRows,
      });
    }
  } else if (domain === "STATIONERY") {
    const statItemRows = buildRows(["itemType", "brand", "packSize", "dimensions"]);
    if (statItemRows.length > 0) {
      groups.push({
        id: "stat-items",
        title: "Product & Packaging Details",
        icon: <PenTool size={16} className="text-indigo-600" />,
        rows: statItemRows,
      });
    }

    const statMaterialRows = buildRows(["paperGsm", "inkColor", "material", "warranty", "countryOfOrigin", "origin"]);
    if (statMaterialRows.length > 0) {
      groups.push({
        id: "stat-material",
        title: "Material, Ink & Quality",
        icon: <Layers size={16} className="text-amber-600" />,
        rows: statMaterialRows,
      });
    }
  } else if (domain === "MEDICINE") {
    const pharmaDetails = buildRows([
      "genericName",
      "manufacturer",
      "dosageForm",
      "strength",
      "packSize",
      "darNo",
    ]);
    if (pharmaDetails.length > 0) {
      groups.push({
        id: "medicine-details",
        title: "Pharmaceutical Details & Formulation",
        icon: <Pill size={16} className="text-emerald-600" />,
        rows: pharmaDetails,
      });
    }

    const medicineUsage = buildRows([
      "prescriptionRequired",
      "indications",
      "storageCondition",
      "expiryDate",
      "sideEffectsWarnings",
      "countryOfOrigin",
      "origin",
    ]);
    if (medicineUsage.length > 0) {
      groups.push({
        id: "medicine-usage",
        title: "Indications, Storage & Safety Instructions",
        icon: <ShieldCheck size={16} className="text-blue-600" />,
        rows: medicineUsage,
      });
    }
  } else if (domain === "BEAUTY_SKINCARE") {
    const beautyProduct = buildRows([
      "productType",
      "brand",
      "skinType",
      "formulation",
      "netWeightVolume",
      "countryOfOrigin",
      "origin",
    ]);
    if (beautyProduct.length > 0) {
      groups.push({
        id: "beauty-product",
        title: "Product Formulation & Skin Suitability",
        icon: <Sparkles size={16} className="text-rose-500" />,
        rows: beautyProduct,
      });
    }

    const beautyBenefits = buildRows([
      "keyIngredients",
      "benefits",
      "spf",
      "applicationTime",
      "targetGender",
      "certifications",
      "expiryDate",
    ]);
    if (beautyBenefits.length > 0) {
      groups.push({
        id: "beauty-benefits",
        title: "Ingredients, Benefits & Sun Protection",
        icon: <Droplets size={16} className="text-indigo-600" />,
        rows: beautyBenefits,
      });
    }
  } else if (domain === "ELECTRONICS_GADGETS") {
    const gadgetCore = buildRows([
      "deviceType",
      "brand",
      "modelName",
      "ram",
      "storage",
      "operatingSystem",
    ]);
    if (gadgetCore.length > 0) {
      groups.push({
        id: "gadget-core",
        title: "Device, Memory & Operating System",
        icon: <Smartphone size={16} className="text-sky-600" />,
        rows: gadgetCore,
      });
    }

    const gadgetDisplayPower = buildRows([
      "screenSize",
      "batteryCapacity",
      "chargingPower",
      "connectivity",
      "colorVariant",
    ]);
    if (gadgetDisplayPower.length > 0) {
      groups.push({
        id: "gadget-display-power",
        title: "Display, Battery & Connectivity",
        icon: <Monitor size={16} className="text-indigo-600" />,
        rows: gadgetDisplayPower,
      });
    }

    const gadgetWarranty = buildRows([
      "warranty",
      "countryOfOrigin",
      "origin",
    ]);
    if (gadgetWarranty.length > 0) {
      groups.push({
        id: "gadget-warranty",
        title: "Warranty & Manufacturing Origin",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        rows: gadgetWarranty,
      });
    }
  } else if (domain === "ELECTRICAL_APPLIANCES") {
    const elecPower = buildRows([
      "applianceType",
      "brand",
      "modelNumber",
      "wattage",
      "operatingVoltage",
      "capacitySize",
      "powerPhase",
    ]);
    if (elecPower.length > 0) {
      groups.push({
        id: "elec-power",
        title: "Appliance & Power Ratings",
        icon: <Zap size={16} className="text-amber-600" />,
        rows: elecPower,
      });
    }

    const elecEngineering = buildRows([
      "coilMaterial",
      "inverterTechnology",
      "safetyFeatures",
      "certifications",
    ]);
    if (elecEngineering.length > 0) {
      groups.push({
        id: "elec-engineering",
        title: "Engineering, Inverter & Safety",
        icon: <Power size={16} className="text-blue-600" />,
        rows: elecEngineering,
      });
    }

    const elecWarranty = buildRows([
      "warranty",
      "countryOfOrigin",
      "origin",
    ]);
    if (elecWarranty.length > 0) {
      groups.push({
        id: "elec-warranty",
        title: "Warranty & Manufacturing Origin",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        rows: elecWarranty,
      });
    }
  } else if (domain === "FITNESS_GYM") {
    const fitSpecs = buildRows([
      "fitnessItemType",
      "brand",
      "modelName",
      "weightResistance",
      "maxLoadCapacity",
      "targetUser",
    ]);
    if (fitSpecs.length > 0) {
      groups.push({
        id: "fit-specs",
        title: "Fitness Equipment & Specifications",
        icon: <Dumbbell size={16} className="text-emerald-600" />,
        rows: fitSpecs,
      });
    }

    const fitBuild = buildRows([
      "material",
      "dimensionsSize",
      "gripAntiSlip",
    ]);
    if (fitBuild.length > 0) {
      groups.push({
        id: "fit-build",
        title: "Material, Dimensions & Grip",
        icon: <Layers size={16} className="text-indigo-600" />,
        rows: fitBuild,
      });
    }

    const fitWarranty = buildRows([
      "warranty",
      "countryOfOrigin",
      "origin",
    ]);
    if (fitWarranty.length > 0) {
      groups.push({
        id: "fit-warranty",
        title: "Warranty & Manufacturing Origin",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        rows: fitWarranty,
      });
    }
  } else if (domain === "SPORTS_OUTDOOR") {
    const sportSpecs = buildRows([
      "sportDiscipline",
      "equipmentType",
      "brand",
      "modelName",
      "sizeAgeGroup",
      "tournamentApproval",
    ]);
    if (sportSpecs.length > 0) {
      groups.push({
        id: "sport-specs",
        title: "Sport & Equipment Specifications",
        icon: <Trophy size={16} className="text-orange-600" />,
        rows: sportSpecs,
      });
    }

    const sportMaterial = buildRows([
      "materialWoodType",
      "weightBalance",
    ]);
    if (sportMaterial.length > 0) {
      groups.push({
        id: "sport-material",
        title: "Wood, Material & Balance",
        icon: <Layers size={16} className="text-indigo-600" />,
        rows: sportMaterial,
      });
    }

    const sportWarranty = buildRows([
      "warranty",
      "countryOfOrigin",
      "origin",
    ]);
    if (sportWarranty.length > 0) {
      groups.push({
        id: "sport-warranty",
        title: "Warranty & Manufacturing Origin",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        rows: sportWarranty,
      });
    }
  } else if (domain === "TOYS_GAMES") {
    // 1. Item, Series & Basic Info
    const toyBasic = buildRows([
      "toyItemType",
      "brand",
      "modelCharacter",
      "piecesCount",
      "countryOfOrigin",
      "origin",
    ]);
    if (toyBasic.length > 0) {
      groups.push({
        id: "toy-basic",
        title: "Item & Series Specifications",
        icon: <Baby size={16} className="text-pink-600" />,
        rows: toyBasic,
      });
    }

    // 2. Child Safety & Age Group
    const toySafety = buildRows([
      "recommendedAge",
      "safetyCertifications",
      "chokingHazardWarning",
    ]);
    if (toySafety.length > 0) {
      groups.push({
        id: "toy-safety",
        title: "Child Safety & Age Recommendations",
        icon: <ShieldCheck size={16} className="text-amber-600" />,
        rows: toySafety,
      });
    }

    // 3. Build Material, Dimensions & Power
    const toyBuild = buildRows([
      "primaryMaterial",
      "dimensionsWeight",
      "batteryPowerType",
      "interactiveFeatures",
    ]);
    if (toyBuild.length > 0) {
      groups.push({
        id: "toy-build",
        title: "Material, Power & Features",
        icon: <Gamepad2 size={16} className="text-indigo-600" />,
        rows: toyBuild,
      });
    }

    // 4. Learning & Skill Focus
    const toySkills = buildRows(["educationalSkillFocus"]);
    if (toySkills.length > 0) {
      groups.push({
        id: "toy-skills",
        title: "Learning & Skill Development Focus",
        icon: <Brain size={16} className="text-purple-600" />,
        rows: toySkills,
      });
    }

    // 5. Packaging & In-The-Box
    const toyPackage = buildRows([
      "packagingType",
      "inTheBoxContents",
    ]);
    if (toyPackage.length > 0) {
      groups.push({
        id: "toy-package",
        title: "Packaging & Box Contents",
        icon: <Box size={16} className="text-emerald-600" />,
        rows: toyPackage,
      });
    }
  }

  // Handle custom dynamic specifications
  if (Array.isArray(attrs.customSpecs)) {
    processedKeys.add("customSpecs");
    const customRows: SpecRow[] = [];
    attrs.customSpecs.forEach((spec: any, idx: number) => {
      if (spec && (spec.label || spec.value)) {
        customRows.push({
          key: `custom_${idx}`,
          label: String(spec.label || "Specification"),
          value: String(spec.value || "Yes"),
        });
      }
    });
    if (customRows.length > 0) {
      groups.push({
        id: "hl-custom-specs",
        title: "Additional Specifications",
        icon: <Sparkles size={16} className="text-purple-600" />,
        rows: customRows,
      });
    }
  }

  // 3. Fallback / Remaining Attributes
  const remainingRows: SpecRow[] = [];
  Object.entries(attrs).forEach(([k, v]) => {
    const lk = k.toLowerCase();
    const formattedVal = formatAttributeValue(v);
    if (
      !IGNORED_ATTRIBUTE_KEYS.has(k) &&
      !processedKeys.has(k) &&
      formattedVal
    ) {
      const label = formatKeyLabel(k);
      const isOrigin = lk.includes("origin") || lk === "country" || lk === "madein";
      const duplicateLabel =
        groups.some((g) => g.rows.some((r) => r.label.toLowerCase() === label.toLowerCase())) ||
        remainingRows.some((r) => r.label.toLowerCase() === label.toLowerCase());
      const duplicateOrigin =
        isOrigin &&
        (groups.some((g) => g.rows.some((r) => r.label.toLowerCase().includes("origin"))) ||
          remainingRows.some((r) => r.label.toLowerCase().includes("origin")));

      if (duplicateLabel || duplicateOrigin) {
        return;
      }

      remainingRows.push({
        key: k,
        label,
        value: formattedVal,
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
          Key Features
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          Specifications
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
      case "BOOKS":
        return "Book & Literature Standards";
      case "STATIONERY":
        return "Stationery & Office Supplies";
      case "MEDICINE":
        return "Pharmacy & Medicine Standards";
      case "BEAUTY_SKINCARE":
        return "Dermatological & Beauty Care Standards";
      case "ELECTRONICS_GADGETS":
        return "Gadgets & IT Standards";
      case "ELECTRICAL_APPLIANCES":
        return "Electrical & Power Standards";
      case "FITNESS_GYM":
        return "Gym & Fitness Standards";
      case "SPORTS_OUTDOOR":
        return "Sports & Athletic Standards";
      case "TOYS_GAMES":
        return "Toys, Games & Child Safety Standards";
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
