"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Raincoats";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "material", label: "Material", placeholder: "e.g. PVC, polyester, coated fabric" },
  { key: "waterproofRating", label: "Waterproof Rating", placeholder: "Enter rating or waterproof specification" },
  { key: "style", label: "Style", placeholder: "e.g. jacket, long coat, poncho" },
  { key: "closure", label: "Closure", placeholder: "e.g. zip, buttons, snap fasteners" },
  { key: "hood", label: "Hood", placeholder: "e.g. attached, detachable, no hood" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "features", label: "Additional Features", placeholder: "e.g. taped seams, reflective trim" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}