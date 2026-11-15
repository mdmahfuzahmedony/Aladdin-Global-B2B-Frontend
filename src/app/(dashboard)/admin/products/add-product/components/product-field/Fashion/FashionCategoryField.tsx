"use client";

import React, { useState, useMemo } from "react";
import {
  Shirt,
  Scissors,
  Layers,
  Sparkles,
  Tag,
  ShieldCheck,
  Plus,
  Trash2,
  Box,
} from "lucide-react";

export type FashionType = "clothing" | "footwear" | "accessories";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function FashionCategoryField({
  value = {},
  onChange,
  categoryName = "Fashion Item",
}: Props) {
  const update = (key: string, v: any) => {
    onChange({ ...value, [key]: v });
  };

  // Determine initial fashion type based on categoryName
  const detectedType = useMemo<FashionType>(() => {
    const lower = (categoryName || "").toLowerCase();
    if (
      lower.includes("footwear") ||
      lower.includes("shoe") ||
      lower.includes("sandal") ||
      lower.includes("sneaker") ||
      lower.includes("boot") ||
      lower.includes("heel") ||
      lower.includes("flat") ||
      lower.includes("slipper") ||
      lower.includes("loafer") ||
      lower.includes("clog")
    ) {
      return "footwear";
    }
    if (
      lower.includes("bag") ||
      lower.includes("backpack") ||
      lower.includes("wallet") ||
      lower.includes("belt") ||
      lower.includes("cap") ||
      lower.includes("hat") ||
      lower.includes("watch") ||
      lower.includes("jewel") ||
      lower.includes("sunglass") ||
      lower.includes("frame") ||
      lower.includes("accessori")
    ) {
      return "accessories";
    }
    return "clothing";
  }, [categoryName]);

  const [activeType, setActiveType] = useState<FashionType>(
    (value.fashionType as FashionType) || detectedType,
  );

  const handleTypeChange = (newType: FashionType) => {
    setActiveType(newType);
    update("fashionType", newType);
  };

  // Dynamic custom specifications: array of { id, label, value }
  const customSpecs: Array<{ id: string; label: string; value: string }> =
    Array.isArray(value.customSpecs) ? value.customSpecs : [];

  const handleAddCustomSpec = () => {
    const newSpec = {
      id: "fspec_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      label: "",
      value: "",
    };
    update("customSpecs", [...customSpecs, newSpec]);
  };

  const handleUpdateCustomSpec = (
    id: string,
    field: "label" | "value",
    val: string,
  ) => {
    const updated = customSpecs.map((item) =>
      item.id === id ? { ...item, [field]: val } : item,
    );
    update("customSpecs", updated);
  };

  const handleRemoveCustomSpec = (id: string) => {
    const updated = customSpecs.filter((item) => item.id !== id);
    update("customSpecs", updated);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D6A419]/20 text-[#12233F]">
              <Shirt size={14} />
            </span>
            <h3 className="text-sm font-semibold text-slate-800">
              {categoryName} Specifications
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            পোশাক, জুতো বা অ্যাক্সেসরিজের ফেব্রিক, ফিট, সাইজ ও বৈশিষ্ট্য পূরণ করুন।
          </p>
        </div>

        {/* TYPE SWITCHER TABS */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => handleTypeChange("clothing")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeType === "clothing"
                ? "bg-[#D6A419] text-[#12233F] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shirt size={13} />
            <span>পোশাক (Clothing)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("footwear")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeType === "footwear"
                ? "bg-[#D6A419] text-[#12233F] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers size={13} />
            <span>জুতো (Footwear)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("accessories")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition ${
              activeType === "accessories"
                ? "bg-[#D6A419] text-[#12233F] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tag size={13} />
            <span>অ্যাক্সেসরিজ (Accessories)</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* ============================================================== */}
        {/* 1. CLOTHING / APPAREL FIELDS */}
        {/* ============================================================== */}
        {activeType === "clothing" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* FABRIC & MATERIAL */}
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Scissors size={14} className="text-[#D6A419]" />
                <span>কাপড় ও ম্যাটেরিয়াল (Fabric & Material)</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectWithCustom
                  label="কাপড়ের ধরন (Fabric / Material)"
                  value={value.fabric}
                  onChange={(v) => update("fabric", v)}
                  options={[
                    "১০০% খাঁটি সুতি (100% Pure Cotton)",
                    "কটন ব্লেন্ড (Cotton Blend)",
                    "প্রিমিয়াম সিল্ক (Pure Silk)",
                    "জর্জেট (Georgette)",
                    "লিনেন (Linen)",
                    "ডেনিম (Denim / Jeans)",
                    "শিফন (Chiffon)",
                    "ভিসকোস / রেয়ন (Viscose / Rayon)",
                    "পলিয়েস্টার (Polyester)",
                    "উল / পশম (Wool / Fleece)",
                    "মসলিন (Muslin)",
                    "অরগ্যাঞ্জা (Organza)",
                    "টুইল / গ্যাবার্ডিন (Twill / Gabardine)",
                  ]}
                  placeholder="অন্য কোনো ফেব্রিক লিখুন..."
                />

                <SelectWithCustom
                  label="ফিটিং (Fit Type)"
                  value={value.fit}
                  onChange={(v) => update("fit", v)}
                  options={[
                    "রেগুলার ফিট (Regular Fit)",
                    "স্লিম ফিট (Slim Fit)",
                    "ওভারসাইজড (Oversized)",
                    "রিল্যাক্সড ফিট (Relaxed Fit)",
                    "স্কিনি ফিট (Skinny Fit)",
                    "কমফোর্ট ফিট (Comfort Fit)",
                    "টেইলরড ফিট (Tailored Fit)",
                  ]}
                  placeholder="কাস্টম ফিটিং লিখুন..."
                />

                <SelectWithCustom
                  label="প্যাটার্ন ও কাজ (Pattern & Work)"
                  value={value.pattern}
                  onChange={(v) => update("pattern", v)}
                  options={[
                    "সলিড / এক কালার (Solid / Plain)",
                    "ডিজিটাল প্রিন্ট (Digital Printed)",
                    "স্ট্রাইপ (Striped)",
                    "চেক (Checked)",
                    "এমব্রয়ডারি কাজ (Embroidered)",
                    "হাতের কাজ / কারচুপির কাজ (Handcrafted)",
                    "ব্লক প্রিন্ট (Block Print)",
                    "জারদৌসি / সিকোয়েন্স (Zari / Sequin Work)",
                    "গ্রাফিক প্রিন্ট (Graphic Print)",
                  ]}
                  placeholder="কাস্টম ডিজাইন লিখুন..."
                />
              </div>
            </div>

            {/* CUT & STYLE DETAILS */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Shirt size={14} className="text-[#D6A419]" />
                <span>কাটিং ও স্টাইল (Style & Cut)</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SelectWithCustom
                  label="হাতা (Sleeve Type)"
                  value={value.sleeveType}
                  onChange={(v) => update("sleeveType", v)}
                  options={[
                    "ফুল হাতা (Full Sleeve)",
                    "হাফ হাতা (Half Sleeve)",
                    "থ্রি-কোয়ার্টার (3/4 Sleeve)",
                    "স্লিভলেস (Sleeveless)",
                    "রোল-আপ স্লিভ (Roll-up Sleeve)",
                  ]}
                />

                <SelectWithCustom
                  label="কলার / নেকলাইন (Collar & Neck)"
                  value={value.collarType}
                  onChange={(v) => update("collarType", v)}
                  options={[
                    "শার্ট কলার (Spread / Classic)",
                    "পোলো কলার (Polo Collar)",
                    "চাইনিজ / ম্যান্ডারিন কলার (Mandarin)",
                    "গোল গলা (Crew / Round Neck)",
                    "ভি-গলা (V-Neck)",
                    "হুডেড (Hooded)",
                    "বোট নেক (Boat Neck)",
                  ]}
                />

                <Input
                  label="ঝুল / দৈর্ঘ্য (Length)"
                  value={value.length}
                  onChange={(v) => update("length", v)}
                  placeholder="যেমন: 42 ইঞ্চি বা লং"
                />

                <SelectWithCustom
                  label="ব্যবহারের ক্ষেত্র (Occasion)"
                  value={value.occasion}
                  onChange={(v) => update("occasion", v)}
                  options={[
                    "ক্যাজুয়াল / দৈনন্দিন (Casual)",
                    "অফিস / ফরমাল (Formal / Office)",
                    "উৎসব ও পার্টি (Party / Festive)",
                    "বিয়ে ও ব্রাইডাল (Wedding / Bridal)",
                    "খেলাধুলা ও জিম (Activewear)",
                    "শীতকালীন (Winterwear)",
                  ]}
                />
              </div>
            </div>

            {/* GENDER & CARE */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <ShieldCheck size={14} className="text-[#D6A419]" />
                <span>টার্গেট ও যত্ন (Target & Care)</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select
                  label="টার্গেট (Gender / Age)"
                  value={value.gender}
                  onChange={(v) => update("gender", v)}
                  options={[
                    "পুরুষ (Men)",
                    "মহিলা (Women)",
                    "ছেলে শিশু (Boys)",
                    "মেয়ে শিশু (Girls)",
                    "নবজাতক (Infant / Baby)",
                    "ইউনিসেক্স (Unisex)",
                  ]}
                />

                <SelectWithCustom
                  label="ধোয়া ও যত্ন (Wash Care)"
                  value={value.careInstruction}
                  onChange={(v) => update("careInstruction", v)}
                  options={[
                    "মেশিন ওয়াশ করা যাবে (Machine Wash)",
                    "ঠাণ্ডা পানিতে হ্যান্ড ওয়াশ (Hand Wash Cold)",
                    "ড্রাই ক্লিন আবশ্যক (Dry Clean Only)",
                    "ব্লিচ ব্যবহার করবেন না (Do Not Bleach)",
                  ]}
                />

                <Input
                  label="ব্র্যান্ড / প্রস্তুতকারক (Brand)"
                  value={value.brand}
                  onChange={(v) => update("brand", v)}
                  placeholder="যেমন: Aarong, Richman, Yellow, নিজস্ব"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. FOOTWEAR FIELDS */}
        {/* ============================================================== */}
        {activeType === "footwear" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Layers size={14} className="text-[#D6A419]" />
                <span>ম্যাটেরিয়াল ও সোল (Material & Construction)</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectWithCustom
                  label="আপার ম্যাটেরিয়াল (Upper Material)"
                  value={value.upperMaterial}
                  onChange={(v) => update("upperMaterial", v)}
                  options={[
                    "খাঁটি চামড়া (Genuine Leather)",
                    "কৃত্রিম চামড়া (Synthetic / PU Leather)",
                    "মেশ ফেব্রিক (Breathable Mesh)",
                    "ক্যানভাস ফেব্রিক (Canvas Fabric)",
                    "সুয়েড লেদার (Suede Leather)",
                    "পিভিসি / রাবার (PVC / Rubber)",
                  ]}
                  placeholder="অন্য উপাদান লিখুন..."
                />

                <SelectWithCustom
                  label="সোল ম্যাটেরিয়াল (Sole Material)"
                  value={value.soleMaterial}
                  onChange={(v) => update("soleMaterial", v)}
                  options={[
                    "অ্যান্টি-স্লিপ রাবার (Anti-Slip Rubber)",
                    "হালকা EVA ফোম (Lightweight EVA)",
                    "টিপিআর সোল (TPR Sole)",
                    "পিইউ সোল (PU Sole)",
                    "লেদার সোল (Genuine Leather Sole)",
                  ]}
                  placeholder="কাস্টম সোল লিখুন..."
                />

                <SelectWithCustom
                  label="আটকে রাখার পদ্ধতি (Closure Type)"
                  value={value.closureType}
                  onChange={(v) => update("closureType", v)}
                  options={[
                    "ফিতা / লেইস (Lace-Up)",
                    "স্লিপ-অন (Slip-On / Loafer)",
                    "ভেলক্রো / বেল্ট (Velcro / Strap)",
                    "বাকল (Buckle)",
                    "জিপার (Zipper)",
                  ]}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Sparkles size={14} className="text-[#D6A419]" />
                <span>স্টাইল ও হিল (Style & Heel)</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SelectWithCustom
                  label="জুতার ধরন (Shoe Style)"
                  value={value.shoeType}
                  onChange={(v) => update("shoeType", v)}
                  options={[
                    "স্নিকার্স (Casual Sneakers)",
                    "ফরমাল অক্সফোর্ড / ডার্বি (Formal Shoes)",
                    "ক্যাজুয়াল লোফার (Loafers)",
                    "স্যান্ডেল / চটি (Sandals / Slippers)",
                    "স্পোর্টস / রানিং শু (Running Shoes)",
                    "হিল / পার্টি শু (Heels / Party)",
                    "বুট (Boots)",
                  ]}
                />

                <SelectWithCustom
                  label="হিলের ধরন (Heel Type)"
                  value={value.heelType}
                  onChange={(v) => update("heelType", v)}
                  options={[
                    "ফ্ল্যাট / সমতল (Flat)",
                    "লো হিল (Low Heel - 1-2 inch)",
                    "ব্লক হিল (Block Heel)",
                    "পেন্সিল / স্টিলেটো (Stiletto)",
                    "প্ল্যাটফর্ম (Platform)",
                    "ওয়েজ (Wedge)",
                  ]}
                />

                <Input
                  label="হিলের উচ্চতা (Heel Height)"
                  value={value.heelHeight}
                  onChange={(v) => update("heelHeight", v)}
                  placeholder="যেমন: 2.5 ইঞ্চি"
                />

                <Select
                  label="পানি প্রতিরোধী (Waterproof)"
                  value={value.waterproof}
                  onChange={(v) => update("waterproof", v)}
                  options={[
                    "১০০% ওয়াটারপ্রুফ (Waterproof)",
                    "ওয়াটার রেজিস্ট্যান্ট (Water Resistant)",
                    "সাধারণ (Not Waterproof)",
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. ACCESSORIES FIELDS */}
        {/* ============================================================== */}
        {activeType === "accessories" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Tag size={14} className="text-[#D6A419]" />
                <span>ম্যাটেরিয়াল ও স্পেসিফিকেশন (Material & Specs)</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectWithCustom
                  label="প্রধান উপাদান (Material)"
                  value={value.material}
                  onChange={(v) => update("material", v)}
                  options={[
                    "খাঁটি চামড়া (Genuine Leather)",
                    "পিইউ লেদার (PU Leather)",
                    "ক্যানভাস (Heavy Canvas)",
                    "নাইলন (Waterproof Nylon)",
                    "স্টেইনলেস স্টিল (Stainless Steel)",
                    "ব্রাস / মেটাল অ্যালয় (Brass / Alloy)",
                    "সিলিকন (Silicone / Rubber)",
                  ]}
                  placeholder="অন্য উপাদান লিখুন..."
                />

                <Input
                  label="কম্পার্টমেন্ট ও সাইজ (Compartments / Size)"
                  value={value.capacity}
                  onChange={(v) => update("capacity", v)}
                  placeholder="যেমন: 3 Compartments, 15.6 inch Laptop"
                />

                <SelectWithCustom
                  label="লক ও চেইন (Closure)"
                  value={value.closureType}
                  onChange={(v) => update("closureType", v)}
                  options={[
                    "মেটাল জিপার (Heavy Duty Zipper)",
                    "ম্যাগনেটিক লক (Magnetic Snap)",
                    "বাকল / ক্লিপ (Buckle / Clip)",
                    "কম্বিনেশন লক (Number Lock)",
                  ]}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <SelectWithCustom
                  label="ওয়াটার রেজিস্ট্যান্স (Water Resistance)"
                  value={value.waterResistance}
                  onChange={(v) => update("waterResistance", v)}
                  options={[
                    "ওয়াটারপ্রুফ (Waterproof)",
                    "ওয়াটার স্প্ল্যাশ রেজিস্ট্যান্ট (Water Resistant)",
                    "3 ATM / 30m Water Resistant",
                    "5 ATM / 50m Water Resistant",
                    "সাধারণ (Not Waterproof)",
                  ]}
                />

                <Input
                  label="ওয়ারেন্টি (Warranty)"
                  value={value.warranty}
                  onChange={(v) => update("warranty", v)}
                  placeholder="যেমন: 1 Year Machine Warranty, 6 Months"
                />

                <Input
                  label="ব্র্যান্ড (Brand)"
                  value={value.brand}
                  onChange={(v) => update("brand", v)}
                  placeholder="যেমন: Fastrack, Casio, Wildcraft"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. DYNAMIC CUSTOM SPECIFICATIONS */}
        {/* ============================================================== */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <Sparkles size={14} className="text-[#D6A419]" />
              <span>অতিরিক্ত কাস্টম স্পেসিফিকেশন (+ Custom Specs)</span>
            </div>

            <button
              type="button"
              onClick={handleAddCustomSpec}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6A419] bg-[#D6A419]/10 px-3 py-1.5 text-xs font-semibold text-[#12233F] transition hover:bg-[#D6A419]/20"
            >
              <Plus size={14} />
              <span>+ স্পেক যোগ করুন</span>
            </button>
          </div>

          {customSpecs.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
              নির্দিষ্ট কোনো স্পেসিফিকেশন থাকলে উপরে <strong>+ স্পেক যোগ করুন</strong> বাটনে ক্লিক করে ইচ্ছামতো ফিল্ড যুক্ত করতে পারেন (যেমন: কাপড়ের জিএসএম, ওড়নার বহর, লেন্সের ইউভি ফিল্টার ইত্যাদি)।
            </p>
          ) : (
            <div className="space-y-2">
              {customSpecs.map((spec, index) => (
                <div
                  key={spec.id || index}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 transition focus-within:border-[#D6A419]"
                >
                  <div className="w-1/3 min-w-[120px]">
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "label", e.target.value)
                      }
                      placeholder="স্পেকের নাম (যেমন: জিএসএম / GSM)"
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#D6A419]"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleUpdateCustomSpec(spec.id, "value", e.target.value)
                      }
                      placeholder="মান (যেমন: 180-190 GSM)"
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#D6A419]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCustomSpec(spec.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-rose-500 hover:bg-rose-50 transition"
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
    </section>
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
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
