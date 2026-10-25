import type { ProductBasicInfo } from "../components/product-placement/types";

export default function ProductInventory({
  form,
  onFieldChange,
}: {
  form: ProductBasicInfo;
  onFieldChange: (field: keyof ProductBasicInfo, value: string) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold text-slate-900">Inventory</h2>
        <p className="mt-0.5 text-[10px] text-slate-400">
          Manage your product stock
        </p>
      </div>

      <div className="p-5">
        <div className="max-w-sm">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Stock Quantity<span className="ml-1 text-rose-500">*</span>
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={form.stockQuantity}
            onChange={(e) => onFieldChange("stockQuantity", e.target.value)}
            placeholder="0"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/5"
          />
        </div>
      </div>
    </section>
  );
}
