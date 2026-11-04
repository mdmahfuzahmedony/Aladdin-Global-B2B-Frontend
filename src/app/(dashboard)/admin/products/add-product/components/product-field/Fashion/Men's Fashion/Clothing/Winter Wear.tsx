"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Winter Wear";

const fields: FashionFieldDefinition[] = [
  { key: "garmentType", label: "Garment Type", placeholder: "e.g. thermal wear, fleece, winter jacket" },
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "material", label: "Fabric / Material", placeholder: "e.g. wool, fleece, thermal knit" },
  { key: "lining", label: "Lining / Insulation", placeholder: "Enter lining or insulation details" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, regular, relaxed" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "features", label: "Warmth / Features", placeholder: "e.g. thermal, wind-resistant, insulated" },
  { key: "season", label: "Season", placeholder: "e.g. mild winter, cold winter" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}