import { getDbLiveKeywordDataWithSatusCode } from "@/actions/keywordTracking";
import Navbar from "@/components/Common/Navbar";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import { getArchivedCampaign, getGetCampaignByid } from "@/actions/campaign";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import Footer from "@/components/Common/Footer";

export default async function DashboardDetails({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId } = params;
  const campignDataWithId = await getGetCampaignByid(campaignId);
  const campaignStatus = campignDataWithId?.campaign?.status;

  const campaignLiveKeywordsData = await getDbLiveKeywordDataWithSatusCode(
    campaignId,
    campaignStatus
  );
  // console.log(campaignStatus, "campaignStatus");

  const archivedCampaignData = await getArchivedCampaign();

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar campaignId={campaignId as string} />
      </div>

      <div id="main-scroll-container" className="flex flex-1 pt-[80px] overflow-hidden">
        <aside className="w-[250px]   h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            campaignId={campaignId as string}
            archivedCampaignData={
              archivedCampaignData?.KeywordTrackingDataArchied ?? []
            }
          />
        </aside>

        <main  className="ml-[250px] relative flex-1 overflow-y-auto p-4">
          <Header
            campaignStatus={campaignStatus}
            topRankData={campaignLiveKeywordsData.topRankData}
            campaignId={campaignId}
          />

          <SearchConsoleData campaignId={campaignId} />
          <LiveKeywordComponent
            campaignStatus={campaignStatus}
            campaignId={campaignId}
          />
          <Footer mainContainerId="main-scroll-container" />
        </main>
      </div>
    </section>
  );
}
