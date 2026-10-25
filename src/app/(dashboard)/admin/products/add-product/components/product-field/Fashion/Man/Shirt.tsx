"use client";
// "use client";

// import React from "react";
// import ProductImageUploader from "../../ProductImageUploader";


// type ShirtSize = {
//   size: string;
//   sku: string;
//   stock: string;
// };

// type ShirtColor = {
//   color: string;
//   images: string[];
//   sizes: ShirtSize[];
// };

// export type ShirtData = {
//   brand: string;
//   fabric: string;
//   pattern: string;
//   fit: string;
//   sleeveType: string;
//   collarType: string;
//   colors: ShirtColor[];
// };

// type ShirtProps = {
//   value: ShirtData;
//   onChange: (value: ShirtData) => void;
// };

// const AVAILABLE_SIZES = [
//   "S",
//   "M",
//   "L",
//   "XL",
//   "XXL",
// ];

// export default function Shirt({
//   value,
//   onChange,
// }: ShirtProps) {
//   const colors = Array.isArray(value?.colors)
//     ? value.colors
//     : [];

//   // Product-level field update
//   const updateField = (
//     field: keyof Omit<ShirtData, "colors">,
//     fieldValue: string
//   ) => {
//     onChange({
//       ...value,
//       [field]: fieldValue,
//       colors,
//     });
//   };

//   // Add color
//   const addColor = () => {
//     onChange({
//       ...value,
//       colors: [
//         ...colors,
//         {
//           color: "",
//           images: [],
//           sizes: [],
//         },
//       ],
//     });
//   };

//   // Remove color
//   const removeColor = (colorIndex: number) => {
//     onChange({
//       ...value,
//       colors: colors.filter(
//         (_, index) => index !== colorIndex
//       ),
//     });
//   };

//   // Update color
//   const updateColor = (
//     colorIndex: number,
//     color: string
//   ) => {
//     const updatedColors = [...colors];

//     updatedColors[colorIndex] = {
//       ...updatedColors[colorIndex],
//       color,
//     };

//     onChange({
//       ...value,
//       colors: updatedColors,
//     });
//   };

//   // Update color images
//   const updateColorImages = (
//     colorIndex: number,
//     images: string[]
//   ) => {
//     const updatedColors = [...colors];

//     updatedColors[colorIndex] = {
//       ...updatedColors[colorIndex],
//       images,
//     };

//     onChange({
//       ...value,
//       colors: updatedColors,
//     });
//   };

//   // Add size
//   const addSize = (colorIndex: number) => {
//     const updatedColors = [...colors];

//     const currentSizes =
//       updatedColors[colorIndex]?.sizes || [];

//     const nextSize = AVAILABLE_SIZES.find(
//       (size) =>
//         !currentSizes.some(
//           (item) => item.size === size
//         )
//     );

//     if (!nextSize) return;

//     updatedColors[colorIndex] = {
//       ...updatedColors[colorIndex],
//       sizes: [
//         ...currentSizes,
//         {
//           size: nextSize,
//           sku: "",
//           stock: "",
//         },
//       ],
//     };

//     onChange({
//       ...value,
//       colors: updatedColors,
//     });
//   };

//   // Remove size
//   const removeSize = (
//     colorIndex: number,
//     sizeIndex: number
//   ) => {
//     const updatedColors = [...colors];

//     updatedColors[colorIndex] = {
//       ...updatedColors[colorIndex],
//       sizes:
//         updatedColors[colorIndex].sizes.filter(
//           (_, index) => index !== sizeIndex
//         ),
//     };

//     onChange({
//       ...value,
//       colors: updatedColors,
//     });
//   };

//   // Update size
//   const updateSizeField = (
//     colorIndex: number,
//     sizeIndex: number,
//     field: keyof ShirtSize,
//     fieldValue: string
//   ) => {
//     const updatedColors = [...colors];

//     const updatedSizes = [
//       ...updatedColors[colorIndex].sizes,
//     ];

