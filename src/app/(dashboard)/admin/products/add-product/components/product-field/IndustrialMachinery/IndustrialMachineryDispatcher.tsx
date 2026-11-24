import React, { useState, useEffect } from "react";
import { Wrench, Scissors, Utensils, HardHat, Activity } from "lucide-react";
import MetalWoodMachineryField from "./MetalWoodMachineryField";
import TextilePackagingField from "./TextilePackagingField";
import { FoodAgroEquipmentField } from "./FoodAgroEquipmentField";
import { ConstructionEquipmentField } from "./ConstructionEquipmentField";
import { MedicalLabEquipmentField } from "./MedicalLabEquipmentField";

type IndustrialTab =
  | "METAL_WOOD"
  | "TEXTILE_PACKAGING"
  | "FOOD_AGRO"
  | "CONSTRUCTION"
  | "MEDICAL_LAB";

interface IndustrialMachineryDispatcherProps {
  categoryName?: string;
  parentNames?: string[];
  value?: Record<string, any>;
  attributes?: Record<string, any>;
  onChange: (attributes: Record<string, any>) => void;
  brandValue?: string;
  onBrandChange?: (brand: string) => void;
}

export const IndustrialMachineryDispatcher: React.FC<IndustrialMachineryDispatcherProps> = ({
  categoryName = "",
  parentNames = [],
  value,
  attributes,
  onChange,
  brandValue,
  onBrandChange,
}) => {
  const currentAttributes = value || attributes || {};
  const detectInitialTab = (): IndustrialTab => {
    const combined = `${categoryName} ${parentNames.join(" ")}`.toLowerCase();

    if (
      combined.includes("medical") ||
      combined.includes("hospital") ||
      combined.includes("laboratory") ||
      combined.includes("lab ")
    ) {
      return "MEDICAL_LAB";
    }

    if (
      combined.includes("construction") ||
      combined.includes("building") ||
      combined.includes("excavator")
    ) {
      return "CONSTRUCTION";
    }

    if (
      combined.includes("food") ||
      combined.includes("agricultural") ||
      combined.includes("agro") ||
      combined.includes("grain") ||
      combined.includes("bakery")
    ) {
      return "FOOD_AGRO";
    }

    if (
      combined.includes("textile") ||
      combined.includes("garment") ||
      combined.includes("sewing") ||
      combined.includes("packaging") ||
      combined.includes("printing") ||
      combined.includes("publishing")
    ) {
      return "TEXTILE_PACKAGING";
    }

    return "METAL_WOOD";
  };

  const [activeTab, setActiveTab] = useState<IndustrialTab>(detectInitialTab);

  useEffect(() => {
    setActiveTab(detectInitialTab());
  }, [categoryName]);

  const tabs: { id: IndustrialTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "METAL_WOOD",
      label: "Metal & Woodworking",
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "TEXTILE_PACKAGING",
      label: "Textile & Packaging",
      icon: <Scissors className="w-4 h-4" />,
    },
    {
      id: "FOOD_AGRO",
      label: "Food & Agro Processing",
      icon: <Utensils className="w-4 h-4" />,
    },
    {
      id: "CONSTRUCTION",
      label: "Building & Construction",
      icon: <HardHat className="w-4 h-4" />,
    },
    {
      id: "MEDICAL_LAB",
      label: "Medical & Lab Equipment",
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
      {/* Category header / tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
            Industrial Equipment & Machinery Specifications
          </h3>
          <p className="text-xs text-gray-500">
            Select machinery category archetype to configure tailored engineering parameters.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100/80 rounded-lg">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200/60 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render active archetype field */}
      {activeTab === "METAL_WOOD" && (
        <MetalWoodMachineryField
          value={currentAttributes}
          onChange={onChange}
        />
      )}

      {activeTab === "TEXTILE_PACKAGING" && (
        <TextilePackagingField
          value={currentAttributes}
          onChange={onChange}
        />
      )}

      {activeTab === "FOOD_AGRO" && (
        <FoodAgroEquipmentField
          value={currentAttributes}
          attributes={currentAttributes}
          onChange={onChange}
          brandValue={brandValue}
          onBrandChange={onBrandChange}
        />
      )}

      {activeTab === "CONSTRUCTION" && (
        <ConstructionEquipmentField
          value={currentAttributes}
          attributes={currentAttributes}
          onChange={onChange}
          brandValue={brandValue}
          onBrandChange={onBrandChange}
        />
      )}

      {activeTab === "MEDICAL_LAB" && (
        <MedicalLabEquipmentField
          value={currentAttributes}
          attributes={currentAttributes}
          onChange={onChange}
          brandValue={brandValue}
          onBrandChange={onBrandChange}
        />
      )}
    </div>
  );
};

export default IndustrialMachineryDispatcher;
