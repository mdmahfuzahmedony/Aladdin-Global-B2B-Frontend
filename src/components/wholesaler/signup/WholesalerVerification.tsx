"use client";

import { WholesalerSignupData } from "@/app/(auth)/wholesaler-signup/types/wholesaler";


type Props = {
  data: WholesalerSignupData;
  updateData: (
    data: Partial<WholesalerSignupData>
  ) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function WholesalerVerification({
  data,
  updateData,
  onNext,
  onBack,
}: Props) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Business Verification
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Provide your business verification
          information.
        </p>
      </div>

      <div className="space-y-5">

        {/* TRADE LICENSE */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Trade License Number
          </label>

          <input
            type="text"
            value={
              data.tradeLicenseNumber
            }
            onChange={(e) =>
              updateData({
                tradeLicenseNumber:
                  e.target.value,
              })
            }
            placeholder="Enter trade license number"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#12233F]"
          />

          <p className="mt-2 text-xs text-slate-400">
            You can provide this information if
            available.
          </p>
        </div>

        {/* DOCUMENT */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Trade License Document
          </label>

          <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
            <p className="text-sm font-semibold text-slate-600">
              Upload your trade license
            </p>

            <p className="mt-1 text-xs text-slate-400">
              PDF, JPG or PNG
            </p>

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-4 w-full text-sm"
              onChange={(e) => {
                const file =
                  e.target.files?.[0];

                if (file) {
                  updateData({
                    tradeLicenseDocumentUrl:
                      file.name,
                  });
                }
              }}
            />

            {data.tradeLicenseDocumentUrl && (
              <p className="mt-3 text-xs text-green-600">
                Selected:{" "}
                {
                  data.tradeLicenseDocumentUrl
                }
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#12233F] px-7 py-3 text-sm font-bold text-white hover:bg-[#1c355b]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}