"use client";
import { toast } from "react-toastify";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { OtpModal } from "@/app/(auth)/become-seller/components/OtpModal";
import type { AffiliateSignupData } from "./types/affiliate";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const initialFormData: AffiliateSignupData = {
  fullName: "",
  email: "",
  phone: "",

  socialPlatform: "",
  socialMediaLink: "",
  followerCount: "",

  promotionCategory: "",
  promotionMethod: "",
  audienceDescription: "",

  payoutMethod: "",
  payoutAccountName: "",
  payoutAccountNumber: "",
  payoutMobileNumber: "",

  password: "",
  confirmPassword: "",
  otp: "",
};

export default function AffiliateSignupPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] =
    useState<AffiliateSignupData>(initialFormData);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field: keyof AffiliateSignupData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCurrentStep = () => {
    setErrorMessage("");

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setErrorMessage("আপনার পুরো নাম দিন।");
        return false;
      }

      if (!formData.email.trim()) {
        setErrorMessage("আপনার ইমেইল দিন।");
        return false;
      }

      if (!formData.email.includes("@")) {
        setErrorMessage("সঠিক ইমেইল অ্যাড্রেস দিন।");
        return false;
      }

      if (!formData.phone.trim()) {
        setErrorMessage("আপনার ফোন নম্বর দিন।");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.socialPlatform) {
        setErrorMessage("আপনার প্রধান প্ল্যাটফর্ম নির্বাচন করুন।");
        return false;
      }

      if (!formData.socialMediaLink.trim()) {
        setErrorMessage("আপনার Social Media / Website Link দিন।");
        return false;
      }

      if (!formData.followerCount.trim()) {
        setErrorMessage("Follower / Audience Count দিন।");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.promotionCategory) {
        setErrorMessage("Promotion Category নির্বাচন করুন।");
        return false;
      }

      if (!formData.promotionMethod) {
        setErrorMessage("Promotion Method নির্বাচন করুন।");
        return false;
      }

      if (!formData.audienceDescription.trim()) {
        setErrorMessage("আপনার audience সম্পর্কে লিখুন।");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.payoutMethod) {
        setErrorMessage("Payout Method নির্বাচন করুন।");
        return false;
      }

      if (!formData.payoutAccountName.trim()) {
        setErrorMessage("Account Holder Name দিন।");
        return false;
      }

      if (!formData.payoutAccountNumber.trim()) {
        setErrorMessage("Account Number দিন।");
        return false;
      }

      if (
        (formData.payoutMethod === "BKASH" ||
          formData.payoutMethod === "NAGAD") &&
        !formData.payoutMobileNumber.trim()
      ) {
        setErrorMessage("Mobile Banking Number দিন।");
        return false;
      }
    }

    if (currentStep === 5) {
      if (!formData.password) {
        setErrorMessage("Password দিন।");
        return false;
      }

      if (formData.password.length < 8) {
        setErrorMessage("Password অবশ্যই কমপক্ষে ৮ characters হতে হবে।");
        return false;
      }

      if (!formData.confirmPassword) {
        setErrorMessage("Confirm Password দিন।");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Password দুটো একই নয়।");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleBack = () => {
    setErrorMessage("");

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // STEP 6 থেকে Submit করলে প্রথমে OTP পাঠাবে
  const handleInitiateSubmit = async () => {
    if (submitting) return;

    setErrorMessage("");

    try {
      setSubmitting(true);

      const email = formData.email.trim().toLowerCase();

      const response = await fetch(`${API_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || "OTP পাঠানো যায়নি।");
      }

      setShowOtpModal(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "OTP পাঠাতে সমস্যা হয়েছে।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // OTP verify হওয়ার পর final registration
  const handleOtpVerified = async (verifiedOtp?: string) => {
    if (submitting) return;

    setErrorMessage("");

    const otp = (verifiedOtp || formData.otp || "").trim();

    if (!otp) {
      setErrorMessage("OTP পাওয়া যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName: formData.fullName.trim(),

        email: formData.email.trim().toLowerCase(),

        phone: formData.phone.trim(),

        password: formData.password,
        confirmPassword: formData.confirmPassword,

        socialPlatform: formData.socialPlatform,
        socialMediaLink: formData.socialMediaLink.trim(),

        followerCount: formData.followerCount.trim(),

        payoutMethod: formData.payoutMethod,

        payoutAccountName: formData.payoutAccountName.trim(),

        payoutAccountNumber: formData.payoutAccountNumber.trim(),

        payoutMobileNumber: formData.payoutMobileNumber.trim(),

        otp,
      };

      const response = await fetch(`${API_URL}/api/affiliates/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Affiliate registration failed.",
        );
      }

      setShowOtpModal(false);

      toast.success("Affiliate application successfully submitted!");

      router.push("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Registration করতে সমস্যা হয়েছে।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#12233f]">
                Personal Information
              </h2>
              <p className="mt-1 text-gray-500">আপনার basic information দিন।</p>
            </div>

            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => updateField("fullName", value)}
              placeholder="Your full name"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField("email", value)}
              placeholder="name@example.com"
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="017XXXXXXXX"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#12233f]">
                Social Platform
              </h2>
              <p className="mt-1 text-gray-500">
                আপনি কোন platform-এ promote করবেন?
              </p>
            </div>

            <Select
              label="Main Platform"
              value={formData.socialPlatform}
              onChange={(value) => updateField("socialPlatform", value)}
              options={[
                ["FACEBOOK", "Facebook"],
                ["INSTAGRAM", "Instagram"],
                ["YOUTUBE", "YouTube"],
                ["TIKTOK", "TikTok"],
                ["WEBSITE", "Website"],
                ["OTHER", "Other"],
              ]}
            />

            <Input
              label="Social Media / Website Link"
              value={formData.socialMediaLink}
              onChange={(value) => updateField("socialMediaLink", value)}
              placeholder="https://..."
            />

            <Input
              label="Follower / Audience Count"
              value={formData.followerCount}
              onChange={(value) => updateField("followerCount", value)}
              placeholder="e.g. 10000"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#12233f]">
                Audience & Promotion
              </h2>
              <p className="mt-1 text-gray-500">
                আপনার audience এবং promotion plan দিন।
              </p>
            </div>

            <Select
              label="Promotion Category"
              value={formData.promotionCategory}
              onChange={(value) => updateField("promotionCategory", value)}
              options={[
                ["FASHION", "Fashion"],
                ["ELECTRONICS", "Electronics"],
                ["BEAUTY", "Beauty"],
                ["HOME", "Home"],
                ["GROCERY", "Grocery"],
                ["OTHER", "Other"],
              ]}
            />

            <Select
              label="Promotion Method"
              value={formData.promotionMethod}
              onChange={(value) => updateField("promotionMethod", value)}
              options={[
                ["SOCIAL_POST", "Social Post"],
                ["VIDEO", "Video"],
                ["LIVE", "Live"],
                ["BLOG", "Blog"],
                ["DIRECT", "Direct Promotion"],
              ]}
            />

            <Textarea
              label="Audience Description"
              value={formData.audienceDescription}
              onChange={(value) => updateField("audienceDescription", value)}
              placeholder="আপনার audience সম্পর্কে সংক্ষেপে লিখুন..."
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#12233f]">
                Payout Information
              </h2>
              <p className="mt-1 text-gray-500">
                Commission পাওয়ার information দিন।
              </p>
            </div>

            <Select
              label="Payout Method"
              value={formData.payoutMethod}
              onChange={(value) => updateField("payoutMethod", value)}
              options={[
                ["BKASH", "bKash"],
                ["NAGAD", "Nagad"],
                ["BANK", "Bank"],
              ]}
            />

            <Input
              label="Account Holder Name"
              value={formData.payoutAccountName}
              onChange={(value) => updateField("payoutAccountName", value)}
              placeholder="Account holder name"
            />

            <Input
              label="Account Number"
              value={formData.payoutAccountNumber}
              onChange={(value) => updateField("payoutAccountNumber", value)}
              placeholder="Account number"
            />

            {(formData.payoutMethod === "BKASH" ||
              formData.payoutMethod === "NAGAD") && (
              <Input
                label="Mobile Banking Number"
                value={formData.payoutMobileNumber}
                onChange={(value) => updateField("payoutMobileNumber", value)}
                placeholder="017XXXXXXXX"
              />
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#12233f]">
                Account & Security
              </h2>
              <p className="mt-1 text-gray-500">
                আপনার account password তৈরি করুন।
              </p>
            </div>

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => updateField("password", value)}
              placeholder="Minimum 8 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
              placeholder="Re-enter password"
            />

            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-[#12233f]">
                Password requirements
              </p>
              <p className="mt-1">• Minimum 8 characters</p>
              <p>• Password এবং Confirm Password একই হতে হবে</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#12233f]">
                Review Application
              </h2>
              <p className="mt-1 text-gray-500">
                Submit করার আগে informationগুলো check করুন।
              </p>
            </div>

            <ReviewSection title="Personal Information">
              <ReviewRow label="Name" value={formData.fullName} />
              <ReviewRow label="Email" value={formData.email} />
              <ReviewRow label="Phone" value={formData.phone} />
            </ReviewSection>

            <ReviewSection title="Social Information">
              <ReviewRow label="Platform" value={formData.socialPlatform} />
              <ReviewRow label="Link" value={formData.socialMediaLink} />
              <ReviewRow label="Audience" value={formData.followerCount} />
            </ReviewSection>

            <ReviewSection title="Promotion">
              <ReviewRow label="Category" value={formData.promotionCategory} />
              <ReviewRow label="Method" value={formData.promotionMethod} />
              <ReviewRow
                label="Audience"
                value={formData.audienceDescription}
              />
            </ReviewSection>

            <ReviewSection title="Payout">
              <ReviewRow label="Method" value={formData.payoutMethod} />
              <ReviewRow
                label="Account Name"
                value={formData.payoutAccountName}
              />
              <ReviewRow
                label="Account Number"
                value={formData.payoutAccountNumber}
              />

              {formData.payoutMobileNumber && (
                <ReviewRow label="Mobile" value={formData.payoutMobileNumber} />
              )}
            </ReviewSection>

            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 text-green-600" size={20} />

              <div>
                <p className="font-semibold text-green-800">Ready to submit</p>
                <p className="mt-1 text-sm text-green-700">
                  Submit করলে আপনার email-এ OTP পাঠানো হবে।
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#12233f] text-2xl font-extrabold text-white">
            A
          </div>

          <h1 className="text-3xl font-extrabold text-[#12233f]">
            Affiliate Application
          </h1>

          <p className="mt-2 text-gray-500">
            Join Aladdin Global B2B as an affiliate partner
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            {Array.from({ length: 6 }).map((_, index) => {
              const step = index + 1;
              const active = step <= currentStep;

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? "bg-[#12233f] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>

                  {step < 6 && (
                    <div
                      className={`mx-1 hidden h-1 w-8 sm:block ${
                        step < currentStep ? "bg-[#12233f]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-center text-sm font-medium text-gray-500">
            Step {currentStep} of 6
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          {errorMessage && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || submitting}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-[#12233f] px-6 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Continue
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleInitiateSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending OTP..." : "Submit Application"}

                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => {
          if (!submitting) {
            setShowOtpModal(false);
          }
        }}
        email={formData.email.trim().toLowerCase()}
        onVerify={handleOtpVerified}
      />
    </main>
  );
}

/* ---------------- Components ---------------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#12233f] focus:ring-2 focus:ring-[#12233f]/10"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#12233f] focus:ring-2 focus:ring-[#12233f]/10"
      >
        <option value="">Select an option</option>

        {options.map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#12233f] focus:ring-2 focus:ring-[#12233f]/10"
      />
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
    <div className="rounded-xl border border-gray-200 p-4">
      <h3 className="mb-3 font-bold text-[#12233f]">{title}</h3>

      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-100 py-2 last:border-0 sm:flex-row sm:justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>

      <span className="break-all text-sm font-semibold text-gray-800 sm:max-w-[65%] sm:text-right">
        {value || "-"}
      </span>
    </div>
  );
}
