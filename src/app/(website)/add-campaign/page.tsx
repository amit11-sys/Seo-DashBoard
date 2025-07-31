export const dynamic = "force-dynamic";
import React from "react";
import TabsComponents from "@/components/Compaign/TabsComponents";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";

const AddCamapign = async () => {
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Below header layout: flex-row with sidebar and content */}
      <div className="flex flex-1 pt-[80px] overflow-hidden">
        {/* Fixed Sidebar */}
        <aside className="w-[250px] bg-[#1E2A38] h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper />
        </aside>

        {/* Scrollable Right Content */}
        <main className="ml-[250px] flex-1 overflow-y-auto bg-slate-100 p-4">
          <TabsComponents />
        </main>
      </div>
    </section>
  );
};

export default AddCamapign;
