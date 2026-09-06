import { ArrowRight, BadgeCheck, Globe2, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center">
        {/* লোগো টাইপ লেখা */}
        <h2 className="text-sm font-bold text-brand-gold uppercase tracking-[0.3em] mb-2">
          Official Wholesale Platform
        </h2>

        {/* মেইন ওয়েলকাম মেসেজ */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-navy">
          Welcome to <span className="text-brand-gold">Aladdin Global B2B</span>
        </h1>

        {/* সাব টেক্সট */}
        <p className="mt-4 text-gray-500 text-lg max-w-lg mx-auto">
          Start your professional journey with Bangladeshs most reliable premium marketplace.
        </p>

        {/* সাধারণ বাটন টেস্টিং */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="btn-gold">Explore Now</button>
          <button className="btn-navy text-sm px-6 py-2 rounded-lg bg-[#12233F] text-white">Login Area</button>
        </div>
      </div>
    </main>
  );
}