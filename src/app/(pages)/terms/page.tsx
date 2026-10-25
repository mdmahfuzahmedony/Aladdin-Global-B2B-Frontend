import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-amber-500 text-slate-950 font-black text-xl px-2.5 py-0.5 rounded-lg">A</div>
            <span className="font-extrabold text-xl text-slate-900">Aladdin<span className="text-amber-500">.</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 pt-2">Terms & Conditions</h1>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>
        </div>

        {/* Content sections */}
        <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Aladdin Global B2B marketplace, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform or register as a vendor/buyer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">2. Vendor Account Registration</h2>
            <p>
              Vendors must provide accurate legal information, including NID, valid Trade License, and Tax Identification Number (TIN) during registration. Providing false information will result in immediate suspension of the account and forfeiture of pending payouts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">3. Commission & Payouts</h2>
            <p>
              Aladdin charges a pre-defined commission rate on successful transactions. Payouts are processed via Bank transfer, bKash, or Nagad according to the payout settings selected by the vendor after admin verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">4. Prohibited Activities</h2>
            <p>
              Users and vendors are strictly prohibited from listing counterfeit products, engaging in fraudulent transactions, or attempting to breach the security infrastructure of the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-slate-900 text-sm">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes your acceptance of the new terms.
            </p>
          </section>
        </div>

        <div className="border-t border-slate-100 pt-6 text-center">
          <Link href="/" className="text-xs font-bold text-amber-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}