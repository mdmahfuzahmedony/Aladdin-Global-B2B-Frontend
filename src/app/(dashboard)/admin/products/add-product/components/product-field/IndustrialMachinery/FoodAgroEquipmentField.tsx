import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface CustomSpec {
  key: string;
  value: string;
}

interface FoodAgroEquipmentFieldProps {
  value?: Record<string, any>;
  attributes?: Record<string, any>;
  onChange: (attributes: Record<string, any>) => void;
  brandValue?: string;
  onBrandChange?: (brand: string) => void;
}

const EQUIPMENT_TYPES = [
  "Flour & Grain Milling Machine",
  "Oil Extraction & Refining Machine",
  "Bakery & Convection Oven",
  "Dough Mixer & Sheeter",
  "Meat Mincer & Sausage Filler",
  "Fruit & Vegetable Dehydrator / Dryer",
  "Beverage & Juice Filling Machine",
  "Commercial Dairy / Milk Pasteurizer",
  "Vacuum Packing Machine",
  "Tractor & Cultivator",
  "Combine Harvester",
  "Seed Planter / Transplanter",
  "Rice Mill & Huller",
  "Irrigation Water Pump & Sprayer",
  "Feed Pellet Mill Machine",
  "Cold Storage Refrigeration Unit",
  "Other Food / Agro Machinery",
];

const AUTOMATION_GRADES = [
  "Manual",
  "Semi-Automatic",
  "Fully Automatic",
  "Continuous Production Line",
];

const MATERIAL_GRADES = [
  "Food Grade SUS 304 Stainless Steel",
  "SUS 316L Pharmaceutical / Acid Grade",
  "Cast Iron & Carbon Steel",
  "Heavy-Duty Galvanized Steel",
  "Food-Grade Polypropylene / Silicone",
];

const POWER_SOURCES = [
  "Electric Motor (Single Phase 220V)",
  "Electric Motor (3-Phase 380V/440V)",
  "Diesel Engine",
  "Petrol / Gasoline Engine",
  "PTO Driven (Tractor Powered)",
  "Hydraulic / Pneumatic",
];

const CERTIFICATIONS = [
  "CE Certified",
  "ISO 9001:2015",
  "ISO 22000 (Food Safety)",
  "GMP Compliant",
  "HACCP Standard",
  "None / Standard",
];

const WARRANTY_OPTIONS = [
  "No Warranty",
  "6 Months Limited Warranty",
  "1 Year Free Service & Parts",
  "2 Years Comprehensive Warranty",
  "3 Years Core Component (Motor/Gearbox)",
  "5 Years Manufacturer Warranty",
];

