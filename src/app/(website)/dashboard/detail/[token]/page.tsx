import { getDbLiveKeywordDataWithSatusCode } from "@/actions/keywordTracking";
import Navbar from "@/components/Common/Navbar";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import { getArchivedCampaign, getGetCampaignByid } from "@/actions/campaign";
import { redirect } from "next/navigation";
import { getSingleValidateShareToken, getValidateShareToken } from "@/actions/generateShareLink";
import { parseShareToken, parseSingleShareToken } from "@/lib/utils/token";

export default  async function page({
params,
}: {
params: { token: string};}) {
  
const { token } =  params;

const tokendata = await parseSingleShareToken(token)
console.log(tokendata,"tokenData")

const campaignId = tokendata.campaignId

  // console.log(tokendata, "share_tokenokoo");

  const campignDataWithId = await getGetCampaignByid(campaignId);
  const campaignStatus = campignDataWithId?.campaign?.status;

  const campaignLiveKeywordsData = await getDbLiveKeywordDataWithSatusCode(
    campaignId,
    campaignStatus
  );


  if (token) {
    const { valid } = await getSingleValidateShareToken(token);
    if (!valid) {
      redirect("/sign");
    }

    // ✅ Share mode: Only show LiveKeywordComponent
    return (
      <section className="relative h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <LiveKeywordComponent
            // campaignStatus={2}
            tokendata={tokendata}
            ShareCampaignStatus={2}
            campaignLiveKeywordsData={campaignLiveKeywordsData}
            campaignId={campaignId}
          />
        </main>
      </section>
    );
  }

  // ✅ Normal mode: full dashboard layout
  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* <Navbar campaignId={campaignId} /> */}
      </div>

      <div className="flex flex-1 pt-[80px] overflow-hidden">
        {/* <aside className="w-[250px] h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            campaignId={campaignId}
            archivedCampaignData={
              archivedCampaignData?.KeywordTrackingDataArchied ?? []
            }
          />
        </aside> */}

        <main className="ml-[250px] flex-1 overflow-y-auto p-4">
          <Header
            campaignStatus={campaignStatus}
            topRankData={campaignLiveKeywordsData.topRankData}
            campaignId={campaignId}
          />

          <LiveKeywordComponent
            campaignStatus={campaignStatus}
            campaignLiveKeywordsData={campaignLiveKeywordsData}
            campaignId={campaignId}
          />
        </main>
      </div>
    </section>
  );
}
