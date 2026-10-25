"use client";

import { Percent, Save, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CommissionConfig() {
  const [defaultRate, setDefaultRate] = useState("5");
  const [category, setCategory] = useState("Electronics");
  const [categoryRate, setCategoryRate] = useState("6");

  const handleSave = () => {
    toast.success("Commission settings saved successfully!");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Settings2 size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#12233F]">
            Commission Configuration
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Platform কত শতাংশ commission নেবে তা configure করুন।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Default Platform Commission
          </label>

          <div className="relative">
            <input
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              type="number"
              min="0"
              max="100"
              className="h-11 w-full rounded-lg border border-slate-200 px-4 pr-10 text-sm outline-none focus:border-[#12233F]"
            />

            <Percent
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <p className="mt-1 text-xs text-slate-400">
            নতুন vendor/category-এর default commission rate
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Commission
          </label>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none"
            >
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Grocery</option>
              <option>Beauty</option>
              <option>Home & Living</option>
            </select>

            <div className="relative w-28">
              <input
                value={categoryRate}
                onChange={(e) => setCategoryRate(e.target.value)}
                type="number"
                min="0"
                max="100"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-8 text-sm outline-none"
              />

              <Percent
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[#12233F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a3157]"
        >
          <Save size={16} />
          Save Commission Settings
        </button>
      </div>
    </section>
  );
}