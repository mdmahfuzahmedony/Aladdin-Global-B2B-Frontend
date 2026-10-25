"use client";

export interface LeafyGreensData {
  greenType?: string;
  variety?: string;
  freshness?: string;
  color?: string;
  organic?: string;
  washed?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: LeafyGreensData;
  onChange: (value: LeafyGreensData) => void;
}

export default function LeafyGreens({ value, onChange }: Props) {
  const update = (key: keyof LeafyGreensData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Leafy Greens Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Green Type" value={value.greenType}
            onChange={(v) => update("greenType", v)}
            options={['Spinach', 'Lettuce', 'Coriander', 'Mint', 'Kale', 'Water Spinach', 'Mustard Greens', 'Other']} />
          <Input label="Variety" value={value.variety}
            onChange={(v) => update("variety", v)} />
          <Select label="Freshness" value={value.freshness}
            onChange={(v) => update("freshness", v)}
            options={['Fresh', 'Very Fresh']} />
          <Input label="Color" value={value.color}
            onChange={(v) => update("color", v)} />
          <Select label="Organic" value={value.organic}
            onChange={(v) => update("organic", v)}
            options={['Yes', 'No']} />
          <Select label="Washed" value={value.washed}
            onChange={(v) => update("washed", v)}
            options={['Washed', 'Unwashed']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Refrigerated', 'Room Temperature']} />
          <Input label="Shelf Life" value={value.shelfLife}
            onChange={(v) => update("shelfLife", v)} />
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void; }) {
  return (<div>
    <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
    <input value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
  </div>);
}

function Select({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (value: string) => void; }) {
  return (<div>
    <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500">
      <option value="">Select {label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>);
}
