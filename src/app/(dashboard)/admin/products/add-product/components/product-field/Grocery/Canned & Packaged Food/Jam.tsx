"use client";

export interface JamData {
  fruitType?: string;
  jamType?: string;
  sugarLevel?: string;
  texture?: string;
  seedContent?: string;
  flavor?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: JamData;
  onChange: (value: JamData) => void;
}

export default function Jam({ value, onChange }: Props) {
  const update = (key: keyof JamData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Jam Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add jam-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Fruit Type" value={value.fruitType}
            onChange={(v) => update("fruitType", v)}
            options={['Strawberry', 'Mango', 'Mixed Fruit', 'Orange', 'Guava', 'Pineapple', 'Other']} />
          <Select label="Jam Type" value={value.jamType}
            onChange={(v) => update("jamType", v)}
            options={['Jam', 'Fruit Spread', 'Marmalade', 'Preserve']} />
          <Select label="Sugar Level" value={value.sugarLevel}
            onChange={(v) => update("sugarLevel", v)}
            options={['Regular', 'Low Sugar', 'Sugar-Free']} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Smooth', 'Chunky', 'With Fruit Pieces']} />
          <Select label="Seed Content" value={value.seedContent}
            onChange={(v) => update("seedContent", v)}
            options={['Seedless', 'Contains Seeds']} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature Before Opening', 'Refrigerated After Opening']} />
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
