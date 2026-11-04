"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Sports Clothing";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "sport", label: "Sport / Activity", placeholder: "e.g. running, football, training" },
  { key: "garmentType", label: "Garment Type", placeholder: "e.g. jersey, shorts, tracksuit" },
  { key: "fabric", label: "Fabric / Material", placeholder: "Enter fabric or material" },
  { key: "fit", label: "Fit", placeholder: "e.g. compression, regular, relaxed" },
  { key: "technology", label: "Fabric Technology", placeholder: "e.g. moisture-wicking, quick-dry" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "setIncludes", label: "Set Includes", placeholder: "Enter included pieces, if applicable" },
  { key: "season", label: "Season", placeholder: "e.g. all-season, summer, winter" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}