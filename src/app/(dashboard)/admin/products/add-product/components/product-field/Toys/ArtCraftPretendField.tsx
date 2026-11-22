"use client";

import {
  Palette,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  Brush,
  PartyPopper,
  Package,
} from "lucide-react";

export interface ArtCraftPretendAttributes {
  artPretendItemType?: string;
  brand?: string;
  colorsTubsToolsCount?: string;
  nonToxicWashableCertificate?: string;
  recommendedAge?: string;
  accessoriesComponentsIncluded?: string;
  pretendPlayTheme?: string;
  reusableDryErase?: string;
  storageCasePackaging?: string;
  safetyChokingHazard?: string;
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

export default function ArtCraftPretendField({
  value = {},
  onChange,
  categoryName = "Arts, Crafts, Pretend Play & Party",
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

  const artPresets = [
    "নন-টক্সিক রঙিন প্লে ডোহ ও ক্লে সেট (Play Dough / Clay Kit)",
    "কিডস ওয়াটার কালার ও ড্রয়িং আর্ট সেট (Complete Art & Painting Box)",
    "বাচ্চাদের কিচেন রান্নাবান্না কুকিং সেট (Kids Pretend Kitchen Set)",
    "প্রিটেন্ড ডক্টর ক্লিনিক ও নার্সিং সেট (Kids Doctor Pretend Play Kit)",
    "টুলস মেকানিক ওয়্যারহাউস ওয়ার্কবেঞ্চ (Kids DIY Workbench Tool Set)",
    "ডিআইওয়াই ব্রেসলেট ও জুয়েলারি মেকিং বিডস (Jewelry Making Beads Set)",
    "ম্যাগনেটিক ম্যাজিক ড্রয়িং স্লেট (Magnetic Erasable Drawing Board)",
    "কালারফুল অরিগামি ও ক্রাফট পেপার (Origami Folding Craft Paper)",
    "বার্থডে থিম ডেকোরেশন ও মেটালিক বেলুন (Birthday Party Decoration Kit)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50/70 via-white to-purple-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700 shadow-xs">
            <Palette size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              আর্ট, ক্রাফট, প্রিটেন্ড প্লে ও পার্টি স্পেসিফিকেশন (Art & Pretend Specs)
            </h3>
            <p className="text-xs text-slate-500">
              প্লে ডোহ, পেইন্টিং আর্ট বক্স, কিচেন সেট, ডক্টর কিট ও পার্টি সামগ্রীর বিবরণ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-violet-100/90 px-3 py-1 text-xs font-semibold text-violet-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-violet-600" />
            <span>আইটেমের ধরন (Art / Pretend Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="art-type-presets"
            value={value.artPretendItemType || ""}
            onChange={(e) => update("artPretendItemType", e.target.value)}
            placeholder="উদাহরণ: Non-Toxic DIY Colorful Play Dough Modeling Clay 24 Tubs"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
          <datalist id="art-type-presets">
            {artPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-violet-600" />
            <span>ব্র্যান্ড / মেকার (Brand)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Play-Doh, Crayola, Faber-Castell, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Colors / Tubs / Tools Count */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Brush size={14} className="text-violet-600" />
            <span>রং / টাব / টুলের সংখ্যা (Colors & Tools Count)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.colorsTubsToolsCount || ""}
            onChange={(e) => update("colorsTubsToolsCount", e.target.value)}
            placeholder="e.g. 24 Color Tubs + 12 Cutters / 168-Piece Art Set"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Non-Toxic & Washable Safety */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-violet-600" />
            <span>নিরাপত্তা ও ওয়াশেবল সনদ (Safety Certification)</span>
          </label>
          <select
            value={value.nonToxicWashableCertificate || ""}
            onChange={(e) => update("nonToxicWashableCertificate", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          >
            <option value="">নিরাপত্তা গ্রেড নির্বাচন করুন</option>
            <option value="100% Non-Toxic & Easily Washable (সম্পূর্ণ বিষমুক্ত ও সাবান-পানিতে সহজে ধোয়া যায়)">১০০% বিষমুক্ত ও সহজে ধোয়া যায় (Non-Toxic & Washable)</option>
            <option value="Food-Grade Ingredients Wheat Dough (খাদ্য উপাদান দিয়ে তৈরি)">খাদ্য উপাদান ও আটা দিয়ে তৈরি নিরাপদ ক্লে</option>
            <option value="ASTM D-4236 / EN71 Child Safe (আন্তর্জাতিক চাইল্ড সেফটি সনদপ্রাপ্ত)">আন্তর্জাতিক চাইল্ড সেফটি সনদপ্রাপ্ত</option>
          </select>
        </div>

        {/* Pretend Play Theme / Role */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <PartyPopper size={14} className="text-violet-600" />
            <span>প্রিটেন্ড থিম / রোলপ্লে (Roleplay Theme)</span>
          </label>
          <input
            type="text"
            value={value.pretendPlayTheme || ""}
            onChange={(e) => update("pretendPlayTheme", e.target.value)}
            placeholder="e.g. Chef / Kitchen, Doctor Clinic, Mechanic Workbench, Birthday"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Accessories / Components Included */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-violet-600" />
            <span>অনুষঙ্গ ও কম্পোনেন্টস (Included Accessories)</span>
          </label>
          <input
            type="text"
            value={value.accessoriesComponentsIncluded || ""}
            onChange={(e) => update("accessoriesComponentsIncluded", e.target.value)}
            placeholder="e.g. প্রেসার স্ট্যাম্পার, কাটার রোলার, তেল-মশলার জার, স্টেথোস্কোপ, থার্মোমিটার"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Storage Case / Suitcase */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-violet-600" />
            <span>সংরক্ষণ ও ক্যারি কেস (Storage Box / Case)</span>
          </label>
          <input
            type="text"
            value={value.storageCasePackaging || ""}
            onChange={(e) => update("storageCasePackaging", e.target.value)}
            placeholder="e.g. হ্যান্ডেল সহ কমপ্যাক্ট স্যুটকেস বক্স"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-violet-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age)</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="2 - 5 Years (ছোট শিশুদের সহজ আর্ট ও ক্লে)">২ - ৫ বছর</option>
            <option value="5 - 8 Years (প্রিস্কুল ও প্রাইমারি ক্রাফট)">৫ - ৮ বছর</option>
            <option value="8+ Years (অ্যাডভান্সড আর্ট ও জুয়েলারি বিডস)">৮+ বছর</option>
            <option value="All Ages (পারিবারিক আনন্দ)">সবার জন্য</option>
          </select>
        </div>

        {/* Safety Choking Hazard */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-violet-600" />
            <span>নিরাপত্তা সতর্কতা (Choking Hazard)</span>
          </label>
          <input
            type="text"
            value={value.safetyChokingHazard || ""}
            onChange={(e) => update("safetyChokingHazard", e.target.value)}
            placeholder="e.g. ছোট বিডস রয়েছে, ছোট শিশুদের মুখে দেওয়া থেকে বিরত রাখুন"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-violet-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh, China, Thailand"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700"
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
                  placeholder="স্পেকের নাম (e.g. মোমের ধরন)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-1 focus:ring-violet-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. Natural Beeswax Crayons)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-violet-500 focus:outline-hidden focus:ring-1 focus:ring-violet-200"
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
