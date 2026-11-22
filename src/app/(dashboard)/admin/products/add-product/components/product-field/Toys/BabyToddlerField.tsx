"use client";

import {
  Baby,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  Music,
  Heart,
  Volume2,
} from "lucide-react";

export interface BabyToddlerAttributes {
  babyItemType?: string;
  brand?: string;
  ageRecommendationMonths?: string;
  bpaFreeFoodGrade?: string;
  musicAudioFeatures?: string;
  batteryRechargeableType?: string;
  materialPlushSilicone?: string;
  teethingSafety?: string;
  washableHygiene?: string;
  sensoryDevelopmentFocus?: string;
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

export default function BabyToddlerField({
  value = {},
  onChange,
  categoryName = "Baby & Toddler Musical Toys",
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

  const babyPresets = [
    "টকিং অ্যান্ড ড্যান্সিং ক্যাকটাস খেলনা (Dancing Talking Cactus)",
    "সফট সিলিকন ফুড-গ্রেড বেবি টিথার (BPA-Free Silicone Teether)",
    "কালারফুল বেবি ঝুনঝুনি ও রেটল সেট (Non-toxic Baby Rattle Set)",
    "মিউজিক্যাল ক্রিব মোবাইল উইথ প্রজেকশন (Crib Mobile with Light & Sound)",
    "ইলেকট্রনিক বেবি পিয়ানো ও ড্রাম টয় (Baby Electronic Piano & Drum)",
    "সেন্সরি গ্র্যাবিং ও টেক্সচার্ড বল সেট (Sensory Textured Ball Set)",
    "নরম কাপড়ের মিউজিক্যাল অ্যাক্টিভিটি বুক (Cloth Crinkle Book)",
    "ফ্রিকশন পুশ অ্যান্ড গো কার সেট (Push & Go Friction Vehicles)",
    "রেইনবো স্ট্যাকিং রিংস ও শেপ সর্টার (Stacking Rings & Shape Sorter)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-purple-200/80 bg-gradient-to-r from-purple-50/70 via-white to-fuchsia-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 shadow-xs">
            <Baby size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              বেবি ও টডলার খেলনা স্পেসিফিকেশন (Baby & Toddler Toys Specs)
            </h3>
            <p className="text-xs text-slate-500">
              টকিং ক্যাকটাস, মিউজিক্যাল টয়, টিথার, ঝুনঝুনি ও সেন্সরি খেলনার বিস্তারিত বৈশিষ্ট্য
            </p>
          </div>
        </div>
        <span className="rounded-full bg-purple-100/90 px-3 py-1 text-xs font-semibold text-purple-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-purple-600" />
            <span>বেবি খেলনার ধরন (Baby Toy Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="baby-type-presets"
            value={value.babyItemType || ""}
            onChange={(e) => update("babyItemType", e.target.value)}
            placeholder="উদাহরণ: Rechargeable Dancing Talking Cactus Musical Baby Toy"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
          <datalist id="baby-type-presets">
            {babyPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-purple-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Fisher-Price, VTech, Chicco, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Age Recommendation (Months / Years) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Baby size={14} className="text-purple-600" />
            <span>উপযুক্ত বয়সসীমা (Age Group Months)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.ageRecommendationMonths || ""}
            onChange={(e) => update("ageRecommendationMonths", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="0 - 6 Months (নবজাতক ও প্রাথমিক রেটল)">০ - ৬ মাস (নবজাতক ও প্রাথমিক রেটল)</option>
            <option value="6 - 12 Months (দাঁত ওঠা ও সেন্সরি টিথার)">৬ - ১২ মাস (দাঁত ওঠা ও সেন্সরি টিথার)</option>
            <option value="1 - 3 Years (টডলার ও মিউজিক্যাল টয়)">১ - ৩ বছর (টডলার ও মিউজিক্যাল টয়)</option>
            <option value="0 - 5 Years (বাচ্চাদের সার্বজনীন খেলনা)">০ - ৫ বছর (সার্বজনীন খেলনা)</option>
          </select>
        </div>

        {/* Music / Audio Features */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Music size={14} className="text-purple-600" />
            <span>মিউজিক ও ভয়েস ফিচার (Music & Voice)</span>
          </label>
          <input
            type="text"
            value={value.musicAudioFeatures || ""}
            onChange={(e) => update("musicAudioFeatures", e.target.value)}
            placeholder="e.g. 120 Melodies + Voice Mimicking Recorder"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Battery / Rechargeable */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Volume2 size={14} className="text-purple-600" />
            <span>পাওয়ার ও চার্জিং (Battery / Rechargeable)</span>
          </label>
          <select
            value={value.batteryRechargeableType || ""}
            onChange={(e) => update("batteryRechargeableType", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          >
            <option value="">পাওয়ার টাইপ নির্বাচন করুন</option>
            <option value="Built-in USB Rechargeable Lithium Battery (ইউএসবি রিচার্জেবল)">USB রিচার্জেবল লিথিয়াম ব্যাটারি</option>
            <option value="3 x AA / AAA Battery Operated (পেনসিল ব্যাটারি চালিত)">৩ x AA/AAA ব্যাটারি চালিত</option>
            <option value="Non-Electronic / No Battery Required (কোনো ব্যাটারির প্রয়োজন নেই)">কোনো ব্যাটারির প্রয়োজন নেই</option>
          </select>
        </div>

        {/* Material & BPA Safety */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-purple-600" />
            <span>নিরাপদ মেটেরিয়াল (BPA-Free Material)</span>
          </label>
          <input
            type="text"
            value={value.materialPlushSilicone || ""}
            onChange={(e) => update("materialPlushSilicone", e.target.value)}
            placeholder="e.g. 100% BPA-Free Food Grade Silicone / Knitted Plush"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Teething & Bite Safety */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-purple-600" />
            <span>দাঁত কামড়ানো সেফটি (Teething & Chewable Safety)</span>
          </label>
          <select
            value={value.teethingSafety || ""}
            onChange={(e) => update("teethingSafety", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          >
            <option value="">টিথিং উপযুক্ততা</option>
            <option value="Safe for Chewing & Teething (দাঁত কামড়ানোর জন্য ১০০% নিরাপদ)">দাঁত কামড়ানোর জন্য ১০০% নিরাপদ ও নরম</option>
            <option value="Musical / Play Toy Only (কামড়ানোর খেলনা নয়)">মিউজিক্যাল / খেলার খেলনা (কামড়ানোর নয়)</option>
          </select>
        </div>

        {/* Sensory Development */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Heart size={14} className="text-purple-600" />
            <span>বিকাশজনিত দক্ষতা (Sensory Development)</span>
          </label>
          <input
            type="text"
            value={value.sensoryDevelopmentFocus || ""}
            onChange={(e) => update("sensoryDevelopmentFocus", e.target.value)}
            placeholder="e.g. শ্রবণশক্তি, কথা অনুকরণ, হাত-চোখের সমন্বয় ও মোটর স্কিল"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Warranty */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-purple-600" />
            <span>ওয়ারেন্টি (Warranty)</span>
          </label>
          <input
            type="text"
            value={value.warranty || ""}
            onChange={(e) => update("warranty", e.target.value)}
            placeholder="e.g. 7 Days Replacement Guarantee"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-purple-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. China, Bangladesh, Malaysia"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-700"
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
                  placeholder="স্পেকের নাম (e.g. উচ্চতা)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-1 focus:ring-purple-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. 32 cm Lightweight Plush)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-purple-500 focus:outline-hidden focus:ring-1 focus:ring-purple-200"
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
