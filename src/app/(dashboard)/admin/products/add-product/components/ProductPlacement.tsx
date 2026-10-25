"use client";

import type {
  ProductPlacement,
  NewArrivalData,
  FlashSaleData,
  FeaturedData,
  TopSellerData,
  TopRatedData,
  TrustedData,
} from "./product-placement/types";

import NewArrivalForm from "./product-placement/NewArrivalForm";
import FlashSaleForm from "./product-placement/FlashSaleForm";
import FeaturedForm from "./product-placement/FeaturedForm";
import TopSellerForm from "./product-placement/TopSellerForm";
import TopRatedForm from "./product-placement/TopRatedForm";
import TrustedForm from "./product-placement/TrustedForm";


type ProductPlacementProps = {
  selectedPlacements: ProductPlacement[];

  onTogglePlacement: (
    placement: ProductPlacement
  ) => void;

  newArrival: NewArrivalData;
  setNewArrival: (
    value: NewArrivalData
  ) => void;

  flashSale: FlashSaleData;
  setFlashSale: (
    value: FlashSaleData
  ) => void;

  featured: FeaturedData;
  setFeatured: (
    value: FeaturedData
  ) => void;

  topSeller: TopSellerData;
  setTopSeller: (
    value: TopSellerData
  ) => void;

  topRated: TopRatedData;
  setTopRated: (
    value: TopRatedData
  ) => void;

  trusted: TrustedData;
  setTrusted: (
    value: TrustedData
  ) => void;
};

export default function ProductPlacement({
  selectedPlacements,
  onTogglePlacement,

  newArrival,
  setNewArrival,

  flashSale,
  setFlashSale,

  featured,
  setFeatured,

  topSeller,
  setTopSeller,

  topRated,
  setTopRated,

  trusted,
  setTrusted,
}: ProductPlacementProps) {
  const isSelected = (
    placement: ProductPlacement
  ) => {
    return selectedPlacements.includes(
      placement
    );
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-bold text-slate-900">
          Product Placement
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          Select where this product should appear.
        </p>
      </div>

      {/* Placement Options */}
      <div className="space-y-3 p-5">

        {/* =========================================
            NEW ARRIVAL
        ========================================= */}

        <div className="rounded-lg border border-slate-200">
          <label className="flex cursor-pointer items-center gap-3 p-4">
            <input
              type="checkbox"
              checked={isSelected(
                "NEW_ARRIVAL"
              )}
              onChange={() =>
                onTogglePlacement(
                  "NEW_ARRIVAL"
                )
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                New Arrival
              </p>

              <p className="text-[11px] text-slate-400">
                Add this product to new arrivals.
              </p>
            </div>
          </label>

          {isSelected(
            "NEW_ARRIVAL"
          ) && (
            <div className="border-t border-slate-100 p-4">
              <NewArrivalForm
                value={newArrival}
                onChange={setNewArrival}
              />
            </div>
          )}
        </div>

        {/* =========================================
            FLASH SALE
        ========================================= */}

        <div className="rounded-lg border border-slate-200">
          <label className="flex cursor-pointer items-center gap-3 p-4">
            <input
              type="checkbox"
              checked={isSelected(
                "FLASH_SALE"
              )}
              onChange={() =>
                onTogglePlacement(
                  "FLASH_SALE"
                )
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Flash Sale
              </p>

              <p className="text-[11px] text-slate-400">
                Configure flash sale information.
              </p>
            </div>
          </label>

          {isSelected(
            "FLASH_SALE"
          ) && (
            <div className="border-t border-slate-100 p-4">
              <FlashSaleForm
                value={flashSale}
                onChange={setFlashSale}
              />
            </div>
          )}
        </div>

        {/* =========================================
            FEATURED
        ========================================= */}

        <div className="rounded-lg border border-slate-200">
          <label className="flex cursor-pointer items-center gap-3 p-4">
            <input
              type="checkbox"
              checked={isSelected(
                "FEATURED"
              )}
              onChange={() =>
                onTogglePlacement(
                  "FEATURED"
                )
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Featured
              </p>

              <p className="text-[11px] text-slate-400">
                Configure featured product information.
              </p>
            </div>
          </label>

          {isSelected(
            "FEATURED"
          ) && (
            <div className="border-t border-slate-100 p-4">
              <FeaturedForm
                value={featured}
                onChange={setFeatured}
              />
            </div>
          )}
        </div>

        {/* =========================================
            TOP SELLER
        ========================================= */}

        <div className="rounded-lg border border-slate-200">
          <label className="flex cursor-pointer items-center gap-3 p-4">
            <input
              type="checkbox"
              checked={isSelected(
                "TOP_SELLER"
              )}
              onChange={() =>
                onTogglePlacement(
                  "TOP_SELLER"
                )
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Top Seller
              </p>

              <p className="text-[11px] text-slate-400">
                Configure top seller information.
              </p>
            </div>
          </label>

          {isSelected(
            "TOP_SELLER"
          ) && (
            <div className="border-t border-slate-100 p-4">
              <TopSellerForm
                value={topSeller}
                onChange={setTopSeller}
              />
            </div>
          )}
        </div>

        {/* =========================================
            TOP RATED
        ========================================= */}

        <div className="rounded-lg border border-slate-200">
          <label className="flex cursor-pointer items-center gap-3 p-4">
            <input
              type="checkbox"
              checked={isSelected(
                "TOP_RATED"
              )}
              onChange={() =>
                onTogglePlacement(
                  "TOP_RATED"
                )
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Top Rated
              </p>

              <p className="text-[11px] text-slate-400">
                Configure top rated information.
              </p>
            </div>
          </label>

          {isSelected(
            "TOP_RATED"
          ) && (
            <div className="border-t border-slate-100 p-4">
              <TopRatedForm
                value={topRated}
                onChange={setTopRated}
              />
            </div>
          )}
        </div>

        {/* =========================================
            TRUSTED
        ========================================= */}

        <div className="rounded-lg border border-slate-200">
          <label className="flex cursor-pointer items-center gap-3 p-4">
            <input
              type="checkbox"
              checked={isSelected(
                "TRUSTED"
              )}
              onChange={() =>
                onTogglePlacement(
                  "TRUSTED"
                )
              }
              className="h-4 w-4"
            />

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Trusted
              </p>

              <p className="text-[11px] text-slate-400">
                Configure trusted product information.
              </p>
            </div>
          </label>

          {isSelected(
            "TRUSTED"
          ) && (
            <div className="border-t border-slate-100 p-4">
              <TrustedForm
                value={trusted}
                onChange={setTrusted}
              />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}