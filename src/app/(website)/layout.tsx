
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import { getUserCampaign } from "@/actions/campaign";
import { UserKeywordData } from "@/actions/liveKeywords";


type Props = {
  children: React.ReactNode;
};

export default async function WebLayout({ children }: Props) {
  const campaign = await getUserCampaign();
  const userkeywordData = UserKeywordData()
  console.log(userkeywordData)
  const Convertedcampaign =
    campaign?.campaign?.map((c) => ({
      _id: c._id.toString(),
      campaignName: c.campaignName.toString(),
      projectUrl: c.projectUrl.toString(),
      userId: c.userId.toString(),
      createdAt: c.createdAt.toString(),
      updatedAt: c.updatedAt.toString(),
      __v: c.__v,
    })) || [];
    

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarWrapper Convertedcampaign={Convertedcampaign} >{children}</SidebarWrapper>
    </div>
  );
}
