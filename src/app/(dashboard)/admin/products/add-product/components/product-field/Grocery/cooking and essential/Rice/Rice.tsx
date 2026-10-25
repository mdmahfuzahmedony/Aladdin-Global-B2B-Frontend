"use client";

export interface RiceData {
  riceType?: string;
  grainSize?: string;
  processing?: string;
  aroma?: string;
  brokenPercentage?: string;
  origin?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: RiceData;
  onChange: (value: RiceData) => void;
}

export default function Rice({ value, onChange }: Props) {
  const update = (key: keyof RiceData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Rice Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Rice Type" value={value.riceType}
            onChange={(v) => update("riceType", v)}
            options={['Basmati', 'Miniket', 'Chinigura', 'Nazirshail', 'Aman', 'Boro', 'Parboiled', 'Other']} />
          <Select label="Grain Size" value={value.grainSize}
            onChange={(v) => update("grainSize", v)}
            options={['Short Grain', 'Medium Grain', 'Long Grain', 'Extra Long Grain']} />
          <Select label="Processing" value={value.processing}
            onChange={(v) => update("processing", v)}
            options={['White Rice', 'Brown Rice', 'Parboiled', 'Polished', 'Unpolished']} />
          <Select label="Aroma" value={value.aroma}
            onChange={(v) => update("aroma", v)}
            options={['Aromatic', 'Regular']} />
          <Select label="Broken Rice" value={value.brokenPercentage}
            onChange={(v) => update("brokenPercentage", v)}
            options={['0%', '5%', '10%', '25%', 'Not Specified']} />
          <Input label="Origin" value={value.origin}
            onChange={(v) => update("origin", v)} />
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
