"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const labels = [
    t("signIn"),
    t("myOrders"),
    t("myWishlist"),
    t("myCoupons"),
    t("trackOrder"),
    t("orderHistory"),
    t("messages"),
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold tracking-tight text-[#12233F] sm:text-base">
        {t("myAccount")}
      </h3>

      <ul className="space-y-2">
        {accountLinks.map((link, index) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs text-slate-600 transition-colors duration-200 hover:text-[#12233F] hover:underline sm:text-sm"
            >
              {labels[index]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}