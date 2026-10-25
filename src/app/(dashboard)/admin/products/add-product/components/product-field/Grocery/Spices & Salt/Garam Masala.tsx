"use client";

export interface GaramMasalaData {
  masalaType?: string;
  form?: string;
  spiceLevel?: string;
  ingredients?: string;
  aroma?: string;
  usageType?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: GaramMasalaData;
  onChange: (value: GaramMasalaData) => void;
}

export default function GaramMasala({ value, onChange }: Props) {
  const update = (key: keyof GaramMasalaData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Garam Masala Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Garam Masala Type" value={value.masalaType}
            onChange={(v) => update("masalaType", v)}
            options={['Regular', 'Premium', 'Punjabi Style', 'Bengali Style', 'Special Blend', 'Other']} />
          <Select label="Form" value={value.form}
            onChange={(v) => update("form", v)}
            options={['Powder', 'Whole Spice Blend']} />
          <Select label="Spice Level" value={value.spiceLevel}
            onChange={(v) => update("spiceLevel", v)}
            options={['Mild', 'Medium', 'Hot']} />
          <Input label="Main Ingredients" value={value.ingredients}
            onChange={(v) => update("ingredients", v)} />
          <Select label="Aroma" value={value.aroma}
            onChange={(v) => update("aroma", v)}
            options={['Mild', 'Medium', 'Strong']} />
          <Select label="Usage Type" value={value.usageType}
            onChange={(v) => update("usageType", v)}
            options={['Curry', 'Meat', 'Rice', 'Vegetable', 'General Cooking']} />
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
  label: string; value?: string; onChange: (value: string) => void;
}) {
  return (<div>
    <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
    <input value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" />
  </div>);
}

function Select({ label, value, options, onChange }: {
  label: string; value?: string; options: string[]; onChange: (value: string) => void;
}) {
  return (<div>
    <label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500">
      <option value="">Select {label}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>);
}
