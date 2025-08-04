import {
  getDbLiveKeywordData,
} from "@/actions/keywordTracking";
import Navbar from "@/components/Common/Navbar";
// import { getKeywordLiveData } from "@/actions/liveKeywords";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
// import { getLocation_languageData } from "@/actions/locations_Language";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import SearchAnalytics from "@/components/SearchAnalytics/SearchAnalytics";
import APIKeyword from "@/lib/KeywordApi.json";
export default async function DashboardDetails({
  params,
}: {
  // params: Promise<{ campaignId: string }>;
  params: { campaignId: string };
}) {
  const { campaignId } = await params;
  const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);
  // const location_and_language = await getLocation_languageData();

  console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData in page");

 

  return (
    
  <section className="relative h-screen flex flex-col overflow-hidden">
     
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* <Header /> */}
        <Navbar/>

      </div>

    
      <div className="flex flex-1 pt-[80px] overflow-hidden">
       
        <aside className="w-[250px]   h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper />
        </aside>

     
        <main className="ml-[250px] flex-1 overflow-y-auto  p-4">
          {/* <SearchAnalytics /> */}
          <Header  campaignId={campaignId} />
          <LiveKeywordComponent
            campaignLiveKeywordsData={campaignLiveKeywordsData}
            campaignId={campaignId}
          />
        </main>
      </div>
    </section>
  );
}
