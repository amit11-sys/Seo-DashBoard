import { StatCard } from "@/components/dashboard/StatCard";
import CampaignTable from "@/components/dashboard/CampaignTable";
import FilterTabs from "@/components/dashboard/FilterTabs";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import Navbar from "@/components/Common/Navbar";
import { getArchivedCampaign, getCompaignCount } from "@/actions/campaign";
import CustomTrackingCard from "@/components/KeywordTracking/CustomTrackingCard";
import { FaArchive } from "react-icons/fa";
import { FaPlane, FaRocket } from "react-icons/fa6";
import CustomTable from "@/components/table/CustomTable";
// import NewCustomTable from "@/components/newCustomTable";
import { getDbTopLiveKeywordData } from "@/actions/keywordTracking";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getDbLocationData } from "@/actions/locations_Language";

export default async function DashboardPage() {
//   const archivedCampaignData = await getArchivedCampaign();
//    const topLivedbData = await getDbTopLiveKeywordData()
//    const campaignCount = await getCompaignCount()

//    console.log(topLivedbData.TopLiveKeywordDbData?.length,"topLivedbData")
 

  return (
    <>
    <DashboardClient /> 
    </>
  );
}
