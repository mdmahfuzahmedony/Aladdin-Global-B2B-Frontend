"use client";

export interface CannedFishData {
  fishType?: string;
  preparation?: string;
  packingLiquid?: string;
  flavor?: string;
  saltLevel?: string;
  storageCondition?: string;
  shelfLife?: string;
}

interface Props {
  value: CannedFishData;
  onChange: (value: CannedFishData) => void;
}

export default function CannedFish({ value, onChange }: Props) {
  const update = (key: keyof CannedFishData, fieldValue: string) =>
    onChange({ ...value, [key]: fieldValue });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">Canned Fish Information</h3>
        <p className="mt-1 text-xs text-slate-500">Add canned fish-specific information.</p>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select label="Fish Type" value={value.fishType}
            onChange={(v) => update("fishType", v)}
            options={['Tuna', 'Sardine', 'Mackerel', 'Salmon', 'Anchovy', 'Other']} />
          <Select label="Preparation" value={value.preparation}
            onChange={(v) => update("preparation", v)}
            options={['Whole', 'Fillet', 'Chunks', 'Flakes', 'Minced']} />
          <Select label="Packing Liquid" value={value.packingLiquid}
            onChange={(v) => update("packingLiquid", v)}
            options={['Oil', 'Water', 'Brine', 'Sauce']} />
          <Input label="Flavor" value={value.flavor}
            onChange={(v) => update("flavor", v)} />
          <Select label="Salt Level" value={value.saltLevel}
            onChange={(v) => update("saltLevel", v)}
            options={['Low Salt', 'Regular', 'High Salt', 'No Added Salt']} />
          <Select label="Storage Condition" value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={['Room Temperature', 'Cool & Dry']} />
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
