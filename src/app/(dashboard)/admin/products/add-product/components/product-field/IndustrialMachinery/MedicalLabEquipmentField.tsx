import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface CustomSpec {
  key: string;
  value: string;
}

interface MedicalLabEquipmentFieldProps {
  value?: Record<string, any>;
  attributes?: Record<string, any>;
  onChange: (attributes: Record<string, any>) => void;
  brandValue?: string;
  onBrandChange?: (brand: string) => void;
}

const EQUIPMENT_TYPES = [
  "Autoclave & Steam Sterilizer",
  "Centrifuge Machine (Benchtop / High Speed)",
  "Laboratory Incubator & Drying Oven",
  "Biochemistry / Hematology Analyzer",
  "Biological Safety Cabinet / Fume Hood",
  "Microscope (Biological / Fluorescence)",
  "Hospital Patient Monitor & ECG Machine",
  "Ultrasound Diagnostic Scanner",
  "Operating Table & Surgical Lamp",
  "Hospital ICU Bed & Electric Nursing Bed",
  "Medical Oxygen Concentrator / Generator",
  "Spectrophotometer / Chromatography",
  "Other Medical & Lab Equipment",
];

const STERILIZATION_METHODS = [
  "High-Pressure Steam (Autoclave)",
  "Ethylene Oxide (ETO)",
  "UV-C Radiation",
  "Dry Heat Sterilization",
  "Hydrogen Peroxide Plasma",
  "Not Applicable / Analytical",
];

const CERTIFICATIONS = [
  "CE Medical (CE 0123 / CE 0197)",
  "ISO 13485 (Medical Devices)",
  "FDA Cleared / Approved",
  "ISO 9001 & ISO 14001",
  "GMP Compliant",
  "Standard Laboratory Grade",
];

const DISPLAY_INTERFACES = [
  "Color LCD Touchscreen with Data Port",
  "Digital LED Display with Membrane Keys",
  "Analog / Dial Gauge",
  "PC-Connected USB/RS232/Ethernet Interface",
];

const WARRANTY_OPTIONS = [
  "No Warranty",
  "1 Year Free Service & Parts",
  "2 Years Comprehensive Warranty",
  "3 Years Warranty with Annual Calibration",
  "5 Years Extended Core Warranty",
];

export const MedicalLabEquipmentField: React.FC<MedicalLabEquipmentFieldProps> = ({
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
            Hospital, Medical & Laboratory Equipment Specifications
          </h4>
          <p className="text-xs text-gray-500">
            Configure chamber capacity, precision parameters, medical certifications, and power/calibration.
          </p>
        </div>
        <span className="text-xs bg-cyan-50 text-cyan-700 font-medium px-2.5 py-1 rounded-full border border-cyan-200">
          Medical & Lab Equipment
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Machine / Equipment Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Equipment / Device Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            list="medical-lab-types"
            value={currentAttrs.machineryType || ""}
            onChange={(e) => handleFieldChange("machineryType", e.target.value)}
            placeholder="e.g. Autoclave Sterilizer / Centrifuge"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
          <datalist id="medical-lab-types">
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
              placeholder="e.g. Mindray, Biobase, Olympus, Thermo Fisher"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>
        )}

        {/* Model Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Model Number / Cat No.
          </label>
          <input
            type="text"
            value={currentAttrs.modelNumber || ""}
            onChange={(e) => handleFieldChange("modelNumber", e.target.value)}
            placeholder="e.g. BKQ-B50II / TGL-16M"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Chamber Volume / Sample Capacity */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Capacity / Volume / Throughput <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={currentAttrs.outputCapacity || ""}
            onChange={(e) => handleFieldChange("outputCapacity", e.target.value)}
            placeholder="e.g. 50 Liters / 12 x 15ml / 200 tests/hr"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Temperature / Speed / Pressure Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Operating Range / Accuracy
          </label>
          <input
            type="text"
            value={currentAttrs.operatingSpecs || ""}
            onChange={(e) => handleFieldChange("operatingSpecs", e.target.value)}
            placeholder="e.g. 105°C - 134°C (0.22 MPa) / 16,000 RPM"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Power Supply & Consumption */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Power Supply & Voltage
          </label>
          <input
            type="text"
            value={currentAttrs.powerRating || ""}
            onChange={(e) => handleFieldChange("powerRating", e.target.value)}
            placeholder="e.g. AC 220V 50Hz, 3.5 kW"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Sterilization / Separation Method */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Sterilization / Processing Method
          </label>
          <select
            value={currentAttrs.sterilizationMethod || ""}
            onChange={(e) => handleFieldChange("sterilizationMethod", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Method</option>
            {STERILIZATION_METHODS.map((sm) => (
              <option key={sm} value={sm}>
                {sm}
              </option>
            ))}
          </select>
        </div>

        {/* Display & Control Interface */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Display & User Interface
          </label>
          <select
            value={currentAttrs.displayInterface || ""}
            onChange={(e) => handleFieldChange("displayInterface", e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="">Select Display Type</option>
            {DISPLAY_INTERFACES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Medical Certifications */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Medical / Lab Certification
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

        {/* Chamber / Structural Material */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Chamber Material
          </label>
          <input
            type="text"
            value={currentAttrs.contactMaterial || ""}
            onChange={(e) => handleFieldChange("contactMaterial", e.target.value)}
            placeholder="e.g. SUS 304 / SUS 316 Stainless Steel"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Dimensions & Weight */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            External Dimensions & Weight
          </label>
          <input
            type="text"
            value={currentAttrs.dimensions || ""}
            onChange={(e) => handleFieldChange("dimensions", e.target.value)}
            placeholder="e.g. 600 x 500 x 1150 mm, 85 kg"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Warranty & Calibration */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Warranty & Calibration Support
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
                  placeholder="Parameter name (e.g. Noise Level)"
                  value={spec.key}
                  onChange={(e) => handleCustomSpecChange(index, "key", e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Specification value (e.g. < 55 dB(A))"
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
