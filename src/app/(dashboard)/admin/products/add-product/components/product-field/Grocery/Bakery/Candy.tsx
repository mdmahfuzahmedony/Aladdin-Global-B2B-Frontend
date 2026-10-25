"use client";

export interface CandyData {
  candyType?: string;
  flavor?: string;
  texture?: string;
  filling?: string;
  sweetness?: string;
  color?: string;
  dietaryType?: string;
  shelfLife?: string;
}

interface Props {
  value: CandyData;
  onChange: (value: CandyData) => void;
}

export default function Candy({ value, onChange }: Props) {
  const update = (key: keyof CandyData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Candy Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Candy Type" value={value.candyType}
            onChange={(v) => update("candyType", v)}
            options={['Hard Candy', 'Gummy', 'Jelly Candy', 'Lollipop', 'Toffee Candy', 'Mint Candy', 'Chewy Candy', 'Other']} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Hard', 'Soft', 'Chewy', 'Gummy', 'Jelly']} />
          <Select label="Filling" value={value.filling}
            onChange={(v) => update("filling", v)}
            options={['None', 'Fruit', 'Chocolate', 'Caramel', 'Cream', 'Other']} />
          <Select label="Sweetness Level" value={value.sweetness}
            onChange={(v) => update("sweetness", v)}
            options={['Low', 'Regular', 'High']} />
          <Input label="Color" value={value.color}
            onChange={(v) => update("color", v)} />
          <Select label="Dietary Type" value={value.dietaryType}
            onChange={(v) => update("dietaryType", v)}
            options={['Regular', 'Sugar Free', 'Vegan']} />
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
