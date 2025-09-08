"use client";
import { FaFilePdf } from "react-icons/fa";
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
import {
  getDbLiveKeywordData,
  getDbLiveKeywordDataWithSatusCode,
  getTrackingData,
} from "@/actions/keywordTracking";
// import { useCampaignProgress } from "@/hooks/useCampaignProgress";
import { ProgressBar } from "../KeywordProgress";
import { BsShare } from "react-icons/bs";
import { getGetCampaignByid } from "@/actions/campaign";
import { getGenerateShareLink } from "@/actions/generateShareLink";
interface CampaignIdProps {
  campaignId: string;
}
export default function LiveKeyTrakingHeader({
  sortedDataExel,
  campaignStatus,
  setIsLoading,
  campaignId,
  ShareCampaignStatus,
  showAddedKeyword,
  compaigndata,
  updatedTopRankOnAddedKeyword,
  tableHeader,
  tableData,
  total,
  processed,
  done,
  setRefresh,
  CardSetOnChanges,
  setTableBody
}: any) {
  const { startLoading, stopLoading } = useLoader();
  const [refreshData, setRefreshData] = useState("");
  // const [refreshKey, setRefreshKey] = useState(0);
  //  const { total, processed, done } = useCampaignProgress(campaignId);
  // const campaignStatus = compaigndata[0]?.status || 1

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
    startLoading();
    try {
      const refreshedCampaign = await getRefreshCampaign(campaignId);
      console.log(refreshedCampaign, "refreshedCampaign");
      // const lastUpdated = refreshedCampaign?.updatedRecords
      //   ? formatLastUpdated(
      //       refreshedCampaign.updatedRecords[0]?.updatedAt || ""
      //     )
      //   : "";


      if (refreshedCampaign) {
        setRefresh((k: any) => k + 1);
      }
      if (!refreshedCampaign || refreshedCampaign.error) {
        console.error("Failed to refresh campaign:", refreshedCampaign?.error);
        toast.error("Failed to refresh campaign");
        return;
      }
      // if (refreshedCampaign?.updatedRecords) {
      //   setRefreshData(lastUpdated);
      // }

      stopLoading();
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
      const refreshedCampaign:any = await getDbLiveKeywordDataWithSatusCode(campaignId,campaignStatus);
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

  }, [done]);

  useEffect(() => {
    const fetchUpdatedDate = async () => {
      try {
        if (!campaignId || !campaignStatus) return; // guard for missing data

        const refreshedCampaign: any = await getDbLiveKeywordDataWithSatusCode(
          campaignId,
          campaignStatus
        );

        // console.log(
        //   refreshedCampaign?.newLiveKeywordDbData,
        //   "refreshedCampaignok"
        // );
        

        if (
          refreshedCampaign?.newLiveKeywordDbData &&
          refreshedCampaign.newLiveKeywordDbData.length > 0
        ) {
          const lastUpdated =
            refreshedCampaign.newLiveKeywordDbData[0]?.updatedAt || "";
          setRefreshData(formatLastUpdated(lastUpdated));
        } else {
          setRefreshData("No updates available");
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        setRefreshData("Failed to fetch update time");
      }
    };

    fetchUpdatedDate();
  }, [campaignId, campaignStatus]);

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
   const handleshareLink = async () => {

    try {
      const campaigndata = await getGetCampaignByid(campaignId);
      const userId = campaigndata?.campaign?.userId ;
      const shareLink = await getGenerateShareLink(userId,`/dashboard/detail/`,campaignId);
      console.log(shareLink, "shareLink");
      await navigator.clipboard.writeText(shareLink);
      toast.success("Shareable link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to generate shareable link.");
    }
  };

  return (
    <div className=" flex flex-col md:flex-row items-center  justify-between text-black rounded-xl  gap-4">
      {/* Left Side: Title and Subtitle */}
      <div className="flex items-center gap-4">
        <div className="text-3xl text-orange-500">
          <HiOutlineKey />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">
            {campaignStatus === 2
              ? "Archived Keywords"
              : "Live Keyword Tracking"}
          </h2>
          <p className="text-sm text-black">{refreshData}</p>
        </div>
      </div>

      {/* Right Side: Action Icons */}
      {total > 0 && (
        <div className="flex items-center gap-2">
          <ProgressBar processed={processed} total={total} done={done} />
          <span className="text-sm text-gray-600">
            {done
              ? null
              : total > 0
                ? ((processed / total) * 100).toFixed(0) + "%"
                : "0%"}{" "}
            {/* {done ? "(Completed)" : "(Processing...)"} */}
          </span>
        </div>
      )}

      {ShareCampaignStatus || campaignStatus === 2 ? (
        <>
          {" "}
          <DownloadKeywordExcelBtn
            tableHeader={tableHeader}
            tableData={tableData}
          />
         
        </>
      ) : (
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <DialogFrom
            campaignId={campaignId}
            onClose={() => setRefresh((k: any) => k + 1)}
          />
         
          {/* <button>Add Keyword</button> */}
            <div className="w-10 h-10  hover:bg-gray-200 flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer">

          <DownloadKeywordExcelBtn
            sortedDataExel={sortedDataExel}
            tableHeader={tableHeader}
            tableData={tableData}
          />
          </div>
          
           <div className="w-10 h-10  hover:bg-gray-200 flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer">

           <BsShare
            className="  cursor-pointer text-xl text-green-600"
            title="Share"
            onClick={handleshareLink}
          />
          </div>
          {iconButtons.map((item, idx) => (
            <div
              key={idx}
              className="w-10 h-10  hover:bg-gray-200 flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer"
            >
              <button
                title="Refresh"
                onClick={item.onClick}
                className={`text-xl ${item.color}`}
              >
                {item.icon}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
