"use client";

import { useState } from "react";
import {
  Trophy,
  Award,
  Layers,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Tag,
  Medal,
  Globe,
} from "lucide-react";

export interface SportsOutdoorAttributes {
  sportDiscipline?: string;
  equipmentType?: string;
  brand?: string;
  modelName?: string;
  sizeAgeGroup?: string;
  materialWoodType?: string;
  weightBalance?: string;
  tournamentApproval?: string;
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

export default function SportsOutdoorCategoryField({
  value = {},
  onChange,
  categoryName = "Sports & Outdoor Equipment",
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
      <div className="flex items-center justify-between rounded-xl border border-orange-200/80 bg-gradient-to-r from-orange-50/70 via-white to-amber-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shadow-xs">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              খেলাধুলা ও আউটডোর স্পোর্টস স্পেসিফিকেশন (Sports & Outdoor Equipment)
            </h3>
            <p className="text-xs text-slate-500">
              {categoryName} • ক্রিকেট, ফুটবল, ব্যাডমিন্টন, টেবিল টেনিস, ক্যারম, সাঁতার ও প্রফেশনাল গিয়ার
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-orange-100/80 px-2.5 py-1 text-[11px] font-medium text-orange-700">
          <Sparkles size={12} /> স্পোর্টস স্পেক্স
        </span>
      </div>

      {/* 1. Sport Discipline & Equipment Identification */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Tag size={15} className="text-orange-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ১. খেলাধুলার ধরণ ও সরঞ্জাম (Sport & Equipment Identification)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="খেলার ধরণ (Sport Discipline)"
            value={value.sportDiscipline}
            onChange={(v) => update("sportDiscipline", v)}
            options={[
              "Cricket / ক্রিকেট",
              "Football / Soccer / ফুটবল",
              "Badminton / ব্যাডমিন্টন",
              "Table Tennis / টেবিল টেনিস",
              "Carrom / ক্যারম বোর্ড",
              "Tennis / লন টেনিস",
              "Volleyball / ভলিবল",
              "Basketball / বাস্কেটবল",
              "Swimming & Pool / সাঁতার",
              "Skating & Cycling / স্কেটিং ও সাইক্লিং",
              "Chess & Board Games / দাবা ও ইনডোর গেমস",
            ]}
            placeholder="যেমন: Hockey, Billiards, Boxing..."
          />

          <SelectWithCustom
            label="সরঞ্জাম বা গিয়ারের ধরণ (Equipment / Gear Type)"
            value={value.equipmentType}
            onChange={(v) => update("equipmentType", v)}
            options={[
              "Cricket Bat / ক্রিকেট ব্যাট",
              "Cricket Ball / লেদার বা টেনিস বল",
              "Batting Pads & Gloves / প্যাড ও গ্লাভস",
              "Helmet & Guards / হেলমেট ও থাই গার্ড",
              "Football / ম্যাচ ফুটবল",
              "Goalkeeper Gloves & Shin Guards / কিপার গ্লাভস",
              "Badminton Racket / ব্যাডমিন্টন র‍্যাকেট",
              "Shuttlecock (Feather / Nylon) / কর্ক",
              "Table Tennis Bat & Balls / টিটি ব্যাট ও বল",
              "Carrom Board, Striker & Coins / ক্যারম বোর্ড",
              "Kit Bag & Travel Gear / স্পোর্টস কিটব্যাগ",
              "Air Pump & Needles / বল পাম্প",
              "Swim Goggles, Cap & Costume / সুইমিং গিয়ার",
              "Protective Knee/Elbow Guard / সেফটি গার্ড",
            ]}
            placeholder="যেমন: Goal Net, Referee Whistle, Grip..."
          />

          <SelectWithCustom
            label="ব্র্যান্ড (Brand / Manufacturer)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            options={[
              "SS (Sareen Sports)",
              "SG (Sanspareils Greenlands)",
              "CA Sports (Pakistan)",
              "Kookaburra",
              "MRF",
              "Yonex",
              "Li-Ning",
              "Victor",
              "Molten",
              "Mikasa",
              "Adidas",
              "Nike",
              "Nivia",
              "Cosco",
              "Stag",
              "GKI",
              "Speedo (Swimming)",
              "Siscaa (Carrom)",
              "Synco (Carrom)",
            ]}
            placeholder="ব্র্যান্ডের নাম লিখুন..."
          />
        </div>
      </div>

      {/* 2. Model, Size & Age Group */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Medal size={15} className="text-orange-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ২. মডেল, সাইজ ও গ্রেড (Model, Size & Age Group)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              মডেল / সংস্করণ (Model Name / Series)
            </label>
            <input
              type="text"
              value={value.modelName ?? ""}
              onChange={(e) => update("modelName", e.target.value)}
              placeholder="যেমন: Astrox 88D Pro, SS Master 5000, Premier League Ball"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <SelectWithCustom
            label="সাইজ বা বয়স শ্রেণী (Size / Age Category)"
            value={value.sizeAgeGroup}
            onChange={(v) => update("sizeAgeGroup", v)}
            options={[
              "Full Size / Short Handle (SH) - Adult",
              "Long Handle (LH) - Adult",
              "Size 6 (Youth / Teenager)",
              "Size 5 - Standard Official Football (Adult)",
              "Size 4 - Youth Football",
              "Size 3 - Junior Football",
              "34\" x 34\" Standard Tournament Carrom",
              "32\" x 32\" Regular Practice Carrom",
              "Standard G3/G4 Badminton Grip Size",
              "Universal Adult (Free Size)",
              "Kids / Junior",
            ]}
            placeholder="সাইজ লিখুন..."
          />

          <SelectWithCustom
            label="টুর্নামেন্ট অনুমোদন / মান (Standard / Approval)"
            value={value.tournamentApproval}
            onChange={(v) => update("tournamentApproval", v)}
            options={[
              "ICC Tournament Standard / প্রফেশনাল ম্যাচ গ্রেড",
              "FIFA Quality Pro / Match Ball Standard",
              "BWF Approved Tournament Grade (Badminton)",
              "ITTF Approved (Table Tennis)",
              "Club & Practice Grade",
              "National / State Level Approved",
              "Standard Recreational Use",
            ]}
            placeholder="অনুমোদনের মান লিখুন..."
          />
        </div>
      </div>

      {/* 3. Wood / Material & Balance */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Layers size={15} className="text-orange-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৩. কাঠ, মেটেরিয়াল ও ওজন ব্যালেন্স (Material & Balance)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectWithCustom
            label="কাঠ বা মূল মেটেরিয়াল (Wood / Material)"
            value={value.materialWoodType}
            onChange={(v) => update("materialWoodType", v)}
            options={[
              "Grade 1 Hand-Selected English Willow (ইংলিশ উইলো ব্যাট)",
              "Grade 2 English Willow",
              "Premium Kashmir Willow (কাশ্মীর উইলো ব্যাট)",
              "High-Grade Poplar Wood (টেপ টেনিস ব্যাট)",
              "100% High Modulus Carbon Graphite (র‍্যাকেট)",
              "Aluminum Carbon Composite (হালকা র‍্যাকেট)",
              "Hand-Stitched Textured PU Leather (ফুটবল)",
              "Waterproof High-Gloss Plywood (ক্যারম বোর্ড)",
              "Goose Feather Shuttlecock (হাঁসের পালক)",
              "Durable Nylon Shuttlecock (নাইলন কর্ক)",
              "Polycarbonate Anti-Fog UV Shield (সুইমিং গগলস)",
            ]}
            placeholder="মেটেরিয়াল লিখুন..."
          />

          <SelectWithCustom
            label="ওজন ও ব্যালেন্স (Weight & Balance)"
            value={value.weightBalance}
            onChange={(v) => update("weightBalance", v)}
            options={[
              "1180 - 1220 grams (লাইটওয়েট ব্যাট)",
              "1220 - 1260 grams (মিডিয়াম ওয়েট ব্যাট)",
              "80 - 84 grams / 4U (হেড-হেভি অ্যাটাকিং র‍্যাকেট)",
              "85 - 89 grams / 3U (অলরাউন্ড ব্যালেন্স র‍্যাকেট)",
              "410 - 450 grams (ফিফা অফিসিয়াল ম্যাচ ফুটবল)",
              "156 - 163 grams (অফিসিয়াল লেদার ক্রিকেট বল)",
              "15 grams (প্রফেশনাল ক্যারম স্ট্রাইকার)",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="ওজন বা ব্যালেন্স লিখুন..."
          />
        </div>
      </div>

      {/* 4. Warranty & Origin */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck size={15} className="text-orange-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৪. ওয়ারেন্টি ও উৎপাদনকারী দেশ (Warranty & Origin)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectWithCustom
            label="ওয়ারেন্টি গ্যারান্টি (Warranty Policy)"
            value={value.warranty}
            onChange={(v) => update("warranty", v)}
            options={[
              "Official 1 Year Frame Warranty (র‍্যাকেট)",
              "6 Months Manufacturing Warranty",
              "7 Days Checking / Replacement Guarantee",
              "Wood Grain Guarantee (ক্রিকেট ব্যাট)",
              "No Warranty (খেলাধুলার সরঞ্জাম চেক করে নিতে হবে)",
            ]}
            placeholder="কাস্টম ওয়ারেন্টি পলিসি লিখুন..."
          />

          <SelectWithCustom
            label="উৎপাদনকারী দেশ (Country of Origin)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            options={[
              "Bangladesh (মেইড ইন বাংলাদেশ)",
              "Pakistan (Sialkot - Sports Capital)",
              "India (Meerut / Jalandhar)",
              "Japan (Yonex Original)",
              "China",
              "Taiwan",
              "Thailand",
            ]}
            placeholder="অন্য দেশ লিখুন..."
          />
        </div>
      </div>

      {/* 5. Custom Specifications Builder */}
      <div className="rounded-xl border border-dashed border-orange-300 bg-orange-50/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              ৫. অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specifications)
            </h4>
            <p className="text-[11px] text-slate-500">
              উপরের তালিকার বাইরে যেকোনো বিশেষ স্পোর্টস ফিচার (যেমন: স্ট্রিং টেনশন, সুইট স্পট, গ্রিপ থিকনেস) থাকলে নিজে নাম ও ভ্যালু লিখে যোগ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-orange-700"
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
                  placeholder="ফিচারের নাম (যেমন: String Tension, Grains, Edge Thickness)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="মান / বর্ণনা (যেমন: 28-30 lbs Max Tension, 8-10 Straight Grains, 40mm Massive Edges)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
          className="text-[11px] font-medium text-orange-600 hover:underline"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
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
