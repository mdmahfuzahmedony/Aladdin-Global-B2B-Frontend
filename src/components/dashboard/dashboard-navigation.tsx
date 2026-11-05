"use client";

import { createContext, useContext, useState } from "react";

const DashboardNavigationContext = createContext<{
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
} | null>(null);

export function DashboardNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <DashboardNavigationContext.Provider
      value={{
        isMenuOpen,
        toggleMenu: () => setIsMenuOpen((open) => !open),
        closeMenu: () => setIsMenuOpen(false),
      }}
    >
      {children}
    </DashboardNavigationContext.Provider>
  );
}

export function useDashboardNavigation() {
  const context = useContext(DashboardNavigationContext);

  if (!context) {
    throw new Error(
      "useDashboardNavigation must be used within DashboardNavigationProvider",
    );
  }

  return context;
}
