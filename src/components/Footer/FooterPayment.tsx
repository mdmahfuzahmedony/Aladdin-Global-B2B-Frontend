const paymentMethods = [
  "Cash on Delivery",
  // "bKash",
  // "Nagad",
];

export function FooterPayment() {
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#12233F]">
        Payment Options:
      </h4>

      <div className="flex flex-wrap items-center gap-1.5">
        {paymentMethods.map((method) => (
          <span
            key={method}
            className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  );
}