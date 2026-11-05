import { WholesalerNavbar } from "@/components/header/wholesaler-navbar";
import { WholesalerSidebar } from "@/components/sidebar/wholesaler-sidebar";
import { DashboardNavigationProvider } from "@/components/dashboard/dashboard-navigation";

export default function WholesalerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardNavigationProvider>
      <div className="flex h-screen bg-slate-50">
        <WholesalerSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <WholesalerNavbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </DashboardNavigationProvider>
  );
}
