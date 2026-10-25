// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Check, ArrowRight, KeyRound, Mail, Phone, X } from "lucide-react";
// import { AccountStep, AccountData } from "@/components/auth/Account-step";
// import {
//   BusinessInfoStep,
//   BusinessInfoData,
// } from "@/components/auth/Business-info-step";
// import {
//   VerificationStep,
//   VerificationData,
// } from "@/components/auth/Verification-step";
// import { PayoutStep, PayoutData } from "@/components/auth/Payout-step";

// const STEPS = ["Account", "Business Info", "Verification", "Payout"];

// const initialAccount: AccountData = {
//   fullName: "",
//   email: "",
//   phone: "",
//   password: "",
// };
// const initialBusinessInfo: BusinessInfoData = {
//   storeName: "",
//   businessAddress: "",
//   businessCategory: "",
// };
// const initialVerification: VerificationData = {
//   nidNumber: "",
//   nidDocument: null,
//   tradeLicenseNumber: "",
//   tradeLicenseDocument: null,
//   tinNumber: "",
//   tinDocument: null,
// };
// const initialPayout: PayoutData = {
//   method: "",
//   bankName: "",
//   bankAccountNumber: "",
//   bankAccountHolder: "",
//   mobileBankingNumber: "",
// };

// export default function SellerApplicationWizard() {
//   const [step, setStep] = useState(0);

//   const [account, setAccount] = useState<AccountData>(initialAccount);
//   const [businessInfo, setBusinessInfo] =
//     useState<BusinessInfoData>(initialBusinessInfo);
//   const [verification, setVerification] =
//     useState<VerificationData>(initialVerification);
//   const [payout, setPayout] = useState<PayoutData>(initialPayout);

//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpCode, setOtpCode] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const isLastStep = step === STEPS.length - 1;

//   const validateCurrentStep = () => {
//     setErrorMessage("");

//     if (step === 0) {
//       if (!account.fullName.trim()) {
//         setErrorMessage("Please enter your full name.");
//         return false;
//       }
//       if (!account.email.trim()) {
//         setErrorMessage("Please enter your email address.");
//         return false;
//       }
//       if (!account.phone.trim()) {
//         setErrorMessage("Please enter your phone number.");
//         return false;
//       }

//       const isPasswordValid =
//         account.password.length >= 8 &&
//         /[A-Z]/.test(account.password) &&
//         /[a-z]/.test(account.password) &&
//         /[0-9]/.test(account.password);

//       if (!isPasswordValid) {
//         setErrorMessage("All password requirements must be met.");
//         return false;
//       }
//     }

//     if (step === 1) {
//       if (!businessInfo.storeName.trim()) {
//         setErrorMessage("Please enter your store name.");
//         return false;
//       }
//       if (!businessInfo.businessAddress.trim()) {
//         setErrorMessage("Please enter your full business address.");
//         return false;
//       }
//       if (!businessInfo.businessCategory) {
//         setErrorMessage("Please select a business category.");
//         return false;
//       }
//     }

//     if (step === 2) {
//       if (!verification.nidNumber.trim()) {
//         setErrorMessage("NID number is required.");
//         return false;
//       }
//       if (!verification.nidDocument) {
//         setErrorMessage("Please upload your NID document or image.");
//         return false;
//       }
//     }

//    if (step === 3) {
//   if (!payout.method) {
//     setErrorMessage("Please select a payout method.");
//     return false;
//   }

//   // Bank payout
//   if (payout.method === "BANK") {
//     if (
//       !payout.bankName?.trim() ||
//       !payout.bankAccountNumber?.trim() ||
//       !payout.bankAccountHolder?.trim()
//     ) {
//       setErrorMessage(
//         "Please enter the bank name, account number, and account holder name."
//       );
//       return false;
//     }
//   }

//   // bKash / Nagad payout
//   if (
//     (payout.method === "BKASH" || payout.method === "NAGAD") &&
//     !payout.mobileBankingNumber?.trim()
//   ) {
//     setErrorMessage("Please enter your mobile banking number.");
//     return false;
//   }
// }

//     return true;
//   };

//   const handleNextStep = () => {
//     if (validateCurrentStep()) {
//       setStep((s) => Math.min(STEPS.length - 1, s + 1));
//     }
//   };

