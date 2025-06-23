import Header from "@/components/global/Header";
import { AppSidebar } from "@/components/global/Sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// https://api.dataforseo.com/v3/keywords_data/google/locations
export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
      <div className="flex flex-col">
      <div className="w-full">
        <SidebarProvider className="relative">
          <Header />
          <div className=" relative flex">
          <AppSidebar />

          <main className="p-4">{children}</main>
         
          </div>
        </SidebarProvider>
        </div>
      </div>
    </>
  );
}


