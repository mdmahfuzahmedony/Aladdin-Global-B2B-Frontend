"use client";

export interface CakeData {
  cakeType?: string;
  flavor?: string;
  cakeBase?: string;
  frostingType?: string;
  filling?: string;
  shape?: string;
  eggType?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: CakeData;
  onChange: (value: CakeData) => void;
}

export default function Cake({ value, onChange }: Props) {
  const update = (key: keyof CakeData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Cake Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this cake product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Cake Type" value={value.cakeType} onChange={(v) => update("cakeType", v)}
            options={["Birthday Cake", "Wedding Cake", "Sponge Cake", "Cheesecake", "Fruit Cake", "Chocolate Cake", "Cupcake", "Other"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. chocolate" />
          <Select label="Cake Base" value={value.cakeBase} onChange={(v) => update("cakeBase", v)}
            options={["Sponge", "Chocolate", "Vanilla", "Red Velvet", "Cheesecake", "Fruit", "Other"]} />
          <Select label="Frosting Type" value={value.frostingType} onChange={(v) => update("frostingType", v)}
            options={["No Frosting", "Buttercream", "Whipped Cream", "Fondant", "Cream Cheese", "Ganache", "Other"]} />
          <Select label="Filling" value={value.filling} onChange={(v) => update("filling", v)}
            options={["No Filling", "Chocolate", "Vanilla Cream", "Fruit", "Jam", "Custard", "Other"]} />
          <Select label="Shape" value={value.shape} onChange={(v) => update("shape", v)}
            options={["Round", "Square", "Rectangle", "Heart", "Custom Shape"]} />
          <Select label="Egg Type" value={value.eggType} onChange={(v) => update("eggType", v)}
            options={["Contains Egg", "Eggless"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated", "Frozen"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 3 days refrigerated" />
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
