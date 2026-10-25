import type { ProductBasicInfo } from "../components/product-placement/types";

type ProductOwnershipType =
  | "MY_STORE"
  | "SELLER_PRODUCT";

/* =========================================================
   PRICE INPUT
========================================================= */

function PriceInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-rose-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          ৳
        </span>

        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="0.00"
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/5"
        />
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT PRICING
========================================================= */

export default function ProductPricing({
  form,
  onFieldChange,
  ownershipType = "SELLER_PRODUCT",
}: {
  form: ProductBasicInfo;

  onFieldChange: (
    field: keyof ProductBasicInfo,
    value: string,
  ) => void;

  ownershipType?: ProductOwnershipType;
}) {
  const isMyStore =
    ownershipType === "MY_STORE";

  const isSellerProduct =
    ownershipType === "SELLER_PRODUCT";

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold text-slate-900">
          Pricing
        </h2>

        <p className="mt-0.5 text-[10px] text-slate-400">
          Set pricing for different customer and business types
        </p>
      </div>

      <div className="space-y-6 p-5">
        {/* ===================================================
            PURCHASE / COST PRICE
            BOTH MY STORE + SELLER PRODUCT
        =================================================== */}

        <div>
          <div className="mb-3">
            <h3 className="text-xs font-bold text-slate-800">
              Purchase / Cost Price
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Internal purchase cost for accounting
            </p>
          </div>

          <div className="max-w-sm">
            <PriceInput
              label="Purchase Price"
              required
              value={form.purchasePrice}
              onChange={(value) =>
                onFieldChange(
                  "purchasePrice",
                  value,
                )
              }
            />
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* ===================================================
            REGULAR CUSTOMER
            BOTH MY STORE + SELLER PRODUCT
        =================================================== */}

        <div>
          <div className="mb-3">
            <h3 className="text-xs font-bold text-slate-800">
              Regular Customer
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Standard customer pricing
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PriceInput
              label="Regular Price"
              required
              value={
                form.customerRegularPrice
              }
              onChange={(value) =>
                onFieldChange(
                  "customerRegularPrice",
                  value,
                )
              }
            />

            <PriceInput
              label="Sale Price"
              value={
                form.customerSalePrice
              }
              onChange={(value) =>
                onFieldChange(
                  "customerSalePrice",
                  value,
                )
              }
            />
          </div>
        </div>

        {/* ===================================================
            MY STORE ONLY
            WHOLESALER
        =================================================== */}

        {isMyStore && (
          <>
            <div className="border-t border-slate-100" />

            <div>
              <div className="mb-3">
                <h3 className="text-xs font-bold text-slate-800">
                  Wholesaler
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Wholesale pricing for bulk buyers
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PriceInput
                  label="Regular Price"
                  value={
                    form.wholesalerRegularPrice
                  }
                  onChange={(value) =>
                    onFieldChange(
                      "wholesalerRegularPrice",
                      value,
                    )
                  }
                />

                <PriceInput
                  label="Sale Price"
                  value={
                    form.wholesalerSalePrice
                  }
                  onChange={(value) =>
                    onFieldChange(
                      "wholesalerSalePrice",
                      value,
                    )
                  }
                />
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* =================================================
                DROPSHIPPING
                MY STORE ONLY
            ================================================= */}

            <div>
              <div className="mb-3">
                <h3 className="text-xs font-bold text-slate-800">
                  Dropshipping
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Set the base price for dropshippers
                </p>
              </div>

              <div className="max-w-sm">
                <PriceInput
                  label="Dropship Price"
                  value={
                    form.dropshipPrice
                  }
                  onChange={(value) =>
                    onFieldChange(
                      "dropshipPrice",
                      value,
                    )
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* ===================================================
            AFFILIATE
            BOTH MY STORE + SELLER PRODUCT
        =================================================== */}

        <div className="border-t border-slate-100" />

        <div>
          <div className="mb-3">
            <h3 className="text-xs font-bold text-slate-800">
              Affiliate
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Configure affiliate commission
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* =================================================
                COMMISSION TYPE
            ================================================= */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Commission Type
              </label>

              <select
                value={
                  form.affiliateCommissionType
                }
                onChange={(e) =>
                  onFieldChange(
                    "affiliateCommissionType",
                    e.target.value,
                  )
                }
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/5"
              >
                <option value="">
                  Select type
                </option>

                <option value="PERCENTAGE">
                  Percentage
                </option>

                <option value="FIXED">
                  Fixed
                </option>
              </select>
            </div>

            {/* =================================================
                COMMISSION VALUE
            ================================================= */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Commission
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  {form.affiliateCommissionType ===
                  "PERCENTAGE"
                    ? "%"
                    : "৳"}
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.affiliateCommissionValue
                  }
                  onChange={(e) =>
                    onFieldChange(
                      "affiliateCommissionValue",
                      e.target.value,
                    )
                  }
                  placeholder="0.00"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-7 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#12233F] focus:ring-2 focus:ring-[#12233F]/5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}