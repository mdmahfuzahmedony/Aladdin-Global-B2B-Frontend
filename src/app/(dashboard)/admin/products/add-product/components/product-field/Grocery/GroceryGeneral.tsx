"use client";

import React from "react";

export interface GroceryGeneralData {
  brand?: string;
  itemType?: string;
  flavor?: string;
  netWeight?: string;
  weightUnit?: string;
  packType?: string;
  dietaryPreference?: string;
  keyIngredients?: string;
  allergenInfo?: string;
  storageCondition?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  shelfLife?: string;
  countryOfOrigin?: string;
  certification?: string;
}

interface Props {
  value: GroceryGeneralData;
  onChange: (value: GroceryGeneralData) => void;
  title?: string;
}

export default function GroceryGeneral({
  value = {},
  onChange,
  title = "Grocery Product Information (মুদি পণ্য তথ্য)",
}: Props) {
  const update = (key: keyof GroceryGeneralData, fieldValue: string) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="p-5">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          Add specifications, weight, ingredients, and shelf life for this grocery product.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Brand */}
          <Input
            label="Brand (ব্র্যান্ড)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            placeholder="e.g. Pran, Radhuni, Fresh, ACI, Olympic, Teer"
          />

          {/* Item Type / Subcategory */}
          <Input
            label="Item Type / Variety (পণ্যের ধরন)"
            value={value.itemType}
            onChange={(v) => update("itemType", v)}
            placeholder="e.g. Premium Quality, Regular, Organic"
          />

          {/* Flavor / Variation */}
          <Input
            label="Flavor / Variation (স্বাদ বা ভ্যারাইটি)"
            value={value.flavor}
            onChange={(v) => update("flavor", v)}
            placeholder="e.g. Natural, Spicy, Sweet, Plain"
          />

          {/* Net Weight & Unit */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                label="Net Weight / Volume (পরিমাণ)"
                value={value.netWeight}
                onChange={(v) => update("netWeight", v)}
                placeholder="e.g. 100, 250, 500, 1, 5"
              />
            </div>
            <div>
              <Select
                label="Unit (একক)"
                value={value.weightUnit || "g"}
                onChange={(v) => update("weightUnit", v)}
                options={["g", "kg", "ml", "L", "Pack", "Box", "Pcs"]}
              />
            </div>
          </div>

          {/* Packaging Type */}
          <Select
            label="Packaging Type (প্যাকেজিং)"
            value={value.packType}
            onChange={(v) => update("packType", v)}
            options={[
              "Pouch Packet (পাউচ প্যাকেট)",
              "Plastic Jar / Bottle (জার / বোতল)",
              "Box / Carton (বক্স)",
              "Tin Can (টিন ক্যান)",
              "Foil Bag (ফয়েল ব্যাগ)",
              "Glass Bottle (কাঁচের বোতল)",
              "Sack / Bag (বস্তা)",
            ]}
          />

          {/* Dietary Preference */}
          <Select
            label="Dietary Preference (খাদ্য প্রকার)"
            value={value.dietaryPreference}
            onChange={(v) => update("dietaryPreference", v)}
            options={[
              "100% Vegetarian (নিরামিষ)",
              "Halal Certified (হালাল)",
              "Sugar-Free (চিনিমুক্ত)",
              "Gluten-Free (গ্লুটেনমুক্ত)",
              "Organic (অর্গানিক)",
              "Non-Vegetarian (আমিষ)",
              "Regular (সাধারণ)",
            ]}
          />

          {/* Key Ingredients */}
          <Input
            label="Ingredients (উপাদানসমূহ)"
            value={value.keyIngredients}
            onChange={(v) => update("keyIngredients", v)}
            placeholder="e.g. Wheat, Rice, Salt, Spices, Oil"
          />

          {/* Allergen Info */}
          <Input
            label="Allergen Info (অ্যালার্জি তথ্য)"
            value={value.allergenInfo}
            onChange={(v) => update("allergenInfo", v)}
            placeholder="e.g. Contains Gluten, Soy, Nuts, Milk"
          />

          {/* Storage Condition */}
          <Select
            label="Storage Condition (সংরক্ষণ পদ্ধতি)"
            value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={[
              "Store in a cool & dry place (শুষ্ক ও ঠান্ডা স্থানে রাখুন)",
              "Keep away from direct sunlight (সরাসরি সূর্যালোক থেকে দূরে রাখুন)",
              "Refrigerate after opening (খোলার পর ফ্রিজে রাখুন)",
              "Store in airtight container (বায়ুরোধী পাত্রে রাখুন)",
            ]}
          />

          {/* Shelf Life */}
          <Select
            label="Shelf Life (মেয়াদকাল)"
            value={value.shelfLife}
            onChange={(v) => update("shelfLife", v)}
            options={[
              "1 Month",
              "3 Months",
              "6 Months",
              "9 Months",
              "12 Months (1 Year)",
              "18 Months",
              "24 Months (2 Years)",
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
            label="Expiry Date (মেয়াদ উত্তীর্ণের তারিখ)"
            type="date"
            value={value.expiryDate}
            onChange={(v) => update("expiryDate", v)}
          />

          {/* Country of Origin */}
          <Input
            label="Country of Origin (উৎপাদক দেশ)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            placeholder="e.g. Bangladesh, India, Malaysia"
          />

          {/* Quality Certification */}
          <Input
            label="Certification (সনদ)"
            value={value.certification}
            onChange={(v) => update("certification", v)}
            placeholder="e.g. BSTI, Halal Certified, ISO 22000"
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
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-slate-500"
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
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-slate-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
