"use client";

import { useEffect, useMemo, useState } from "react";

import type { ComponentType, Dispatch, SetStateAction } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import ProductDescriptionEditor from "./product-field/ProductDescriptionEditor";
import { getFashionFieldComponent } from "./product-field/Fashion/fieldRegistry";

import type { ProductBasicInfo } from "../components/product-placement/types";

import { createClient } from "../../../../../../../lib/supabase-client";

// Grocery - Bakery & Biscuits
import Bread from "./product-field/Grocery/Bakery/Bread";
import CakeSweetsPies from "./product-field/Grocery/Bakery/CakeSweetsPies";
import ToastBakeryBiscuits from "./product-field/Grocery/Bakery/ToastBakeryBiscuits";

// Grocery - Beverages
import Juice from "./product-field/Grocery/Beverages/Juice";
import MineralDrinks from "./product-field/Grocery/Beverages/MineralDrinks";
import SoftDrinks from "./product-field/Grocery/Beverages/SoftDrinks";
import EnergyDrinks from "./product-field/Grocery/Beverages/EnergyDrinks";
import SportsDrinks from "./product-field/Grocery/Beverages/SportsDrinks";
import SyrupsPowderDrinks from "./product-field/Grocery/Beverages/SyrupsPowderDrinks";
import TeaCoffee from "./product-field/Grocery/Beverages/TeaCoffee";

// Grocery - Cooking & Essentials
import Rice from "./product-field/Grocery/cooking and essential/Rice";
import LentilsChola from "./product-field/Grocery/cooking and essential/LentilsChola";
import AttaFlours from "./product-field/Grocery/cooking and essential/AttaFlours";
import SaltSugar from "./product-field/Grocery/cooking and essential/SaltSugar";
import CookingOil from "./product-field/Grocery/cooking and essential/Oil";
import SemaiSuji from "./product-field/Grocery/cooking and essential/SemaiSuji";
import CookingSpices from "./product-field/Grocery/cooking and essential/Spices";
import ReadyMix from "./product-field/Grocery/cooking and essential/ReadyMix";
import ColorsFlavours from "./product-field/Grocery/cooking and essential/ColorsFlavours";
import BakingIngredients from "./product-field/Grocery/cooking and essential/BakingIngredients";
import Oats from "./product-field/Grocery/cooking and essential/Oats";
import LeafyGreens from "./product-field/Grocery/cooking and essential/LeafyGreens";

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
import DairyGhee from "./product-field/Grocery/Dairy & Eggs/Dairy/Ghee";
import ButterSourCream from "./product-field/Grocery/Dairy & Eggs/Dairy/Butters Sour Cream";
import Cheese from "./product-field/Grocery/Dairy & Eggs/Dairy/Cheese";
import CondensedMilkCream from "./product-field/Grocery/Dairy & Eggs/Dairy/Condensed Milk and Cream";
import YogurtCurdsSweets from "./product-field/Grocery/Dairy & Eggs/Dairy/yofurt,curds and weets";
import Laban from "./product-field/Grocery/Dairy & Eggs/Dairy/laban";
import Lassi from "./product-field/Grocery/Dairy & Eggs/Dairy/Lacchi";
import Borhani from "./product-field/Grocery/Dairy & Eggs/Dairy/Borhani";
import IceCream from "./product-field/Grocery/Dairy & Eggs/Dairy/Ice Cream";
import Matha from "./product-field/Grocery/Dairy & Eggs/Dairy/Matha";
import UHTLiquidMilkPowder from "./product-field/Grocery/Dairy & Eggs/Dairy/UHT Liquid Milk Powder";
import DuckEggs from "./product-field/Grocery/Dairy & Eggs/Eggs/Duck Eggs";
import QuailEggs from "./product-field/Grocery/Dairy & Eggs/Eggs/Quail Eggs";
import FreshFish from "./product-field/Grocery/Meat & Fish/Fresh Fish";
import WaterFish from "./product-field/Grocery/Meat & Fish/Fresh Fish/Water Fish";
import SeaFish from "./product-field/Grocery/Meat & Fish/Fresh Fish/Sea Fish";
import DriedFish from "./product-field/Grocery/Meat & Fish/Fresh Fish/Dried Fish";
import FrozenFish from "./product-field/Grocery/Meat & Fish/Fresh Fish/Frozen Fish";
import ReadyToCookFish from "./product-field/Grocery/Meat & Fish/Fresh Fish/Ready-to-Cook Fish";
import FreshMeat from "./product-field/Grocery/Meat & Fish/Fresh Meat";
import FrozenMeat from "./product-field/Grocery/Meat & Fish/Fresh Meat/Frozen Meat";
import CookReadyMeat from "./product-field/Grocery/Meat & Fish/Fresh Meat/Cook-Ready Meat";
import Fruits from "./product-field/Grocery/Fruits and Vagetable/FreshFruits";
import Vegetables from "./product-field/Grocery/Fruits and Vagetable/FreshVegetables";
import FreshFruits from "./product-field/Grocery/Fruits and Vagetable/FreshFruits";
import FreshVegetables from "./product-field/Grocery/Fruits and Vagetable/FreshVegetables";

