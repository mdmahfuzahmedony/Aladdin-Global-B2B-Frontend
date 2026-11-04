"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Polo Shirts";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton piqué, jersey, blended fabric" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, regular, relaxed" },
  { key: "collarStyle", label: "Collar Style", placeholder: "e.g. ribbed polo collar" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. short sleeve, long sleeve" },
  { key: "placket", label: "Placket / Buttons", placeholder: "Enter placket or button details" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "pattern", label: "Pattern", placeholder: "e.g. solid, striped, color block" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}