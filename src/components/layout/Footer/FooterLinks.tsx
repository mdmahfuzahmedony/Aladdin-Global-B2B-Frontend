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
  { label: "E-cab members ID", href: "/e-cab" },
  { label: "Trade License", href: "/trade-license" },
  { label: "DBID", href: "/dbid" },
  { label: "VAT Reg", href: "/vat" },
];

export function FooterLinks() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold">
        About Company
      </h3>

      <ul className="space-y-3">
        {companyLinks.map((link) => (
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