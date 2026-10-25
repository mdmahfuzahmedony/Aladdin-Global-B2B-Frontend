"use client";

export interface CoffeeData {
  coffeeType?: string;
  roastLevel?: string;
  flavor?: string;
  form?: string;
  caffeine?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: CoffeeData;
  onChange: (value: CoffeeData) => void;
}

export default function Coffee({ value, onChange }: Props) {
  const update = (key: keyof CoffeeData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Coffee Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add coffee-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Coffee Type" value={value.coffeeType}
            onChange={(v) => update("coffeeType", v)}
            options={["Instant Coffee", "Ground Coffee", "Whole Bean Coffee", "Espresso", "Decaf Coffee", "Other"]} />
          <Select label="Roast Level" value={value.roastLevel}
            onChange={(v) => update("roastLevel", v)}
            options={["Light", "Medium", "Medium-Dark", "Dark"]} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Form" value={value.form}
            onChange={(v) => update("form", v)}
            options={["Powder", "Ground", "Whole Bean"]} />
          <Select label="Caffeine" value={value.caffeine}
            onChange={(v) => update("caffeine", v)}
            options={["Regular", "Low Caffeine", "Decaffeinated"]} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={["Cool & Dry", "Room Temperature", "Refrigerated"]} />
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