// Grocery - Snacks & Packaged
import Chips from "./product-field/Grocery/Snacks/Chips";
import Noodles from "./product-field/Grocery/Snacks/Noodles";
import CandyChocolate from "./product-field/Grocery/Snacks/CandyChocolate";
import DriedFruitsNuts from "./product-field/Grocery/Snacks/DriedFruitsNuts";
import ConfectioneryCandyChocolate from "./product-field/Grocery/Confectionneries/Candy and choclate";
import ConfectioneryDriedFruitsNutsSeeds from "./product-field/Grocery/Confectionneries/DriedFruites-Nuts-Seeds";
import Honey from "./product-field/Grocery/Canned & Packaged/Honey";
import Jam from "./product-field/Grocery/Canned & Packaged/Jam";
import Pickles from "./product-field/Grocery/Canned & Packaged/Pickles";
import Sauces from "./product-field/Grocery/Canned & Packaged/Sauces";
import ParathaRoti from "./product-field/Grocery/Frozen Canned/ParathaRoti";
import FrozenSnacks from "./product-field/Grocery/Frozen Canned/FrozenSnacks";
import FrozenFishMeat from "./product-field/Grocery/Frozen Canned/FrozenFishMeat";
import FrozenFruitsVegetables from "./product-field/Grocery/Frozen Canned/FrozenFruitsVegetables";
import MushroomCan from "./product-field/Grocery/Frozen Canned/MushroomCan";
import VegetableCan from "./product-field/Grocery/Frozen Canned/VegetableCan";
import FishCan from "./product-field/Grocery/Frozen Canned/FishCan";
import CannedFruitsSweets from "./product-field/Grocery/Frozen Canned/CannedFruitsSweets";

// Grocery - Household, Pet Care & General
import Cleaning from "./product-field/Grocery/Londry and household/Cleaning";
import Dishwashing from "./product-field/Grocery/Londry and household/Dishwashing";
import WashingPowder from "./product-field/Grocery/Londry and household/WashingPowder";
import WashingLiquid from "./product-field/Grocery/Londry and household/WashingLiquid";
import ToiletCleaners from "./product-field/Grocery/Londry and household/ToiletCleaners";
import FloorCleaners from "./product-field/Grocery/Londry and household/FloorCleaners";
import AirFresheners from "./product-field/Grocery/Londry and household/AirFresheners";
import GlassCleaners from "./product-field/Grocery/Londry and household/GlassCleaners";
import WoodCleaners from "./product-field/Grocery/Londry and household/WoodCleaners";
import PestControl from "./product-field/Grocery/Londry and household/PestControl";
import CleaningAccessories from "./product-field/Grocery/Londry and household/CleaningAccessories";
import PapersTissues from "./product-field/Grocery/Londry and household/PapersTissues";
import TrashBinBasket from "./product-field/Grocery/Londry and household/TrashBinBasket";
import TrashBagDisposables from "./product-field/Grocery/Londry and household/TrashBagDisposables";
import ShoeCare from "./product-field/Grocery/Londry and household/ShoeCare";
import PetFood from "./product-field/Grocery/Pet care/PetFood";
import BirdOtherPetFood from "./product-field/Grocery/Pet care/BirdOtherPetFood";
import CatFood from "./product-field/Grocery/Pet care/CatFood";
import DogFood from "./product-field/Grocery/Pet care/DogFood";
import PetAccessories from "./product-field/Grocery/Pet care/PetAccessories";
import PetHealthCare from "./product-field/Grocery/Pet care/PetHealthCare";
import RabbitFood from "./product-field/Grocery/Pet care/RabbitFood";

