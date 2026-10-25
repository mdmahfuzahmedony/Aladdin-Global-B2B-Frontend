"use client";

export interface HoneyData {
  honeyType?: string;
  floralSource?: string;
  color?: string;
  consistency?: string;
  processing?: string;
  flavor?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: HoneyData;
  onChange: (value: HoneyData) => void;
}

export default function Honey({ value, onChange }: Props) {
  const update = (key: keyof HoneyData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Honey Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add honey-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Honey Type" value={value.honeyType}
            onChange={(v) => update("honeyType", v)}
            options={['Pure Honey', 'Raw Honey', 'Processed Honey', 'Organic Honey', 'Mixed Flower Honey', 'Other']} />
          <Input label="Floral Source" value={value.floralSource}
            onChange={(v) => update("floralSource", v)} />
          <Select label="Color" value={value.color}
            onChange={(v) => update("color", v)}
            options={['Light', 'Golden', 'Amber', 'Dark']} />
          <Select label="Consistency" value={value.consistency}
            onChange={(v) => update("consistency", v)}
            options={['Liquid', 'Thick', 'Creamed', 'Crystallized']} />
          <Select label="Processing" value={value.processing}
            onChange={(v) => update("processing", v)}
            options={['Raw', 'Filtered', 'Pasteurized']} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
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
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      />
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
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
