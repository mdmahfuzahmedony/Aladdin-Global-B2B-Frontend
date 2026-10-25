"use client";


import { Smartphone } from "lucide-react";

export type PaymentMethodType = "bkash" | "nagad";

type Props = {
  deliveryCharge?: number;
  method?: PaymentMethodType;
  onMethodChange?: (method: PaymentMethodType) => void;
};

export default function PaymentMethod({
  deliveryCharge = 0,
  method = "bkash",
  onMethodChange = () => {},
}: Props) {
  const methods: {
    id: PaymentMethodType;
    title: string;
  }[] = [
    { id: "bkash", title: "bKash" },
    { id: "nagad", title: "Nagad" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-[#12233f]">
        Payment Method
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Pay the delivery charge in advance.
      </p>

      <div className="mt-5 space-y-3">
        {methods.map((item) => {
          const active = method === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onMethodChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${
                active
                  ? "border-[#f59e0b] bg-amber-50"
                  : "border-slate-200"
              }`}
            >
              <Smartphone size={20} />

              <span className="flex-1 font-semibold text-slate-800">
                {item.title}
              </span>

              <span className="text-sm text-slate-500">
                {active ? "Selected" : "Select"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl bg-amber-50 p-4">
        <p className="text-sm text-slate-600">
          Pay now — delivery charge only
        </p>

        <p className="mt-1 text-2xl font-extrabold text-[#12233f]">
          ৳{Number(deliveryCharge).toLocaleString("en-BD")}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Product price will be collected at delivery.
        </p>
      </div>
    </section>
  );
}
