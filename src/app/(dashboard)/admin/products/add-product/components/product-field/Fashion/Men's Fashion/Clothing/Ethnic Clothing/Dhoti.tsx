"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "../FashionFieldForm";

export const fashionCategoryName = "Dhoti";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, silk, cotton-silk" },
  { key: "length", label: "Dhoti Length", placeholder: "Enter length" },
  { key: "waistSize", label: "Waist Size", placeholder: "Enter waist size" },
  { key: "style", label: "Style / Drape", placeholder: "e.g. traditional, ready-to-wear" },
  { key: "borderDesign", label: "Border / Design", placeholder: "Describe the border or design" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. religious, wedding, festive" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}