//     updatedSizes[sizeIndex] = {
//       ...updatedSizes[sizeIndex],
//       [field]: fieldValue,
//     };

//     updatedColors[colorIndex] = {
//       ...updatedColors[colorIndex],
//       sizes: updatedSizes,
//     };

//     onChange({
//       ...value,
//       colors: updatedColors,
//     });
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5">
//       {/* Header */}
//       <div className="mb-5">
//         <h3 className="text-base font-semibold text-slate-900">
//           Shirt Information
//         </h3>

//         <p className="mt-1 text-sm text-slate-500">
//           Add product-specific information for this shirt.
//         </p>
//       </div>

//       {/* Product Information */}
//       <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//         {/* Brand */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-slate-700">
//             Brand
//           </label>

//           <input
//             type="text"
//             value={value?.brand || ""}
//             onChange={(e) =>
//               updateField(
//                 "brand",
//                 e.target.value
//               )
//             }
//             placeholder="Enter brand"
//             className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//           />
//         </div>

//         {/* Fabric */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-slate-700">
//             Fabric
//           </label>

//           <input
//             type="text"
//             value={value?.fabric || ""}
//             onChange={(e) =>
//               updateField(
//                 "fabric",
//                 e.target.value
//               )
//             }
//             placeholder="Enter fabric"
//             className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//           />
//         </div>

//         {/* Pattern */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-slate-700">
//             Pattern
//           </label>

//           <select
//             value={value?.pattern || ""}
//             onChange={(e) =>
//               updateField(
//                 "pattern",
//                 e.target.value
//               )
//             }
//             className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//           >
//             <option value="">
//               Select pattern
//             </option>

//             <option value="Solid">
//               Solid
//             </option>

//             <option value="Printed">
//               Printed
//             </option>

//             <option value="Checked">
//               Checked
//             </option>

//             <option value="Striped">
//               Striped
//             </option>

//             <option value="Plaid">
//               Plaid
//             </option>

//             <option value="Floral">
//               Floral
//             </option>
//           </select>
//         </div>

//         {/* Fit */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-slate-700">
//             Fit
//           </label>

//           <select
//             value={value?.fit || ""}
//             onChange={(e) =>
//               updateField(
//                 "fit",
//                 e.target.value
//               )
//             }
//             className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//           >
//             <option value="">
//               Select fit
//             </option>

//             <option value="Regular">
//               Regular
//             </option>

//             <option value="Slim">
//               Slim
//             </option>

//             <option value="Relaxed">
//               Relaxed
//             </option>

//             <option value="Oversized">
//               Oversized
//             </option>
//           </select>
//         </div>

//         {/* Sleeve Type */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-slate-700">
//             Sleeve Type
//           </label>

//           <select
//             value={value?.sleeveType || ""}
//             onChange={(e) =>
//               updateField(
//                 "sleeveType",
//                 e.target.value
//               )
//             }
//             className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//           >
//             <option value="">
//               Select sleeve type
//             </option>

//             <option value="Full Sleeve">
//               Full Sleeve
//             </option>

//             <option value="Half Sleeve">
//               Half Sleeve
//             </option>

//             <option value="Short Sleeve">
//               Short Sleeve
//             </option>

//             <option value="Three Quarter Sleeve">
//               Three Quarter Sleeve
//             </option>
//           </select>
//         </div>

//         {/* Collar Type */}
//         <div>
//           <label className="mb-2 block text-sm font-medium text-slate-700">
//             Collar Type
//           </label>

//           <select
//             value={value?.collarType || ""}
//             onChange={(e) =>
//               updateField(
//                 "collarType",
//                 e.target.value
//               )
//             }
//             className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//           >
//             <option value="">
//               Select collar type
//             </option>

//             <option value="Spread Collar">
//               Spread Collar
//             </option>

//             <option value="Button Down">
//               Button Down
//             </option>

//             <option value="Mandarin Collar">
//               Mandarin Collar
//             </option>

//             <option value="Band Collar">
//               Band Collar
//             </option>

