"use client";

import {
  Gift,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Tag,
  Heart,
  Palette,
  Package,
} from "lucide-react";

export interface PersonalizedGiftsAttributes {
  giftItemType?: string;
  brandMaker?: string;
  targetOccasion?: string;
  targetRecipient?: string;
  customizationOptions?: string;
  materialComposition?: string;
  dimensionsSize?: string;
  lightingElectronics?: string;
  packagingBoxType?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function PersonalizedGiftsField({
  value = {},
  onChange,
  categoryName = "Personalized & Custom Gifts",
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

  const giftPresets = [
    "কাস্টমাইজড ১৬-কালার থ্রিডি মুন ল্যাম্প (Personalized 3D Moon Lamp)",
    "ম্যাজিক কালার চেঞ্জিং ফটো সিরামিক মগ (Magic Photo Coffee Mug)",
    "রোটেটিং উডেন ফটো ফ্রেম ও নাইট ল্যাম্প (Rotating Wooden Photo Frame)",
    "কাপল রিস্ট ওয়াচ ও লেদার ওয়ালেট কম্বো বক্স (Couple Watch & Wallet Box)",
    "লেজার খোদাই করা মেটালিক কিচেইন (Custom Engraved Metal Keychain)",
    "অ্যাক্রিলিক এলইডি ফটো প্লেক ও কিপসেক (Acrylic LED Photo Plaque)",
    "কাস্টম টেক্সট প্রিন্ট কুশন ও পিলো (Custom Photo Printed Pillow)",
    "পার্সোনালাইজড উডেন ডায়েরি ও পেন সেট (Engraved Wooden Diary & Pen)",
    "লাক্সারি পারফিউম গিফট সেট (Luxury Miniature Perfume Gift Box)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-rose-200/80 bg-gradient-to-r from-rose-50/70 via-white to-pink-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 shadow-xs">
            <Gift size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              পার্সোনালাইজড ও কাস্টম উপহার স্পেসিফিকেশন (Personalized Gifts Specs)
            </h3>
            <p className="text-xs text-slate-500">
              মুন ল্যাম্প, ম্যাজিক মগ, ফটো ফ্রেম, কাপল গিফট ও খোদাই করা উপহারের বৈশিষ্ট্য
            </p>
          </div>
        </div>
        <span className="rounded-full bg-rose-100/90 px-3 py-1 text-xs font-semibold text-rose-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-rose-600" />
            <span>উপহারের ধরন / আইটেম টাইপ (Gift Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="gift-type-presets"
            value={value.giftItemType || ""}
            onChange={(e) => update("giftItemType", e.target.value)}
            placeholder="উদাহরণ: Customized Photo 3D Moon Lamp with Wooden Stand"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
          <datalist id="gift-type-presets">
            {giftPresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand / Maker */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-rose-600" />
            <span>ব্র্যান্ড / মেকার (Brand / Maker)</span>
          </label>
          <input
            type="text"
            value={value.brandMaker || ""}
            onChange={(e) => update("brandMaker", e.target.value)}
            placeholder="e.g. Aladin Gifts, Krafto, Handmade, OEM"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Target Occasion */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Heart size={14} className="text-rose-600" />
            <span>উপহারের উপলক্ষ (Target Occasion)</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            value={value.targetOccasion || ""}
            onChange={(e) => update("targetOccasion", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          >
            <option value="">উপলক্ষ নির্বাচন করুন</option>
            <option value="Birthday (জন্মদিনের উপহার)">জন্মদিন (Birthday)</option>
            <option value="Anniversary & Wedding (বিয়ে ও বিবাহবার্ষিকী)">বিয়ে ও বিবাহবার্ষিকী (Wedding & Anniversary)</option>
            <option value="Valentine's Day (ভালোবাসা দিবস)">ভালোবাসা দিবস (Valentine's Day)</option>
            <option value="Eid & Festivals (ঈদ ও ধর্মীয় উৎসব)">ঈদ ও ধর্মীয় উৎসব (Eid & Festivals)</option>
            <option value="Corporate & Office Event (অফিস ও কর্পোরেট)">অফিস ও কর্পোরেট গিফট (Corporate)</option>
            <option value="All Occasions (সার্বজনীন যেকোনো উপলক্ষ)">সার্বজনীন যেকোনো উপলক্ষ (All Occasions)</option>
          </select>
        </div>

        {/* Target Recipient */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Heart size={14} className="text-rose-600" />
            <span>কার জন্য উপযুক্ত (Target Recipient)</span>
          </label>
          <select
            value={value.targetRecipient || ""}
            onChange={(e) => update("targetRecipient", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          >
            <option value="">প্রাপক নির্বাচন করুন</option>
            <option value="Couples & Lovers (দম্পতি ও যুগলদের জন্য)">দম্পতি ও যুগলদের জন্য (Couples)</option>
            <option value="Friends & Besties (বন্ধুদের জন্য)">বন্ধুদের জন্য (Friends)</option>
            <option value="Parents & Family (বাবা-মা ও পরিবারের জন্য)">বাবা-মা ও পরিবারের জন্য (Family)</option>
            <option value="Colleagues & Boss (সহকর্মী ও বস)">সহকর্মী ও বস (Corporate / Colleagues)</option>
            <option value="Unisex (সবার জন্য)">সবার জন্য উপযোগী (Unisex)</option>
          </select>
        </div>

        {/* Customization Options */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Palette size={14} className="text-rose-600" />
            <span>কাস্টমাইজেশনের ধরন (Customization Options)</span>
          </label>
          <input
            type="text"
            value={value.customizationOptions || ""}
            onChange={(e) => update("customizationOptions", e.target.value)}
            placeholder="e.g. ছবি প্রিন্ট + নাম ও ভালোবাসার বার্তা খোদাই"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Material Composition */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-rose-600" />
            <span>মেটেরিয়াল ও গঠন (Primary Material)</span>
          </label>
          <input
            type="text"
            value={value.materialComposition || ""}
            onChange={(e) => update("materialComposition", e.target.value)}
            placeholder="e.g. Eco PLA + Natural Wood / Grade-A Ceramic"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Dimensions / Size */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-rose-600" />
            <span>সাইজ ও পরিমাপ (Dimensions / Size)</span>
          </label>
          <input
            type="text"
            value={value.dimensionsSize || ""}
            onChange={(e) => update("dimensionsSize", e.target.value)}
            placeholder="e.g. 15 cm Diameter / 350 ml (11 oz) / 4x6 Inch Frame"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Lighting & Electronics */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-rose-600" />
            <span>লাইট ও ব্যাটারি (Lighting & Battery)</span>
          </label>
          <input
            type="text"
            value={value.lightingElectronics || ""}
            onChange={(e) => update("lightingElectronics", e.target.value)}
            placeholder="e.g. 16 RGB Colors + Remote Touch + USB Rechargeable"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Packaging Box Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package size={14} className="text-rose-600" />
            <span>গিফট বক্স ও প্যাকেজিং (Gift Box & Packaging)</span>
          </label>
          <input
            type="text"
            value={value.packagingBoxType || ""}
            onChange={(e) => update("packagingBoxType", e.target.value)}
            placeholder="e.g. প্রিমিয়াম ভেলভেট কুশন হার্ডবক্স ও সাটিন ফিতা সহ"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-rose-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh (In-House Customized)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-rose-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-rose-700"
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
                  placeholder="স্পেকের নাম (e.g. খোদাইয়ের ফন্ট)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. Elegant Cursive Calligraphy)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-rose-500 focus:outline-hidden focus:ring-1 focus:ring-rose-200"
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
