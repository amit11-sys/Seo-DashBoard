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
import DownloadExcelBtn from "./DownloadKeywordExcelBtn";
interface CampaignIdProps {
  campaignId: string;
}
export default   function LiveKeyTrakingHeader( {campaignId, showAddedKeyword,compaigndata,updatedTopRankOnAddedKeyword,tableHeader,tableData} :any) {
const { loading, startLoading, stopLoading } = useLoader();
  
const campaignStatus = compaigndata[0]?.status



 const handleRefreshCampaign = async () => {
  startLoading()
  try {
    const refreshedCampaign = await getRefreshCampaign(campaignId);

    if (!refreshedCampaign || refreshedCampaign.error) {
      console.error("Failed to refresh campaign:", refreshedCampaign?.error);
      toast.error("Failed to refresh campaign");
      return;
    }

    stopLoading()
    toast.success(refreshedCampaign.message);

    // setCampaignData(refreshedCampaign);
  } catch (error) {
    console.error("Error refreshing campaign:", error);
    toast.error("Something went wrong while refreshing the campaign");
  }
};


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
          {/* <p className="text-sm text-black">
            Last Updated: 1 hour ago (Jun 19, 2025)
          </p> */}
        </div>
      
      </div>

      {/* Right Side: Action Icons */}

      
     
      {
        campaignStatus === 2 ? <>  <DownloadExcelBtn tableHeader={tableHeader} tableData={tableData}/> </>  : <div className="flex items-center gap-3 flex-wrap justify-end">
       <DialogFrom updatedTopRankOnAddedKeyword={updatedTopRankOnAddedKeyword} campaignId={campaignId} showAddedKeyword={showAddedKeyword}/>
       {/* <button>Add Keyword</button> */}
        <DownloadExcelBtn tableHeader={tableHeader} tableData={tableData}/>
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
