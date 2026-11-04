"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Casual Shirts";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric / Material", placeholder: "e.g. cotton, linen, denim" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, regular, relaxed" },
  { key: "collarStyle", label: "Collar Style", placeholder: "e.g. button-down, spread" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. short sleeve, long sleeve" },
  { key: "pattern", label: "Pattern", placeholder: "e.g. solid, checked, striped" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. casual, weekend, smart casual" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}