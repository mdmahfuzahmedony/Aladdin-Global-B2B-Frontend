"use client";

export interface FruitsData {
  fruitType?: string;
  variety?: string;
  ripeness?: string;
  taste?: string;
  seedType?: string;
  organic?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: FruitsData;
  onChange: (value: FruitsData) => void;
}

export default function Fruits({ value, onChange }: Props) {
  const update = (key: keyof FruitsData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Fruits Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Fruit Type" value={value.fruitType}
            onChange={(v) => update("fruitType", v)}
            options={['Mango', 'Apple', 'Banana', 'Orange', 'Guava', 'Papaya', 'Pineapple', 'Watermelon', 'Grapes', 'Other']} />
          <Input label="Variety" value={value.variety}
            onChange={(v) => update("variety", v)} />
          <Select label="Ripeness" value={value.ripeness}
            onChange={(v) => update("ripeness", v)}
            options={['Unripe', 'Semi-Ripe', 'Ripe']} />
          <Select label="Taste" value={value.taste}
            onChange={(v) => update("taste", v)}
            options={['Sweet', 'Sour', 'Sweet & Sour']} />
          <Select label="Seed Type" value={value.seedType}
            onChange={(v) => update("seedType", v)}
            options={['Seedless', 'With Seeds']} />
          <Select label="Organic" value={value.organic}
            onChange={(v) => update("organic", v)}
            options={['Yes', 'No']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature', 'Refrigerated']} />
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