//   const handleInitiateSubmit = async () => {
//     if (validateCurrentStep()) {
//       // ১. প্রথমে কনসোলে সমস্ত সাবমিট করা ডেটা প্রিন্ট করে দেখাবে
//       const finalPayload = {
//         email: account.email,
//         phone: account.phone,
//         fullName: account.fullName,
//         password: account.password,
//         role: "VENDOR",

//         storeName: businessInfo.storeName,
//         businessAddress: businessInfo.businessAddress,
//         businessCategory: businessInfo.businessCategory || null,

//         nidNumber: verification.nidNumber,
//         nidDocumentUrl: verification.nidDocument
//           ? verification.nidDocument.name
//           : "",
//         tradeLicenseNumber: verification.tradeLicenseNumber || null,
//         tradeLicenseDocUrl: verification.tradeLicenseDocument
//           ? verification.tradeLicenseDocument.name
//           : null,
//         taxIdentificationNumber: verification.tinNumber || null,
//         tinDocUrl: verification.tinDocument
//           ? verification.tinDocument.name
//           : null,

//         payoutMethod: payout.method.toUpperCase(),
//         bankName: payout.bankName || null,
//         bankAccountNumber: payout.bankAccountNumber || null,
//         bankAccountHolder: payout.bankAccountHolder || null,
//         mobileBankingNumber: payout.mobileBankingNumber || null,
//       };

//       console.log("========== 🚀 SUBMITTED VENDOR PAYLOAD ==========");
//       console.log(finalPayload);
//       console.log("=================================================");

//       try {
//         // ২. ব্যাকএন্ডে ওটিপি পাঠানোর জন্য এপিআই কল
//         const res = await fetch("http://localhost:8001/api/otp/send-otp", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: account.email,
//           }),
//         });

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.error || "Failed to send OTP email.");
//         }

//         setOtpCode("");
//         setShowOtpModal(true);
//       } catch (err: any) {
//         alert(err.message || "ওটিপি পাঠাতে সমস্যা হচ্ছে। সার্ভার চেক করুন।");
//       }
//     }
//   };

// const handleFinalSubmit = async () => {
//     setSubmitting(true);
//     setErrorMessage("");

//     try {
//       console.log("1. Starting OTP Verification...");
//       const verifyRes = await fetch("http://localhost:8001/api/otp/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // ব্যাকএন্ড যদি enteredOtp বা otp যেটিই চাক না কেন, তা এখানে নিশ্চিত করুন:
//         body: JSON.stringify({ email: account.email, enteredOtp: otpCode }),
//       });

//       const verifyData = await verifyRes.json();
//       console.log("2. OTP Verify Response:", verifyData);

//       if (!verifyRes.ok) {
//         throw new Error(verifyData.error || "Invalid OTP code.");
//       }

//       console.log("3. Preparing Vendor Payload...");
//       const finalPayload = {
//         email: account.email,
//         phone: account.phone,
//         fullName: account.fullName,
//         password: account.password,
//         otp: otpCode,
//         storeName: businessInfo.storeName,
//         businessAddress: businessInfo.businessAddress,
//         businessCategory: businessInfo.businessCategory || null,
//         nidNumber: verification.nidNumber,
//         nidDocumentUrl: verification.nidDocument ? verification.nidDocument.name : "",
//         tradeLicenseNumber: verification.tradeLicenseNumber || null,
//         tradeLicenseDocUrl: verification.tradeLicenseDocument ? verification.tradeLicenseDocument.name : null,
//         taxIdentificationNumber: verification.tinNumber || null,
//         tinDocUrl: verification.tinDocument ? verification.tinDocument.name : null,
//         payoutMethod: payout.method.toUpperCase(),
//         bankName: payout.bankName || null,
//         bankAccountNumber: payout.bankAccountNumber || null,
//         bankAccountHolder: payout.bankAccountHolder || null,
//         mobileBankingNumber: payout.mobileBankingNumber || null,
//       };

//       console.log("4. Sending Vendor Registration Request...", finalPayload);
//       const response = await fetch("http://localhost:8001/api/vendors/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalPayload),
//       });

//       const result = await response.json();
//       console.log("5. Vendor Registration Server Response:", result);

//       if (!response.ok) {
//         throw new Error(result.error || "Failed to save vendor data.");
//       }

