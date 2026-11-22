"use client";

import { useMemo, useState } from "react";
import EducationalStemField from "./EducationalStemField";
import BuildingBlocksField from "./BuildingBlocksField";
import RcElectronicField from "./RcElectronicField";
import DollsActionFiguresField from "./DollsActionFiguresField";
import IndoorBoardGamesField from "./IndoorBoardGamesField";
import BabyToddlerField from "./BabyToddlerField";
import OutdoorRideOnField from "./OutdoorRideOnField";
import ArtCraftPretendField from "./ArtCraftPretendField";
import ToyCategoryField from "./ToyCategoryField";

import {
  Atom,
  Boxes,
  Radio,
  Heart,
  Gamepad2,
  Baby,
  Bike,
  Palette,
  Sparkles,
} from "lucide-react";

export type ToySubcategoryTab =
  | "EDUCATIONAL"
  | "BUILDING"
  | "ELECTRONIC_RC"
  | "DOLLS_ACTION"
  | "INDOOR_GAMES"
  | "BABY_TODDLER"
  | "OUTDOOR_RIDEON"
  | "ART_PRETEND"
  | "UNIVERSAL";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function ToysDispatcher({
  value = {},
  onChange,
  categoryName = "Toys & Games",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // 1. Detect subcategory automatically from category name keywords
  const detectedGroup: ToySubcategoryTab = useMemo(() => {
    // Educational & STEM
    if (
      catLower.includes("educational") ||
      catLower.includes("learning") ||
      catLower.includes("stem") ||
      catLower.includes("science") ||
      catLower.includes("montessori") ||
      catLower.includes("flash card") ||
      catLower.includes("alphabet") ||
      catLower.includes("শিক্ষা") ||
      catLower.includes("লার্নিং")
    ) {
      return "EDUCATIONAL";
    }

    // Building & Construction
    if (
      catLower.includes("building") ||
      catLower.includes("construction") ||
      catLower.includes("block") ||
      catLower.includes("lego") ||
      catLower.includes("magnetic block") ||
      catLower.includes("magnetic construction") ||
      catLower.includes("model building") ||
      catLower.includes("বিল্ডিং") ||
      catLower.includes("ব্লক")
    ) {
      return "BUILDING";
    }

    // Remote Control & Electronic
    if (
      catLower.includes("remote") ||
      catLower.includes("rc") ||
      catLower.includes("drone") ||
      catLower.includes("helicopter") ||
      catLower.includes("monster truck") ||
      catLower.includes("electronic") ||
      catLower.includes("walkie") ||
      catLower.includes("ইলেকট্রনিক") ||
      catLower.includes("রিমোট")
    ) {
      return "ELECTRONIC_RC";
    }

    // Dolls & Action Figures
    if (
      catLower.includes("action figure") ||
      catLower.includes("doll") ||
      catLower.includes("plush") ||
      catLower.includes("teddy") ||
      catLower.includes("superhero") ||
      catLower.includes("anime") ||
      catLower.includes("figurine") ||
      catLower.includes("collectible") ||
      catLower.includes("stuffed") ||
      catLower.includes("barbie") ||
      catLower.includes("পুতুল") ||
      catLower.includes("টেডি") ||
      catLower.includes("অ্যাকশন ফিগার")
    ) {
      return "DOLLS_ACTION";
    }

    // Indoor Games & Puzzles & Carrom
    if (
      catLower.includes("carrom") ||
      catLower.includes("board game") ||
      catLower.includes("puzzle") ||
      catLower.includes("chess") ||
      catLower.includes("ludo") ||
      catLower.includes("rubik") ||
      catLower.includes("tabletop") ||
      catLower.includes("দাবা") ||
      catLower.includes("লুডো") ||
      catLower.includes("ক্যারম") ||
      catLower.includes("পাজল")
    ) {
      return "INDOOR_GAMES";
    }

    // Baby & Toddler Musical Toys
    if (
      catLower.includes("baby") ||
      catLower.includes("toddler") ||
      catLower.includes("rattle") ||
      catLower.includes("teether") ||
      catLower.includes("infant") ||
      catLower.includes("crib") ||
      catLower.includes("cactus") ||
      catLower.includes("মিউজিক্যাল") ||
      catLower.includes("রেটল") ||
      catLower.includes("টিথার") ||
      catLower.includes("বাচ্চা")
    ) {
      return "BABY_TODDLER";
    }

    // Outdoor & Ride-On
    if (
      catLower.includes("outdoor") ||
      catLower.includes("ride-on") ||
      catLower.includes("ride on") ||
      catLower.includes("tricycle") ||
      catLower.includes("scooter") ||
      catLower.includes("slide") ||
      catLower.includes("swing") ||
      catLower.includes("water gun") ||
      catLower.includes("bubble") ||
      catLower.includes("balance bike") ||
      catLower.includes("দোলনা") ||
      catLower.includes("সাইকেল")
    ) {
      return "OUTDOOR_RIDEON";
    }

    // Arts, Crafts, Pretend Play & Party
    if (
      catLower.includes("art") ||
      catLower.includes("craft") ||
      catLower.includes("clay") ||
      catLower.includes("dough") ||
      catLower.includes("drawing") ||
      catLower.includes("pretend") ||
      catLower.includes("kitchen") ||
      catLower.includes("birthday") ||
      catLower.includes("party") ||
      catLower.includes("balloon") ||
      catLower.includes("ড্রয়িং") ||
      catLower.includes("আর্ট") ||
      catLower.includes("ক্লে")
    ) {
      return "ART_PRETEND";
    }

    // By existing value keys
    if (value.stemItemType || value.experimentProjectsCount) return "EDUCATIONAL";
    if (value.blockItemType || value.piecesCount) return "BUILDING";
    if (value.rcItemType || value.controlRangeMeters || value.driveMechanism)
      return "ELECTRONIC_RC";
    if (value.characterItemType || value.figureDollHeight) return "DOLLS_ACTION";
    if (value.gameItemType || value.boardDimensions || value.borderWoodType)
      return "INDOOR_GAMES";
    if (value.babyItemType || value.ageRecommendationMonths || value.teethingSafety)
      return "BABY_TODDLER";
    if (value.outdoorItemType || value.maxLoadCapacityKg) return "OUTDOOR_RIDEON";
    if (value.artPretendItemType || value.colorsTubsToolsCount) return "ART_PRETEND";

    return "UNIVERSAL";
  }, [catLower, value]);

  // Tab State allowing user to manually switch between subcategories
  const [selectedTab, setSelectedTab] = useState<ToySubcategoryTab>(detectedGroup);

  // Sync tab if detectedGroup changes (e.g. user selected different category from dropdown)
  const activeTab = useMemo(() => {
    if (detectedGroup !== "UNIVERSAL") {
      return detectedGroup;
    }
    return selectedTab;
  }, [detectedGroup, selectedTab]);

  const tabs: Array<{
    id: ToySubcategoryTab;
    label: string;
    sublabel: string;
    icon: any;
    color: string;
  }> = [
    {
      id: "EDUCATIONAL",
      label: "১. এডুকেশনাল ও স্টেম",
      sublabel: "Science, Robot & Montessori",
      icon: Atom,
      color: "emerald",
    },
    {
      id: "BUILDING",
      label: "২. বিল্ডিং ব্লকস",
      sublabel: "Lego, Magnetic Bricks",
      icon: Boxes,
      color: "amber",
    },
    {
      id: "ELECTRONIC_RC",
      label: "৩. রিমোট কন্ট্রোল ও আরসি",
      sublabel: "RC Cars, Drones & Robots",
      icon: Radio,
      color: "red",
    },
    {
      id: "DOLLS_ACTION",
      label: "৪. পুতুল ও অ্যাকশন ফিগার",
      sublabel: "Barbie, Teddy & Action Figures",
      icon: Heart,
      color: "pink",
    },
    {
      id: "INDOOR_GAMES",
      label: "৫. ক্যারম, বোর্ড গেম ও পাজল",
      sublabel: "Carrom, Chess & Puzzles",
      icon: Gamepad2,
      color: "indigo",
    },
    {
      id: "BABY_TODDLER",
      label: "৬. বেবি ও মিউজিক্যাল খেলনা",
      sublabel: "Dancing Cactus, Rattles & Teethers",
      icon: Baby,
      color: "purple",
    },
    {
      id: "OUTDOOR_RIDEON",
      label: "৭. আউটডোর ও রাইড-অন",
      sublabel: "Tricycles, Scooters & Electric Cars",
      icon: Bike,
      color: "sky",
    },
    {
      id: "ART_PRETEND",
      label: "৮. আর্ট, প্রিটেন্ড প্লে ও পার্টি",
      sublabel: "Play Dough, Kitchen & Crafts",
      icon: Palette,
      color: "violet",
    },
    {
      id: "UNIVERSAL",
      label: "৯. সার্বজনীন খেলনা স্পেক",
      sublabel: "All-in-One Custom Toy Form",
      icon: Sparkles,
      color: "slate",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Subcategory Pill Selector Navigation Bar */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3 shadow-2xs">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-700">
            খেলনার ধরন ও সাব-ক্যাটাগরি স্পেসিফিকেশন নির্বাচন করুন (Select Toy Discipline):
          </p>
          <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 shadow-2xs border border-slate-200">
            {categoryName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`flex flex-col items-start rounded-lg p-2.5 text-left transition ${
                  isActive
                    ? "border-2 border-emerald-600 bg-white shadow-sm ring-2 ring-emerald-100"
                    : "border border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-1.5 w-full mb-1">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <span
                    className={`text-[11px] font-bold line-clamp-1 ${
                      isActive ? "text-emerald-950" : "text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {tab.sublabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render the Active Subcategory Field */}
      {activeTab === "EDUCATIONAL" && (
        <EducationalStemField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "BUILDING" && (
        <BuildingBlocksField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "ELECTRONIC_RC" && (
        <RcElectronicField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "DOLLS_ACTION" && (
        <DollsActionFiguresField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "INDOOR_GAMES" && (
        <IndoorBoardGamesField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "BABY_TODDLER" && (
        <BabyToddlerField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "OUTDOOR_RIDEON" && (
        <OutdoorRideOnField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "ART_PRETEND" && (
        <ArtCraftPretendField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}

      {activeTab === "UNIVERSAL" && (
        <ToyCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
