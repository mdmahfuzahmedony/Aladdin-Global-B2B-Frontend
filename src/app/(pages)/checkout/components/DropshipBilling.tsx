"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Package,
  Phone,
  Store,
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
  storeName: string;
  contactPerson: string;
  phone: string;
  orderReference: string;

  recipientName: string;
  recipientPhone: string;

  divisionId: string;
  districtId: string;
  upazilaId: string;
  fullAddress: string;
  postalCode: string;
};

export default function DropshipBilling() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);

  const [loadingLocations, setLoadingLocations] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    storeName: "",
    contactPerson: "",
    phone: "",
    orderReference: "",

    recipientName: "",
    recipientPhone: "",

    divisionId: "",
    districtId: "",
    upazilaId: "",
    fullAddress: "",
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
        console.error(
          "DROPSHIP LOCATION DATA ERROR:",
          error
        );
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

    const dropshipCheckoutData = {
      dropshipper: {
        storeName: formData.storeName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        orderReference: formData.orderReference,
      },

      recipient: {
        name: formData.recipientName,
        phone: formData.recipientPhone,
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

        fullAddress: formData.fullAddress,
        postalCode: formData.postalCode,
      },

      fulfillment: {
        type: "Dropship",
        supplierShipsDirectly: true,
      },
    };

    console.log(
      "================================="
    );
    console.log(
      "DROPSHIP CHECKOUT FORM DATA"
    );
    console.log(
      "================================="
    );
    console.log(dropshipCheckoutData);
    console.log(
      "================================="
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ================= DROPSHIPPER INFORMATION ================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Store size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#12233f]">
              Dropshipper Information
            </h2>

            <p className="text-sm text-slate-500">
              Your dropshipping business information.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Store / Business Name"
            placeholder="Your store name"
            icon={<Store size={17} />}
            value={formData.storeName}
            onChange={(value) =>
              handleInputChange(
                "storeName",
                value
              )
            }
          />

          <Input
            label="Contact Person"
            placeholder="Your name"
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
            label="Phone Number"
            placeholder="01XXXXXXXXX"
            type="tel"
            icon={<Phone size={17} />}
            value={formData.phone}
            onChange={(value) =>
              handleInputChange(
                "phone",
                value
              )
            }
          />

          <Input
            label="Order Reference"
            placeholder="Optional order reference"
            value={formData.orderReference}
            onChange={(value) =>
              handleInputChange(
                "orderReference",
                value
              )
            }
          />
        </div>
      </section>

      {/* ================= CUSTOMER / RECIPIENT ================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#12233f]">
            Customer / Recipient Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This information will be used for
            delivery.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Recipient Name"
            placeholder="Customer name"
            icon={<User size={17} />}
            value={formData.recipientName}
            onChange={(value) =>
              handleInputChange(
                "recipientName",
                value
              )
            }
          />

          <Input
            label="Recipient Phone"
            placeholder="01XXXXXXXXX"
            type="tel"
            icon={<Phone size={17} />}
            value={formData.recipientPhone}
            onChange={(value) =>
              handleInputChange(
                "recipientPhone",
                value
              )
            }
          />
        </div>
      </section>

      {/* ================= DELIVERY ================= */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <MapPin size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#12233f]">
              Customer Delivery Address
            </h2>

            <p className="text-sm text-slate-500">
              Product will be shipped directly to
              your customer.
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
            placeholder="House, Road, Area, Village / Ward"
            value={formData.fullAddress}
            onChange={(value) =>
              handleInputChange(
                "fullAddress",
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

      {/* ================= FULFILLMENT ================= */}

      <section className="rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Package
            size={21}
            className="mt-0.5 shrink-0 text-purple-600"
          />

          <div>
            <h2 className="font-bold text-[#12233f]">
              Dropship Fulfillment
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              The supplier will ship the product
              directly to your customer. Your store
              information will be used for order
              attribution and tracking.
            </p>
          </div>
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