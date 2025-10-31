import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 bg-[#F9F9F9]">
        <Header />
        <div className="flex-1 p-4 bg-[f9f9f9]">{children}</div>
      </main>
    </SidebarProvider>
  );
}