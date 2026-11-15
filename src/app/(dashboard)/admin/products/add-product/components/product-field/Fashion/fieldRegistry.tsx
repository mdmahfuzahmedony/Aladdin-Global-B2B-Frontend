import type { ComponentType } from "react";
import FashionCategoryField from "./FashionCategoryField";

export { FashionCategoryField };

export function getFashionFieldComponent(
  categoryName: string,
  parentNames: string[] = [],
): ComponentType<any> | null {
  const combined = [categoryName, ...parentNames].join(" ").toLowerCase();

  // If it's related to fashion, return the unified FashionCategoryField
  if (
    combined.includes("fashion") ||
    combined.includes("cloth") ||
    combined.includes("wear") ||
    combined.includes("shirt") ||
    combined.includes("pant") ||
    combined.includes("jean") ||
    combined.includes("panjabi") ||
    combined.includes("saree") ||
    combined.includes("dress") ||
    combined.includes("footwear") ||
    combined.includes("shoe") ||
    combined.includes("sandal") ||
    combined.includes("sneaker") ||
    combined.includes("boot") ||
    combined.includes("heel") ||
    combined.includes("bag") ||
    combined.includes("wallet") ||
    combined.includes("belt") ||
    combined.includes("watch") ||
    combined.includes("jewel") ||
    combined.includes("sunglass")
  ) {
    return FashionCategoryField;
  }

  // Fallback: If it's called from fashion tree, return FashionCategoryField
  return FashionCategoryField;
}
