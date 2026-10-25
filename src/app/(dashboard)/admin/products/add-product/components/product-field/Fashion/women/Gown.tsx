"use client";
import { toast } from "react-toastify";

import { useState } from "react";

type GownSize = {
  size: string;
  sku: string;
  stock: string;
};

type GownColor = {
  color: string;
  images: string[];
  sizes: GownSize[];
};

export type GownData = {
  brand: string;
  fabric: string;
  gownType: string;
  pattern: string;
  sleeveType: string;
  neckType: string;
  length: string;
  occasion: string;
  ageGroup: string;
  gender: string;
  colors: GownColor[];
};

type GownProps = {
  value: GownData;
  onChange: (value: GownData) => void;
};

const FABRIC_OPTIONS = [
  "Cotton",
  "Silk",
  "Georgette",
  "Chiffon",
  "Organza",
  "Linen",
  "Velvet",
  "Rayon",
  "Polyester",
  "Satin",
  "Net",
  "Tulle",
  "Muslin",
  "Crepe",
  "Jersey",
  "Cotton Blend",
];

const GOWN_TYPE_OPTIONS = [
  "A-Line Gown",
  "Ball Gown",
  "Maxi Gown",
  "Party Gown",
  "Evening Gown",
  "Bridal Gown",
  "Wedding Gown",
  "Anarkali Gown",
  "Flared Gown",
  "Layered Gown",
  "Princess Gown",
  "Mermaid Gown",
  "Kaftan Gown",
  "Straight Gown",
  "Floor Length Gown",
];

const PATTERN_OPTIONS = [
  "Solid",
  "Printed",
  "Floral",
  "Embroidered",
  "Sequined",
  "Beaded",
  "Zari",
  "Jacquard",
  "Lace",
  "Polka Dot",
  "Striped",
  "Checked",
  "Geometric",
  "Traditional",
  "Stone Work",
  "Thread Work",
  "Color Block",
  "Embellished",
];

const SLEEVE_OPTIONS = [
  "Sleeveless",
  "Cap Sleeve",
  "Short Sleeve",
  "Half Sleeve",
  "Three Quarter Sleeve",
  "Full Sleeve",
  "Puff Sleeve",
  "Bell Sleeve",
  "Bishop Sleeve",
  "Off Shoulder",
  "One Shoulder",
];

const NECK_OPTIONS = [
  "Round Neck",
  "V Neck",
  "U Neck",
  "Boat Neck",
  "Sweetheart Neck",
  "Square Neck",
  "Halter Neck",
  "High Neck",
  "Mandarin Neck",
  "Collar Neck",
  "Off Shoulder",
  "One Shoulder",
  "Keyhole Neck",
];

const OCCASION_OPTIONS = [
  "Casual",
  "Party",
  "Birthday",
  "Wedding",
  "Bridal",
  "Reception",
  "Engagement",
  "Eid",
  "Festive",
  "Traditional",
  "Formal",
  "Evening",
  "Prom",
  "Beach",
  "Maternity",
];

const AGE_GROUP_OPTIONS = [
  "0-3 Months",
  "3-6 Months",
  "6-12 Months",
  "1-2 Years",
  "2-3 Years",
  "4-5 Years",
  "6-7 Years",
  "8-9 Years",
  "10-11 Years",
  "12-13 Years",
  "14-15 Years",
  "16-17 Years",
  "18+ Years",
];

const GIRL_SIZE_OPTIONS = [
  "0-3M",
  "3-6M",
  "6-12M",
  "1-2Y",
  "2-3Y",
  "4-5Y",
  "6-7Y",
  "8-9Y",
  "10-11Y",
  "12-13Y",
  "14-15Y",
];

const WOMEN_SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
];

