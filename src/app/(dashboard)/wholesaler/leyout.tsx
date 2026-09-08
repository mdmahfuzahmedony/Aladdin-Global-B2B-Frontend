import { WholesalerNavbar } from "@/components/navbar/wholesaler-navbar";
import { WholesalerSidebar } from "@/components/sidebar/wholesaler-sidebar";


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