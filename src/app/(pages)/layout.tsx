"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import MainNavbar from "@/components/layout/Navbar";
import MaintenanceScreen from "@/components/common/MaintenanceScreen";
import { useSiteSettings } from "@/context/SiteSettingsContext";

import { createClient } from "../../../lib/supabase-client";
import LocationModal from "./set-location/LocationModal";

const supabase = createClient();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

type UserRole =
  | "SUPER_ADMIN"
  | "MANAGER"
  | "VENDOR"
  | "AFFILIATE"
  | "WHOLESALER"
  | "CUSTOMER";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings } = useSiteSettings();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const router = useRouter();

  // =====================================================
  // GET SESSION + LISTEN FOR LOGIN/LOGOUT CHANGES
  // =====================================================

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setAccessToken(data.session?.access_token ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // FETCH AUTHENTICATED USER'S ROLE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    setUserRole(null);
    setShowLocationModal(false);

    if (!accessToken) {
      return;
    }

    async function fetchUserRole() {
      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("User role check failed");
        }

        const result = await response.json();

        const role = result?.user?.role ?? result?.role;

        if (!cancelled) {
          setUserRole((role as UserRole) ?? null);
        }
      } catch (error) {
        console.error("User role check error:", error);

        if (!cancelled) {
          setUserRole(null);
        }
      }
    }

    fetchUserRole();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  // =====================================================
  // CHECK LOCATION ONLY FOR CUSTOMER
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    let reminderTimer: ReturnType<typeof setTimeout> | undefined;

    setShowLocationModal(false);

    if (!accessToken || userRole !== "CUSTOMER") {
      return;
    }

    function scheduleReminder() {
      reminderTimer = setTimeout(() => {
        if (!cancelled) {
          setShowLocationModal(true);
        }
      }, 30000);
    }

    async function checkCustomerLocation() {
      try {
        const response = await fetch(`${API_URL}/api/customers/location`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json().catch(() => null);

        // Only schedule for a missing Customer profile,
        // not for an unrelated 404 such as a wrong API route.
        if (
          response.status === 404 &&
          typeof result?.error === "string" &&
          result.error.toLowerCase().includes("customer")
        ) {
          scheduleReminder();
          return;
        }

        if (!response.ok) {
          throw new Error(result?.error || "Customer location check failed");
        }

        const customer = result?.customer;

        if (!customer || cancelled) {
          return;
        }

        const hasLocation = Boolean(
          customer.division?.trim() &&
          customer.district?.trim() &&
          customer.upazila?.trim(),
        );

        const reminderDismissed = customer.locationReminderDismissed === true;

        if (!hasLocation && !reminderDismissed) {
          scheduleReminder();
        }
      } catch (error) {
        console.error("Customer location check error:", error);
      }
    }

    checkCustomerLocation();

    return () => {
      cancelled = true;

      if (reminderTimer) {
        clearTimeout(reminderTimer);
      }
    };
  }, [accessToken, userRole]);

  // =====================================================
  // PERSIST REMINDER DISMISSAL IN DATABASE
  // =====================================================

  async function handleDismissReminder() {
    if (!accessToken) {
      throw new Error("User session not found. Please login again.");
    }

    const response = await fetch(
      `${API_URL}/api/customers/location/reminder/dismiss`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Could not save reminder dismissal");
    }

    setShowLocationModal(false);
  }

  // =====================================================
  // LOCATION SAVED
  // =====================================================

  function handleLocationSaved() {
    setShowLocationModal(false);
  }

  // =====================================================
  // UI
  // =====================================================

  // MAINTENANCE MODE: When ON, show ONLY the maintenance modal/screen without navbar or footer
  if (settings.maintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />

      <main className="min-h-[calc(100vh-80px)]">{children}</main>

      <Footer />

      {userRole === "CUSTOMER" && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onDismiss={handleDismissReminder}
          onSaved={handleLocationSaved}
        />
      )}
    </div>
  );
}
