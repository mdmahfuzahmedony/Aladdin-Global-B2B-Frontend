"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "../FashionFieldForm";

export const fashionCategoryName = "Pajama";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, silk, blended fabric" },
  { key: "fit", label: "Fit", placeholder: "e.g. regular, relaxed" },
  { key: "waistband", label: "Waistband", placeholder: "e.g. elastic, drawstring" },
  { key: "closure", label: "Closure", placeholder: "e.g. drawstring, button fly" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "setIncludes", label: "Set Includes", placeholder: "e.g. pajama only, top and pajama" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. sleepwear, casual, traditional" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}