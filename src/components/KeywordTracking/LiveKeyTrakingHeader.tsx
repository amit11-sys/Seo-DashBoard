'use client'
import {
  
  FaFilePdf,
 
} from "react-icons/fa";
import { HiOutlineKey, HiRefresh } from "react-icons/hi";
import { MdEdit } from "react-icons/md";

import { FcDataSheet } from "react-icons/fc";

import DialogFrom from "./AddKeywordDialog/DialogFrom";
import { getRefreshCampaign } from "@/actions/campaignRefresh";
interface CampaignIdProps {
  campaignId: string;
}
export default   function LiveKeyTrakingHeader( {campaignId} :CampaignIdProps) {

  


  // const handleRefershCampaign = async  () => {
  //   const refreshCompaign = await getRefreshCampaign({campaignId});
  //   console.log(refreshCompaign, "Refresh header");
  
  // };
  

 const iconButtons = [
    {
      icon: <FaFilePdf className="text-3xl" />,
      color: "text-red-400",
      onClick: () => {}, // No action for this
    },
    {
      icon: <FcDataSheet className="text-3xl" />,
      color: "text-green-600",
      onClick: () => {}, // No action for this
    },
    {
      icon: <HiRefresh className="text-3xl" />,
      color: "text-purple-500",
      // onClick: handleRefershCampaign, // Refresh button assigned
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
            Live Keyword Tracking
          </h2>
          <p className="text-sm text-black">
            Last Updated: 1 hour ago (Jun 19, 2025)
          </p>
        </div>
      
      </div>

      {/* Right Side: Action Icons */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
       <DialogFrom campaignId={campaignId}/>
       
        {iconButtons.map((item, idx) => (
          <div
            key={idx}
            className="w-10 h-10  rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer"
          >
            <button onClick={item.onClick}  className={`text-xl ${item.color}`}>{item.icon}</button>
          </div>
        ))}
        
      </div>
    </div>
  );
}
