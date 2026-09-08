const paymentMethods = [
  "Cash on Delivery",
  "bKash",
  "Nagad",
  "Visa",
  "Mastercard",
  "American Express",
];

export function FooterPayment() {
  return (
    <div className="mt-12 border-t border-blue-900 pt-6">
      <div className="flex flex-wrap items-center gap-2">

        <span className="mr-4 font-semibold">
          Payment Options:
        </span>

        {paymentMethods.map((method) => (
          <span
            key={method}
            className="rounded-md bg-[#263b5d] px-4 py-2 text-sm font-semibold"
          >
            {method}
          </span>
        ))}

      </div>
    </div>
  );
}