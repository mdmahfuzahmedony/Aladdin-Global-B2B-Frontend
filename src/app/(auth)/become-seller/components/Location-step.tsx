"use client";


import { useEffect, useMemo, useState } from "react";

export type LocationData = {
  division: string;
  district: string;
  upazila: string;
  area: string;
  fullAddress: string;
};

type Props = {
  data: LocationData;
  onChange: (data: LocationData) => void;
};

type Division = {
  id: string;
  name: string;
  bn_name: string;
  url?: string;
};

type District = {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
  url?: string;
};

type Upazila = {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
  url?: string;
};

export function LocationStep({ data, onChange }: Props) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadLocationData() {
      try {
        setLoading(true);
        setLoadError("");

        const [divisionRes, districtRes, upazilaRes] =
          await Promise.all([
            fetch("/Data/divisions.json"),
            fetch("/Data/districts.json"),
            fetch("/Data/upazilas.json"),
          ]);

        if (
          !divisionRes.ok ||
          !districtRes.ok ||
          !upazilaRes.ok
        ) {
          throw new Error("Could not load location data.");
        }

        const [divisionData, districtData, upazilaData] =
          await Promise.all([
            divisionRes.json(),
            districtRes.json(),
            upazilaRes.json(),
          ]);

        setDivisions(divisionData);
        setDistricts(districtData);
        setUpazilas(upazilaData);
      } catch (error) {
        console.error("Location data loading error:", error);
        setLoadError(
          "Location data load kora jayni. Please refresh the page.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadLocationData();
  }, []);

  const selectedDivision = useMemo(
    () => divisions.find((item) => item.name === data.division),
    [divisions, data.division],
  );

  const selectedDistrict = useMemo(
    () => districts.find((item) => item.name === data.district),
    [districts, data.district],
  );

  const filteredDistricts = useMemo(() => {
    if (!selectedDivision) return [];

    return districts.filter(
      (item) => item.division_id === selectedDivision.id,
    );
  }, [districts, selectedDivision]);

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];

    return upazilas.filter(
      (item) => item.district_id === selectedDistrict.id,
    );
  }, [upazilas, selectedDistrict]);

  const updateField = (
    field: keyof LocationData,
    value: string,
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleDivisionChange = (value: string) => {
    onChange({
      ...data,
      division: value,
      district: "",
      upazila: "",
    });
  };

  const handleDistrictChange = (value: string) => {
    onChange({
      ...data,
      district: value,
      upazila: "",
    });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-[14px] outline-none transition focus:border-[#D6A419] focus:ring-1 focus:ring-[#D6A419] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";

  const labelClass =
    "mb-1.5 block text-[13px] font-medium text-slate-700";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Store Location
        </h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Select your store location and provide your full
          business address.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">
          Loading location data...
        </p>
      )}

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
          {loadError}
        </div>
      )}

      <div>
        <label className={labelClass}>Division</label>
        <select
          value={data.division}
          onChange={(e) => handleDivisionChange(e.target.value)}
          disabled={loading || !!loadError}
          className={inputClass}
        >
          <option value="">Select your division</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.name}>
              {division.name} ({division.bn_name})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>District</label>
          <select
            value={data.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!data.division || loading || !!loadError}
            className={inputClass}
          >
            <option value="">Select your district</option>
            {filteredDistricts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name} ({district.bn_name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Upazila</label>
          <select
            value={data.upazila}
            onChange={(e) => updateField("upazila", e.target.value)}
            disabled={!data.district || loading || !!loadError}
            className={inputClass}
          >
            <option value="">Select your upazila</option>
            {filteredUpazilas.map((upazila) => (
              <option key={upazila.id} value={upazila.name}>
                {upazila.name} ({upazila.bn_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Area / Village / Street
        </label>
        <input
          type="text"
          value={data.area}
          onChange={(e) => updateField("area", e.target.value)}
          placeholder="e.g., Chanchra, Rail Road"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Full Business Address
        </label>
        <textarea
          value={data.fullAddress}
          onChange={(e) =>
            updateField("fullAddress", e.target.value)
          }
          rows={3}
          placeholder="House, road, market, landmark, and other address details"
          className={inputClass}
        />
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-[12px] leading-5 text-amber-800">
          Please provide your correct store location so customers
          can identify where your business is located.
        </p>
      </div>
    </div>
  );
}