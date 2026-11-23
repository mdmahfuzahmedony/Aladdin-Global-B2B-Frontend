"use client";

import {
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Layers,
  Droplets,
  SprayCan,
  Wind,
} from "lucide-react";

export interface CarBikeCareAttributes {
  careProductType?: string;
  brandMaker?: string;
  netVolumeQuantity?: string;
  formulationPhLevel?: string;
  applicableSurfaces?: string;
  scentFragrance?: string;
  applicationMethod?: string;
  longevityProtection?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function CarBikeCareField({
  value = {},
  onChange,
  categoryName = "Car & Bike Care",
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

  const carePresets = [
    "pH Neutral High-Foam Snow Foam Car Wash Shampoo (1L)",
    "Deep Gloss Brazilian Carnauba Paste Wax Polish (with Applicator)",
    "Hydrophobic Ceramic Spray Coating & Quick Detailer (500ml)",
    "Ultra-Plush Dual-Sided Edgeless Microfiber Drying Towel 800 GSM",
    "High Power Cordless Handheld Car Vacuum Cleaner (120W / 9000PA)",
    "Advanced Swirl & Scratch Remover Compound Polish (300ml)",
    "Anti-Fog Automotive Glass Cleaner & Rain Repellent (Spray 500ml)",
    "Premium Leather Cleaner & Conditioner Balm with UV Protection",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-xs">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              কেয়ার ও ক্লিনিং স্পেসিফিকেশন (Car & Bike Care Specs)
            </h3>
            <p className="text-xs text-emerald-200/80">
              শ্যাম্পু, পলিশ, সিরামিক কোটিং, ভ্যাকুয়াম ক্লিনার ও মাইক্রোফাইবার এক্সেসরিজ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-300">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-emerald-600" />
            <span>আইটেম টাইপ ও নাম (Care Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="care-presets"
            value={value.careProductType || ""}
            onChange={(e) => update("careProductType", e.target.value)}
            placeholder="উদাহরণ: pH Neutral High-Foam Snow Foam Car Wash Shampoo"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
          <datalist id="care-presets">
            {carePresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-emerald-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Maker)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Meguiar's, Turtle Wax, Chemical Guys, 3M, Sonax, Flamingo"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Net Volume / Quantity */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Droplets size={14} className="text-emerald-600" />
            <span>ভলিউম বা পরিমাণ (Volume / Pack Size)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.netVolumeQuantity || ""}
            onChange={(e) => update("netVolumeQuantity", e.target.value)}
            placeholder="e.g. 500ml, 1 Liter, 2L, 40x40 cm (Pack of 3)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Formulation / pH Level */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>ফর্মুলেশন / পিএইচ মান (Formulation / pH)</span>
          </label>
          <select
            value={value.formulationPhLevel || ""}
            onChange={(e) => update("formulationPhLevel", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">সিলেক্ট করুন (Select Formulation)</option>
            <option value="pH Neutral 7.0 (Paint & Wax Safe)">pH Neutral 7.0 (কালার ও মোমের জন্য ১০০% নিরাপদ)</option>
            <option value="Advanced SiO2 Ceramic Hydrophobic">Advanced SiO2 Ceramic Hydrophobic (ওয়াটারপ্রুফ কোটিং)</option>
            <option value="Pure Carnauba Wax Blend">Pure Carnauba Wax Blend (ডিপ শাইন কার্নুবা)</option>
            <option value="Heavy-Duty Alkaline Degreaser">Heavy-Duty Degreaser (ইঞ্জিন ও চাকার গভীর ময়লা দূরক)</option>
            <option value="Ammonia-Free Tint Safe (Glass)">Ammonia-Free Tint Safe (টিন্টেড গ্লাসের জন্য নিরাপদ)</option>
            <option value="Non-Abrasive Micro-Polishing Compound">Non-Abrasive Micro Compound (নন-অ্যাব্রেসিভ স্ক্র্যাচ রিমুভার)</option>
          </select>
        </div>

        {/* Applicable Surfaces */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-emerald-600" />
            <span>প্রযোজ্য স্থান বা সারফেস (Applicable Surfaces)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.applicableSurfaces || ""}
            onChange={(e) => update("applicableSurfaces", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">সিলেক্ট করুন (Select Surface)</option>
            <option value="Exterior Paint & Clear Coat">Exterior Paint & Clear Coat (গাড়ির মূল পেইন্ট)</option>
            <option value="Windshield, Windows & Mirrors">Windshield, Windows & Mirrors (গ্লাস ও লুকিং গ্লাস)</option>
            <option value="Tires, Rims & Wheels">Tires, Rims & Wheels (টায়ার ও রিম)</option>
            <option value="Interior Leather & Upholstery">Interior Leather & Upholstery (লেদার সিট ও কুশন)</option>
            <option value="Dashboard & Vinyl Plastics">Dashboard & Vinyl Plastics (ড্যাশবোর্ড ও প্লাস্টিক)</option>
            <option value="All Multi-Surface Safe">All Multi-Surface Safe (সার্বজনীন সকল সারফেস)</option>
          </select>
        </div>

        {/* Application Method */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <SprayCan size={14} className="text-emerald-600" />
            <span>ব্যবহারের উপায় (Application Method)</span>
          </label>
          <input
            type="text"
            value={value.applicationMethod || ""}
            onChange={(e) => update("applicationMethod", e.target.value)}
            placeholder="e.g. Foam Cannon / Hand Wash / Spray & Wipe / Rotary Polisher"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Scent / Fragrance */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Wind size={14} className="text-emerald-600" />
            <span>সুগন্ধি / সুবাস (Scent / Fragrance)</span>
          </label>
          <input
            type="text"
            value={value.scentFragrance || ""}
            onChange={(e) => update("scentFragrance", e.target.value)}
            placeholder="e.g. Wild Cherry, Fresh Ocean, Citrus Lemon, Natural"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Longevity / Protection Period */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>স্থায়িত্ব ও প্রোটেকশন (Protection Longevity)</span>
          </label>
          <input
            type="text"
            value={value.longevityProtection || ""}
            onChange={(e) => update("longevityProtection", e.target.value)}
            placeholder="e.g. Up to 6 Months Hydrophobic Protection / 30 Days Shine"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-emerald-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. USA, Germany, Japan, UK, China"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
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
              যেকোনো বিশেষ কেয়ার স্পেসিফিকেশন যোগ করুন (যেমন: Dilution Ratio, GSM, Power Wattage)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
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
                  placeholder="লেবেল (যেমন: Dilution Ratio)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: 1:10 for Snow Foam)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
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
