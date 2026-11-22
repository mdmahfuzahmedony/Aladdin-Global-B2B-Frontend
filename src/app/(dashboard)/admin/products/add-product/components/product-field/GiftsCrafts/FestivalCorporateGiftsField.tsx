"use client";

import {
  Gift,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Briefcase,
  Calendar,
  Package,
} from "lucide-react";

export interface FestivalCorporateGiftsAttributes {
  corporateItemType?: string;
  brandMaker?: string;
  festivalOccasion?: string;
  itemsIncludedInSet?: string;
  corporateBrandingAvailable?: string;
  boxFinishingMaterial?: string;
  warrantyGuarantee?: string;
  bulkDiscountAvailable?: string;
  packagingPresentation?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function FestivalCorporateGiftsField({
  value = {},
  onChange,
  categoryName = "Festival, Seasonal & Corporate Gifts",
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

  const festivalCorporatePresets = [
    "রয়েল উদ অ্যান্ড ফ্রেঞ্চ লাক্সারি পারফিউম গিফট সেট (Luxury Perfume Gift Box)",
    "কর্পোরেট এক্সিকিউটিভ ডায়েরি, মেটাল পেন ও কিচেন কম্বো (Executive Gift Set)",
    "ঈদ স্পেশাল প্রিমিয়াম ড্রাই ফ্রুটস ও চকলেট গিফট হ্যাম্পার (Eid Gift Hamper)",
    "পহেলা বৈশাখ ঐতিহ্যবাহী মেলা গিফট প্যাকেজ (Boishakh Gift Pack)",
    "কাস্টমাইজড মেটালিক ক্রেস্ট ও অ্যাওয়ার্ড শোপিস (Metal & Glass Award Crest)",
    "ব্র্যান্ডেড মেটাল ইউএসবি পেনড্রাইভ ও কার্ড হোল্ডার (Card Holder & USB Set)",
    "থার্মাল ভ্যাকিউম ওয়াটার বোতল ও মগ গিফট সেট (Vacuum Flask Gift Set)",
    "ওয়েডিং অ্যান্ড কাপল লাক্সারি গিফট ট্রাঙ্ক (Wedding Trunk Gift Box)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 shadow-xs">
            <Briefcase size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              উৎসব, সিজনাল ও কর্পোরেট গিফট স্পেসিফিকেশন (Corporate & Festival Gifts)
            </h3>
            <p className="text-xs text-slate-500">
              ঈদ উপহার, এক্সিকিউটিভ ডায়েরি-পেন, লাক্সারি পারফিউম বক্স ও ক্রেস্টের বিবরণ
            </p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-100/90 px-3 py-1 text-xs font-semibold text-indigo-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-indigo-600" />
            <span>উপহার প্যাকেজের ধরন (Gift Package Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="corp-type-presets"
            value={value.corporateItemType || ""}
            onChange={(e) => update("corporateItemType", e.target.value)}
            placeholder="উদাহরণ: Royal Oud & French Luxury Long-Lasting Perfume Gift Set"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
          <datalist id="corp-type-presets">
            {festivalCorporatePresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Series */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-indigo-600" />
            <span>ব্র্যান্ড / সিরিজ (Brand / Series)</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Royal Oud, Parker, Sheaffer, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Festival / Occasion */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Calendar size={14} className="text-indigo-600" />
            <span>উৎসব বা উপলক্ষ (Festival / Occasion)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.festivalOccasion || ""}
            onChange={(e) => update("festivalOccasion", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">উৎসব নির্বাচন করুন</option>
            <option value="Eid-ul-Fitr & Eid-ul-Adha (পবিত্র ঈদ)">পবিত্র ঈদ (Eid Gifts)</option>
            <option value="Corporate Annual & Conference (কর্পোরেট কনফারেন্স)">কর্পোরেট কনফারেন্স ও মিটিং (Corporate)</option>
            <option value="Pohela Boishakh (পহেলা বৈশাখ)">পহেলা বৈশাখ (Bengali New Year)</option>
            <option value="New Year & Year-End (নতুন বছর)">নতুন বছর (New Year Gifts)</option>
            <option value="Wedding & Reception (বিবাহ ও সংবর্ধনা)">বিবাহ ও সংবর্ধনা (Wedding & Reception)</option>
            <option value="All Festivals (যেকোনো সার্বজনীন উৎসব)">যেকোনো সার্বজনীন উৎসব (All Festivals)</option>
          </select>
        </div>

        {/* Corporate Branding Availability */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Briefcase size={14} className="text-indigo-600" />
            <span>কোম্পানি লোগো ব্র্যান্ডিং (Corporate Logo Print)</span>
          </label>
          <select
            value={value.corporateBrandingAvailable || ""}
            onChange={(e) => update("corporateBrandingAvailable", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">লোগো প্রিন্ট সুবিধা</option>
            <option value="Available (অর্ডারে কোম্পানির নিজস্ব লোগো ও নাম প্রিন্ট করা যাবে)">হ্যাঁ - কোম্পানির নিজস্ব লোগো ও নাম প্রিন্ট করা যাবে</option>
            <option value="Standard Retail Packaging (লোগো ছাড়া স্ট্যান্ডার্ড রিটেইল প্যাক)">স্ট্যান্ডার্ড রিটেইল প্যাক (লোগো ছাড়া)</option>
          </select>
        </div>

        {/* Box Finishing / Material */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>বক্স মেটেরিয়াল (Box Material & Finish)</span>
          </label>
          <input
            type="text"
            value={value.boxFinishingMaterial || ""}
            onChange={(e) => update("boxFinishingMaterial", e.target.value)}
            placeholder="e.g. Magnetic Hardboard Box with Gold Foil Embossing"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Items Included In Set */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-indigo-600" />
            <span>প্যাকেজে অন্তর্ভুক্ত আইটেমসমূহ (Items Included)</span>
          </label>
          <input
            type="text"
            value={value.itemsIncludedInSet || ""}
            onChange={(e) => update("itemsIncludedInSet", e.target.value)}
            placeholder="e.g. ৪টি পারফিউম ২৫ মিলি / ১টি ডায়েরি + ১টি মেটাল রোলার পেন + ১টি কি-রিং"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Bulk Discount Available */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-indigo-600" />
            <span>বাল্ক অর্ডার ডিসকাউন্ট (Bulk Discount)</span>
          </label>
          <input
            type="text"
            value={value.bulkDiscountAvailable || ""}
            onChange={(e) => update("bulkDiscountAvailable", e.target.value)}
            placeholder="e.g. ৫০+ পিসে স্পেশাল কর্পোরেট ডিসকাউন্ট প্রযোজ্য"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Packaging Presentation */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-indigo-600" />
            <span>প্রেজেন্টেশন ও ফিনিশিং (Gift Packaging)</span>
          </label>
          <input
            type="text"
            value={value.packagingPresentation || ""}
            onChange={(e) => update("packagingPresentation", e.target.value)}
            placeholder="e.g. ভেলভেট ট্রে কুশন ও হ্যান্ডেল ব্যাগ সহ গিফট বক্স"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-indigo-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh / UAE / Germany"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
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
                  placeholder="স্পেকের নাম (e.g. পারফিউম কনসেন্ট্রেশন)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. 25% EDP Long Lasting Projection)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-200"
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
