"use client";

import { useState } from "react";
import {
  Baby,
  Sparkles,
  Tag,
  ShieldCheck,
  Scale,
  BatteryCharging,
  Layers,
  Brain,
  Package,
  Globe,
  Plus,
  Trash2,
  Gamepad2,
  AlertTriangle,
} from "lucide-react";

export interface ToyAttributes {
  toyItemType?: string;
  brand?: string;
  modelCharacter?: string;
  recommendedAge?: string;
  safetyCertifications?: string;
  chokingHazardWarning?: string;
  primaryMaterial?: string;
  dimensionsWeight?: string;
  batteryPowerType?: string;
  educationalSkillFocus?: string;
  interactiveFeatures?: string;
  piecesCount?: string;
  countryOfOrigin?: string;
  packagingType?: string;
  inTheBoxContents?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
  initialGroup?: string;
}

export default function ToyCategoryField({
  value = {},
  onChange,
  categoryName = "Toys & Games",
  initialGroup = "ALL",
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

  // 10 Toy Category Presets matching the Database Subcategories
  const groupPresets: Record<string, string[]> = {
    EDUCATIONAL: [
      "STEM লার্নিং কিট (STEM Learning Kit)",
      "সায়েন্স এক্সপেরিমেন্ট কিট (Science Experiment Kit)",
      "মন্টেসরি কাঠের খেলনা (Montessori Wooden Toy)",
      "অ্যালফাবেট ও বর্ণমালা বোর্ড (Alphabet & Number Board)",
      "ফ্ল্যাশ কার্ড ও অ্যাক্টিভিটি বুক (Flash Cards & Activity Book)",
      "ম্যাথ ও গণিত লার্নিং গেম (Math Counting & Calculation Toy)",
      "ইলেকট্রনিক স্পেলিং ও অডিও বুক (Audio English/Bangla Book)",
    ],
    BUILDING: [
      "বিল্ডিং ব্লকস সেট (Classic Building Blocks / Lego-style)",
      "ম্যাগনেটিক ব্লকস ও টাইলস (Magnetic Construction Tiles)",
      "মডেল কার/বিল্ডিং কিট (DIY Model Building Kit)",
      "মেকানিকাল গিয়ার ও ইঞ্জিনিয়ারিং সেট (Engineering Construction)",
      "আর্কিটেকচারাল দুর্গ ও সিটি সেট (City & Castle Blocks)",
    ],
    ELECTRONIC_RC: [
      "রিমোট কন্ট্রোল কার (RC High-Speed Racing Car)",
      "আরসি মনস্টার ট্রাক (RC Monster Truck 4WD)",
      "আরসি হেলিকপ্টার ও ড্রোন (RC Drone with Camera)",
      "ইন্টারেক্টিভ রোবট খেলনা (Interactive Smart Robot)",
      "ব্যাটারি চালিত ট্রেন সেট (Electric Track Train Set)",
      "ইলেকট্রনিক মিউজিক্যাল অর্গান (Baby Electronic Piano / Drum)",
      "ওয়াকি টকি সেট (Kids Walkie Talkie Pair)",
    ],
    ACTION_FIGURES: [
      "সুপারহিরো অ্যাকশন ফিগার (Marvel / DC Superhero Figure)",
      "ট্রান্সফরমার ও রোবট ফিগার (Transforming Robot Car)",
      "অ্যানিমে ও কার্টুন ফিগার (Anime / Cartoon Collectible)",
      "ডাইনোসর ও প্রিহিস্টোরিক ফিগার (Jumping/Sound Dinosaur)",
      "মিলিটারি সোলজার সেট (Military Soldier Action Set)",
    ],
    DOLLS_PLUSH: [
      "টেডি বিয়ার ও প্লাশ ডল (Soft Plush Teddy Bear)",
      "ফ্যাশন ডল ও বার্বি সেট (Fashion Doll with Dress & Accessories)",
      "বেবি ডল ও নার্সারি কিট (Baby Feeding Doll Set)",
      "কার্টুন ক্যারেক্টার প্লাশ (Pikachu, Minion, Doraemon Plush)",
      "ডল হাউস ও ফার্নিচার (Dollhouse with Miniature Furniture)",
    ],
    OUTDOOR_RIDEON: [
      "বেবি ট্রাইসাইকেল ও রিকশা (Kids Tricycle with Push Handle)",
      "রিচার্জেবল ইলেকট্রিক বেবি কার (Rechargeable Ride-on Car)",
      "বেবি ব্যালেন্স বাইক (Kids Balance Bike / Bicycle)",
      "ফোল্ডেবল কিক স্কুটার (Kids LED Wheel Kick Scooter)",
      "স্লাইডার ও দোলনা সেট (Indoor/Outdoor Slide & Swing)",
      "ইনফ্লেটেবল বেবি পুল (Inflatable Swimming Pool)",
      "ওয়াটার গান ও পিচকারি (High-Pressure Water Gun)",
      "অটোমেটিক বাবল মেকার গান (Automatic Bubble Blower Machine)",
      "কিডস ক্রিকেট ও ফুটবল সেট (Kids Sports Equipment Set)",
    ],
    INDOOR_GAMES: [
      "লুডো ও সাপলুডো বোর্ড (Ludo & Snake-Ladder Wooden Board)",
      "আন্তর্জাতিক দাবা বোর্ড (International Chess Board)",
      "মনোপলি ও বিজনেস গেম (Monopoly / Business Board Game)",
      "স্ক্র্যাবল ও ওয়ার্ড গেম (Scrabble Word Building Game)",
      "ক্যারাম বোর্ড ও স্ট্রাইকার (Carrom Board with Coins)",
      "জিগস পাজল (Jigsaw Puzzle 100-1000 Pcs)",
      "৩ডি ব্রেন টিজার ও রুবিকস কিউব (3D Rubik's Cube / Brain Teaser)",
      "মিনি টেবিলটপ ফুটবল / এয়ার হকি (Tabletop Foosball / Air Hockey)",
      "ম্যাজিক ট্রিকস কিট (Kids Magic Trick Show Box)",
    ],
    BABY_TODDLER: [
      "বেবি ঝুনঝুনি ও রেটল সেট (Non-toxic Baby Rattle Set)",
      "সিলিকন টিথার (BPA-Free Food Grade Silicone Teether)",
      "বেবি ক্রিব মিউজিক্যাল মোবাইল (Crib Mobile with Light & Sound)",
      "নরম কাপড় ও অ্যাক্টিভিটি বুক (Soft Crinkle Cloth Book)",
      "সেন্সরি টেক্সচার্ড বল (Sensory Textured Catching Balls)",
      "বেবি পুশ অ্যান্ড গো কার (Friction Powered Push & Go Vehicles)",
      "স্ট্যাকিং রিংস ও শেপ সর্টার (Stacking Rings & Shape Sorter)",
    ],
    ARTS_CRAFTS: [
      "প্লে ডোহ ও রঙিন ক্লে সেট (Non-toxic Play Dough / Clay Kit)",
      "ওয়াটার কালার ও ড্রয়িং সেট (Complete Kids Art & Painting Set)",
      "ডিআইওয়াই ব্রেসলেট ও জুয়েলারি কিট (DIY Jewelry Making Beads)",
      "অরিগামি ও পেপার ক্রাফট (Origami Color Paper Folding Set)",
      "ম্যাগনেটিক ড্রয়িং স্লেট (Magnetic Magic Drawing Board)",
      "কালারিং বুক ও ক্রেয়ন পেন্সিল (Coloring Books & Crayon Set)",
    ],
    PARTY_DECOR: [
      "বার্থডে থিম ডেকোরেশন কিট (Complete Birthday Theme Set)",
      "মেটালিক ও ফয়েল বেলুন (Metallic & Number Foil Balloons)",
      "বার্থডে ব্যানার ও হ্যাপী বার্থডে সাইন (Happy Birthday Banner)",
      "পার্টি হ্যাট ও ফটোবুথ প্রপস (Party Hats, Masks & Photo Props)",
      "কেক কাটিং ও টেবিল ডেকোরেশন (Cake Stand & Table Skirt Setup)",
      "ডিসপোজেবল পার্টি প্লেট ও গ্লাস (Theme Tableware & Paper Cups)",
      "রিটার্ন গিফট ও পার্টি ফেভার প্যাক (Kids Return Gifts Surprise Pack)",
    ],
  };

  const currentItemOptions =
    groupPresets[activeGroup] || [
      ...groupPresets.EDUCATIONAL,
      ...groupPresets.BUILDING,
      ...groupPresets.ELECTRONIC_RC,
      ...groupPresets.DOLLS_PLUSH,
      ...groupPresets.OUTDOOR_RIDEON,
      ...groupPresets.INDOOR_GAMES,
      ...groupPresets.BABY_TODDLER,
      ...groupPresets.ARTS_CRAFTS,
      ...groupPresets.PARTY_DECOR,
    ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-pink-200/80 bg-gradient-to-r from-pink-50/70 via-white to-purple-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-700 shadow-xs">
            <Baby size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              খেলনা, গেমস ও বেবি টয়েজ স্পেসিফিকেশন (Toys & Games Specs)
            </h3>
            <p className="text-xs text-slate-500">
              {categoryName} • শিক্ষামূলক খেলনা, রিমোট কার, বিল্ডিং ব্লকস, ডল, বোর্ড গেমস, রাইড-অন ও বার্থডে সামগ্রী
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-pink-100/80 px-2.5 py-1 text-[11px] font-medium text-pink-800">
          <Sparkles size={12} /> নিরাপদ ও নন-টক্সিক খেলনা মান
        </span>
      </div>

      {/* Quick Category Group Navigation Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          খেলনার উপ-বিভাগ নির্বাচন করুন (Quick Sub-Category Group):
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "EDUCATIONAL", label: "🧠 শিক্ষামূলক ও লার্নিং (Educational & STEM)" },
            { id: "BUILDING", label: "🧱 বিল্ডিং ব্লকস ও কনস্ট্রাকশন (Building & Blocks)" },
            { id: "ELECTRONIC_RC", label: "🚗 রিমোট কন্ট্রোল ও রোবট (RC & Electronic)" },
            { id: "DOLLS_PLUSH", label: "🧸 সফট টয় ও ডল (Dolls & Plush Toys)" },
            { id: "OUTDOOR_RIDEON", label: "🚲 রাইড-অন ও আউটডোর (Ride-On & Outdoor)" },
            { id: "INDOOR_GAMES", label: "🎲 বোর্ড গেমস ও পাজল (Board Games & Indoor)" },
            { id: "BABY_TODDLER", label: "👶 বেবি ও টডলার খেলনা (Baby & Toddler 0-3 Yrs)" },
            { id: "ACTION_FIGURES", label: "🦸 অ্যাকশন ফিগার ও রোবট (Action Figures)" },
            { id: "ARTS_CRAFTS", label: "🎨 আর্ট ও ক্রাফট খেলনা (Arts & Crafts)" },
            { id: "PARTY_DECOR", label: "🎉 বার্থডে ডেকোরেশন ও পার্টি (Birthday & Party)" },
          ].map((grp) => {
            const isSelected = activeGroup === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => setActiveGroup(grp.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-pink-600 text-white shadow-xs"
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
          <Tag size={15} className="text-pink-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ১. খেলনার ধরণ ও ব্র্যান্ড (Toy Identification & Brand)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="খেলনার ধরণ / মডেল (Toy Item Type)"
            value={value.toyItemType}
            onChange={(v) => update("toyItemType", v)}
            options={currentItemOptions}
            placeholder="যেমন: আরসি ড্রিফ্ট কার, মন্টেসরি কাঠের ব্লকস, প্লাশ টেডি বিয়ার..."
          />

          <SelectWithCustom
            label="ব্র্যান্ড / উৎপাদনকারী (Brand / Manufacturer)"
            value={value.brand}
            onChange={(v) => update("brand", v)}
            options={[
              "Lego (লেগো)",
              "Hot Wheels (হট হুইলস)",
              "Fisher-Price (ফিশার প্রাইস)",
              "Barbie (বার্বি - ম্যাটেল)",
              "Hasbro (হ্যাসব্রো)",
              "Nerf (নার্ফ গান)",
              "RFL Playmate (আরএফএল প্লেমেট)",
              "Gazi Toys (গাজী টয়েজ)",
              "Disney (ডিজনি)",
              "Marvel (মার্ভেল)",
              "Bandai (বান্দাই)",
              "Funko Pop",
              "Maisto / Bburago (ডাইকাস্ট কার)",
              "Crayola (ক্রেয়োলা)",
              "Play-Doh (প্লে ডোহ)",
              "Chicco (চিকো)",
              "Mee Mee",
              "VTech",
              "Generic / Unbranded",
              "Local Artisan (হাতে তৈরি কাঠের খেলনা)",
            ]}
            placeholder="যেমন: Mattel, Melissa & Doug, Tomy..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              ক্যারেক্টার / মডেল নাম (Character / Model Series)
            </label>
            <input
              type="text"
              value={value.modelCharacter ?? ""}
              onChange={(e) => update("modelCharacter", e.target.value)}
              placeholder="যেমন: Spider-Man, Transformers Optimus, Batman, Frozen Elsa..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Age Recommendation & Safety Certifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck size={15} className="text-pink-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ২. প্রযোজ্য বয়স ও নিরাপত্তা মান (Age Recommendation & Child Safety)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="প্রস্তাবিত বয়স শ্রেণী (Recommended Age Group)"
            value={value.recommendedAge}
            onChange={(v) => update("recommendedAge", v)}
            options={[
              "0 - 6 Months (নবজাতক)",
              "6 - 12 Months (ইনফ্যান্ট)",
              "1 - 2 Years (ছোট শিশু / টডলার)",
              "2 - 4 Years (প্রিস্কুল বাচ্চা)",
              "3+ Years (৩ বছর ও তদূর্ধ্ব)",
              "5 - 7 Years (৫-৭ বছর)",
              "8 - 11 Years (৮-১১ বছর)",
              "12+ Years & Teens (কিশোর ও বড়দের)",
              "All Ages / Family Game (সকল বয়সের জন্য)",
            ]}
            placeholder="যেমন: 4 to 8 Years, 14+ Adults..."
          />

          <SelectWithCustom
            label="নিরাপত্তা সনদ ও মান (Safety Certifications)"
            value={value.safetyCertifications}
            onChange={(v) => update("safetyCertifications", v)}
            options={[
              "Non-Toxic 100% Safe (নন-টক্সিক ও নিরাপদ)",
              "BPA Free Food-Grade (বিপিএ মুক্ত)",
              "EN71 European Toy Safety Standard",
              "ASTM F963 US Toy Safety Standard",
              "CE Certified Child Safe",
              "BSTI Approved Quality",
              "Lead-Free & Phthalate-Free",
              "Round Smooth Edge (ধারহীন মসৃণ কোণা)",
            ]}
            placeholder="যেমন: CPSIA Certified, ISO 8124..."
          />

          <SelectWithCustom
            label="সতর্কবার্তা (Choking Hazard / Warning)"
            value={value.chokingHazardWarning}
            onChange={(v) => update("chokingHazardWarning", v)}
            options={[
              "ছোট অংশ রয়েছে - ৩ বছরের নিচের বাচ্চাদের জন্য নয় (Small Parts Warning)",
              "কোনো ছোট অংশ নেই - শিশুদের জন্য সম্পূর্ণ নিরাপদ (100% Safe for Toddlers)",
              "অভিভাবকের তত্ত্বাবধানে ব্যবহার করুন (Adult Supervision Recommended)",
              "চোখ বা মুখের দিকে তাক করে মারবেন না (Do Not Aim at Eyes/Face)",
              "ব্যাটারি সতর্কতা: পানিতে ভেজাবেন না (Keep Dry / Battery Caution)",
            ]}
            placeholder="যেমন: Contains Magnets, Sharp Point Caution..."
          />
        </div>
      </div>

      {/* 3. Material, Size & Power */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Scale size={15} className="text-pink-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৩. উপাদান, সাইজ ও পাওয়ার সিস্টেম (Material, Dimensions & Power)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="মূল উপাদান (Primary Material)"
            value={value.primaryMaterial}
            onChange={(v) => update("primaryMaterial", v)}
            options={[
              "ABS Non-Toxic Plastic (খাদ্য-গ্রেড প্লাস্টিক)",
              "Natural Solid Wood (প্রাকৃতিক কাঠ)",
              "Soft Plush & Cotton (তুলা ও প্লাশ ফেব্রিক)",
              "Die-Cast Metal Alloy (ধাতব অ্যালয়)",
              "Food Grade Silicone (নরম সিলিকন)",
              "Paper & Hard Cardboard (হার্ডবোর্ড ও কাগজ)",
              "Rubber & Foam (রাবার ও ফোম)",
              "Electronic Components & Plastic",
            ]}
            placeholder="যেমন: Fabric, Metal & Plastic Hybrid..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              সাইজ ও ওজন (Dimensions & Weight)
            </label>
            <input
              type="text"
              value={value.dimensionsWeight ?? ""}
              onChange={(e) => update("dimensionsWeight", e.target.value)}
              placeholder="যেমন: 28 x 16 x 12 cm, ওজন: 550 gm..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <SelectWithCustom
            label="পাওয়ার ও ব্যাটারির ধরণ (Battery / Power Source)"
            value={value.batteryPowerType}
            onChange={(v) => update("batteryPowerType", v)}
            options={[
              "কোনো ব্যাটারির প্রয়োজন নেই (No Battery Required / Manual)",
              "ইউএসবি রিচার্জেবল ব্যাটারি (USB Rechargeable Lithium Battery)",
              "২x AA ব্যাটারি চালিত (2x AA Batteries - Not Included)",
              "৩x AA ব্যাটারি চালিত (3x AA Batteries)",
              "২x AAA ব্যাটারি চালিত (2x AAA Batteries)",
              "উইন্ড-আপ / চাবি দেওয়া মেকানিকাল (Wind-Up Spring Mechanical)",
              "সোলার পাওয়ার চালিত (Solar Energy Powered)",
              "রিমোট কন্ট্রোল রিচার্জেবল কার + রিমোট ব্যাটারি",
            ]}
            placeholder="যেমন: 3.7V 1200mAh Li-ion Included..."
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              পিসের সংখ্যা / উপাদান সংখ্যা (Pieces Count / Set Units)
            </label>
            <input
              type="text"
              value={value.piecesCount ?? ""}
              onChange={(e) => update("piecesCount", e.target.value)}
              placeholder="যেমন: ৫০ পিস ব্লকস সেট, ১টি কার + ১টি রিমোট, ১২ পিস খেলনা..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              ইন্টারেক্টিভ স্পেশাল ফিচার (Interactive Features)
            </label>
            <input
              type="text"
              value={value.interactiveFeatures ?? ""}
              onChange={(e) => update("interactiveFeatures", e.target.value)}
              placeholder="যেমন: ৩ডি এলইডি লাইট ও মিউজিক, ৩৬০° ঘূর্ণন, রিমোট রেঞ্জ ৩০ মিটার, ওয়াটারপ্রুফ..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 4. Educational & Skill Development */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Brain size={15} className="text-pink-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৪. মেধা ও দক্ষতা বিকাশ (Educational Skill Development)
          </h4>
        </div>

        <div>
          <SelectWithCustom
            label="যেসব দক্ষতা বৃদ্ধিতে সহায়ক (Skill Focus Area)"
            value={value.educationalSkillFocus}
            onChange={(v) => update("educationalSkillFocus", v)}
            options={[
              "হাত ও চোখের সমন্বয় এবং সূক্ষ্ম মোটর দক্ষতা (Hand-Eye Coordination & Fine Motor Skills)",
              "লজিক্যাল চিন্তা ও সমস্যা সমাধান (Problem Solving & Critical Thinking)",
              "সৃজনশীলতা ও কল্পনাশক্তি বৃদ্ধি (Creativity & Imagination)",
              "ভাষাজ্ঞান, বর্ণমালা ও শব্দ শেখা (Language & Speech Development)",
              "STEM ও বিজ্ঞান অনুসন্ধিৎসা (Science, Technology, Engineering & Math)",
              "সামাজিক দক্ষতা ও টিমওয়ার্ক (Social Play & Teamwork Skills)",
              "শারীরিক ব্যালেন্স ও স্থূল মোটর দক্ষতা (Physical Balance & Gross Motor Skills)",
              "শব্দ ও সুর চেনা (Auditory & Musical Rhythm Learning)",
            ]}
            placeholder="যেমন: Cognitive Development, Color & Shape Recognition..."
          />
        </div>
      </div>

      {/* 5. Origin, Packaging & Box Contents */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Package size={15} className="text-pink-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ৫. প্যাকেজিং ও বক্সের ভিতরের উপাদান (Packaging & Box Contents)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectWithCustom
            label="উৎপাদনকারী দেশ (Country of Origin)"
            value={value.countryOfOrigin}
            onChange={(v) => update("countryOfOrigin", v)}
            options={[
              "Bangladesh (বাংলাদেশ)",
              "China (চীন)",
              "India (ভারত)",
              "Vietnam (ভিয়েতনাম)",
              "Thailand (থাইল্যান্ড)",
              "Japan (জাপান)",
              "United States (যুক্তরাষ্ট্র)",
              "Denmark (ডেনমার্ক - Lego)",
              "Germany (জার্মানি)",
            ]}
            placeholder="যেমন: Malaysia, Taiwan, UK..."
          />

          <SelectWithCustom
            label="প্যাকেজিং এর ধরণ (Packaging Type)"
            value={value.packagingType}
            onChange={(v) => update("packagingType", v)}
            options={[
              "Color Display Gift Box (রঙিন গিফট বক্স)",
              "Window Box (সামনে স্বচ্ছ জানালাযুক্ত বক্স)",
              "Blister Card Packaging (ব্লিস্টার কার্ড)",
              "Plastic Storage Bucket / Tub (প্লাস্টিক ড্রাম বা বাকেট)",
              "Carry Bag / Mesh Bag (হাতে বহনের ব্যাগ)",
              "Brown Shipping Carton",
            ]}
            placeholder="যেমন: Tin Box, Tube Case..."
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              বক্সের ভিতরের উপাদানসমূহ (In The Box Contents)
            </label>
            <input
              type="text"
              value={value.inTheBoxContents ?? ""}
              onChange={(e) => update("inTheBoxContents", e.target.value)}
              placeholder="যেমন: ১x আরসি কার, ১x রিমোট, ১x রিচার্জেবল ব্যাটারি, ১x ইউএসবি ক্যাবল, ম্যানুয়াল..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* 6. Dynamic Custom Specifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-pink-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              ৬. কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="inline-flex items-center gap-1 rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700 transition hover:bg-pink-100"
          >
            <Plus size={13} />
            নতুন বৈশিষ্ট্য যোগ করুন
          </button>
        </div>

        {customSpecs.length === 0 ? (
          <p className="text-center py-4 text-xs text-slate-400">
            নির্দিষ্ট কোনো বৈশিষ্ট্য (যেমন: রিমোট রেঞ্জ, সর্বোচ্চ গতি, চার্জিং সময়, রোটেটিং ডিগ্রি ইত্যাদি) যুক্ত করতে উপরের বাটনে ক্লিক করুন।
          </p>
        ) : (
          <div className="space-y-2.5">
            {customSpecs.map((spec) => (
              <div key={spec.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="বৈশিষ্ট্যের নাম (যেমন: রিমোট রেঞ্জ / ব্যাটারি ব্যাকআপ / সর্বোচ্চ ওজন ধারণ)"
                  value={spec.label}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "label", e.target.value)
                  }
                  className="w-1/3 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
                <input
                  type="text"
                  placeholder="মান / বর্ণনা (যেমন: ২৫ মিটার, ৪৫ মিনিট, ৩০ কেজি পর্যন্ত প্রযোজ্য)"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
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
          className="text-[11px] font-medium text-pink-600 hover:underline"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
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
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
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
