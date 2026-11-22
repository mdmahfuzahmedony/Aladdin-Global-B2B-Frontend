"use client";

import {
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Hammer,
  Palette,
  Package,
} from "lucide-react";

export interface HandicraftsTraditionalAttributes {
  craftItemType?: string;
  artisanRegion?: string;
  materialComposition?: string;
  artTechnique?: string;
  dimensionsWeight?: string;
  finishCoating?: string;
  careInstructions?: string;
  packagingBoxType?: string;
  heritageSignificance?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function HandicraftsTraditionalField({
  value = {},
  onChange,
  categoryName = "Handicrafts & Traditional Art",
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

  const craftPresets = [
    "হাতে খোদাই করা কাঠের ইসলামিক ক্যালিগ্রাফি (Hand-carved Calligraphy)",
    "প্রাকৃতিক পাট ও লেদারের এক্সিকিউটিভ ব্যাগ ও ক্রাফট (Jute & Leather Crafts)",
    "টেরাকোটা ও মাটির ট্র্যাডিশনাল শোপিস (Terracotta & Pottery Art)",
    "বাঁশ ও বেতের হস্তশিল্প ল্যাম্প ও বাস্কেট (Bamboo & Cane Crafts)",
    "ব্রাস ও পিতলের রাজকীয় অ্যান্টিক শোপিস (Brass Antique Showpiece)",
    "হ্যান্ড-পেইন্টেড রিকশা আর্ট শো-প্লেট (Hand-Painted Rickshaw Art)",
    "ঐতিহ্যবাহী নকশিকাঁথা টেবিল রানার ও ওয়ালম্যাট (Nakshi Kantha Mat)",
    "হ্যান্ডমেড ক্লথ ডল ও ট্র্যাডিশনাল টয় (Handmade Traditional Dolls)",
    "ক্রিস্টাল ও গ্লাস কারুকাজ শো-পিস (Crystal & Glass Artcraft)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-teal-200/80 bg-gradient-to-r from-teal-50/70 via-white to-emerald-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 shadow-xs">
            <Hammer size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              হস্তশিল্প ও দেশীয় ঐতিহ্যবাহী আর্ট স্পেসিফিকেশন (Handicrafts & Folk Art)
            </h3>
            <p className="text-xs text-slate-500">
              কাঠের খোদাই, পাটজাত পণ্য, মাটির শিল্প, ব্রাস মেটাল ও রিকশা আর্টের বিবরণ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-teal-100/90 px-3 py-1 text-xs font-semibold text-teal-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-teal-600" />
            <span>হস্তশিল্পের ধরন / আইটেম টাইপ (Craft Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="craft-type-presets"
            value={value.craftItemType || ""}
            onChange={(e) => update("craftItemType", e.target.value)}
            placeholder="উদাহরণ: Handcrafted Wooden & Brass Islamic Calligraphy Tabletop"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
          <datalist id="craft-type-presets">
            {craftPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Region / Artisan Heritage */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-teal-600" />
            <span>কারিগর অঞ্চল / ঐতিহ্য (Artisan Region)</span>
          </label>
          <input
            type="text"
            value={value.artisanRegion || ""}
            onChange={(e) => update("artisanRegion", e.target.value)}
            placeholder="e.g. Sonargaon, Rajshahi, Jamalpur, Local Artisans"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>

        {/* Primary Material */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>উপাদান ও মাধ্যম (Material Composition)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.materialComposition || ""}
            onChange={(e) => update("materialComposition", e.target.value)}
            placeholder="e.g. Seasoned Teak Wood + Pure Brass / 100% Golden Jute"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>

        {/* Art Technique / Craftsmanship */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Palette size={14} className="text-teal-600" />
            <span>তৈরির কৌশল (Art Technique)</span>
          </label>
          <select
            value={value.artTechnique || ""}
            onChange={(e) => update("artTechnique", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          >
            <option value="">কৌশল নির্বাচন করুন</option>
            <option value="100% Hand Carved (হাতে নিখুঁতভাবে খোদাইকৃত)">১০০% হাতে খোদাইকৃত (Hand Carved)</option>
            <option value="Hand Woven (হাতে বোনা পাট বা সুতা)">হাতে বোনা (Hand Woven Jute/Cotton)</option>
            <option value="Pottery & Clay Baked (পোড়ামাটি ও টেরাকোটা)">পোড়ামাটি ও টেরাকোটা (Clay Baked)</option>
            <option value="Hand Painted Enamel (হাতে আঁকা এনামেল)">হাতে আঁকা লোকজ চিত্রকর্ম (Hand Painted)</option>
            <option value="Metal Casting & Engraving (মেটাল কাস্টিং)">মেটাল কাস্টিং ও ব্রাস খোদাই</option>
          </select>
        </div>

        {/* Dimensions & Weight */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-teal-600" />
            <span>পরিমাপ ও ওজন (Dimensions & Weight)</span>
          </label>
          <input
            type="text"
            value={value.dimensionsWeight || ""}
            onChange={(e) => update("dimensionsWeight", e.target.value)}
            placeholder="e.g. 10 x 8 x 2.5 Inch | Weight: 850 grams"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>

        {/* Finish & Coating */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>কোটিং ও ফিনিশ (Finish & Protective Coating)</span>
          </label>
          <input
            type="text"
            value={value.finishCoating || ""}
            onChange={(e) => update("finishCoating", e.target.value)}
            placeholder="e.g. Anti-Rust Golden Lacquer + Clear Wood Wax"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>

        {/* Care Instructions */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>রক্ষণাবেক্ষণ নির্দেশিকা (Care Instructions)</span>
          </label>
          <input
            type="text"
            value={value.careInstructions || ""}
            onChange={(e) => update("careInstructions", e.target.value)}
            placeholder="e.g. শুকনো সুতি কাপড় দিয়ে মুছুন, পানি থেকে দূরে রাখুন"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>

        {/* Packaging Box */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-teal-600" />
            <span>প্যাকেজিং (Protective Packaging)</span>
          </label>
          <input
            type="text"
            value={value.packagingBoxType || ""}
            onChange={(e) => update("packagingBoxType", e.target.value)}
            placeholder="e.g. ফোম কুশন রিজিড গিফট বক্স ও হ্যান্ডেল ব্যাগ সহ"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-teal-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh (হস্তশিল্প)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-teal-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700"
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
                  placeholder="স্পেকের নাম (e.g. কাঠের প্রজাতি)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. ১০০% মেহগনি বা সেগুন কাঠ)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-200"
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
