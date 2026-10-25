"use client";

export interface GheeData {
  gheeType?: string;
  source?: string;
  fatContent?: string;
  purity?: string;
  flavor?: string;
  texture?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: GheeData;
  onChange: (value: GheeData) => void;
}

export default function Ghee({ value, onChange }: Props) {
  const update = (key: keyof GheeData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Ghee Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Ghee Type" value={value.gheeType}
            onChange={(v) => update("gheeType", v)}
            options={['Cow Ghee', 'Buffalo Ghee', 'Mixed Ghee', 'Organic Ghee', 'Desi Ghee', 'Other']} />
          <Select label="Milk Source" value={value.source}
            onChange={(v) => update("source", v)}
            options={['Cow Milk', 'Buffalo Milk', 'Mixed Milk']} />
          <Select label="Fat Content" value={value.fatContent}
            onChange={(v) => update("fatContent", v)}
            options={['Regular', 'High Fat']} />
          <Select label="Purity" value={value.purity}
            onChange={(v) => update("purity", v)}
            options={['Pure', 'Blended']} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Liquid', 'Semi-Solid', 'Solid']} />
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
