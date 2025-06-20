import Header from "@/components/global/Header";
import { AppSidebar } from "@/components/global/Sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// https://api.dataforseo.com/v3/keywords_data/google/locations
export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
      <div className="flex flex-col">
      <div>
        <SidebarProvider className="relative">
          <AppSidebar />
          <div className="flex-1">
          <Header />
          <main className="p-4">{children}</main>
          </div>
        </SidebarProvider>
        </div>
      </div>
    </>
  );
}


