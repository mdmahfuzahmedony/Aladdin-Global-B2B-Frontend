"use client";

import {
  Bike,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  Gauge,
  Sun,
} from "lucide-react";

export interface OutdoorRideOnAttributes {
  outdoorItemType?: string;
  brand?: string;
  modelSeries?: string;
  maxLoadCapacityKg?: string;
  recommendedAge?: string;
  wheelTypeMaterial?: string;
  frameStructureMaterial?: string;
  safetyFeaturesBrakes?: string;
  batteryMotorPower?: string;
  foldingPortable?: string;
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

export default function OutdoorRideOnField({
  value = {},
  onChange,
  categoryName = "Outdoor Toys & Ride-On Vehicles",
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

  const outdoorPresets = [
    "বেবি ট্রাইসাইকেল ও পুশ হ্যান্ডেল রিকশা (Kids Tricycle with Canopy)",
    "রিচার্জেবল ইলেকট্রিক বেবি জিপ / কার (12V Battery Ride-on Car)",
    "ফোল্ডেবল ৩-হুইল এলইডি কিক স্কুটার (3-Wheel LED Kick Scooter)",
    "কিডস ব্যালেন্স বাইক (Kids Training Balance Bike)",
    "ইনডোর/আউটডোর বেবি স্লাইড ও দোলনা সেট (Baby Slide & Swing Play Set)",
    "হাই-প্রেশার ওয়াটার গান ও পিচকারি (Long Range Water Soaker Gun)",
    "অটোমেটিক বাবল মেকার গান ও সলিউশন (Automatic Bubble Blower)",
    "ইনফ্লেটেবল ফ্যামিলি সুইমিং পুল (Inflatable Backyard Pool)",
    "কিডস ক্রিকেট ও মিনি ফুটবল গোল পোস্ট (Kids Sports Set)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-sky-200/80 bg-gradient-to-r from-sky-50/70 via-white to-cyan-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700 shadow-xs">
            <Bike size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              আউটডোর ও রাইড-অন যানবাহন স্পেসিফিকেশন (Outdoor & Ride-on Specs)
            </h3>
            <p className="text-xs text-slate-500">
              ট্রাইসাইকেল, ইলেকট্রিক বেবি কার, স্কুটার, স্লাইড ও আউটডোর খেলনার স্পেসিফিকেশন
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sky-100/90 px-3 py-1 text-xs font-semibold text-sky-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-sky-600" />
            <span>যানবাহন / আইটেমের ধরন (Ride-On Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="outdoor-type-presets"
            value={value.outdoorItemType || ""}
            onChange={(e) => update("outdoorItemType", e.target.value)}
            placeholder="উদাহরণ: Kids Tricycle with Adjustable Push Handle & Canopy"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
          <datalist id="outdoor-type-presets">
            {outdoorPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-sky-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. RFL, Playgro, Little Tikes, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Max Weight Load Capacity */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Scale size={14} className="text-sky-600" />
            <span>সর্বোচ্চ ওজন ধারণক্ষমতা (Max Load Capacity)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.maxLoadCapacityKg || ""}
            onChange={(e) => update("maxLoadCapacityKg", e.target.value)}
            placeholder="e.g. Up to 25 kg / 35 kg / 50 kg"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Wheel Type & Material */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Gauge size={14} className="text-sky-600" />
            <span>চাকার ধরন ও মেটেরিয়াল (Wheel Type)</span>
          </label>
          <select
            value={value.wheelTypeMaterial || ""}
            onChange={(e) => update("wheelTypeMaterial", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          >
            <option value="">চাকার ধরন নির্বাচন করুন</option>
            <option value="Flashing LED Light-Up PU Wheels (এলইডি লাইট PU চাকা)">এলইডি লাইট PU চাকা (Flashing PU)</option>
            <option value="Durable EVA Foam Anti-Puncture (ইভিএ ফোম চাকা)">ইভিএ ফোম অ্যান্টি-পাংচার চাকা (EVA Foam)</option>
            <option value="Inflatable Rubber Air Tires (ইনফ্লেটেবল রাবার টায়ার)">ইনফ্লেটেবল রাবার টায়ার (Air Tires)</option>
            <option value="Reinforced Plastic Wheels (মজবুত প্লাস্টিক চাকা)">মজবুত প্লাস্টিক চাকা (Molded Plastic)</option>
          </select>
        </div>

        {/* Frame Structure Material */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-sky-600" />
            <span>ফ্রেম ও বডি মেটেরিয়াল (Frame Material)</span>
          </label>
          <input
            type="text"
            value={value.frameStructureMaterial || ""}
            onChange={(e) => update("frameStructureMaterial", e.target.value)}
            placeholder="e.g. Heavy-Duty Carbon Steel Frame + Non-Toxic PP Body"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Safety Features & Brakes */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-sky-600" />
            <span>নিরাপত্তা ব্রেক ও গার্ড (Safety & Brakes)</span>
          </label>
          <input
            type="text"
            value={value.safetyFeaturesBrakes || ""}
            onChange={(e) => update("safetyFeaturesBrakes", e.target.value)}
            placeholder="e.g. রিয়ার ফুট ব্রেক, সেফটি বেল্ট, অ্যান্টি-টিপ ব্যাক সাপোর্ট"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Battery & Motor Power (For Electric Cars) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sun size={14} className="text-sky-600" />
            <span>ব্যাটারি ও মোটর (ইলেকট্রিক হলে)</span>
          </label>
          <input
            type="text"
            value={value.batteryMotorPower || ""}
            onChange={(e) => update("batteryMotorPower", e.target.value)}
            placeholder="e.g. 12V 7Ah Dual Motors / Manual Pedal Drive"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-sky-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age)</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="1 - 3 Years (বেবি ট্রাইসাইকেল ও ব্যালেন্স বাইক)">১ - ৩ বছর</option>
            <option value="3 - 6 Years (ইলেকট্রিক কার ও ৩-হুইল স্কুটার)">৩ - ৬ বছর</option>
            <option value="6 - 12 Years (কিক স্কুটার ও বাইসাইকেল)">৬ - ১২ বছর</option>
            <option value="All Ages (আউটডোর ও পারিবারিক)">সবার জন্য</option>
          </select>
        </div>

        {/* Folding / Portable */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-sky-600" />
            <span>ফোল্ডেবল সুবিধা (Foldable / Portable)</span>
          </label>
          <select
            value={value.foldingPortable || ""}
            onChange={(e) => update("foldingPortable", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          >
            <option value="">ফোল্ডিং ফিচার</option>
            <option value="Quick 1-Second Foldable (সহজ এক-ক্লিক ফোল্ড)">সহজ এক-ক্লিক ফোল্ড (1-Sec Foldable)</option>
            <option value="Non-Foldable Rigid Frame (স্থায়ী রিজিড ফ্রেম)">স্থায়ী রিজিড ফ্রেম (Non-Foldable)</option>
            <option value="Detachable Handle & Canopy (খুলে রাখা যায়)">খুলে রাখার উপযোগী হ্যান্ডেল ও ক্যানোপি</option>
          </select>
        </div>

        {/* Warranty */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-sky-600" />
            <span>ওয়ারেন্টি (Warranty)</span>
          </label>
          <input
            type="text"
            value={value.warranty || ""}
            onChange={(e) => update("warranty", e.target.value)}
            placeholder="e.g. 6 Months Frame / Battery Warranty"
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
            placeholder="e.g. Bangladesh, China, Taiwan"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-sky-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-sky-700"
          >
            <Plus size={14} />
            <span>নতুন স্পেক যোগ করুন</span>
          </button>
        </div>

        {customSpecs.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            কোনো অতিরিক্ত স্পেসিফিকেশন নেই। প্রয়োজনে উপরের বাটনে ক্লিক করে যোগ করতে পারেন।
          </p>
        ) : (
          <div className="space-y-2">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  placeholder="স্পেকের নাম (e.g. সিট অ্যাডজাস্টমেন্ট)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-1 focus:ring-sky-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. 3-Level Adjustable Height Padded Seat)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-sky-500 focus:outline-hidden focus:ring-1 focus:ring-sky-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
