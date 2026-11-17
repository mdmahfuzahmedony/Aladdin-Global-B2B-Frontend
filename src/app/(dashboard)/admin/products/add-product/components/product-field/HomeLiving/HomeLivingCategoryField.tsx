"use client";

import React, { useState } from "react";
import { Plus, Trash2, Layers, Maximize2, ShieldCheck, Wrench, Sparkles } from "lucide-react";

export interface HomeLivingFieldData {
  // Material & Construction
  primaryMaterial?: string;
  secondaryMaterial?: string;
  finishType?: string;
  color?: string;

  // Dimensions & Capacity
  length?: string;
  width?: string;
  height?: string;
  thickness?: string;
  dimensionUnit?: string;
  seatingCapacity?: string;
  bedSize?: string;
  weightCapacity?: string;

  // Features
  storageType?: string;
  mobility?: string;
  assemblyType?: string;
  roomType?: string;
  termiteProof?: string;
  waterResistant?: string;

  // Warranty & Origin
  warranty?: string;
  countryOfOrigin?: string;
  brand?: string;

  // Dynamic custom specifications: array of { label, value }
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function HomeLivingCategoryField({
  value = {},
  onChange,
  categoryName = "Home & Living",
}: Props) {
  const update = (key: string, v: any) => {
    if (key === "countryOfOrigin") {
      onChange({ ...value, countryOfOrigin: v, origin: v });
    } else {
      onChange({ ...value, [key]: v });
    }
  };

  // Custom specs handlers
  const customSpecs: Array<{ id: string; label: string; value: string }> =
    Array.isArray(value.customSpecs) ? value.customSpecs : [];

  const handleAddCustomSpec = () => {
    const newSpec = {
      id: "spec_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      label: "",
      value: "",
    };
    update("customSpecs", [...customSpecs, newSpec]);
  };

  const handleUpdateCustomSpec = (
    id: string,
    field: "label" | "value",
    val: string,
  ) => {
    const updated = customSpecs.map((item) =>
      item.id === id ? { ...item, [field]: val } : item,
    );
    update("customSpecs", updated);
  };

  const handleRemoveCustomSpec = (id: string) => {
    const updated = customSpecs.filter((item) => item.id !== id);
    update("customSpecs", updated);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D6A419]/20 text-[#12233F]">
              <Layers size={14} />
            </span>
            <h3 className="text-sm font-semibold text-slate-800">
              {categoryName} Specifications
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            এই ক্যাটাগরির পণ্যের উপাদান, সাইজ, ফিনিশিং ও ওয়ারেন্টি সংক্রান্ত তথ্য পূরণ করুন।
          </p>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* 1. MATERIAL & FINISH */}
        <div>
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Layers size={14} className="text-[#D6A419]" />
            <span>উপাদান ও ফিনিশিং (Material & Finish)</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectWithCustom
              label="প্রধান উপাদান (Primary Material)"
              value={value.primaryMaterial}
              onChange={(v) => update("primaryMaterial", v)}
              options={[
                "চিটাগাং সেগুন কাঠ (Chittagong Teak)",
                "বার্মাটিক সেগুন (Burma Teak)",
                "গামারি কাঠ (Gamari Wood)",
                "মেহগনি কাঠ (Mehgani Wood)",
                "মালয়েশিয়ান প্রসেসড উড (Processed Wood)",
                "MDF / Engineered Board",
                "পার্টিক্যাল বোর্ড (Particle Board)",
                "প্লাইউড (Commercial / Marine Plywood)",
                "স্টেইনলেস স্টিল (SS - Stainless Steel)",
                "মাইল্ড স্টিল (MS / Iron Pipe)",
                "ভেলভেট ফেব্রিক (Velvet Fabric)",
                "সিন্থেটিক লেদার / রেক্সিন (PU / Rexine)",
                "খাঁটি চামড়া (Genuine Leather)",
                "টেম্পার্ড গ্লাস (Tempered Glass)",
                "মার্বেল স্টোন (Natural / Artificial Marble)",
                "হাই-গ্রেড প্লাস্টিক (Virgin Polymer)",
              ]}
              placeholder="বা অন্য কোনো উপাদান লিখুন..."
            />

            <Input
              label="সেকেন্ডারি উপাদান / ফ্রেম (Secondary Material)"
              value={value.secondaryMaterial}
              onChange={(v) => update("secondaryMaterial", v)}
              placeholder="যেমন: SS লেগ, মেটাল ফ্রেম, ফোম কুশন"
            />

            <SelectWithCustom
              label="কালার ও ফিনিশ (Color & Finish)"
              value={value.finishType}
              onChange={(v) => update("finishType", v)}
              options={[
                "হাই-গ্লস ল্যাকার পলিশ (High Gloss Lacquer)",
                "ম্যাট ল্যাকার পলিশ (Matte Lacquer)",
                "অ্যান্টিক পলিশ (Antique Wood Polish)",
                "ন্যাচারাল সেগুন কালার (Natural Teak)",
                "ওয়ালনাট কালার (Walnut Finish)",
                "মেহগনি কালার (Mahogany Finish)",
                "ম্যাট ব্ল্যাক পাউডার কোটেড (Matte Black)",
                "সাদা / অফ-হোয়াইট (White / Off-White)",
                "গ্রে / চারকোল (Grey / Charcoal)",
                "গোল্ডেন ফিনিশ (Golden Metal Finish)",
              ]}
              placeholder="বা পছন্দের রঙ লিখুন..."
            />
          </div>
        </div>

        {/* 2. DIMENSIONS & SIZE */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Maximize2 size={14} className="text-[#D6A419]" />
            <span>পরিমাপ ও সাইজ (Dimensions & Size)</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <Input
              label="দৈর্ঘ্য (Length)"
              value={value.length}
              onChange={(v) => update("length", v)}
              placeholder="যেমন: 6 ফিট বা 72 ইঞ্চি"
            />

            <Input
              label="প্রস্থ / ডেপথ (Width / Depth)"
              value={value.width}
              onChange={(v) => update("width", v)}
              placeholder="যেমন: 3 ফিট বা 36 ইঞ্চি"
            />

            <Input
              label="উচ্চতা (Height)"
              value={value.height}
              onChange={(v) => update("height", v)}
              placeholder="যেমন: 30 ইঞ্চি বা 2.5 ফিট"
            />

            <Input
              label="পুরুত্ব (Thickness)"
              value={value.thickness}
              onChange={(v) => update("thickness", v)}
              placeholder="যেমন: 38mm বা 1.5 ইঞ্চি"
            />

            <Select
              label="ইউনিট (Unit)"
              value={value.dimensionUnit}
              onChange={(v) => update("dimensionUnit", v)}
              options={["ফুট (Feet)", "ইঞ্চি (Inches)", "সেন্টিমিটার (CM)", "মিলিমিটার (MM)"]}
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectWithCustom
              label="সিটিং / বেড সাইজ (Capacity / Size)"
              value={value.seatingCapacity}
              onChange={(v) => update("seatingCapacity", v)}
              options={[
                "কিং সাইজ বেড (King Size - 6'x7')",
                "কুইন সাইজ বেড (Queen Size - 5'x7')",
                "সেমি-ডাবল বেড (Semi-Double - 4'x7')",
                "সিঙ্গেল বেড (Single - 3'x7')",
                "১ সিটার (1 Seater)",
                "২ সিটার (2 Seater)",
                "৩ সিটার (3 Seater)",
                "৪ সিটার (4 Seater)",
                "৫ সিটার সোফা সেট (3+1+1)",
                "৬ সিটার ডাইনিং (6 Seater)",
                "৮ সিটার ডাইনিং (8 Seater)",
                "প্রযোজ্য নয় (N/A)",
              ]}
              placeholder="বা কাস্টম সাইজ লিখুন..."
            />

            <Input
              label="ওজন ধারণক্ষমতা (Weight Capacity / Load)"
              value={value.weightCapacity}
              onChange={(v) => update("weightCapacity", v)}
              placeholder="যেমন: 150 KG, 300 KG"
            />

            <SelectWithCustom
              label="স্টোরেজ সুবিধা (Storage Type)"
              value={value.storageType}
              onChange={(v) => update("storageType", v)}
              options={[
                "কোনো স্টোরেজ নেই (Without Storage)",
                "হাইড্রোলিক লিফট-আপ স্টোরেজ (Hydraulic Storage)",
                "বক্স স্টোরেজ (Box Storage)",
                "ড্রয়ার স্টোরেজ (Drawer Storage)",
                "ওপেন শেলফ (Open Shelves)",
                "লকার সিস্টেম (Lock & Key Locker)",
              ]}
              placeholder="বা স্টোরেজের বিবরণ লিখুন..."
            />
          </div>
        </div>

        {/* 3. ASSEMBLY & WARRANTY */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <Wrench size={14} className="text-[#D6A419]" />
            <span>সেটআপ, ব্যবহার ও সুবিধা (Setup & Features)</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              label="অ্যাসেম্বলি / ফিটিং (Assembly)"
              value={value.assemblyType}
              onChange={(v) => update("assemblyType", v)}
              options={[
                "সম্পূর্ণ তৈরি (Pre-Assembled / ফিটিং লাগবে না)",
                "ফিটিং প্রয়োজন (Requires Assembly / Knock Down)",
                "ডেলিভারির সময় ফ্রি ফিটিং করে দেওয়া হবে",
              ]}
            />

            <Select
              label="চাকা / মুভমেন্ট সুবিধা (Mobility)"
              value={value.mobility}
              onChange={(v) => update("mobility", v)}
              options={[
                "স্থির পায়া (Fixed Base / No Wheels)",
                "ব্রেক সহ ৪টি চাকা (Lockable Castor Wheels)",
                "রিভলভিং / ঘূর্ণায়মান (360° Revolving)",
                "উচ্চতা অ্যাডজাস্টেবল (Height Adjustable)",
              ]}
            />

            <Select
              label="ঘুণ ও পানি প্রতিরোধী (Protection)"
              value={value.termiteProof}
              onChange={(v) => update("termiteProof", v)}
              options={[
                "১০০% ঘুণ প্রতিরোধী ও কেমিক্যাল ট্রিটেড",
                "ওয়াটার রেজিস্ট্যান্ট / পানি সহনশীল",
                "ঘুণ ও পানি উভয়ই প্রতিরোধী",
                "স্ট্যান্ডার্ড কেয়ার প্রয়োজন",
              ]}
            />
          </div>
        </div>

        {/* 4. WARRANTY & ORIGIN */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <ShieldCheck size={14} className="text-[#D6A419]" />
            <span>ওয়ারেন্টি ও ব্র্যান্ড (Warranty & Brand)</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SelectWithCustom
              label="ওয়ারেন্টি / গ্যারান্টি (Warranty)"
              value={value.warranty}
              onChange={(v) => update("warranty", v)}
              options={[
                "কোনো ওয়ারেন্টি নেই (No Warranty)",
                "১ বছর ফ্রি সার্ভিস ওয়ারেন্টি (1 Year Service)",
                "২ বছর ফ্রি সার্ভিস ওয়ারেন্টি (2 Years Service)",
                "৫ বছর টিম্বার / কাঠের গ্যারান্টি (5 Years Timber)",
                "১০ বছর ঘুণ প্রতিরোধ গ্যারান্টি (10 Years Termite Guarantee)",
                "লাইফটাইম কাঠের গ্যারান্টি (Lifetime Timber Guarantee)",
              ]}
              placeholder="বা কাস্টম ওয়ারেন্টি লিখুন..."
            />

            <Input
              label="ব্র্যান্ড / প্রস্তুতকারক (Brand)"
              value={value.brand}
              onChange={(v) => update("brand", v)}
              placeholder="যেমন: Aladin Furniture, নিজস্ব কারখানা, Otobi"
            />

            <SelectWithCustom
              label="উৎপাদনকারী দেশ (Country of Origin)"
              value={value.countryOfOrigin || value.origin}
              onChange={(v) => update("countryOfOrigin", v)}
              options={[
                "বাংলাদেশ (Bangladesh)",
                "চীন (China)",
                "ভারত (India)",
                "ভিয়েতনাম (Vietnam)",
                "মালয়েশিয়া (Malaysia)",
                "থাইল্যান্ড (Thailand)",
                "তুরস্ক (Turkey)",
                "ইন্দোনেশিয়া (Indonesia)",
                "পাকিস্তান (Pakistan)",
                "জাপান (Japan)",
                "দক্ষিণ কোরিয়া (South Korea)",
                "সংযুক্ত আরব আমিরাত (UAE)",
                "সৌদি আরব (Saudi Arabia)",
                "যুক্তরাষ্ট্র (USA)",
                "যুক্তরাজ্য (UK)",
                "জার্মানি (Germany)",
                "ইতালি (Italy)",
                "ফ্রান্স (France)",
                "স্পেন (Spain)",
                "মিশর (Egypt)",
              ]}
              placeholder="যেকোনো দেশ লিখুন (যেমন: Turkey, Italy, Vietnam...)"
            />
          </div>
        </div>

        {/* 5. DYNAMIC CUSTOM SPECIFICATIONS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <Sparkles size={14} className="text-[#D6A419]" />
              <span>অতিরিক্ত কাস্টম স্পেসিফিকেশন (+ Custom Specs)</span>
            </div>

            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6A419] bg-[#D6A419]/10 px-3 py-1.5 text-xs font-semibold text-[#12233F] transition hover:bg-[#D6A419]/20"
            >
              <Plus size={14} />
              <span>+ স্পেক যোগ করুন</span>
            </button>
          </div>

          {customSpecs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
              নির্দিষ্ট কোনো স্পেসিফিকেশন থাকলে উপরে <strong>+ স্পেক যোগ করুন</strong> বাটনে ক্লিক করে ইচ্ছামতো ফিল্ড যুক্ত করতে পারেন (যেমন: ফোমের ডেনসিটি, রিমোট কন্ট্রোল, দরজার পাল্লার ধরন ইত্যাদি)।
            </p>
          ) : (
            <div className="space-y-2">
              {customSpecs.map((spec, index) => (
                <div
                  key={spec.id || index}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 transition focus-within:border-[#D6A419]"
                >
                  <div className="w-1/3 min-w-[120px]">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "label", e.target.value)
                      }
                      placeholder="স্পেকের নাম (যেমন: ফোমের ডেনসিটি)"
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#D6A419]"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "value", e.target.value)
                      }
                      placeholder="মান (যেমন: 32 Density High Rebound)"
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#D6A419]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSpec(spec.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-rose-500 hover:bg-rose-50 transition"
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
    </section>
  );
}

// ============================================================================
// HELPER UI COMPONENTS
// ============================================================================

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
      >
        <option value="">নির্বাচন করুন (Select)</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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
          className="text-[11px] text-[#D6A419] hover:underline"
        >
          {showCustomInput ? "তালিকা দেখুন" : "কাস্টম লিখুন"}
        </button>
      </div>

      {showCustomInput ? (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "কাস্টম মান লিখুন..."}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
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
