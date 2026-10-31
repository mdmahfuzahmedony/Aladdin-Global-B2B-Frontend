"use client";

export interface CleaningData {
  brand?: string;
  netWeight?: string;
  packagingType?: string;
  productType?: string;
  countryOfOrigin?: string;
}

interface Props {
  value?: CleaningData;
  onChange: (value: CleaningData) => void;
  categoryName?: string;
}

export default function Cleaning({ value = {}, onChange }: Props) {
  const update = (key: keyof CleaningData, v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Cleaning & Household Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product details for this item.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Brand"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            placeholder="e.g. Pran, ACI, Square, Bashundhara"
          />
          <Input
            label="Net Weight / Volume"
            value={value.netWeight}
            onChange={(v) => update("netWeight", v)}
            placeholder="e.g. 500g, 1kg, 250ml"
          />
          <Select
            label="Cleaning Type"
            value={value.productType}
            onChange={(v) => update("productType", v)}
            options={["Floor Cleaner","Toilet Cleaner","Dish Cleaner","Glass Cleaner","All-Purpose Cleaner","Other"]}
          />
          <Select
            label="Packaging Type"
            value={value.packagingType}
            onChange={(v) => update("packagingType", v)}
            options={[
              "Packet / Pouch",
              "Bottle",
              "Jar / Tin",
              "Box / Carton",
              "Sachet",
              "Cup / Bowl",
              "Loose / Open",
            ]}
          />
          <Select
            label="Country of Origin"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            options={[
              "Bangladesh",
              "India",
              "China",
              "Malaysia",
              "Thailand",
              "USA",
              "Other",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-slate-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-slate-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
