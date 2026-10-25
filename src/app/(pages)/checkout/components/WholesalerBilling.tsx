"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  FileText,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import PaymentMethod from "./PaymentMethod";

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

type FormData = {
  businessName: string;
  contactPerson: string;
  businessPhone: string;
  tradeLicense: string;
  divisionId: string;
  districtId: string;
  upazilaId: string;
  businessAddress: string;
  postalCode: string;
};

export default function WholesalerBilling() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);

  const [loadingLocations, setLoadingLocations] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    contactPerson: "",
    businessPhone: "",
    tradeLicense: "",
    divisionId: "",
    districtId: "",
    upazilaId: "",
    businessAddress: "",
    postalCode: "",
  });

  // ================= LOAD LOCATION DATA =================

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        setLoadingLocations(true);

        const [
          divisionsResponse,
          districtsResponse,
          upazilasResponse,
        ] = await Promise.all([
          fetch("/Data/divisions.json"),
          fetch("/Data/districts.json"),
          fetch("/Data/upazilas.json"),
        ]);

        if (
          !divisionsResponse.ok ||
          !districtsResponse.ok ||
          !upazilasResponse.ok
        ) {
          throw new Error("Failed to load location data");
        }

        const [
          divisionsData,
          districtsData,
          upazilasData,
        ] = await Promise.all([
          divisionsResponse.json(),
          districtsResponse.json(),
          upazilasResponse.json(),
        ]);

        setDivisions(divisionsData);
        setDistricts(districtsData);
        setUpazilas(upazilasData);
      } catch (error) {
        console.error("WHOLESALER LOCATION DATA ERROR:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocationData();
  }, []);

  // ================= FILTER DATA =================

  const filteredDistricts = districts.filter(
    (district) =>
      district.division_id === formData.divisionId
  );

  const filteredUpazilas = upazilas.filter(
    (upazila) =>
      upazila.district_id === formData.districtId
  );

  // ================= INPUT CHANGE =================

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ================= DIVISION CHANGE =================

  const handleDivisionChange = (divisionId: string) => {
    setFormData((current) => ({
      ...current,
      divisionId,
      districtId: "",
      upazilaId: "",
    }));
  };

  // ================= DISTRICT CHANGE =================

  const handleDistrictChange = (districtId: string) => {
    setFormData((current) => ({
      ...current,
      districtId,
      upazilaId: "",
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const selectedDivision = divisions.find(
      (division) =>
        division.id === formData.divisionId
    );

    const selectedDistrict = districts.find(
      (district) =>
        district.id === formData.districtId
    );

    const selectedUpazila = upazilas.find(
      (upazila) =>
        upazila.id === formData.upazilaId
    );

    const wholesaleCheckoutData = {
      business: {
        businessName: formData.businessName,
        contactPerson: formData.contactPerson,
        businessPhone: formData.businessPhone,
        tradeLicense: formData.tradeLicense,
      },

      deliveryAddress: {
        division: {
          id: selectedDivision?.id || "",
          name: selectedDivision?.name || "",
          bn_name: selectedDivision?.bn_name || "",
        },

        district: {
          id: selectedDistrict?.id || "",
          name: selectedDistrict?.name || "",
          bn_name: selectedDistrict?.bn_name || "",
        },

        upazila: {
          id: selectedUpazila?.id || "",
          name: selectedUpazila?.name || "",
          bn_name: selectedUpazila?.bn_name || "",
        },

        fullAddress: formData.businessAddress,
        postalCode: formData.postalCode,
      },

      orderInformation: {
        orderType: "Wholesale",
        minimumOrderQuantity: "As per product MOQ",
        pricing: "Wholesale Pricing",
        paymentTerms: "According to seller terms",
      },
    };

    console.log(
      "================================="
    );
    console.log(
      "WHOLESALER CHECKOUT FORM DATA"
    );
    console.log(
      "================================="
    );
    console.log(wholesaleCheckoutData);
    console.log(
      "================================="
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ================= BUSINESS INFORMATION ================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#12233f]">
            Wholesale Business Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Provide your business information for
            wholesale orders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Business / Company Name"
            placeholder="Your company name"
            icon={<Building2 size={17} />}
            value={formData.businessName}
            onChange={(value) =>
              handleInputChange(
                "businessName",
                value
              )
            }
          />

          <Input
            label="Contact Person"
            placeholder="Contact person name"
            icon={<User size={17} />}
            value={formData.contactPerson}
            onChange={(value) =>
              handleInputChange(
                "contactPerson",
                value
              )
            }
          />

          <Input
            label="Business Phone"
            placeholder="01XXXXXXXXX"
            type="tel"
            icon={<Phone size={17} />}
            value={formData.businessPhone}
            onChange={(value) =>
              handleInputChange(
                "businessPhone",
                value
              )
            }
          />

          <Input
            label="Trade License Number"
            placeholder="Optional"
            icon={<FileText size={17} />}
            value={formData.tradeLicense}
            onChange={(value) =>
              handleInputChange(
                "tradeLicense",
                value
              )
            }
          />
        </div>
      </section>

      {/* ================= BUSINESS ADDRESS ================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <MapPin size={19} />
          </div>

          <div>
            <h2 className="font-bold text-[#12233f]">
              Business / Delivery Address
            </h2>

            <p className="text-sm text-slate-500">
              Address where the wholesale order will
              be delivered.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Division + District */}

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectInput
              label="Division"
              placeholder={
                loadingLocations
                  ? "Loading divisions..."
                  : "Select Division"
              }
              value={formData.divisionId}
              onChange={handleDivisionChange}
              options={divisions.map(
                (division) => ({
                  value: division.id,
                  label: division.name,
                })
              )}
              disabled={loadingLocations}
            />

            <SelectInput
              label="District"
              placeholder={
                !formData.divisionId
                  ? "Select Division First"
                  : "Select District"
              }
              value={formData.districtId}
              onChange={handleDistrictChange}
              options={filteredDistricts.map(
                (district) => ({
                  value: district.id,
                  label: district.name,
                })
              )}
              disabled={
                loadingLocations ||
                !formData.divisionId
              }
            />
          </div>

          {/* Thana / Upazila */}

          <SelectInput
            label="Thana / Upazila"
            placeholder={
              !formData.districtId
                ? "Select District First"
                : "Select Thana / Upazila"
            }
            value={formData.upazilaId}
            onChange={(value) =>
              handleInputChange(
                "upazilaId",
                value
              )
            }
            options={filteredUpazilas.map(
              (upazila) => ({
                value: upazila.id,
                label: upazila.name,
              })
            )}
            disabled={
              loadingLocations ||
              !formData.districtId
            }
          />

          {/* Full Address */}

          <TextAreaInput
            label="Full Address"
            placeholder="Shop / Warehouse / Office address"
            value={formData.businessAddress}
            onChange={(value) =>
              handleInputChange(
                "businessAddress",
                value
              )
            }
          />

          {/* Postal Code */}

          <Input
            label="Postal Code"
            placeholder="Enter postal code"
            value={formData.postalCode}
            onChange={(value) =>
              handleInputChange(
                "postalCode",
                value
              )
            }
          />
        </div>
      </section>

      {/* ================= WHOLESALE ORDER INFORMATION ================= */}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="font-bold text-[#12233f]">
          Wholesale Order Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Info
            label="Order Type"
            value="Wholesale"
          />

          <Info
            label="Minimum Order Quantity"
            value="As per product MOQ"
          />

          <Info
            label="Pricing"
            value="Wholesale Pricing"
          />

          <Info
            label="Payment Terms"
            value="According to seller terms"
          />
        </div>
      </section>

      <PaymentMethod />

      {/* ================= SAVE ================= */}

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-[#12233f] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
        >
          Save & Continue
        </button>
      </div>
    </form>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

/* ================= SELECT ================= */

function SelectInput({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all duration-200 hover:border-slate-400 focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================= TEXTAREA ================= */

function TextAreaInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        rows={3}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#f59e0b] focus:ring-4 focus:ring-amber-50"
      />
    </div>
  );
}

/* ================= INFO ================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}