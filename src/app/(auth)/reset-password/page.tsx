"use client";
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

// export default function ResetPasswordPage() {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password === confirmPassword) {
//       setIsSuccess(true);
//     } else {
//       alert("Passwords do not match!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
//         <div className="text-center space-y-2 mb-6">
//           <Link href="/" className="inline-flex items-center gap-2 mb-2">
//             <div className="bg-amber-500 text-slate-950 font-extrabold text-2xl px-3 py-1 rounded-xl">
//               A
//             </div>
//           </Link>
//           <h2 className="text-xl font-semibold text-white">Set New Password</h2>
//           <p className="text-xs text-slate-400">Please enter your new password below.</p>
//         </div>

//         {isSuccess ? (
//           <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-3">
//             <CheckCircle2 className="w-10 h-10 text-amber-500 mx-auto" />
//             <p className="text-xs text-slate-200">
//               Your password has been successfully reset!
//             </p>
//             <Link
//               href="/sign-in"
//               className="block w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs hover:bg-amber-600 transition-colors"
//             >
//               Sign In Now
//             </Link>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   required
//                   placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors mt-2"
//             >
//               Update Password
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { updatePassword } from "../../../../lib/auth-helpers";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦•à¦®à¦ªà¦•à§à¦·à§‡ à§® à¦•à§à¦¯à¦¾à¦°à§‡à¦•à§à¦Ÿà¦¾à¦° à¦¹à¦¤à§‡ à¦¹à¦¬à§‡");
      return;
    }
    if (password !== confirmPassword) {
      setError("à¦¦à§à¦Ÿà§‹ à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦®à¦¿à¦²à¦›à§‡ à¦¨à¦¾");
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      router.push("/sign-in");
    } catch (err) {
      setError("à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿, à¦²à¦¿à¦™à§à¦•à¦Ÿà¦¾ à¦®à§‡à¦¯à¦¼à¦¾à¦¦à§‹à¦¤à§à¦¤à§€à¦°à§à¦£ à¦¹à¦¤à§‡ à¦ªà¦¾à¦°à§‡");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-amber-500 text-slate-950 font-black text-2xl px-3 py-1 rounded-xl">
              A
            </div>
            <span className="font-extrabold text-2xl text-slate-900">
              Aladdin<span className="text-amber-500">.</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 pt-2">
            à¦¨à¦¤à§à¦¨ à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦¸à§‡à¦Ÿ à¦•à¦°à§à¦¨
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              à¦¨à¦¤à§à¦¨ à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦†à¦¬à¦¾à¦° à¦²à¦¿à¦–à§à¦¨
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="à¦†à¦—à§‡à¦°à¦Ÿà¦¾ à¦†à¦¬à¦¾à¦° à¦²à¦¿à¦–à§à¦¨"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {submitting ? "à¦†à¦ªà¦¡à§‡à¦Ÿ à¦¹à¦šà§à¦›à§‡..." : "à¦ªà¦¾à¦¸à¦“à¦¯à¦¼à¦¾à¦°à§à¦¡ à¦†à¦ªà¦¡à§‡à¦Ÿ à¦•à¦°à§à¦¨"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}