"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Sweaters & Hoodies";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "material", label: "Fabric / Material", placeholder: "e.g. wool, cotton, fleece" },
  { key: "style", label: "Style", placeholder: "e.g. pullover, zip-up, cardigan" },
  { key: "fit", label: "Fit", placeholder: "e.g. regular, slim, relaxed" },
  { key: "hood", label: "Hood", placeholder: "e.g. hooded, no hood" },
  { key: "closure", label: "Closure", placeholder: "e.g. pullover, zip, buttons" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "pattern", label: "Pattern / Knit", placeholder: "e.g. solid, cable knit, color block" },
  { key: "season", label: "Season", placeholder: "e.g. autumn, winter" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}