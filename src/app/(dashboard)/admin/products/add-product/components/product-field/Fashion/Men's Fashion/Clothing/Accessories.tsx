"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "./FashionFieldForm";

export const fashionCategoryName = "Accessories";

const fields: FashionFieldDefinition[] = [
  { key: "accessoryType", label: "Accessory Type", placeholder: "e.g. tie, scarf, pocket square" },
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "material", label: "Material", placeholder: "e.g. cotton, leather, metal" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "pattern", label: "Pattern / Design", placeholder: "e.g. solid, striped, printed" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. casual, formal, festive" },
  { key: "size", label: "Size / Dimensions", placeholder: "Enter size or dimensions" },
  { key: "packQuantity", label: "Pack Quantity", placeholder: "Enter number of pieces" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}