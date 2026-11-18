"use client";

import { useMemo, useState } from "react";
import GadgetsCategoryField from "./GadgetsCategoryField";
import ElectricalCategoryField from "./ElectricalCategoryField";
import { Smartphone, Zap, Sparkles } from "lucide-react";

interface Props {
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  categoryName?: string;
}

export default function ElectronicsDispatcher({
  value = {},
  onChange,
  categoryName = "Electronics & Electricals",
}: Props) {
  const catLower = (categoryName || "").toLowerCase();

  // Explicit Electrical keywords
  const isExplicitElectrical =
    catLower.includes("electrical") ||
    catLower.includes("electric") ||
    catLower.includes("ইলেকট্রিক্যাল") ||
    catLower.includes("ইলেকট্রিক") ||
    catLower.includes("fan") ||
    catLower.includes("light") ||
    catLower.includes("ফ্যান") ||
    catLower.includes("লাইট") ||
    catLower.includes("ac") ||
    catLower.includes("air conditioner") ||
    catLower.includes("এসি") ||
    catLower.includes("fridge") ||
    catLower.includes("refrigerator") ||
    catLower.includes("ফ্রিজ") ||
    catLower.includes("motor") ||
    catLower.includes("pump") ||
    catLower.includes("মোটর") ||
    catLower.includes("পাম্প") ||
    catLower.includes("wire") ||
    catLower.includes("cable") ||
    catLower.includes("তার") ||
    catLower.includes("ক্যাবল") ||
    catLower.includes("switch") ||
    catLower.includes("সুইচ") ||
    catLower.includes("ips") ||
    catLower.includes("ups") ||
    catLower.includes("solar") ||
    catLower.includes("হিটার") ||
    catLower.includes("geyser") ||
    catLower.includes("গিজার") ||
    catLower.includes("appliance");

  // Explicit Gadgets / Consumer Electronics keywords
  const isExplicitGadget =
    catLower.includes("gadget") ||
    catLower.includes("গ্যাজেট") ||
    catLower.includes("mobile") ||
    catLower.includes("মোবাইল") ||
    catLower.includes("phone") ||
    catLower.includes("ফোন") ||
    catLower.includes("laptop") ||
    catLower.includes("ল্যাপটপ") ||
    catLower.includes("tablet") ||
    catLower.includes("ট্যাবলেট") ||
    catLower.includes("smartwatch") ||
    catLower.includes("স্মার্টওয়াচ") ||
    catLower.includes("watch") ||
    catLower.includes("headphone") ||
    catLower.includes("হেডফোন") ||
    catLower.includes("earbuds") ||
    catLower.includes("ইয়ারবাড") ||
    catLower.includes("speaker") ||
    catLower.includes("স্পিকার") ||
    catLower.includes("camera") ||
    catLower.includes("ক্যামেরা") ||
    catLower.includes("computer") ||
    catLower.includes("কম্পিউটার");

  // Initialize active tab based on category and existing attributes
  const [activeTab, setActiveTab] = useState<"GADGETS" | "ELECTRICAL">(() => {
    if (isExplicitElectrical && !isExplicitGadget) return "ELECTRICAL";
    if (isExplicitGadget && !isExplicitElectrical) return "GADGETS";
    // Check fields in value if already partially filled
    if (value.wattage || value.operatingVoltage || value.coilMaterial || value.applianceType) {
      return "ELECTRICAL";
    }
    if (value.ram || value.storage || value.screenSize || value.deviceType) {
      return "GADGETS";
    }
    return "GADGETS";
  });

  // Keep synced if user navigated to a distinctly different subcategory
  const effectiveTab = useMemo(() => {
    if (isExplicitElectrical && !isExplicitGadget) return "ELECTRICAL";
    if (isExplicitGadget && !isExplicitElectrical) return "GADGETS";
    return activeTab;
  }, [isExplicitElectrical, isExplicitGadget, activeTab]);

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-2 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("GADGETS")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
            effectiveTab === "GADGETS"
              ? "bg-sky-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Smartphone size={16} />
          <span>১. কনজিউমার গ্যাজেটস ও আইটি (Gadgets, Phone & Laptop)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ELECTRICAL")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-xs ${
            effectiveTab === "ELECTRICAL"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          <Zap size={16} />
          <span>২. ইলেকট্রিক্যাল ও হোম অ্যাপ্লায়েন্স (Electrical & Appliances)</span>
        </button>
      </div>

      {effectiveTab === "GADGETS" ? (
        <GadgetsCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      ) : (
        <ElectricalCategoryField
          value={value}
          onChange={onChange}
          categoryName={categoryName}
        />
      )}
    </div>
  );
}
