"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  Tag,
  Scale,
  ShieldCheck,
  Calendar,
  Layers,
  Globe,
  Plus,
  Trash2,
  UtensilsCrossed,
  Coffee,
  CheckCircle2,
} from "lucide-react";

export interface GroceryAttributes {
  groceryItemType?: string;
  brand?: string;
  productVariant?: string;
  netWeightVolume?: string;
  packagingType?: string;
  servingUnit?: string;
  foodCertification?: string;
  shelfLife?: string;
  storageCondition?: string;
  dietaryTags?: string;
  ingredients?: string;
  countryOfOrigin?: string;
  manufacturerDetails?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
  initialGroup?: string;
}

export default function GroceryCategoryField({
  value = {},
  onChange,
  categoryName = "Grocery & Food Items",
  initialGroup = "COOKING",
}: Props) {
  const [activeGroup, setActiveGroup] = useState<string>(initialGroup);

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

  // Group quick type presets
  const groupPresets: Record<string, string[]> = {
    COOKING: [
      "মিনিকেট চাল (Miniket Rice)",
      "নাজিরশাইল চাল (Najirshail Rice)",
      "চিনিগুড়া চাল (Chinigura Polao Rice)",
      "বাসমতি চাল (Basmati Rice)",
      "মসুর ডাল (Red Lentils / Masoor Dal)",
      "মুগ ডাল (Moong Dal)",
      "সয়াবিন তেল (Soybean Oil)",
      "সরিষার তেল (Mustard Oil)",
      "সূর্যমুখী তেল (Sunflower Oil)",
      "অলিভ অয়েল (Olive Oil)",
      "ঘি (Pure Ghee)",
      "গম আটা (Wheat Atta)",
      "ময়দা (Refined Flour / Maida)",
      "সুজি (Semolina / Suji)",
      "লবণ (Iodized Salt)",
      "চিনি (Sugar)",
      "মরিচ গুঁড়া (Chili Powder)",
      "হলুদ গুঁড়া (Turmeric Powder)",
      "ধনিয়া গুঁড়া (Coriander Powder)",
      "জিরা গুঁড়া (Cumin Powder)",
      "গরম মসলা (Garam Masala)",
      "মাংসের মসলা (Meat Curry Masala)",
      "বিরিয়ানি মসলা (Biryani Masala)",
      "বেকিং পাউডার / সোডা (Baking Powder)",
    ],
    BAKERY: [
      "পাউরুটি (Bread / White Bread)",
      "ব্রাউন ব্রেড (Brown / Whole Wheat Bread)",
      "টোস্ট ও বিস্কুট (Toast & Bakery Biscuits)",
      "ক্র্যাকার বিস্কুট (Salted Cracker Biscuits)",
      "কুকিজ (Cookies & Butter Cookies)",
      "কেক ও মাফিন (Cakes & Muffins)",
      "চিপস ও নাচোস (Potato Chips & Nachos)",
      "ইনস্ট্যান্ট নুডলস (Instant Noodles)",
      "পাস্তা ও ম্যাকারনি (Pasta & Macaroni)",
      "চকোলেট (Chocolates & Bars)",
      "ক্যান্ডি ও ললিপপ (Candies & Sweets)",
      "জ্যাম ও জেলি (Fruit Jam & Jelly)",
      "টমেটো সস / কেচাপ (Tomato Ketchup)",
      "মেয়োনিজ ও সালাদ ড্রেসিং (Mayonnaise)",
      "সিরিয়াল ও কর্নফ্লেকস (Corn Flakes)",
      "ওটস (Oatmeal & Rolled Oats)",
      "চানাচুর ও ডালভাজা (Chanachur & Dal Bhaja)",
    ],
    BEVERAGES: [
      "কালো চা পাতা (Black Tea Leaves)",
      "গ্রিন টি ও হারবাল টি (Green Tea / Herbal Tea)",
      "টি-ব্যাগ (Tea Bags Box)",
      "ইনস্ট্যান্ট কফি (Instant Coffee)",
      "ফিল্টার / রোস্টেড কফি (Roasted Coffee Beans)",
      "ম্যাংগো জুস ও নেকটার (Mango Fruit Drink)",
      "কমলা / আপেল জুস (Orange / Apple Juice)",
      "কোমল পানীয় (Soft Drink / Cola / Soda)",
      "মিনারেল ওয়াটার (Natural Mineral Water)",
      "এনার্জি ড্রিংক (Energy Drink)",
      "স্পোর্টস ও রিহাইড্রেশন ড্রিংক (Electrolyte Drink)",
      "চকলেট ও হরলিক্স ড্রিংক (Malted Health Food Drink)",
      "রুহ আফজা ও সিরাপ (Rooh Afza & Sharbat Syrup)",
      "লেমন ও পাউডার ড্রিংক (Tang / Powder Drink)",
    ],
    FRESH_DAIRY: [
      "তরল দুধ (Pasteurized Liquid Milk)",
      "ফুল ক্রিম গুঁড়া দুধ (Full Cream Milk Powder)",
      "মাখন (Butter / Salted Butter)",
      "পনির / চিজ (Cheddar / Mozzarella Cheese)",
      "মিষ্টি ও টক দই (Sweet & Sour Yogurt)",
      "ফার্মের মুরগির ডিম (Brown / White Eggs)",
      "দেশি মুরগি ও ব্রয়লার চিকেন (Chicken Meat)",
      "গরুর মাংস (Fresh Beef)",
      "খাসির মাংস (Fresh Mutton)",
      "রুই / কাতলা / ইলিশ মাছ (Fresh Fish)",
      "চিংড়ি ও সি-ফুড (Prawn / Shrimp)",
      "আলু ও পেঁয়াজ (Potato & Onion)",
      "রসুন ও আদা (Garlic & Ginger)",
      "কাঁচা মরিচ ও ধনেপাতা (Green Chili & Coriander)",
      "মৌসুমি তাজা ফলমূল (Fresh Seasonal Fruits)",
    ],
    FROZEN_CANNED: [
      "ফ্রোজেন পরোটা (Frozen Plain / Aloo Paratha)",
      "চিকেন নাগেটস ও ফিঙ্গার (Chicken Nuggets)",
      "ফ্রোজেন সমুচা ও স্প্রিং রোল (Samosa & Spring Roll)",
      "ক্যানড টুনা মাছ (Canned Tuna Fish)",
      "ক্যানড মাশরুম (Canned Button Mushrooms)",
      "ক্যানড সুইট কর্ন (Canned Sweet Corn)",
      "টিনজাত রসগোল্লা ও মিষ্টি (Canned Sweets)",
      "হিমায়িত সবুজ মটরশুঁটি (Frozen Green Peas)",
      "ফ্রোজেন ফ্রেঞ্চ ফ্রাই (Frozen French Fries)",
    ],
    HOUSEHOLD: [
      "লন্ড্রি ডিটারজেন্ট পাউডার (Detergent Powder)",
      "ডিশওয়াশিং লিকুইড ও বার (Dishwash Liquid & Bar)",
      "টয়লেট ও ফ্লোর ক্লিনার (Toilet & Floor Cleaner)",
      "গ্লাস ক্লিনার স্প্রে (Glass Cleaner)",
      "এয়ার ফ্রেশনার ও রুম স্প্রে (Air Freshener)",
      "মশার স্প্রে ও কয়েল (Mosquito Spray & Coil)",
      "ফেসিয়াল টিস্যু ও টয়লেট পেপার (Facial & Toilet Tissue)",
      "বিড়ালের খাবার (Cat Food - Wet / Dry)",
      "কুকুরের খাবার (Dog Food)",
    ],
  };

  const currentItemOptions =
    groupPresets[activeGroup] || groupPresets["COOKING"];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-white to-green-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shadow-xs">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              গ্রোসারি ও খাদ্যদ্রব্য স্পেসিফিকেশন (Grocery & Food Specs)
            </h3>
            <p className="text-xs text-slate-500">
              {categoryName} • চাল, ডাল, তেল, আটা, মসলা, বেকারি, স্ন্যাকস, চা-কফি, পানীয়, দুগ্ধজাত পণ্য, শাকসবজি ও গৃহস্থালি পণ্য
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
          <Sparkles size={12} /> বিএসটিআই ও হালাল মানসম্মত স্পেক্স
        </span>
      </div>

      {/* Quick Category Group Navigation Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          গ্রোসারি উপ-বিভাগ নির্বাচন করুন (Quick Sub-Category Group):
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "COOKING", label: "🌾 চাল, ডাল, তেল ও মসলা (Cooking & Essentials)" },
            { id: "BAKERY", label: "🍪 বেকারি, স্ন্যাকস ও মিষ্টি (Bakery & Snacks)" },
            { id: "BEVERAGES", label: "☕ চা, কফি ও পানীয় (Beverages & Drinks)" },
            { id: "FRESH_DAIRY", label: "🥛 দুধ, ডিম, মাংস ও শাকসবজি (Dairy & Fresh)" },
            { id: "FROZEN_CANNED", label: "❄️ ফ্রোজেন ও টিনজাত খাবার (Frozen & Canned)" },
            { id: "HOUSEHOLD", label: "🧼 গৃহস্থালি ক্লিনিং ও পেট কেয়ার (Household & Pet)" },
          ].map((grp) => {
            const isSelected = activeGroup === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => setActiveGroup(grp.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {grp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Item Identification & Brand */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Tag size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ১. পণ্যের ধরণ ও ব্র্যান্ড (Item Type & Brand Identification)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="পণ্যের ধরণ / ভ্যারাইটি (Item Type)"
            value={value.groceryItemType}
            onChange={(v) => update("groceryItemType", v)}
            options={currentItemOptions}
            placeholder="যেমন: মিনিকেট চাল, সরিষার তেল, গ্রিন টি, চকোলেট কুকিজ..."
          />

          <SelectWithCustom
            label="ব্র্যান্ড / উৎপাদনকারী (Brand / Manufacturer)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            options={[
              "Pran (প্রাণ)",
              "Radhuni (রাঁধুনী)",
              "Square Consumer Products",
              "Teer (তীর)",
              "Fresh (ফ্রেশ - মেঘনা গ্রুপ)",
              "ACI Pure",
              "Rupchanda (রূপচাঁদা)",
              "Bashundhara (বসুন্ধরা)",
              "Aarong Dairy (আড়ং)",
              "Kazi & Kazi Tea",
              "Ispahani (ইস্পাহানি)",
              "Dano (ড্যানো)",
              "Marks (মার্কস)",
              "Nestle (নেসলে)",
              "Nescafe (নেসক্যাফে)",
              "Maggi (ম্যাগি)",
              "Olympic (অলিম্পিক)",
              "Haque (হক)",
              "Dan Cake (ড্যান কেক)",
              "Coca-Cola",
              "Pepsi",
              "Mojo (মোজো)",
              "Kinley / Mum Water",
              "Wheel / Rin / Surf Excel",
              "Vim / Trix",
              "Harpic",
              "Whiskas / Drools (Pet)",
              "Local Producer (দেশি খাঁটি খামার)",
            ]}
            placeholder="যেমন: Akij, Bengal, Kazi Farms..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              ভ্যারিয়েন্ট বা স্পেশাল গ্রেড (Variant / Grade)
            </label>
            <input
              type="text"
              value={value.productVariant ?? ""}
              onChange={(e) => update("productVariant", e.target.value)}
              placeholder="যেমন: প্রিমিয়াম এক্সপোর্ট কোয়ালিটি, ১০০% কোল্ড প্রেসড, অর্গানিক, সুগার ফ্রি..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Weight, Volume & Packaging */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Scale size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ২. পরিমাণ, ওজন ও মোড়ক (Net Weight, Volume & Packaging)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="নেট ওজন / আয়তন (Net Weight / Volume)"
            value={value.netWeightVolume}
            onChange={(v) => update("netWeightVolume", v)}
            options={[
              "1 kg (১ কেজি)",
              "2 kg (২ কেজি)",
              "5 kg (৫ কেজি)",
              "10 kg (১০ কেজি)",
              "25 kg (২৫ কেজি বস্তা)",
              "50 kg (৫০ কেজি বস্তা)",
              "500 gm (৫০০ গ্রাম)",
              "250 gm (২৫০ গ্রাম)",
              "100 gm (১০০ গ্রাম)",
              "50 gm (৫০ গ্রাম)",
              "250 ml (২৫০ মি.লি.)",
              "500 ml (৫০০ মি.লি.)",
              "1 Litre (১ লিটার)",
              "2 Litre (২ লিটার)",
              "5 Litre (৫ লিটার জার)",
              "1 Dozen / 12 pcs (১ ডজন)",
              "24 pcs (২৪ পিস কার্টন)",
              "50 Tea Bags Box",
              "100 Tea Bags Box",
            ]}
            placeholder="যেমন: 750gm, 1.5L, 30 পিস..."
          />

          <SelectWithCustom
            label="প্যাকেজিং এর ধরণ (Packaging Type)"
            value={value.packagingType}
            onChange={(v) => update("packagingType", v)}
            options={[
              "Packet / Pouch (প্যাকেট / পাউচ)",
              "Food Grade Poly Bag (পলি ব্যাগ)",
              "Plastic Bottle (পিইটি বোতল)",
              "Glass Bottle (কাঁচের বোতল)",
              "Tin Can / Container (টিনের কৌটা / ক্যান)",
              "Hard Box / Paper Carton (বক্স / কার্টন)",
              "Airtight Jar (বায়ুরোধী জার)",
              "Jute / PP Woven Sack (চটের বা প্লাস্টিক বস্তা)",
              "Vacuum Sealed Pack (ভ্যাকুয়াম সিল প্যাক)",
              "Foil Sachet Pack (ফয়েল স্যাশে প্যাক)",
              "Loose / Open (খোলা পণ্য)",
            ]}
            placeholder="যেমন: Tetra Pak, Blister Pack..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              প্যাকের ভিতরের একক / সংখ্যা (Serving Units / Pcs)
            </label>
            <input
              type="text"
              value={value.servingUnit ?? ""}
              onChange={(e) => update("servingUnit", e.target.value)}
              placeholder="যেমন: প্রতি প্যাকে ২০ পিস, ২৪ স্যাশে, ১০ বার..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Certification, Shelf Life & Storage */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৩. খাদ্যমান অনুমোদন ও সংরক্ষণ শর্ত (Quality Certification & Storage)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="খাদ্যমান ও সনদপত্র (Certification / Quality Standard)"
            value={value.foodCertification}
            onChange={(v) => update("foodCertification", v)}
            options={[
              "BSTI Certified (বিএসটিআই অনুমোদিত)",
              "100% Halal Certified (১০০% হালাল সনদপ্রাপ্ত)",
              "BSTI & 100% Halal Certified",
              "100% Organic Certified (অর্গানিক)",
              "ISO 22000 Food Safety Certified",
              "HACCP Certified Quality",
              "Food Grade Quality",
              "GMP Quality Assured",
              "Chemical & Formalin Free (কেমিক্যাল ও ফরমালিন মুক্ত)",
            ]}
            placeholder="যেমন: USDA Organic, FDA Approved..."
          />

          <SelectWithCustom
            label="মেয়াদকাল / ব্যবহারের সময়সীমা (Shelf Life)"
            value={value.shelfLife}
            onChange={(v) => update("shelfLife", v)}
            options={[
              "24 Months (২ বছর)",
              "18 Months (১.৫ বছর)",
              "12 Months / 1 Year (১ বছর)",
              "9 Months (৯ মাস)",
              "6 Months (৬ মাস)",
              "3 Months (৩ মাস)",
              "1 Month (১ মাস)",
              "7 Days (৭ দিন)",
              "3 Days / Fresh Daily (তাজা খাদ্য)",
            ]}
            placeholder="যেমন: 45 Days, 15 Months..."
          />

          <SelectWithCustom
            label="সংরক্ষণ নির্দেশিকা (Storage Condition)"
            value={value.storageCondition}
            onChange={(v) => update("storageCondition", v)}
            options={[
              "Cool & Dry Place (ঠান্ডা ও শুষ্ক স্থানে রাখুন)",
              "Room Temperature (স্বাভাবিক কক্ষ তাপমাত্রায়)",
              "Refrigerated at 2°C - 4°C (ফ্রিজে রাখুন)",
              "Deep Freeze at -18°C (ডিপ ফ্রিজে সংরক্ষণ করুন)",
              "Keep Away from Direct Sunlight (সরাসরি রোদের বাইরে রাখুন)",
              "Airtight Container after Opening (খোলার পর বয়ামে রাখুন)",
            ]}
            placeholder="যেমন: Keep frozen, Shake well before use..."
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-slate-700">
            ডায়েট ও বিশেষ বৈশিষ্ট্য (Dietary Tags / Key Highlights)
          </label>
          <input
            type="text"
            value={value.dietaryTags ?? ""}
            onChange={(e) => update("dietaryTags", e.target.value)}
            placeholder="যেমন: ১০০% হালাল, কোলেস্টেরল মুক্ত, আঠাহীন (Gluten-Free), কোনো কৃত্রিম রঙ বা প্রিজারভেটিভ নেই..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 4. Ingredients & Origin */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Globe size={15} className="text-emerald-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৪. উপাদান ও প্রস্তুতকারকের তথ্য (Ingredients & Origin)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              মূল উপাদানসমূহ (Key Ingredients / Contents)
            </label>
            <textarea
              rows={2}
              value={value.ingredients ?? ""}
              onChange={(e) => update("ingredients", e.target.value)}
              placeholder="যেমন: ১০০% খাঁটি সরিষার বীজ, কিংবা: গম, পানি, চিনি, ইস্ট, ভিটামিন ও আয়োডাইজড লবণ..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="space-y-4">
            <SelectWithCustom
              label="উৎপাদনকারী দেশ (Country of Origin)"
              value={value.countryOfOrigin}
              onChange={(v) => update("countryOfOrigin", v)}
              options={[
                "Bangladesh (বাংলাদেশ)",
                "India (ভারত)",
                "Thailand (থাইল্যান্ড)",
                "Malaysia (মালয়েশিয়া)",
                "Vietnam (ভিয়েতনাম)",
                "Australia (অস্ট্রেলিয়া)",
                "New Zealand (নিউজিল্যান্ড)",
                "United Kingdom (যুক্তরাজ্য)",
                "United States (যুক্তরাষ্ট্র)",
                "Turkey (তুরস্ক)",
                "United Arab Emirates (সংযুক্ত আরব আমিরাত)",
              ]}
              placeholder="যেমন: Sri Lanka, China, Italy..."
            />

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                প্রস্তুতকারক ও মোড়কজাতকরণ কারখানা (Manufacturer / Packer Details)
              </label>
              <input
                type="text"
                value={value.manufacturerDetails ?? ""}
                onChange={(e) => update("manufacturerDetails", e.target.value)}
                placeholder="যেমন: প্রাণ অ্যাগ্রো লিমিটেড, পলাশ, নরসিংদী..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Dynamic Custom Specifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              ৫. কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={13} />
            নতুন স্পেসিফিকেশন যোগ করুন
          </button>
        </div>

        {customSpecs.length === 0 ? (
          <p className="text-center py-4 text-xs text-slate-400">
            নির্দিষ্ট কোনো বৈশিষ্ট্য (যেমন: আর্দ্রতা, ফ্যাট কনটেন্ট, রোস্ট লেভেল, ব্রিডিং জেলা ইত্যাদি) যুক্ত করতে উপরের বাটনে ক্লিক করুন।
          </p>
        ) : (
          <div className="space-y-2.5">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="বৈশিষ্ট্যের নাম (যেমন: ফ্যাট কনটেন্ট / রোস্টিং লেভেল / ক্যাফেইন)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="মান / বর্ণনা (যেমন: ৩.৫% ফ্যাট, মিডিয়াম ডার্ক রোস্ট, ১০০% ক্যাফেইন ফ্রি)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomSpec(spec.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
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
          {showCustomInput ? "তালিকা দেখুন" : "+ কাস্টম লিখুন"}
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
          <option value="__custom__">+ অন্য কোনো মান (কাস্টম টাইপ করুন)</option>
        </select>
      )}
    </div>
  );
}
