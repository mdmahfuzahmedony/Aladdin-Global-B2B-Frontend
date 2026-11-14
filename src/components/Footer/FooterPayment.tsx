
import { Truck } from "lucide-react";

export function FooterPayment() {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#12233F]">
        Payment Options:
      </h4>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Truck size={22} className="text-[#12233F]" />

          <div>
            <p className="text-xs font-bold text-black">
              Cash on Delivery
            </p>
            <p className="text-[10px] text-slate-500">
              Pay when you receive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