export const FoodAgroEquipmentField: React.FC<FoodAgroEquipmentFieldProps> = ({
  value,
  attributes = {},
  onChange,
  brandValue,
  onBrandChange,
}) => {
  const currentAttrs = value || attributes;
  const customSpecs: CustomSpec[] = Array.isArray(currentAttrs.customSpecs)
    ? currentAttrs.customSpecs
    : [];

  const handleFieldChange = (key: string, val: any) => {
    onChange({
      ...currentAttrs,
      [key]: val,
    });
  };

  const handleCustomSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...customSpecs];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...currentAttrs, customSpecs: updated });
  };

  const addCustomSpec = () => {
    onChange({
      ...currentAttrs,
      customSpecs: [...customSpecs, { key: "", value: "" }],
    });
  };

  const removeCustomSpec = (index: number) => {
    const updated = customSpecs.filter((_, i) => i !== index);
    onChange({ ...currentAttrs, customSpecs: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h4 className="text-base font-semibold text-gray-800">
            Food Processing & Agricultural Equipment Specifications
          </h4>
          <p className="text-xs text-gray-500">
            Configure processing capacity, motor/engine specs, hygiene materials, and automation grade.
          </p>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
          Food / Agro Machinery
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Machinery / Equipment Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Equipment / Machine Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="food-agro-types"
            value={currentAttrs.machineryType || ""}
            onChange={(e) => handleFieldChange("machineryType", e.target.value)}
            placeholder="e.g. Flour Mill / Bakery Oven"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
          <datalist id="food-agro-types">
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        {/* Brand / Make */}
        {onBrandChange && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              value={brandValue || ""}
              onChange={(e) => onBrandChange(e.target.value)}
              placeholder="e.g. Alvan Blanch, Buhler, Sinmag"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>
        )}

        {/* Model Number / Series */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Model Number / Series
          </label>
          <input
            type="text"
            value={currentAttrs.modelNumber || ""}
            onChange={(e) => handleFieldChange("modelNumber", e.target.value)}
            placeholder="e.g. AG-500X / DVO-60"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Processing Capacity / Yield */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Production Capacity / Output <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentAttrs.outputCapacity || ""}
            onChange={(e) => handleFieldChange("outputCapacity", e.target.value)}
            placeholder="e.g. 500 kg/hr, 1200 L/hr, 60 bags/min"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Motor Power / Engine Capacity */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Power Rating (kW / HP)
          </label>
          <input
            type="text"
            value={currentAttrs.powerRating || ""}
            onChange={(e) => handleFieldChange("powerRating", e.target.value)}
            placeholder="e.g. 7.5 kW / 10 HP"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Power Source & Phase */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Power Source & Voltage
          </label>
          <select
            value={currentAttrs.powerSource || ""}
            onChange={(e) => handleFieldChange("powerSource", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Power Source</option>
            {POWER_SOURCES.map((ps) => (
              <option key={ps} value={ps}>
                {ps}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Material */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Contact Material / Hygiene Grade
          </label>
          <select
            value={currentAttrs.contactMaterial || ""}
            onChange={(e) => handleFieldChange("contactMaterial", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Material</option>
            {MATERIAL_GRADES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Automation Grade */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Automation Grade
          </label>
          <select
            value={currentAttrs.automationGrade || ""}
            onChange={(e) => handleFieldChange("automationGrade", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Automation Level</option>
            {AUTOMATION_GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Operating Temp / Speed / Pressure */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Operating Temperature / Speed
          </label>
          <input
            type="text"
            value={currentAttrs.operatingSpecs || ""}
            onChange={(e) => handleFieldChange("operatingSpecs", e.target.value)}
            placeholder="e.g. 50°C - 300°C / 45-280 RPM"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Machine Dimensions & Weight */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Dimensions & Net Weight
          </label>
          <input
            type="text"
            value={currentAttrs.dimensions || ""}
            onChange={(e) => handleFieldChange("dimensions", e.target.value)}
            placeholder="e.g. 1800 x 950 x 1650 mm, 450 kg"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Food Safety & Industrial Certifications */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Quality & Safety Certifications
          </label>
          <select
            value={currentAttrs.certification || ""}
            onChange={(e) => handleFieldChange("certification", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Certification</option>
            {CERTIFICATIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Warranty & After-Sales Support */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Warranty & Service
          </label>
          <select
            value={currentAttrs.warrantyPeriod || ""}
            onChange={(e) => handleFieldChange("warrantyPeriod", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Warranty</option>
            {WARRANTY_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Custom Specs */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-gray-700">
            Additional Technical Parameters
          </label>
          <button
            type="button"
            onClick={addCustomSpec}
            className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Parameter
          </button>
        </div>

        {customSpecs.length > 0 && (
          <div className="space-y-2">
            {customSpecs.map((spec, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Parameter name (e.g. Hopper Volume)"
                  value={spec.key}
                  onChange={(e) => handleCustomSpecChange(index, "key", e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Specification value (e.g. 150 Liters)"
                  value={spec.value}
                  onChange={(e) => handleCustomSpecChange(index, "value", e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => removeCustomSpec(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
