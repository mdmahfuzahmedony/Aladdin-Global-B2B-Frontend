"use client";

import { useMemo, useState } from "react";
import GymFitnessCategoryField from "./GymFitnessCategoryField";
import SportsOutdoorCategoryField from "./SportsOutdoorCategoryField";
import { Dumbbell, Trophy } from "lucide-react";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function SportsFitnessDispatcher({
  value = {},
  onChange,
  categoryName = "Sports & Fitness Accessories",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // Explicit Fitness / Gym keywords
  const isExplicitFitness =
    catLower.includes("fitness") ||
    catLower.includes("gym") ||
    catLower.includes("ফিটনেস") ||
    catLower.includes("জিম") ||
    catLower.includes("dumbbell") ||
    catLower.includes("ডাম্বেল") ||
    catLower.includes("yoga") ||
    catLower.includes("ইয়োগা") ||
    catLower.includes("cardio") ||
    catLower.includes("ব্যায়াম");

  // Explicit Sports / Outdoor keywords
  const isExplicitSports =
    catLower.includes("cricket") ||
    catLower.includes("ক্রিকেট") ||
    catLower.includes("football") ||
    catLower.includes("ফুটবল") ||
    catLower.includes("badminton") ||
    catLower.includes("ব্যাডমিন্টন") ||
    catLower.includes("tennis") ||
    catLower.includes("টেনিস") ||
    catLower.includes("carrom") ||
    catLower.includes("ক্যারম") ||
    catLower.includes("swimming") ||
    catLower.includes("সাঁতার") ||
    catLower.includes("skating") ||
    catLower.includes("খেলাধুলা") ||
    (catLower.includes("sports") && !catLower.includes("fitness"));

  // Tab State
  const [activeTab, setActiveTab] = useState<"FITNESS" | "SPORTS">(() => {
    if (isExplicitFitness && !isExplicitSports) return "FITNESS";
    if (isExplicitSports && !isExplicitFitness) return "SPORTS";
    if (value.fitnessItemType || value.weightResistance || value.maxLoadCapacity) {
      return "FITNESS";
    }
    if (value.sportDiscipline || value.equipmentType || value.materialWoodType) {
      return "SPORTS";
    }
    return "SPORTS";
  });

  const effectiveTab = useMemo(() => {
    if (isExplicitFitness && !isExplicitSports) return "FITNESS";
    if (isExplicitSports && !isExplicitFitness) return "SPORTS";
    return activeTab;
  }, [isExplicitFitness, isExplicitSports, activeTab]);

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-2 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("SPORTS")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
            effectiveTab === "SPORTS"
              ? "bg-orange-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Trophy size={16} />
          <span>১. খেলাধুলার সরঞ্জাম ও আউটডোর (Sports Equipment - Cricket, Football, etc.)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FITNESS")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
            effectiveTab === "FITNESS"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Dumbbell size={16} />
          <span>২. জিম ও ফিটনেস এক্সেসরিজ (Gym, Fitness, Yoga & Workout)</span>
        </button>
      </div>

      {effectiveTab === "SPORTS" ? (
        <SportsOutdoorCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      ) : (
        <GymFitnessCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
