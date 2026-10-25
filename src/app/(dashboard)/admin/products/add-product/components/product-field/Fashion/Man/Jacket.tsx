"use client";
import { toast } from "react-toastify";

import { useState } from "react";

type JacketSize = {
  size: string;
  sku: string;
  stock: string;
};

type JacketColor = {
  color: string;
  images: string[];
  sizes: JacketSize[];
};

export type JacketData = {
  brand: string;
  material: string;
  jacketType: string;
  fit: string;
  pattern: string;
  sleeveType: string;
  collarType: string;
  closureType: string;
  lining: string;
  colors: JacketColor[];
};

type JacketProps = {
  value: JacketData;
  onChange: (value: JacketData) => void;
};

const MATERIAL_OPTIONS = [
  "Leather",
  "Faux Leather",
  "Denim",
  "Cotton",
  "Polyester",
  "Nylon",
  "Fleece",
  "Wool",
  "Suede",
  "Corduroy",
  "Cotton Blend",
];

const JACKET_TYPE_OPTIONS = [
  "Bomber Jacket",
  "Biker Jacket",
  "Leather Jacket",
  "Denim Jacket",
  "Puffer Jacket",
  "Varsity Jacket",
  "Windbreaker",
  "Hooded Jacket",
  "Winter Jacket",
  "Rain Jacket",
  "Blazer Jacket",
  "Utility Jacket",
  "Field Jacket",
  "Track Jacket",
  "Fleece Jacket",
  "Quilted Jacket",
  "Parkas",
];

const FIT_OPTIONS = [
  "Regular Fit",
  "Slim Fit",
  "Relaxed Fit",
  "Oversized",
  "Loose Fit",
  "Tailored Fit",
];

const PATTERN_OPTIONS = [
  "Solid",
  "Printed",
  "Graphic",
  "Striped",
  "Checked",
  "Color Block",
  "Camouflage",
  "Embroidered",
  "Quilted",
  "Textured",
];

const SLEEVE_OPTIONS = [
  "Full Sleeve",
  "Long Sleeve",
  "Half Sleeve",
  "Sleeveless",
];

const COLLAR_OPTIONS = [
  "Stand Collar",
  "Mandarin Collar",
  "Shirt Collar",
  "Bomber Collar",
  "Hooded",
  "Lapel Collar",
  "Notched Collar",
  "Funnel Neck",
];

const CLOSURE_OPTIONS = [
  "Zipper",
  "Button",
  "Snap Button",
  "Zipper & Button",
  "Toggle",
  "Belt",
];

const LINING_OPTIONS = [
  "Unlined",
  "Cotton Lining",
  "Polyester Lining",
  "Fleece Lining",
  "Quilted Lining",
  "Sherpa Lining",
  "Mesh Lining",
];

const SIZE_OPTIONS = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
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

export default function Jacket({
  value,
  onChange,
}: JacketProps) {
  const [newColor, setNewColor] = useState("");

  const updateField = <K extends keyof JacketData>(
    field: K,
    fieldValue: JacketData[K]
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

    const exists = safeColors.some(
      (item) =>
        item.color.toLowerCase() === color.toLowerCase()
    );

    if (exists) {
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
    field: keyof JacketColor,
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

    const images =
      safeColors[colorIndex]?.images || [];

    updateColor(colorIndex, "images", [
      ...images,
      imageUrl.trim(),
    ]);
  };

  const removeImage = (
    colorIndex: number,
    imageIndex: number
  ) => {
    const images =
      safeColors[colorIndex]?.images || [];

    updateColor(
      colorIndex,
      "images",
      images.filter(
        (_, index) => index !== imageIndex
      )
    );
  };

  const addSize = (
    colorIndex: number,
    size: string
  ) => {
    const sizes =
      safeColors[colorIndex]?.sizes || [];

    const exists = sizes.some(
      (item) => item.size === size
    );

    if (exists) {
      toast.warning("This size is already added.");
      return;
    }

    updateColor(colorIndex, "sizes", [
      ...sizes,
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
    field: keyof JacketSize,
    fieldValue: string
  ) => {
    const sizes =
      safeColors[colorIndex]?.sizes || [];

    const updatedSizes = sizes.map(
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
    const sizes =
      safeColors[colorIndex]?.sizes || [];

    updateColor(
      colorIndex,
      "sizes",
      sizes.filter(
        (_, index) => index !== sizeIndex
      )
    );
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Men&apos;s Jacket Information
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Add jacket details, colors, sizes and inventory.
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

            {/* Jacket Type */}
            <SelectField
              label="Jacket Type"
              value={value.jacketType}
              options={JACKET_TYPE_OPTIONS}
              onChange={(nextValue) =>
                updateField("jacketType", nextValue)
              }
            />

            {/* Fit */}
            <SelectField
              label="Fit"
              value={value.fit}
              options={FIT_OPTIONS}
              onChange={(nextValue) =>
                updateField("fit", nextValue)
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

            {/* Collar */}
            <SelectField
              label="Collar Type"
              value={value.collarType}
              options={COLLAR_OPTIONS}
              onChange={(nextValue) =>
                updateField("collarType", nextValue)
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

            {/* Lining */}
            <SelectField
              label="Lining"
              value={value.lining}
              options={LINING_OPTIONS}
              onChange={(nextValue) =>
                updateField("lining", nextValue)
              }
            />
          </div>
        </div>

        {/* Colors & Sizes */}
        <div className="border-t border-slate-100 pt-5">
          <div className="mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Colors & Sizes
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

          {/* Color List */}
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
                  {/* Color Name */}
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
                                  const images = [
                                    ...color.images,
                                  ];

                                  images[imageIndex] =
                                    e.target.value;

                                  updateColor(
                                    colorIndex,
                                    "images",
                                    images
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
                      {SIZE_OPTIONS.map((size) => {
                        const selected =
                          color.sizes.some(
                            (item) => item.size === size
                          );

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              if (selected) {
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
                              selected
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

                  {/* Size Details */}
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
                                {size.size}
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