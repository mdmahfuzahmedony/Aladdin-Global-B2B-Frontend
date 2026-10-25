"use client";

type UserRole =
  | "SUPER_ADMIN"
  | "CUSTOMER"
  | "VENDOR"
  | "WHOLESALER"
  | "MANAGER"
  | "AFFILIATE";

type UserRoleBadgeProps = {
  role: UserRole;
};

export default function UserRoleBadge({
  role,
}: UserRoleBadgeProps) {
  const config: Record<
    UserRole,
    {
      label: string;
      className: string;
    }
  > = {
    SUPER_ADMIN: {
      label: "Super Admin",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    CUSTOMER: {
      label: "Customer",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
    },

    VENDOR: {
      label: "Vendor",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    WHOLESALER: {
      label: "Wholesaler",
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    MANAGER: {
      label: "Manager",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    AFFILIATE: {
      label: "Affiliate",
      className:
        "bg-pink-50 text-pink-700 border-pink-200",
    },
  };

  const item = config[role] ?? config.CUSTOMER;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}