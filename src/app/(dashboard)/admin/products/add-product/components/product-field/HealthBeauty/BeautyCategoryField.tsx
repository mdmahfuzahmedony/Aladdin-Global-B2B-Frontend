"use client";

import { useState } from "react";
import {
  Sparkles,
  Heart,
  Droplets,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Globe,
  Plus,
  Trash2,
  Smile,
  Package,
} from "lucide-react";

export interface BeautyAttributes {
  productType?: string;
  brand?: string;
  skinType?: string;
  benefits?: string;
  keyIngredients?: string;
  netWeightVolume?: string;
  spf?: string;
  applicationTime?: string;
  targetGender?: string;
  certifications?: string;
  formulation?: string;
  countryOfOrigin?: string;
  expiryDate?: string;
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function BeautyCategoryField({
  value = {},
  onChange,
  categoryName = "Beauty & Skincare",
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
      <div className="flex items-center justify-between rounded-xl border border-rose-200/80 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              রূপচর্চা ও স্কিনকেয়ার স্পেসিফিকেশন (Beauty & Skincare)
            </h4>
            <p className="text-xs text-slate-500">
              {categoryName} — ব্র্যান্ড, ত্বকের ধরণ, মূল উপাদান, কার্যকারিতা ও সান প্রোটেকশন তথ্য
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-800">
          <Heart size={13} />
          ডার্মাটোলজি ও বিউটি কেয়ার
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-6">
        {/* 1. PRODUCT TYPE & BRAND */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Sparkles size={14} className="text-rose-500" />
            <span>১. পণ্যের ধরণ ও ব্র্যান্ড (Product Type & Brand)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithCustom
              label="পণ্যের ধরণ / ক্যাটাগরি (Product Type) *"
              value={value.productType}
              onChange={(v) => update("productType", v)}
              options={[
                "ফেস ক্রিম ও ময়েশ্চারাইজার (Face Cream & Moisturizer)",
                "ডে ক্রিম (Day Cream with SPF)",
                "নাইট রিপেয়ার ক্রিম (Night Repair Cream)",
                "ফেস সিরাম ও এসেন্স (Face Serum & Essence)",
                "সানস্ক্রিন / সানব্লক (Sunscreen / Sunblock)",
                "ফেসওয়াশ ও ডিপ ক্লিনজার (Facewash & Cleanser)",
                "টোনার ও ফেস মিস্ট (Toner & Face Mist)",
                "শিট মাস্ক ও ক্লে প্যাক (Sheet Mask & Clay Pack)",
                "বডি লোশন ও বডি বাটার (Body Lotion & Butter)",
                "লিপ কেয়ার ও লিপবাম (Lip Balm & Lip Mask)",
                "হেয়ার অয়েল ও সিরাম (Hair Oil & Serum)",
                "শ্যাম্পু ও কন্ডিশনার (Shampoo & Conditioner)",
                "চোখের নিচের ক্রিম (Eye Cream / Dark Circle Care)",
                "স্ক্রাব ও এক্সফোলিয়েটর (Face & Body Scrub)",
                "সাবান ও শাওয়ার জেল (Soap & Shower Gel)",
                "মেকআপ ও ফাউন্ডেশন (Makeup & Foundation)",
              ]}
              placeholder="অন্য পণ্যের ধরণ লিখুন (যেমন: BB Cream)..."
            />

            <SelectWithCustom
              label="ব্র্যান্ডের নাম (Brand Name) *"
              value={value.brand}
              onChange={(v) => update("brand", v)}
              options={[
                "CeraVe (সেরাভি)",
                "The Ordinary (দ্য অর্ডিনারি)",
                "COSRX (কসরেক্স - K-Beauty)",
                "Neutrogena (নিউট্রোজিনা)",
                "La Roche-Posay (লা রশ-পোসে)",
                "Cetaphil (সেটাফিল)",
                "Simple Skincare (সিম্পল)",
                "Nivea (নিভিয়া)",
                "Pond's (পন্ডস)",
                "Garnier (গার্নিয়ার)",
                "Himalaya Herbals (হিমালয়া)",
                "Vaseline (ভ্যাসলিন)",
                "L'Oréal Paris (লরিয়াল)",
                "Innisfree (ইনিসফ্রি)",
                "Some By Mi (সাম বাই মি)",
                "Beauty of Joseon (বিউটি অব জোসন)",
                "Laneige (ল্যানেজ)",
                "Mamaearth (মামার্থ)",
                "WOW Skin Science",
                "Skin Cafe (স্কিন ক্যাফে - বিডি)",
                "Lafz (লাফজ - হালাল সার্টিফাইড)",
              ]}
              placeholder="অন্য ব্র্যান্ডের নাম লিখুন..."
            />
          </div>
        </div>

        {/* 2. SKIN TYPE & BENEFITS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Droplets size={14} className="text-rose-500" />
            <span>২. ত্বকের ধরণ ও উপকারিতা (Skin Type & Benefits)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithCustom
              label="কোন ধরণের ত্বকের জন্য উপযোগী (Suitable Skin Type) *"
              value={value.skinType}
              onChange={(v) => update("skinType", v)}
              options={[
                "সব ধরণের ত্বকের জন্য উপযোগী (All Skin Types)",
                "তৈলাক্ত ত্বক (Oily Skin)",
                "শুষ্ক ত্বক (Dry & Dehydrated Skin)",
                "সংবেদনশীল ত্বক (Sensitive Skin)",
                "মিশ্র ত্বক (Combination Skin)",
                "ব্রণপ্রবণ ত্বক (Acne-Prone Skin)",
                "পরিপক্ক ত্বক (Mature / Aging Skin)",
                "স্বাভাবিক ত্বক (Normal Skin)",
              ]}
              placeholder="অন্য স্কিন টাইপ লিখুন..."
            />

            <SelectWithCustom
              label="মূল কার্যকারিতা ও উপকারিতা (Benefits / Concern) *"
              value={value.benefits}
              onChange={(v) => update("benefits", v)}
              options={[
                "উজ্জ্বলতা বৃদ্ধি ও গ্লো বাড়ানো (Brightening & Glow)",
                "ব্রণ ও ব্রণের দাগ দূরীকরণ (Acne & Blemish Control)",
                "গভীর আর্দ্রতা ও ময়েশ্চারাইজিং (Deep Hydration & Moisture)",
                "অ্যান্টি-এজিং ও বলিরেখা দূরীকরণ (Anti-Aging & Wrinkle Repair)",
                "রোদে পোড়া দাগ ও পিগমেন্টেশন হ্রাস (Sun Damage & Hyperpigmentation)",
                "পোর মিনিমাইজিং ও অতিরিক্ত তেল নিয়ন্ত্রণ (Pore Tightening & Oil Control)",
                "স্কিন ব্যারিয়ার রিপেয়ার ও প্রশান্তিদায়ক (Skin Barrier & Soothing)",
                "চোখের নিচের কালো দাগ ও ফোলাভাব দূরীকরণ (Dark Circle & Puffy Eyes)",
                "ডার্ক স্পট ও মেছতা দূরীকরণ (Dark Spot & Melasma Care)",
                "ত্বক মসৃণ, কোমল ও নরম করা (Skin Smoothing)",
              ]}
              placeholder="অন্যান্য উপকারিতা লিখুন..."
            />
          </div>
        </div>

        {/* 3. INGREDIENTS, PACK SIZE & TEXTURE */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Layers size={14} className="text-rose-500" />
            <span>৩. মূল উপাদান, পরিমাণ ও ফর্মুলেশন (Ingredients & Packaging)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithCustom
              label="মূল উপাদান (Key Active Ingredients)"
              value={value.keyIngredients}
              onChange={(v) => update("keyIngredients", v)}
              options={[
                "Niacinamide (নিয়াসিনামাইড ৫% / ১০%)",
                "Salicylic Acid / BHA (স্যালিসিলিক অ্যাসিড)",
                "Hyaluronic Acid (হায়ালুরোনিক অ্যাসিড)",
                "Vitamin C (ভিটামিন সি)",
                "Retinol / Granactive Retinoid (রেটিনল)",
                "Centella Asiatica / Cica (সেন্টেল্লা এসিয়াটিকা)",
                "Snail Mucin 96% (স্নেইল মিউসিন)",
                "Alpha Arbutin 2% (আলফা আরবুটিন)",
                "Aloe Vera & Green Tea Extract (অ্যালোভেরা)",
                "Tea Tree Oil (টি ট্রি অয়েল)",
                "Ceramide NP, AP, EOP (সেরামাইড কমপ্লেক্স)",
                "Glycolic Acid / AHA (গ্লাইকোলিক অ্যাসিড)",
                "Kojic Acid & Glutathione (কোজিক অ্যাসিড)",
                "Collagen & Peptide (কোলাজেন ও পেপটাইড)",
                "Glycerin & Shea Butter (শিয়া বাটার)",
              ]}
              placeholder="অন্য উপাদান লিখুন (যেমন: Zinc PCA)..."
            />

            <SelectWithCustom
              label="নেট ওজন / পরিমাণ (Net Volume / Weight) *"
              value={value.netWeightVolume}
              onChange={(v) => update("netWeightVolume", v)}
              options={[
                "30 ml",
                "50 ml",
                "100 ml",
                "150 ml",
                "200 ml",
                "250 ml",
                "400 ml",
                "500 ml",
                "15 g",
                "20 g",
                "30 g",
                "50 g",
                "100 g",
                "1 pc / প্যাক (Sheet Mask)",
              ]}
              placeholder="কাস্টম ওজন লিখুন (যেমন: 75 ml)..."
            />

            <SelectWithCustom
              label="টেক্সচার / ফর্মুলেশন (Formulation / Texture)"
              value={value.formulation}
              onChange={(v) => update("formulation", v)}
              options={[
                "লাইটওয়েট জেল (Lightweight Non-sticky Gel)",
                "নরম ও মসৃণ ক্রিম (Smooth Cream)",
                "ওয়াটার বেসড লোশন (Water-based Fluid)",
                "তরল সিরাম (Fast Absorbing Serum)",
                "ফোমিং ওয়াশ (Foaming Cleanser)",
                "অয়েল ও এসেন্স (Nourishing Oil)",
                "কাদামাটি / মাড (Clay / Mud)",
                "স্টিক / লিপবাম (Solid Stick / Balm)",
              ]}
              placeholder="অন্যান্য টেক্সচার লিখুন..."
            />
          </div>
        </div>

        {/* 4. SUN PROTECTION, USAGE & TARGET */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
            <Sun size={14} className="text-rose-500" />
            <span>৪. সান প্রোটেকশন, ব্যবহার ও সুরক্ষা (Protection, Usage & Safety)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithCustom
              label="সানস্ক্রিন মাত্রা (SPF / Sun Protection)"
              value={value.spf}
              onChange={(v) => update("spf", v)}
              options={[
                "প্রযোজ্য নয় (Not Applicable / Non-SPF)",
                "SPF 50+ PA++++ (সর্বোচ্চ ব্রড স্পেকট্রাম)",
                "SPF 50 PA+++",
                "SPF 30 PA++",
                "SPF 40 PA+++",
                "SPF 60+",
                "UVA / UVB Protection",
              ]}
              placeholder="কাস্টম SPF লিখুন..."
            />

            <SelectWithCustom
              label="ব্যবহারের সময় (Application Time / Routine)"
              value={value.applicationTime}
              onChange={(v) => update("applicationTime", v)}
              options={[
                "দিনে ও রাতে উভয় সময়ে (Day & Night)",
                "শুধুমাত্র দিনের বেলা (Daytime / Morning Only)",
                "শুধুমাত্র রাতে ঘুমানোর পূর্বে (Nighttime / PM Only)",
                "রোদে যাওয়ার ১৫-২০ মিনিট পূর্বে (Before Sun Exposure)",
                "গোসলের পরে আর্দ্র ত্বকে (After Shower)",
                "সপ্তাহে ২-৩ দিন (2-3 Times Weekly)",
              ]}
              placeholder="কাস্টম ব্যবহারের সময় লিখুন..."
            />

            <SelectWithCustom
              label="কাদের জন্য প্রযোজ্য (Target Gender / User)"
              value={value.targetGender}
              onChange={(v) => update("targetGender", v)}
              options={[
                "ইউনিসেক্স - উভয়ের জন্য (Unisex / All)",
                "মহিলাদের যত্ন (Women's Care)",
                "পুরুষদের যত্ন (Men's Grooming)",
                "শিশু ও বেবি সেফ (Kids & Baby Safe)",
              ]}
              placeholder="অন্যান্য লিখুন..."
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectWithCustom
              label="সার্টিফিকেশন ও নিরাপত্তা (Safety & Certification)"
              value={value.certifications}
              onChange={(v) => update("certifications", v)}
              options={[
                "ডার্মাটোলজিক্যালি টেস্টেড (Dermatologically Tested)",
                "প্যারাবেন ও সালফেট মুক্ত (Paraben & Sulphate Free)",
                "১০০% অ্যালকোহল ও কৃত্রিম সুবাস মুক্ত (Fragrance-Free)",
                "১০০% হালাল ও ক্রুয়েলটি-ফ্রি (Halal Certified & Cruelty-Free)",
                "নন-কমেডোজেনিক - লোমকূপ বন্ধ করে না (Non-Comedogenic)",
                "হাইপোঅ্যালার্জেনিক - সংবেদনশীল ত্বকে নিরাপদ (Hypoallergenic)",
                "১০০% অর্গানিক ও প্রাকৃতিক (Organic & Natural)",
              ]}
              placeholder="অন্যান্য সার্টিফিকেট লিখুন..."
            />

            <SelectWithCustom
              label="উৎপাদনকারী দেশ (Country of Origin)"
              value={value.countryOfOrigin}
              onChange={(v) => update("countryOfOrigin", v)}
              options={[
                "দক্ষিণ কোরিয়া (South Korea - K-Beauty)",
                "মার্কিন যুক্তরাষ্ট্র (USA)",
                "ফ্রান্স (France)",
                "যুক্তরাজ্য (UK)",
                "জাপান (Japan - J-Beauty)",
                "থাইল্যান্ড (Thailand)",
                "ভারত (India)",
                "বাংলাদেশ (Bangladesh)",
                "জার্মানি (Germany)",
              ]}
              placeholder="অন্য দেশের নাম লিখুন..."
            />

            <SelectWithCustom
              label="মেয়াদকাল / পিএও (Expiry / PAO)"
              value={value.expiryDate}
              onChange={(v) => update("expiryDate", v)}
              options={[
                "খোলার পর ১২ মাস (12M Period After Opening)",
                "খোলার পর ৬ মাস (6M Period After Opening)",
                "খোলার পর ২৪ মাস (24M Period After Opening)",
                "উৎপাদনের তারিখ থেকে ৩ বছর (3 Years from MFG)",
                "উৎপাদনের তারিখ থেকে ২ বছর (2 Years from MFG)",
                "প্যাকেটে উল্লেখিত মেয়াদ দেখে নিন",
              ]}
              placeholder="কাস্টম মেয়াদকাল লিখুন..."
            />
          </div>
        </div>

        {/* 5. DYNAMIC CUSTOM SPECIFICATIONS */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <Sparkles size={14} className="text-rose-500" />
              <span>৫. অতিরিক্ত কাস্টম স্পেসিফিকেশন (Custom Specifications)</span>
            </div>
            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <Plus size={13} />
              <span>নতুন স্পেক যোগ করুন</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            উপরে উল্লেখিত তথ্যের বাইরে আপনার ক্রিম, লোশন বা কসমেটিক্স প্রোডাক্টের অন্য যেকোনো বৈশিষ্ট্য (যেমন: pH লেভেল, ফিনিশ, বিশেষ উপাদান) এখানে নাম ও মান লিখে যুক্ত করতে পারেন।
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
                      placeholder="লেবেল / নাম (যেমন: pH Level, Finish)"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "value", e.target.value)
                      }
                      placeholder="মান (যেমন: 5.5 Balances pH, Matte / Dewy)"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
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
          className="text-[11px] font-medium text-rose-600 hover:underline"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
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
