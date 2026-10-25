"use client";

export interface FrozenSnacksData {
  snackType?: string;
  filling?: string;
  coating?: string;
  spiceLevel?: string;
  cookingMethod?: string;
  preparation?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: FrozenSnacksData;
  onChange: (value: FrozenSnacksData) => void;
}

export default function FrozenSnacks({ value, onChange }: Props) {
  const update = (key: keyof FrozenSnacksData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Frozen Snacks Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Snack Type" value={value.snackType}
            onChange={(v) => update("snackType", v)}
            options={['Nuggets', 'Samosa', 'Spring Roll', 'French Fries', 'Hash Brown', 'Chicken Popcorn', 'Paratha', 'Other']} />
          <Select label="Filling" value={value.filling}
            onChange={(v) => update("filling", v)}
            options={['None', 'Chicken', 'Beef', 'Vegetable', 'Cheese', 'Mixed', 'Other']} />
          <Select label="Coating" value={value.coating}
            onChange={(v) => update("coating", v)}
            options={['None', 'Breaded', 'Crispy', 'Spiced']} />
          <Select label="Spice Level" value={value.spiceLevel}
            onChange={(v) => update("spiceLevel", v)}
            options={['Mild', 'Medium', 'Hot', 'Extra Hot']} />
          <Select label="Cooking Method" value={value.cookingMethod}
            onChange={(v) => update("cookingMethod", v)}
            options={['Deep Fry', 'Air Fry', 'Oven', 'Pan Fry']} />
          <Select label="Preparation" value={value.preparation}
            onChange={(v) => update("preparation", v)}
            options={['Ready to Cook', 'Pre-Cooked']} />
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
