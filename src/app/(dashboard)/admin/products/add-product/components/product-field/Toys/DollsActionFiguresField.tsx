"use client";

import {
  Heart,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  Palette,
  Package,
} from "lucide-react";

export interface DollsActionFiguresAttributes {
  characterItemType?: string;
  brand?: string;
  franchiseCharacter?: string;
  figureDollHeight?: string;
  articulationJoints?: string;
  accessoriesIncluded?: string;
  materialPlushFilling?: string;
  washableSafety?: string;
  soundLightFeatures?: string;
  recommendedAge?: string;
  packagingType?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function DollsActionFiguresField({
  value = {},
  onChange,
  categoryName = "Dolls, Plush & Action Figures",
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

  const dollPresets = [
    "সফট প্লাশ টেডি বিয়ার (Soft Plush Giant Teddy Bear)",
    "ফ্যাশন বার্বি ডল ও ড্রেস সেট (Fashion Doll with Wardrobe)",
    "মার্ভেল অ্যাভেঞ্জার্স অ্যাকশন ফিগার (Marvel Avengers Action Figure)",
    "ট্রান্সফরমার রোবট টু কার (Transformers Transforming Robot)",
    "অ্যানিমে ও কার্টুন কালেক্টেবল ফিগার (Anime / Manga Collectible Figure)",
    "বেবি ফিডিং ডল ও স্ট্রোলার সেট (Interactive Baby Doll Nursery Set)",
    "ডাইনোসর ও প্রিহিস্টোরিক সাউন্ড ফিগার (Roaring Jurassic Dinosaur)",
    "কার্টুন ক্যারেক্টার প্লাশ (Pikachu, Minions, Doraemon Plush Toy)",
    "ডল হাউস ও ক্ষুদ্র ফার্নিচার কিট (Dollhouse Wooden Miniatures)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-pink-200/80 bg-gradient-to-r from-pink-50/70 via-white to-rose-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-700 shadow-xs">
            <Heart size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              পুতুল, প্লাশ ও অ্যাকশন ফিগার স্পেসিফিকেশন (Dolls & Action Figures Specs)
            </h3>
            <p className="text-xs text-slate-500">
              বার্বি, সফট টেডি বিয়ার, সুপারহিরো, ডলহাউস ও কালেক্টেবল ফিগারের বৈশিষ্ট্য
            </p>
          </div>
        </div>
        <span className="rounded-full bg-pink-100/90 px-3 py-1 text-xs font-semibold text-pink-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-pink-600" />
            <span>আইটেমের ধরন (Doll / Figure Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="doll-type-presets"
            value={value.characterItemType || ""}
            onChange={(e) => update("characterItemType", e.target.value)}
            placeholder="উদাহরণ: Fashion Doll with Changeable Dresses & Handbag"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
          <datalist id="doll-type-presets">
            {dollPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-pink-600" />
            <span>ব্র্যান্ড / ম্যানুফ্যাকচারার (Brand)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Barbie, Hasbro, Bandai, Mattel, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Franchise / Character */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-pink-600" />
            <span>চরিত্র / ফ্র্যাঞ্চাইজ (Franchise / Character)</span>
          </label>
          <input
            type="text"
            value={value.franchiseCharacter || ""}
            onChange={(e) => update("franchiseCharacter", e.target.value)}
            placeholder="e.g. Spiderman, Batman, Elsa (Frozen), Pikachu, Teddy"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Height / Scale */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Scale size={14} className="text-pink-600" />
            <span>উচ্চতা ও স্কেল (Height / Scale)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.figureDollHeight || ""}
            onChange={(e) => update("figureDollHeight", e.target.value)}
            placeholder="e.g. 12 Inch (30 cm) / 7 Inch / 3 Feet Giant Teddy"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Material & Plush Filling */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Palette size={14} className="text-pink-600" />
            <span>মেটেরিয়াল ও ফিলিং (Material & Filling)</span>
          </label>
          <input
            type="text"
            value={value.materialPlushFilling || ""}
            onChange={(e) => update("materialPlushFilling", e.target.value)}
            placeholder="e.g. Ultra-Soft Velvet Plush + 100% PP Cotton Filling / Vinyl PVC"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Articulation / Movable Joints */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-pink-600" />
            <span>মুভেবল জয়েন্ট / পোজ (Articulation Joints)</span>
          </label>
          <select
            value={value.articulationJoints || ""}
            onChange={(e) => update("articulationJoints", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          >
            <option value="">জয়েন্ট মুভমেন্ট নির্বাচন করুন</option>
            <option value="Multi-Joint Articulated (হাত, পা, ঘাড় ঘোরানো যায়)">মাল্টি-জয়েন্ট মুভেবল (হাত, পা, ঘাড় ঘোরানো যায়)</option>
            <option value="Fixed Pose Collectible (ফিক্সড স্ট্যাচু পোজ)">ফিক্সড স্ট্যাচু পোজ (Fixed Statue)</option>
            <option value="Super Soft Huggable (কোমল নরম আলিঙ্গনযোগ্য)">সুপার সফট টেডি (Huggable Plush)</option>
            <option value="Transformable Vehicle to Robot (রূপান্তরযোগ্য)">রূপান্তরযোগ্য রোবট (Transformable)</option>
          </select>
        </div>

        {/* Sound & Light Features */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-pink-600" />
            <span>সাউন্ড ও লাইট ফিচার (Sound & Light)</span>
          </label>
          <input
            type="text"
            value={value.soundLightFeatures || ""}
            onChange={(e) => update("soundLightFeatures", e.target.value)}
            placeholder="e.g. বোতাম টিপলে কথা বলে / আই এলইডি লাইটিং"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Accessories Included */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-pink-600" />
            <span>এক্সেসরিজ অনুষঙ্গ (Accessories Included)</span>
          </label>
          <input
            type="text"
            value={value.accessoriesIncluded || ""}
            onChange={(e) => update("accessoriesIncluded", e.target.value)}
            placeholder="e.g. অতিরিক্ত ৩টি ড্রেস, চিরুনি, জুতো, হ্যান্ডব্যাগ, অস্ত্র ও ঢাল"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* Washable Safety */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-pink-600" />
            <span>ধোয়া ও ওয়াশেবল সেফটি (Washable Safety)</span>
          </label>
          <select
            value={value.washableSafety || ""}
            onChange={(e) => update("washableSafety", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          >
            <option value="">ওয়াশ সেফটি নির্বাচন করুন</option>
            <option value="100% Machine Washable (মেশিনে ওয়াশ উপযোগী)">মেশিন ওয়াশ উপযোগী (Machine Washable)</option>
            <option value="Surface Hand Wipe Only (হালকা ভেজা কাপড় দিয়ে মুছুন)">হালকা ভেজা কাপড় দিয়ে মুছুন (Hand Wipe)</option>
            <option value="Do Not Wash - Electronic Inside (ইলেকট্রনিক সার্কিট রয়েছে, ধোয়া নিষেধ)">ধোয়া নিষেধ - ভেতরে ব্যাটারি/সার্কিট রয়েছে</option>
          </select>
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-pink-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age)</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="0+ Months (নবজাতক ও বেবি উপযোগী নরম টেডি)">০+ মাস (নবজাতক উপযোগী নরম প্লাশ)</option>
            <option value="3+ Years (ছোট শিশুদের ফ্যাশন ডল)">৩+ বছর (ডল ও অ্যাকশন ফিগার)</option>
            <option value="6+ Years (বিস্তারিত অ্যাকশন ফিগার)">৬+ বছর (ডিটেইলড অ্যাকশন ফিগার)</option>
            <option value="12+ Years (কালেক্টর্স এডিশন)">১২+ বছর (কালেক্টর্স এডিশন)</option>
          </select>
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-pink-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh, China, Indonesia"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-pink-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-pink-700"
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
                  placeholder="স্পেকের নাম (e.g. চুলের রঙ)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-1 focus:ring-pink-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. Golden Blonde Silky Hair)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-pink-500 focus:outline-hidden focus:ring-1 focus:ring-pink-200"
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
