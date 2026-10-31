"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Clock3, Loader2, X } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  entityId?: string | null;
  entityType?: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

type NotificationPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
  onUnreadCountChange?: (count: number) => void;
};

export default function NotificationPanel({
  isOpen,
  onClose,
  accessToken,
  onUnreadCountChange,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch notifications");
      }

      const data: NotificationItem[] = result?.data || [];

      setNotifications(data);

      onUnreadCountChange?.(
        data.filter((notification) => !notification.isRead).length,
      );
    } catch (error) {
      console.error("GET NOTIFICATIONS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, accessToken]);

  const handleMarkAsRead = async (notification: NotificationItem) => {
    if (notification.isRead || !accessToken) return;

    try {
      setMarkingId(notification.id);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/notifications/${notification.id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to mark notification as read",
        );
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        ),
      );

      onUnreadCountChange?.(
        notifications.filter(
          (item) => !item.isRead && item.id !== notification.id,
        ).length,
      );
    } catch (error) {
      console.error("MARK NOTIFICATION READ ERROR:", error);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!accessToken || notifications.every((item) => item.isRead)) {
      return;
    }

    try {
      setMarkingAll(true);

      const response = await fetch(
        `${API_BASE_URL}/api/admin/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to mark all notifications as read",
        );
      }

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      onUnreadCountChange?.(0);
    } catch (error) {
      console.error("MARK ALL NOTIFICATIONS READ ERROR:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const formatNotificationTime = (date: string) => {
    const notificationDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - notificationDate.getTime();

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-slate-900/20"
      />

      {/* Notification Panel */}
      <aside className="fixed right-3 top-16 z-[100] flex w-[calc(100%-1.5rem)] max-w-[420px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl sm:right-4 sm:top-[4.5rem] sm:w-[420px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#12233F] text-white">
              <Bell size={17} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#12233F]">
                  Notifications
                </h2>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#D64545] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Important updates and requests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5 sm:px-5">
            <span className="text-[11px] text-slate-500">
              {unreadCount} unread notification
              {unreadCount > 1 ? "s" : ""}
            </span>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#12233F] transition hover:text-[#D6A419] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <CheckCheck size={13} />
              )}
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="animate-spin text-[#12233F]" />
                <p className="text-xs text-slate-500">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Bell size={21} className="text-slate-400" />
              </div>

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No notifications
              </h3>

              <p className="mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
                You are all caught up. Important requests and updates will
                appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleMarkAsRead(notification)}
                  className={`flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50 sm:px-5 ${
                    !notification.isRead ? "bg-blue-50/40" : "bg-white"
                  }`}
                >
                  {/* Status */}
                  <div className="relative mt-1 shrink-0">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        notification.isRead
                          ? "bg-slate-100 text-slate-400"
                          : "bg-[#12233F] text-white"
                      }`}
                    >
                      <Bell size={15} />
                    </div>

                    {!notification.isRead && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#D64545]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`line-clamp-1 text-[13px] ${
                          notification.isRead
                            ? "font-medium text-slate-700"
                            : "font-bold text-[#12233F]"
                        }`}
                      >
                        {notification.title}
                      </h3>

                      {markingId === notification.id ? (
                        <Loader2
                          size={14}
                          className="mt-0.5 shrink-0 animate-spin text-slate-400"
                        />
                      ) : null}
                    </div>

                    <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-500">
                      {notification.message}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock3 size={11} />
                      <span>
                        {formatNotificationTime(notification.createdAt)}
                      </span>

                      {notification.type && (
                        <>
                          <span>•</span>
                          <span className="uppercase tracking-wide">
                            {notification.type.replaceAll("_", " ")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
