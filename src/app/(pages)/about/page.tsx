"use client";

import Link from "next/link";
import { Building2, ShieldCheck, Truck, Users, ArrowRight } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="w-full bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 sm:text-sm">
            About Aladdin Global B2B
          </span>
          <h1 className="mt-4 text-3xl font-black text-[#12233F] sm:text-4xl lg:text-5xl">
            Empowering Wholesale Trade Across Bangladesh
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
            Aladdin Global B2B is a premier online B2B platform designed to connect wholesale buyers and verified suppliers with authentic products, transparent pricing, and seamless supply chain solutions.
          </p>
        </div>

        {/* MISSION & VISION GRID */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-600">
              <Building2 size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#12233F]">Comprehensive B2B Catalog</h3>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Access a diverse selection of high-quality products sourced directly from trusted manufacturers and importers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Users size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#12233F]">Built for Businesses</h3>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Tailored specifically for retailers, wholesalers, and corporate buyers seeking efficient bulk procurement.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#12233F]">Verified Suppliers</h3>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              We partner with verified vendors to ensure product authenticity, competitive pricing, and fair transactions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <Truck size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#12233F]">Reliable Delivery</h3>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Fast, dependable shipping logistics engineered to keep your business inventory moving smoothly.
            </p>
          </div>
        </div>

        {/* DETAILED CONTENT SECTION */}
        <div className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#12233F] sm:text-3xl">
                Who We Are & What We Stand For
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base">
                Aladdin Global B2B is built to revolutionize wholesale commerce in Bangladesh. We bring together buyers, distributors, and manufacturers into a single digital ecosystem where sourcing products is fast, reliable, and cost-effective.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base">
                Whether you are a local retailer scaling up inventory or a supplier reaching new markets nationwide, our platform provides end-to-end support—from product discovery to doorstep fulfillment.
              </p>

              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#12233F] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#1d3557] sm:text-sm"
                >
                  Explore Products
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center shadow-inner">
                <span className="text-4xl font-black text-amber-500">100%</span>
                <h4 className="mt-1 text-base font-bold text-[#12233F]">Genuine Products</h4>
                <p className="mt-2 text-xs text-slate-500">
                  Direct sourcing ensures maximum quality and authentic wholesale deals for every registered business.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}