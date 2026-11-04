"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Blazers & Suits";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric / Material", placeholder: "e.g. wool, cotton, polyester blend" },
  { key: "fit", label: "Fit", placeholder: "e.g. slim, regular, tailored" },
  { key: "setIncludes", label: "Set Includes", placeholder: "e.g. blazer, trousers, waistcoat" },
  { key: "jacketSize", label: "Jacket Size", placeholder: "Enter jacket size" },
  { key: "trouserSize", label: "Trouser Size", placeholder: "Enter trouser size" },
  { key: "pattern", label: "Pattern", placeholder: "e.g. solid, pinstripe, checked" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. business, wedding, formal" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}