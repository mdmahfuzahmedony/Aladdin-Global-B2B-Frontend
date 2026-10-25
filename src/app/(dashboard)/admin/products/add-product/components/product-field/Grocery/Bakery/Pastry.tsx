"use client";

export interface PastryData {
  pastryType?: string;
  flavor?: string;
  pastryBase?: string;
  filling?: string;
  creamType?: string;
  topping?: string;
  texture?: string;
  eggType?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: PastryData;
  onChange: (value: PastryData) => void;
}

export default function Pastry({ value, onChange }: Props) {
  const update = (key: keyof PastryData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Pastry Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this pastry product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Pastry Type" value={value.pastryType} onChange={(v) => update("pastryType", v)}
            options={["Puff Pastry", "Cream Pastry", "Danish Pastry", "Croissant", "Éclair", "Tart", "Turnover", "Other"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. chocolate" />
          <Select label="Pastry Base" value={value.pastryBase} onChange={(v) => update("pastryBase", v)}
            options={["Puff Pastry", "Shortcrust", "Choux", "Flaky", "Danish Dough", "Other"]} />
          <Select label="Filling" value={value.filling} onChange={(v) => update("filling", v)}
            options={["No Filling", "Custard", "Chocolate", "Fruit", "Jam", "Cheese", "Other"]} />
          <Select label="Cream Type" value={value.creamType} onChange={(v) => update("creamType", v)}
            options={["Not Applicable", "Whipped Cream", "Custard Cream", "Buttercream", "Chocolate Cream", "Other"]} />
          <Select label="Topping" value={value.topping} onChange={(v) => update("topping", v)}
            options={["None", "Icing Sugar", "Chocolate", "Glaze", "Nuts", "Fruit", "Other"]} />
          <Select label="Texture" value={value.texture} onChange={(v) => update("texture", v)}
            options={["Flaky", "Crispy", "Soft", "Creamy", "Chewy"]} />
          <Select label="Egg Type" value={value.eggType} onChange={(v) => update("eggType", v)}
            options={["Contains Egg", "Eggless"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated", "Frozen"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 2 days refrigerated" />
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
