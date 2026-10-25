"use client";


import { useEffect, useMemo, useState } from "react";

import type {
  ComponentType,
  Dispatch,
  SetStateAction,
} from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import ProductDescriptionEditor from "./product-field/ProductDescriptionEditor";

import type { ProductBasicInfo } from "../components/product-placement/types";

import { createClient } from "../../../../../../../lib/supabase-client";

// Fashion
import Shirt from "./product-field/Fashion/Man/Shirt";
import Panjabi from "./product-field/Fashion/Man/Panjabi";
import Pant from "./product-field/Fashion/Man/Pant";
import Shoes from "./product-field/Fashion/Man/Shoes";
import Sandal from "./product-field/Fashion/Man/Sandal";
import Cap from "./product-field/Fashion/Man/Cap";
import Watch from "./product-field/Fashion/Man/Watch";
import Saree from "./product-field/Fashion/women/Saree";
import ThreePiece from "./product-field/Fashion/women/Three-piece";
import Bag from "./product-field/Fashion/women/Bag";
import Jewelry from "./product-field/Fashion/women/Jewelry";

// Grocery - Bakery & Biscuits
import Biscuits from "./product-field/Grocery/Bakery/Biscuits";
import Bread from "./product-field/Grocery/Bakery/Bread";
import Bun from "./product-field/Grocery/Bakery/Bun";
import Cake from "./product-field/Grocery/Bakery/Cakse";
import Cookies from "./product-field/Grocery/Bakery/Cookies";
import Pastry from "./product-field/Grocery/Bakery/Pastry";
import Toast from "./product-field/Grocery/Bakery/Toast";
import Sweets from "./product-field/Grocery/Bakery/Sweets";
import Chocolate from "./product-field/Grocery/Bakery/Chocolate";
import Candy from "./product-field/Grocery/Bakery/Candy";

// Grocery - Beverages
import Tea from "./product-field/Grocery/Beverages/Tea";
import Coffee from "./product-field/Grocery/Beverages/Coffee";
import Juice from "./product-field/Grocery/Beverages/Juice";
import MineralWater from "./product-field/Grocery/Beverages/MineralWater";
import SoftDrinks from "./product-field/Grocery/Beverages/SoftDrinks";
import EnergyDrinks from "./product-field/Grocery/Beverages/Energy Drinks";

// Grocery - Cooking & Essentials
import Rice from "./product-field/Grocery/cooking and essential/Rice/Rice";
import Dal from "./product-field/Grocery/cooking and essential/Rice/Dal";
import Flour from "./product-field/Grocery/cooking and essential/Rice/Flour";
import SoybeanOil from "./product-field/Grocery/cooking and essential/Oil/SoybeanOil";
import MustardOil from "./product-field/Grocery/cooking and essential/Oil/MustardOil";
import OliveOil from "./product-field/Grocery/cooking and essential/Oil/OliveOil";
import Ghee from "./product-field/Grocery/cooking and essential/Oil/Ghee";

// Grocery - Spices & Salt
import Salt from "./product-field/Grocery/Spices & Salt/Salt";
import Chili from "./product-field/Grocery/Spices & Salt/Chili";
import Turmeric from "./product-field/Grocery/Spices & Salt/Turmeric";
import Coriander from "./product-field/Grocery/Spices & Salt/Coriander";
import Cumin from "./product-field/Grocery/Spices & Salt/Cumin";
import GaramMasala from "./product-field/Grocery/Spices & Salt/Garam Masala";

// Grocery - Dairy, Eggs, Meat, Produce
import Milk from "./product-field/Grocery/Dairy & Eggs/Dairy/Milk";
import Eggs from "./product-field/Grocery/Dairy & Eggs/Eggs/Chicken Eggs";
import Beef from "./product-field/Grocery/cooking and essential/Meat & Fish/Beef";
import Chicken from "./product-field/Grocery/cooking and essential/Meat & Fish/Chicken";
import Mutton from "./product-field/Grocery/cooking and essential/Meat & Fish/Mutton";
import Fish from "./product-field/Grocery/cooking and essential/Meat & Fish/Fish";
import Fruits from "./product-field/Grocery/cooking and essential/Fresh Produce/Fruits";
import Vegetables from "./product-field/Grocery/cooking and essential/Fresh Produce/Vegetables";