import BiryaniPulao from "./product-field/Grocery/Homemade and Resturent/BiryaniPulao";
import Burgers from "./product-field/Grocery/Homemade and Resturent/Burgers";
import Pizzas from "./product-field/Grocery/Homemade and Resturent/Pizzas";
import Pasta from "./product-field/Grocery/Homemade and Resturent/Pasta";
import Sandwiches from "./product-field/Grocery/Homemade and Resturent/Sandwiches";
import SoupsStews from "./product-field/Grocery/Homemade and Resturent/SoupsStews";
import FriedFoods from "./product-field/Grocery/Homemade and Resturent/FriedFoods";
import RoastChickenBeef from "./product-field/Grocery/Homemade and Resturent/RoastChickenBeef";
import GroceryGeneral from "./product-field/Grocery/Homemade and Resturent/GroceryGeneral";

// Grocery - Breakfast
import BreakfastBread from "./product-field/Grocery/BreakFast/Bread";
import Cereals from "./product-field/Grocery/BreakFast/cereals";
import BreakfastHoney from "./product-field/Grocery/BreakFast/Honey";
import Granola from "./product-field/Grocery/BreakFast/Granala";
import BreakfastSpreads from "./product-field/Grocery/BreakFast/Dips-Sppeads-Suuces";
import JamJelly from "./product-field/Grocery/BreakFast/Jam-jelly";
import LocalBreakfast from "./product-field/Grocery/BreakFast/LocalBreakfast";
import OatmealGrits from "./product-field/Grocery/BreakFast/Oatmeats and grits";

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
  // Bakery & Biscuits
  biscuits: ToastBakeryBiscuits,
  biscuit: ToastBakeryBiscuits,
  biscute: ToastBakeryBiscuits,
  cookies: ToastBakeryBiscuits,
  cookie: ToastBakeryBiscuits,
  bread: Bread,
  bun: CakeSweetsPies,
  cake: CakeSweetsPies,
  cakes: CakeSweetsPies,
  pastry: CakeSweetsPies,
  pie: CakeSweetsPies,
  pies: CakeSweetsPies,
  toast: ToastBakeryBiscuits,
  sweets: CakeSweetsPies,
  sweet: CakeSweetsPies,
  "cakes-and-sweets-pies": CakeSweetsPies,
  "toast-and-bakery-biscuits": ToastBakeryBiscuits,

  // Beverages
  tea: TeaCoffee,
  coffee: TeaCoffee,
  "tea-and-coffee": TeaCoffee,
  juice: Juice,
  "mineral-drinks": MineralDrinks,
  "mineral-water": MineralDrinks,
  water: MineralDrinks,
  "soft-drinks": SoftDrinks,
  beverage: SoftDrinks,
  beverages: SoftDrinks,
  drinks: SoftDrinks,
  "energy-drinks": EnergyDrinks,
  "sports-drinks": SportsDrinks,
  "syrups-and-powder-drinks": SyrupsPowderDrinks,

  // Cooking & Essentials
  rice: Rice,
  dal: LentilsChola,
  daal: LentilsChola,
  flour: AttaFlours,
  atta: AttaFlours,
  maida: AttaFlours,
  suji: SemaiSuji,
  oil: CookingOil,
  "soybean-oil": CookingOil,
  "mustard-oil": CookingOil,
  "olive-oil": CookingOil,
  ghee: CookingOil,
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
  beef: FreshMeat,
  chicken: CookReadyMeat,
  mutton: FreshMeat,
  meat: FreshMeat,
  fish: FreshFish,

  // Produce
  fruits: Fruits,
  fruit: Fruits,
  "fresh-fruits": FreshFruits,
  vegetables: Vegetables,
  vegetable: Vegetables,
  "fresh-vegetables": FreshVegetables,

  // Snacks & Packaged
  chips: Chips,
  crisps: Chips,
  "candy-and-chocolate": CandyChocolate,
  chocolate: CandyChocolate,
  candy: CandyChocolate,
  toffee: CandyChocolate,
  "dried-fruits-nuts": DriedFruitsNuts,
  "dried-fruits-and-nuts": DriedFruitsNuts,
  nuts: DriedFruitsNuts,
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
  "paratha-and-roti": ParathaRoti,
  "frozen-snacks": FrozenSnacks,
  "frozen-fish-and-meat": FrozenFishMeat,
  "frozen-fruits-and-vegetables": FrozenFruitsVegetables,
  "mushroom-can": MushroomCan,
  "vegetable-can": VegetableCan,
  "fish-can": FishCan,
  "canned-fruits-and-sweets": CannedFruitsSweets,

  // Household & Pet
  cleaning: Cleaning,
  "cleaning-and-detergents": Cleaning,
  "cleaning-supplies": Cleaning,
  detergent: Cleaning,
  household: Cleaning,
  dishwashing: Dishwashing,
  "washing-powder": WashingPowder,
  "washing-liquid": WashingLiquid,
  "toilet-cleaners": ToiletCleaners,
  "floor-cleaners": FloorCleaners,
  "air-fresheners": AirFresheners,
  "glass-cleaners": GlassCleaners,
  "wood-cleaners": WoodCleaners,
  "pest-control": PestControl,
  "cleaning-accessories": CleaningAccessories,
  "papers-and-tissues": PapersTissues,
  "trash-bin-and-basket": TrashBinBasket,
  "trash-bag-and-disposables": TrashBagDisposables,
  "shoe-care": ShoeCare,
  "pet-food": PetFood,
  "pet-care": PetFood,
  pet: PetFood,
  "bird-and-other-pet-food": BirdOtherPetFood,
  "cat-food": CatFood,
  "dog-food": DogFood,
  "pet-accessories": PetAccessories,
  "pet-halth-care": PetHealthCare,
  "rabbit-food": RabbitFood,
  "biryani-and-pulao": BiryaniPulao,
  burgers: Burgers,
  pizzas: Pizzas,
  sandwiches: Sandwiches,
  "soups-and-stews": SoupsStews,
  "fried-foods": FriedFoods,
  "roast-chicken-and-roast-beef": RoastChickenBeef,

  // General Grocery Fallback
  grocery: GroceryGeneral,
  food: GroceryGeneral,
};

