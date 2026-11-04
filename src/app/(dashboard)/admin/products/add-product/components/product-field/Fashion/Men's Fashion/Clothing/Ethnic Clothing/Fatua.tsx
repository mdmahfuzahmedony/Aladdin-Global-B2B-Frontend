"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "../FashionFieldForm";

export const fashionCategoryName = "Fatua";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, linen, blended fabric" },
  { key: "fit", label: "Fit", placeholder: "e.g. regular, relaxed" },
  { key: "neckline", label: "Neckline / Collar", placeholder: "Describe the neckline or collar" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. short sleeve, long sleeve" },
  { key: "pattern", label: "Pattern / Embellishment", placeholder: "e.g. solid, printed, embroidered" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. casual, festive, prayer" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}