// Grocery - Snacks & Packaged
import Chips from "./product-field/Grocery/Snacks/Chips";
import Noodles from "./product-field/Grocery/Snacks/Noodles";
import Honey from "./product-field/Grocery/Canned & Packaged Food/Honey";
import Jam from "./product-field/Grocery/Canned & Packaged Food/Jam";
import Pickles from "./product-field/Grocery/Canned & Packaged Food/Pickles";
import Sauces from "./product-field/Grocery/Canned & Packaged Food/Sauces";

// Grocery - Household, Pet Care & General
import Cleaning from "./product-field/Grocery/Londry and household/Cleaning";
import PetFood from "./product-field/Grocery/Pet care/PetFood";
import GroceryGeneral from "./product-field/Grocery/GroceryGeneral";

const supabase = createClient();

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  fieldsConfig: unknown;
  parentId: string | null;
  image?: string | null;
  icon?: string | null;
};

type ProductSpecificComponent = ComponentType<any>;

const PRODUCT_COMPONENTS: Record<string, ProductSpecificComponent> = {
  // Fashion
  shirt: Shirt,
  panjabi: Panjabi,
  pant: Pant,
  shoes: Shoes,
  sandal: Sandal,
  cap: Cap,
  watch: Watch,
  saree: Saree,
  "three-piece": ThreePiece,
  bag: Bag,
  jewelry: Jewelry,

  // Bakery & Biscuits
  biscuits: Biscuits,
  biscuit: Biscuits,
  biscute: Biscuits,
  cookies: Cookies,
  cookie: Cookies,
  bread: Bread,
  bun: Bun,
  cake: Cake,
  cakes: Cake,
  pastry: Pastry,
  toast: Toast,
  sweets: Sweets,
  sweet: Sweets,
  chocolate: Chocolate,
  chocolates: Chocolate,
  candy: Candy,

  // Beverages
  tea: Tea,
  coffee: Coffee,
  juice: Juice,
  "mineral-water": MineralWater,
  water: MineralWater,
  "soft-drinks": SoftDrinks,
  beverage: SoftDrinks,
  beverages: SoftDrinks,
  drinks: SoftDrinks,
  "energy-drinks": EnergyDrinks,

  // Cooking & Essentials
  rice: Rice,
  dal: Dal,
  daal: Dal,
  flour: Flour,
  atta: Flour,
  maida: Flour,
  suji: Flour,
  oil: SoybeanOil,
  "soybean-oil": SoybeanOil,
  "mustard-oil": MustardOil,
  "olive-oil": OliveOil,
  ghee: Ghee,
  salt: Salt,
  chili: Chili,
  turmeric: Turmeric,
  coriander: Coriander,
  cumin: Cumin,
  "garam-masala": GaramMasala,
  spices: GaramMasala,
  spice: GaramMasala,
  masala: GaramMasala,

  // Dairy & Eggs
  milk: Milk,
  dairy: Milk,
  eggs: Eggs,
  egg: Eggs,

  // Meat & Fish
  beef: Beef,
  chicken: Chicken,
  mutton: Mutton,
  meat: Beef,
  fish: Fish,

  // Produce
  fruits: Fruits,
  fruit: Fruits,
  vegetables: Vegetables,
  vegetable: Vegetables,

  // Snacks & Packaged
  chips: Chips,
  crisps: Chips,
  noodles: Noodles,
  noodle: Noodles,
  pasta: Noodles,
  macaroni: Noodles,
  honey: Honey,
  jam: Jam,
  pickles: Pickles,
  pickle: Pickles,
  sauces: Sauces,
  sauce: Sauces,
  ketchup: Sauces,

  // Household & Pet
  cleaning: Cleaning,
  detergent: Cleaning,
  household: Cleaning,
  "pet-food": PetFood,
  "pet-care": PetFood,
  pet: PetFood,

  // General Grocery Fallback
  grocery: GroceryGeneral,
  food: GroceryGeneral,
};

