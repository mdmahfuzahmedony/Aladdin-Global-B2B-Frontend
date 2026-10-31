"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

import { OtpModal } from "./components/OtpModal";
import { PayoutStep, type PayoutData } from "./components/Payout-step";
import {
  VerificationStep,
  type VerificationData,
} from "./components/Verification-step";
import { BusinessInfoStep } from "./components/Business-info-step";
import { AccountStep } from "./components/Account-step";
import { LocationStep } from "./components/Location-step";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const STEPS = [
  "Account",
  "Business Info",
  "Location",
  "Verification",
  "Payout",
];

// Types
type AccountData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

type BusinessInfoData = {
  storeName: string;
  businessAddress: string;
  businessCategory: string;
};

type LocationData = {
  division: string;
  district: string;
  upazila: string;
  area: string;
  fullAddress: string;
};

type ApiResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

// Initial values
const initialAccount: AccountData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

const initialBusinessInfo: BusinessInfoData = {
  storeName: "",
  businessAddress: "",
  businessCategory: "",
};

const initialLocation: LocationData = {
  division: "",
  district: "",
  upazila: "",
  area: "",
  fullAddress: "",
};

const initialVerification: VerificationData = {
  nidNumber: "",
  nidFrontDocument: null,
  nidBackDocument: null,
  tradeLicenseNumber: "",
  tradeLicenseDocument: null,
  tinNumber: "",
  tinDocument: null,
};

const initialPayout: PayoutData = {
  method: "BANK",
  bankName: "",
  bankAccountNumber: "",
  bankAccountHolder: "",
  mobileBankingNumber: "",
};

