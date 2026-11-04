"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Formal Shirts";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, oxford cloth, blended fabric" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, regular, tailored" },
  { key: "collarStyle", label: "Collar Style", placeholder: "e.g. spread, cutaway, button-down" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. long sleeve, short sleeve" },
  { key: "cuffStyle", label: "Cuff Style", placeholder: "e.g. button cuff, French cuff" },
  { key: "pattern", label: "Pattern", placeholder: "e.g. solid, striped, checked" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. office, business, formal" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}