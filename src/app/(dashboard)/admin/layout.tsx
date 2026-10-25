import { AdminNavbar } from "@/components/header/admin-navbar";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-0 bg-slate-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}