//             <option value="Polo Collar">
//               Polo Collar
//             </option>

//             <option value="Cutaway Collar">
//               Cutaway Collar
//             </option>
//           </select>
//         </div>
//       </div>

//       {/* Colors & Sizes */}
//       <div className="mt-7 border-t border-slate-200 pt-6">
//         <div className="mb-4 flex items-center justify-between">
//           <div>
//             <h4 className="text-sm font-semibold text-slate-900">
//               Colors & Sizes
//             </h4>

//             <p className="mt-1 text-xs text-slate-500">
//               Add colors, images and available sizes.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={addColor}
//             className="rounded-lg bg-[#12233F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0d1b31]"
//           >
//             + Add Color
//           </button>
//         </div>

//         <div className="space-y-5">
//           {colors.map(
//             (colorItem, colorIndex) => (
//               <div
//                 key={colorIndex}
//                 className="rounded-xl border border-slate-200 bg-slate-50 p-4"
//               >
//                 {/* Color */}
//                 <div className="flex items-end gap-3">
//                   <div className="flex-1">
//                     <label className="mb-2 block text-sm font-medium text-slate-700">
//                       Color
//                     </label>

//                     <input
//                       type="text"
//                       value={
//                         colorItem.color || ""
//                       }
//                       onChange={(e) =>
//                         updateColor(
//                           colorIndex,
//                           e.target.value
//                         )
//                       }
//                       placeholder="e.g. Black"
//                       className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       removeColor(
//                         colorIndex
//                       )
//                     }
//                     className="rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
//                   >
//                     Remove
//                   </button>
//                 </div>

//                 {/* Images */}
//                 <div className="mt-5">
//                   <ProductImageUploader label="Color Images" description=""
//                     images={
//                       Array.isArray(
//                         colorItem.images
//                       )
//                         ? colorItem.images
//                         : []
//                     }
//                     onChange={(images) =>
//                       updateColorImages(
//                         colorIndex,
//                         images
//                       )
//                     }
//                   />
//                 </div>

//                 {/* Sizes */}
//                 <div className="mt-5">
//                   <div className="mb-3 flex items-center justify-between">
//                     <label className="text-sm font-medium text-slate-700">
//                       Available Sizes
//                     </label>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         addSize(
//                           colorIndex
//                         )
//                       }
//                       disabled={
//                         colorItem.sizes
//                           .length >=
//                         AVAILABLE_SIZES.length
//                       }
//                       className="text-sm font-medium text-[#12233F] disabled:cursor-not-allowed disabled:text-slate-300"
//                     >
//                       + Add Size
//                     </button>
//                   </div>

//                   {colorItem.sizes.length >
//                   0 ? (
//                     <div className="space-y-3">
//                       {colorItem.sizes.map(
//                         (
//                           sizeItem,
//                           sizeIndex
//                         ) => (
//                           <div
//                             key={
//                               sizeIndex
//                             }
//                             className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-4"
//                           >
//                             {/* Size */}
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Size
//                               </label>

//                               <select
//                                 value={
//                                   sizeItem.size
//                                 }
//                                 onChange={(e) =>
//                                   updateSizeField(
//                                     colorIndex,
//                                     sizeIndex,
//                                     "size",
//                                     e.target
//                                       .value
//                                   )
//                                 }
//                                 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
//                               >
//                                 {AVAILABLE_SIZES.map(
//                                   (
//                                     size
//                                   ) => (
//                                     <option
//                                       key={
//                                         size
//                                       }
//                                       value={
//                                         size
//                                       }
//                                     >
//                                       {
//                                         size
//                                       }
//                                     </option>
//                                   )
//                                 )}
//                               </select>
//                             </div>

//                             {/* SKU */}
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 SKU
//                               </label>

