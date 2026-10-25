import Link from "next/link";

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Payment Methods", href: "/payment-methods" },
];

export function FooterSupport() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold tracking-tight text-[#12233F] sm:text-base">
        Customer Service
      </h3>

      <ul className="space-y-2">
        {supportLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-slate-600 transition-colors duration-200 hover:text-[#12233F] hover:underline sm:text-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}