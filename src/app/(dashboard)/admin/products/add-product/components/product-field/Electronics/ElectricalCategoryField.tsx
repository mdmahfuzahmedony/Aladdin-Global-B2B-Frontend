"use client";

import { useState } from "react";
import {
  Zap,
  Power,
  ShieldAlert,
  Gauge,
  Cpu,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Tag,
  Flame,
  Settings,
} from "lucide-react";

export interface ElectricalAttributes {
  applianceType?: string;
  brand?: string;
  modelNumber?: string;
  wattage?: string;
  operatingVoltage?: string;
  capacitySize?: string;
  powerPhase?: string;
  coilMaterial?: string;
  inverterTechnology?: string;
  safetyFeatures?: string;
  certifications?: string;
  warranty?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function ElectricalCategoryField({
  value = {},
  onChange,
  categoryName = "Electrical Appliances & Equipment",
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

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-orange-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 shadow-xs">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              ইলেকট্রিক্যাল ও অ্যাপ্লায়েন্স স্পেসিফিকেশন (Electrical & Power Specs)
            </h3>
            <p className="text-xs text-slate-500">
              {categoryName} • ফ্যান, এসি, ফ্রিজ, হিটার, পাম্প/মোটর, আইপিএস, তার, সুইচ ও পাওয়ার ইকুইপমেন্ট
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-1 text-[11px] font-medium text-amber-700">
          <Sparkles size={12} /> পাওয়ার ও হেভি-ডিউটি স্পেসিফিকেশন
        </span>
      </div>

      {/* 1. Appliance & Basic Identification */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Tag size={15} className="text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ১. পণ্য বা যন্ত্রের ধরণ ও ব্র্যান্ড (Appliance Identification)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="ইকুইপমেন্ট বা যন্ত্রের ধরণ (Appliance Type)"
            value={value.applianceType}
            onChange={(v) => update("applianceType", v)}
            options={[
              "Ceiling Fan / সিলিং ফ্যান",
              "Stand / Table Fan / টেবিল ফ্যান",
              "Exhaust Fan / এক্সজস্ট ফ্যান",
              "Rechargeable Fan / রিচার্জেবল ফ্যান",
              "Air Conditioner (AC) / এসি",
              "Refrigerator / ডিপ ফ্রিজ",
              "Washing Machine / ওয়াশিং মেশিন",
              "Water Heater / Geyser / গিজার",
              "Microwave / Electric Oven / ওভেন",
              "Rice Cooker / প্রেসার কুকার",
              "Blender / Grinder / জুসার",
              "Induction / Infrared Cooker / চুলা",
              "Electric Kettle / কেটলি",
              "IPS / UPS / ইনভার্টার",
              "Solar Panel / সোলার সিস্টেম",
              "Water Pump / মোটর ও পাম্প",
              "Cables & Wires / তার ও ক্যাবল",
              "Switch & Socket / সুইচ ও সকেট",
              "Circuit Breaker / MCB / ডিবি বক্স",
              "LED Bulb / Tube Light / লাইট",
              "Voltage Stabilizer / স্ট্যাবিলাইজার",
            ]}
            placeholder="যেমন: Air Cooler, Vacuum Cleaner, Generator..."
          />

          <SelectWithCustom
            label="ব্র্যান্ড (Brand / Manufacturer)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            options={[
              "Walton",
              "Singer",
              "Vision (RFL)",
              "Minister",
              "Gree",
              "General",
              "Haier",
              "Midea",
              "Hitachi",
              "Panasonic",
              "BRB Cables",
              "BBS Cables",
              "Partex Cables",
              "Click (RFL)",
              "Super Star (SSG)",
              "Gazi Pumps",
              "RFL Pumps",
              "Havells",
              "Philips",
              "Luminous",
              "Rahimafrooz",
              "Hamko",
              "Microtek",
            ]}
            placeholder="ব্র্যান্ডের নাম লিখুন..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              মডেল / কোড নম্বর (Model No / Item Code)
            </label>
            <input
              type="text"
              value={value.modelNumber ?? ""}
              onChange={(e) => update("modelNumber", e.target.value)}
              placeholder="যেমন: WSN-56, EcoCool-18, 1.5 HP Submersible"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Power & Electrical Load */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Power size={15} className="text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ২. পাওয়ার, ওয়াট ও ভোল্টেজ (Power, Wattage & Voltage)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <SelectWithCustom
            label="পাওয়ার রেটিং / ওয়াট (Power / Wattage)"
            value={value.wattage}
            onChange={(v) => update("wattage", v)}
            options={[
              "7W - 12W (LED Bulb)",
              "18W - 24W (Tube/Panel)",
              "55W - 75W (Energy Saving Fan)",
              "100W - 150W",
              "450W - 750W (Blender)",
              "1000W (Iron / Cooker)",
              "1500W - 2000W (Geyser/Heater)",
              "0.5 HP (Water Pump)",
              "1.0 HP (Water Pump)",
              "1.5 HP - 2.0 HP",
              "800 VA (IPS)",
              "1000 VA / 1200 VA (IPS)",
              "N/A (তার বা সুইচের ক্ষেত্রে প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 2200W, 3 HP, 1500VA..."
          />

          <SelectWithCustom
            label="ভোল্টেজ ও ফ্রিকোয়েন্সি (Voltage & Frequency)"
            value={value.operatingVoltage}
            onChange={(v) => update("operatingVoltage", v)}
            options={[
              "220V - 240V AC (50Hz Single Phase)",
              "110V - 220V Wide Voltage Range",
              "380V - 440V AC (3-Phase Heavy Duty)",
              "12V DC (Solar / Battery Direct)",
              "24V DC / 48V DC",
              "100V - 260V Low Voltage Operation",
            ]}
            placeholder="কাস্টম ভোল্টেজ রেটিং লিখুন..."
          />

          <SelectWithCustom
            label="ক্যাপাসিটি / টন / সাইজ (Capacity / Volume / Size)"
            value={value.capacitySize}
            onChange={(v) => update("capacitySize", v)}
            options={[
              "56 Inch (Ceiling Fan)",
              "48 Inch (Ceiling Fan)",
              "1.0 Ton (12000 BTU)",
              "1.5 Ton (18000 BTU)",
              "2.0 Ton (24000 BTU)",
              "150 - 200 Liters (Fridge)",
              "250 - 350 Liters (Fridge)",
              "10 - 15 Liters (Geyser)",
              "30 - 45 Liters (Geyser)",
              "1.8 Liters (Rice Cooker / Kettle)",
              "2.8 Liters (Rice Cooker)",
              "7.0 Kg (Washing Machine)",
              "8.5 Kg - 10 Kg (Washing Machine)",
              "1.3 RM / 1.5 RM / 2.5 RM (তারের সাইজ)",
            ]}
            placeholder="যেমন: 500 Liters, 100 Meter Coil..."
          />

          <SelectWithCustom
            label="পাওয়ার ফেজ (Power Phase)"
            value={value.powerPhase}
            onChange={(v) => update("powerPhase", v)}
            options={[
              "Single Phase (বাসাবাড়ির লাইন)",
              "Three Phase (কমার্শিয়াল / ইন্ডাস্ট্রিয়াল)",
              "DC Direct (সোলার বা ব্যাটারি চালিত)",
              "Universal / Dual Phase",
            ]}
            placeholder="ফেজ লিখুন..."
          />
        </div>
      </div>

      {/* 3. Build Quality, Inverter & Safety */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Settings size={15} className="text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৩. কয়েল মেটেরিয়াল, ইনভার্টার ও সুরক্ষা (Core Specs & Safety)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="কয়েল ও কন্ডাক্টর মেটেরিয়াল (Coil Material)"
            value={value.coilMaterial}
            onChange={(v) => update("coilMaterial", v)}
            options={[
              "100% Super Enamelled Pure Copper (১০০% তামা)",
              "High Grade Aluminum Winding",
              "Copper Clad Aluminum (CCA)",
              "Heavy Duty Electrolytic Copper 99.99%",
              "Flame Retardant Virgin Copper (FR Wire)",
              "Non-Metallic / Ceramic Element",
            ]}
            placeholder="মেটেরিয়াল লিখুন..."
          />

          <SelectWithCustom
            label="ইনভার্টার ও শক্তি সঞ্চয় (Inverter / Energy Star)"
            value={value.inverterTechnology}
            onChange={(v) => update("inverterTechnology", v)}
            options={[
              "Smart Inverter (Up to 70% Energy Saving)",
              "Dual Inverter Compressor",
              "Non-Inverter Standard",
              "5-Star Energy Efficiency Rating",
              "3-Star Energy Rating",
              "BLDC Motor (Ultra Low Power Consumption)",
              "N/A",
            ]}
            placeholder="যেমন: Eco Dual Inverter..."
          />

          <SelectWithCustom
            label="নিরাপত্তা ও প্রোটেকশন (Safety Features)"
            value={value.safetyFeatures}
            onChange={(v) => update("safetyFeatures", v)}
            options={[
              "Thermal Overload Protector (অতিরিক্ত তাপে অটো বন্ধ)",
              "Short Circuit & Surge Protection (ভোল্টেজ ওঠানামা নিরোধক)",
              "Fire Retardant Body & Shock Proof (অগ্নি ও শক নিরোধক)",
              "Dry Boil Auto Cut-off (পানি ছাড়া চালু হবে না)",
              "Earthing / Grounding Safety System",
              "IP65 / Waterproof Weather Protection",
            ]}
            placeholder="অন্যান্য সুরক্ষা ফিচার লিখুন..."
          />
        </div>
      </div>

      {/* 4. Standards, Warranty & Origin */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck size={15} className="text-amber-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৪. অনুমোদন, ওয়ারেন্টি ও তৈরি (Certification & Warranty)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="সার্টিফিকেশন ও অনুমোদন (Quality Standard)"
            value={value.certifications}
            onChange={(v) => update("certifications", v)}
            options={[
              "BSTI Certified (বিএসটিআই অনুমোদিত)",
              "ISO 9001:2015 Certified",
              "BSTI + CE European Standard",
              "RoHS Compliant & Lead Free",
              "CB Certificate Approved",
              "Standard Grade",
            ]}
            placeholder="সার্টিফিকেশন লিখুন..."
          />

          <SelectWithCustom
            label="ওয়ারেন্টি গ্যারান্টি (Warranty Policy)"
            value={value.warranty}
            onChange={(v) => update("warranty", v)}
            options={[
              "10 Years Compressor / Motor Warranty",
              "12 Years Motor Replacement Guarantee",
              "5 Years Official Warranty",
              "2 Years Full Warranty (Parts & Service)",
              "1 Year Official Brand Warranty",
              "6 Months Service Warranty",
              "No Warranty (চেক করে নিতে হবে)",
            ]}
            placeholder="কাস্টম ওয়ারেন্টি লিখুন..."
          />

          <SelectWithCustom
            label="উৎপাদনকারী দেশ (Country of Origin / Assembled)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            options={[
              "Bangladesh (মেইড ইন বাংলাদেশ)",
              "Japan Technology (Assembled in BD/China)",
              "China",
              "Thailand",
              "Malaysia",
              "India",
              "Germany",
              "South Korea",
            ]}
            placeholder="অন্য দেশ লিখুন..."
          />
        </div>
      </div>

      {/* 5. Custom Specifications Builder */}
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              ৫. অতিরিক্ত টেকনিক্যাল স্পেসিফিকেশন (Additional Technical Specs)
            </h4>
            <p className="text-[11px] text-slate-500">
              উপরের তালিকার বাইরে যেকোনো বিশেষ স্পেক্স থাকলে (যেমন: আরপিএম, শব্দ মাত্রা, পাইপের সাইজ, সোলার ইনপুট) নিজে লিখে যুক্ত করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700"
          >
            <Plus size={14} />
            <span>নতুন স্পেসিফিকেশন যোগ করুন</span>
          </button>
        </div>

        {customSpecs.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white/70 py-6 text-center text-xs text-slate-500">
            বর্তমানে কোনো অতিরিক্ত কাস্টম স্পেক্স নেই। বিশেষ কোনো তথ্য থাকলে উপরের বাটনে ক্লিক করুন।
          </div>
        ) : (
          <div className="space-y-2.5">
            {customSpecs.map((spec, index) => (
              <div
                key={spec.id}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs"
              >
                <div className="w-6 text-center text-xs font-bold text-slate-400">
                  #{index + 1}
                </div>
                <input
                  type="text"
                  placeholder="ফিচারের নাম (যেমন: RPM Speed, Noise Level, Suction Lift, Wire Core)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="মান / বর্ণনা (যেমন: 320 RPM, 45 dB, 25 Feet, 3 Core Flexible)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
                  title="মুছে ফেলুন"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectWithCustom({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const isCustom = Boolean(value && !options.includes(value));
  const [showCustomInput, setShowCustomInput] = useState(isCustom);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-[11px] font-medium text-amber-600 hover:underline"
        >
          {showCustomInput ? "তালিকা দেখুন" : "+ কাস্টম লিখুন"}
        </button>
      </div>

      {showCustomInput ? (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "কাস্টম মান লিখুন..."}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      ) : (
        <select
          value={value ?? ""}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setShowCustomInput(true);
            } else {
              onChange(e.target.value);
            }
          }}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        >
          <option value="">নির্বাচন করুন (Select)</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="__custom__">+ অন্য কিছু কাস্টম লিখুন...</option>
        </select>
      )}
    </div>
  );
}