export default function SellerApplicationWizard() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [account, setAccount] = useState<AccountData>(initialAccount);
  const [businessInfo, setBusinessInfo] =
    useState<BusinessInfoData>(initialBusinessInfo);
  const [locationData, setLocationData] =
    useState<LocationData>(initialLocation);
  const [verification, setVerification] =
    useState<VerificationData>(initialVerification);
  const [payout, setPayout] = useState<PayoutData>(initialPayout);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLastStep = step === STEPS.length - 1;

  // Validate one step
  function validateCurrentStep(): boolean {
    switch (step) {
      case 0: {
        if (!account.fullName.trim()) {
          toast.error("Please enter your full name.");
          return false;
        }

        if (!account.email.trim()) {
          toast.error("Please enter your email.");
          return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email.trim())) {
          toast.error("Please enter a valid email address.");
          return false;
        }

        if (!account.phone.trim()) {
          toast.error("Please enter your phone number.");
          return false;
        }

        if (account.password.length < 8) {
          toast.error("Password must be at least 8 characters.");
          return false;
        }

        return true;
      }

      case 1: {
        if (!businessInfo.storeName.trim()) {
          toast.error("Please enter your store name.");
          return false;
        }

        if (!businessInfo.businessAddress.trim()) {
          toast.error("Please enter your business address.");
          return false;
        }

        if (!businessInfo.businessCategory.trim()) {
          toast.error("Please select a business category.");
          return false;
        }

        return true;
      }

      case 2: {
        if (!locationData.division) {
          toast.error("Please select a division.");
          return false;
        }

        if (!locationData.district) {
          toast.error("Please select a district.");
          return false;
        }

        if (!locationData.upazila) {
          toast.error("Please select an upazila.");
          return false;
        }

        if (!locationData.area.trim()) {
          toast.error("Please enter your area.");
          return false;
        }

        if (!locationData.fullAddress.trim()) {
          toast.error("Please enter your full address.");
          return false;
        }

        return true;
      }

      case 3: {
        if (!verification.nidNumber.trim()) {
          toast.error("Please enter your NID number.");
          return false;
        }

        if (!verification.nidFrontDocument) {
          toast.error("Please upload your NID front document.");
          return false;
        }

        if (!verification.nidBackDocument) {
          toast.error("Please upload your NID back document.");
          return false;
        }

        if (!verification.tradeLicenseNumber.trim()) {
          toast.error("Please enter your Trade License number.");
          return false;
        }

        if (!verification.tradeLicenseDocument) {
          toast.error("Please upload your Trade License document.");
          return false;
        }

        if (!verification.tinNumber.trim()) {
          toast.error("Please enter your TIN number.");
          return false;
        }

        if (!/^\d{12}$/.test(verification.tinNumber.trim())) {
          toast.error("TIN number must contain exactly 12 digits.");
          return false;
        }

        if (!verification.tinDocument) {
          toast.error("Please upload your TIN certificate.");
          return false;
        }

        return true;
      }

      case 4: {
        if (!payout.method) {
          toast.error("Please select a payout method.");
          return false;
        }

        const method = payout.method.toUpperCase();

        if (
          method === "BANK" &&
          (!payout.bankName.trim() ||
            !payout.bankAccountNumber.trim() ||
            !payout.bankAccountHolder.trim())
        ) {
          toast.error("Please complete your bank account information.");
          return false;
        }

        if (
          ["BKASH", "NAGAD", "ROCKET"].includes(method) &&
          !payout.mobileBankingNumber.trim()
        ) {
          toast.error("Please enter your mobile banking number.");
          return false;
        }

        return true;
      }

      default:
        return true;
    }
  }

  // Validate all steps before OTP or final submission
  function validateAllSteps(): boolean {
    for (let currentStep = 0; currentStep < STEPS.length; currentStep++) {
      let valid = true;

      switch (currentStep) {
        case 0:
          valid =
            !!account.fullName.trim() &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email.trim()) &&
            !!account.phone.trim() &&
            account.password.length >= 8;
          break;

        case 1:
          valid =
            !!businessInfo.storeName.trim() &&
            !!businessInfo.businessAddress.trim() &&
            !!businessInfo.businessCategory.trim();
          break;

        case 2:
          valid =
            !!locationData.division &&
            !!locationData.district &&
            !!locationData.upazila &&
            !!locationData.area.trim() &&
            !!locationData.fullAddress.trim();
          break;

        case 3:
          valid =
            !!verification.nidNumber.trim() &&
            !!verification.nidFrontDocument &&
            !!verification.nidBackDocument &&
            !!verification.tradeLicenseNumber.trim() &&
            !!verification.tradeLicenseDocument &&
            /^\d{12}$/.test(verification.tinNumber.trim()) &&
            !!verification.tinDocument;
          break;

        case 4: {
          const method = payout.method.toUpperCase();

          valid = !!payout.method;

          if (
            method === "BANK" &&
            (!payout.bankName.trim() ||
              !payout.bankAccountNumber.trim() ||
              !payout.bankAccountHolder.trim())
          ) {
            valid = false;
          }

          if (
            ["BKASH", "NAGAD", "ROCKET"].includes(method) &&
            !payout.mobileBankingNumber.trim()
          ) {
            valid = false;
          }

          break;
        }
      }

      if (!valid) {
        setStep(currentStep);

        const messages = [
          "Please complete the Account step correctly.",
          "Please complete the Business Info step.",
          "Please complete the Location step.",
          "Please upload both NID sides and complete all verification fields.",
          "Please complete the Payout step correctly.",
        ];

        toast.error(messages[currentStep]);
        return false;
      }
    }

    return true;
  }

  function goNext() {
    if (submitting || !validateCurrentStep()) return;

    toast.success(`${STEPS[step]} completed successfully!`);

    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  }

  function goBack() {
    if (submitting) return;

    setStep((current) => Math.max(0, current - 1));
  }

  // Send OTP
  async function handleInitiateSubmit() {
    if (submitting || !validateAllSteps()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: account.email.trim().toLowerCase(),
        }),
      });

      const result: ApiResult | null = await response.json().catch(() => null);

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.error || result?.message || "Failed to send OTP.",
        );
      }

      toast.success("OTP sent successfully. Please check your email.");

      setShowOtpModal(true);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to send OTP. Please try again.",
      );

      console.error("Send OTP failed:", error);
    } finally {
      setSubmitting(false);
    }
  }

  // Submit registration after OTP verification
  async function handleFinalSubmission(otpCode: string) {
    if (submitting) return;

    if (!validateAllSteps()) return;

    // Explicit document guard
    if (
      !verification.nidFrontDocument ||
      !verification.nidBackDocument ||
      !verification.tradeLicenseDocument ||
      !verification.tinDocument
    ) {
      setStep(3);

      toast.error(
        "Please upload NID front, NID back, Trade License and TIN documents.",
      );
      return;
    }

    if (!otpCode.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // Account
      formData.append("fullName", account.fullName.trim());
      formData.append("email", account.email.trim().toLowerCase());
      formData.append("phone", account.phone.trim());
      formData.append("password", account.password);
      formData.append("otp", otpCode.trim());

      // Business
      formData.append("storeName", businessInfo.storeName.trim());
      formData.append("businessAddress", businessInfo.businessAddress.trim());
      formData.append("businessCategory", businessInfo.businessCategory);

      // Location
      formData.append("division", locationData.division);
      formData.append("district", locationData.district);
      formData.append("upazila", locationData.upazila);
      formData.append("area", locationData.area.trim());
      formData.append("fullAddress", locationData.fullAddress.trim());

      // Verification: NID front and back are separate
      formData.append("nidNumber", verification.nidNumber.trim());
      formData.append("nidFrontDocument", verification.nidFrontDocument);
      formData.append("nidBackDocument", verification.nidBackDocument);

      formData.append(
        "tradeLicenseNumber",
        verification.tradeLicenseNumber.trim(),
      );
      formData.append(
        "tradeLicenseDocument",
        verification.tradeLicenseDocument,
      );

      formData.append("taxIdentificationNumber", verification.tinNumber.trim());
      formData.append("tinDocument", verification.tinDocument);

      // Payout
      formData.append("payoutMethod", payout.method);

      if (payout.bankName.trim()) {
        formData.append("bankName", payout.bankName.trim());
      }

      if (payout.bankAccountNumber.trim()) {
        formData.append("bankAccountNumber", payout.bankAccountNumber.trim());
      }

      if (payout.bankAccountHolder.trim()) {
        formData.append("bankAccountHolder", payout.bankAccountHolder.trim());
      }

      if (payout.mobileBankingNumber.trim()) {
        formData.append(
          "mobileBankingNumber",
          payout.mobileBankingNumber.trim(),
        );
      }

      // Do not manually set Content-Type for FormData.
      // The browser must add the multipart boundary.
      const response = await fetch(`${API_BASE_URL}/api/vendors/register`, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      let result: ApiResult | null = null;

      try {
        result = responseText ? (JSON.parse(responseText) as ApiResult) : null;
      } catch {
        console.error(
          "Registration returned a non-JSON response:",
          responseText,
        );
      }

      console.log("Registration status:", response.status);
      console.log("Registration response:", result);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
            result?.message ||
            `Registration failed (${response.status}).`,
        );
      }

      toast.success(
        result.message || "Vendor application submitted successfully!",
      );

      setShowOtpModal(false);
      router.replace("/sign-in");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong during registration.",
      );

      console.error("Vendor registration failed:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-4 text-center sm:mb-5">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-lg font-black text-slate-950 shadow-sm sm:h-11 sm:w-11">
              A
            </div>

            <span className="font-[var(--font-poppins)] text-xl font-extrabold text-[#12233F]">
              Aladdin<span className="text-amber-500">.</span>
            </span>
          </Link>

          <h1 className="mt-2 font-[var(--font-poppins)] text-xl font-extrabold text-[#12233F] sm:text-2xl">
            Become a Seller
          </h1>

          <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-500">
            Submit your business information and complete each step. Your
            application will be reviewed by the Aladdin team.
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4">
          <div className="flex items-start">
            {STEPS.map((label, i) => (
              <div key={label} className="flex min-w-0 flex-1 items-start">
                <div className="flex min-w-0 flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                      i < step
                        ? "bg-emerald-500 text-white"
                        : i === step
                          ? "bg-amber-500 text-slate-950 shadow-sm"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {i < step ? <Check size={15} /> : i + 1}
                  </div>

                  <span
                    className={`mt-1 text-center text-[9px] font-semibold sm:text-[10px] ${
                      i === step ? "text-[#12233F]" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-1 mt-4 h-px flex-1 sm:mx-2 ${
                      i < step ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Step {step + 1} of {STEPS.length}
            </p>

            <h2 className="mt-1 font-[var(--font-poppins)] text-base font-extrabold text-[#12233F] sm:text-lg">
              {STEPS[step]}
            </h2>
          </div>

          {step === 0 && <AccountStep data={account} onChange={setAccount} />}

          {step === 1 && (
            <BusinessInfoStep data={businessInfo} onChange={setBusinessInfo} />
          )}

          {step === 2 && (
            <LocationStep data={locationData} onChange={setLocationData} />
          )}

          {step === 3 && (
            <VerificationStep data={verification} onChange={setVerification} />
          )}

          {step === 4 && <PayoutStep data={payout} onChange={setPayout} />}

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={goBack}
              disabled={submitting}
              className={`rounded-xl px-4 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 ${
                step === 0 ? "invisible" : ""
              }`}
            >
              Back
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={goNext}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-[#12233F] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#1a3155] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleInitiateSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                {submitting ? "Processing..." : "Submit Application"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-3 text-center text-[11px] text-slate-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-bold text-amber-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={account.email}
        phone={account.phone}
        onVerify={handleFinalSubmission}
      />
    </main>
  );
}
