"use client";

import {
  Cog,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Gauge,
  Zap,
  Layers,
  Wrench,
  Cpu,
} from "lucide-react";

export interface MetalWoodMachineryAttributes {
  machineType?: string;
  brandMaker?: string;
  powerRating?: string;
  voltagePhase?: string;
  automationGrade?: string;
  controlSystem?: string;
  maxWorkingCapacity?: string;
  spindleSpeed?: string;
  machineWeightDimensions?: string;
  safetyCertifications?: string;
  warrantyAfterSales?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function MetalWoodMachineryField({
  value = {},
  onChange,
  categoryName = "Metal & Woodworking Machinery",
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

  const machinePresets = [
    "High-Precision CNC Metal Lathe Machine (Heavy Duty Bed)",
    "Fiber Laser Metal Sheet & Pipe Cutting Machine 3000W",
    "Heavy Duty Universal Vertical Milling Machine (DRO 3-Axis)",
    "Automatic Hydraulic Sheet Metal Bending Machine (Press Brake 100T)",
    "Multi-Spindle Woodworking CNC Router Machine 1325 (3-Axis)",
    "Heavy-Duty Industrial Sliding Table Panel Saw for Wood & Plywood",
    "Automatic Edge Banding Machine for Furniture Manufacturing",
    "Industrial Hydraulic Surface Grinding Machine (High Accuracy)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-900 p-4 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-xs">
            <Cog size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              মেটাল ও উডওয়ার্কিং মেশিনারি স্পেসিফিকেশন (Metal & Woodworking Specs)
            </h3>
            <p className="text-xs text-slate-300">
              সিএনসি লেদ, লেজার কাটার, মিলিং, প্যানেল স ও মেটাল ফ্যাব্রিকেশন মেশিনের তথ্য
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
            <span>মেশিনের ধরন ও মডেল (Machine Type / Model)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="metal-machine-presets"
            value={value.machineType || ""}
            onChange={(e) => update("machineType", e.target.value)}
            placeholder="উদাহরণ: Fiber Laser Metal Sheet Cutting Machine 3000W"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
          <datalist id="metal-machine-presets">
            {machinePresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-amber-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand / Manufacturer)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Bodor, Bystronic, Mazak, Haas, Nanxing, KDT, Aladin"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Power & Motor Rating */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Zap size={14} className="text-amber-600" />
            <span>মোটর পাওয়ার / রেটিং (Power / Motor Rating)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.powerRating || ""}
            onChange={(e) => update("powerRating", e.target.value)}
            placeholder="e.g. 5.5 kW (7.5 HP), 3000W Laser Source, 11 kW"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Voltage & Electrical Phase */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-amber-600" />
            <span>ভোল্টেজ ও ফেজ (Voltage & Electrical Phase)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.voltagePhase || ""}
            onChange={(e) => update("voltagePhase", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">সিলেক্ট করুন (Select Voltage & Phase)</option>
            <option value="380V - 440V 3-Phase 50Hz (Industrial)">380V - 440V 3-Phase 50Hz (ইন্ডাস্ট্রিয়াল থ্রি-ফেজ)</option>
            <option value="220V Single-Phase 50Hz (Commercial)">220V Single-Phase 50Hz (সিঙ্গেল ফেজ)</option>
            <option value="Dual Voltage 220V / 380V Switchable">Dual Voltage 220V / 380V (উভয় ফেজে ব্যবহারযোগ্য)</option>
            <option value="Manual / Non-Electric Mechanical">Manual / Non-Electric Mechanical (ম্যানুয়াল / বিদ্যুৎহীন)</option>
          </select>
        </div>

        {/* Automation Grade */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Cpu size={14} className="text-amber-600" />
            <span>অটোমেশন গ্রেড (Automation Grade)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.automationGrade || ""}
            onChange={(e) => update("automationGrade", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">সিলেক্ট করুন (Select Automation)</option>
            <option value="Full Automatic CNC Computerized">Full Automatic CNC Computerized (সম্পূর্ণ অটোমেটিক)</option>
            <option value="Semi-Automatic with Digital Readout">Semi-Automatic (সেমি-অটোমেটিক ডিআরও)</option>
            <option value="Manual Heavy Duty Conventional">Manual Conventional (ম্যানুয়াল কনভেনশনাল)</option>
          </select>
        </div>

        {/* Control System / Software */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Cpu size={14} className="text-amber-600" />
            <span>কন্ট্রোল সিস্টেম / সফটওয়্যার (Control System / Software)</span>
          </label>
          <input
            type="text"
            value={value.controlSystem || ""}
            onChange={(e) => update("controlSystem", e.target.value)}
            placeholder="e.g. CypCut, Fanuc, Siemens, DSP Handheld, Mach3, PLC"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Working Area & Capacity */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-amber-600" />
            <span>ওয়ার্কিং এরিয়া ও ক্যাপাসিটি (Work Area / Max Capacity)</span>
          </label>
          <input
            type="text"
            value={value.maxWorkingCapacity || ""}
            onChange={(e) => update("maxWorkingCapacity", e.target.value)}
            placeholder="e.g. 1500x3000 mm Table, Max Thickness 20mm Carbon Steel"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Spindle / Rotation Speed */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-amber-600" />
            <span>স্পিন্ডল স্পিড / আরপিএম (Spindle Speed / RPM)</span>
          </label>
          <input
            type="text"
            value={value.spindleSpeed || ""}
            onChange={(e) => update("spindleSpeed", e.target.value)}
            placeholder="e.g. 0 - 24,000 RPM (Air Cooled Spindle), 45-2000 RPM Lathe"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Weight & Dimensions */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-amber-600" />
            <span>ওজন ও মাপ (Weight & Dimensions)</span>
          </label>
          <input
            type="text"
            value={value.machineWeightDimensions || ""}
            onChange={(e) => update("machineWeightDimensions", e.target.value)}
            placeholder="e.g. 2,800 KG, 3800 x 2200 x 1850 mm"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Warranty & After-Sales Service */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>ওয়ারেন্টি ও বিক্রয়োত্তর সেবা (Warranty & Service)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.warrantyAfterSales || ""}
            onChange={(e) => update("warrantyAfterSales", e.target.value)}
            placeholder="e.g. 2 Years Comprehensive Warranty + Free Onsite Installation"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Safety & Certifications */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>সার্টিফিকেশন ও নিরাপত্তা (Safety Standards)</span>
          </label>
          <input
            type="text"
            value={value.safetyCertifications || ""}
            onChange={(e) => update("safetyCertifications", e.target.value)}
            placeholder="e.g. CE Certified, ISO 9001:2015, Emergency Stop Protection"
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
            placeholder="e.g. Germany, Japan, China, Taiwan, India, Italy"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
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
              যেকোনো বিশেষ প্যারামিটার যোগ করুন (যেমন: Positioning Accuracy, Laser Source Brand, Chuck Size)
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
                  placeholder="লেবেল (যেমন: Positioning Accuracy)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="মান (যেমন: ±0.03 mm)"
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
