"use client";

export interface SaucesData {
  sauceType?: string;
  baseIngredient?: string;
  flavor?: string;
  spiceLevel?: string;
  texture?: string;
  sweetness?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: SaucesData;
  onChange: (value: SaucesData) => void;
}

export default function Sauces({ value, onChange }: Props) {
  const update = (key: keyof SaucesData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Sauce Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add sauce-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Sauce Type" value={value.sauceType}
            onChange={(v) => update("sauceType", v)}
            options={['Tomato Sauce', 'Chili Sauce', 'Soy Sauce', 'BBQ Sauce', 'Hot Sauce', 'Pasta Sauce', 'Other']} />
          <Input label="Base Ingredient" value={value.baseIngredient}
            onChange={(v) => update("baseIngredient", v)} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Spice Level" value={value.spiceLevel}
            onChange={(v) => update("spiceLevel", v)}
            options={['Mild', 'Medium', 'Hot', 'Extra Hot']} />
          <Select label="Texture" value={value.texture}
            onChange={(v) => update("texture", v)}
            options={['Smooth', 'Thick', 'Chunky']} />
          <Select label="Sweetness" value={value.sweetness}
            onChange={(v) => update("sweetness", v)}
            options={['Unsweetened', 'Low Sweetness', 'Regular', 'Sweet']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature Before Opening', 'Refrigerated After Opening']} />
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
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      />
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
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
