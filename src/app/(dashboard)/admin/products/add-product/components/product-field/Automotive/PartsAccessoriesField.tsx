"use client";

import {
  Wrench,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Zap,
  Layers,
  Cpu,
  Car,
} from "lucide-react";

export interface PartsAccessoriesAttributes {
  partAccessoryType?: string;
  brandMaker?: string;
  vehicleMakeModel?: string;
  materialComposition?: string;
  powerVoltageWatts?: string;
  connectivityFeatures?: string;
  safetyCertifications?: string;
  installationType?: string;
  warrantyPeriod?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function PartsAccessoriesField({
  value = {},
  onChange,
  categoryName = "Car & Motorcycle Parts & Accessories",
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

  const partPresets = [
    "Ultra-Bright Mini LED Projector Headlight Bulbs (H4/H7 12V 6000K)",
    "4K UHD Dual-Lens Front & Rear Car Dash Camera with GPS & WiFi",
    "7-Inch Android Auto & Apple CarPlay Car Multimedia Stereo Player",
    "Premium 7D Custom-Fit Waterproof Leather Car Floor Mats",
    "Breathable PU Leather Full Set Car Seat Covers with Lumbar Pillow",
    "ECE 22.06 & DOT Certified Full Face Motorcycle Helmet with Dual Visor",
    "Waterproof All-Weather Touring Motorcycle Riding Jacket with Armor",
    "Heavy Duty Ceramic Front & Rear Disc Brake Pad Set",
    "Automotive Real-Time GPS Tracking Device with Geo-fence & Engine Cut",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-sky-200 bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-white shadow-xs">
            <Wrench size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              পার্টস ও এক্সেসরিজ স্পেসিফিকেশন (Parts & Accessories Specs)
            </h3>
            <p className="text-xs text-sky-200/80">
              হেডলাইট, ড্যাশ ক্যাম, সিট কভার, হেলমেট, ব্রেক প্যাড ও ইন্টেরিয়র এক্সেসরিজ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-1 text-xs font-semibold text-sky-300">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-sky-600" />
            <span>পার্টস / এক্সেসরিজ নাম ও মডেল (Part Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="part-presets"
            value={value.partAccessoryType || ""}
            onChange={(e) => update("partAccessoryType", e.target.value)}
            placeholder="উদাহরণ: 4K UHD Dual-Lens Front & Rear Car Dash Camera with GPS"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
          <datalist id="part-presets">
            {partPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-sky-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Maker)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. 70mai, Osram, Steelbird, Studds, Motowolf, Pioneer, Sparco"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Vehicle Make & Model Compatibility */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Car size={14} className="text-sky-600" />
            <span>যানবাহন ও মডেল কমপ্যাটিবিলিটি (Vehicle Fitment / Compatibility)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.vehicleMakeModel || ""}
            onChange={(e) => update("vehicleMakeModel", e.target.value)}
            placeholder="e.g. Universal Fit (সকল কার) অথবা Toyota Corolla Axio / Yamaha R15 V3"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Material / Build Quality */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-sky-600" />
            <span>ম্যাটেরিয়াল ও গঠন (Material / Build Quality)</span>
          </label>
          <input
            type="text"
            value={value.materialComposition || ""}
            onChange={(e) => update("materialComposition", e.target.value)}
            placeholder="e.g. Aviation Aluminum 6063, High-Impact ABS, PU Leather"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Voltage, Power & Watts */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Zap size={14} className="text-sky-600" />
            <span>পাওয়ার ও ভোল্টেজ (Voltage / Power Rating)</span>
          </label>
          <input
            type="text"
            value={value.powerVoltageWatts || ""}
            onChange={(e) => update("powerVoltageWatts", e.target.value)}
            placeholder="e.g. 12V DC, 60W, 6000K Super White, 5V/2.4A USB, N/A"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Connectivity & Display */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Cpu size={14} className="text-sky-600" />
            <span>কানেক্টিভিটি ও ডিসপ্লে (Connectivity & Tech)</span>
          </label>
          <input
            type="text"
            value={value.connectivityFeatures || ""}
            onChange={(e) => update("connectivityFeatures", e.target.value)}
            placeholder="e.g. Built-in GPS, WiFi App Control, Bluetooth 5.0, Night Vision"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Installation Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Wrench size={14} className="text-sky-600" />
            <span>ইনস্টলেশন টাইপ (Installation Type)</span>
          </label>
          <select
            value={value.installationType || ""}
            onChange={(e) => update("installationType", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          >
            <option value="">সিলেক্ট করুন (Select Installation)</option>
            <option value="Direct Plug & Play (সহজ প্লাগ অ্যান্ড প্লে)">Direct Plug & Play (সহজ প্লাগ অ্যান্ড প্লে)</option>
            <option value="Self-Adhesive / Strap-On (সহজে লাগানো যায়)">Self-Adhesive / Strap-On (সহজে লাগানো যায়)</option>
            <option value="Bolt-On Replacement (বোল্ট দিয়ে ফিটিং)">Bolt-On Replacement (বোল্ট দিয়ে ফিটিং)</option>
            <option value="Professional Installation Recommended (মেকানিক প্রয়োজন)">Professional Installation Recommended (মেকানিক প্রয়োজন)</option>
          </select>
        </div>

        {/* Safety & Certifications */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-sky-600" />
            <span>সার্টিফিকেশন ও নিরাপত্তা (Safety Standards)</span>
          </label>
          <input
            type="text"
            value={value.safetyCertifications || ""}
            onChange={(e) => update("safetyCertifications", e.target.value)}
            placeholder="e.g. DOT Certified, ECE 22.06, CE, RoHS, IP67 Waterproof"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Warranty Period */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-sky-600" />
            <span>ওয়ারেন্টি ও রিপ্লেসমেন্ট (Warranty Period)</span>
          </label>
          <input
            type="text"
            value={value.warrantyPeriod || ""}
            onChange={(e) => update("warrantyPeriod", e.target.value)}
            placeholder="e.g. 1 Year Replacement Warranty / 6 Months Brand Warranty"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-sky-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. China, Japan, India, Germany, Taiwan, South Korea"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
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
              যেকোনো বিশেষ পার্টস স্পেসিফিকেশন যোগ করুন (যেমন: Lumens, Sensor Type, Resistance)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-sky-700"
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
                  placeholder="লেবেল (যেমন: Lumens Brightness)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: 12,000 LM per pair)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-sky-500 focus:outline-hidden"
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
