const accountLinks = [
  { label: "Sign In", href: "/login" },
  { label: "My Orders", href: "/account/orders" },
  { label: "My Wishlist", href: "/account/wishlist" },
  { label: "My Coupons", href: "/account/coupons" },
  { label: "Track My Order", href: "/track-order" },
  { label: "Order History", href: "/account/history" },
  { label: "Messages", href: "/account/messages" },
];

export function FooterAccount() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold">
        My Account
      </h3>

      <ul className="space-y-3">
        {accountLinks.map((link) => (
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