"use client";

import { useMemo, useState } from "react";
import PersonalizedGiftsField from "./PersonalizedGiftsField";
import HandicraftsTraditionalField from "./HandicraftsTraditionalField";
import FestivalCorporateGiftsField from "./FestivalCorporateGiftsField";
import { Gift, Hammer, Briefcase } from "lucide-react";

export type GiftsSubcategoryTab =
  | "PERSONALIZED"
  | "HANDICRAFTS"
  | "FESTIVAL_CORPORATE";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function GiftsCraftsDispatcher({
  value = {},
  onChange,
  categoryName = "Gifts & Crafts",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // 1. Automatic subcategory detection from category keywords
  const detectedGroup: GiftsSubcategoryTab = useMemo(() => {
    // Handicrafts & Folk Art
    if (
      catLower.includes("handicraft") ||
      catLower.includes("wooden craft") ||
      catLower.includes("jute") ||
      catLower.includes("clay") ||
      catLower.includes("pottery") ||
      catLower.includes("bamboo") ||
      catLower.includes("cane") ||
      catLower.includes("brass") ||
      catLower.includes("showpiece") ||
      catLower.includes("হস্তশিল্প") ||
      catLower.includes("পাট") ||
      catLower.includes("মাটি") ||
      catLower.includes("বাঁশ") ||
      catLower.includes("শোপিস")
    ) {
      return "HANDICRAFTS";
    }

    // Festival, Seasonal & Corporate
    if (
      catLower.includes("festival") ||
      catLower.includes("eid") ||
      catLower.includes("boishakh") ||
      catLower.includes("christmas") ||
      catLower.includes("corporate") ||
      catLower.includes("promotional") ||
      catLower.includes("branded") ||
      catLower.includes("perfume") ||
      catLower.includes("award") ||
      catLower.includes("crest") ||
      catLower.includes("ঈদ") ||
      catLower.includes("উৎসব") ||
      catLower.includes("কর্পোরেট") ||
      catLower.includes("পারফিউম")
    ) {
      return "FESTIVAL_CORPORATE";
    }

    // Personalized Gifts (Default for Gift Items, Mugs, Cards, Photo frames, etc.)
    return "PERSONALIZED";
  }, [catLower]);

  // Tab State allowing manual toggle
  const [selectedTab, setSelectedTab] = useState<GiftsSubcategoryTab>(detectedGroup);

  const activeTab = useMemo(() => {
    return selectedTab;
  }, [selectedTab]);

  const tabs: Array<{
    id: GiftsSubcategoryTab;
    label: string;
    sublabel: string;
    icon: any;
    color: string;
  }> = [
    {
      id: "PERSONALIZED",
      label: "১. পার্সোনালাইজড ও কাস্টম উপহার",
      sublabel: "3D Moon Lamp, Magic Mugs, Frames & Couple Gifts",
      icon: Gift,
      color: "rose",
    },
    {
      id: "HANDICRAFTS",
      label: "২. দেশীয় হস্তশিল্প ও ট্র্যাডিশনাল শোপিস",
      sublabel: "Wooden Carvings, Jute Products, Brass & Pottery",
      icon: Hammer,
      color: "teal",
    },
    {
      id: "FESTIVAL_CORPORATE",
      label: "৩. উৎসব, সিজনাল ও কর্পোরেট গিফট",
      sublabel: "Eid Hampers, Corporate Executive Sets & Perfumes",
      icon: Briefcase,
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Switcher Navigation Bar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3 shadow-2xs">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-700">
            উপহার ও হস্তশিল্পের ক্যাটাগরি স্পেসিফিকেশন নির্বাচন করুন (Gifts & Crafts Discipline):
          </p>
          <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 shadow-2xs border border-slate-200">
            {categoryName}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`flex flex-col items-start rounded-lg p-3 text-left transition ${
                  isActive
                    ? "border-2 border-rose-600 bg-white shadow-sm ring-2 ring-rose-100"
                    : "border border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 w-full mb-1">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs ${
                      isActive
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isActive ? "text-rose-950" : "text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 line-clamp-1">
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Component */}
      {activeTab === "PERSONALIZED" && (
        <PersonalizedGiftsField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "HANDICRAFTS" && (
        <HandicraftsTraditionalField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "FESTIVAL_CORPORATE" && (
        <FestivalCorporateGiftsField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
