"use client";

export interface SaltData {
  saltType?: string;
  form?: string;
  iodized?: string;
  purity?: string;
  mineralContent?: string;
  color?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: SaltData;
  onChange: (value: SaltData) => void;
}

export default function Salt({ value, onChange }: Props) {
  const update = (key: keyof SaltData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Salt Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Salt Type" value={value.saltType}
            onChange={(v) => update("saltType", v)}
            options={['Table Salt', 'Iodized Salt', 'Sea Salt', 'Rock Salt', 'Himalayan Pink Salt', 'Black Salt', 'Other']} />
          <Select label="Form" value={value.form}
            onChange={(v) => update("form", v)}
            options={['Fine', 'Coarse', 'Crystals', 'Powder']} />
          <Select label="Iodized" value={value.iodized}
            onChange={(v) => update("iodized", v)}
            options={['Yes', 'No']} />
          <Select label="Purity" value={value.purity}
            onChange={(v) => update("purity", v)}
            options={['Regular', 'Refined', 'Premium']} />
          <Input label="Mineral Content" value={value.mineralContent}
            onChange={(v) => update("mineralContent", v)} />
          <Select label="Color" value={value.color}
            onChange={(v) => update("color", v)}
            options={['White', 'Pink', 'Grey', 'Black']} />
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
