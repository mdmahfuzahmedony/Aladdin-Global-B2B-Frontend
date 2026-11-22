"use client";

import {
  Gamepad2,
  Sparkles,
  ShieldCheck,
  Scale,
  Plus,
  Trash2,
  Tag,
  Trophy,
  Users,
  Clock,
} from "lucide-react";

export interface IndoorBoardGamesAttributes {
  gameItemType?: string;
  brand?: string;
  boardDimensions?: string;
  borderWoodType?: string;
  surfaceFinish?: string;
  minMaxPlayers?: string;
  playingDuration?: string;
  recommendedAge?: string;
  piecesCoinsIncluded?: string;
  tournamentGradeStandard?: string;
  gameThemeGenre?: string;
  warranty?: string;
  countryOfOrigin?: string;

  // Dynamic custom specifications
  customSpecs?: Array<{ id: string; label: string; value: string }>;
}

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function IndoorBoardGamesField({
  value = {},
  onChange,
  categoryName = "Indoor Games, Carrom & Puzzles",
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

  const gamePresets = [
    "৩২ ইঞ্চি টুর্নামেন্ট ক্যারম বোর্ড (32-Inch Waterproof Carrom Board)",
    "কাঠের ফোল্ডিং আন্তর্জাতিক দাবা বোর্ড (Folding Wooden Chess Set)",
    "ক্লাসিক লুডো ও সাপলুডো বোর্ড (Classic Ludo & Snake-Ladder)",
    "বিজনেস ও মনোপলি বোর্ড গেম (Monopoly / Business Game)",
    "স্ক্র্যাবল ওয়ার্ড বিল্ডিং ফ্যামিলি গেম (Scrabble Word Game)",
    "১০০০ পিস ল্যান্ডস্কেপ জিগস পাজল (1000 Pcs Jigsaw Puzzle)",
    "ম্যাগনেটিক স্পিড রুবিকস কিউব ৩x৩ (Magnetic 3x3 Speed Cube)",
    "টেবিলটপ মিনি ফুটবল / এয়ার হকি (Mini Tabletop Foosball)",
    "বাচ্চাদের প্রফেশনাল ম্যাজিক ট্রিকস কিট (Kids Magic Show Box)",
    "ইউনো কার্ড ও ক্লাসিক ফ্যামিলি কার্ড গেম (Uno Card Game)",
  ];

  return (
    <div className="space-y-6">
      {/* Category Header Banner */}
      <div className="flex items-center justify-between rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 shadow-xs">
            <Gamepad2 size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              ইনডোর বোর্ড গেম, ক্যারম ও পাজল স্পেসিফিকেশন (Board Games & Puzzles Specs)
            </h3>
            <p className="text-xs text-slate-500">
              ক্যারম, দাবা, লুডো, মনোপলি, জিগস পাজল ও রুবিকস কিউবের স্পেসিফিকেশন
            </p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-100/90 px-3 py-1 text-xs font-semibold text-indigo-800">
          {categoryName}
        </span>
      </div>

      {/* Grid: Main Fields */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Item Type / Preset */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-indigo-600" />
            <span>গেমের ধরন (Board Game Item Type)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="game-type-presets"
            value={value.gameItemType || ""}
            onChange={(e) => update("gameItemType", e.target.value)}
            placeholder="উদাহরণ: Championship 32-Inch Waterproof Smooth Carrom Board Set"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
          <datalist id="game-type-presets">
            {gamePresets.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-indigo-600" />
            <span>ব্র্যান্ড / মেকার (Brand)</span>
          </label>
          <input
            type="text"
            value={value.brand || ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="e.g. Precise, Synco, Hasbro, Mattel, GAN Cube, Local"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Board Dimensions / Size */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Scale size={14} className="text-indigo-600" />
            <span>বোর্ড সাইজ ও পরিমাপ (Dimensions)</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={value.boardDimensions || ""}
            onChange={(e) => update("boardDimensions", e.target.value)}
            placeholder="e.g. 32 x 32 Inch (Playing Area 29 x 29 Inch) / 16 x 16 Inch"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Border / Frame Wood Type */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>বর্ডার ও ফ্রেমের মেটেরিয়াল (Border Frame Wood)</span>
          </label>
          <input
            type="text"
            value={value.borderWoodType || ""}
            onChange={(e) => update("borderWoodType", e.target.value)}
            placeholder="e.g. 3-Inch Solid Hardwood Mahogany Border / Teak Wood"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Surface Finish */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles size={14} className="text-indigo-600" />
            <span>সারফেস ফিনিশ (Surface Finish)</span>
          </label>
          <select
            value={value.surfaceFinish || ""}
            onChange={(e) => update("surfaceFinish", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">সারফেস নির্বাচন করুন</option>
            <option value="Waterproof High-Gloss Smooth Plywood (ওয়াটারপ্রুফ গ্লাস স্মুথ)">ওয়াটারপ্রুফ গ্লাস স্মুথ প্লাইউড</option>
            <option value="Matte Finish Birch Wood (ম্যাট ফিনিশ বার্চ কাঠ)">ম্যাট ফিনিশ বার্চ কাঠ</option>
            <option value="Magnetic Folding Board (ম্যাগনেটিক ফোল্ডিং)">ম্যাগনেটিক ফোল্ডিং সারফেস</option>
            <option value="Laminated Cardboard (ল্যামিনেটেড বোর্ড)">ল্যামিনেটেড বোর্ড</option>
          </select>
        </div>

        {/* Players Count (Min - Max) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Users size={14} className="text-indigo-600" />
            <span>খেলোয়াড়ের সংখ্যা (Players Count)</span>
          </label>
          <input
            type="text"
            value={value.minMaxPlayers || ""}
            onChange={(e) => update("minMaxPlayers", e.target.value)}
            placeholder="e.g. 2 - 4 Players / 2 Players (Chess)"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Average Playing Time */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Clock size={14} className="text-indigo-600" />
            <span>গড় খেলার সময় (Playing Duration)</span>
          </label>
          <input
            type="text"
            value={value.playingDuration || ""}
            onChange={(e) => update("playingDuration", e.target.value)}
            placeholder="e.g. 20 - 45 Minutes / 1 Hour+"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Pieces / Coins / Striker Included */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Trophy size={14} className="text-indigo-600" />
            <span>ঘুঁটি, স্ট্রাইকার ও অনুষঙ্গ (Included Accessories)</span>
          </label>
          <input
            type="text"
            value={value.piecesCoinsIncluded || ""}
            onChange={(e) => update("piecesCoinsIncluded", e.target.value)}
            placeholder="e.g. ১টি হেভি টুর্নামেন্ট স্ট্রাইকার, ২৪টি উডেন ঘুঁটি, ১ বোতল বোরিক পাউডার"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Recommended Age */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>উপযুক্ত বয়সসীমা (Recommended Age)</span>
          </label>
          <select
            value={value.recommendedAge || ""}
            onChange={(e) => update("recommendedAge", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">বয়সসীমা নির্বাচন করুন</option>
            <option value="All Ages (পরিবারের সবার জন্য)">পরিবারের সবার জন্য (All Ages)</option>
            <option value="5+ Years (ছোট শিশুদের জন্য সহজ গেম)">৫+ বছর</option>
            <option value="8+ Years (ক্যারম, দাবা ও স্ট্র্যাটেজি)">৮+ বছর (ক্যারম, দাবা)</option>
            <option value="12+ Years (জটিল বোর্ড গেম)">১২+ বছর</option>
          </select>
        </div>

        {/* Warranty */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <ShieldCheck size={14} className="text-indigo-600" />
            <span>ওয়ারেন্টি (Warranty)</span>
          </label>
          <input
            type="text"
            value={value.warranty || ""}
            onChange={(e) => update("warranty", e.target.value)}
            placeholder="e.g. 1 Year Wood Bending & Cracking Guarantee"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Country of Origin */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag size={14} className="text-indigo-600" />
            <span>উৎপাদনকারী দেশ (Country of Origin)</span>
          </label>
          <input
            type="text"
            value={value.countryOfOrigin || ""}
            onChange={(e) => update("countryOfOrigin", e.target.value)}
            placeholder="e.g. Bangladesh, India, China"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800">
              অতিরিক্ত কাস্টম স্পেসিফিকেশন (Additional Custom Specs)
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSpec}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
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
                  placeholder="স্পেকের নাম (e.g. পকেট নেট উপাদান)"
                  className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-200"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) =>
                    handleUpdateCustomSpec(spec.id, "value", e.target.value)
                  }
                  placeholder="মান (e.g. Heavy Duty Woolen Pocket Net)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 transition focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-200"
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
