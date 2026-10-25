"use client";

import { useEffect, useState } from "react";
import { Search, Bell, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { createClient } from "../../../lib/supabase-client";
import NotificationPanel from "./navbar/NotificationPanel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function AdminNavbar() {
  const supabase = createClient();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // ================= AUTH SESSION =================

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("GET SESSION ERROR:", error);
          return;
        }

        setAccessToken(data.session?.access_token || null);
      } catch (error) {
        console.error("GET SESSION ERROR:", error);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // ================= UNREAD NOTIFICATION COUNT =================

  useEffect(() => {
    if (!accessToken) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/notifications/unread-count`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message || "Failed to fetch notification count",
          );
        }

        setUnreadCount(Number(result?.count || 0));
      } catch (error) {
        console.error("GET UNREAD NOTIFICATION COUNT ERROR:", error);
      }
    };

    fetchUnreadCount();
  }, [accessToken]);

  // ================= SIGN OUT =================

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("SIGN OUT ERROR:", error);
        return;
      }

      setMenuOpen(false);
      setNotificationOpen(false);
    } catch (error) {
      console.error("SIGN OUT ERROR:", error);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 sm:px-4 lg:px-6">
        {/* ================= SEARCH ================= */}
        <div className="flex min-w-0 max-w-sm flex-1 items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
          <Search size={16} className="shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Seller, order, product খুঁজুন..."
            className="w-full min-w-0 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
          />
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-5">
          {/* ================= NOTIFICATION ================= */}
          <button
            type="button"
            onClick={() => {
              setNotificationOpen((value) => !value);
              setMenuOpen(false);
            }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notifications"
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D64545] px-1 text-[9px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* ================= PROFILE ================= */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setMenuOpen((value) => !value);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 hover:bg-slate-100 sm:gap-2 sm:px-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12233F] text-[13px] font-semibold text-white">
                A
              </div>

              <div className="hidden text-left leading-tight sm:block">
                <div className="text-[13px] font-medium text-slate-800">
                  Admin
                </div>

                <div className="text-[11px] text-slate-500">Super Admin</div>
              </div>

              <ChevronDown size={15} className="text-slate-400" />
            </button>

            {/* ================= DROPDOWN ================= */}
            {menuOpen && (
              <div className="absolute right-0 top-full z-[110] mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-slate-50"
                >
                  <UserCircle size={15} />
                  প্রোফাইল
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[#D64545] hover:bg-slate-50"
                >
                  <LogOut size={15} />
                  সাইন আউট
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= NOTIFICATION PANEL ================= */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        accessToken={accessToken}
        onUnreadCountChange={setUnreadCount}
      />
    </>
  );
}
