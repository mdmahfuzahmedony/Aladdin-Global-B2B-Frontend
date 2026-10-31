"use client";

type FashionFieldProps = {
  categoryName?: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

type FieldDefinition = { key: string; label: string; placeholder: string };

export const fashionCategoryName = "Sneakers";

const fields: FieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "material", label: "Upper Material", placeholder: "e.g. leather, canvas" },
  { key: "shoeType", label: "Footwear Style", placeholder: "e.g. Sneakers" },
  { key: "size", label: "Available Sizes", placeholder: "Enter sizes" },
  { key: "soleMaterial", label: "Sole Material", placeholder: "Enter sole material" },
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
