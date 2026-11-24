"use client";

import {
  Printer,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Gauge,
  Zap,
  Layers,
  Box,
  Wind,
} from "lucide-react";

export interface TextilePackagingAttributes {
  machineType?: string;
  brandMaker?: string;
  productionSpeed?: string;
  powerConsumption?: string;
  maxWorkingWidth?: string;
  materialCompatibility?: string;
  automationGrade?: string;
  airPressureRequirement?: string;
  machineDimensionsWeight?: string;
  warrantyService?: string;
  certifications?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function TextilePackagingField({
  value = {},
  onChange,
  categoryName = "Textile, Garments & Packaging Machinery",
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

  const textilePresets = [
    "High-Speed Direct Drive Direct-to-Garment Industrial Sewing Machine",
    "Computerized 4-Thread Overlock Sewing Machine (Automatic Thread Trimmer)",
    "Automatic Multi-Head Embroidery Machine (12 Needles / 4 Heads)",
    "Industrial Fabric Laser Cutting Machine with Auto-Feeding Conveyor",
    "Large Format Sublimation Textile Heat Press Transfer Machine (1.8m)",
    "Automatic High-Speed Box Strapping & Sealing Packaging Machine",
    "Continuous Rotary Band Sealer with Nitrogen Gas Flushing Machine",
    "Commercial Multi-Color Rotary Offset Printing & Packaging Machine",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-blue-900 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white shadow-xs">
            <Printer size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              গার্মেন্টস, টেক্সটাইল ও প্যাকেজিং মেশিনারি স্পেসিফিকেশন (Textile & Packaging Specs)
            </h3>
            <p className="text-xs text-blue-200/80">
              শিল্প কারখানা ও গার্মেন্টসের সেলাই মেশিন, ওভেন প্রিন্টিং, স্ট্র্যাপিং ও সিলিং মেশিনের তথ্য
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-500/20 border border-blue-400/40 px-3 py-1 text-xs font-semibold text-blue-300">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-blue-600" />
            <span>মেশিনের ধরন ও মডেল (Machine Type / Model)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="textile-machine-presets"
            value={value.machineType || ""}
            onChange={(e) => update("machineType", e.target.value)}
            placeholder="উদাহরণ: High-Speed Direct Drive Industrial Sewing Machine"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
          <datalist id="textile-machine-presets">
            {textilePresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-blue-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Maker)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Juki, Brother, Jack, Siruba, Heidelberg, Brother, Aladin"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Production Speed */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-blue-600" />
            <span>উৎপাদন গতি / স্পিড (Production Speed)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.productionSpeed || ""}
            onChange={(e) => update("productionSpeed", e.target.value)}
            placeholder="e.g. 5,000 stitches/min, 40-60 cartons/min, 1200 m/hr"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Power Consumption & Voltage */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Zap size={14} className="text-blue-600" />
            <span>বিদ্যুৎ খরচ ও ভোল্টেজ (Power Consumption / Voltage)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.powerConsumption || ""}
            onChange={(e) => update("powerConsumption", e.target.value)}
            placeholder="e.g. 550W Servo Motor (220V Single-Phase), 3.5 kW (380V)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Max Working / Printing Width */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-blue-600" />
            <span>সর্বোচ্চ কাজের প্রস্থ / সাইজ (Working / Printing Width)</span>
          </label>
          <input
            type="text"
            value={value.maxWorkingWidth || ""}
            onChange={(e) => update("maxWorkingWidth", e.target.value)}
            placeholder="e.g. Max Width 1600 mm, Max Stitch Length 5mm, Carton Height 600mm"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Automation Grade */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Box size={14} className="text-blue-600" />
            <span>অটোমেশন গ্রেড (Automation Grade)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.automationGrade || ""}
            onChange={(e) => update("automationGrade", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          >
            <option value="">সিলেক্ট করুন (Select Automation Grade)</option>
            <option value="Computerized Fully Automatic (স্মার্ট অটোমেটিক)">Computerized Fully Automatic (স্মার্ট অটোমেটিক)</option>
            <option value="Semi-Automatic with Servo Control">Semi-Automatic with Servo Control (সেমি-অটোমেটিক)</option>
            <option value="Manual Operator Driven">Manual Operator Driven (ম্যানুয়াল পরিচালিত)</option>
          </select>
        </div>

        {/* Material Compatibility */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-blue-600" />
            <span>উপযোগী উপাদান / ফেব্রিক (Material Compatibility)</span>
          </label>
          <input
            type="text"
            value={value.materialCompatibility || ""}
            onChange={(e) => update("materialCompatibility", e.target.value)}
            placeholder="e.g. Cotton, Denim, Silk, Non-woven, Corrugated Box, BOPP Film"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Air Pressure Requirement */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Wind size={14} className="text-blue-600" />
            <span>এয়ার প্রেশার চাহিদা (Pneumatic Air Pressure)</span>
          </label>
          <input
            type="text"
            value={value.airPressureRequirement || ""}
            onChange={(e) => update("airPressureRequirement", e.target.value)}
            placeholder="e.g. 0.5 - 0.8 MPa (6-8 Bar), Not Required (Electronic)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Dimensions & Weight */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-blue-600" />
            <span>মেশিন ডাইমেনশন ও ওজন (Dimensions & Weight)</span>
          </label>
          <input
            type="text"
            value={value.machineDimensionsWeight || ""}
            onChange={(e) => update("machineDimensionsWeight", e.target.value)}
            placeholder="e.g. 120 x 55 x 110 cm / 85 KG"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Warranty & Service Support */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>ওয়ারেন্টি ও সার্ভিস সাপোর্ট (Warranty & Support)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.warrantyService || ""}
            onChange={(e) => update("warrantyService", e.target.value)}
            placeholder="e.g. 1 Year Motor & PCB Warranty + Free Technician Training"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Certifications */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-blue-600" />
            <span>সার্টিফিকেশন ও মানদণ্ড (Certifications)</span>
          </label>
          <input
            type="text"
            value={value.certifications || ""}
            onChange={(e) => update("certifications", e.target.value)}
            placeholder="e.g. CE, ISO 9001, OEKO-TEX Standard Friendly"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-blue-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Japan, Germany, China, Taiwan, India"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specifications Section */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
        <div className="flex items-center justify-between pb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Add Custom Machine Specs)
            </h4>
            <p className="text-[11px] text-slate-500">
              যেকোনো বিশেষ প্যারামিটার যোগ করুন (যেমন: Needle Gauge, Sealing Temperature, Print Resolution DPI)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
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
                  placeholder="লেবেল (যেমন: Sealing Temperature)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: 0 - 300°C Adjustable)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="w-2/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
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
