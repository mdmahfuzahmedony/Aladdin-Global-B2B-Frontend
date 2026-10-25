"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowRight, X } from "lucide-react";
import { createClient } from "../../../../lib/supabase-client";

const supabase = createClient();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

type LocationItem = {
  id: string | number;
  name: string;
  division_id?: string | number;
  district_id?: string | number;
};

type LocationModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onDismiss?: () => void | Promise<void>;
  onSaved?: () => void;
};

export default function LocationModal({
  isOpen,
  onClose,
  onDismiss,
  onSaved,
}: LocationModalProps) {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");

  const [divisions, setDivisions] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [upazilas, setUpazilas] = useState<LocationItem[]>([]);

  const [loadingLocationData, setLoadingLocationData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [error, setError] = useState("");

  // Load location JSON
  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    async function loadLocationData() {
      try {
        setLoadingLocationData(true);
        setError("");

        const [divisionsResponse, districtsResponse, upazilasResponse] =
          await Promise.all([
            fetch("/Data/divisions.json"),
            fetch("/Data/districts.json"),
            fetch("/Data/upazilas.json"),
          ]);

        if (
          !divisionsResponse.ok ||
          !districtsResponse.ok ||
          !upazilasResponse.ok
        ) {
          throw new Error("লোকেশন ডাটা লোড করা যায়নি।");
        }

        const [divisionsData, districtsData, upazilasData] = await Promise.all([
          divisionsResponse.json(),
          districtsResponse.json(),
          upazilasResponse.json(),
        ]);

        if (!active) return;

        setDivisions(
          Array.isArray(divisionsData)
            ? divisionsData
            : divisionsData?.data || [],
        );

        setDistricts(
          Array.isArray(districtsData)
            ? districtsData
            : districtsData?.data || [],
        );

        setUpazilas(
          Array.isArray(upazilasData) ? upazilasData : upazilasData?.data || [],
        );
      } catch (err) {
        console.error("Location JSON load error:", err);

        if (active) {
          setError(
            err instanceof Error ? err.message : "লোকেশন ডাটা লোড করা যায়নি।",
          );
        }
      } finally {
        if (active) setLoadingLocationData(false);
      }
    }

    loadLocationData();

    return () => {
      active = false;
    };
  }, [isOpen]);

  // Filter districts by division
  const filteredDistricts = districts.filter(
    (item) => String(item.division_id) === String(division),
  );

  // Filter upazilas by district
  const filteredUpazilas = upazilas.filter(
    (item) => String(item.district_id) === String(district),
  );

  function handleDivisionChange(value: string) {
    setDivision(value);
    setDistrict("");
    setUpazila("");
  }

  function handleDistrictChange(value: string) {
    setDistrict(value);
    setUpazila("");
  }

  // Save customer location
  async function handleSaveLocation() {
    setError("");

    if (!division || !district || !upazila) {
      setError("Division, District এবং Upazila নির্বাচন করুন।");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Session পাওয়া যায়নি। আবার login করুন।");
      }

      const response = await fetch(`${API_URL}/api/customers/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          division,
          district,
          upazila,
          area: area.trim(),
          address: address.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Location save করা যায়নি।",
        );
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Save customer location error:", err);

      setError(
        err instanceof Error ? err.message : "Location save করা যায়নি।",
      );
    } finally {
      setSaving(false);
    }
  }

  // Dismiss modal
  async function handleDismiss() {
    if (saving || dismissing) return;

    setError("");

    if (!onDismiss) {
      onClose?.();
      return;
    }

    try {
      setDismissing(true);
      await onDismiss();
    } catch (err) {
      console.error("Dismiss location reminder error:", err);

      setError(
        err instanceof Error ? err.message : "Reminder dismiss করা যায়নি।",
      );
    } finally {
      setDismissing(false);
    }
  }

  if (!isOpen) return null;

  const formDisabled = saving || dismissing;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <MapPin size={22} />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-[#12233F]">
                Select Your Location
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                আপনার delivery location নির্বাচন করুন
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={handleDismiss}
              disabled={formDisabled}
              aria-label="Close location modal"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="min-h-0 overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <div className="flex gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-amber-600" />

              <p className="text-xs leading-5 text-amber-800">
                আপনার location দিলে আপনার এলাকার জন্য উপযুক্ত products, sellers
                এবং delivery options নির্ধারণ করা সহজ হবে।
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-600"
            >
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {/* Division */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Division <span className="text-rose-500">*</span>
              </label>

              <select
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                disabled={loadingLocationData || formDisabled}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-amber-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {loadingLocationData
                    ? "Loading divisions..."
                    : "Select Division"}
                </option>

                {divisions.map((item) => (
                  <option key={String(item.id)} value={String(item.id)}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                District <span className="text-rose-500">*</span>
              </label>

              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!division || loadingLocationData || formDisabled}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-amber-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {!division ? "Select Division First" : "Select District"}
                </option>

                {filteredDistricts.map((item) => (
                  <option key={String(item.id)} value={String(item.id)}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Upazila <span className="text-rose-500">*</span>
              </label>

              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                disabled={!district || loadingLocationData || formDisabled}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-amber-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {!district ? "Select District First" : "Select Upazila"}
                </option>

                {filteredUpazilas.map((item) => (
                  <option key={String(item.id)} value={String(item.id)}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Area{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </label>

              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Your area / locality"
                disabled={formDisabled}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white disabled:opacity-60"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Full Address{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, road, landmark..."
                rows={3}
                disabled={formDisabled}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleSaveLocation}
            disabled={saving || dismissing || loadingLocationData}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Location..." : "Save Location"}

            {!saving && <ArrowRight size={17} />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={handleDismiss}
              disabled={formDisabled}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={14} />
              {dismissing ? "Please wait..." : "Maybe Later"}
            </button>
          )}

          <p className="mt-2 text-center text-[10px] leading-4 text-slate-400">
            You can update your location later from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
