import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface CustomSpec {
  key: string;
  value: string;
}

interface ConstructionEquipmentFieldProps {
  value?: Record<string, any>;
  attributes?: Record<string, any>;
  onChange: (attributes: Record<string, any>) => void;
  brandValue?: string;
  onBrandChange?: (brand: string) => void;
}

const EQUIPMENT_TYPES = [
  "Concrete Mixer / Batching Plant",
  "Rebar Bending & Cutting Machine",
  "Plate Compactor / Tamping Rammer",
  "Concrete Vibrator & Screed",
  "Block & Brick Making Machine",
  "Mini Excavator / Earth Mover",
  "Tower Crane & Material Hoist",
  "Scaffolding System & Steel Props",
  "Road Roller & Asphalt Paver",
  "Hydraulic Rock Breaker",
  "Shotcrete & Grouting Pump",
  "Floor Grinder & Polishing Machine",
  "Other Construction Equipment",
];

const POWER_TYPES = [
  "Diesel Engine (Water-Cooled / Air-Cooled)",
  "Heavy-Duty Electric Motor (380V/415V 3-Phase)",
  "Single Phase Electric (220V)",
  "Petrol / Gasoline Engine (Honda / Loncin)",
  "Pneumatic / Hydraulic Driven",
];

const MOBILITY_TYPES = [
  "Stationary / Foundation Mounted",
  "Wheel Mounted (Towable)",
  "Crawler / Track Mounted",
  "Portable / Hand-Operated",
];

const WARRANTY_OPTIONS = [
  "No Warranty",
  "6 Months Limited Warranty",
  "1 Year Free Service & Parts",
  "2 Years Comprehensive Warranty",
  "3 Years Core Structural / Engine Warranty",
];

export const ConstructionEquipmentField: React.FC<ConstructionEquipmentFieldProps> = ({
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
            Building & Construction Equipment Specifications
          </h4>
          <p className="text-xs text-gray-500">
            Configure engine power, load capacity, working output, mobility, and safety certifications.
          </p>
        </div>
        <span className="text-xs bg-orange-50 text-orange-700 font-medium px-2.5 py-1 rounded-full border border-orange-200">
          Construction Machinery
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Machine / Equipment Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Equipment / Machine Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="construction-types"
            value={currentAttrs.machineryType || ""}
            onChange={(e) => handleFieldChange("machineryType", e.target.value)}
            placeholder="e.g. Concrete Mixer / Rebar Bending"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
          <datalist id="construction-types">
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
              placeholder="e.g. Sany, Zoomlion, Wacker Neuson, CAT"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>
        )}

        {/* Model Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Model Number
          </label>
          <input
            type="text"
            value={currentAttrs.modelNumber || ""}
            onChange={(e) => handleFieldChange("modelNumber", e.target.value)}
            placeholder="e.g. JZC-350 / GW-40"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Load / Output Capacity */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Working / Drum Capacity <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentAttrs.outputCapacity || ""}
            onChange={(e) => handleFieldChange("outputCapacity", e.target.value)}
            placeholder="e.g. 350L Drum / 6-40mm Rebar / 1.5 Ton"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Engine / Motor Power */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Engine / Motor Power
          </label>
          <input
            type="text"
            value={currentAttrs.powerRating || ""}
            onChange={(e) => handleFieldChange("powerRating", e.target.value)}
            placeholder="e.g. 15 HP Diesel / 5.5 kW Electric"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Power Source */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Power Source
          </label>
          <select
            value={currentAttrs.powerSource || ""}
            onChange={(e) => handleFieldChange("powerSource", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Power Source</option>
            {POWER_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>

        {/* Mobility Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Mobility / Mounting Type
          </label>
          <select
            value={currentAttrs.mobilityType || ""}
            onChange={(e) => handleFieldChange("mobilityType", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Mobility</option>
            {MOBILITY_TYPES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Operating Weight */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Operating Weight
          </label>
          <input
            type="text"
            value={currentAttrs.operatingWeight || ""}
            onChange={(e) => handleFieldChange("operatingWeight", e.target.value)}
            placeholder="e.g. 1,450 kg / 3,200 lbs"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Productivity / Output Speed */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Productivity / Working Speed
          </label>
          <input
            type="text"
            value={currentAttrs.operatingSpecs || ""}
            onChange={(e) => handleFieldChange("operatingSpecs", e.target.value)}
            placeholder="e.g. 10-14 m³/hr / 5-10 r/min"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Overall Dimensions */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Dimensions (L x W x H)
          </label>
          <input
            type="text"
            value={currentAttrs.dimensions || ""}
            onChange={(e) => handleFieldChange("dimensions", e.target.value)}
            placeholder="e.g. 2650 x 1800 x 2400 mm"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Hydraulic / Brake Safety */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Safety & Hydraulic System
          </label>
          <input
            type="text"
            value={currentAttrs.safetyFeatures || ""}
            onChange={(e) => handleFieldChange("safetyFeatures", e.target.value)}
            placeholder="e.g. Emergency Stop, Hydraulic Lock, Anti-Slip"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Warranty */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Warranty
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
                  placeholder="Parameter name (e.g. Max Bending Angle)"
                  value={spec.key}
                  onChange={(e) => handleCustomSpecChange(index, "key", e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Specification value (e.g. 180°)"
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
