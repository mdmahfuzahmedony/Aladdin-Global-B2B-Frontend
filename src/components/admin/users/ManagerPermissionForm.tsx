"use client";

import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Package,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";

export type ManagerPermission = {
  moduleName: string;
  accessLevel: "full";
};

type Props = {
  permissions: ManagerPermission[];
  setPermissions: React.Dispatch<
    React.SetStateAction<ManagerPermission[]>
  >;
};

const modules = [
  {
    name: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "users",
    label: "Users",
    icon: Users,
  },
  {
    name: "vendors",
    label: "Vendors",
    icon: Store,
  },
  {
    name: "wholesalers",
    label: "Wholesalers",
    icon: ShoppingBag,
  },
  {
    name: "products",
    label: "Products",
    icon: Package,
  },
  {
    name: "orders",
    label: "Orders",
    icon: ClipboardList,
  },
  {
    name: "reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    name: "settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function ManagerPermissionForm({
  permissions,
  setPermissions,
}: Props) {
  function togglePermission(moduleName: string) {
    setPermissions((prev) => {
      const exists = prev.some(
        (item) => item.moduleName === moduleName
      );

      if (exists) {
        return prev.filter(
          (item) => item.moduleName !== moduleName
        );
      }

      return [
        ...prev,
        {
          moduleName,
          accessLevel: "full",
        },
      ];
    });
  }

  function isChecked(moduleName: string) {
    return permissions.some(
      (item) => item.moduleName === moduleName
    );
  }

  return (
    <div className="mt-5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[#12233F]">
          Manager Permissions
        </h3>

        <p className="mt-1 text-[11px] text-slate-400">
          Select which sections this manager can access.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const checked = isChecked(module.name);

          return (
            <label
              key={module.name}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                checked
                  ? "border-[#12233F] bg-slate-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  togglePermission(module.name)
                }
                className="h-4 w-4 rounded border-slate-300"
              />

              <Icon
                size={17}
                className="text-[#12233F]"
              />

              <span className="text-xs font-semibold text-slate-700">
                {module.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}