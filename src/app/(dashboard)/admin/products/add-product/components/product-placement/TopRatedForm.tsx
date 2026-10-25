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
          Review information will be calculated from the review system.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Review Snippet
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
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-900"
        />
      </div>
    </div>
  );
}