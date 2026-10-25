"use client";

export interface DalData {
  dalType?: string;
  variety?: string;
  processing?: string;
  color?: string;
  origin?: string;
  cookingTime?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: DalData;
  onChange: (value: DalData) => void;
}

export default function Dal({ value, onChange }: Props) {
  const update = (key: keyof DalData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Dal Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Dal Type" value={value.dalType}
            onChange={(v) => update("dalType", v)}
            options={['Masoor Dal', 'Moong Dal', 'Chana Dal', 'Matar Dal', 'Arhar Dal', 'Urad Dal', 'Mixed Dal', 'Other']} />
          <Input label="Variety" value={value.variety}
            onChange={(v) => update("variety", v)} />
          <Select label="Processing" value={value.processing}
            onChange={(v) => update("processing", v)}
            options={['Whole', 'Split', 'Polished', 'Unpolished']} />
          <Input label="Color" value={value.color}
            onChange={(v) => update("color", v)} />
          <Input label="Origin" value={value.origin}
            onChange={(v) => update("origin", v)} />
          <Select label="Cooking Time" value={value.cookingTime}
            onChange={(v) => update("cookingTime", v)}
            options={['Quick Cooking', 'Regular', 'Slow Cooking']} />
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
