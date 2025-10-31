"use client";
import React, {
  ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CustomTrackingCard from "@/components/KeywordTracking/CustomTrackingCard";
import TrackingChart from "@/components/Chart/TrackingChart";
import DropDownList from "@/components/DropDownList";
import SearchBar from "@/components/searchBar/SearchBar";
import CustomTable from "@/components/KeywordTracking/Keywordtable/CustomTable";
import CustomButton from "@/components/ui/CustomButton";
import { FaStar } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "@radix-ui/react-checkbox";
import LiveKeyTrakingHeader from "@/components/KeywordTracking/LiveKeyTrakingHeader";
import {
  getDbLiveKeywordData,
  getDbLiveKeywordDataWithSatusCode,
  keywordLiveData,
} from "@/actions/keywordTracking";
import { log, table } from "console";
import KeywordTextArea from "../KeywordTextArea";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import Header from "../Common/Navbar";
import { useCampaignData } from "@/app/context/CampaignContext";
import { set } from "mongoose";
import DeleteConfirm from "./Keywordtable/KeywordDel";
import { useCampaignProgress } from "@/hooks/useCampaignProgress";
import { getGetCampaignByid } from "@/actions/campaign";
import TopRankCard from "./TopRankCard";
type Tableitems = {
  key: string;
  label: string;
  icon?: ReactNode;
};

type TablebodyItems = {
  // select: boolean;
  keywordId: string;
  status: number;
  keyword: string;
  location: string;
  intent: string;
  start: string;
  page: string;
  Group_Rank: string;
  Absolute_Rank: string;

  sevenDays: string;

  life: string;
  comp: any;
  sv: any;
  date: string;
  rankingUrl: string;
};

interface CustomTrackingCardProps {
  cardData: {
    title: string;
    data: { title: string; data: number }[];
    type?: string;
  };
}

interface campaignId {
  campaignId: any;
}
interface LiveKeywordComponentProps {
  campaignLiveKeywordsData?: {
    success?: boolean;
    message?: string;
    error?: string;
    newLiveKeywordDbData?: any[];
    topRankData?: {
      title: string;
      data: {
        title: string;
        data: number;
        id: number;
      }[];
      type: string;
    };
  };
  campaignId: string;
  campaignStatus?: number;
  ShareCampaignStatus?: number;
  tokendata?: any;
  ActiveUserData: {role:number};
}

interface HeaderProps {
  campaignId: string;
  topRankData?: {
    title: string;
    data: {
      title: string;
      data: number;
      id: number;
    }[];
    type: string;
  };
}
// const tableHeader: Tableitems[] = [
//   { key: "select", label: "", icon: null }, // checkbox column
//   { key: "keyword", label: "Keyword" },
//   { key: "location", label: "Location" },
//   { key: "intent", label: "Intent" },
//   { key: "start", label: "Start" },
//   { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> },
//   {
//     key: "Absolute-Rank",
//     label: "A-Rank",
//     icon: <FcGoogle className="inline mr-1" />,
//   },
//   {
//     key: "Group_Rank",
//     label: "Group_Rank",
//     icon: <FcGoogle className="inline mr-1" />,
//   },
//   { key: "seven_days", label: "7 Days" },
//   { key: "life", label: "Life" },
//   { key: "date", label: "Date" },
//   { key: "ranking_url", label: "Ranking URL" },
//   { key: "edit", label: "Actions" }, // edit/delete/refresh buttons
// ];
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




const LiveKeywordComponent = ({
  // campaignLiveKeywordsData,
  campaignId,
  ShareCampaignStatus,
  tokendata,
  ActiveUserData
}: LiveKeywordComponentProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { total, processed, done } = useCampaignProgress(
    campaignId,
    3000,
    refreshKey
  );
  // console.log({campaignId,tokendata});
  const [tableBody, setTableBody] = useState<any[]>([]);
  // const [cardCounts, setCardCounts] = useState<any>([]);
  const [cardData, setCardData] = useState<any>([]);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [topRankData, setTopRankData] = useState<any[]>([]);
  const [totalKeywords, setTotalKeywords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortedDataExel, setSortedDataForExel] = useState<TablebodyItems[]>([]);
  const [campaignLiveKeywordsData, setCampaignLiveKeywordsData] =
    useState<any>();
  const [filterCampaignLiveKeywordsData, setFilterCampaignLiveKeywordsData] =
    useState<any>();
  const [campaignStatus, setCampaignStatus] = useState<number>(1);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [locationForfilterlable, setLocationForfilterlable] = useState("");
  const [refreshDate, setRefreshDate] = useState("");
  //  const [campaignStatus, setCampaignStatus] = useState<number>(campaignStatus
  const [loading, setLoading] = useState(false);
        const [showLastKeywords, setShowLastKeywords] = useState(true);
        const [showPastRank, setShowPastRank] = useState<boolean>(false);


  // useEffect(() => {
  //   // Remove skeleton after 30s max
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 20000);

  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   // If data arrives before 30s, stop skeleton immediately
  //   if (tableBody.length > 0) {
  //     setLoading(false);
  //   }
  // }, [tableBody]);

  // console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData");
  
  
  const setExelData = (data: any) => {
    setSortedDataForExel(data);
  };
  useEffect(() => {
    getCampaignStatus();
  }, [campaignId]);

  useEffect(() => {
    // console.log(locationFilter, "locationFilter");
    if (campaignStatus && locationFilter && done) {
      getkeywordData();
    }
  }, [campaignStatus, locationFilter, done]);

  
  const getCampaignStatus = async () => {
    const campaignDataWithId = await getGetCampaignByid(campaignId);
    const campaignStatus = campaignDataWithId?.campaign?.status ;
    setCampaignStatus(campaignStatus);
  };

  const getkeywordData = async () => {
     try {
      if (!campaignId) return;
      setLoading(true);
      const liveKeywordData = await keywordLiveData(
        campaignId,
        campaignStatus,
        locationFilter
      );
      setRefreshDate(formatLastUpdated(liveKeywordData?.newLiveKeywordDbData?.[0]?.updatedAt));

      if (liveKeywordData.error === "Unauthorized please login") {
        window.dispatchEvent(new Event("session-expired"));
        return;
      }
      // console.log(liveKeywordData, "liveKeywordData final");

      setCampaignLiveKeywordsData(liveKeywordData);
      await keywordTableData(liveKeywordData);
    } catch (error) {
      console.error("Error fetching live keyword data:", error);
    }finally {
      setLoading(false);
    }
  };

  const keywordTableData = (campaignLiveKeywordsData: any) => {
    // console.log("calling fn on delte");

    if (campaignLiveKeywordsData.newLiveKeywordDbData) {
      const rawData = campaignLiveKeywordsData?.newLiveKeywordDbData;
      const topRankData = campaignLiveKeywordsData?.topRankData?.data;

      const data = rawData.map((item: any) => {
         const haveNoPastRankData = item?.pastData === undefined || item?.pastData?.length === 0 

         setShowLastKeywords(!haveNoPastRankData)
        return {
          keyword: item?.keyword || "",
          keywordId: item.keywordId,
          location: item?.location_name?.locationName?.locationName || "",
          intent: item?.intent || "",
          start: item?.start || 0,
          checkUrl: item?.checkUrl || "",
          page: Math?.ceil(item.rank_absolute / 10).toString() || 0,
          Absolute_Rank: item?.rank_absolute || 0,
          Group_Rank: item?.rank_group || 0,
           sevenDays: item?.rankChange || 0,
          changeDirection: item?.changeDirection || "",
          life: item?.rank_absolute || 0,
          comp: item?.competition || 0,
          sv: item?.searchVolumn || 0,
           ...(!haveNoPastRankData
      && { pastData:  item?.pastData}
      ),
          // pastData:  && item?.pastData,
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item?.url || "",
        };
      });

      setTableBody(data);
      setFilterCampaignLiveKeywordsData(data);

    
    }
  };
 
const tableHeader: Tableitems[] = [
    { key: "select", label: "", icon: null },
    { key: "keyword", label: "Keyword" },
    { key: "location", label: "Location" },
    { key: "intent", label: "Intent" },
    { key: "start", label: "Start" },
    { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> },
    {
      key: "Absolute_Rank",
      label: "A-Rank",
      icon: <FcGoogle className="inline mr-1" />,
    },
    {
      key: "Group_Rank",
      label: "Group_Rank",
      icon: <FcGoogle className="inline mr-1" />,
    },
     // ✅ Conditional column insertion
  ...(showPastRank
    ? (showLastKeywords
        ? [{ key: "pastRanks", label: "Past ranks" }]
        : [])
    : []),
    
    { key: "sevenDays", label: "7 Days" },
    { key: "life", label: "Life" },
    { key: "date", label: "Date" },
    { key: "rankingUrl", label: "Ranking URL" },
    { key: "edit", label: "Actions" },
  ];

  return (
    <div className="w-full min-h-[80vh]  text-gray-100">
      {/* Header */}
      <div className=" backdrop-blur-md text-black  border border-white/10 rounded-xl p-6 ">
        <LiveKeyTrakingHeader
        ActiveUserData={ActiveUserData}
          sortedDataExel={sortedDataExel}
          setIsLoading={setIsLoading}
          refreshDate={refreshDate}
          campaignStatus={campaignStatus}
          ShareCampaignStatus={ShareCampaignStatus}
          tableHeader={tableHeader}
          tableData={tableBody}
          // updatedTopRankOnAddedKeyword={updatedTopRankOnAddedKeyword}
          // compaigndata={compaigndata}
          campaignId={campaignId}
          // showAddedKeyword={showAddedKeyword}
          total={total}
          processed={processed}
          done={done}
          setRefresh={setRefreshKey}
        />
      </div>
      <div className="backdrop-blur-md text-black  border border-white/10 rounded-xl px-6  flex  justify-evenly  items-center">
 
        {loading ? (
          <div className="grid grid-cols-6 gap-6">
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_5.6s_infinite]"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_5.6s_infinite]"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_5.6s_infinite]"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_5.6s_infinite]"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_5.6s_infinite]"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_5.6s_infinite]"></div>
            </div>
          </div>
        ) : (
          <div className=" w-full">
            <TopRankCard
              title={campaignLiveKeywordsData?.topRankData?.title}
              data={campaignLiveKeywordsData?.topRankData?.data}
              totalKeywords={
                campaignLiveKeywordsData?.topRankData?.totalKeywords
              }
            />
          </div>
        )}

        {/* <div className="w-[60%]">
        <TrackingChart/>
      </div> */}
      </div>

      {/* Filter & Table Section */}
      <div className="rounded-xl p-6">
        {loading ? (
          // Skeleton loader
          <div className="w-full border border-slate-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 bg-slate-100 p-3">
              <div className="h-5 w-20 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-5 w-28 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-slate-300 rounded animate-pulse"></div>
            </div>

            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 p-3 border-t border-slate-200"
              >
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <CustomTable
            // setCampaignLiveKeywordsData={setCampaignLiveKeywordsData}
            // updatedTopRankOnAddedKeyword={updatedTopRankOnAddedKeyword}
            // CardSetOnChanges={CardSetOnChanges}
            // setCardData={setCardData}
            // keywordTableData={keywordTableData}
            ActiveUserData={ActiveUserData}
            showPastRank={showPastRank}
            setShowPastRank={setShowPastRank}
             setShowLastKeywords={setShowLastKeywords}
            showLastKeywords={showLastKeywords}
            ShareCampaignStatus={ShareCampaignStatus}
            setFilterCampaignLiveKeywordsData={
              setFilterCampaignLiveKeywordsData
            }
            filterCampaignLiveKeywordsData={filterCampaignLiveKeywordsData}
            // fetchCardDatafilterLocation={fetchCardDataFilterLocation}
            setExelData={setExelData}
            tableHeader={tableHeader}
            setSortedDataForExel={setSortedDataForExel}
            tableData={tableBody}
            campaignId={campaignId}
            // showAddedKeyword={showAddedKeyword}
            setTableBody={setTableBody}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            getKeywordData={getkeywordData}
          />
        )}
      </div>
    </div>
  );
};

export default LiveKeywordComponent;
