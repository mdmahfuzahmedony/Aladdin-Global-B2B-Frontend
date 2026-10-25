"use client";
import { toast } from "react-toastify";

import { OtpModal } from "@/app/(auth)/become-seller/components/OtpModal";
import WholesalerAccountSecurity from "@/components/wholesaler/signup/WholesalerAccountSecurity";
import WholesalerBusinessAddress from "@/components/wholesaler/signup/WholesalerBusinessAddress";
import WholesalerBusinessInfo from "@/components/wholesaler/signup/WholesalerBusinessInfo";
import WholesalerBuyingInfo from "@/components/wholesaler/signup/WholesalerBuyingInfo";
import WholesalerPersonalInfo from "@/components/wholesaler/signup/WholesalerPersonalInfo";
import WholesalerReview from "@/components/wholesaler/signup/WholesalerReview";

import WholesalerVerification from "@/components/wholesaler/signup/WholesalerVerification";
import WholesalerProgress from "@/components/wholesaler/signup/WholesalerProgress";

import { useState } from "react";
import { WholesalerSignupData } from "./types/wholesaler";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const initialData: WholesalerSignupData = {
  fullName: "",
  email: "",
  phone: "",

  businessName: "",
  businessType: "",
  businessCategory: "",

  address: "",
  city: "",
  district: "",
  postalCode: "",

  interestedCategories: [],
  monthlyPurchaseVolume: "",
  preferredPaymentMethod: "",
  preferredDeliveryLocation: "",

  tradeLicenseNumber: "",
  tradeLicenseDocumentUrl: "",

  password: "",
  confirmPassword: "",
};

export default function WholesalerSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WholesalerSignupData>(initialData);

  const [error, setError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    "Personal",
    "Business",
    "Address",
    "Buying",
    "Verification",
    "Security",
    "Review",
  ];

  const updateFormData = (data: Partial<WholesalerSignupData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const nextStep = () => {
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const previousStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInitiateSubmit = async () => {
    setError("");

    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please complete your personal information.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to send OTP.");
      }

      setShowOtpModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmission = async (otpCode: string) => {
    setError("");

    try {
      setSubmitting(true);

      const verifyResponse = await fetch(`${API_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          otp: otpCode,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyResult?.message || "Invalid OTP.");
      }

      const payload = {
        ...formData,
      };

      const response = await fetch(`${API_URL}/api/wholesalers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to complete registration.");
      }

      toast.success(result?.message || "Wholesaler registration successful!");

      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-4 text-center sm:mb-5">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-lg font-black text-slate-950 shadow-sm sm:h-11 sm:w-11">
            A
          </div>

          <h1 className="font-[var(--font-poppins)] text-xl font-extrabold text-[#12233F] sm:text-2xl">
            Join as a Wholesaler
          </h1>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Create your wholesale business account with Aladdin Global B2B.
          </p>
        </div>

        {/* Progress */}
        <WholesalerProgress currentStep={currentStep} steps={steps} />

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {currentStep === 1 && (
            <WholesalerPersonalInfo
              data={formData}
              updateData={updateFormData}
              onNext={nextStep}
            />
          )}

          {currentStep === 2 && (
            <WholesalerBusinessInfo
              data={formData}
              updateData={updateFormData}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {currentStep === 3 && (
            <WholesalerBusinessAddress
              data={formData}
              updateData={updateFormData}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {currentStep === 4 && (
            <WholesalerBuyingInfo
              data={formData}
              updateData={updateFormData}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {currentStep === 5 && (
            <WholesalerVerification
              data={formData}
              updateData={updateFormData}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {currentStep === 6 && (
            <WholesalerAccountSecurity
              data={formData}
              updateData={updateFormData}
              onNext={nextStep}
              onBack={previousStep}
            />
          )}

          {currentStep === 7 && (
            <WholesalerReview
              data={formData}
              onBack={previousStep}
              onSubmit={handleInitiateSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleFinalSubmission}
        submitting={submitting}
      />
    </main>
  );
}
