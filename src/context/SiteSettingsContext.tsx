"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type SiteSettings = {
  siteName: string;
  logoUrl: string | null;
  supportEmail: string;
  contactNumber: string;
  address: string;
  currency: string;
  timezone: string;
  maintenance: boolean;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "Aladin Global B2B",
  logoUrl: null,
  supportEmail: "support@aladdinglobalb2b.com",
  contactNumber: "01322-130929",
  address: "Holding No: Gohata, Road Jashore, Jashore, Bangladesh — 7400",
  currency: "BDT",
  timezone: "Asia/Dhaka",
  maintenance: false,
};

type SiteSettingsContextType = {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateLocalSettings: (newSettings: Partial<SiteSettings>) => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSiteSettings,
  isLoading: true,
  refreshSettings: async () => {},
  updateLocalSettings: () => {},
});

const STORAGE_KEY = "aladin_site_settings";
const EVENT_NAME = "aladin:settings_updated";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          return { ...defaultSiteSettings, ...JSON.parse(cached) };
        }
      } catch {
        // Ignore
      }
    }
    return defaultSiteSettings;
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1. Refresh from localStorage if window loads
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // 2. Fetch fresh settings from Backend
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return;

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const updated: SiteSettings = {
          siteName: d.siteName || defaultSiteSettings.siteName,
          logoUrl: d.logoUrl || null,
          supportEmail: d.supportEmail || defaultSiteSettings.supportEmail,
          contactNumber: d.contactNumber || defaultSiteSettings.contactNumber,
          address: d.address || defaultSiteSettings.address,
          currency: d.currency || defaultSiteSettings.currency,
          timezone: d.timezone || defaultSiteSettings.timezone,
          maintenance: Boolean(d.maintenance),
        };

        setSettings(updated);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore
        }
      }
    } catch (err) {
      console.warn("Failed to fetch site settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  // 3. Listen for custom events across tabs or components
  const updateLocalSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore
      }
      return merged;
    });

    try {
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, { detail: newSettings })
      );
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    const handleCustomUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<SiteSettings>>;
      if (customEvent.detail) {
        setSettings((prev) => ({ ...prev, ...customEvent.detail }));
      }
    };

    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings,
        updateLocalSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
