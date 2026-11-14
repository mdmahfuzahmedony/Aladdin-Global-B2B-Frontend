"use client";

import type { TopRatedData } from "./types";

type Props = {
  value: TopRatedData;
  onChange: (value: TopRatedData) => void;
};

export default function TopRatedForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50/40 p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Top Rated Information
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Review information will be calculated from customer reviews, or you can optionally set initial values below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Average Rating (Optional, 0 - 5)
          </label>

          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={value.averageRating}
            onChange={(e) =>
              onChange({
                ...value,
                averageRating: e.target.value,
              })
            }
            placeholder="e.g. 4.8"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Total Reviews (Optional)
          </label>

          <input
            type="number"
            min="0"
            value={value.totalReviews}
            onChange={(e) =>
              onChange({
                ...value,
                totalReviews: e.target.value,
              })
            }
            placeholder="e.g. 120"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Review Snippet (Optional)
          </label>

          <textarea
            value={value.reviewSnippet}
            onChange={(e) =>
              onChange({
                ...value,
                reviewSnippet: e.target.value,
              })
            }
            placeholder="Excellent quality and very comfortable."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>
    </div>
  );
}