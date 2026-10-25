"use client";

import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { MapPin, User, Phone, Mail } from "lucide-react";

export type CustomerShippingData = {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postalCode: string;
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
};

type Upazila = {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
};

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  divisionId: string;
  districtId: string;
  upazilaId: string;
  fullAddress: string;
  postalCode: string;
};

type CustomerBillingProps = {
  onShippingChange: (data: CustomerShippingData) => void;
};

export default function CustomerBilling({
  onShippingChange,
}: CustomerBillingProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locationError, setLocationError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    divisionId: "",
    districtId: "",
    upazilaId: "",
    fullAddress: "",
    postalCode: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      try {
        setLoadingLocations(true);
        setLocationError("");

        const responses = await Promise.all([
          fetch("/Data/divisions.json"),
          fetch("/Data/districts.json"),
          fetch("/Data/upazilas.json"),
        ]);

        if (responses.some((response) => !response.ok)) {
          throw new Error(
            "Location JSON ফাইল লোড করা যায়নি।"
          );
        }

        const [divisionData, districtData, upazilaData] =
          await Promise.all(
            responses.map((response) => response.json())
          );

        if (cancelled) return;

        setDivisions(divisionData);
        setDistricts(districtData);
        setUpazilas(upazilaData);
      } catch (error) {
        console.error("LOCATION LOAD ERROR:", error);

        if (!cancelled) {
          setLocationError(
            "ঠিকানার তালিকা লোড হয়নি। JSON ফাইলের path যাচাই করো।"
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingLocations(false);
        }
      }
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDistricts = districts.filter(
    (district) =>
      district.division_id === formData.divisionId
  );

  const filteredUpazilas = upazilas.filter(
    (upazila) =>
      upazila.district_id === formData.districtId
  );

  function handleInputChange(
    field: keyof FormData,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleDivisionChange(divisionId: string) {
    setFormData((current) => ({
      ...current,
      divisionId,
      districtId: "",
      upazilaId: "",
    }));
  }

  function handleDistrictChange(districtId: string) {
    setFormData((current) => ({
      ...current,
      districtId,
      upazilaId: "",
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const selectedDivision = divisions.find(
      (item) => item.id === formData.divisionId
    );

    const selectedDistrict = districts.find(
      (item) => item.id === formData.districtId
    );

    const selectedUpazila = upazilas.find(
      (item) => item.id === formData.upazilaId
    );

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !selectedDivision ||
      !selectedDistrict ||
      !selectedUpazila ||
      !formData.fullAddress.trim()
    ) {
      toast.info("নাম, ফোন এবং সম্পূর্ণ Delivery Address পূরণ করো।");
      return;
    }

    const shipping: CustomerShippingData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      division: selectedDivision.name,
      district: selectedDistrict.name,
      upazila: selectedUpazila.name,
      address: formData.fullAddress.trim(),
      postalCode: formData.postalCode.trim(),
    };

    // Shipping তথ্য Checkout Page-এ পাঠানো হচ্ছে।
    onShippingChange(shipping);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-[#12233f]">
          Customer Information
        </h2>

        <p className="mb-6 mt-1 text-sm text-slate-500">
          তোমার যোগাযোগের তথ্য দাও।
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            icon={<User size={17} />}
            value={formData.fullName}
            onChange={(value) =>
              handleInputChange("fullName", value)
            }
            required
          />

          <Input
            label="Phone Number"
            placeholder="01XXXXXXXXX"
            type="tel"
            icon={<Phone size={17} />}
            value={formData.phone}
            onChange={(value) =>
              handleInputChange("phone", value)
            }
            required
          />

          <div className="sm:col-span-2">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={<Mail size={17} />}
              value={formData.email}
              onChange={(value) =>
                handleInputChange("email", value)
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <MapPin size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#12233f]">
              Delivery Address
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              কোথায় অর্ডারটি পৌঁছে দিতে হবে?
            </p>
          </div>
        </div>

        {locationError && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {locationError}
          </p>
        )}

        <div className="space-y-4">
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
              options={divisions.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              disabled={loadingLocations}
              required
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
              options={filteredDistricts.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              disabled={
                loadingLocations || !formData.divisionId
              }
              required
            />
          </div>

          <SelectInput
            label="Thana / Upazila"
            placeholder={
              !formData.districtId
                ? "Select District First"
                : "Select Thana / Upazila"
            }
            value={formData.upazilaId}
            onChange={(value) =>
              handleInputChange("upazilaId", value)
            }
            options={filteredUpazilas.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            disabled={
              loadingLocations || !formData.districtId
            }
            required
          />

          <TextAreaInput
            label="Full Address"
            placeholder="House, Road, Area, Village / Ward"
            value={formData.fullAddress}
            onChange={(value) =>
              handleInputChange("fullAddress", value)
            }
            required
          />

          <Input
            label="Postal Code (Optional)"
            placeholder="Postal code"
            value={formData.postalCode}
            onChange={(value) =>
              handleInputChange("postalCode", value)
            }
          />
        </div>
      </section>

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

function Input({
  label,
  placeholder,
  type = "text",
  icon,
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
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
          required={required}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 ${
            icon ? "pl-10" : ""
          }`}
        />
      </div>
    </div>
  );
}

function SelectInput({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
}: {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={disabled}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 disabled:cursor-not-allowed disabled:bg-slate-50"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaInput({
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        required={required}
        rows={3}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-50"
      />
    </div>
  );
}
