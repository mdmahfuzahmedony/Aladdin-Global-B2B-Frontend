"use client";

export interface SunflowerOilData {
  oilType?: string;
  processingMethod?: string;
  purity?: string;
  color?: string;
  flavor?: string;
  transFat?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: SunflowerOilData;
  onChange: (value: SunflowerOilData) => void;
}

export default function SunflowerOil({ value, onChange }: Props) {
  const update = (key: keyof SunflowerOilData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Sunflower Oil Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Sunflower Oil Type" value={value.oilType}
            onChange={(v) => update("oilType", v)}
            options={['Refined Sunflower Oil', 'High Oleic Sunflower Oil', 'Pure Sunflower Oil']} />
          <Select label="Processing Method" value={value.processingMethod}
            onChange={(v) => update("processingMethod", v)}
            options={['Refined', 'Filtered', 'Cold Processed']} />
          <Select label="Purity" value={value.purity}
            onChange={(v) => update("purity", v)}
            options={['Pure', 'Blended']} />
          <Select label="Color" value={value.color}
            onChange={(v) => update("color", v)}
            options={['Light Yellow', 'Golden']} />
          <Select label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)}
            options={['Neutral', 'Mild']} />
          <Select label="Trans Fat" value={value.transFat}
            onChange={(v) => update("transFat", v)}
            options={['0g', 'Low', 'Not Specified']} />
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
