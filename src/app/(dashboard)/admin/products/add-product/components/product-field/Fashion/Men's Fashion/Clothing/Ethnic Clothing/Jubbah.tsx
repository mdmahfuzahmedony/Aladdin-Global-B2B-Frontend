"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "../FashionFieldForm";

export const fashionCategoryName = "Jubbah";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, linen, blended fabric" },
  { key: "fit", label: "Fit", placeholder: "e.g. regular, relaxed" },
  { key: "length", label: "Garment Length", placeholder: "Enter garment length" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. short sleeve, long sleeve" },
  { key: "closure", label: "Closure", placeholder: "e.g. buttons, pullover" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. everyday, prayer, formal" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}