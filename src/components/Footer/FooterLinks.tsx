import Link from "next/link";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Aladdin Global B2B Certified", href: "/certified" },
  { label: "Shipping or Delivery", href: "/shipping" },
  { label: "Affiliate", href: "/affiliate" },
  { label: "Site Map", href: "/sitemap" },
  { label: "Dropshop", href: "/dropshop" },
  { label: "Partnership", href: "/partnership" },
  { label: "Investors", href: "/investors" },
  { label: "Donates", href: "/donates" },
];

export function FooterLinks() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold tracking-tight text-[#12233F] sm:text-base">
        About Company
      </h3>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {companyLinks.map((link) => (
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