//                               <input
//                                 type="text"
//                                 value={
//                                   sizeItem.sku ||
//                                   ""
//                                 }
//                                 onChange={(e) =>
//                                   updateSizeField(
//                                     colorIndex,
//                                     sizeIndex,
//                                     "sku",
//                                     e.target
//                                       .value
//                                   )
//                                 }
//                                 placeholder="Enter SKU"
//                                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
//                               />
//                             </div>

//                             {/* Stock */}
//                             <div>
//                               <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Stock
//                               </label>

//                               <input
//                                 type="number"
//                                 min="0"
//                                 value={
//                                   sizeItem.stock ||
//                                   ""
//                                 }
//                                 onChange={(e) =>
//                                   updateSizeField(
//                                     colorIndex,
//                                     sizeIndex,
//                                     "stock",
//                                     e.target
//                                       .value
//                                   )
//                                 }
//                                 placeholder="0"
//                                 className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
//                               />
//                             </div>

//                             {/* Remove */}
//                             <div className="flex items-end">
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   removeSize(
//                                     colorIndex,
//                                     sizeIndex
//                                   )
//                                 }
//                                 className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   ) : (
//                     <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-xs text-slate-400">
//                       No sizes added
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )
//           )}

//           {colors.length === 0 && (
//             <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400">
//               No colors added yet. Click{" "}
//               <span className="font-medium text-slate-600">
//                 + Add Color
//               </span>{" "}
//               to create variants.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import React from "react";
import {
  Plus,
  Trash2,
  Shirt as ShirtIcon,
  Palette,
  Ruler,
  Package,
  Tag,
} from "lucide-react";

import ProductImageUploader from "../../ProductImageUploader";

type ShirtSize = {
  size: string;
  sku: string;
  stock: string;
};

type ShirtColor = {
  color: string;
  images: string[];
  sizes: ShirtSize[];
};

export type ShirtData = {
  brand: string;
  fabric: string;
  pattern: string;
  fit: string;
  sleeveType: string;
  collarType: string;
  colors: ShirtColor[];
};

type ShirtProps = {
  value: ShirtData;
  onChange: (value: ShirtData) => void;
};

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

const emptyColor = (): ShirtColor => ({
  color: "",
  images: [],
  sizes: [],
});

