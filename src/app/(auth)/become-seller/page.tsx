"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

import { AccountStep, AccountData } from "@/components/auth/Account-step";
import { BusinessInfoStep, BusinessInfoData } from "@/components/auth/Business-info-step";
import { VerificationStep, VerificationData } from "@/components/auth/Verification-step";
import { PayoutStep, PayoutData } from "@/components/auth/Payout-step";
import { OtpModal } from "@/components/auth/OtpModal";

const STEPS = ["Account", "Business Info", "Verification", "Payout"];

const initialAccount: AccountData = { fullName: "", email: "", phone: "", password: "" };
const initialBusinessInfo: BusinessInfoData = { storeName: "", businessAddress: "", businessCategory: "" };
const initialVerification: VerificationData = { nidNumber: "", nidDocument: null, tradeLicenseNumber: "", tradeLicenseDocument: null };
const initialPayout: PayoutData = { method: "", bankName: "", bankAccountNumber: "", bankAccountHolder: "", mobileBankingNumber: "" };

export default function SellerApplicationWizard() {
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState<AccountData>(initialAccount);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoData>(initialBusinessInfo);
  const [verification, setVerification] = useState<VerificationData>(initialVerification);
  const [payout, setPayout] = useState<PayoutData>(initialPayout);

  // Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);

  const isLastStep = step === STEPS.length - 1;

  // ১. সাবমিট এ ক্লিক করলে পপআপ ওপেন হবে
  function handleInitiateSubmit() {
    setShowOtpModal(true);
  }

  // ২. পপআপ থেকে ভেরিফাই হলে সম্পূর্ণ ডাটা সেভ করবে
  function handleFinalSubmission(otpCode: string) {
    console.log("Submitted Data:", {
      account,
      businessInfo,
      verification,
      payout,
      otpCode,
    });

    alert("🎉 আপনার আবেদন এবং OTP ভেরিফিকেশন সফল হয়েছে!");
    setShowOtpModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 my-8 relative">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-amber-500 text-slate-950 font-black text-2xl px-3 py-1 rounded-xl">
              A
            </div>
            <span className="font-extrabold text-2xl text-slate-900">
              Aladdin<span className="text-amber-500">.</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 pt-2">Become a Seller</h2>
          <p className="text-xs text-slate-500">
            তথ্য জমা দিন — Admin রিভিউ করে অ্যাপ্রুভ করবে
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center mb-7">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    i < step
                      ? "bg-emerald-500 text-white"
                      : i === step
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-[9.5px] text-slate-500 whitespace-nowrap">
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 mt-[-14px] h-[2px] flex-1 ${
                    i < step ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mb-7">
          {step === 0 && <AccountStep data={account} onChange={setAccount} />}
          {step === 1 && <BusinessInfoStep data={businessInfo} onChange={setBusinessInfo} />}
          {step === 2 && <VerificationStep data={verification} onChange={setVerification} />}
          {step === 3 && <PayoutStep data={payout} onChange={setPayout} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`text-xs font-semibold text-slate-500 hover:text-slate-700 ${
              step === 0 ? "invisible" : ""
            }`}
          >
            পিছনে
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
            >
              পরবর্তী <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleInitiateSubmit}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
            >
              আবেদন জমা দিন <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/sign-in" className="text-amber-600 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Standalone Reusable Otp Modal Component */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={account.email}
        phone={account.phone}
        onVerify={handleFinalSubmission}
      />
    </div>
  );
}