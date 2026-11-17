"use client";

import { useState } from "react";
import {
  Pill,
  Building2,
  ShieldAlert,
  Activity,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Thermometer,
  Layers,
  Globe,
  AlertCircle,
} from "lucide-react";

export interface MedicineAttributes {
  genericName?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  packSize?: string;
  prescriptionRequired?: string;
  indications?: string;
  darNo?: string;
  storageCondition?: string;
  expiryDate?: string;
  sideEffectsWarnings?: string;
  countryOfOrigin?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function MedicineCategoryField({
  value = {},
  onChange,
  categoryName = "Medicine & Healthcare",
}: Props) {
  const update = (key: string, v: any) => {
    onChange({ ...value, [key]: v });
  };

  // Dynamic custom specifications handlers
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
      <div className="flex items-center justify-between rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-600">
            <Pill size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              ওষুধ ও ফার্মেসি স্পেসিফিকেশন (Medicine Specifications)
            </h4>
            <p className="text-xs text-slate-500">
              {categoryName} — জেনেরিক নাম, প্রস্তুতকারক, ডোজ ফরম, মাত্রা ও প্রেসক্রিপশন সংক্রান্ত তথ্য
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800">
          <CheckCircle2 size={13} />
          ফার্মেসি স্ট্যান্ডার্ড
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
        {/* 1. GENERIC & MANUFACTURER */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Pill size={14} className="text-emerald-600" />
            <span>১. জেনেরিক ও প্রস্তুতকারক তথ্য (Generic & Manufacturer)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithCustom
              label="জেনেরিক নাম (Generic Name) *"
              value={value.genericName}
              onChange={(v) => update("genericName", v)}
              options={[
                "Paracetamol (প্যারাসিটামল)",
                "Esomeprazole (ইসোমিপ্রাজল)",
                "Omeprazole (ওমিপ্রাজল)",
                "Pantoprazole (প্যান্টোপ্রাজল)",
                "Cefixime (সেফিক্সিম)",
                "Azithromycin (অ্যাজিথ্রোমাইসিন)",
                "Montelukast (মন্টেলুকাস্ট)",
                "Fexofenadine (ফেক্সোফেনাডিন)",
                "Cetirizine (সেটিরিজিন)",
                "Metformin Hydrochloride (মেটফর্মিন)",
                "Amlodipine (অ্যামলোডিপিন)",
                "Losartan Potassium (লোসারটান পটাশিয়াম)",
                "Ciprofloxacin (সিপ্রোফ্লক্সাসিন)",
                "Amoxicillin (অ্যামোক্সিসিলিন)",
                "Ibuprofen (আইবুপ্রোফেন)",
                "Naproxen (ন্যাপ্রোক্সেন)",
                "Calcium + Vitamin D3 (ক্যালসিয়াম + ভিটামিন ডি৩)",
                "Multivitamin & Multiminerals (মাল্টিভিটামিন)",
                "Oral Rehydration Salt - ORS (ওরস্যালাইন)",
                "Povidone Iodine (পোভিডন আয়োডিন)",
                "Silver Sulfadiazine (সিলভার সালফাডায়াজিন)",
              ]}
              placeholder="কাস্টম জেনেরিক নাম লিখুন (যেমন: Domperidone)..."
            />

            <SelectWithCustom
              label="প্রস্তুতকারক কোম্পানি (Manufacturer / Pharma) *"
              value={value.manufacturer}
              onChange={(v) => update("manufacturer", v)}
              options={[
                "Square Pharmaceuticals Ltd. (স্কয়ার)",
                "Beximco Pharmaceuticals Ltd. (বেক্সিমকো)",
                "Incepta Pharmaceuticals Ltd. (ইনসেপ্টা)",
                "Renata Limited (রেনেটা)",
                "Opsonin Pharma Ltd. (অপসোনিন)",
                "ACI Limited (এসিআই)",
                "Eskayef Pharmaceuticals (SK+F)",
                "Healthcare Pharmaceuticals Ltd. (হেলথকেয়ার)",
                "The ACME Laboratories Ltd. (একমি)",
                "Aristopharma Ltd. (অ্যারিস্টোফার্মা)",
                "Drug International Ltd. (ড্রাগ ইন্টারন্যাশনাল)",
                "Popular Pharmaceuticals Ltd. (পপুলার)",
                "Radiant Pharmaceuticals Ltd. (রেডিয়ান্ট)",
                "Beacon Pharmaceuticals Ltd. (বিকন)",
                "Delta Pharma Ltd. (ডেল্টা)",
                "Ibn Sina Pharmaceuticals (ইবনে সিনা)",
                "General Pharmaceuticals Ltd. (জেনারেল)",
                "Sanofi Bangladesh / Synovia (স্যানোফি)",
                "Hamdard Laboratories (হামদর্দ - ভেষজ)",
              ]}
              placeholder="অন্য কোম্পানির নাম লিখুন..."
            />
          </div>
        </div>

        {/* 2. DOSAGE FORM, STRENGTH & PACK SIZE */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Layers size={14} className="text-emerald-600" />
            <span>২. ডোজ ফরম, মাত্রা ও প্যাকেজিং (Dosage Form, Strength & Pack Size)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithCustom
              label="ডোজ ফরম (Dosage Form) *"
              value={value.dosageForm}
              onChange={(v) => update("dosageForm", v)}
              options={[
                "ট্যাবলেট (Tablet)",
                "ক্যাপসুল (Capsule)",
                "সিরাপ (Syrup)",
                "সাসপেনশন (Suspension)",
                "চোখের ড্রপ (Eye Drops)",
                "কানের ড্রপ (Ear Drops)",
                "নাকের ড্রপ / স্প্রে (Nasal Spray/Drops)",
                "মলম / অয়েন্টমেন্ট (Ointment)",
                "ক্রিম ও জেল (Cream & Gel)",
                "ইনজেকশন ও স্যালাইন (Injection / Infusion)",
                "ইনহেলার ও রোটাক্যাপ (Inhaler / Rotacap)",
                "সাপোজিটরি (Suppository)",
                "পাউডার ও স্যাচেট (Powder / Sachet / ORS)",
                "লোশন ও সলিউশন (Topical Solution)",
              ]}
              placeholder="অন্য রূপ লিখুন (যেমন: Chewable Tablet)..."
            />

            <SelectWithCustom
              label="শক্তি / মাত্রা (Strength / Potency)"
              value={value.strength}
              onChange={(v) => update("strength", v)}
              options={[
                "500 mg",
                "665 mg (Extended Release)",
                "20 mg",
                "40 mg",
                "10 mg",
                "5 mg",
                "2.5 mg",
                "100 mg",
                "250 mg",
                "1 gm / 1000 mg",
                "5 mg / 5 ml",
                "10 mg / 5 ml",
                "100 mg / 5 ml",
                "1% w/w",
                "2% w/w",
                "0.5% w/v",
                "0.05% w/v",
                "100 IU / 200 IU / 400 IU",
                "প্রযোজ্য নয় (N/A)",
              ]}
              placeholder="কাস্টম মাত্রা লিখুন (যেমন: 120 mg/5ml)..."
            />

            <SelectWithCustom
              label="প্যাক সাইজ / পরিমাণ (Pack Size / Quantity) *"
              value={value.packSize}
              onChange={(v) => update("packSize", v)}
              options={[
                "১০টি ট্যাবলেটের পাতা (1 Strip of 10)",
                "১৫টি ট্যাবলেটের পাতা (1 Strip of 15)",
                "২০টি ট্যাবলেটের পাতা (1 Strip of 20)",
                "১টি সম্পূর্ণ বক্স (1 Full Box)",
                "৬০ মিলি বোতল (60 ml Bottle)",
                "১০০ মিলি বোতল (100 ml Bottle)",
                "২০০ মিলি বোতল (200 ml Bottle)",
                "৫ মিলি ড্রপার বোতল (5 ml Dropper)",
                "১০ মিলি ড্রপার বোতল (10 ml Dropper)",
                "১৫ গ্রাম টিউব (15g Tube)",
                "২০ গ্রাম টিউব (20g Tube)",
                "৩০ গ্রাম টিউব (30g Tube)",
                "১টি ভায়াল / অ্যাম্পুল (1 Vial/Ampoule)",
                "১টি ইনহেলার (200 Puffs Canister)",
                "১ প্যাকেট / স্যাচেট (1 Sachet)",
              ]}
              placeholder="অন্য প্যাক সাইজ লিখুন..."
            />
          </div>
        </div>

        {/* 3. PRESCRIPTION & INDICATIONS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Activity size={14} className="text-emerald-600" />
            <span>৩. প্রেসক্রিপশন শর্ত ও ব্যবহার ক্ষেত্র (Prescription & Indications)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithCustom
              label="প্রেসক্রিপশন শর্ত (Prescription Status) *"
              value={value.prescriptionRequired}
              onChange={(v) => update("prescriptionRequired", v)}
              options={[
                "OTC (প্রেসক্রিপশন ছাড়া কেনা যাবে / Over-The-Counter)",
                "Rx (ডাক্তারের প্রেসক্রিপশন আবশ্যক / Prescription Required)",
                "আয়ুর্বেদিক / ভেষজ (Herbal - সাধারণ সেব্য)",
                "সার্জিক্যাল ও মেডিকেল সরঞ্জাম (Medical Equipment)",
              ]}
              placeholder="কাস্টম শর্ত লিখুন..."
            />

            <SelectWithCustom
              label="রোগ / রোগের ধরণ (Indications / Purpose)"
              value={value.indications}
              onChange={(v) => update("indications", v)}
              options={[
                "জ্বর, সর্দি ও শরীর ব্যথা (Fever, Cold & Body Pain)",
                "গ্যাস্ট্রিক, আলসার ও এসিডিটি (Acidity & Gastric)",
                "অ্যান্টিবায়োটিক / ব্যাকটেরিয়াল ইনফেকশন (Antibiotic)",
                "হাঁপানি, শ্বাসকষ্ট ও কাশি (Asthma, Cough & Respiratory)",
                "অ্যালার্জি, চুলকানি ও হাঁচি (Allergy & Antihistamine)",
                "ডায়াবেটিস নিয়ন্ত্রণ (Diabetes Management)",
                "উচ্চ রক্তচাপ ও হৃদরোগ (Hypertension & Heart Care)",
                "ভিটামিন ও খনিজের ঘাটতি (Vitamin & Mineral Deficiency)",
                "পেটের সমস্যা, ডায়রিয়া ও বদহজম (Diarrhea & Indigestion)",
                "ত্বক, চুল ও চর্মরোগ (Skin Care & Dermatology)",
                "হাড়, জোড়া ও মাংশপেশির ব্যথা (Bone & Muscle Pain)",
                "চোখ ও কানের যত্ন (Eye & Ear Care)",
                "দাঁত ও মাড়ির যত্ন (Dental Care)",
                "কাটা-ছেঁড়া ও ক্ষত নিরাময় (First Aid & Wound Care)",
              ]}
              placeholder="অন্যান্য রোগের ক্ষেত্র লিখুন..."
            />
          </div>
        </div>

        {/* 4. REGISTRATION, STORAGE & EXPIRY */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Calendar size={14} className="text-emerald-600" />
            <span>৪. রেজি নং, সংরক্ষণ ও সতর্কতা (Registration, Storage & Expiry)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="DAR / DGDA রেজি নম্বর (DAR No)"
              value={value.darNo}
              onChange={(v) => update("darNo", v)}
              placeholder="যেমন: DAR: 025-104-065"
            />

            <SelectWithCustom
              label="সংরক্ষণ শর্ত (Storage Condition)"
              value={value.storageCondition}
              onChange={(v) => update("storageCondition", v)}
              options={[
                "৩০° সে. এর নিচে, শুষ্ক ও আলো থেকে দূরে রাখুন",
                "২৫° সে. এর নিচে শুষ্ক ও শীতল স্থানে রাখুন",
                "২° - ৮° সে. তাপমাত্রায় ফ্রিজে রাখুন (ফ্রিজ করবেন না)",
                "স্বাভাবিক কক্ষ তাপমাত্রায় সংরক্ষণযোগ্য",
                "শিশুদের নাগালের বাইরে রাখুন",
              ]}
              placeholder="কাস্টম স্টোরেজ শর্ত লিখুন..."
            />

            <SelectWithCustom
              label="মেয়াদকাল / লাইফস্প্যান (Expiry / Shelf Life)"
              value={value.expiryDate}
              onChange={(v) => update("expiryDate", v)}
              options={[
                "৩ বছর (3 Years Shelf Life)",
                "২ বছর (2 Years Shelf Life)",
                "১৮ মাস (18 Months Shelf Life)",
                "১ বছর (1 Year Shelf Life)",
                "প্যাকেটে উল্লেখিত মেয়াদ দেখে নিন",
              ]}
              placeholder="কাস্টম মেয়াদকাল লিখুন..."
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithCustom
              label="সতর্কতা ও সেবন নির্দেশিকা (Warnings / Instructions)"
              value={value.sideEffectsWarnings}
              onChange={(v) => update("sideEffectsWarnings", v)}
              options={[
                "খাওয়ার পর সেব্য (Take after meal)",
                "খালি পেটে সেব্য (Take on empty stomach)",
                "গর্ভকালীন ও স্তন্যদানকালে ডাক্তারের পরামর্শ নিন",
                "সেবনের পর ঘুম ঘুম ভাব হতে পারে, গাড়ি চালানো থেকে বিরত থাকুন",
                "পূর্ণাঙ্গ কোর্স সম্পন্ন করুন, মাঝপথে বন্ধ করবেন না",
                "শিশুদের ক্ষেত্রে চিকিৎসকের নির্দেশ মেনে মাত্রা নির্ধারণ করুন",
              ]}
              placeholder="কাস্টম সতর্কতা লিখুন..."
            />

            <SelectWithCustom
              label="উৎপাদনকারী দেশ (Country of Origin)"
              value={value.countryOfOrigin}
              onChange={(v) => update("countryOfOrigin", v)}
              options={[
                "বাংলাদেশ (Bangladesh)",
                "ভারত (India)",
                "মার্কিন যুক্তরাষ্ট্র (USA)",
                "যুক্তরাজ্য (UK)",
                "সুইজারল্যান্ড (Switzerland)",
                "জার্মানি (Germany)",
                "জাপান (Japan)",
                "ফ্রান্স (France)",
              ]}
              placeholder="অন্য দেশের নাম লিখুন..."
            />
          </div>
        </div>

        {/* 5. DYNAMIC CUSTOM SPECIFICATIONS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <Sparkles size={14} className="text-emerald-600" />
              <span>৫. অতিরিক্ত কাস্টম স্পেসিফিকেশন (Custom Specifications)</span>
            </div>
            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Plus size={13} />
              <span>নতুন স্পেক যোগ করুন</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            উপরে উল্লেখিত ফিল্ডের বাইরে ওষুধের অন্য যেকোনো বিশেষ তথ্য বা বৈশিষ্ট্য (যেমন: রুট অফ অ্যাডমিনিস্ট্রেশন, থেরাপিউটিক ক্লাস) নিচে নাম ও মান লিখে যুক্ত করতে পারেন।
          </p>

          {customSpecs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
              <p className="text-xs text-slate-500">
                কোন অতিরিক্ত কাস্টম স্পেসিফিকেশন যোগ করা হয়নি। প্রয়োজনে উপরে "নতুন স্পেক যোগ করুন" বাটনে ক্লিক করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {customSpecs.map((spec, index) => (
                <div
                  key={spec.id || index}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "label", e.target.value)
                      }
                      placeholder="লেবেল / নাম (যেমন: থেরাপিউটিক ক্লাস, রুট)"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "value", e.target.value)
                      }
                      placeholder="মান (যেমন: Anti-ulcerant, Oral / Topical)"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSpec(spec.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                    title="ডিলিট করুন"
                  >
                    <Trash2 size={14} />
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
// HELPER UI COMPONENTS (WITH BUILT-IN CUSTOM WRITING CAPABILITY)
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
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
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
          {showCustomInput ? "তালিকা দেখুন" : "কাস্টম লিখুন"}
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
