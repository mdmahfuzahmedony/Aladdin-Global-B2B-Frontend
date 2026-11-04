"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "T-Shirts";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, jersey, blended fabric" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, regular, oversized" },
  { key: "neckline", label: "Neckline", placeholder: "e.g. crew neck, V-neck, Henley" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. short sleeve, long sleeve" },
  { key: "printStyle", label: "Print / Design", placeholder: "e.g. plain, graphic, logo" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. casual, sportswear, everyday" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}