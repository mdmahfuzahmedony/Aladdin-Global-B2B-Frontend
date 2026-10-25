"use client";

export interface MaidaData {
  maidaType?: string;
  flourGrade?: string;
  texture?: string;
  proteinContent?: string;
  bleached?: string;
  usageType?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: MaidaData;
  onChange: (value: MaidaData) => void;
}

export default function Maida({ value, onChange }: Props) {
  const update = (key: keyof MaidaData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Maida Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Maida Type" value={value.maidaType}
            onChange={(v) => update("maidaType", v)}
            options={['Regular Maida', 'Premium Maida', 'Bakery Maida', 'All-Purpose Flour']} />
          <Select label="Flour Grade" value={value.flourGrade}
            onChange={(v) => update("flourGrade", v)}
            options={['Standard', 'Premium', 'Extra Fine']} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Fine', 'Extra Fine']} />
          <Input label="Protein Content" value={value.proteinContent}
            onChange={(v) => update("proteinContent", v)} />
          <Select label="Bleached" value={value.bleached}
            onChange={(v) => update("bleached", v)}
            options={['Yes', 'No']} />
          <Select label="Usage Type" value={value.usageType}
            onChange={(v) => update("usageType", v)}
            options={['Bakery', 'Cake', 'Bread', 'Pastry', 'General Cooking']} />
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
