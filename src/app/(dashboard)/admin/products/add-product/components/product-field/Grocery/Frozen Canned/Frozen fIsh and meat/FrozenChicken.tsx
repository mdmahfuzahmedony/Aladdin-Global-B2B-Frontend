"use client";

export interface FrozenChickenData {
  chickenType?: string;
  cutType?: string;
  marinated?: string;
  coating?: string;
  preparation?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: FrozenChickenData;
  onChange: (value: FrozenChickenData) => void;
}

export default function FrozenChicken({ value, onChange }: Props) {
  const update = (key: keyof FrozenChickenData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Frozen Chicken Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Chicken Type" value={value.chickenType}
            onChange={(v) => update("chickenType", v)}
            options={['Whole Chicken', 'Chicken Breast', 'Chicken Leg', 'Chicken Wings', 'Chicken Thigh', 'Chicken Drumstick', 'Other']} />
          <Select label="Cut Type" value={value.cutType}
            onChange={(v) => update("cutType", v)}
            options={['Whole', 'Fillet', 'Pieces', 'Boneless', 'Bone-In']} />
          <Select label="Marinated" value={value.marinated}
            onChange={(v) => update("marinated", v)}
            options={['Yes', 'No']} />
          <Select label="Coating" value={value.coating}
            onChange={(v) => update("coating", v)}
            options={['None', 'Breaded', 'Crispy Coating', 'Spiced Coating']} />
          <Select label="Preparation" value={value.preparation}
            onChange={(v) => update("preparation", v)}
            options={['Raw', 'Ready to Cook', 'Pre-Cooked']} />
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
