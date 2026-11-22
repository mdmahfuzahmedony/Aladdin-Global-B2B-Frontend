"use client";

import {
  Brain,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  BookOpen,
  Atom,
} from "lucide-react";

export interface EducationalStemAttributes {
  stemItemType?: string;
  brand?: string;
  modelSeries?: string;
  recommendedAge?: string;
  learningFocusSkill?: string;
  experimentProjectsCount?: string;
  primaryMaterial?: string;
  safetyCertifications?: string;
  chokingHazardWarning?: string;
  powerSource?: string;
  manualLanguageGuide?: string;
  inTheBoxComponents?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function EducationalStemField({
  value = {},
  onChange,
  categoryName = "Educational & STEM Toys",
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

  const stemPresets = [
    "STEM সায়েন্স এক্সপেরিমেন্ট কিট (Science Experiment Kit)",
    "সোলার চালিত রোবট কিট (Solar Powered Robot Kit)",
    "ম্যাকানিকাল ও ইলেকট্রনিক্স ল্যাব (Electronics & Circuit Kit)",
    "মন্টেসরি কাঠের শিক্ষণীয় খেলনা (Montessori Wooden Educational Toy)",
    "ম্যাথ কাউন্টিং ও গণিত লার্নিং সেট (Math Abacus & Counting Toy)",
    "অ্যালফাবেট ও স্পেলিং লার্নিং বোর্ড (Bangla/English Alphabet Board)",
    "অডিও স্পিকিং ফ্ল্যাশ কার্ড রিডার (Talking Audio Flash Card Reader)",
    "বাচ্চাদের মাইক্রোস্কোপ ও সায়েন্স ল্যাব (Kids Beginner Microscope)",
    "হিউম্যান বডি ও অ্যানাটমি মডেল (Human Body Anatomy Model)",
    "সোলার সিস্টেম ও গ্লোব মডেল (Solar System Planetarium Globe)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shadow-xs">
            <Atom size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              এডুকেশনাল ও স্টেম লার্নিং খেলনা স্পেসিফিকেশন (STEM & Educational Specs)
            </h3>
            <p className="text-xs text-slate-500">
              বিজ্ঞান, গণিত, কোডিং, রোবোটিক্স ও মন্টেসরি খেলনার প্রযুক্তিগত বৈশিষ্ট্য
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-emerald-600" />
            <span>শিক্ষণীয় খেলনার ধরন / সাব-টাইপ (STEM Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="stem-type-presets"
            value={value.stemItemType || ""}
            onChange={(e) => update("stemItemType", e.target.value)}
            placeholder="উদাহরণ: 12-in-1 Solar Powered Science Robot Kit"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
          <datalist id="stem-type-presets">
            {stemPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-emerald-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. National Geographic, Discovery, Lego, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Brain size={14} className="text-emerald-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age Group)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="1 - 3 Years (টডলার ও প্রিস্কুল)">১ - ৩ বছর (টডলার ও প্রিস্কুল)</option>
            <option value="3 - 6 Years (প্রিস্কুল ও কিন্ডারগার্টেন)">৩ - ৬ বছর (প্রিস্কুল ও কিন্ডারগার্টেন)</option>
            <option value="6 - 8 Years (প্রাইমারি স্কুল শিক্ষার্থী)">৬ - ৮ বছর (প্রাইমারি স্কুল শিক্ষার্থী)</option>
            <option value="8 - 12 Years (স্টেম ও সায়েন্স কিডস)">৮ - ১২ বছর (স্টেম ও সায়েন্স কিডস)</option>
            <option value="12+ Years (টিনএজ ও অ্যাডভান্সড রোবোটিক্স)">১২+ বছর (টিনএজ ও অ্যাডভান্সড রোবোটিক্স)</option>
            <option value="All Ages (পারিবারিক শিক্ষণীয় খেলনা)">সব বয়সীদের জন্য</option>
          </select>
        </div>

        {/* Skill / Learning Focus */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <BookOpen size={14} className="text-emerald-600" />
            <span>লার্নিং ফোকাস / দক্ষতা (Skill Focus)</span>
          </label>
          <input
            type="text"
            value={value.learningFocusSkill || ""}
            onChange={(e) => update("learningFocusSkill", e.target.value)}
            placeholder="e.g. Robotics, Physics, Math Logic, Spatial Intelligence"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Experiment / Project Count */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Scale size={14} className="text-emerald-600" />
            <span>প্রজেক্ট / এক্সপেরিমেন্ট সংখ্যা (Projects Count)</span>
          </label>
          <input
            type="text"
            value={value.experimentProjectsCount || ""}
            onChange={(e) => update("experimentProjectsCount", e.target.value)}
            placeholder="e.g. 12 Robots in 1, 50+ Science Experiments"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Power Source */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Atom size={14} className="text-emerald-600" />
            <span>পাওয়ার সোর্স (Power Source)</span>
          </label>
          <select
            value={value.powerSource || ""}
            onChange={(e) => update("powerSource", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          >
            <option value="">পাওয়ার উৎস নির্বাচন করুন</option>
            <option value="Solar Powered (সরাসরি সৌরশক্তি চালিত)">সরাসরি সৌরশক্তি চালিত (Solar Powered)</option>
            <option value="Battery Operated (AA/AAA ব্যাটারি চালিত)">ব্যাটারি চালিত (AA/AAA Battery)</option>
            <option value="USB Rechargeable (রিচার্জেবল লিথিয়াম ব্যাটারি)">USB রিচার্জেবল লিথিয়াম ব্যাটারি</option>
            <option value="Manual / No Battery Required (কোনো ব্যাটারির প্রয়োজন নেই)">ম্যানুয়াল / কোনো ব্যাটারির প্রয়োজন নেই</option>
            <option value="Hybrid (Solar + Battery)">হাইব্রিড (সোলার + ব্যাটারি)</option>
          </select>
        </div>

        {/* Primary Material */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>মেটেরিয়াল (Primary Material)</span>
          </label>
          <input
            type="text"
            value={value.primaryMaterial || ""}
            onChange={(e) => update("primaryMaterial", e.target.value)}
            placeholder="e.g. Non-Toxic ABS Plastic, Natural Solid Wood, Eco Board"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Safety & Choking Hazard */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>নিরাপত্তা সতর্কতা (Safety / Hazard Warning)</span>
          </label>
          <input
            type="text"
            value={value.chokingHazardWarning || ""}
            onChange={(e) => update("chokingHazardWarning", e.target.value)}
            placeholder="e.g. ছোট পার্টস রয়েছে, ৩ বছরের নিচের শিশুদের জন্য নয়"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Guide / Manual Language */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <BookOpen size={14} className="text-emerald-600" />
            <span>ইউজার গাইড / ম্যানুয়াল (Guide Book)</span>
          </label>
          <input
            type="text"
            value={value.manualLanguageGuide || ""}
            onChange={(e) => update("manualLanguageGuide", e.target.value)}
            placeholder="e.g. চিত্রসহ বাংলা ও ইংরেজি কালারফুল গাইডবুক সহ"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* In The Box Components */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-emerald-600" />
            <span>প্যাকেজের ভেতরের কম্পোনেন্টস (In The Box Contents)</span>
          </label>
          <input
            type="text"
            value={value.inTheBoxComponents || ""}
            onChange={(e) => update("inTheBoxComponents", e.target.value)}
            placeholder="e.g. রোবট মোটর, গিয়ারবক্স, সোলার প্যানেল, ১৯০+ পার্টস, বিস্তারিত ম্যানুয়াল"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-emerald-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh, China, Germany, Japan"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
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
                  placeholder="স্পেকের নাম (e.g. সেন্সর টাইপ)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. Infrared Obstacle Sensor)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-200"
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
