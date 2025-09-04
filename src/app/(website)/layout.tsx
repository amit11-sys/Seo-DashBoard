
import Header from "@/components/Common/Navbar";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
// import { getUserCampaign } from "@/actions/campaign";
// import { UserKeywordData } from "@/actions/liveKeywords";


type Props = {
  children: React.ReactNode;
};

export default async function WebLayout({ children }: Props) {
  // const campaign = await getUserCampaign();
  // const userkeywordData = UserKeywordData()
  // console.log(userkeywordData)
  // const Convertedcampaign =
  //   Array.isArray(campaign?.campaign) && campaign?.campaign?.length > 0 ? campaign?.campaign?.map((c) => ({
  //     _id: c?._id?.toString(),
  //     campaignName: c?.campaignName?.toString(),
  //     projectUrl: c?.projectUrl?.toString(),
  //     userId: c?.userId?.toString(),
  //     createdAt: c?.createdAt?.toString(),
  //     updatedAt: c?.updatedAt?.toString(),
  //     __v: c?.__v,
  //   })) : [];
  // console.log(campaign)

  return (
    <div className="flex flex-row">
      
      <div className="w-full">
       
        {children}
      </div>
    </div>
  );
}
