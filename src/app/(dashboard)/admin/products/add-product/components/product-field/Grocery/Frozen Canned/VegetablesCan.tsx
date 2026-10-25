"use client";

export interface FrozenVegetablesData {
  vegetableType?: string;
  cutType?: string;
  mixType?: string;
  blanched?: string;
  preparation?: string;
  organic?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: FrozenVegetablesData;
  onChange: (value: FrozenVegetablesData) => void;
}

export default function FrozenVegetables({ value, onChange }: Props) {
  const update = (key: keyof FrozenVegetablesData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Frozen Vegetables Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Vegetable Type" value={value.vegetableType}
            onChange={(v) => update("vegetableType", v)}
            options={['Peas', 'Corn', 'Carrot', 'Green Beans', 'Broccoli', 'Cauliflower', 'Spinach', 'Mixed Vegetables', 'Other']} />
          <Select label="Cut Type" value={value.cutType}
            onChange={(v) => update("cutType", v)}
            options={['Whole', 'Sliced', 'Diced', 'Chopped']} />
          <Select label="Mix Type" value={value.mixType}
            onChange={(v) => update("mixType", v)}
            options={['Single Vegetable', 'Mixed Vegetables']} />
          <Select label="Blanched" value={value.blanched}
            onChange={(v) => update("blanched", v)}
            options={['Yes', 'No']} />
          <Select label="Preparation" value={value.preparation}
            onChange={(v) => update("preparation", v)}
            options={['Raw Frozen', 'Ready to Cook']} />
          <Select label="Organic" value={value.organic}
            onChange={(v) => update("organic", v)}
            options={['Yes', 'No']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Keep Frozen']} />
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
