"use client";

type FashionFieldProps = {
  categoryName?: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

type FieldDefinition = { key: string; label: string; placeholder: string };

export const fashionCategoryName = "Rings";

const fields: FieldDefinition[] = [
  { key: "brand", label: "Brand", placeholder: "Enter brand" },
  { key: "material", label: "Material", placeholder: "e.g. gold, sterling silver" },
  { key: "design", label: "Design / Style", placeholder: "Enter Rings design" },
  { key: "ringSize", label: "Ring Size", placeholder: "Enter available sizes" },
  { key: "gemstone", label: "Gemstone / Detail", placeholder: "Enter gemstone or detail" },
  { key: "color", label: "Available Colors", placeholder: "Enter colors" },
  { key: "ageRange", label: "Age Range", placeholder: "e.g. 2-4 years" },
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
