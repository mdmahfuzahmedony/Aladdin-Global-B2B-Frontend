"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Jeans";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "denimFabric", label: "Denim / Fabric", placeholder: "e.g. cotton denim, stretch denim" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, straight, relaxed, tapered" },
  { key: "waistSize", label: "Waist Size", placeholder: "Enter waist sizes" },
  { key: "length", label: "Inseam / Length", placeholder: "Enter inseam or length" },
  { key: "rise", label: "Rise", placeholder: "e.g. low, mid, high rise" },
  { key: "wash", label: "Wash / Finish", placeholder: "e.g. dark wash, faded, distressed" },
  { key: "closure", label: "Closure", placeholder: "e.g. button and zip, drawstring" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}