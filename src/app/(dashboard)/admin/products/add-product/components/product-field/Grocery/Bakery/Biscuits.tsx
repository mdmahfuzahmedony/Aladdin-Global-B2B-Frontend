"use client";

import React from "react";

export interface BiscuitsData {
  brand?: string;
  biscuitType?: string;
  flavor?: string;
  netWeight?: string;
  weightUnit?: string;
  packType?: string;
  dietaryPreference?: string;
  texture?: string;
  keyIngredients?: string;
  allergenInfo?: string;
  packCount?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  shelfLife?: string;
  storageCondition?: string;
  countryOfOrigin?: string;
  certification?: string;
  isHalal?: string;
}

interface Props {
  value: BiscuitsData;
  onChange: (value: BiscuitsData) => void;
}

export default function Biscuits({ value = {}, onChange }: Props) {
  const update = (key: keyof BiscuitsData, fieldValue: string) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-slate-900">
            Biscuits Information (বিস্কুট তথ্য)
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Add specifications and details specific to this biscuit product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Brand */}
          <Input
            label="Brand (ব্র্যান্ড)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            placeholder="e.g. Olympic, Pran, Britannia, Haque, Oreo, Lexus"
          />

          {/* Biscuit Type */}
          <Select
            label="Biscuit Type (বিস্কুটের ধরন)"
            value={value.biscuitType}
            onChange={(v) => update("biscuitType", v)}
            options={[
              "Cream Biscuit (ক্রিম বিস্কুট)",
              "Digestive / Whole Wheat (ডাইজেস্টিভ)",
              "Salted Crackers (সল্টেড ক্র্যাকার্স)",
              "Butter Biscuit (বাটার বিস্কুট)",
              "Glucose Biscuit (গ্লুকোজ বিস্কুট)",
              "Chocolate Chip (চকলেট চিপ)",
              "Wafer Biscuit (ওয়েফার)",
              "Toast Biscuit (টোস্ট)",
              "Dry Cake (ড্রাই কেক)",
              "Sugar-Free (সুগার-ফ্রি)",
              "Marie Biscuit (মেরি বিস্কুট)",
              "Oatmeal Biscuit (ওটমিল)",
              "Other (অন্যান্য)",
            ]}
          />

          {/* Flavor */}
          <Input
            label="Flavor (ফ্লেভার / স্বাদ)"
            value={value.flavor}
            onChange={(v) => update("flavor", v)}
            placeholder="e.g. Chocolate, Vanilla, Strawberry, Elaichi, Butter, Salty"
          />

          {/* Net Weight */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                label="Net Weight (পরিমাণ / ওজন)"
                value={value.netWeight}
                onChange={(v) => update("netWeight", v)}
                placeholder="e.g. 50, 100, 250, 500"
              />
            </div>
            <div>
              <Select
                label="Unit (একক)"
                value={value.weightUnit || "g"}
                onChange={(v) => update("weightUnit", v)}
                options={["g", "kg", "mg", "Pack", "Box", "Pcs"]}
              />
            </div>
          </div>

          {/* Packaging Type */}
          <Select
            label="Packaging Type (প্যাকেটের ধরন)"
            value={value.packType}
            onChange={(v) => update("packType", v)}
            options={[
              "Standard Packet / Pouch (সাধারণ প্যাকেট)",
              "Family Pack (ফ্যামিলি প্যাক)",
              "Box / Carton (বক্স / কার্টন)",
              "Tin Can (টিন ক্যান)",
              "Plastic Jar / Container (জার)",
              "Foil Wrapped (ফয়েল মোড়ক)",
              "Other (অন্যান্য)",
            ]}
          />

          {/* Dietary Preference */}
          <Select
            label="Dietary Preference (খাদ্য প্রকার)"
            value={value.dietaryPreference}
            onChange={(v) => update("dietaryPreference", v)}
            options={[
              "100% Vegetarian (নিরামিষ)",
              "Halal Certified (হালাল সার্টিফায়েড)",
              "Eggless (ডিম ছাড়া)",
              "Sugar-Free (চিনি মুক্ত)",
              "Gluten-Free (গ্লুটেন মুক্ত)",
              "Non-Vegetarian (আমিষ)",
              "Regular (সাধারণ)",
            ]}
          />

          {/* Texture */}
          <Select
            label="Texture (টেক্সচার / গঠন)"
            value={value.texture}
            onChange={(v) => update("texture", v)}
            options={[
              "Crispy & Crunchy (মুচমুচে)",
              "Soft & Crumbly (নরম)",
              "Cream Filled (ক্রিম যুক্ত)",
              "Layered / Wafer (লেয়ার্ড)",
              "Dense (ঘন)",
            ]}
          />

          {/* Pack Count */}
          <Input
            label="Pieces / Pack Count (পিস সংখ্যা / প্যাক সাইজ)"
            value={value.packCount}
            onChange={(v) => update("packCount", v)}
            placeholder="e.g. Single Pack, 10 Pcs, Pack of 6"
          />

          {/* Key Ingredients */}
          <Input
            label="Key Ingredients (প্রধান উপাদানসমূহ)"
            value={value.keyIngredients}
            onChange={(v) => update("keyIngredients", v)}
            placeholder="e.g. Wheat Flour, Sugar, Vegetable Oil, Milk Powder, Salt"
          />

          {/* Allergen Information */}
          <Input
            label="Allergen Info (অ্যালার্জি তথ্য)"
            value={value.allergenInfo}
            onChange={(v) => update("allergenInfo", v)}
            placeholder="e.g. Contains Wheat, Milk Solids, Soy, May contain traces of nuts"
          />

          {/* Shelf Life */}
          <Select
            label="Shelf Life (সংরক্ষণ কাল / মেয়াদকাল)"
            value={value.shelfLife}
            onChange={(v) => update("shelfLife", v)}
            options={[
              "3 Months",
              "6 Months",
              "9 Months",
              "12 Months (1 Year)",
              "18 Months",
              "24 Months (2 Years)",
            ]}
          />

          {/* Storage Condition */}
          <Select
            label="Storage Condition (সংরক্ষণ পদ্ধতি)"
            value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={[
              "Store in a cool & dry place (শুষ্ক ও ঠান্ডা স্থানে রাখুন)",
              "Keep away from direct sunlight (সরাসরি সূর্যালোক থেকে দূরে রাখুন)",
              "Keep in an airtight container once opened (খোলার পর বায়ুরোধী পাত্রে রাখুন)",
              "Refrigerated (রেফ্রিজারেটরে রাখুন)",
              "Room Temperature (সাধারণ তাপমাত্রায়)",
            ]}
          />

          {/* Manufacturing Date */}
          <Input
            label="Manufacturing Date (উৎপাদন তারিখ)"
            type="date"
            value={value.manufacturingDate}
            onChange={(v) => update("manufacturingDate", v)}
          />

          {/* Expiry Date */}
          <Input
            label="Expiry Date / Best Before (মেয়াদ উত্তীর্ণের তারিখ)"
            type="date"
            value={value.expiryDate}
            onChange={(v) => update("expiryDate", v)}
          />

          {/* Country of Origin */}
          <Input
            label="Country of Origin (উৎপাদক দেশ)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            placeholder="e.g. Bangladesh, India, UK, Malaysia, Indonesia"
          />

          {/* Halal Certified */}
          <Select
            label="Halal Certified (হালাল সার্টিফায়েড)"
            value={value.isHalal}
            onChange={(v) => update("isHalal", v)}
            options={["Yes (হ্যাঁ)", "No (না)"]}
          />

          {/* Certification */}
          <Input
            label="Quality Certification (মান সনদ)"
            value={value.certification}
            onChange={(v) => update("certification", v)}
            placeholder="e.g. BSTI, ISO 22000, HACCP, Halal"
          />
        </div>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
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
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
