"use client";

import {
  Baby,
  Backpack,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Car,
  Cake,
  Carrot,
  Coffee,
  Cookie,
  CupSoda,
  Drumstick,
  Dumbbell,
  Egg,
  Fish,
  Footprints,
  Gamepad2,
  Gift,
  Gem,
  Grid2X2,
  Heart,
  HeartPulse,
  House,
  Laptop,
  Milk,
  Music,
  Package,
  PawPrint,
  Plane,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Sofa,
  Smartphone,
  Snowflake,
  Sparkles,
  Utensils,
  Watch,
  Wheat,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  backpack: Backpack,
  "basket-shopping": ShoppingBasket,
  book: BookOpen,
  camera: Camera,
  cake: Cake,
  carrot: Carrot,
  coffee: Coffee,
  cookie: Cookie,
  couch: Sofa,
  "cup-soda": CupSoda,
  drumstick: Drumstick,
  egg: Egg,
  fish: Fish,
  footprints: Footprints,
  gamepad: Gamepad2,
  gift: Gift,
  heart: Heart,
  laptop: Laptop,
  "mobile-screen-button": Smartphone,
  milk: Milk,
  music: Music,
  package: Package,
  snowflake: Snowflake,
  paw: PawPrint,
  "screwdriver-wrench": Wrench,
  utensils: Utensils,
  watch: Watch,
  wheat: Wheat,
  shirt: Shirt,
  smartphone: Smartphone,
  "shopping-basket": ShoppingBasket,
  sparkles: Sparkles,
  "heart-pulse": HeartPulse,
  house: House,
  home: House,
  car: Car,
  "book-open": BookOpen,
  dumbbell: Dumbbell,
  plane: Plane,
  gem: Gem,
  baby: Baby,
  "paw-print": PawPrint,
  "briefcase-business": BriefcaseBusiness,
  briefcase: BriefcaseBusiness,
  wrench: Wrench,
  "gamepad-2": Gamepad2,
  "grid-2x2": Grid2X2,
};

export function getCategoryIconForName(name: string): string {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\u0980-\u09FF]+/g, " ")
      .trim();
  const value = ` ${normalize(name)} `;
  const rules: [string[], string][] = [
    [["bread", "breads", "loaf", "loaves", "রুটি"], "wheat"],
    [["bakery", "bakeries", "cake", "cakes", "pastry", "pastries", "বেকারি", "কেক"], "cake"],
    [["beverage", "beverages", "drink", "drinks", "juice", "juices", "soda", "water", "পানীয়", "জুস"], "cup-soda"],
    [["coffee", "coffees", "tea", "কফি", "চা"], "coffee"],
    [["egg", "eggs", "ডিম"], "egg"],
    [["dairy", "milk", "cheese", "cheeses", "yogurt", "yogurts", "দুধ", "দুগ্ধ", "চিজ"], "milk"],
    [["fish", "fishes", "seafood", "মাছ", "সামুদ্রিক"], "fish"],
    [["meat", "meats", "chicken", "beef", "poultry", "মাংস", "মুরগি", "গরুর"], "drumstick"],
    [["fruit", "fruits", "vegetable", "vegetables", "produce", "ফল", "সবজি", "শাক"], "carrot"],
    [["snack", "snacks", "cookie", "cookies", "biscuit", "biscuits", "chocolate", "স্ন্যাক", "বিস্কুট"], "cookie"],
    [["frozen", "ice cream", "হিমায়িত", "আইসক্রিম"], "snowflake"],
    [["grain", "grains", "rice", "flour", "wheat", "cereal", "cereals", "চাল", "আটা", "শস্য"], "wheat"],
    [["cooking", "oil", "oils", "spice", "spices", "condiment", "condiments", "রান্না", "তেল", "মসলা"], "utensils"],
    [["footwear", "shoe", "shoes", "sandal", "sandals", "boot", "boots", "sneaker", "sneakers", "জুতা"], "footprints"],
    [["watch", "clock", "ঘড়ি"], "watch"],
    [["bag", "backpack", "luggage", "ব্যাগ"], "backpack"],
    [["fashion", "clothing", "apparel", "garment", "dress", "পোশাক", "ফ্যাশন", "জামা"], "shirt"],
    [["electronics", "electronic", "mobile", "phone", "laptop", "computer", "gadget", "ইলেকট্রনিক", "মোবাইল", "ফোন", "কম্পিউটার", "গ্যাজেট"], "smartphone"],
    [["grocery", "food", "supermarket", "মুদি", "খাবার", "ফুড", "গ্রোসারি"], "shopping-basket"],
    [["beauty", "cosmetic", "skincare", "makeup", "সৌন্দর্য", "কসমেটিক"], "sparkles"],
    [["health", "medical", "medicine", "pharmacy", "স্বাস্থ্য", "মেডিকেল", "ওষুধ", "ফার্মেসি"], "heart-pulse"],
    [["home", "furniture", "decor", "kitchen", "বাড়ি", "হোম", "ফার্নিচার", "রান্নাঘর"], "house"],
    [["automotive", "automobile", "car", "vehicle", "motorcycle", "bike", "গাড়ি", "অটোমোবাইল", "মোটরসাইকেল"], "car"],
    [["book", "books", "stationery", "education", "বই", "স্টেশনারি", "শিক্ষা"], "book-open"],
    [["sports", "sport", "fitness", "gym", "খেলা", "স্পোর্টস", "ফিটনেস"], "dumbbell"],
    [["travel", "tour", "hotel", "flight", "ট্রাভেল", "ভ্রমণ"], "plane"],
    [["jewelry", "jewellery", "gold", "diamond", "জুয়েলারি", "গহনা"], "gem"],
    [["baby", "kids", "toy", "toys", "শিশু", "বাচ্চা", "খেলনা"], "baby"],
    [["pet", "pets", "animal", "পোষা", "প্রাণী"], "paw-print"],
    [["office", "business", "corporate", "অফিস", "ব্যবসা"], "briefcase-business"],
    [["tool", "tools", "hardware", "টুলস", "হার্ডওয়্যার"], "wrench"],
    [["game", "gaming", "video game", "গেম", "গেমিং"], "gamepad-2"],
  ];

  return (
    rules.find(([keywords]) =>
      keywords.some((keyword) => value.includes(` ${normalize(keyword)} `)),
    )?.[1] ?? "shopping-bag"
  );
}

export default function CategoryIcon({
  icon,
  name = "",
  size = 20,
  className,
}: {
  icon?: string | null;
  name?: string;
  size?: number;
  className?: string;
}) {
  const Icon =
    (icon && icon !== "grid-2x2" ? CATEGORY_ICONS[icon] : undefined) ??
    CATEGORY_ICONS[getCategoryIconForName(name)] ??
    ShoppingBag;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
