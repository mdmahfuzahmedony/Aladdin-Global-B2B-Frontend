"use client";

export interface ToffeeData {
  toffeeType?: string;
  flavor?: string;
  texture?: string;
  filling?: string;
  sweetness?: string;
  ingredients?: string;
  dietaryType?: string;
  shelfLife?: string;
}

interface Props {
  value: ToffeeData;
  onChange: (value: ToffeeData) => void;
}

export default function Toffee({ value, onChange }: Props) {
  const update = (key: keyof ToffeeData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Toffee Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add product-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Toffee Type" value={value.toffeeType}
            onChange={(v) => update("toffeeType", v)}
            options={['Caramel Toffee', 'Milk Toffee', 'Chocolate Toffee', 'Butter Toffee', 'Fruit Toffee', 'Chewy Toffee', 'Hard Toffee', 'Other']} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Hard', 'Soft', 'Chewy', 'Creamy']} />
          <Select label="Filling" value={value.filling}
            onChange={(v) => update("filling", v)}
            options={['None', 'Caramel', 'Chocolate', 'Cream', 'Nut', 'Other']} />
          <Select label="Sweetness Level" value={value.sweetness}
            onChange={(v) => update("sweetness", v)}
            options={['Low', 'Regular', 'High']} />
          <Input label="Key Ingredients" value={value.ingredients}
            onChange={(v) => update("ingredients", v)} />
          <Select label="Dietary Type" value={value.dietaryType}
            onChange={(v) => update("dietaryType", v)}
            options={['Regular', 'Sugar Free']} />
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
