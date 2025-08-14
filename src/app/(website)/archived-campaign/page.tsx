export const dynamic = "force-dynamic";
import React from "react";

import SidebarWrapper from "@/components/Common/SidebarWrapper";

import Navbar from "@/components/Common/Navbar";
import { getArchivedCampaign } from "@/actions/campaign";
import ArchivedCampaignTable from "@/components/ArchivedCompaign/ArchivedCampaignTable";

const ArchivedCampaign = async () => {
  const archivedCampaignData = await getArchivedCampaign();
  console.log(archivedCampaignData, "archivedCampaignData in Achi");

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Below header layout: flex-row with sidebar and content */}
      <div className="flex flex-1 pt-[80px] overflow-hidden">
        {/* Fixed Sidebar */}
        <aside className="w-[250px] bg-[#1E2A38] h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            archivedCampaignData={
              archivedCampaignData?.KeywordTrackingDataArchied
            }
          />
        </aside>

        {/* Scrollable Right Content */}
        <main className="ml-[250px] flex-1 overflow-y-auto bg-slate-100 p-4">
          <ArchivedCampaignTable
            archivedCampaignData={
              archivedCampaignData?.KeywordTrackingDataArchied
            }
          />
        </main>
      </div>
    </section>
  );
};

export default ArchivedCampaign;
