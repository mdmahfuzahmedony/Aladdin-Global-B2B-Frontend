"use client";

export interface CookiesData {
  cookieType?: string;
  flavor?: string;
  texture?: string;
  filling?: string;
  topping?: string;
  sweetness?: string;
  chocolateType?: string;
  shape?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: CookiesData;
  onChange: (value: CookiesData) => void;
}

export default function Cookies({ value, onChange }: Props) {
  const update = (key: keyof CookiesData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Cookies Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add details specific to this cookie product.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Cookie Type" value={value.cookieType} onChange={(v) => update("cookieType", v)}
            options={["Butter Cookies", "Chocolate Chip", "Oatmeal", "Digestive", "Shortbread", "Cream-Filled", "Sugar-Free", "Other"]} />
          <Input label="Flavor" value={value.flavor} onChange={(v) => update("flavor", v)} placeholder="e.g. chocolate" />
          <Select label="Texture" value={value.texture} onChange={(v) => update("texture", v)}
            options={["Crispy", "Crunchy", "Soft", "Chewy"]} />
          <Select label="Filling" value={value.filling} onChange={(v) => update("filling", v)}
            options={["No Filling", "Cream", "Chocolate", "Jam", "Caramel", "Other"]} />
          <Select label="Topping" value={value.topping} onChange={(v) => update("topping", v)}
            options={["None", "Chocolate Chips", "Nuts", "Sprinkles", "Sugar", "Other"]} />
          <Select label="Sweetness" value={value.sweetness} onChange={(v) => update("sweetness", v)}
            options={["Unsweetened", "Low Sugar", "Regular", "Extra Sweet", "Sugar-Free"]} />
          <Select label="Chocolate Type" value={value.chocolateType} onChange={(v) => update("chocolateType", v)}
            options={["Not Applicable", "No Chocolate", "Milk Chocolate", "Dark Chocolate", "White Chocolate"]} />
          <Select label="Shape" value={value.shape} onChange={(v) => update("shape", v)}
            options={["Round", "Square", "Rectangle", "Heart", "Assorted Shapes"]} />
          <Select label="Storage Condition" value={value.storageCondition} onChange={(v) => update("storageCondition", v)}
            options={["Room Temperature", "Refrigerated", "Cool & Dry"]} />
          <Input label="Shelf Life" value={value.shelfLife} onChange={(v) => update("shelfLife", v)} placeholder="e.g. 6 months" />
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
