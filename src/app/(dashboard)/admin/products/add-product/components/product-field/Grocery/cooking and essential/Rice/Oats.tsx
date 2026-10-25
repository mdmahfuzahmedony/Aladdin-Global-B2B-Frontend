"use client";

export interface OatsData {
  oatType?: string;
  grainForm?: string;
  processing?: string;
  flavor?: string;
  sugarLevel?: string;
  usageType?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: OatsData;
  onChange: (value: OatsData) => void;
}

export default function Oats({ value, onChange }: Props) {
  const update = (key: keyof OatsData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Oats Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Oat Type" value={value.oatType}
            onChange={(v) => update("oatType", v)}
            options={['Rolled Oats', 'Quick Oats', 'Steel Cut Oats', 'Instant Oats', 'Oat Bran', 'Other']} />
          <Select label="Grain Form" value={value.grainForm}
            onChange={(v) => update("grainForm", v)}
            options={['Whole', 'Flakes', 'Cut', 'Powdered']} />
          <Select label="Processing" value={value.processing}
            onChange={(v) => update("processing", v)}
            options={['Regular', 'Quick Cooking', 'Instant']} />
          <Select label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)}
            options={['Plain', 'Natural', 'Flavored']} />
          <Select label="Sugar Level" value={value.sugarLevel}
            onChange={(v) => update("sugarLevel", v)}
            options={['No Added Sugar', 'Low Sugar', 'Regular']} />
          <Select label="Usage Type" value={value.usageType}
            onChange={(v) => update("usageType", v)}
            options={['Breakfast', 'Baking', 'Cooking', 'Smoothies']} />
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
