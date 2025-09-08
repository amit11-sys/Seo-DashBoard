import {
  getDbLiveKeywordData,
} from "@/actions/keywordTracking";
// import { getKeywordLiveData } from "@/actions/liveKeywords";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import ClientDashboard from "@/components/ClientDashboard"; // client component
import { getCurrentCampaignIdData } from "@/actions/campaign";

export default async function DashboardDetails({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId } = params;

  const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);
  // const location_and_language = await getLocation_languageData();

  // console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData in page");

  const CurrentCampaignData = await getCurrentCampaignIdData(campaignId);

  

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="flex flex-1 pt-[80px] overflow-hidden">
        <aside className="w-[250px] bg-[#1E2A38] h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper  />
        </aside>

        <main className="ml-[250px] flex-1 overflow-y-auto bg-slate-100 p-4">
          <ClientDashboard
          CurrentCampaignData={CurrentCampaignData}
            campaignLiveKeywordsData={campaignLiveKeywordsData}
            campaignId={campaignId}
          />
        </main>
      </div>
    </section>
  );
}
