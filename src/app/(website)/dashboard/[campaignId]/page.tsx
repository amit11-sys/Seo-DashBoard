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
import KeywordComponent from "@/components/KeywordTracking/KeywordComponent";

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
    <>
    <KeywordComponent ActiveUserData={ActiveUserData} campaignId={campaignId} campaignStatus={campaignStatus} campaignLiveKeywordsData={campaignLiveKeywordsData} campignDataWithId={campignDataWithId} />
    
   
    </>
  );
}
