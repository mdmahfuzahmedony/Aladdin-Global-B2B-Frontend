"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Jackets & Coats";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "outerMaterial", label: "Outer Material", placeholder: "e.g. leather, denim, polyester" },
  { key: "liningMaterial", label: "Lining Material", placeholder: "Enter lining material" },
  { key: "style", label: "Jacket / Coat Style", placeholder: "e.g. bomber, parka, blazer" },
  { key: "fit", label: "Fit", placeholder: "e.g. regular, slim, relaxed" },
  { key: "closure", label: "Closure", placeholder: "e.g. zip, buttons, snap buttons" },
  { key: "hood", label: "Hood", placeholder: "e.g. attached, detachable, no hood" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "season", label: "Season", placeholder: "e.g. spring, autumn, winter" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}