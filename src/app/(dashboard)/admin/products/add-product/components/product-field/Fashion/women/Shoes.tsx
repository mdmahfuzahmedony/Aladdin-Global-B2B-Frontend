"use client";
import { toast } from "react-toastify";

import { useState } from "react";

type WomenShoesSize = {
  size: string;
  sku: string;
  stock: string;
};

type WomenShoesColor = {
  color: string;
  images: string[];
  sizes: WomenShoesSize[];
};

export type WomenShoesData = {
  brand: string;
  material: string;
  shoeType: string;
  heelType: string;
  heelHeight: string;
  toeShape: string;
  closureType: string;
  pattern: string;
  occasion: string;
  ageGroup: string;
  gender: string;
  colors: WomenShoesColor[];
};

type WomenShoesProps = {
  value: WomenShoesData;
  onChange: (value: WomenShoesData) => void;
};

const MATERIAL_OPTIONS = [
  "Leather",
  "Genuine Leather",
  "Synthetic Leather",
  "PU Leather",
  "Suede",
  "Canvas",
  "Mesh",
  "Textile",
  "Rubber",
  "EVA",
  "PVC",
  "Velvet",
  "Satin",
];

const SHOE_TYPE_OPTIONS = [
  "Heels",
  "High Heels",
  "Block Heels",
  "Kitten Heels",
  "Stiletto",
  "Wedges",
  "Pumps",
  "Flats",
  "Ballet Flats",
  "Loafers",
  "Moccasins",
  "Sneakers",
  "Slip-On",
  "Boots",
  "Ankle Boots",
  "Formal Shoes",
  "Party Shoes",
  "Bridal Shoes",
  "Sports Shoes",
  "Casual Shoes",
];

const HEEL_TYPE_OPTIONS = [
  "Flat",
  "Block Heel",
  "Kitten Heel",
  "Stiletto",
  "Wedge",
  "Platform",
  "Cone Heel",
  "Flared Heel",
  "Chunky Heel",
];

const HEEL_HEIGHT_OPTIONS = [
  "Flat / 0-1 cm",
  "Low / 1-3 cm",
  "Medium / 3-5 cm",
  "High / 5-8 cm",
  "Very High / 8-12 cm",
  "Extra High / 12+ cm",
];

const TOE_SHAPE_OPTIONS = [
  "Round Toe",
  "Pointed Toe",
  "Square Toe",
  "Almond Toe",
  "Open Toe",
  "Peep Toe",
  "Almond Square Toe",
];

const CLOSURE_OPTIONS = [
  "Slip-On",
  "Buckle",
  "Lace-Up",
  "Velcro",
  "Zip",
  "Strap",
  "Ankle Strap",
  "T-Bar",
  "Button",
];

const PATTERN_OPTIONS = [
  "Solid",
  "Printed",
  "Floral",
  "Embroidered",
  "Metallic",
  "Glitter",
  "Animal Print",
  "Textured",
  "Color Block",
  "Striped",
  "Checked",
  "Polka Dot",
  "Stone Work",
  "Sequined",
  "Beaded",
];

const OCCASION_OPTIONS = [
  "Casual",
  "Daily Wear",
  "Office",
  "Formal",
  "Party",
  "Wedding",
  "Bridal",
  "Reception",
  "Engagement",
  "Eid",
  "Festive",
  "Traditional",
  "Sports",
  "Outdoor",
  "Travel",
];

const AGE_GROUP_OPTIONS = [
  "12-13 Years",
  "14-15 Years",
  "16-17 Years",
  "18+ Years",
];

