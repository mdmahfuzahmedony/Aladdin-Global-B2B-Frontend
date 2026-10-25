"use client";

export interface SoftDrinksData {
  drinkType?: string;
  flavor?: string;
  sugarLevel?: string;
  carbonated?: string;
  caffeine?: string;
  servingSize?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: SoftDrinksData;
  onChange: (value: SoftDrinksData) => void;
}

export default function SoftDrink({ value, onChange }: Props) {
  const update = (key: keyof SoftDrinksData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Soft Drink Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add soft drink-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Drink Type" value={value.drinkType}
            onChange={(v) => update("drinkType", v)}
            options={["Cola", "Lemon-Lime", "Orange", "Soda", "Tonic", "Other"]} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Sugar Level" value={value.sugarLevel}
            onChange={(v) => update("sugarLevel", v)}
            options={["Regular", "Low Sugar", "Zero Sugar"]} />
          <Select label="Carbonated" value={value.carbonated}
            onChange={(v) => update("carbonated", v)}
            options={["Yes", "No"]} />
          <Select label="Caffeine" value={value.caffeine}
            onChange={(v) => update("caffeine", v)}
            options={["Caffeinated", "Caffeine-Free"]} />
          <Input label="Serving Size" value={value.servingSize}
            onChange={(v) => update("servingSize", v)} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated"]} />
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
