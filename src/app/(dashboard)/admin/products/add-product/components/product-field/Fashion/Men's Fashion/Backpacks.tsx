"use client";

type FashionFieldProps = {
  categoryName?: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

type FieldDefinition = { key: string; label: string; placeholder: string };

export const fashionCategoryName = "Backpacks and Bags";

const fields: FieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "bagType", label: "Bag Type", placeholder: "e.g. Backpacks and Bags" },
  { key: "material", label: "Material", placeholder: "e.g. canvas, leather" },
  { key: "capacity", label: "Capacity", placeholder: "Enter capacity" },
  { key: "compartments", label: "Compartments", placeholder: "Enter number of compartments" },
  { key: "dimensions", label: "Dimensions", placeholder: "Enter dimensions" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
];

export default function FashionCategoryField({ value, onChange }: FashionFieldProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <label key={field.key} className="block text-xs font-semibold text-slate-700">
          {field.label}
          <input
            type="text"
            value={String(value[field.key] ?? "")}
            onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
            placeholder={field.placeholder}
            className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
          />
        </label>
      ))}
    </div>
  );
}
