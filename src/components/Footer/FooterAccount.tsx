import Link from "next/link";

const accountLinks = [
  { label: "Sign In", href: "/login" },
  { label: "My Orders", href: "/my-orders" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "My Coupons", href: "/coupons" },
  { label: "Track My Order", href: "/track-order" },
  { label: "Order History", href: "/history" },
  { label: "Messages", href: "/messages" },
];

export function FooterAccount() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold tracking-tight text-[#12233F] sm:text-base">
        My Account
      </h3>

      <ul className="space-y-2">
        {accountLinks.map((link) => (
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