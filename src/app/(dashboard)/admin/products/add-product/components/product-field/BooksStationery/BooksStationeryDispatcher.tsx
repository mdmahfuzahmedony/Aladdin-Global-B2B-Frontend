"use client";

import { useMemo, useState } from "react";
import BookCategoryField from "./BookCategoryField";
import StationeryCategoryField from "./StationeryCategoryField";
import { BookOpen, PenTool } from "lucide-react";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function BooksStationeryDispatcher({
  value = {},
  onChange,
  categoryName = "Books & Stationery",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // If subcategory is explicitly stationery
  const isExplicitStationery =
    catLower.includes("stationery") || catLower.includes("স্টেশনারি");

  // If subcategory is explicitly a book category
  const isExplicitBook =
    catLower.includes("book") ||
    catLower.includes("বই") ||
    catLower.includes("fiction") ||
    catLower.includes("academic") ||
    catLower.includes("religion") ||
    catLower.includes("fair") ||
    catLower.includes("publication");

  // If it's the root "Books & Stationery", allow toggle between Books and Stationery
  const [activeTab, setActiveTab] = useState<"BOOK" | "STATIONERY">(() => {
    if (isExplicitStationery) return "STATIONERY";
    if (isExplicitBook) return "BOOK";
    return value.itemType || value.brand ? "STATIONERY" : "BOOK";
  });

  // When category changes, keep tab synced if explicit
  const effectiveTab = useMemo(() => {
    if (isExplicitStationery) return "STATIONERY";
    if (isExplicitBook) return "BOOK";
    return activeTab;
  }, [isExplicitStationery, isExplicitBook, activeTab]);

  return (
    <div className="space-y-4">
      {/* If root category or ambiguous, show switcher */}
      {!isExplicitStationery && !isExplicitBook && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2">
          <button
            type="button"
            onClick={() => setActiveTab("BOOK")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
              effectiveTab === "BOOK"
                ? "bg-[#D6A419] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <BookOpen size={16} />
            <span>১. বই ও প্রকাশনা (Books)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("STATIONERY")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
              effectiveTab === "STATIONERY"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <PenTool size={16} />
            <span>২. স্টেশনারি ও অফিস সামগ্রী (Stationery)</span>
          </button>
        </div>
      )}

      {effectiveTab === "BOOK" ? (
        <BookCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      ) : (
        <StationeryCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
