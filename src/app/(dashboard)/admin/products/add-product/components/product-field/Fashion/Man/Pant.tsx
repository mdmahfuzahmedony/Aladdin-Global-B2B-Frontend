"use client";

type PantSize = {
  size: string;
  sku: string;
  stock: string;
};

type PantColor = {
  color: string;
  images: string[];
  sizes: PantSize[];
};

export type PantData = {
  brand: string;
  fabric: string;
  fit: string;
  colors: PantColor[];
};

type PantProps = {
  value: PantData;
  onChange: (value: PantData) => void;
};

export default function Pant({
  value,
  onChange,
}: PantProps) {
  const colors = Array.isArray(value?.colors)
    ? value.colors
    : [];

  const updateField = (
    field: keyof Omit<PantData, "colors">,
    fieldValue: string
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

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

  const removeColor = (colorIndex: number) => {
    onChange({
      ...value,
      colors: colors.filter(
        (_, index) => index !== colorIndex
      ),
    });
  };

  const updateColor = (
    colorIndex: number,
    fieldValue: string
  ) => {
    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      color: fieldValue,
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  const addImage = (colorIndex: number) => {
    const imageUrl = window.prompt("Enter image URL");

    if (!imageUrl?.trim()) return;

    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      images: [
        ...updatedColors[colorIndex].images,
        imageUrl.trim(),
      ],
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  const removeImage = (
    colorIndex: number,
    imageIndex: number
  ) => {
    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      images: updatedColors[colorIndex].images.filter(
        (_, index) => index !== imageIndex
      ),
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  const addSize = (colorIndex: number) => {
    const currentSizes =
      colors[colorIndex]?.sizes || [];

    if (currentSizes.length >= 11) return;

    const availableSizes = [
      "28",
      "30",
      "32",
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
      "46",
      "48",
    ];

    const usedSizes = currentSizes.map(
      (item) => item.size
    );

    const nextSize = availableSizes.find(
      (size) => !usedSizes.includes(size)
    );

    if (!nextSize) return;

    const updatedColors = [...colors];

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

  const updateSize = (
    colorIndex: number,
    sizeIndex: number,
    field: keyof PantSize,
    fieldValue: string
  ) => {
    const updatedColors = [...colors];

    const updatedSizes = [
      ...(updatedColors[colorIndex].sizes || []),
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

  const removeSize = (
    colorIndex: number,
    sizeIndex: number
  ) => {
    const updatedColors = [...colors];

    updatedColors[colorIndex] = {
      ...updatedColors[colorIndex],
      sizes: updatedColors[colorIndex].sizes.filter(
        (_, index) => index !== sizeIndex
      ),
    };

    onChange({
      ...value,
      colors: updatedColors,
    });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-base font-semibold text-slate-900">
        Pant Information
      </h3>

      <p className="mt-1 mb-5 text-sm text-slate-500">
        Add product-specific information for this pant.
      </p>

      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Brand"
          value={value?.brand || ""}
          onChange={(v) => updateField("brand", v)}
          placeholder="Enter brand"
        />

        <Input
          label="Fabric"
          value={value?.fabric || ""}
          onChange={(v) => updateField("fabric", v)}
          placeholder="e.g. Denim, Cotton"
        />

        <Select
          label="Fit"
          value={value?.fit || ""}
          onChange={(v) => updateField("fit", v)}
          options={[
            "Slim Fit",
            "Regular Fit",
            "Relaxed Fit",
            "Straight Fit",
            "Skinny Fit",
            "Loose Fit",
            "Tapered Fit",
            "Bootcut",
            "Wide Leg",
          ]}
        />
      </div>

      {/* Colors */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Colors & Waist Sizes
            </h4>

            <p className="mt-1 text-xs text-slate-500">
              Add multiple colors, images, waist sizes, SKU and stock.
            </p>
          </div>

          <button
            type="button"
            onClick={addColor}
            className="rounded-lg bg-[#12233F] px-4 py-2 text-xs font-medium text-white hover:bg-[#1b3155]"
          >
            + Add Color
          </button>
        </div>

        {colors.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center">
            <p className="text-xs text-slate-400">
              No colors added yet.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {colors.map((colorItem, colorIndex) => (
            <div
              key={colorIndex}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              {/* Color */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label="Color"
                    value={colorItem.color}
                    onChange={(v) =>
                      updateColor(colorIndex, v)
                    }
                    placeholder="e.g. Black"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeColor(colorIndex)
                  }
                  className="mb-0.5 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>

              {/* Images */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Color Images
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      addImage(colorIndex)
                    }
                    className="text-xs font-medium text-[#12233F] hover:underline"
                  >
                    + Add Image
                  </button>
                </div>

                {colorItem.images.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white py-5 text-center">
                    <p className="text-xs text-slate-400">
                      No images added.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {colorItem.images.map(
                      (image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="relative overflow-hidden rounded-lg border border-slate-200 bg-white"
                        >
                          <img
                            src={image}
                            alt={`Pant ${colorItem.color} ${
                              imageIndex + 1
                            }`}
                            className="h-24 w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                colorIndex,
                                imageIndex
                              )
                            }
                            className="absolute right-1 top-1 rounded bg-white px-2 py-1 text-[10px] font-medium text-red-600 shadow"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Waist Sizes */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Available Waist Sizes
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      addSize(colorIndex)
                    }
                    disabled={
                      colorItem.sizes.length >= 11
                    }
                    className="text-xs font-medium text-[#12233F] disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    + Add Size
                  </button>
                </div>

                {colorItem.sizes.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white py-5 text-center">
                    <p className="text-xs text-slate-400">
                      No waist sizes added.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {colorItem.sizes.map(
                      (sizeItem, sizeIndex) => (
                        <div
                          key={sizeIndex}
                          className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-4"
                        >
                          {/* Waist Size */}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Waist Size
                            </label>

                            <input
                              value={sizeItem.size}
                              readOnly
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
                            />
                          </div>

                          {/* SKU */}
                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              SKU
                            </label>

                            <input
                              value={sizeItem.sku}
                              onChange={(e) =>
                                updateSize(
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
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Stock
                            </label>

                            <input
                              type="number"
                              min="0"
                              value={sizeItem.stock}
                              onChange={(e) =>
                                updateSize(
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
                              className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Remove Size
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}