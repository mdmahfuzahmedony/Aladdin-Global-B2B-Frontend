"use client";

import { useState } from "react";
import {
  BookOpen,
  User,
  Building2,
  FileText,
  Calendar,
  Languages,
  Bookmark,
  Sparkles,
  Plus,
  Trash2,
  Barcode,
  Layers,
  Scale,
} from "lucide-react";

export interface BookAttributes {
  // Core Book Details
  author?: string;
  publisher?: string;
  translator?: string;
  edition?: string;
  publicationYear?: string;
  language?: string;
  coverType?: string;
  numberOfPages?: string | number;
  isbn?: string;
  genre?: string;
  bookWeight?: string;
  paperType?: string;

  // Dynamic custom specifications: array of { id, label, value }
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function BookCategoryField({
  value = {},
  onChange,
  categoryName = "Books",
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
      <div className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D6A419]/15 text-[#D6A419]">
            <BookOpen size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              বই ও প্রকাশনা স্পেসিফিকেশন (Book Details)
            </h4>
            <p className="text-xs text-slate-500">
              {categoryName} — লেখক, প্রকাশনী, পৃষ্ঠা, কভার ও বই সংক্রান্ত তথ্য যুক্ত করুন
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
        {/* 1. AUTHOR & PUBLISHER */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <User size={14} className="text-[#D6A419]" />
            <span>১. লেখক ও প্রকাশনা তথ্য (Author & Publisher)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="লেখক / রচয়িতা (Author) *"
              value={value.author}
              onChange={(v) => update("author", v)}
              placeholder="যেমন: হুমায়ূন আহমেদ, আরিফ আজাদ, কাজী নজরুল ইসলাম"
              required
            />

            <SelectWithCustom
              label="প্রকাশনী (Publisher) *"
              value={value.publisher}
              onChange={(v) => update("publisher", v)}
              options={[
                "প্রথমা প্রকাশন (Prothoma)",
                "বাতিঘর (Batighar)",
                "তাম্রলিপি (Tamrolipi)",
                "অনন্যা (Ananya)",
                "কাকলী প্রকাশনী (Kakoli)",
                "সময় প্রকাশন (Somoy)",
                "অনুপম প্রকাশনী (Anupam)",
                "গার্ডিয়ান পাবলিকেশন (Guardian)",
                "সমকালীন প্রকাশন (Samakalin)",
                "রোদোসী প্রকাশনী (Rodosi)",
                "ঐতিহ্য (Oitijjo)",
                "আহমাদ পাবলিকেশন (Ahmad)",
                "দিব্য প্রকাশ (Dibya Prokash)",
                "নালন্দা (Nalonda)",
                "অক্ষর প্রকাশনী (Okkhawr)",
              ]}
              placeholder="অন্য প্রকাশনীর নাম লিখুন..."
            />

            <Input
              label="অনুবাদক / সম্পাদক (Translator / Editor)"
              value={value.translator}
              onChange={(v) => update("translator", v)}
              placeholder="অনুবাদিত বা সম্পাদিত বই হলে নাম লিখুন..."
            />

            <SelectWithCustom
              label="বইয়ের বিষয় / ধরণ (Genre / Category)"
              value={value.genre}
              onChange={(v) => update("genre", v)}
              options={[
                "উপন্যাস (Novel)",
                "গল্প / ছোটগল্প (Story)",
                "ইসলামিক ও ধর্মীয় (Islamic)",
                "কবিতা ও ছড়া (Poetry)",
                "ফিকশন (Fiction)",
                "নন-ফিকশন (Non-Fiction)",
                "ইতিহাস ও মুক্তিযুদ্ধ (History)",
                "সায়েন্স ফিকশন (Sci-Fi)",
                "থ্রিলার ও রহস্য (Thriller)",
                "আত্মউন্নয়ন ও মোটিভেশন (Self-Help)",
                "জীবনী ও আত্মস্মৃতি (Biography)",
                "একাডেমিক ও পাঠ্যবই (Academic)",
                "ভ্রমণ কাহিনী (Travel)",
                "শিশুতোষ ও কিশোর সাহিত্য (Children)",
                "বিজ্ঞান ও প্রযুক্তি (Science & Tech)",
                "ব্যবসা ও অর্থনীতি (Business)",
              ]}
              placeholder="অন্য বিষয় লিখুন..."
            />
          </div>
        </div>

        {/* 2. FORMAT, COVER & LANGUAGE */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Bookmark size={14} className="text-[#D6A419]" />
            <span>২. কভার, ভাষা ও সংস্করণ (Format & Language)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="কভারের ধরণ (Cover Type)"
              value={value.coverType}
              onChange={(v) => update("coverType", v)}
              options={[
                "হার্ডকভার (Hardcover)",
                "পেপারব্যাক (Paperback)",
                "বোর্ড বুক (Board Book)",
                "লেদার বাউন্ড (Leather Bound)",
              ]}
            />

            <SelectWithCustom
              label="ভাষা (Language)"
              value={value.language}
              onChange={(v) => update("language", v)}
              options={[
                "বাংলা (Bangla)",
                "ইংরেজি (English)",
                "আরবি (Arabic)",
                "বাংলা ও আরবি (Bangla & Arabic)",
                "হিন্দি (Hindi)",
                "উর্দু (Urdu)",
              ]}
              placeholder="অন্য ভাষা..."
            />

            <SelectWithCustom
              label="সংস্করণ (Edition)"
              value={value.edition}
              onChange={(v) => update("edition", v)}
              options={[
                "১ম সংস্করণ (1st Edition)",
                "২য় সংস্করণ (2nd Edition)",
                "৩য় সংস্করণ (3rd Edition)",
                "পরিমার্জিত ও বর্ধিত সংস্করণ (Revised)",
                "নতুন সংস্করণ (Latest Edition)",
              ]}
              placeholder="সংস্করণ লিখুন..."
            />
          </div>
        </div>

        {/* 3. PRINTING & PHYSICAL SPECS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <FileText size={14} className="text-[#D6A419]" />
            <span>৩. পৃষ্ঠা, প্রকাশকাল ও প্রিন্টিং (Pages, Year & ISBN)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="পৃষ্ঠা সংখ্যা (Number of Pages)"
              value={value.numberOfPages}
              onChange={(v) => update("numberOfPages", v)}
              placeholder="যেমন: ৩২০"
              type="text"
            />

            <SelectWithCustom
              label="প্রকাশনার বছর (Publication Year)"
              value={value.publicationYear}
              onChange={(v) => update("publicationYear", v)}
              options={[
                "২০২৬ (2026)",
                "২০২৫ (2025)",
                "২০২৪ (2024)",
                "২০২৩ (2023)",
                "২০২২ (2022)",
                "২০২১ (2021)",
                "২০২০ (2020)",
                "২০১৯ (2019)",
                "২০১৮ (2018)",
              ]}
              placeholder="সাল লিখুন..."
            />

            <Input
              label="ISBN / বারকোড"
              value={value.isbn}
              onChange={(v) => update("isbn", v)}
              placeholder="যেমন: 978-984-..."
            />

            <SelectWithCustom
              label="কাগজের ধরণ (Paper Type)"
              value={value.paperType}
              onChange={(v) => update("paperType", v)}
              options={[
                "হোয়াইট প্রিন্ট / অফসেট (White / Offset)",
                "নিউজপ্রিন্ট (Newsprint)",
                "আর্ট পেপার (Art Paper)",
                "ম্যাট পেপার (Matte Paper)",
              ]}
              placeholder="কাগজের ধরণ..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="বইয়ের ওজন (Weight)"
              value={value.bookWeight}
              onChange={(v) => update("bookWeight", v)}
              placeholder="যেমন: 350 গ্রাম / 0.35 kg"
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
              প্রয়োজনে বইয়ের অন্যান্য তথ্য যেমন: সিরিজ নাম, মূল লেখক, অলংকরণ ইত্যাদি যোগ করতে পারেন।
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
                    placeholder="লেবেল (যেমন: সিরিজ / চিত্রশিল্পী)"
                    className="w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      handleUpdateCustomSpec(spec.id, "value", e.target.value)
                    }
                    placeholder="মান (যেমন: মাসুদ রানা সিরিজ / হাশেম খান)"
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

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value?: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419]"
      />
    </div>
  );
}

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
