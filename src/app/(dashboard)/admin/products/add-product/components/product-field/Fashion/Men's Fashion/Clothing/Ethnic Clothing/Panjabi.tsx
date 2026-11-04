"use client";

import { FashionFieldForm, type FashionFieldDefinition, type FashionFieldProps } from "../FashionFieldForm";

export const fashionCategoryName = "Panjabi";

const fields: FashionFieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "fabric", label: "Fabric", placeholder: "e.g. cotton, silk, linen" },
  { key: "fit", label: "Fit", placeholder: "e.g. regular, slim, relaxed" },
  { key: "neckline", label: "Neckline / Collar", placeholder: "e.g. band collar, placket neckline" },
  { key: "sleeveLength", label: "Sleeve Length", placeholder: "e.g. full sleeve, three-quarter sleeve" },
  { key: "embellishment", label: "Embroidery / Detail", placeholder: "Describe embroidery or other details" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "occasion", label: "Occasion", placeholder: "e.g. casual, wedding, festive" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return <FashionFieldForm fields={fields} value={value} onChange={onChange} />;
}