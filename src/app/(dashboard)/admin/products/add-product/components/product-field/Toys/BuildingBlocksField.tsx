"use client";

import {
  Boxes,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  Package,
  Layers,
} from "lucide-react";

export interface BuildingBlocksAttributes {
  blockItemType?: string;
  brand?: string;
  seriesName?: string;
  piecesCount?: string;
  brickSizeStandard?: string;
  recommendedAge?: string;
  materialType?: string;
  compatibilityLego?: string;
  storageBoxBucket?: string;
  manualIncluded?: string;
  chokingHazardWarning?: string;
  safetyCertifications?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function BuildingBlocksField({
  value = {},
  onChange,
  categoryName = "Building Blocks & Construction",
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

  const blockPresets = [
    "ক্লাসিক কালারফুল বিল্ডিং ব্লকস (Classic Interlocking Bricks)",
    "ম্যাগনেটিক কনস্ট্রাকশন টাইলস (Magnetic Building Tiles 3D)",
    "লার্জ সাইজ টডলার ডুপ্লো ব্লকস (Large Duplo-style Blocks)",
    "সিটি পুলিশ ও ফায়ার স্টেশন ব্লক সেট (City Police / Fire Station)",
    "টেকনিক মেকানিকাল গিয়ার ও কার ব্লক (Technic Mechanical Car Kit)",
    "আর্কিটেকচার ক্যাসল ও ডলহাউস ব্লক (Architecture Castle & Villa)",
    "স্পেসশিপ ও রকেট এক্সপ্লোরেশন ব্লক (Space Shuttle & Rocket)",
    "উডেন ক্রিয়েটিভ জিওমেট্রিক ব্লকস (Solid Natural Wooden Blocks)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-yellow-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shadow-xs">
            <Boxes size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              বিল্ডিং ব্লকস ও কনস্ট্রাকশন খেলনা স্পেসিফিকেশন (Building Blocks Specs)
            </h3>
            <p className="text-xs text-slate-500">
              লেগো-স্টাইল ব্লক, ম্যাগনেটিক টাইলস, মডেল আর্কিটেকচার ও মেকানিকাল সেটের বিবরণ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-amber-100/90 px-3 py-1 text-xs font-semibold text-amber-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-amber-600" />
            <span>ব্লক খেলনার ক্যাটাগরি / টাইপ (Block Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="block-type-presets"
            value={value.blockItemType || ""}
            onChange={(e) => update("blockItemType", e.target.value)}
            placeholder="উদাহরণ: DIY Creative Educational Building Blocks 500+ Pcs"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
          <datalist id="block-type-presets">
            {blockPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-amber-600" />
            <span>ব্র্যান্ড / সিরিজ (Brand / Series)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Lego, Mega Bloks, Magformers, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Pieces Count */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Scale size={14} className="text-amber-600" />
            <span>মোট পিস সংখ্যা (Pieces Count)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.piecesCount || ""}
            onChange={(e) => update("piecesCount", e.target.value)}
            placeholder="e.g. 500+ Pcs, 1000 Pcs, 72 Magnetic Tiles"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Brick Size Standard */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-amber-600" />
            <span>ব্লকের আকার / স্ট্যান্ডার্ড (Brick Size Standard)</span>
          </label>
          <select
            value={value.brickSizeStandard || ""}
            onChange={(e) => update("brickSizeStandard", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">সাইজ স্ট্যান্ডার্ড নির্বাচন করুন</option>
            <option value="Standard Classic Bricks (স্ট্যান্ডার্ড ক্লাসিক ব্লক)">স্ট্যান্ডার্ড ক্লাসিক ব্লক (Classic Size)</option>
            <option value="Large Duplo Bricks (ছোট বাচ্চাদের বড় সাইজ ব্লক)">ছোট বাচ্চাদের বড় সাইজ ব্লক (Duplo Size)</option>
            <option value="Micro / Nano Blocks (মাইক্রো ও ন্যানো ডিটেইলড ব্লক)">মাইক্রো ও ন্যানো ব্লক (Micro/Nano)</option>
            <option value="Magnetic Tiles (ম্যাগনেটিক থ্রিডি টাইলস)">ম্যাগনেটিক থ্রিডি টাইলস (Magnetic Tiles)</option>
            <option value="Wooden Geometry Blocks (কাঠের শেপ ব্লক)">কাঠের শেপ ব্লক (Solid Wood Blocks)</option>
          </select>
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age Group)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="1.5 - 3 Years (টডলারদের জন্য বড় ব্লক)">১.৫ - ৩ বছর (টডলারদের জন্য বড় ব্লক)</option>
            <option value="3 - 6 Years (৩ থেকে ৬ বছর বয়সী শিশু)">৩ - ৬ বছর (৩ থেকে ৬ বছর বয়সী শিশু)</option>
            <option value="6 - 10 Years (৬ থেকে ১০ বছর বয়সী শিশু)">৬ - ১০ বছর (৬ থেকে ১০ বছর বয়সী শিশু)</option>
            <option value="10+ Years (টিনএজ ও অ্যাডাল্ট বিল্ডার্স)">১০+ বছর (টিনএজ ও অ্যাডাল্ট বিল্ডার্স)</option>
            <option value="All Ages (পারিবারিক)">সবার জন্য উপযোগী</option>
          </select>
        </div>

        {/* Material Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>মেটেরিয়াল গ্রেড (Material Type)</span>
          </label>
          <input
            type="text"
            value={value.materialType || ""}
            onChange={(e) => update("materialType", e.target.value)}
            placeholder="e.g. 100% BPA-Free Food Grade Non-Toxic ABS Plastic"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Compatibility with Major Brands */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Layers size={14} className="text-amber-600" />
            <span>কম্প্যাটিবিলিটি (Major Brands Compatibility)</span>
          </label>
          <select
            value={value.compatibilityLego || ""}
            onChange={(e) => update("compatibilityLego", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          >
            <option value="">কম্প্যাটিবিলিটি স্ট্যাটাস</option>
            <option value="100% Compatible with Classic Lego (লেগো ব্রিকের সাথে সামঞ্জস্যপূর্ণ)">১০০% লেগো ক্লাসিক ব্লকের সাথে টাইট-ফিট সামঞ্জস্যপূর্ণ</option>
            <option value="Compatible with Duplo (ডুপ্লো ব্লকের সাথে সামঞ্জস্যপূর্ণ)">ডুপ্লো ব্লকের সাথে সামঞ্জস্যপূর্ণ</option>
            <option value="Proprietary Magnetic Lock (ম্যাগনেটিক লক)">নিজস্ব ম্যাগনেটিক লক সিস্টেম</option>
            <option value="Standalone Set (অন্যান্য ব্রিকের প্রয়োজন নেই)">স্ট্যান্ডঅ্যালোন সেট</option>
          </select>
        </div>

        {/* Storage Box / Bucket */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-amber-600" />
            <span>সংরক্ষণ বাক্স (Storage Box / Bucket)</span>
          </label>
          <input
            type="text"
            value={value.storageBoxBucket || ""}
            onChange={(e) => update("storageBoxBucket", e.target.value)}
            placeholder="e.g. ঢাকনা ও হ্যান্ডেল সহ মজবুত প্লাস্টিক স্টোরেজ বক্স"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Guide / Idea Manual */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-amber-600" />
            <span>আইডিয়া বুকলেট (Idea Booklet / Manual)</span>
          </label>
          <input
            type="text"
            value={value.manualIncluded || ""}
            onChange={(e) => update("manualIncluded", e.target.value)}
            placeholder="e.g. ১০০+ মডেল তৈরির রঙিন নির্দেশিকা বই সহ"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* Choking Hazard */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>চোকিং হ্যাজার্ড সতর্কতা (Choking Hazard)</span>
          </label>
          <input
            type="text"
            value={value.chokingHazardWarning || ""}
            onChange={(e) => update("chokingHazardWarning", e.target.value)}
            placeholder="e.g. ছোট পার্টস রয়েছে, ৩ বছরের কম বয়সী শিশুদের নাগালের বাইরে রাখুন"
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
            placeholder="e.g. China, Denmark, Bangladesh"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700"
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
                  placeholder="স্পেকের নাম (e.g. বেইসপ্লেট সাইজ)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. 10 x 10 Inch Green Baseplate)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-amber-500 focus:outline-hidden focus:ring-1 focus:ring-amber-200"
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