const DAIRY_EGG_COMPONENTS: Record<string, ProductSpecificComponent> = {
  milk: Milk,
  ghee: DairyGhee,
  "butter-and-sour-cream": ButterSourCream,
  cheese: Cheese,
  "condensed-milk-and-cream": CondensedMilkCream,
  "uht-and-liquid-milk-and-milk-powder": UHTLiquidMilkPowder,
  "yogurt-curds-and-sweets": YogurtCurdsSweets,
  laban: Laban,
  "lablacchi-or-lassi": Lassi,
  lassi: Lassi,
  borhani: Borhani,
  "ice-cream": IceCream,
  matha: Matha,
  "chicken-eggs": Eggs,
  "duck-eggs": DuckEggs,
  "quail-eggs": QuailEggs,
};

const COOKING_ESSENTIAL_COMPONENTS: Record<string, ProductSpecificComponent> = {
  rice: Rice,
  dal: LentilsChola,
  daal: LentilsChola,
  "lentils-and-chola": LentilsChola,
  "atta-and-flours": AttaFlours,
  flour: AttaFlours,
  atta: AttaFlours,
  maida: AttaFlours,
  "salt-and-sugar": SaltSugar,
  salt: Salt,
  sugar: SaltSugar,
  oil: CookingOil,
  "soybean-oil": CookingOil,
  "mustard-oil": CookingOil,
  "olive-oil": CookingOil,
  "sunflower-oil": CookingOil,
  ghee: CookingOil,
  "shemai-and-suji": SemaiSuji,
  shemai: SemaiSuji,
  semai: SemaiSuji,
  suji: SemaiSuji,
  "ready-mix": ReadyMix,
  spices: CookingSpices,
  spice: CookingSpices,
  chili: Chili,
  turmeric: Turmeric,
  coriander: Coriander,
  cumin: Cumin,
  "garam-masala": GaramMasala,
  "colors-and-flavours": ColorsFlavours,
  "baking-ingredients": BakingIngredients,
  oats: Oats,
  fruits: Fruits,
  "leafy-greens": LeafyGreens,
  vegetables: Vegetables,
};

const FISH_MEAT_COMPONENTS: Record<string, ProductSpecificComponent> = {
  "fresh-fish": FreshFish,
  "water-fish": WaterFish,
  "sea-fish": SeaFish,
  "dried-fish": DriedFish,
  "frozen-fish": FrozenFish,
  "ready-to-cook-fish": ReadyToCookFish,
  "fresh-meat": FreshMeat,
  "frozen-meat": FrozenMeat,
  "cook-ready-meat": CookReadyMeat,
};

