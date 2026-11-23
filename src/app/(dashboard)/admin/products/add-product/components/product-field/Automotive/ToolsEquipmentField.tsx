"use client";

import {
  Hammer,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Gauge,
  BatteryCharging,
  Layers,
  Wrench,
} from "lucide-react";

export interface ToolsEquipmentAttributes {
  toolEquipmentType?: string;
  brandMaker?: string;
  powerSourceInput?: string;
  capacityMaxRating?: string;
  displayDiagnostics?: string;
  includedAccessoriesCase?: string;
  materialDurability?: string;
  safetyFeatures?: string;
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

export default function ToolsEquipmentField({
  value = {},
  onChange,
  categoryName = "Tools & Equipment",
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

  const toolPresets = [
    "Smart OBD2 Bluetooth Automotive Scanner Diagnostic Tool",
    "Digital Portable Tire Inflator Air Compressor Pump (150 PSI Auto-Cut)",
    "Heavy Duty 3-Ton Hydraulic Low Profile Floor Trolley Jack",
    "12V Multi-function Car Jump Starter Power Bank (12000mAh / 1000A Peak)",
    "Professional 108-Piece Chrome Vanadium Mechanics Socket & Wrench Set",
    "Automotive 12V / 24V Smart Battery Charger & Desulfator (7-Stage)",
    "Heavy Duty Emergency Vehicle Towing Rope with Steel Hooks (5 Ton)",
    "Complete Roadside Emergency Breakdown Assistance Safety Kit",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-violet-200 bg-gradient-to-r from-violet-950 via-slate-900 to-purple-950 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500 text-white shadow-xs">
            <Hammer size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              টুলস, সরঞ্জাম ও ডায়াগনস্টিক স্পেসিফিকেশন (Tools & Diagnostic Specs)
            </h3>
            <p className="text-xs text-violet-200/80">
              OBD2 স্ক্যানার, এয়ার পাম্প, হাইড্রোলিক জ্যাক, জাম্প স্টার্টার ও মেকানিক টুলকিট
            </p>
          </div>
        </div>
        <span className="rounded-full bg-violet-500/20 border border-violet-400/40 px-3 py-1 text-xs font-semibold text-violet-300">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-violet-600" />
            <span>টুলস / ইকুইপমেন্ট টাইপ ও নাম (Tool Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="tool-presets"
            value={value.toolEquipmentType || ""}
            onChange={(e) => update("toolEquipmentType", e.target.value)}
            placeholder="উদাহরণ: Digital Portable Tire Inflator Air Compressor Pump 150 PSI"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
          <datalist id="tool-presets">
            {toolPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-violet-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Maker)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Launch, Autel, Baseus, Michelin, Total, Ingco, Bosch"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Power Source / Input */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <BatteryCharging size={14} className="text-violet-600" />
            <span>পাওয়ার সোর্স / ইনপুট (Power Source)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.powerSourceInput || ""}
            onChange={(e) => update("powerSourceInput", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          >
            <option value="">সিলেক্ট করুন (Select Power Source)</option>
            <option value="12V DC Car Cigarette Lighter Socket">12V DC Car Cigarette Socket (গাড়ির সকেট)</option>
            <option value="Built-in Rechargeable Lithium Battery">Rechargeable Lithium Battery (রিচার্জেবল ব্যাটারি)</option>
            <option value="AC 220V Plug & Play">AC 220V Electric Plug (ইলেকট্রিক প্লাগ)</option>
            <option value="Manual Hydraulic / Mechanical">Manual Hydraulic (ম্যানুয়াল মেকানিক্যাল)</option>
            <option value="OBD2 Port Powered">OBD2 Port Powered (ওবিডি২ পোর্ট চালিত)</option>
          </select>
        </div>

        {/* Capacity / Pressure / Rating */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-violet-600" />
            <span>ক্যাপাসিটি / প্রেশার / রেটিং (Capacity / Max Rating)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.capacityMaxRating || ""}
            onChange={(e) => update("capacityMaxRating", e.target.value)}
            placeholder="e.g. 150 PSI, 3 Ton Lifting Capacity, 1000A Peak Current"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Display / Diagnostics Features */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-violet-600" />
            <span>ডিসপ্লে ও স্মার্ট ফিচার (Display & Diagnostic Features)</span>
          </label>
          <input
            type="text"
            value={value.displayDiagnostics || ""}
            onChange={(e) => update("displayDiagnostics", e.target.value)}
            placeholder="e.g. Backlit Digital LCD, Bluetooth App, Auto-Stop, Error Code Clear"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Included Accessories & Storage Box */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Wrench size={14} className="text-violet-600" />
            <span>সংযুক্ত এক্সেসরিজ ও বক্স (Included Accessories & Case)</span>
          </label>
          <input
            type="text"
            value={value.includedAccessoriesCase || ""}
            onChange={(e) => update("includedAccessoriesCase", e.target.value)}
            placeholder="e.g. 3 Air Nozzles, Battery Clamps, Heavy-Duty Blow-Molded Case included"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Material & Durability */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-violet-600" />
            <span>ম্যাটেরিয়াল ও স্থায়িত্ব (Material & Durability)</span>
          </label>
          <input
            type="text"
            value={value.materialDurability || ""}
            onChange={(e) => update("materialDurability", e.target.value)}
            placeholder="e.g. Chrome Vanadium CR-V Steel, Industrial Heavy-Gauge Metal"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Warranty Period */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-violet-600" />
            <span>ওয়ারেন্টি ও রিপ্লেসমেন্ট (Warranty Period)</span>
          </label>
          <input
            type="text"
            value={value.warrantyPeriod || ""}
            onChange={(e) => update("warrantyPeriod", e.target.value)}
            placeholder="e.g. 1 Year Replacement Guarantee / 6 Months Service Warranty"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-violet-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Germany, Japan, USA, China, Taiwan"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
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
              যেকোনো বিশেষ প্যারামিটার যোগ করুন (যেমন: Airflow Rate, Battery Cells, Torque Range)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700"
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
                  placeholder="লেবেল (যেমন: Air Flow Rate)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-violet-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: 35 Liters/min)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-violet-500 focus:outline-hidden"
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
