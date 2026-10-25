"use client";

export interface CorianderData {
  corianderType?: string;
  form?: string;
  flavor?: string;
  aroma?: string;
  processing?: string;
  origin?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: CorianderData;
  onChange: (value: CorianderData) => void;
}

export default function Coriander({ value, onChange }: Props) {
  const update = (key: keyof CorianderData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Coriander Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Coriander Type" value={value.corianderType}
            onChange={(v) => update("corianderType", v)}
            options={['Coriander Seeds', 'Coriander Powder', 'Fresh Coriander', 'Dried Coriander']} />
          <Select label="Form" value={value.form}
            onChange={(v) => update("form", v)}
            options={['Whole', 'Powder', 'Crushed', 'Dried Leaves']} />
          <Select label="Flavor Profile" value={value.flavor}
            onChange={(v) => update("flavor", v)}
            options={['Mild', 'Fresh', 'Strong', 'Citrusy']} />
          <Select label="Aroma" value={value.aroma}
            onChange={(v) => update("aroma", v)}
            options={['Mild', 'Medium', 'Strong']} />
          <Select label="Processing" value={value.processing}
            onChange={(v) => update("processing", v)}
            options={['Whole', 'Ground', 'Dried']} />
          <Input label="Origin" value={value.origin}
            onChange={(v) => update("origin", v)} />
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
