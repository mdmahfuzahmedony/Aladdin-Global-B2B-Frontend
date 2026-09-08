import { WholesalerSidebar } from "@/components/layout/sidebar/wholesaler-sidebar";
import { WholesalerNavbar } from "@/components/layout/navbar/wholesaler-navbar";

export default function WholesalerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <WholesalerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <WholesalerNavbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}