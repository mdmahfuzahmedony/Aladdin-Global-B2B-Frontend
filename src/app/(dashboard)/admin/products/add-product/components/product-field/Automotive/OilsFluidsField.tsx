"use client";

import {
  Droplets,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Gauge,
  Layers,
  FlaskConical,
  CheckCircle2,
} from "lucide-react";

export interface OilsFluidsAttributes {
  oilFluidType?: string;
  brandMaker?: string;
  viscosityGrade?: string;
  oilBaseFormulation?: string;
  volumeNetQuantity?: string;
  apiJasoStandards?: string;
  vehicleEngineCompatibility?: string;
  drainIntervalKm?: string;
  shelfLifePeriod?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function OilsFluidsField({
  value = {},
  onChange,
  categoryName = "Oils & Fluids",
}: Props) {
  const update = (key: string, v: any) => {
    onChange({ ...value, [key]: v });
  };

  const customSpecs: Array<{ id: string; label: string; value: string }> =
    Array.isArray(value.customSpecs) ? value.customSpecs : [];

  const handleAddCustomSpec = () => {
    const newSpec = {
      id: `spec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: "",
      value: "",
    };
    onChange({
      ...value,
      customSpecs: [...customSpecs, newSpec],
    });
  };

  const handleUpdateCustomSpec = (
    id: string,
    field: "label" | "value",
    val: string
  ) => {
    const updated = customSpecs.map((s) =>
      s.id === id ? { ...s, [field]: val } : s
    );
    onChange({ ...value, customSpecs: updated });
  };

  const handleRemoveCustomSpec = (id: string) => {
    const filtered = customSpecs.filter((s) => s.id !== id);
    onChange({ ...value, customSpecs: filtered });
  };

  const oilPresets = [
    "Fully Synthetic 4T Motorcycle Engine Oil 10W-40 (JASO MA2)",
    "Full Synthetic Advanced Car Engine Oil 5W-30 (API SP / ILSAC GF-6A)",
    "High Performance 20W-50 4T Bike Engine Oil (Ester Core)",
    "Heavy Duty Diesel Engine Oil 15W-40 (API CK-4 / CJ-4)",
    "Pre-mixed Antifreeze & Radiator Long Life Coolant (Ready to Use)",
    "High Boiling Point DOT 4 Synthetic Brake & Clutch Fluid",
    "Fully Synthetic Automatic Transmission Fluid (ATF WS / Dexron VI)",
    "Complete Fuel Injector & Carburetor Cleaner Additive (Petrol Engine)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
            <Droplets size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              লুব্রিক্যান্ট ও ফ্লুইডস স্পেসিফিকেশন (Oils, Fluids & Lubricants Specs)
            </h3>
            <p className="text-xs text-amber-200/80">
              ইঞ্জিন অয়েল, গিয়ার অয়েল, ব্রেক ফ্লুইড, কুল্যান্ট ও অ্যাডিটিভসের বিবরণ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-xs font-semibold text-amber-300">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-amber-600" />
            <span>অয়েল / ফ্লুইডের ধরন ও মডেল (Oil / Fluid Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="oil-presets"
            value={value.oilFluidType || ""}
            onChange={(e) => update("oilFluidType", e.target.value)}
            placeholder="উদাহরণ: Fully Synthetic 4T Motorcycle Engine Oil 10W-40"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
          <datalist id="oil-presets">
            {oilPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-amber-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Maker)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Motul, Mobil 1, Castrol, Shell, Liqui Moly, TotalEnergies"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Viscosity Grade (SAE) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-amber-600" />
            <span>ভিসকোসিটি গ্রেড (Viscosity Grade - SAE)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.viscosityGrade || ""}
            onChange={(e) => update("viscosityGrade", e.target.value)}
            placeholder="e.g. 10W-40, 5W-30, 20W-50, 0W-20, DOT 4, 75W-90, N/A"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Formulation / Base Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <FlaskConical size={14} className="text-amber-600" />
            <span>ফর্মুলেশন ও বেস টাইপ (Formulation Base)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.oilBaseFormulation || ""}
            onChange={(e) => update("oilBaseFormulation", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">সিলেক্ট করুন (Select Formulation)</option>
            <option value="100% Fully Synthetic (ফুল সিন্থেটিক)">100% Fully Synthetic (ফুল সিন্থেটিক)</option>
            <option value="Semi-Synthetic / Synthetic Blend (সেমি সিন্থেটিক)">Semi-Synthetic / Synthetic Blend (সেমি সিন্থেটিক)</option>
            <option value="Premium Mineral (মিনারেল)">Premium Mineral (মিনারেল)</option>
            <option value="Ester Core Racing Technology">Ester Core Racing Technology (রেসিং গ্রেড)</option>
            <option value="Ethylene Glycol (Coolant)">Ethylene Glycol (রেডিয়েটর কুল্যান্ট)</option>
            <option value="Polyglycol Synthetic (Brake Fluid)">Polyglycol Synthetic (ব্রেক ফ্লুইড)</option>
            <option value="Concentrated Additive / Treatment">Concentrated Additive (অ্যাডিটিভ / ট্রিটমেন্ট)</option>
          </select>
        </div>

        {/* Volume / Net Quantity */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Droplets size={14} className="text-amber-600" />
            <span>পরিমাণ / ভলিউম (Net Quantity / Volume)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.volumeNetQuantity || ""}
            onChange={(e) => update("volumeNetQuantity", e.target.value)}
            placeholder="e.g. 1 Liter, 4 Liters, 500 ml, 5 Liters"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* API & JASO Standards */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>স্ট্যান্ডার্ড ও সার্টিফিকেশন (API & JASO Standards)</span>
          </label>
          <input
            type="text"
            value={value.apiJasoStandards || ""}
            onChange={(e) => update("apiJasoStandards", e.target.value)}
            placeholder="e.g. API SP / SN Plus, JASO MA2, ACEA A3/B4, DOT 4"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Engine & Vehicle Compatibility */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-amber-600" />
            <span>ইঞ্জিন ও যানবাহন টাইপ (Vehicle Compatibility)</span>
          </label>
          <select
            value={value.vehicleEngineCompatibility || ""}
            onChange={(e) => update("vehicleEngineCompatibility", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">সিলেক্ট করুন (Select Compatibility)</option>
            <option value="4-Stroke Motorcycles & Scooters (4T)">4-Stroke Motorcycles & Scooters (4T বাইক)</option>
            <option value="Petrol Cars & Hybrids">Petrol Cars & Hybrids (পেট্রোল ও হাইব্রিড কার)</option>
            <option value="Diesel Engines & Commercial Vehicles">Diesel Engines & Commercial Vehicles (ডিজেল ও হেভি ভেহিকেল)</option>
            <option value="Universal All Motor Vehicles">Universal All Motor Vehicles (সার্বজনীন সকল যান)</option>
          </select>
        </div>

        {/* Drain Interval (KM) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <CheckCircle2 size={14} className="text-amber-600" />
            <span>ড্রেন ইন্টারভাল / ব্যবহারের স্থায়িত্ব (Drain Interval)</span>
          </label>
          <input
            type="text"
            value={value.drainIntervalKm || ""}
            onChange={(e) => update("drainIntervalKm", e.target.value)}
            placeholder="e.g. 3,000 - 5,000 KM (Bike) / 10,000 KM (Car)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-amber-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. France, Germany, USA, Japan, Singapore, UAE"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specifications Section */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Add Custom Specifications)
            </h4>
            <p className="text-[11px] text-slate-500">
              যেকোনো বিশেষ ফ্লুইড স্পেসিফিকেশন যোগ করুন (যেমন: Flash Point, Pour Point, Density)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700"
          >
            <Plus size={14} />
            <span>নতুন ফিল্ড যোগ করুন</span>
          </button>
        </div>

        {customSpecs.length > 0 ? (
          <div className="space-y-2">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="লেবেল (যেমন: Flash Point)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: 232°C)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                  title="Remove spec"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[11px] text-slate-400 py-2">
            এখনও কোনো কাস্টম স্পেসিফিকেশন যুক্ত করা হয়নি।
          </p>
        )}
      </div>
    </div>
  );
}
