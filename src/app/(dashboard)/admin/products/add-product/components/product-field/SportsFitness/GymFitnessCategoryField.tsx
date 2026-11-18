"use client";

import { useState } from "react";
import {
  Dumbbell,
  Scale,
  Layers,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  Tag,
  Activity,
  HeartPulse,
} from "lucide-react";

export interface GymFitnessAttributes {
  fitnessItemType?: string;
  brand?: string;
  modelName?: string;
  weightResistance?: string;
  material?: string;
  dimensionsSize?: string;
  gripAntiSlip?: string;
  maxLoadCapacity?: string;
  targetUser?: string;
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

export default function GymFitnessCategoryField({
  value = {},
  onChange,
  categoryName = "Gym & Fitness Accessories",
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
      <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shadow-xs">
            <Dumbbell size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              জিম ও ফিটনেস স্পেসিফিকেশন (Gym & Fitness Specs)
            </h3>
            <p className="text-xs text-slate-500">
              {categoryName} • ডাম্বেল, রেজিস্ট্যান্স ব্যান্ড, ইয়োগা ম্যাট, গ্রিপার, এব রোলার, বেল্ট ও কার্ডিও সরঞ্জাম
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
          <Sparkles size={12} /> ফিটনেস স্পেক্স
        </span>
      </div>

      {/* 1. Item Identification & Brand */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Tag size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ১. ফিটনেস আইটেম ও ব্র্যান্ড (Item & Brand Identification)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="আইটেম বা সরঞ্জামের ধরণ (Item Type)"
            value={value.fitnessItemType}
            onChange={(v) => update("fitnessItemType", v)}
            options={[
              "Dumbbells & Barbells / ডাম্বেল ও বারবেল",
              "Weight Plates & Kettlebell / প্লেট ও কেটলিবেল",
              "Resistance Bands & Loop / রেজিস্ট্যান্স ব্যান্ড",
              "Yoga Mat & Exercise Mat / ইয়োগা ম্যাট",
              "Push-up Bars & Handles / পুশ-আপ বার",
              "Pull-up & Chin-up Bar / পুল-আপ বার",
              "Ab Roller & Core Wheel / এব রোলার",
              "Skipping / Jump Rope / স্কিপিং রোপ",
              "Hand Gripper & Finger Exerciser / গ্রিপার",
              "Gym Gloves & Weightlifting Belt / গ্লাভস ও বেল্ট",
              "Wrist Wraps & Knee Sleeves / সাপোর্ট ব্যান্ড",
              "Gym Shaker & Sipper Bottle / শেকার বোতল",
              "Gym Duffle & Sports Bag / জিম ব্যাগ",
              "Treadmill & Walking Pad / ট্রেডমিল",
              "Exercise Bike / স্পিনিং বাইক",
              "Workout Bench & Squat Rack / ওয়ার্কআউট বেঞ্চ",
            ]}
            placeholder="যেমন: Stepper, Foam Roller, Suspension Trainer..."
          />

          <SelectWithCustom
            label="ব্র্যান্ড (Brand / Manufacturer)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            options={[
              "Decathlon / Domyos",
              "Nike",
              "Adidas",
              "Nivia",
              "Cosco",
              "Kettler",
              "Aolikes",
              "LiveUp",
              "ProsourceFit",
              "USI Universal",
              "Reebok",
              "Under Armour",
              "Spider Gym Gear",
              "Local Premium Made",
            ]}
            placeholder="ব্র্যান্ডের নাম লিখুন..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              মডেল / ভ্যারিয়েন্ট (Model Name / Code)
            </label>
            <input
              type="text"
              value={value.modelName ?? ""}
              onChange={(e) => update("modelName", e.target.value)}
              placeholder="যেমন: Hex Rubber Dumbbell 10kg, Pro 11-in-1 Band Set"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Weight, Resistance & Capacity */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Scale size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ২. ওজন, রেজিস্ট্যান্স ও লোড ক্ষমতা (Weight & Resistance)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="ওজন বা রেজিস্ট্যান্স লেভেল (Weight / Tension Level)"
            value={value.weightResistance}
            onChange={(v) => update("weightResistance", v)}
            options={[
              "2.5 kg Pair (মোট ৫ কেজি)",
              "5 kg Pair (মোট ১০ কেজি)",
              "7.5 kg Pair (মোট ১৫ কেজি)",
              "10 kg Pair (মোট ২০ কেজি)",
              "15 kg Single / Pair",
              "20 kg Single",
              "50 kg Adjustable Combo Set (বক্স সেট)",
              "10 - 60 kg Adjustable (হ্যান্ড গ্রিপার)",
              "15 - 35 lbs (Light Resistance)",
              "35 - 70 lbs (Medium Resistance)",
              "70 - 125 lbs (Heavy Resistance)",
              "11-in-1 Complete 150 lbs Tube Set",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 12.5 kg, 80 lbs, 25 kg..."
          />

          <SelectWithCustom
            label="সর্বোচ্চ ওজন বহন ক্ষমতা (Max Load Capacity)"
            value={value.maxLoadCapacity}
            onChange={(v) => update("maxLoadCapacity", v)}
            options={[
              "100 kg (Standard Home Use)",
              "120 kg (Reinforced)",
              "150 kg (Heavy Duty Bar/Bench)",
              "200 kg (Semi-Commercial)",
              "300 kg+ (Commercial Grade Olympic)",
              "N/A (প্রযোজ্য নয়)",
            ]}
            placeholder="যেমন: 250 kg..."
          />

          <SelectWithCustom
            label="টার্গেট ইউজার (Target User / Gender)"
            value={value.targetUser}
            onChange={(v) => update("targetUser", v)}
            options={[
              "Unisex Adult (পুরুষ ও নারী উভয়ের জন্য)",
              "Men (পুরুষদের জন্য)",
              "Women (নারীদের জন্য)",
              "Kids & Junior (শিশু-কিশোরদের জন্য)",
              "Senior Citizens (প্রবীণদের হালকা ব্যায়ামের জন্য)",
            ]}
            placeholder="ইউজার গ্রুপ লিখুন..."
          />
        </div>
      </div>

      {/* 3. Material, Size & Grip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Layers size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৩. উপাদান, সাইজ ও গ্রিপ টেক্সচার (Material & Dimensions)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="মূল উপাদান (Primary Material)"
            value={value.material}
            onChange={(v) => update("material", v)}
            options={[
              "Solid Cast Iron + Rubber Encased (রাবার কোটেড ঢালাই লোহা)",
              "Cast Iron Hexagonal Head + Chrome Handle",
              "High Density NBR / EVA Eco-friendly Foam",
              "100% Natural Latex (ন্যাচারাল ল্যাটেক্স)",
              "Stainless Steel + Heavy Duty Alloy",
              "Neoprene Coated Non-Slip Surface",
              "Anti-Burst Heavy-Duty PVC",
              "Breathable Microfiber + Silicone Padding (গ্লাভস)",
              "Genuine Leather / Reinforced PU Leather (বেল্ট)",
              "BPA-Free Food Grade Plastic (শেকার)",
            ]}
            placeholder="মেটেরিয়াল লিখুন..."
          />

          <SelectWithCustom
            label="সাইজ ও পরিমাপ (Dimensions / Size)"
            value={value.dimensionsSize}
            onChange={(v) => update("dimensionsSize", v)}
            options={[
              "6mm Thickness (183cm x 61cm Yoga Mat)",
              "8mm Thickness (Extra Cushioning Mat)",
              "10mm - 12mm High Density Joint-Protection Mat",
              "3 Meter Adjustable Speed Steel Wire (দড়ি)",
              "Medium (M) - 7.5 to 8.5 Inch Hand",
              "Large (L) - 8.5 to 9.5 Inch Hand",
              "Extra Large (XL)",
              "Standard Olympic 2-Inch Hole",
              "Standard 1-Inch Hole",
              "700 ml Capacity (Shaker)",
              "Free Size / Adjustable Strap",
            ]}
            placeholder="যেমন: 50x50 cm, 800ml, 4-Foot Bar..."
          />

          <SelectWithCustom
            label="গ্রিপ ও অ্যান্টি-স্লিপ সুবিধা (Grip & Non-Slip)"
            value={value.gripAntiSlip}
            onChange={(v) => update("gripAntiSlip", v)}
            options={[
              "Knurled Textured Ergonomic Steel Grip (নন-স্লিপ খাঁজকাটা)",
              "Double-Sided Non-Slip Textured Surface (দ্বিমুখী গ্রিপ)",
              "Silicone Honeycomb Palm Anti-Skid Protection",
              "Soft Sweat-Absorbent Foam Cushioned Handle",
              "Wide Contoured Lumbar Support (কোমর সুরক্ষা)",
              "Smooth 360-Degree Ball Bearing Rotation (দড়ির জন্য)",
            ]}
            placeholder="গ্রিপের ধরণ লিখুন..."
          />
        </div>
      </div>

      {/* 4. Warranty & Origin */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck size={15} className="text-emerald-600" />
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
              "Official 1 Year Replacement Warranty (ট্রেডমিল/মেশিন)",
              "Official 2 Years Motor Warranty",
              "6 Months Service Warranty",
              "7 Days Checking / Replacement Guarantee",
              "Lifetime Frame Warranty",
              "No Warranty (চেক করে নিতে হবে)",
            ]}
            placeholder="কাস্টম ওয়ারেন্টি পলিসি লিখুন..."
          />

          <SelectWithCustom
            label="উৎপাদনকারী দেশ (Country of Origin)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            options={[
              "Bangladesh (মেইড ইন বাংলাদেশ)",
              "China",
              "India",
              "Pakistan (Sialkot Gym Goods)",
              "Taiwan",
              "USA",
              "Germany",
            ]}
            placeholder="অন্য দেশ লিখুন..."
          />
        </div>
      </div>

      {/* 5. Custom Specifications Builder */}
      <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              ৫. অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specifications)
            </h4>
            <p className="text-[11px] text-slate-500">
              উপরের ফিল্ডগুলোর বাইরে বিশেষ কোনো তথ্য (যেমন: মোটর এইচপি, ডিসপ্লে ফিচার, ক্যাবল লেন্থ) থাকলে এখানে নিজে নাম ও ভ্যালু লিখে যোগ করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
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
                  placeholder="ফিচারের নাম (যেমন: Motor HP, Incline Levels, Wire Thickness)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="মান / বর্ণনা (যেমন: 2.5 HP Peak, 15 Auto Incline, 4.5mm Heavy Wire)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          className="text-[11px] font-medium text-emerald-600 hover:underline"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
