"use client";

export interface WaterData {
  waterType?: string;
  source?: string;
  carbonated?: string;
  mineralContent?: string;
  packagingType?: string;
  servingSize?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: WaterData;
  onChange: (value: WaterData) => void;
}

export default function Water({ value, onChange }: Props) {
  const update = (key: keyof WaterData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Water Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add water-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Water Type" value={value.waterType}
            onChange={(v) => update("waterType", v)}
            options={["Mineral Water", "Drinking Water", "Purified Water", "Spring Water", "Sparkling Water", "Other"]} />
          <Input label="Water Source" value={value.source}
            onChange={(v) => update("source", v)} />
          <Select label="Carbonated" value={value.carbonated}
            onChange={(v) => update("carbonated", v)}
            options={["Yes", "No"]} />
          <Select label="Mineral Content" value={value.mineralContent}
            onChange={(v) => update("mineralContent", v)}
            options={["Low", "Medium", "High", "Not Specified"]} />
          <Select label="Packaging Type" value={value.packagingType}
            onChange={(v) => update("packagingType", v)}
            options={["Bottle", "Can", "Jar", "Other"]} />
          <Input label="Serving Size" value={value.servingSize}
            onChange={(v) => update("servingSize", v)} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Cool & Dry"]} />
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