export default function Shirt({ value, onChange }: ShirtProps) {
  const colors = Array.isArray(value?.colors) ? value.colors : [];

  const updateField = (
    field: keyof Omit<ShirtData, "colors">,
    fieldValue: string
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
      colors,
    });
  };

  const updateColorAt = (
    colorIndex: number,
    updatedColor: ShirtColor
  ) => {
    onChange({
      ...value,
      colors: colors.map((item, index) =>
        index === colorIndex ? updatedColor : item
      ),
    });
  };

  const addColor = () => {
    onChange({
      ...value,
      colors: [...colors, emptyColor()],
    });
  };

  const removeColor = (colorIndex: number) => {
    onChange({
      ...value,
      colors: colors.filter((_, index) => index !== colorIndex),
    });
  };

  const updateColor = (colorIndex: number, color: string) => {
    const current = colors[colorIndex];
    if (!current) return;

    updateColorAt(colorIndex, {
      ...current,
      color,
    });
  };

  const updateColorImages = (
    colorIndex: number,
    images: string[]
  ) => {
    const current = colors[colorIndex];
    if (!current) return;

    updateColorAt(colorIndex, {
      ...current,
      images,
    });
  };

  const addSize = (colorIndex: number) => {
    const current = colors[colorIndex];
    if (!current) return;

    const currentSizes = Array.isArray(current.sizes)
      ? current.sizes
      : [];

    const nextSize = AVAILABLE_SIZES.find(
      (size) => !currentSizes.some((item) => item.size === size)
    );

    if (!nextSize) return;

    updateColorAt(colorIndex, {
      ...current,
      sizes: [
        ...currentSizes,
        {
          size: nextSize,
          sku: "",
          stock: "",
        },
      ],
    });
  };

  const removeSize = (colorIndex: number, sizeIndex: number) => {
    const current = colors[colorIndex];
    if (!current) return;

    updateColorAt(colorIndex, {
      ...current,
      sizes: (current.sizes || []).filter(
        (_, index) => index !== sizeIndex
      ),
    });
  };

  const updateSizeField = (
    colorIndex: number,
    sizeIndex: number,
    field: keyof ShirtSize,
    fieldValue: string
  ) => {
    const current = colors[colorIndex];
    if (!current) return;

    const sizes = [...(current.sizes || [])];
    const existingSize = sizes[sizeIndex];
    if (!existingSize) return;

    // Prevent selecting the same size twice for one color.
    if (
      field === "size" &&
      sizes.some(
        (item, index) =>
          index !== sizeIndex && item.size === fieldValue
      )
    ) {
      return;
    }

    sizes[sizeIndex] = {
      ...existingSize,
      [field]: fieldValue,
    };

    updateColorAt(colorIndex, {
      ...current,
      sizes,
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#12233F] text-white">
            <ShirtIcon size={21} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#12233F]">
              Shirt Information
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Add shirt details, colors, images, sizes and stock.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        {/* General shirt details */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-800">
            <Tag size={17} className="text-[#D6A419]" />
            Basic Shirt Details
          </h4>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Brand</label>
              <input
                type="text"
                value={value?.brand || ""}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="e.g. Easy, Yellow"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Fabric</label>
              <input
                type="text"
                value={value?.fabric || ""}
                onChange={(e) => updateField("fabric", e.target.value)}
                placeholder="e.g. Cotton, Linen, Denim"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Pattern</label>
              <select
                value={value?.pattern || ""}
                onChange={(e) => updateField("pattern", e.target.value)}
                className={inputClass}
              >
                <option value="">Select pattern</option>
                <option value="Solid">Solid</option>
                <option value="Printed">Printed</option>
                <option value="Checked">Checked</option>
                <option value="Striped">Striped</option>
                <option value="Plaid">Plaid</option>
                <option value="Floral">Floral</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Fit</label>
              <select
                value={value?.fit || ""}
                onChange={(e) => updateField("fit", e.target.value)}
                className={inputClass}
              >
                <option value="">Select fit</option>
                <option value="Regular">Regular</option>
                <option value="Slim">Slim</option>
                <option value="Relaxed">Relaxed</option>
                <option value="Oversized">Oversized</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Sleeve Type</label>
              <select
                value={value?.sleeveType || ""}
                onChange={(e) =>
                  updateField("sleeveType", e.target.value)
                }
                className={inputClass}
              >
                <option value="">Select sleeve type</option>
                <option value="Full Sleeve">Full Sleeve</option>
                <option value="Half Sleeve">Half Sleeve</option>
                <option value="Short Sleeve">Short Sleeve</option>
                <option value="Three Quarter Sleeve">
                  Three Quarter Sleeve
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Collar Type</label>
              <select
                value={value?.collarType || ""}
                onChange={(e) =>
                  updateField("collarType", e.target.value)
                }
                className={inputClass}
              >
                <option value="">Select collar type</option>
                <option value="Spread Collar">Spread Collar</option>
                <option value="Button Down">Button Down</option>
                <option value="Mandarin Collar">Mandarin Collar</option>
                <option value="Band Collar">Band Collar</option>
                <option value="Polo Collar">Polo Collar</option>
                <option value="Cutaway Collar">Cutaway Collar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Color variants */}
        <div className="border-t border-slate-100 pt-6">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Palette size={19} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Colors & Images
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Each color can have its own product images and sizes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addColor}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12233F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b355c]"
            >
              <Plus size={16} />
              Add Color
            </button>
          </div>

          {colors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-9 text-center">
              <Palette size={25} className="mx-auto text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No colors added yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Add a color to configure its images, sizes and stock.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {colors.map((colorItem, colorIndex) => {
                const sizes = Array.isArray(colorItem.sizes)
                  ? colorItem.sizes
                  : [];

                return (
                  <div
                    key={colorIndex}
                    className="overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                          {colorIndex + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          Color Variant {colorIndex + 1}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeColor(colorIndex)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Remove Color
                      </button>
                    </div>

                    <div className="space-y-6 p-4">
                      {/* Color name */}
                      <div>
                        <label className={labelClass}>Color Name</label>
                        <input
                          type="text"
                          value={colorItem.color || ""}
                          onChange={(e) =>
                            updateColor(colorIndex, e.target.value)
                          }
                          placeholder="e.g. Black, Navy Blue, White"
                          className={inputClass}
                        />
                      </div>

                      {/* Images */}
                      <div>
                        <h5 className="mb-3 text-sm font-semibold text-slate-700">
                          Images for this color
                        </h5>

                        <ProductImageUploader label="Color Images" description=""
                          images={
                            Array.isArray(colorItem.images)
                              ? colorItem.images
                              : []
                          }
                          onChange={(images) =>
                            updateColorImages(colorIndex, images)
                          }
                        />
                      </div>

                      {/* Sizes and stock */}
                      <div className="border-t border-slate-100 pt-5">
                        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2">
                            <Ruler size={18} className="text-[#12233F]" />
                            <div>
                              <h5 className="text-sm font-bold text-slate-800">
                                Sizes & Inventory
                              </h5>
                              <p className="mt-1 text-xs text-slate-500">
                                Configure SKU and stock for each size.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addSize(colorIndex)}
                            disabled={
                              sizes.length >= AVAILABLE_SIZES.length
                            }
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#12233F] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={14} />
                            Add Size
                          </button>
                        </div>

                        {sizes.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center">
                            <Package
                              size={22}
                              className="mx-auto text-slate-400"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                              No sizes added for this color.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {sizes.map((sizeItem, sizeIndex) => (
                              <div
                                key={sizeIndex}
                                className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-2 xl:grid-cols-[0.8fr_1.3fr_0.8fr_auto] xl:items-end"
                              >
                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Size
                                  </label>
                                  <select
                                    value={sizeItem.size}
                                    onChange={(e) =>
                                      updateSizeField(
                                        colorIndex,
                                        sizeIndex,
                                        "size",
                                        e.target.value
                                      )
                                    }
                                    className={inputClass}
                                  >
                                    {AVAILABLE_SIZES.map((size) => (
                                      <option
                                        key={size}
                                        value={size}
                                        disabled={sizes.some(
                                          (item, index) =>
                                            index !== sizeIndex &&
                                            item.size === size
                                        )}
                                      >
                                        {size}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    SKU
                                  </label>
                                  <input
                                    type="text"
                                    value={sizeItem.sku || ""}
                                    onChange={(e) =>
                                      updateSizeField(
                                        colorIndex,
                                        sizeIndex,
                                        "sku",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g. SH-BLK-M"
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    Stock Quantity
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={sizeItem.stock || ""}
                                    onChange={(e) => {
                                      const nextValue = e.target.value;

                                      if (
                                        nextValue !== "" &&
                                        (!Number.isInteger(Number(nextValue)) ||
                                          Number(nextValue) < 0)
                                      ) {
                                        return;
                                      }

                                      updateSizeField(
                                        colorIndex,
                                        sizeIndex,
                                        "stock",
                                        nextValue
                                      );
                                    }}
                                    placeholder="e.g. 20"
                                    className={inputClass}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSize(colorIndex, sizeIndex)
                                  }
                                  aria-label={`Remove ${sizeItem.size} size`}
                                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  <Trash2 size={15} />
                                  <span className="xl:hidden">Remove Size</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
          <Package size={18} className="mt-0.5 shrink-0 text-blue-700" />
          <p className="text-xs leading-5 text-blue-900">
            প্রতিটি রঙের জন্য আলাদা ছবি ও সাইজের স্টক রাখা যাবে। SKU ও
            স্টক এখানে ভ্যারিয়েন্ট অনুযায়ী দেওয়া হবে।
          </p>
        </div>
      </div>
    </section>
  );
}
