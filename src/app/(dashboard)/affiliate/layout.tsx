import { AffiliateNavbar } from "@/components/header/affiliate-navbar";
import { AffiliateSidebar } from "@/components/sidebar/affiliate-sidebar";
import { DashboardNavigationProvider } from "@/components/dashboard/dashboard-navigation";

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardNavigationProvider>
      <div className="flex h-screen bg-slate-50">
        <AffiliateSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AffiliateNavbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </DashboardNavigationProvider>
  );
}
