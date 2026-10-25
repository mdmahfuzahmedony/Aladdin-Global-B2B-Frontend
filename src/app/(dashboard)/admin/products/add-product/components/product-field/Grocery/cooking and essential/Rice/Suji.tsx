"use client";

export interface SujiData {
  sujiType?: string;
  grainSource?: string;
  texture?: string;
  color?: string;
  usageType?: string;
  processing?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: SujiData;
  onChange: (value: SujiData) => void;
}

export default function Suji({ value, onChange }: Props) {
  const update = (key: keyof SujiData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Suji Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Suji Type" value={value.sujiType}
            onChange={(v) => update("sujiType", v)}
            options={['Regular Suji', 'Fine Suji', 'Coarse Suji', 'Semolina']} />
          <Select label="Grain Source" value={value.grainSource}
            onChange={(v) => update("grainSource", v)}
            options={['Wheat', 'Durum Wheat', 'Other']} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Fine', 'Medium', 'Coarse']} />
          <Select label="Color" value={value.color}
            onChange={(v) => update("color", v)}
            options={['White', 'Cream', 'Light Yellow']} />
          <Select label="Usage Type" value={value.usageType}
            onChange={(v) => update("usageType", v)}
            options={['Halwa', 'Upma', 'Dessert', 'Baking', 'General Cooking']} />
          <Select label="Processing" value={value.processing}
            onChange={(v) => update("processing", v)}
            options={['Refined', 'Unrefined']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature', 'Cool & Dry']} />
          <Input label="Shelf Life" value={value.shelfLife}
            onChange={(v) => update("shelfLife", v)} />
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange }: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
    </div>
  );
}

function Select({ label, value, options, onChange }: {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500">
        <option value="">Select {label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}
