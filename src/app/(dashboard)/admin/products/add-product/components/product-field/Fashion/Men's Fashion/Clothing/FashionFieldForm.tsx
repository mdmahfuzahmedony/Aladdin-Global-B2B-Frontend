"use client";

export type FashionFieldProps = {
  categoryName?: string;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

export type FashionFieldDefinition = {
  key: string;
  label: string;
  placeholder: string;
};

type FashionFieldFormProps = FashionFieldProps & {
  fields: FashionFieldDefinition[];
};

export function FashionFieldForm({ fields, value, onChange }: FashionFieldFormProps) {
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
