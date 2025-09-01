import { getDbLiveKeywordData, getDbLiveKeywordDataWithSatusCode } from "@/actions/keywordTracking";
import Navbar from "@/components/Common/Navbar";
import Header from "@/components/Common/Header";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import { getArchivedCampaign, getGetCampaignByid } from "@/actions/campaign";
import { redirect } from "next/navigation";

export default async function DashboardDetails({
  params,
}: {
  params: { campaignId: string, share_token?: string };
}) {
  const { campaignId } =  params;
  const campignDataWithId = await getGetCampaignByid(campaignId);
  const campaignStatus = campignDataWithId?.campaign?.status;
  
  const campaignLiveKeywordsData = await getDbLiveKeywordDataWithSatusCode(campaignId, campaignStatus);
  console.log(campaignStatus, "campaignStatus");

  const archivedCampaignData = await getArchivedCampaign();

 const shareToken = params?.share_token;

  if (shareToken) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/validate?share_token=${shareToken}`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!data.valid) {
      redirect("/sign-in"); // 🚀 secure redirect if token invalid
    }

    // you can even use `data.userId` to load user-specific data
  }




  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar campaignId={campaignId as string} />
      </div>

      <div className="flex flex-1 pt-[80px] overflow-hidden">
        <aside className="w-[250px]   h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            campaignId={campaignId as string}
            archivedCampaignData={
              archivedCampaignData?.KeywordTrackingDataArchied ?? []
            }
          />
        </aside>

        <main className="ml-[250px] flex-1 overflow-y-auto  p-4">
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