function normalizeCategoryName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findComponentForCategory(
  category: Category | undefined,
  categories: Category[]
): ProductSpecificComponent | null {
  if (!category?.name) return null;

  const key = normalizeCategoryName(category.name);
  const rawLower = category.name.toLowerCase();

  // 1. Direct match in registry
  if (PRODUCT_COMPONENTS[key]) {
    return PRODUCT_COMPONENTS[key];
  }

  // Helper matcher for words/tokens separated by '-'
  const hasWord = (word: string) =>
    new RegExp(`(?:^|-)${word}(?:-|$)`, "i").test(key);

  // 2. Household, Cleaning & Pet Care
  if (
    hasWord("clean") ||
    hasWord("cleaner") ||
    hasWord("cleaning") ||
    hasWord("detergent") ||
    hasWord("wash") ||
    hasWord("washing") ||
    hasWord("harpic") ||
    hasWord("wheel") ||
    hasWord("surf") ||
    hasWord("toilet") ||
    hasWord("tissue") ||
    hasWord("dishwashing")
  ) {
    return Cleaning;
  }

  if (
    hasWord("pet") ||
    hasWord("cat") ||
    hasWord("dog") ||
    key.includes("pet-food") ||
    key.includes("cat-food") ||
    key.includes("dog-food")
  ) {
    return PetFood;
  }

  // 3. Biscuits & Cookies & Bakery
  if (
    key.includes("biscuit") ||
    key.includes("biscute") ||
    rawLower.includes("বিস্কুট") ||
    hasWord("cracker") ||
    hasWord("crackers")
  ) {
    return Biscuits;
  }
  if (key.includes("cookie")) return Cookies;
  if (hasWord("toast")) return Toast;
  if (hasWord("bread") || hasWord("ruti") || hasWord("roti")) return Bread;
  if (hasWord("bun")) return Bun;
  if (hasWord("cake") || hasWord("cakes")) return Cake;
  if (hasWord("pastry")) return Pastry;
  if (hasWord("sweet") || hasWord("sweets") || rawLower.includes("মিষ্টি")) return Sweets;
  if (key.includes("choc") || hasWord("candy") || hasWord("toffee")) return Chocolate;

  // 4. Beverages
  if (hasWord("tea") || rawLower.includes("চা") || key.includes("black-tea") || key.includes("green-tea")) return Tea;
  if (hasWord("coffee")) return Coffee;
  if (hasWord("juice")) return Juice;
  if (hasWord("water") || rawLower.includes("পানি")) return MineralWater;
  if (hasWord("energy") || key.includes("energy-drink")) return EnergyDrinks;
  if (hasWord("drink") || hasWord("drinks") || hasWord("beverage") || hasWord("beverages") || hasWord("soda")) return SoftDrinks;

  // 5. Cooking, Grains & Oil
  if (hasWord("rice") || hasWord("chal") || hasWord("chawl") || rawLower.includes("চাল")) return Rice;
  if (hasWord("dal") || hasWord("daal") || hasWord("lentil") || rawLower.includes("ডাল")) return Dal;
  if (hasWord("atta") || hasWord("flour") || hasWord("maida") || hasWord("suji") || rawLower.includes("আটা") || rawLower.includes("ময়দা")) return Flour;
  if (hasWord("mustard") || key.includes("mustard-oil")) return MustardOil;
  if (hasWord("olive") || key.includes("olive-oil")) return OliveOil;
  if (hasWord("oil") || hasWord("tel") || rawLower.includes("তেল") || key.includes("soybean-oil")) return SoybeanOil;
  if (hasWord("ghee") || rawLower.includes("ঘি")) return Ghee;

  // 6. Spices & Salt
  if (hasWord("salt") || rawLower.includes("লবণ")) return Salt;
  if (hasWord("chili") || hasWord("chilli") || rawLower.includes("মরিচ")) return Chili;
  if (hasWord("turmeric") || rawLower.includes("হলুদ")) return Turmeric;
  if (hasWord("coriander") || rawLower.includes("ধনিয়া")) return Coriander;
  if (hasWord("cumin") || rawLower.includes("জিরা")) return Cumin;
  if (hasWord("masala") || hasWord("spice") || hasWord("spices") || rawLower.includes("মসলা")) return GaramMasala;

  // 7. Dairy & Eggs
  if (hasWord("milk") || hasWord("dairy") || rawLower.includes("দুধ")) return Milk;
  if (hasWord("egg") || hasWord("eggs") || rawLower.includes("ডিম") || key.includes("chicken-egg")) return Eggs;

  // 8. Meat & Fish
  if (hasWord("beef") || rawLower.includes("গরু")) return Beef;
  if (hasWord("chicken") || rawLower.includes("মুরগি")) return Chicken;
  if (hasWord("mutton") || rawLower.includes("খাসি")) return Mutton;
  if (hasWord("fish") || rawLower.includes("মাছ")) return Fish;

  // 9. Fresh Produce
  if (hasWord("fruit") || hasWord("fruits") || rawLower.includes("ফল")) return Fruits;
  if (hasWord("vegetable") || hasWord("vegetables") || rawLower.includes("সবজি")) return Vegetables;

  // 10. Snacks & Packaged Food
  if (hasWord("chip") || hasWord("chips") || hasWord("crisp") || hasWord("nacho")) return Chips;
  if (hasWord("noodle") || hasWord("noodles") || hasWord("pasta") || hasWord("macaroni") || hasWord("maggi") || hasWord("ramen")) return Noodles;
  if (hasWord("honey") || rawLower.includes("মধু")) return Honey;
  if (hasWord("jam") || hasWord("jelly")) return Jam;
  if (hasWord("pickle") || hasWord("pickles") || rawLower.includes("আচার")) return Pickles;
  if (hasWord("sauce") || hasWord("sauces") || hasWord("ketchup")) return Sauces;

  // 11. Fashion
  if (hasWord("shirt")) return Shirt;
  if (hasWord("panjabi")) return Panjabi;
  if (hasWord("pant")) return Pant;
  if (hasWord("shoe") || hasWord("shoes")) return Shoes;
  if (hasWord("sandal") || hasWord("sandals")) return Sandal;
  if (hasWord("cap") || hasWord("caps")) return Cap;
  if (hasWord("watch") || hasWord("watches")) return Watch;
  if (hasWord("saree") || hasWord("shari") || rawLower.includes("শাড়ি")) return Saree;
  if (key.includes("three-piece")) return ThreePiece;
  if (hasWord("bag") || hasWord("bags")) return Bag;
  if (hasWord("jewelry") || hasWord("jewellery")) return Jewelry;

  // 12. Ancestor / Parent Check
  let currentParentId = category.parentId;
  while (currentParentId) {
    const parent = categories.find((c) => c.id === currentParentId);
    if (!parent) break;
    const parentKey = normalizeCategoryName(parent.name);
    if (PRODUCT_COMPONENTS[parentKey]) {
      return PRODUCT_COMPONENTS[parentKey];
    }
    if (
      parentKey.includes("grocery") ||
      parentKey.includes("food") ||
      parentKey.includes("essential") ||
      parentKey.includes("bakery") ||
      parentKey.includes("snack")
    ) {
      return GroceryGeneral;
    }
    currentParentId = parent.parentId;
  }

  // 13. Default to General Grocery if name mentions grocery / food / snack / bakery
  if (
    key.includes("grocery") ||
    key.includes("food") ||
    key.includes("snack") ||
    key.includes("bakery")
  ) {
    return GroceryGeneral;
  }

  return null;
}

