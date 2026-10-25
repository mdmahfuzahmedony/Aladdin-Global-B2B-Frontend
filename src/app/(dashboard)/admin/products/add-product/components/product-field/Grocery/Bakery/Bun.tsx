"use client";

export interface BunData {
  bunType?: string;
  flourType?: string;
  filling?: string;
  flavor?: string;
  sweetness?: string;
  topping?: string;
  texture?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: BunData;
  onChange: (value: BunData) => void;
}

export default function Bun({ value, onChange }: Props) {
  const update = (key: keyof BunData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Bun Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this bun product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Bun Type" value={value.bunType} onChange={(v) => update("bunType", v)}
            options={["Plain Bun", "Sweet Bun", "Burger Bun", "Hot Dog Bun", "Milk Bun", "Coconut Bun", "Cream Bun", "Other"]} />
          <Select label="Flour Type" value={value.flourType} onChange={(v) => update("flourType", v)}
            options={["Wheat", "Whole Wheat", "Multigrain", "Other"]} />
          <Select label="Filling" value={value.filling} onChange={(v) => update("filling", v)}
            options={["No Filling", "Cream", "Coconut", "Chocolate", "Jam", "Custard", "Other"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. vanilla" />
          <Select label="Sweetness" value={value.sweetness} onChange={(v) => update("sweetness", v)}
            options={["Unsweetened", "Lightly Sweet", "Sweet"]} />
          <Select label="Topping" value={value.topping} onChange={(v) => update("topping", v)}
            options={["None", "Sesame Seeds", "Sugar", "Coconut", "Chocolate", "Other"]} />
          <Select label="Texture" value={value.texture} onChange={(v) => update("texture", v)}
            options={["Soft", "Fluffy", "Dense", "Crispy"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated", "Frozen"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 2 days" />
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
    <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500" /></div>;
}

function Select({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v: string) => void }) {
  return <div><label className="mb-1.5 block text-xs font-medium text-slate-700">{label}</label>
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500">
      <option value="">Select {label}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select></div>;
}
