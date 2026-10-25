"use client";

type PanjabiSize = {
  size: string;
  sku: string;
  stock: string;
};

type PanjabiColor = {
  color: string;
  images: string[];
  sizes: PanjabiSize[];
};

export type PanjabiData = {
  brand: string;
  fabric: string;
  pattern: string;
  occasion: string;
  colors: PanjabiColor[];
};

type PanjabiProps = {
  value: PanjabiData;
  onChange: (value: PanjabiData) => void;
};

const AVAILABLE_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

export default function Panjabi({
  value,
  onChange,
}: PanjabiProps) {
  const colors = Array.isArray(value?.colors)
    ? value.colors
    : [];

  // ---------------------------------------------
  // Product-level field update
  // ---------------------------------------------

  const updateField = (
    field: keyof Omit<PanjabiData, "colors">,
    fieldValue: string
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
      colors,
    });
  };

  // ---------------------------------------------
  // Add Color
  // ---------------------------------------------

  const addColor = () => {
    onChange({
      ...value,
      colors: [
        ...colors,
        {
          color: "",
          images: [],
          sizes: [],
        },
      ],
    });
  };

  // ---------------------------------------------
  // Remove Color
  // ---------------------------------------------

  const removeColor = (colorIndex: number) => {
    onChange({
      ...value,
      colors: colors.filter(
        (_, index) => index !== colorIndex
      ),
    });
  };

  // ---------------------------------------------
  // Update Color
  // ---------------------------------------------

  const updateColor = (
    colorIndex: number,
    color: string
  ) => {
    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      color,
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  // ---------------------------------------------
  // Add Size
  // ---------------------------------------------

  const addSize = (colorIndex: number) => {
    const updatedColors = [...colors];

    const currentSizes =
      updatedColors[colorIndex]?.sizes || [];

    const nextSize = AVAILABLE_SIZES.find(
      (size) =>
        !currentSizes.some(
          (item) => item.size === size
        )
    );

    if (!nextSize) {
      return;
    }

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      sizes: [
        ...currentSizes,
        {
          size: nextSize,
          sku: "",
          stock: "",
        },
      ],
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  // ---------------------------------------------
  // Remove Size
  // ---------------------------------------------

  const removeSize = (
    colorIndex: number,
    sizeIndex: number
  ) => {
    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      sizes:
        updatedColors[colorIndex].sizes.filter(
          (_, index) => index !== sizeIndex
        ),
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  // ---------------------------------------------
  // Update Size
  // ---------------------------------------------

  const updateSizeField = (
    colorIndex: number,
    sizeIndex: number,
    field: keyof PanjabiSize,
    fieldValue: string
  ) => {
    const updatedColors = [...colors];

    const updatedSizes = [
      ...updatedColors[colorIndex].sizes,
    ];

    updatedSizes[sizeIndex] = {
      ...updatedSizes[sizeIndex],
      [field]: fieldValue,
    };

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      sizes: updatedSizes,
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  // ---------------------------------------------
  // Add Image
  // ---------------------------------------------

  const addImage = (colorIndex: number) => {
    const image = window.prompt(
      "Enter image URL"
    );

    if (!image?.trim()) {
      return;
    }

    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      images: [
        ...updatedColors[colorIndex].images,
        image.trim(),
      ],
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  // ---------------------------------------------
  // Remove Image
  // ---------------------------------------------

  const removeImage = (
    colorIndex: number,
    imageIndex: number
  ) => {
    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      images:
        updatedColors[colorIndex].images.filter(
          (_, index) => index !== imageIndex
        ),
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">

      {/* -----------------------------------------
          Header
      ----------------------------------------- */}

      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Panjabi Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Add product-specific information for this panjabi.
        </p>
      </div>

      {/* -----------------------------------------
          Product Information
      ----------------------------------------- */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Brand */}
        <Input
          label="Brand"
          value={value?.brand || ""}
          onChange={(v) =>
            updateField("brand", v)
          }
          placeholder="Enter brand"
        />

        {/* Fabric */}
        <Input
          label="Fabric"
          value={value?.fabric || ""}
          onChange={(v) =>
            updateField("fabric", v)
          }
          placeholder="Enter fabric"
        />

        {/* Pattern */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Pattern
          </label>

          <select
            value={value?.pattern || ""}
            onChange={(e) =>
              updateField(
                "pattern",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            <option value="">
              Select pattern
            </option>

            <option value="Solid">
              Solid
            </option>

            <option value="Embroidered">
              Embroidered
            </option>

            <option value="Printed">
              Printed
            </option>

            <option value="Jacquard">
              Jacquard
            </option>

            <option value="Textured">
              Textured
            </option>

            <option value="Traditional">
              Traditional
            </option>
          </select>
        </div>

        {/* Occasion */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Occasion
          </label>

          <select
            value={value?.occasion || ""}
            onChange={(e) =>
              updateField(
                "occasion",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            <option value="">
              Select occasion
            </option>

            <option value="Eid">
              Eid
            </option>

            <option value="Wedding">
              Wedding
            </option>

            <option value="Party">
              Party
            </option>

            <option value="Formal">
              Formal
            </option>

            <option value="Casual">
              Casual
            </option>

            <option value="Festive">
              Festive
            </option>
          </select>
        </div>
      </div>

      {/* -----------------------------------------
          Colors & Sizes
      ----------------------------------------- */}

      <div className="mt-7 border-t border-slate-200 pt-6">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Colors & Sizes
            </h4>

            <p className="mt-1 text-xs text-slate-500">
              Add colors, images and available sizes.
            </p>
          </div>

          <button
            type="button"
            onClick={addColor}
            className="rounded-lg bg-[#12233F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0d1b31]"
          >
            + Add Color
          </button>
        </div>

        {/* -----------------------------------------
            Color List
        ----------------------------------------- */}

        <div className="space-y-5">

          {colors.map(
            (colorItem, colorIndex) => (
              <div
                key={colorIndex}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >

                {/* Color */}

                <div className="flex items-end gap-3">

                  <div className="flex-1">

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Color
                    </label>

                    <input
                      type="text"
                      value={
                        colorItem.color || ""
                      }
                      onChange={(e) =>
                        updateColor(
                          colorIndex,
                          e.target.value
                        )
                      }
                      placeholder="e.g. Black"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeColor(
                        colorIndex
                      )
                    }
                    className="rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                {/* ---------------------------------
                    Images
                --------------------------------- */}

                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-medium text-slate-700">
                      Color Images
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        addImage(
                          colorIndex
                        )
                      }
                      className="text-sm font-medium text-[#12233F] hover:underline"
                    >
                      + Add Image
                    </button>
                  </div>

                  {colorItem.images.length >
                  0 ? (
                    <div className="space-y-2">

                      {colorItem.images.map(
                        (
                          image,
                          imageIndex
                        ) => (
                          <div
                            key={imageIndex}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                          >
                            <span className="truncate text-xs text-slate-600">
                              {image}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  colorIndex,
                                  imageIndex
                                )
                              }
                              className="ml-3 shrink-0 text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-xs text-slate-400">
                      No images added
                    </div>
                  )}
                </div>

                {/* ---------------------------------
                    Sizes
                --------------------------------- */}

                <div className="mt-5">

                  <div className="mb-3 flex items-center justify-between">

                    <label className="text-sm font-medium text-slate-700">
                      Available Sizes
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        addSize(
                          colorIndex
                        )
                      }
                      disabled={
                        colorItem.sizes.length >=
                        AVAILABLE_SIZES.length
                      }
                      className="text-sm font-medium text-[#12233F] disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      + Add Size
                    </button>
                  </div>

                  {colorItem.sizes.length >
                  0 ? (
                    <div className="space-y-3">

                      {colorItem.sizes.map(
                        (
                          sizeItem,
                          sizeIndex
                        ) => (
                          <div
                            key={sizeIndex}
                            className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-4"
                          >

                            {/* Size */}

                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Size
                              </label>

                              <select
                                value={
                                  sizeItem.size
                                }
                                onChange={(e) =>
                                  updateSizeField(
                                    colorIndex,
                                    sizeIndex,
                                    "size",
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                              >
                                {AVAILABLE_SIZES.map(
                                  (size) => (
                                    <option
                                      key={size}
                                      value={size}
                                    >
                                      {size}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>

                            {/* SKU */}

                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                SKU
                              </label>

                              <input
                                type="text"
                                value={
                                  sizeItem.sku ||
                                  ""
                                }
                                onChange={(e) =>
                                  updateSizeField(
                                    colorIndex,
                                    sizeIndex,
                                    "sku",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter SKU"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                              />
                            </div>

                            {/* Stock */}

                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                Stock
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={
                                  sizeItem.stock ||
                                  ""
                                }
                                onChange={(e) =>
                                  updateSizeField(
                                    colorIndex,
                                    sizeIndex,
                                    "stock",
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                              />
                            </div>

                            {/* Remove */}

                            <div className="flex items-end">

                              <button
                                type="button"
                                onClick={() =>
                                  removeSize(
                                    colorIndex,
                                    sizeIndex
                                  )
                                }
                                className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                              >
                                Remove
                              </button>

                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-xs text-slate-400">
                      No sizes added
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* No Colors */}

          {colors.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400">
              No colors added yet. Click{" "}
              <span className="font-medium text-slate-600">
                + Add Color
              </span>{" "}
              to create variants.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT COMPONENT
===================================================== */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      />
    </div>
  );
}