const SHOE_SIZE_OPTIONS = [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
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
        <option value="">
          Select {label.toLowerCase()}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function WomenShoes({
  value,
  onChange,
}: WomenShoesProps) {
  const [newColor, setNewColor] = useState("");

  const updateField = <K extends keyof WomenShoesData>(
    field: K,
    fieldValue: WomenShoesData[K]
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const safeColors = Array.isArray(value?.colors)
    ? value.colors
    : [];

  const addColor = () => {
    const color = newColor.trim();

    if (!color) return;

    const alreadyExists = safeColors.some(
      (item) =>
        item.color.toLowerCase() === color.toLowerCase()
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
      safeColors.filter(
        (_, index) => index !== colorIndex
      )
    );
  };

  const updateColor = (
    colorIndex: number,
    field: keyof WomenShoesColor,
    fieldValue: any
  ) => {
    const updatedColors = safeColors.map(
      (color, index) =>
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

    const currentImages =
      safeColors[colorIndex]?.images || [];

    updateColor(colorIndex, "images", [
      ...currentImages,
      imageUrl.trim(),
    ]);
  };

  const removeImage = (
    colorIndex: number,
    imageIndex: number
  ) => {
    const currentImages =
      safeColors[colorIndex]?.images || [];

    updateColor(
      colorIndex,
      "images",
      currentImages.filter(
        (_, index) => index !== imageIndex
      )
    );
  };

  const addSize = (
    colorIndex: number,
    size: string
  ) => {
    if (!size) return;

    const currentSizes =
      safeColors[colorIndex]?.sizes || [];

    const alreadyExists = currentSizes.some(
      (item) => item.size === size
    );

    if (alreadyExists) {
      toast.warning("This size is already added.");
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
    field: keyof WomenShoesSize,
    fieldValue: string
  ) => {
    const currentSizes =
      safeColors[colorIndex]?.sizes || [];

    const updatedSizes = currentSizes.map(
      (item, index) =>
        index === sizeIndex
          ? {
              ...item,
              [field]: fieldValue,
            }
          : item
    );

    updateColor(
      colorIndex,
      "sizes",
      updatedSizes
    );
  };

  const removeSize = (
    colorIndex: number,
    sizeIndex: number
  ) => {
    const currentSizes =
      safeColors[colorIndex]?.sizes || [];

    updateColor(
      colorIndex,
      "sizes",
      currentSizes.filter(
        (_, index) => index !== sizeIndex
      )
    );
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Women&apos;s Shoes Specific Information
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Women&apos;s footwear details, colors,
          sizes and inventory.
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

            {/* Material */}
            <SelectField
              label="Material"
              value={value.material}
              options={MATERIAL_OPTIONS}
              onChange={(nextValue) =>
                updateField("material", nextValue)
              }
            />

            {/* Shoe Type */}
            <SelectField
              label="Shoe Type"
              value={value.shoeType}
              options={SHOE_TYPE_OPTIONS}
              onChange={(nextValue) =>
                updateField("shoeType", nextValue)
              }
            />

            {/* Heel Type */}
            <SelectField
              label="Heel Type"
              value={value.heelType}
              options={HEEL_TYPE_OPTIONS}
              onChange={(nextValue) =>
                updateField("heelType", nextValue)
              }
            />

            {/* Heel Height */}
            <SelectField
              label="Heel Height"
              value={value.heelHeight}
              options={HEEL_HEIGHT_OPTIONS}
              onChange={(nextValue) =>
                updateField("heelHeight", nextValue)
              }
            />

            {/* Toe Shape */}
            <SelectField
              label="Toe Shape"
              value={value.toeShape}
              options={TOE_SHAPE_OPTIONS}
              onChange={(nextValue) =>
                updateField("toeShape", nextValue)
              }
            />

            {/* Closure */}
            <SelectField
              label="Closure Type"
              value={value.closureType}
              options={CLOSURE_OPTIONS}
              onChange={(nextValue) =>
                updateField("closureType", nextValue)
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
                <option value="Women">Women</option>
                <option value="Girl">Girl</option>
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

        {/* Colors & Variants */}
        <div className="border-t border-slate-100 pt-5">
          <div className="mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Colors & Variants
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Add colors, images, sizes, SKU and stock.
            </p>
          </div>

          {/* Add Color */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newColor}
              onChange={(e) =>
                setNewColor(e.target.value)
              }
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
                  {/* Color */}
                  <div className="flex items-center gap-3">
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
                      onClick={() =>
                        removeColor(colorIndex)
                      }
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
                        onClick={() =>
                          addImage(colorIndex)
                        }
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        + Add Image
                      </button>
                    </div>

                    {color.images.length > 0 && (
                      <div className="space-y-2">
                        {color.images.map(
                          (image, imageIndex) => (
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
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-medium text-slate-700">
                      Available Sizes
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {SHOE_SIZE_OPTIONS.map((size) => {
                        const isSelected =
                          color.sizes.some(
                            (item) => item.size === size
                          );

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                const index =
                                  color.sizes.findIndex(
                                    (item) =>
                                      item.size === size
                                  );

                                removeSize(
                                  colorIndex,
                                  index
                                );
                              } else {
                                addSize(
                                  colorIndex,
                                  size
                                );
                              }
                            }}
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
                      {color.sizes.map(
                        (size, sizeIndex) => (
                          <div
                            key={`${size.size}-${sizeIndex}`}
                            className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-[100px_1fr_140px_auto]"
                          >
                            <div className="flex items-center">
                              <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                                EU {size.size}
                              </span>
                            </div>

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
                        )
                      )}
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