const LENGTH_OPTIONS = [
  "Knee Length",
  "Midi Length",
  "Tea Length",
  "Ankle Length",
  "Maxi Length",
  "Floor Length",
  "Mini Length",
];

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D6A419]"
      >
        <option value="">Select {label.toLowerCase()}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Gown({ value, onChange }: GownProps) {
  const [newColor, setNewColor] = useState("");

  const updateField = <K extends keyof GownData>(
    field: K,
    fieldValue: GownData[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const safeColors = Array.isArray(value?.colors) ? value.colors : [];

  const sizeOptions =
    value?.gender === "Women"
      ? WOMEN_SIZE_OPTIONS
      : GIRL_SIZE_OPTIONS;

  const addColor = () => {
    const color = newColor.trim();

    if (!color) return;

    const alreadyExists = safeColors.some(
      (item) => item.color.toLowerCase() === color.toLowerCase()
    );

    if (alreadyExists) {
      toast.warning("This color already exists.");
      return;
    }

    updateField("colors", [
      ...safeColors,
      {
        color,
        images: [],
        sizes: [],
      },
    ]);

    setNewColor("");
  };

  const removeColor = (colorIndex: number) => {
    updateField(
      "colors",
      safeColors.filter((_, index) => index !== colorIndex)
    );
  };

  const updateColor = (
    colorIndex: number,
    field: keyof GownColor,
    fieldValue: any
  ) => {
    const updatedColors = safeColors.map((color, index) =>
      index === colorIndex
        ? {
            ...color,
            [field]: fieldValue,
          }
        : color
    );

    updateField("colors", updatedColors);
  };

  const addImage = (colorIndex: number) => {
    const imageUrl = window.prompt("Enter image URL");

    if (!imageUrl?.trim()) return;

    const currentImages = safeColors[colorIndex]?.images || [];

    updateColor(colorIndex, "images", [
      ...currentImages,
      imageUrl.trim(),
    ]);
  };

  const removeImage = (
    colorIndex: number,
    imageIndex: number
  ) => {
    const currentImages = safeColors[colorIndex]?.images || [];

    updateColor(
      colorIndex,
      "images",
      currentImages.filter((_, index) => index !== imageIndex)
    );
  };

  const addSize = (colorIndex: number, size: string) => {
    if (!size) return;

    const currentSizes = safeColors[colorIndex]?.sizes || [];

    const alreadyExists = currentSizes.some(
      (item) => item.size === size
    );

    if (alreadyExists) {
      toast.warning("This size is already added.");
      return;
    }

    if (currentSizes.length >= 15) {
      toast.warning("Maximum 15 sizes can be added.");
      return;
    }

    updateColor(colorIndex, "sizes", [
      ...currentSizes,
      {
        size,
        sku: "",
        stock: "",
      },
    ]);
  };

  const updateSize = (
    colorIndex: number,
    sizeIndex: number,
    field: keyof GownSize,
    fieldValue: string
  ) => {
    const currentSizes = safeColors[colorIndex]?.sizes || [];

    const updatedSizes = currentSizes.map((item, index) =>
      index === sizeIndex
        ? {
            ...item,
            [field]: fieldValue,
          }
        : item
    );

    updateColor(colorIndex, "sizes", updatedSizes);
  };

  const removeSize = (
    colorIndex: number,
    sizeIndex: number
  ) => {
    const currentSizes = safeColors[colorIndex]?.sizes || [];

    updateColor(
      colorIndex,
      "sizes",
      currentSizes.filter((_, index) => index !== sizeIndex)
    );
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Gown Specific Information
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Girls and women gown product details, colors, sizes and inventory.
        </p>
      </div>

      <div className="space-y-6 p-5">
        {/* Basic Information */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Brand */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Brand
              </label>

              <input
                type="text"
                value={value.brand}
                onChange={(e) =>
                  updateField("brand", e.target.value)
                }
                placeholder="Enter brand"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
              />
            </div>

            {/* Fabric */}
            <SelectField
              label="Fabric"
              value={value.fabric}
              options={FABRIC_OPTIONS}
              onChange={(nextValue) =>
                updateField("fabric", nextValue)
              }
            />

            {/* Gown Type */}
            <SelectField
              label="Gown Type"
              value={value.gownType}
              options={GOWN_TYPE_OPTIONS}
              onChange={(nextValue) =>
                updateField("gownType", nextValue)
              }
            />

            {/* Pattern */}
            <SelectField
              label="Pattern / Design"
              value={value.pattern}
              options={PATTERN_OPTIONS}
              onChange={(nextValue) =>
                updateField("pattern", nextValue)
              }
            />

            {/* Sleeve */}
            <SelectField
              label="Sleeve Type"
              value={value.sleeveType}
              options={SLEEVE_OPTIONS}
              onChange={(nextValue) =>
                updateField("sleeveType", nextValue)
              }
            />

            {/* Neck */}
            <SelectField
              label="Neck Type"
              value={value.neckType}
              options={NECK_OPTIONS}
              onChange={(nextValue) =>
                updateField("neckType", nextValue)
              }
            />

            {/* Length */}
            <SelectField
              label="Length"
              value={value.length}
              options={LENGTH_OPTIONS}
              onChange={(nextValue) =>
                updateField("length", nextValue)
              }
            />

            {/* Occasion */}
            <SelectField
              label="Occasion"
              value={value.occasion}
              options={OCCASION_OPTIONS}
              onChange={(nextValue) =>
                updateField("occasion", nextValue)
              }
            />

            {/* Gender */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Gender
              </label>

              <select
                value={value.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
              >
                <option value="">Select gender</option>
                <option value="Girl">Girl</option>
                <option value="Women">Women</option>
              </select>
            </div>

            {/* Age Group */}
            <SelectField
              label="Age Group"
              value={value.ageGroup}
              options={AGE_GROUP_OPTIONS}
              onChange={(nextValue) =>
                updateField("ageGroup", nextValue)
              }
            />
          </div>
        </div>

        {/* Colors */}
        <div className="border-t border-slate-100 pt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Colors & Variants
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Add colors, images, sizes, SKU and stock.
              </p>
            </div>
          </div>

          {/* Add Color */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
              placeholder="Enter color name"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#D6A419]"
            />

            <button
              type="button"
              onClick={addColor}
              className="rounded-lg bg-[#12233F] px-4 py-2.5 text-xs font-medium text-white hover:opacity-90"
            >
              Add Color
            </button>
          </div>

          {/* Color Cards */}
          <div className="mt-4 space-y-4">
            {safeColors.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
                <p className="text-xs text-slate-400">
                  No colors added yet.
                </p>
              </div>
            ) : (
              safeColors.map((color, colorIndex) => (
                <div
                  key={`${color.color}-${colorIndex}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  {/* Color Header */}
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={color.color}
                      onChange={(e) =>
                        updateColor(
                          colorIndex,
                          "color",
                          e.target.value
                        )
                      }
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#D6A419]"
                    />

                    <button
                      type="button"
                      onClick={() => removeColor(colorIndex)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Images */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">
                        Color Images
                      </label>

                      <button
                        type="button"
                        onClick={() => addImage(colorIndex)}
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        + Add Image
                      </button>
                    </div>

                    {color.images.length > 0 && (
                      <div className="space-y-2">
                        {color.images.map((image, imageIndex) => (
                          <div
                            key={`${image}-${imageIndex}`}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={image}
                              onChange={(e) => {
                                const updatedImages = [
                                  ...color.images,
                                ];

                                updatedImages[imageIndex] =
                                  e.target.value;

                                updateColor(
                                  colorIndex,
                                  "images",
                                  updatedImages
                                );
                              }}
                              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#D6A419]"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  colorIndex,
                                  imageIndex
                                )
                              }
                              className="px-2 text-xs text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Available Sizes
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((size) => {
                        const isSelected = color.sizes.some(
                          (item) => item.size === size
                        );

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() =>
                              isSelected
                                ? removeSize(
                                    colorIndex,
                                    color.sizes.findIndex(
                                      (item) =>
                                        item.size === size
                                    )
                                  )
                                : addSize(colorIndex, size)
                            }
                            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                              isSelected
                                ? "border-[#12233F] bg-[#12233F] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Sizes */}
                  {color.sizes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {color.sizes.map((size, sizeIndex) => (
                        <div
                          key={`${size.size}-${sizeIndex}`}
                          className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[100px_1fr_140px_auto]"
                        >
                          {/* Size */}
                          <div className="flex items-center">
                            <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                              {size.size}
                            </span>
                          </div>

                          {/* SKU */}
                          <input
                            type="text"
                            value={size.sku}
                            onChange={(e) =>
                              updateSize(
                                colorIndex,
                                sizeIndex,
                                "sku",
                                e.target.value
                              )
                            }
                            placeholder="SKU"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#D6A419]"
                          />

                          {/* Stock */}
                          <input
                            type="number"
                            min="0"
                            value={size.stock}
                            onChange={(e) =>
                              updateSize(
                                colorIndex,
                                sizeIndex,
                                "stock",
                                e.target.value
                              )
                            }
                            placeholder="Stock"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#D6A419]"
                          />

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeSize(
                                colorIndex,
                                sizeIndex
                              )
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}