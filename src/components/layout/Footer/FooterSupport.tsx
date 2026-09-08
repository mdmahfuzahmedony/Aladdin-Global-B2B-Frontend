const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Payment Methods", href: "/payment-methods" },
  { label: "How to shop on Aladdin Global B2B", href: "/how-to-shop" },
  { label: "Terms & Conditions", href: "/terms" },
  {
    label: "Cancellation, Returns & Refunds",
    href: "/returns-refunds",
  },
];

export function FooterSupport() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold">
        Customer Service
      </h3>

      <ul className="space-y-3">
        {supportLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-blue-200 transition hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}