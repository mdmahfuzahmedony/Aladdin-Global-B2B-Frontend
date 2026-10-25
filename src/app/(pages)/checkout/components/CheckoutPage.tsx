"use client";


import { useState } from "react";
import { ShieldCheck, ShoppingBag } from "lucide-react";

import CustomerBilling from "./CustomerBilling";
import WholesalerBilling from "./WholesalerBilling";
import DropshipBilling from "./DropshipBilling";
import OrderSummary from "./OrderSummary";

type Role = "customer" | "wholesaler" | "dropshipper";

type Props = {
  role: Role;
};

export type CustomerShippingData = {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postalCode?: string;
};

const emptyShipping: CustomerShippingData = {
  fullName: "",
  phone: "",
  email: "",
  division: "",
  district: "",
  upazila: "",
  address: "",
  postalCode: "",
};

export default function CheckoutPage({ role }: Props) {
  const [shipping, setShipping] =
    useState<CustomerShippingData>(emptyShipping);

  return (
    <main className="min-h-screen bg-[#f5f6fa]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#f59e0b]">
                <ShoppingBag size={20} />
              </div>

              <h1 className="text-xl font-extrabold text-[#12233f]">
                Checkout
              </h1>
            </div>

            <p className="mt-1 pl-11 text-xs text-slate-500">
              Complete your order securely
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 sm:flex">
            <ShieldCheck size={16} />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Buyer Type
          </p>

          <div className="mt-2 inline-flex rounded-full bg-[#12233f] px-4 py-2 text-sm font-bold capitalize text-white shadow-sm">
            {role}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="min-w-0">
            {role === "customer" && (
              <CustomerBilling onShippingChange={setShipping} />
            )}

            {role === "wholesaler" && <WholesalerBilling />}

            {role === "dropshipper" && <DropshipBilling />}
          </section>

          <aside className="min-w-0 lg:sticky lg:top-24">
            <OrderSummary
              role={role}
              shipping={shipping}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