const CONFECTIONERY_COMPONENTS: Record<string, ProductSpecificComponent> = {
  "candy-and-chocolate": ConfectioneryCandyChocolate,
  "dried-fruits-nuts-and-seeds": ConfectioneryDriedFruitsNutsSeeds,
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
  categories: Category[],
): ProductSpecificComponent | null {
  if (!category?.name) return null;

  const key = normalizeCategoryName(category.name);
  const rawLower = category.name.toLowerCase();

  const parentNames: string[] = [];
  let parentId = category.parentId;
  while (parentId) {
    const parent = categories.find((item) => item.id === parentId);
    if (!parent) break;
    parentNames.push(parent.name);
    parentId = parent.parentId;
  }

  const isDairyEggsCategory =
    key === "dairy-and-eggs" ||
    parentNames.some((name) => normalizeCategoryName(name) === "dairy-and-eggs");
  if (isDairyEggsCategory) {
    if (key === "dairy-and-eggs" || key === "dairy" || key === "eggs") return null;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "dairy-and-eggs") break;

      const component = DAIRY_EGG_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isFishMeatCategory =
    key === "fish-and-meat" ||
    key === "meat-and-fish" ||
    parentNames.some((name) => {
      const parentKey = normalizeCategoryName(name);
      return parentKey === "fish-and-meat" || parentKey === "meat-and-fish";
    });
  if (isFishMeatCategory) {
    if (key === "fish-and-meat" || key === "meat-and-fish") return null;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "fish-and-meat" || name === "meat-and-fish") break;

      const component = FISH_MEAT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isConfectioneriesCategory =
    key === "confectioneries" ||
    parentNames.some((name) => normalizeCategoryName(name) === "confectioneries");
  if (isConfectioneriesCategory) {
    if (key === "confectioneries") return null;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "confectioneries") break;

      const component = CONFECTIONERY_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isCookingEssentialsCategory =
    key === "cooking-essentials" ||
    key === "cooking-and-essentials" ||
    parentNames.some((name) => {
      const parentKey = normalizeCategoryName(name);
      return parentKey === "cooking-essentials" || parentKey === "cooking-and-essentials";
    });
  if (isCookingEssentialsCategory) {
    if (key === "cooking-essentials" || key === "cooking-and-essentials") return null;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "cooking-essentials" || name === "cooking-and-essentials") break;

      const component = COOKING_ESSENTIAL_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isCannedFrozenCategory =
    key === "canned-and-frozen" ||
    parentNames.some((name) => normalizeCategoryName(name) === "canned-and-frozen");
  if (isCannedFrozenCategory) {
    if (key === "canned-and-frozen") return null;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "canned-and-frozen") break;

      const component = PRODUCT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isLaundryHouseholdCategory =
    key === "laundry-and-household" ||
    parentNames.some((name) => normalizeCategoryName(name) === "laundry-and-household");
  if (isLaundryHouseholdCategory) {
    if (key === "laundry-and-household") return null;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "laundry-and-household") break;

      const component = PRODUCT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isPetCareCategory = parentNames.some(
    (name) => normalizeCategoryName(name) === "pet-care",
  );
  if (isPetCareCategory) {
    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "pet-care") break;

      const component = PRODUCT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isHomemadeRestaurantCategory =
    key === "homemade-and-restaurant" ||
    parentNames.some((name) => normalizeCategoryName(name) === "homemade-and-restaurant");
  if (isHomemadeRestaurantCategory) {
    if (key === "homemade-and-restaurant") return null;
    if (key === "pasta") return Pasta;

    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "homemade-and-restaurant") break;

      const component = PRODUCT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isBakeryCategory = parentNames.some(
    (name) => normalizeCategoryName(name) === "bakery",
  );
  if (isBakeryCategory) {
    if (key === "bread") return Bread;
    if (key === "cakes-and-sweets-pies") return CakeSweetsPies;
    if (key === "toast-and-bakery-biscuits") return ToastBakeryBiscuits;
    return null;
  }

  const isBeverageCategory = parentNames.some(
    (name) => normalizeCategoryName(name) === "beverages",
  );
  if (isBeverageCategory) {
    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "beverages") break;

      const component = PRODUCT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isSnacksCategory = parentNames.some(
    (name) => normalizeCategoryName(name) === "snacks-and-confectioneries",
  );
  if (isSnacksCategory) {
    for (const name of [key, ...parentNames.map(normalizeCategoryName)]) {
      if (name === "snacks-and-confectioneries") break;

      const component = PRODUCT_COMPONENTS[name];
      if (component) return component;
    }

    return null;
  }

  const isBreakfastCategory = parentNames.some(
    (name) => normalizeCategoryName(name) === "breakfast",
  );
  if (isBreakfastCategory) {
    if (key.includes("cereal")) return Cereals;
    if (key.includes("granola") || key.includes("granala")) return Granola;
    if (
      key.includes("oatmeal") ||
      key.includes("oatmeat") ||
      key.includes("grit") ||
      key === "oats"
    )
      return OatmealGrits;
    if (key.includes("jam") || key.includes("jelly")) return JamJelly;
    if (key.includes("honey") || rawLower.includes("মধু"))
      return BreakfastHoney;
    if (key.includes("spread") || key.includes("dip") || key.includes("sauce"))
      return BreakfastSpreads;
    if (key.includes("local-breakfast")) return LocalBreakfast;
    if (key.includes("bread") || key.includes("ruti") || key.includes("roti"))
      return BreakfastBread;
  }

  // 1. Direct match in registry
  if (PRODUCT_COMPONENTS[key]) {
    return PRODUCT_COMPONENTS[key];
  }

  const fashionComponent = getFashionFieldComponent(category.name, parentNames);
  if (fashionComponent) return fashionComponent;

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

  // 3. Bakery
  if (
    key.includes("biscuit") ||
    key.includes("biscute") ||
    rawLower.includes("বিস্কুট") ||
    hasWord("cracker") ||
    hasWord("crackers")
  ) {
    return ToastBakeryBiscuits;
  }
  if (key.includes("cookie")) return ToastBakeryBiscuits;
  if (hasWord("toast")) return ToastBakeryBiscuits;
  if (hasWord("bread") || hasWord("ruti") || hasWord("roti")) return Bread;
  if (
    hasWord("bun") ||
    hasWord("cake") ||
    hasWord("cakes") ||
    hasWord("pastry") ||
    hasWord("pie") ||
    hasWord("pies") ||
    hasWord("sweet") ||
    hasWord("sweets") ||
    rawLower.includes("মিষ্টি")
  )
    return CakeSweetsPies;

  // 4. Beverages
  if (
    hasWord("tea") ||
    rawLower.includes("চা") ||
    key.includes("black-tea") ||
    key.includes("green-tea")
  )
    return TeaCoffee;
  if (hasWord("coffee")) return TeaCoffee;
  if (hasWord("juice")) return Juice;
  if (hasWord("water") || rawLower.includes("পানি")) return MineralDrinks;
  if (hasWord("energy") || key.includes("energy-drink")) return EnergyDrinks;
  if (
    hasWord("drink") ||
    hasWord("drinks") ||
    hasWord("beverage") ||
    hasWord("beverages") ||
    hasWord("soda")
  )
    return SoftDrinks;

  // 5. Cooking, Grains & Oil
  if (
    hasWord("rice") ||
    hasWord("chal") ||
    hasWord("chawl") ||
    rawLower.includes("চাল")
  )
    return Rice;
  if (
    hasWord("dal") ||
    hasWord("daal") ||
    hasWord("lentil") ||
    rawLower.includes("ডাল")
  )
    return LentilsChola;
  if (
    hasWord("atta") ||
    hasWord("flour") ||
    hasWord("maida") ||
    hasWord("suji") ||
    rawLower.includes("আটা") ||
    rawLower.includes("ময়দা")
  )
    return AttaFlours;
  if (hasWord("mustard") || key.includes("mustard-oil")) return CookingOil;
  if (hasWord("olive") || key.includes("olive-oil")) return CookingOil;
  if (
    hasWord("oil") ||
    hasWord("tel") ||
    rawLower.includes("তেল") ||
    key.includes("soybean-oil")
  )
    return CookingOil;
  if (hasWord("ghee") || rawLower.includes("ঘি")) return CookingOil;

  // 6. Spices & Salt
  if (hasWord("salt") || rawLower.includes("লবণ")) return Salt;
  if (hasWord("chili") || hasWord("chilli") || rawLower.includes("মরিচ"))
    return Chili;
  if (hasWord("turmeric") || rawLower.includes("হলুদ")) return Turmeric;
  if (hasWord("coriander") || rawLower.includes("ধনিয়া")) return Coriander;
  if (hasWord("cumin") || rawLower.includes("জিরা")) return Cumin;
  if (
    hasWord("masala") ||
    hasWord("spice") ||
    hasWord("spices") ||
    rawLower.includes("মসলা")
  )
    return GaramMasala;

  // 7. Dairy & Eggs
  if (hasWord("milk") || hasWord("dairy") || rawLower.includes("দুধ"))
    return Milk;
  if (
    hasWord("egg") ||
    hasWord("eggs") ||
    rawLower.includes("ডিম") ||
    key.includes("chicken-egg")
  )
    return Eggs;

  // 8. Meat & Fish
  if (hasWord("beef") || rawLower.includes("গরু")) return FreshMeat;
  if (hasWord("chicken") || rawLower.includes("মুরগি")) return CookReadyMeat;
  if (hasWord("mutton") || rawLower.includes("খাসি")) return FreshMeat;
  if (hasWord("fish") || rawLower.includes("মাছ")) return FreshFish;

  // 9. Fresh Produce
  if (hasWord("fruit") || hasWord("fruits") || rawLower.includes("ফল"))
    return Fruits;
  if (
    hasWord("vegetable") ||
    hasWord("vegetables") ||
    rawLower.includes("সবজি")
  )
    return Vegetables;

  // 10. Snacks & Packaged Food
  if (
    hasWord("chip") ||
    hasWord("chips") ||
    hasWord("crisp") ||
    hasWord("nacho")
  )
    return Chips;
  if (
    hasWord("noodle") ||
    hasWord("noodles") ||
    hasWord("pasta") ||
    hasWord("macaroni") ||
    hasWord("maggi") ||
    hasWord("ramen")
  )
    return Noodles;
  if (hasWord("honey") || rawLower.includes("মধু")) return Honey;
  if (hasWord("jam") || hasWord("jelly")) return Jam;
  if (hasWord("pickle") || hasWord("pickles") || rawLower.includes("আচার"))
    return Pickles;
  if (hasWord("sauce") || hasWord("sauces") || hasWord("ketchup"))
    return Sauces;

  // Ancestor / Parent Check
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
  const children = categories.filter((item) => item.parentId === category.id);

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
            <ChevronDown size={15} className="shrink-0 text-slate-400" />
          ) : (
            <ChevronRight size={15} className="shrink-0 text-slate-400" />
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
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

        const response = await fetch(`${API_BASE_URL}/api/categories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || data?.message || "Failed to load categories.",
          );
        }

        const categoryList = Array.isArray(data?.data) ? data.data : [];

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

    return categories.find((category) => category.id === form.categoryId);
  }, [categories, form.categoryId]);

  const getAncestorIds = (categoryId: string) => {
    const ancestorIds: string[] = [];

    let current = categories.find((category) => category.id === categoryId);

    while (current?.parentId) {
      ancestorIds.push(current.parentId);

      const parentId = current.parentId;

      current = categories.find((category) => category.id === parentId);
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
      prev.filter((id) => id !== category.id && !descendantIds.includes(id)),
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
            onChange={(event) => onTitleChange(event.target.value)}
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
            onChange={(event) => onFieldChange("slug", event.target.value)}
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
            onChange={(event) => onFieldChange("sku", event.target.value)}
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
              onFieldChange("shortDescription", event.target.value)
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
            onChange={(value: string) => onFieldChange("description", value)}
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
            <span>{selectedCategory?.name || "Select product category"}</span>

            {isCategoryOpen ? (
              <ChevronDown size={16} className="text-slate-400" />
            ) : (
              <ChevronRight size={16} className="text-slate-400" />
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
                categoryName={selectedCategory?.name ?? ""}
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
                couponEnabled ? "bg-[#D6A419]" : "bg-slate-300"
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
                      event.target.value.toUpperCase().replace(/\s+/g, ""),
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
                  onChange={(event) => setCouponDiscount(event.target.value)}
                  placeholder="e.g. 50"
                  required={couponEnabled}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
                />

                <p className="mt-2 text-[11px] text-slate-500">
                  Enter the fixed discount amount in Taka.
                </p>
              </div>

              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-slate-500">Coupon Preview</p>

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
