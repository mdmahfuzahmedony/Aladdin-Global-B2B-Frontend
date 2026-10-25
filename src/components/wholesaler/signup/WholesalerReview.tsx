"use client";
import { WholesalerSignupData } from "@/app/(auth)/wholesaler-signup/types/wholesaler";


type Props = {
  data: WholesalerSignupData;
  onBack: () => void;
  onSubmit: () => void | Promise<void>;
  submitting?: boolean;
};

export default function WholesalerReview({
  data,
  onBack,
  onSubmit,
  submitting,
}: Props) {
  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-bold text-[#12233F]">
          Review Your Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please review everything before creating
          your wholesaler account.
        </p>
      </div>

      <div className="space-y-5">

        {/* PERSONAL */}

        <ReviewSection title="Personal Information">
          <ReviewRow
            label="Full Name"
            value={data.fullName}
          />

          <ReviewRow
            label="Email"
            value={data.email}
          />

          <ReviewRow
            label="Phone"
            value={data.phone}
          />
        </ReviewSection>

        {/* BUSINESS */}

        <ReviewSection title="Business Information">
          <ReviewRow
            label="Business Name"
            value={data.businessName}
          />

          <ReviewRow
            label="Business Type"
            value={data.businessType}
          />

          <ReviewRow
            label="Category"
            value={data.businessCategory}
          />
        </ReviewSection>

        {/* ADDRESS */}

        <ReviewSection title="Business Address">
          <ReviewRow
            label="Address"
            value={data.address}
          />

          <ReviewRow
            label="City"
            value={data.city}
          />

          <ReviewRow
            label="District"
            value={data.district}
          />

          <ReviewRow
            label="Postal Code"
            value={data.postalCode}
          />
        </ReviewSection>

        {/* BUYING */}

        <ReviewSection title="Wholesale Buying">
          <ReviewRow
            label="Categories"
            value={
              data.interestedCategories.join(
                ", "
              )
            }
          />

          <ReviewRow
            label="Monthly Purchase"
            value={
              data.monthlyPurchaseVolume
            }
          />

          <ReviewRow
            label="Payment"
            value={
              data.preferredPaymentMethod
            }
          />

          <ReviewRow
            label="Delivery Location"
            value={
              data.preferredDeliveryLocation
            }
          />
        </ReviewSection>

        {/* VERIFICATION */}

        <ReviewSection title="Verification">
          <ReviewRow
            label="Trade License"
            value={
              data.tradeLicenseNumber ||
              "Not provided"
            }
          />

          <ReviewRow
            label="Document"
            value={
              data.tradeLicenseDocumentUrl ||
              "Not provided"
            }
          />
        </ReviewSection>

        {/* AGREEMENT */}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs leading-5 text-amber-700">
            By submitting this application, you
            confirm that the information provided is
            accurate and belongs to your business.
          </p>
        </div>
      </div>

      {/* BUTTONS */}

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
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-xl bg-[#d6a419] px-7 py-3 text-sm font-bold text-[#12233F] transition hover:bg-[#f1c453] disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Create Wholesaler Account"}
        </button>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-4 text-sm font-bold text-[#12233F]">
        {title}
      </h3>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <span className="text-sm font-medium text-slate-700 sm:text-right">
        {value || "Not provided"}
      </span>
    </div>
  );
}