type CategoryTreeItemProps = {
  category: Category;
  categories: Category[];
  level: number;
  openCategoryIds: string[];
  onToggleCategory: (category: Category) => void;
  onSelectCategory: (category: Category) => void;
};

function CategoryTreeItem({
  category,
  categories,
  level,
  openCategoryIds,
  onToggleCategory,
  onSelectCategory,
}: CategoryTreeItemProps) {
  const children = categories.filter(
    (item) => item.parentId === category.id,
  );

  const hasChildren = children.length > 0;
  const isOpen = openCategoryIds.includes(category.id);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) {
            onToggleCategory(category);
          } else {
            onSelectCategory(category);
          }
        }}
        className={[
          "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition",
          "hover:bg-slate-50",
          level === 0
            ? "text-sm font-semibold text-slate-700"
            : "text-xs font-medium text-slate-600",
        ].join(" ")}
        style={{
          paddingLeft: `${12 + level * 20}px`,
        }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown
              size={15}
              className="shrink-0 text-slate-400"
            />
          ) : (
            <ChevronRight
              size={15}
              className="shrink-0 text-slate-400"
            />
          )
        ) : (
          <span className="w-[15px] shrink-0" />
        )}

        <span className="truncate">{category.name}</span>
      </button>

      {hasChildren && isOpen && (
        <div>
          {children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              categories={categories}
              level={level + 1}
              openCategoryIds={openCategoryIds}
              onToggleCategory={onToggleCategory}
              onSelectCategory={onSelectCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ProductInformationProps = {
  form: ProductBasicInfo;
  isCategoryOpen: boolean;
  openCategoryIds: string[];
  onToggleCategory: () => void;
  onCategorySelect: (category: Category) => void;
  setOpenCategoryIds: Dispatch<SetStateAction<string[]>>;
  onTitleChange: (value: string) => void;
  onFieldChange: (field: keyof ProductBasicInfo, value: string) => void;
  productAttributes: Record<string, any>;
  setProductAttributes: Dispatch<SetStateAction<Record<string, any>>>;

  // Product Coupon
  couponEnabled: boolean;
  setCouponEnabled: Dispatch<SetStateAction<boolean>>;
  couponName: string;
  setCouponName: Dispatch<SetStateAction<string>>;
  couponDiscount: string;
  setCouponDiscount: Dispatch<SetStateAction<string>>;
};

export default function ProductInformation({
  form,
  isCategoryOpen,
  openCategoryIds,
  onToggleCategory,
  onCategorySelect,
  setOpenCategoryIds,
  onTitleChange,
  onFieldChange,
  productAttributes,
  setProductAttributes,

  couponEnabled,
  setCouponEnabled,
  couponName,
  setCouponName,
  couponDiscount,
  setCouponDiscount,
}: ProductInformationProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        setCategoryError("");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.access_token) {
          throw new Error("You are not logged in.");
        }

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

        const response = await fetch(
          `${API_BASE_URL}/api/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              "Failed to load categories.",
          );
        }

        const categoryList = Array.isArray(data?.data)
          ? data.data
          : [];

        if (mounted) {
          setCategories(categoryList);
        }
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);

        if (mounted) {
          setCategoryError(
            error instanceof Error
              ? error.message
              : "Failed to load categories.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoadingCategories(false);
        }
      }
    }

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const rootCategories = useMemo(() => {
    return categories
      .filter((category) => !category.parentId)
      .sort((a, b) => {
        const aIsGrocery = /grocer|মুদি/i.test(a.name);
        const bIsGrocery = /grocer|মুদি/i.test(b.name);
        if (aIsGrocery && !bIsGrocery) return -1;
        if (!aIsGrocery && bIsGrocery) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [categories]);

  const selectedCategory = useMemo(() => {
    if (!form.categoryId) {
      return undefined;
    }

    return categories.find(
      (category) => category.id === form.categoryId,
    );
  }, [categories, form.categoryId]);

  const getAncestorIds = (categoryId: string) => {
    const ancestorIds: string[] = [];

    let current = categories.find(
      (category) => category.id === categoryId,
    );

    while (current?.parentId) {
      ancestorIds.push(current.parentId);

      const parentId = current.parentId;

      current = categories.find(
        (category) => category.id === parentId,
      );
    }

    return ancestorIds;
  };

  const handleToggleCategory = (category: Category) => {
    const hasChildren = categories.some(
      (item) => item.parentId === category.id,
    );

    if (!hasChildren) {
      return;
    }

    const isOpen = openCategoryIds.includes(category.id);

    if (!isOpen) {
      const ancestorIds = getAncestorIds(category.id);

      setOpenCategoryIds((prev) => {
        const next = new Set(prev);

        ancestorIds.forEach((id) => next.add(id));
        next.add(category.id);

        return Array.from(next);
      });

      return;
    }

    const descendantIds: string[] = [];

    const findDescendants = (parentId: string) => {
      categories.forEach((item) => {
        if (item.parentId === parentId) {
          descendantIds.push(item.id);
          findDescendants(item.id);
        }
      });
    };

    findDescendants(category.id);

    setOpenCategoryIds((prev) =>
      prev.filter(
        (id) =>
          id !== category.id &&
          !descendantIds.includes(id),
      ),
    );
  };

  const handleSelectCategory = (category: Category) => {
    onCategorySelect(category);
    setProductAttributes({});
  };

  const ProductSpecificComponent = useMemo(() => {
    return findComponentForCategory(selectedCategory, categories);
  }, [selectedCategory, categories]);

  const handleCouponToggle = () => {
    if (couponEnabled) {
      setCouponEnabled(false);
      setCouponName("");
      setCouponDiscount("");
      return;
    }

    setCouponEnabled(true);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800">
          Product Information
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Add the basic information and category for this product.
        </p>
      </div>

      <div className="space-y-6 p-5">
        {/* Product Title */}
        <div>
          <label
            htmlFor="product-title"
            className="mb-2 block text-xs font-semibold text-slate-700"
          >
            Product Title
          </label>

          <input
            id="product-title"
            type="text"
            value={form.title ?? ""}
            onChange={(event) =>
              onTitleChange(event.target.value)
            }
            placeholder="Enter product title"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
          />
        </div>

        {/* Product Slug */}
        <div>
          <label
            htmlFor="product-slug"
            className="mb-2 block text-xs font-semibold text-slate-700"
          >
            Product Slug
          </label>

          <input
            id="product-slug"
            type="text"
            value={form.slug ?? ""}
            onChange={(event) =>
              onFieldChange("slug", event.target.value)
            }
            placeholder="product-slug"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
          />
        </div>

        {/* Product SKU */}
        <div>
          <label
            htmlFor="product-sku"
            className="mb-2 block text-xs font-semibold text-slate-700"
          >
            Product SKU
          </label>

          <input
            id="product-sku"
            type="text"
            value={form.sku ?? ""}
            onChange={(event) =>
              onFieldChange("sku", event.target.value)
            }
            placeholder="Enter product SKU"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
          />
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="short-description"
            className="mb-2 block text-xs font-semibold text-slate-700"
          >
            Short Description
          </label>

          <textarea
            id="short-description"
            value={form.shortDescription ?? ""}
            onChange={(event) =>
              onFieldChange(
                "shortDescription",
                event.target.value,
              )
            }
            placeholder="Write a short description..."
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Product Description
          </label>

          <ProductDescriptionEditor
            value={form.description ?? ""}
            onChange={(value: string) =>
              onFieldChange("description", value)
            }
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-700">
            Category
          </label>

          <button
            type="button"
            onClick={onToggleCategory}
            className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-left text-xs text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#D6A419]"
          >
            <span>
              {selectedCategory?.name ||
                "Select product category"}
            </span>

            {isCategoryOpen ? (
              <ChevronDown
                size={16}
                className="text-slate-400"
              />
            ) : (
              <ChevronRight
                size={16}
                className="text-slate-400"
              />
            )}
          </button>

          {isCategoryOpen && (
            <div className="mt-2 max-h-[420px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-2">
              {isLoadingCategories ? (
                <div className="px-3 py-6 text-center text-xs text-slate-400">
                  Loading categories...
                </div>
              ) : categoryError ? (
                <div className="px-3 py-6 text-center text-xs text-red-500">
                  {categoryError}
                </div>
              ) : rootCategories.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-slate-400">
                  No categories found.
                </div>
              ) : (
                rootCategories.map((category) => (
                  <CategoryTreeItem
                    key={category.id}
                    category={category}
                    categories={categories}
                    level={0}
                    openCategoryIds={openCategoryIds}
                    onToggleCategory={handleToggleCategory}
                    onSelectCategory={handleSelectCategory}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Selected Category */}
        {selectedCategory && (
          <div className="rounded-lg border border-[#D6A419]/30 bg-[#D6A419]/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Selected Category
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedCategory.name}
                </p>
              </div>

              <span className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                {selectedCategory.slug}
              </span>
            </div>
          </div>
        )}

        {/* Product Specific Information */}
        {selectedCategory && (
          <div className="border-t border-slate-200 pt-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Product Specific Information
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Add information specific to the selected product category.
              </p>
            </div>

            {ProductSpecificComponent ? (
              <ProductSpecificComponent
                value={productAttributes}
                onChange={setProductAttributes}
              />
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <p className="text-xs text-slate-500">
                  No product-specific information available for this category.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Product Coupon */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Product Coupon
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Add an optional fixed discount coupon for this product.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={couponEnabled}
              onClick={handleCouponToggle}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                couponEnabled
                  ? "bg-[#D6A419]"
                  : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  couponEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {couponEnabled && (
            <div className="mt-5 space-y-4 rounded-lg border border-[#D6A419]/30 bg-[#D6A419]/5 p-4">
              <div>
                <label
                  htmlFor="product-coupon-name"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Coupon Name
                </label>

                <input
                  id="product-coupon-name"
                  type="text"
                  value={couponName}
                  onChange={(event) =>
                    setCouponName(
                      event.target.value
                        .toUpperCase()
                        .replace(/\s+/g, ""),
                    )
                  }
                  placeholder="e.g. SAVE50"
                  maxLength={40}
                  required={couponEnabled}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
                />
              </div>

              <div>
                <label
                  htmlFor="product-coupon-discount"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Discount Amount (৳)
                </label>

                <input
                  id="product-coupon-discount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={couponDiscount}
                  onChange={(event) =>
                    setCouponDiscount(event.target.value)
                  }
                  placeholder="e.g. 50"
                  required={couponEnabled}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
                />

                <p className="mt-2 text-[11px] text-slate-500">
                  Enter the fixed discount amount in Taka.
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">
                  Coupon Preview
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="break-all text-sm font-bold text-slate-800">
                    {couponName || "YOURCOUPON"}
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-green-700">
                    ৳{couponDiscount || "0"} OFF
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
