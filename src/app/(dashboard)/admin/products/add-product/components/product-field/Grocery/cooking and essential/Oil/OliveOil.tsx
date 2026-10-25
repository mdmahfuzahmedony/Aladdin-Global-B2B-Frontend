"use client";

export interface OliveOilData {
  oliveOilType?: string;
  processingMethod?: string;
  oliveVariety?: string;
  acidity?: string;
  flavor?: string;
  color?: string;
  origin?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: OliveOilData;
  onChange: (value: OliveOilData) => void;
}

export default function OliveOil({ value, onChange }: Props) {
  const update = (key: keyof OliveOilData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Olive Oil Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Olive Oil Type" value={value.oliveOilType}
            onChange={(v) => update("oliveOilType", v)}
            options={['Extra Virgin', 'Virgin', 'Pure Olive Oil', 'Light Olive Oil', 'Pomace Olive Oil']} />
          <Select label="Processing Method" value={value.processingMethod}
            onChange={(v) => update("processingMethod", v)}
            options={['Cold Pressed', 'Refined', 'Blend']} />
          <Input label="Olive Variety" value={value.oliveVariety}
            onChange={(v) => update("oliveVariety", v)} />
          <Input label="Acidity Level" value={value.acidity}
            onChange={(v) => update("acidity", v)} />
          <Select label="Flavor Profile" value={value.flavor}
            onChange={(v) => update("flavor", v)}
            options={['Mild', 'Medium', 'Strong', 'Fruity', 'Peppery']} />
          <Select label="Color" value={value.color}
            onChange={(v) => update("color", v)}
            options={['Light Green', 'Golden', 'Yellow']} />
          <Input label="Origin" value={value.origin}
            onChange={(v) => update("origin", v)} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature', 'Cool & Dark Place']} />
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
