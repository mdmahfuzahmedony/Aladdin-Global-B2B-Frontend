"use client";

export interface PicklesData {
  pickleType?: string;
  mainIngredient?: string;
  pickleStyle?: string;
  spiceLevel?: string;
  sourness?: string;
  saltLevel?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: PicklesData;
  onChange: (value: PicklesData) => void;
}

export default function Pickles({ value, onChange }: Props) {
  const update = (key: keyof PicklesData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Pickles Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add pickle-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Pickle Type" value={value.pickleType}
            onChange={(v) => update("pickleType", v)}
            options={['Mango Pickle', 'Lime Pickle', 'Mixed Pickle', 'Chili Pickle', 'Garlic Pickle', 'Other']} />
          <Input label="Main Ingredient" value={value.mainIngredient}
            onChange={(v) => update("mainIngredient", v)} />
          <Select label="Pickle Style" value={value.pickleStyle}
            onChange={(v) => update("pickleStyle", v)}
            options={['Oil-Based', 'Vinegar-Based', 'Brine-Based']} />
          <Select label="Spice Level" value={value.spiceLevel}
            onChange={(v) => update("spiceLevel", v)}
            options={['Mild', 'Medium', 'Hot', 'Extra Hot']} />
          <Select label="Sourness" value={value.sourness}
            onChange={(v) => update("sourness", v)}
            options={['Mild', 'Medium', 'Strong']} />
          <Select label="Salt Level" value={value.saltLevel}
            onChange={(v) => update("saltLevel", v)}
            options={['Low', 'Regular', 'High']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature', 'Cool & Dry', 'Refrigerated']} />
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
