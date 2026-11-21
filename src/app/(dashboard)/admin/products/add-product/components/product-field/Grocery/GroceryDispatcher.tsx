"use client";

import { useMemo } from "react";
import GroceryCategoryField from "./GroceryCategoryField";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function GroceryDispatcher({
  value = {},
  onChange,
  categoryName = "Grocery & Food Items",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  const initialGroup = useMemo(() => {
    // 1. Beverages
    if (
      catLower.includes("beverage") ||
      catLower.includes("drink") ||
      catLower.includes("tea") ||
      catLower.includes("coffee") ||
      catLower.includes("juice") ||
      catLower.includes("water") ||
      catLower.includes("পানীয়") ||
      catLower.includes("চা") ||
      catLower.includes("কফি") ||
      catLower.includes("জুস")
    ) {
      return "BEVERAGES";
    }

    // 2. Bakery & Snacks
    if (
      catLower.includes("bakery") ||
      catLower.includes("biscuit") ||
      catLower.includes("cake") ||
      catLower.includes("bread") ||
      catLower.includes("snack") ||
      catLower.includes("chips") ||
      catLower.includes("noodle") ||
      catLower.includes("pasta") ||
      catLower.includes("chocolate") ||
      catLower.includes("sweet") ||
      catLower.includes("confection") ||
      catLower.includes("toast") ||
      catLower.includes("jam") ||
      catLower.includes("বেকারি") ||
      catLower.includes("স্ন্যাকস") ||
      catLower.includes("বিস্কুট")
    ) {
      return "BAKERY";
    }

    // 3. Dairy, Meat, Fish, Fresh Produce
    if (
      catLower.includes("dairy") ||
      catLower.includes("milk") ||
      catLower.includes("egg") ||
      catLower.includes("meat") ||
      catLower.includes("fish") ||
      catLower.includes("poultry") ||
      catLower.includes("chicken") ||
      catLower.includes("beef") ||
      catLower.includes("vegetable") ||
      catLower.includes("fruit") ||
      catLower.includes("দুধ") ||
      catLower.includes("ডিম") ||
      catLower.includes("মাছ") ||
      catLower.includes("মাংস") ||
      catLower.includes("শাকসবজি") ||
      catLower.includes("ফল")
    ) {
      return "FRESH_DAIRY";
    }

    // 4. Frozen & Canned
    if (
      catLower.includes("frozen") ||
      catLower.includes("canned") ||
      catLower.includes("হিমায়িত") ||
      catLower.includes("টিনজাত") ||
      catLower.includes("পরোটা")
    ) {
      return "FROZEN_CANNED";
    }

    // 5. Household & Pet Care
    if (
      catLower.includes("household") ||
      catLower.includes("laundry") ||
      catLower.includes("clean") ||
      catLower.includes("toilet") ||
      catLower.includes("tissue") ||
      catLower.includes("pet") ||
      catLower.includes("ক্লিনিং") ||
      catLower.includes("লন্ড্রি") ||
      catLower.includes("পেট")
    ) {
      return "HOUSEHOLD";
    }

    // Default: Cooking & Essentials (চাল, ডাল, তেল, চিনি, মসলা, আটা)
    return "COOKING";
  }, [catLower]);

  return (
    <GroceryCategoryField
      value={value}
      onChange={onChange}
      categoryName={categoryName}
      initialGroup={initialGroup}
    />
  );
}
