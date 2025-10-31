import { getDbLiveKeywordDataWithSatusCode } from "@/actions/keywordTracking";
import Navbar from "@/components/Common/Navbar";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import { getArchivedCampaign, getGetCampaignByid } from "@/actions/campaign";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import Footer from "@/components/Common/Footer";
import SearchAnalytics from "@/components/SearchAnalytics/SearchAnalytics";
import { getActiveUser } from "@/actions/user";

export default async function DashboardDetails({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId } = params;
  const campignDataWithId = await getGetCampaignByid(campaignId);

  const campaignStatus = campignDataWithId?.campaign?.status;

  const activeUserId = campignDataWithId?.user?.id;

  const ActiveUserData = await getActiveUser(activeUserId ||"");
  // console.log(activeUserId,"activeUserIdinDashboardDetails");
  // console.log(ActiveUserData,"ActiveUserDataDashboardDetails");
  // console.log(campignDataWithId,"campignDataWithId");

  const campaignLiveKeywordsData = await getDbLiveKeywordDataWithSatusCode(
    campaignId,
    campaignStatus
  );
  // console.log(campaignStatus, "campaignStatus");

  // const archivedCampaignData = await getArchivedCampaign();

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar ActiveUserData={ActiveUserData?.user as any} campaignId={campaignId as string} />
      </div>

      <div
        id="main-scroll-container"
        className="flex flex-1 pt-[80px] overflow-hidden"
      >
        <aside className="w-[250px]   h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            campaignId={campaignId as string}
            // archivedCampaignData={
            //   archivedCampaignData?.KeywordTrackingDataArchied ?? []
            // }
          />
        </aside>

        <main className="ml-[250px] relative flex-1 overflow-y-auto p-10 bg-gray-100">
          <Header
            campaignStatus={campaignStatus}
            topRankData={campaignLiveKeywordsData.topRankData}
            campaignId={campaignId}
            ActiveUserData={ActiveUserData?.user as any}
          />
          <LiveKeywordComponent
          ActiveUserData={ActiveUserData?.user as any}
            campaignStatus={campaignStatus}
            campaignId={campaignId}
          />
          <SearchConsoleData ActiveUserData={ActiveUserData?.user as any} campaignId={campaignId} />
          <SearchAnalytics
          ActiveUserData={ActiveUserData?.user as any}
            campignDataWithId={campignDataWithId}
            campaignId={campaignId}
          />

          
          <Footer mainContainerId="main-scroll-container" />
        </main>
      </div>
    </section>
  );
}
