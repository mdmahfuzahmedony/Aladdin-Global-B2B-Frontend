"use client";

import { useState } from "react";
import {
  PenTool,
  Tag,
  Package,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Box,
} from "lucide-react";

export interface StationeryAttributes {
  // Core Stationery Details
  itemType?: string;
  brand?: string;
  packSize?: string;
  paperGsm?: string;
  inkColor?: string;
  material?: string;
  dimensions?: string;
  warranty?: string;

  // Dynamic custom specifications: array of { id, label, value }
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function StationeryCategoryField({
  value = {},
  onChange,
  categoryName = "Stationery",
}: Props) {
  const update = (key: string, v: any) => {
    onChange({ ...value, [key]: v });
  };

  // Custom specs handlers
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
      <div className="flex items-center justify-between rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <PenTool size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              স্টেশনারি ও অফিস সাপ্লাই স্পেসিফিকেশন (Stationery & Supplies)
            </h4>
            <p className="text-xs text-slate-500">
              {categoryName} — পণ্যের ধরণ, ব্র্যান্ড, প্যাক সাইজ, পেপার কোয়ালিটি ও ম্যাটেরিয়াল তথ্য
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
        {/* 1. ITEM TYPE & BRAND */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Tag size={14} className="text-[#D6A419]" />
            <span>১. পণ্যের ধরণ ও ব্র্যান্ড (Item Type & Brand)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithCustom
              label="পণ্যের ধরণ (Item Type) *"
              value={value.itemType}
              onChange={(v) => update("itemType", v)}
              options={[
                "বলপেন / জেল পেন (Ball & Gel Pen)",
                "পেন্সিল ও শার্পনার (Pencil & Sharpener)",
                "নোটবুক ও খাতা (Notebook / Khata)",
                "অফিস ডায়েরি ও প্ল্যানার (Diary & Planner)",
                "স্ট্যাপলার ও পিন (Stapler & Pins)",
                "ফাইল ও ফোল্ডার (File & Folders)",
                "সায়েন্টিফিক ক্যালকুলেটর (Calculator)",
                "জ্যামিতি বক্স ও স্কেল (Geometry Box & Scale)",
                "হাইলাইটার ও মার্কার (Highlighter & Marker)",
                "কালার ও আর্ট সামগ্রী (Color & Art Supplies)",
                "আঠা ও স্কচটেপ (Glue & Adhesive Tape)",
                "কাঁচি ও পেপার কাটার (Scissors & Cutter)",
                "প্রিন্ট পেপার ও শিট (A4 & Offset Paper)",
                "বোর্ড ও ডাস্টার (Whiteboard & Duster)",
                "ক্লিপ ও রাবার ব্যান্ড (Clips & Bands)",
              ]}
              placeholder="অন্য পণ্যের ধরণ লিখুন..."
            />

            <SelectWithCustom
              label="ব্র্যান্ড / প্রস্তুতকারক (Brand) *"
              value={value.brand}
              onChange={(v) => update("brand", v)}
              options={[
                "ম্যাটাডোর (Matador)",
                "গুডলাক (Good Luck)",
                "ডেলি (Deli)",
                "ক্যাসিও (Casio)",
                "ফ্যাবার-ক্যাসেল (Faber-Castell)",
                "ডমস (Doms)",
                "ক্যামেল (Camel)",
                "ফ্লেয়ার (Flair)",
                "পেন্টেল (Pentel)",
                "পাইলট (Pilot)",
                "স্টেডলার (Staedtler)",
                "বশির আহমেদ ব্রাদার্স (Bashir)",
                "ফ্রেশ স্টেশনারি (Fresh)",
                "বসুন্ধরা পেপার (Bashundhara)",
              ]}
              placeholder="অন্য ব্র্যান্ডের নাম লিখুন..."
            />
          </div>
        </div>

        {/* 2. PACKAGING, PAPER & SPECS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Package size={14} className="text-[#D6A419]" />
            <span>২. প্যাক সাইজ, পেপার ও সাইজ (Pack & Dimensions)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithCustom
              label="প্যাক সাইজ / পরিমাণ (Pack Size)"
              value={value.packSize}
              onChange={(v) => update("packSize", v)}
              options={[
                "১ পিস (Single Pc)",
                "১ বক্স / ১২ পিস (Box of 12)",
                "১ বক্স / ১০ পিস (Box of 10)",
                "১ বক্স / ২০ পিস (Box of 20)",
                "১ প্যাকেট / ৫ পিস (Pack of 5)",
                "১ ডজন (1 Dozen)",
                "১ রিম / ৫০০ শিট (Ream of 500 Sheets)",
                "কম্প্লিট সেট (Complete Set)",
              ]}
              placeholder="প্যাক সাইজ লিখুন..."
            />

            <SelectWithCustom
              label="কাগজের মান (Paper GSM - খাতা/কাগজ হলে)"
              value={value.paperGsm}
              onChange={(v) => update("paperGsm", v)}
              options={[
                "70 GSM (স্ট্যান্ডার্ড খাতা/পেপার)",
                "80 GSM (প্রিমিয়াম নোটবুক/অফিস পেপার)",
                "100 GSM (আর্ট/প্রেজেন্টেশন পেপার)",
                "120 GSM (স্কেচবুক/কার্ড)",
                "200+ GSM (ড্রয়িং শিট/বোর্ড)",
                "প্রযোজ্য নয় (N/A)",
              ]}
              placeholder="GSM লিখুন..."
            />

            <SelectWithCustom
              label="সাইজ / মাপ (Dimensions / Format)"
              value={value.dimensions}
              onChange={(v) => update("dimensions", v)}
              options={[
                "A4 Size (210 × 297 mm)",
                "A5 Size (148 × 210 mm)",
                "B5 Size (176 × 250 mm)",
                "Legal Size (8.5 × 14 inch)",
                "পকেট সাইজ (Pocket Size)",
                "স্ট্যান্ডার্ড (Standard)",
              ]}
              placeholder="সাইজ লিখুন..."
            />
          </div>
        </div>

        {/* 3. COLOR, MATERIAL & WARRANTY */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Palette size={14} className="text-[#D6A419]" />
            <span>৩. রঙ, উপাদান ও ওয়ারেন্টি (Color, Material & Warranty)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithCustom
              label="রঙ / কালির রঙ (Color / Ink Color)"
              value={value.inkColor}
              onChange={(v) => update("inkColor", v)}
              options={[
                "কালো (Black)",
                "নীল (Blue)",
                "লাল (Red)",
                "সবুজ (Green)",
                "মাল্টিকালার / বিভিন্ন রঙ (Assorted / Multicolor)",
                "স্বচ্ছ / ট্রান্সপারেন্ট (Clear)",
              ]}
              placeholder="রঙের নাম লিখুন..."
            />

            <SelectWithCustom
              label="উপাদান (Primary Material)"
              value={value.material}
              onChange={(v) => update("material", v)}
              options={[
                "প্লাস্টিক (Plastic)",
                "মেটাল / স্টিল (Metal / Steel)",
                "কাগজ / পেপারবোর্ড (Paper / Board)",
                "কাঠ (Wood)",
                "লেদার / পিইউ লেদার (Leather / PU)",
                "সিলিকন / রাবার (Silicone / Rubber)",
              ]}
              placeholder="উপাদান লিখুন..."
            />

            <SelectWithCustom
              label="ওয়ারেন্টি (Warranty - ক্যালকুলেটর ইত্যাদির জন্য)"
              value={value.warranty}
              onChange={(v) => update("warranty", v)}
              options={[
                "কোনো ওয়ারেন্টি নেই (No Warranty)",
                "১ বছরের অফিসিয়াল ওয়ারেন্টি (1 Year)",
                "৩ বছরের অফিসিয়াল ওয়ারেন্টি (3 Years)",
                "৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি (7 Days)",
              ]}
              placeholder="ওয়ারেন্টি লিখুন..."
            />
          </div>
        </div>

        {/* 4. DYNAMIC CUSTOM SPECIFICATIONS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <Sparkles size={14} className="text-[#D6A419]" />
              <span>অতিরিক্ত কাস্টম স্পেসিফিকেশন (+ Custom Specs)</span>
            </div>
            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="inline-flex items-center gap-1 rounded-md bg-[#D6A419]/10 px-2.5 py-1 text-xs font-semibold text-[#8C6B0F] hover:bg-[#D6A419]/20 transition"
            >
              <Plus size={13} />
              <span>নতুন ফিল্ড যোগ করুন</span>
            </button>
          </div>

          {customSpecs.length === 0 ? (
            <p className="text-[11px] text-slate-400">
              প্রয়োজনে অন্যান্য স্টেশনারি স্পেসিফিকেশন যেমন: ব্যাটারি মডেল, নিব সাইজ (0.5mm / 0.7mm), ক্যাপ টাইপ ইত্যাদি যোগ করতে পারেন।
            </p>
          ) : (
            <div className="space-y-2.5">
              {customSpecs.map((spec) => (
                <div key={spec.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) =>
                      handleUpdateCustomSpec(spec.id, "label", e.target.value)
                    }
                    placeholder="লেবেল (যেমন: নিব সাইজ / ব্যাটারি টাইপ)"
                    className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      handleUpdateCustomSpec(spec.id, "value", e.target.value)
                    }
                    placeholder="মান (যেমন: 0.5 mm / LR44 Solar Dual Power)"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSpec(spec.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
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
    </div>
  );
}

// ============================================================================
// HELPER UI COMPONENTS
// ============================================================================

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
