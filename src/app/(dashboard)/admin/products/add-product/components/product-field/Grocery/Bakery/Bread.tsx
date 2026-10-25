"use client";

export interface BreadData {
  breadType?: string;
  flourType?: string;
  sliceType?: string;
  crustType?: string;
  texture?: string;
  sweetness?: string;
  toastedType?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: BreadData;
  onChange: (value: BreadData) => void;
}

export default function Bread({ value, onChange }: Props) {
  const update = (key: keyof BreadData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Bread Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this bread product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Bread Type" value={value.breadType} onChange={(v) => update("breadType", v)}
            options={["White Bread", "Whole Wheat Bread", "Brown Bread", "Multigrain Bread", "Sourdough", "Rye Bread", "Garlic Bread", "Other"]} />
          <Select label="Flour Type" value={value.flourType} onChange={(v) => update("flourType", v)}
            options={["Wheat", "Whole Wheat", "Multigrain", "Rye", "Gluten-Free Flour", "Other"]} />
          <Select label="Slice Type" value={value.sliceType} onChange={(v) => update("sliceType", v)}
            options={["Sliced", "Unsliced"]} />
          <Select label="Crust Type" value={value.crustType} onChange={(v) => update("crustType", v)}
            options={["Soft Crust", "Hard Crust", "Crustless"]} />
          <Select label="Texture" value={value.texture} onChange={(v) => update("texture", v)}
            options={["Soft", "Dense", "Chewy", "Crispy"]} />
          <Select label="Sweetness" value={value.sweetness} onChange={(v) => update("sweetness", v)}
            options={["Unsweetened", "Low Sweetness", "Sweet"]} />
          <Select label="Toasted Type" value={value.toastedType} onChange={(v) => update("toastedType", v)}
            options={["Untoasted", "Toasted"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated", "Frozen"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 3 days" />
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
