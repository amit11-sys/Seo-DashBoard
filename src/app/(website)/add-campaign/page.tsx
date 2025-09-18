export const dynamic = 'force-dynamic';
import React from "react";
import TabsComponents from "@/components/Compaign/TabsComponents";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import SearchAnalytics from "@/components/SearchAnalytics/SearchAnalytics";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import { Nav } from "@/components/ui/nav";
import Navbar from "@/components/Common/Navbar";
import { getArchivedCampaign } from "@/actions/campaign";


// import { useCampaignData } from "@/app/context/CampaignContext";

const AddCamapign = async () => {
 



 
  const archivedCampaignData = await getArchivedCampaign();
  console.log(archivedCampaignData,"archivedCampaignData");

// const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
// const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

// const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

// async function fetchLocations() {
//   const res = await fetch('https://api.dataforseo.com/v3/serp/google/locations', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Basic ${basicAuth}`,
//     }
//   });

//   if (!res.ok) {
//     console.error("Failed to fetch locations:", res.status);
//     return;
//   }

//   const data = await res.json();
//   console.log("Locations:", data.tasks[0].result);
// }

// fetchLocations();




  return (
     <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar   />
      </div>

      {/* Below header layout: flex-row with sidebar and content */}
      <div className="flex flex-1 pt-[80px] overflow-hidden">
        {/* Fixed Sidebar */}
        <aside className="w-[250px] bg-[#1E2A38] h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper  archivedCampaignData={archivedCampaignData?.KeywordTrackingDataArchied}  />
        </aside>

        {/* Scrollable Right Content */}
        <main className="ml-[250px] flex-1 overflow-y-auto bg-slate-100 p-4">
           <TabsComponents/>
        </main>
      </div>
    </section>
   
  );
};

export default AddCamapign;
