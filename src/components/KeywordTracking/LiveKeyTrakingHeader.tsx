'use client'
import {
  
  FaFilePdf,
 
} from "react-icons/fa";
import { HiOutlineKey, HiRefresh } from "react-icons/hi";
import { MdEdit } from "react-icons/md";

import { FcDataSheet } from "react-icons/fc";

import DialogFrom from "./AddKeywordDialog/DialogFrom";
import { getRefreshCampaign } from "@/actions/campaignRefresh";
import { toast } from "sonner";
import { useLoader } from "@/hooks/useLoader";
import Loader from "../global/Loader";
import { useCampaignData } from "@/app/context/CampaignContext";
import DownloadKeywordExcelBtn from "@/components/KeywordTracking/DownloadKeywordExcelBtn";
import { useEffect, useState } from "react";
import { getDbLiveKeywordData, getTrackingData } from "@/actions/keywordTracking";
// import { useCampaignProgress } from "@/hooks/useCampaignProgress";
import { ProgressBar } from "../KeywordProgress";
interface CampaignIdProps {
  campaignId: string;
}
export default   function LiveKeyTrakingHeader( {sortedDataExel,setIsLoading,campaignId, showAddedKeyword,compaigndata,updatedTopRankOnAddedKeyword,tableHeader,tableData, total, processed, done} :any) {
const {  startLoading, stopLoading } = useLoader();
const [refreshData, setRefreshData] = useState("");
  //  const { total, processed, done } = useCampaignProgress(campaignId);
const campaignStatus = compaigndata[0]?.status || 1
 
function formatLastUpdated(createdAt: string) {
  const date = new Date(createdAt);

  // Format absolute date like: Jun 19, 2025
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeAgo = "";
  if (diffMins < 1) timeAgo = "just now";
  else if (diffMins < 60) timeAgo = `${diffMins} min ago`;
  else if (diffHours < 24) timeAgo = `${diffHours} hr ago`;
  else timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return `Last Updated: ${timeAgo} (${formattedDate})`;
}
 const handleRefreshCampaign = async () => {
  startLoading()
  try {
    const refreshedCampaign = await getRefreshCampaign(campaignId);
    console.log(refreshedCampaign, "refreshedCampaign");
    const lastUpdated = refreshedCampaign?.updatedRecords
  ? formatLastUpdated(refreshedCampaign.updatedRecords[0]?.updatedAt || '')
  : '';
    if (!refreshedCampaign || refreshedCampaign.error) {
      console.error("Failed to refresh campaign:", refreshedCampaign?.error);
      toast.error("Failed to refresh campaign");
      return;
    }
    if (refreshedCampaign?.updatedRecords) {
      
      setRefreshData(lastUpdated);
    }
   
    stopLoading()
    toast.success(refreshedCampaign.message);

    // setCampaignData(refreshedCampaign);
  } catch (error) {
    console.error("Error refreshing campaign:", error);
    toast.error("Something went wrong while refreshing the campaign");
  }
};


useEffect(() => {
const fetchUpdatedDate = async () => {

  try {
    const refreshedCampaign:any = await getDbLiveKeywordData(campaignId);
    // console.log(refreshData, "refreshedCampaignok");
    if (refreshedCampaign?.newLiveKeywordDbData) {
      const lastUpdated = refreshedCampaign.newLiveKeywordDbData[0]?.updatedAt || '';
      setRefreshData(formatLastUpdated(lastUpdated));
    } else {
      setRefreshData("No updates available");
    }
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    setRefreshData("Failed to fetch update time");
  }



}

;
fetchUpdatedDate();


}, []);




 const iconButtons = [
    // {
    //   icon: <FaFilePdf className="text-3xl" />,
    //   color: "text-red-400",
    //   onClick: () => {}, // No action for this
    // },
    // {
    //   icon: <FcDataSheet className="text-3xl" />,
    //   color: "text-green-600",
    //   onClick: () => {}, // No action for this
    // },
    {
      icon: <HiRefresh className="text-3xl" />,
      color: "text-purple-500",
      onClick: handleRefreshCampaign, // Refresh button assigned
    },
  ];

  return (
    <div className=" flex flex-col md:flex-row items-center  justify-between text-black rounded-xl  gap-4">
     
      {/* Left Side: Title and Subtitle */}
      <div className="flex items-center gap-4">
        <div className="text-3xl text-orange-500">
       
          <HiOutlineKey />
        </div>
        <div>
          <h2  className="text-xl font-bold text-black">
             {campaignStatus === 2 ? "Archived Keywords" : "Live Keyword Tracking"}
          </h2>
          <p className="text-sm text-black">
           {refreshData}
          </p>
        </div>
      
      </div>

      {/* Right Side: Action Icons */}
 {total > 0 && (
  <div className="flex items-center gap-2">
    <ProgressBar processed={processed} total={total} done={done} />
    <span className="text-sm text-gray-600">
      {processed}/{total}{" "}
      {done ? "(Completed)" : "(Processing...)"}
    </span>
  </div>
)}

      
     
      {
        campaignStatus === 2 ? <>  <DownloadKeywordExcelBtn tableHeader={tableHeader} tableData={tableData}/> </>  : <div className="flex items-center gap-3 flex-wrap justify-end">
       <DialogFrom updatedTopRankOnAddedKeyword={updatedTopRankOnAddedKeyword} campaignId={campaignId} showAddedKeyword={showAddedKeyword}/>
       {/* <button>Add Keyword</button> */}
        <DownloadKeywordExcelBtn sortedDataExel={sortedDataExel} tableHeader={tableHeader} tableData={tableData}/>
        {iconButtons.map((item, idx) => (
          <div
            key={idx}
            className="w-10 h-10  rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer"
          >
            <button title="Refresh" onClick={item.onClick}  className={`text-xl ${item.color}`}>{item.icon}</button>
          </div>
        ))}
        
      </div>
      }
     


    </div>
  );
}