//       alert("Vendor application submitted successfully!");
//       setShowOtpModal(false);
//       window.location.href = "/";
//     } catch (error: any) {
//       console.error("❌ CATCH BLOCK ERROR:", error);
//       alert(error?.message || "Something went wrong.");
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   const handleResendOtp = async () => {
//     try {
//       const response = await fetch("http://localhost:8001/api/otp/send-otp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: account.email,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to resend OTP");
//       }

//       setOtpCode("");

//       alert("New OTP sent to your email.");
//     } catch (error: any) {
//       alert(error?.message || "Failed to resend OTP.");
//     }
//   };
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 my-8 relative">
//         {/* Header */}
//         <div className="text-center space-y-2 mb-6">
//           <Link href="/" className="inline-flex items-center gap-2">
//             <div className="bg-amber-500 text-slate-950 font-black text-2xl px-3 py-1 rounded-xl">
//               A
//             </div>
//             <span className="font-extrabold text-2xl text-slate-900">
//               Aladdin<span className="text-amber-500">.</span>
//             </span>
//           </Link>
//           <h2 className="text-xl font-bold text-slate-900 pt-2">
//             Become a Seller
//           </h2>
//           <p className="text-xs text-slate-500">
//             Submit your information for admin review and approval
//           </p>
//         </div>

//         {/* Progress indicator */}
//         <div className="flex items-center mb-7">
//           {STEPS.map((label, i) => (
//             <div key={label} className="flex flex-1 items-center">
//               <div className="flex flex-col items-center gap-1.5">
//                 <div
//                   className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
//                     i < step
//                       ? "bg-emerald-500 text-white"
//                       : i === step
//                         ? "bg-amber-500 text-slate-950"
//                         : "bg-slate-100 text-slate-400"
//                   }`}
//                 >
//                   {i < step ? <Check size={12} /> : i + 1}
//                 </div>
//                 <span className="text-[9.5px] text-slate-500 whitespace-nowrap">
//                   {label}
//                 </span>
//               </div>
//               {i < STEPS.length - 1 && (
//                 <div
//                   className={`mx-1 mt-[-14px] h-[2px] flex-1 ${i < step ? "bg-emerald-500" : "bg-slate-200"}`}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Error Notification Alert */}
//         {errorMessage && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold animate-pulse">
//             ⚠️ {errorMessage}
//           </div>
//         )}

//         {/* Step content */}
//         <div className="mb-7">
//           {step === 0 && <AccountStep data={account} onChange={setAccount} />}
//           {step === 1 && (
//             <BusinessInfoStep data={businessInfo} onChange={setBusinessInfo} />
//           )}
//           {step === 2 && (
//             <VerificationStep data={verification} onChange={setVerification} />
//           )}
//           {step === 3 && <PayoutStep data={payout} onChange={setPayout} />}
//         </div>

//         {/* Navigation */}
//         <div className="flex items-center justify-between gap-3">
//           <button
//             type="button"
//             onClick={() => {
//               setErrorMessage("");
//               setStep((s) => Math.max(0, s - 1));
//             }}
//             className={`text-xs font-semibold text-slate-500 hover:text-slate-700 ${step === 0 ? "invisible" : ""}`}
//           >
//             Back
//           </button>

//           {!isLastStep ? (
//             <button
//               type="button"
//               onClick={handleNextStep}
//               className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
//             >
//               Next <ArrowRight className="w-4 h-4" />
//             </button>
//           ) : (
//             <button
//               type="button"
//               onClick={handleInitiateSubmit}
//               className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-colors"
//             >
//               Submit Application <ArrowRight className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative">
//             <button
//               onClick={() => setShowOtpModal(false)}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <div className="text-center space-y-2">
//               <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
//                 <KeyRound className="w-6 h-6" />
//               </div>
//               <h3 className="font-bold text-slate-900 text-lg">
//                 Enter verification code
//               </h3>
//               <p className="text-xs text-slate-500">
//                 We sent a code to{" "}
//                 <span className="font-semibold text-slate-800">
//                   {account.email}
//                 </span>
//               </p>
//             </div>
//             <input
//               type="text"
//              maxLength={4}
//               placeholder="• • • • • •"
//               value={otpCode}
//               onChange={(e) => setOtpCode(e.target.value)}
//               className="w-full text-center text-xl font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 outline-none focus:border-amber-500"
//             />

//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 className="text-xs text-amber-600 hover:underline font-medium"
//               >
//                 Didn't receive code? Resend
//               </button>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setShowOtpModal(false)}
//                 className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-semibold"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFinalSubmit}
//                 disabled={submitting || otpCode.length < 4}
//                 className="flex-1 bg-amber-500 text-slate-950 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-600 disabled:opacity-50"
//               >
//                 {submitting ? "Verifying..." : "Verify & Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
