"use client";

export interface JuiceData {
  juiceType?: string;
  fruitType?: string;
  flavor?: string;
  juiceContent?: string;
  sweetness?: string;
  pulp?: string;
  pasteurization?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: JuiceData;
  onChange: (value: JuiceData) => void;
}

export default function Juice({ value, onChange }: Props) {
  const update = (key: keyof JuiceData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Juice Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add juice-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Juice Type" value={value.juiceType}
            onChange={(v) => update("juiceType", v)}
            options={["Fruit Juice", "Fruit Drink", "Vegetable Juice", "Mixed Juice", "Other"]} />
          <Input label="Fruit / Main Ingredient" value={value.fruitType}
            onChange={(v) => update("fruitType", v)} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Juice Content" value={value.juiceContent}
            onChange={(v) => update("juiceContent", v)}
            options={["100% Juice", "High Juice Content", "Low Juice Content"]} />
          <Select label="Sweetness" value={value.sweetness}
            onChange={(v) => update("sweetness", v)}
            options={["No Added Sugar", "Low Sugar", "Regular", "Sweet"]} />
          <Select label="Pulp" value={value.pulp}
            onChange={(v) => update("pulp", v)}
            options={["No Pulp", "With Pulp"]} />
          <Select label="Processing" value={value.pasteurization}
            onChange={(v) => update("pasteurization", v)}
            options={["Pasteurized", "UHT", "Fresh / Unprocessed"]} />
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
