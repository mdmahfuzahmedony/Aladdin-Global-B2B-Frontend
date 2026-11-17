"use client";

import { useMemo, useState } from "react";
import MedicineCategoryField from "./MedicineCategoryField";
import BeautyCategoryField from "./BeautyCategoryField";
import { Pill, Sparkles } from "lucide-react";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function HealthBeautyDispatcher({
  value = {},
  onChange,
  categoryName = "Health & Beauty",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // If subcategory is explicitly medicine or pharma related
  const isExplicitMedicine =
    catLower.includes("medicine") ||
    catLower.includes("otc") ||
    catLower.includes("prescription") ||
    catLower.includes("diabetes") ||
    catLower.includes("herbal") ||
    catLower.includes("ayurvedic") ||
    catLower.includes("device") ||
    catLower.includes("equipment") ||
    catLower.includes("surgical") ||
    catLower.includes("sexual wellness") ||
    catLower.includes("pharma") ||
    catLower.includes("ওষুধ") ||
    catLower.includes("ঔষধ") ||
    catLower.includes("ফার্মেসি");

  // If subcategory is explicitly beauty, cosmetic, or personal care
  const isExplicitBeauty =
    catLower.includes("beauty") ||
    catLower.includes("women's care") ||
    catLower.includes("men's care") ||
    catLower.includes("kid's care") ||
    catLower.includes("skin") ||
    catLower.includes("cream") ||
    catLower.includes("cosmetic") ||
    catLower.includes("makeup") ||
    catLower.includes("serum") ||
    catLower.includes("lotion") ||
    catLower.includes("sunscreen") ||
    catLower.includes("facewash") ||
    catLower.includes("রূপচর্চা") ||
    catLower.includes("ক্রিম") ||
    catLower.includes("লোশন") ||
    catLower.includes("স্কিনকেয়ার");

  // Default tab based on category, existing values, or default to Medicine
  const [activeTab, setActiveTab] = useState<"MEDICINE" | "BEAUTY">(() => {
    if (isExplicitMedicine) return "MEDICINE";
    if (isExplicitBeauty) return "BEAUTY";
    // Check if attributes exist that indicate beauty or medicine
    if (value.genericName || value.dosageForm || value.darNo) return "MEDICINE";
    if (value.skinType || value.benefits || value.spf || value.productType)
      return "BEAUTY";
    return "MEDICINE";
  });

  const effectiveTab = useMemo(() => {
    if (isExplicitMedicine) return "MEDICINE";
    if (isExplicitBeauty) return "BEAUTY";
    return activeTab;
  }, [isExplicitMedicine, isExplicitBeauty, activeTab]);

  return (
    <div className="space-y-4">
      {/* If root category or ambiguous, show switcher */}
      {!isExplicitMedicine && !isExplicitBeauty && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
          <button
            type="button"
            onClick={() => setActiveTab("MEDICINE")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
              effectiveTab === "MEDICINE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Pill size={16} />
            <span>১. ওষুধ ও স্বাস্থ্যসেবা (Medicine & Healthcare)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("BEAUTY")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
              effectiveTab === "BEAUTY"
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Sparkles size={16} />
            <span>২. রূপচর্চা ও স্কিনকেয়ার (Beauty & Skincare)</span>
          </button>
        </div>
      )}

      {effectiveTab === "MEDICINE" ? (
        <MedicineCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      ) : (
        <BeautyCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
