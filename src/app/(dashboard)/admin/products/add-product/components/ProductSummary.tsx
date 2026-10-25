import { Package } from "lucide-react";
import type { DemoCategory, ProductBasicInfo, ProductFieldDefinition, ProductPlacement } from "../components/product-placement/types";
import { PLACEMENT_OPTIONS } from "../placement-config";


export default function ProductSummary({
  form,
  selectedCategory,
  customFields,
  selectedPlacements,
}: {
  form: ProductBasicInfo;
  selectedCategory?: DemoCategory;
  customFields: ProductFieldDefinition[];
  selectedPlacements: ProductPlacement[];
}) {
  return (
    <div>
      <div className="sticky top-6 rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Package size={16} className="text-[#12233F]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Product Summary</h2>
              <p className="text-[10px] text-slate-400">Preview of basic information</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Product</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {form.title || "Untitled Product"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Category</p>
            <p className="mt-1 text-xs font-medium text-slate-700">
              {selectedCategory?.name || "No category selected"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Short Description</p>
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
              {form.shortDescription || "No short description"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Custom Fields</p>
            <p className="mt-1 text-xs font-medium text-slate-700">
              {customFields.length} field{customFields.length !== 1 ? "s" : ""} added
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Placements</p>
            {selectedPlacements.length === 0 ? (
              <p className="mt-1 text-xs font-medium text-slate-500">No placement selected</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedPlacements.map((placement) => {
                  const item = PLACEMENT_OPTIONS.find((option) => option.id === placement);
                  return (
                    <span
                      key={placement}
                      className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-700"
                    >
                      {item?.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Regular Price</p>
              <p className="mt-1 text-xs font-semibold text-slate-800">
                {form.customerRegularPrice ? `৳${form.customerRegularPrice}` : "৳0.00"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Sale Price</p>
              <p className="mt-1 text-xs font-semibold text-slate-800">
                {form.customerSalePrice ? `৳${form.customerSalePrice}` : "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Stock</p>
            <p className="mt-1 text-xs font-semibold text-slate-800">
              {form.stockQuantity || "0"} units
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
