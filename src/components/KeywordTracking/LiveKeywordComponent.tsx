"use client";
import React, { ReactNode, use, useEffect, useState } from "react";
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
  // intent: string;
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

const LiveKeywordComponent = ({
  // campaignLiveKeywordsData,
  campaignId,
  // campaignStatus
}: LiveKeywordComponentProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { total, processed, done } = useCampaignProgress(
    campaignId,
    3000,
    refreshKey
  );
  const [tableBody, setTableBody] = useState<any[]>([]);
  const [cardCounts, setCardCounts] = useState<any>([]);
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

  //  const [campaignStatus, setCampaignStatus] = useState<number>(campaignStatus
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remove skeleton after 30s max
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If data arrives before 30s, stop skeleton immediately
    if (tableBody.length > 0) {
      setLoading(false);
    }
  }, [tableBody]);

  console.log(cardCounts, "cardCounts");
  const { setActiveSingleCampaign } = useCampaignData();
  // console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData");
  const setExelData = (data: any) => {
    setSortedDataForExel(data);
  };
  useEffect(() => {
    const fetchLiveKeywordData = async () => {
      try {
        if (!campaignId) return;

        const campaignDataWithId = await getGetCampaignByid(campaignId);
        const campaignStatus = campaignDataWithId?.campaign?.status ?? 1;
        setCampaignStatus(campaignStatus);
        const liveKeywordData: any = await getDbLiveKeywordDataWithSatusCode(
          campaignId,
          campaignStatus
        );

        setCampaignLiveKeywordsData(liveKeywordData);
      } catch (error) {
        console.error("Error fetching live keyword data:", error);
      }
    };

    fetchLiveKeywordData();
  }, [campaignId]);
  const fetchCardDataFilterLocation = async (location: string) => {
    console.log("yes re render")
    try {
      console.log("Fetching card data for location:", location);
      setLocationForfilterlable(location);
      const liveKeywordData = await getDbLiveKeywordDataWithSatusCode(
        campaignId,
        campaignStatus,
        location
      );
      const topRankData = liveKeywordData?.topRankData?.data ?? [];
      const rawData = liveKeywordData?.newLiveKeywordDbData;

      const data = rawData?.map((item: any) => {
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
          sevenDays: "-",
          life: item?.rank_absolute || 0,
          comp: item?.competition || 0,
          sv: item?.searchVolumn || 0,
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item?.url || "",
        };
      });

      if (data) {
        setTableBody(data);
      }

      console.log(liveKeywordData, "liveKeywordDataOk");

      console.log(topRankData, "topRankDataok");

      if (topRankData.length > 0) {
        setCardCounts(topRankData);
      } else {
        console.warn("No ranking data available for location:", location);
      }
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  // useEffect(() => {
  //   const fetchDBLiveDatagain = async () => {
  //     const campaignLiveKeywordsData = await getDbLiveKeywordDataWithSatusCode(
  //       campaignId,
  //       campaignStatus,
  //       locationForfilterlable
  //     );
  //     // const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);

  //     if (campaignLiveKeywordsData?.newLiveKeywordDbData) {
  //       const rawData = campaignLiveKeywordsData?.newLiveKeywordDbData;
  //       const topRankData = campaignLiveKeywordsData?.topRankData;

  //       const data = rawData?.map((item: any) => {
  //         return {
  //           keyword: item?.keyword || "",
  //           keywordId: item.keywordId,
  //           location: item?.location_name?.locationName?.locationName || "",
  //           intent: item?.intent || "",
  //           start: item?.start || 0,
  //           checkUrl: item?.CheckUrl || "",
  //           page: Math?.ceil(item.rank_absolute / 10).toString() || 0,
  //           Absolute_Rank: item?.rank_absolute || 0,
  //           Group_Rank: item?.rank_group || 0,
  //           sevenDays: "-",
  //           life: item?.rank_absolute || 0,
  //           comp: item?.competition || 0,
  //           sv: item?.searchVolumn || 0,
  //           date: new Date(item.createdAt).toLocaleDateString("en-GB", {
  //             day: "2-digit",
  //             month: "short",
  //             year: "2-digit",
  //           }),
  //           rankingUrl: item?.url || "",
  //         };
  //       });

  //       console.log(topRankData, "topRankDataok");

  //       if (topRankData) {
  //         setCardCounts(topRankData);
  //       }
  //     }
  //   };
  //   fetchDBLiveDatagain();
  // }, [tableBody]);
  useEffect(() => {
  const fetchDBLiveDatagain = async () => {
    const campaignLiveKeywordsData = await getDbLiveKeywordDataWithSatusCode(
      campaignId,
      campaignStatus,
      locationForfilterlable
    );

    if (campaignLiveKeywordsData?.newLiveKeywordDbData) {
      const topRankData = campaignLiveKeywordsData?.topRankData;
      if (topRankData) setCardCounts(topRankData);
    }
  };
  fetchDBLiveDatagain();
}, [campaignId, campaignStatus, locationForfilterlable]); // ✅ only when inputs change


  const compaigndata = campaignLiveKeywordsData?.newLiveKeywordDbData?.map(
    (item: any) => {
      return item.campaignId;
    }
  );
  // console.log(compaigndata, "compaign data new");

  // const tableHeader: Tableitems[] = [
  //   // { key: "select", label: "", icon: <Checkbox className="inline mr-1" /> },
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
  //   // { key: "one_day", label: "1 Day" },
  //   { key: "seven_days", label: "7 Days" },
  //   // { key: "thirty_days", label: "30 Days" },
  //   { key: "life", label: "Life" },
  //   // { key: "comp", label: "Comp" },
  //   // { key: "sv", label: "SV" },
  //   { key: "date", label: "Date" },
  //   { key: "ranking_url", label: "Ranking URL" },
  //   { key: "edit", label: "Edit keyword" },
  // ];
  const tableHeader: Tableitems[] = [
    { key: "select", label: "", icon: null }, // checkbox column
    { key: "keyword", label: "Keyword" },
    { key: "location", label: "Location" },
    { key: "intent", label: "Intent" },
    { key: "start", label: "Start" },
    { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> },
    {
      key: "Absolute-Rank",
      label: "A-Rank",
      icon: <FcGoogle className="inline mr-1" />,
    },
    {
      key: "Group_Rank",
      label: "Group_Rank",
      icon: <FcGoogle className="inline mr-1" />,
    },
    { key: "seven_days", label: "7 Days" },
    { key: "life", label: "Life" },
    { key: "date", label: "Date" },
    { key: "ranking_url", label: "Ranking URL" },
    { key: "edit", label: "Actions" }, // edit/delete/refresh buttons
  ];

  // console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData");

  // let tableBody: TablebodyItems[] = [];
  useEffect(() => {
    // console.log(campaignLiveKeywordsData, "use effect");
    if (campaignLiveKeywordsData) {
      keywordTableData();
    }
  }, [campaignLiveKeywordsData]);

  useEffect(() => {
    if (done) {
      (async () => {
        // console.log("✅ Done detected, fetching latest keyword data...");

        const campaignLiveKeywordsData =
          await getDbLiveKeywordDataWithSatusCode(campaignId, campaignStatus);
        // console.log(campaignLiveKeywordsData, "getDbLiveKeywordDataWithSatusCode");
        // const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);

        if (campaignLiveKeywordsData?.newLiveKeywordDbData) {
          const rawData = campaignLiveKeywordsData.newLiveKeywordDbData;
          const topRankData = campaignLiveKeywordsData?.topRankData?.data;

          const data = rawData.map((item: any) => ({
            keyword: item?.keyword || "",
            keywordId: item.keywordId,
            location: item?.location_name?.locationName?.locationName || "",
            intent: item?.intent || "",
            start: item?.start || 0,
            checkUrl: item?.checkUrl || "",
            page: Math?.ceil(item.rank_absolute / 10).toString() || 0,
            Absolute_Rank: item?.rank_absolute || 0,
            Group_Rank: item?.rank_group || 0,
            sevenDays: "-",
            life: item?.rank_absolute || 0,
            comp: item?.competition || 0,
            sv: item?.searchVolumn || 0,
            date: new Date(item.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }),
            rankingUrl: item?.url || "",
          }));

          setTableBody(data);
          setFilterCampaignLiveKeywordsData(data);
          if (topRankData) setCardCounts(topRankData);
        }
      })();
    }
  }, [done, campaignId]);

  const keywordTableData = () => {
    console.log("calling fn");

    if (campaignLiveKeywordsData.newLiveKeywordDbData) {
      const rawData = campaignLiveKeywordsData?.newLiveKeywordDbData;
      const topRankData = campaignLiveKeywordsData?.topRankData?.data;

      const data = rawData.map((item: any) => {
        // const rankGroup = item?.rank_group || 0;

        // if (rankGroup > 0 && rankGroup <= 3) top3++;
        // if (rankGroup > 0 && rankGroup <= 10) top10++;
        // if (rankGroup > 0 && rankGroup <= 20) top20++;
        // if (rankGroup > 0 && rankGroup <= 30) top30++;
        // if (rankGroup > 0 && rankGroup <= 100) top100++;

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
          sevenDays: "-",
          life: item?.rank_absolute || 0,
          comp: item?.competition || 0,
          sv: item?.searchVolumn || 0,
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item?.url || "",
        };
      });

      console.log(topRankData, "topRankDataok");

      setTableBody(data);
      setFilterCampaignLiveKeywordsData(data);
      if (topRankData) {
        setCardCounts(topRankData);
      }
    }
  };

  console.log(tableBody, "table body");

  const showAddedKeyword = (newItem: any) => {
    if (newItem && newItem.length > 0) {
      const mappedItems = newItem.map((item: any) => {
        console.log(item, "new added dataa");
        return {
          keyword: item?.keyword || "",
          //  location: item?.location_code?.toString() || "",
          location: item?.location_name || "",
          // location: item?.location_name?.locationName?.locationName || "",
          intent: item?.intent || "",
          keywordId: item.keywordId,
          start: item?.start || 0,
          checkUrl: item?.checkUrl || "",
          page: Math?.ceil(item.rank_absolute / 10).toString() || 0,
          Absolute_Rank: item?.rank_absolute || 0,
          Group_Rank: item?.rank_group || 0,
          // oneDay: "1",
          sevenDays: "-",
          // thirtyDays: "-",
          life: item?.rank_absolute || 0,
          comp: item?.competition || 0,
          sv: item?.searchVolumn || 0,
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item?.url || "",
        };
      });

      setTableBody((prev) => [...prev, ...mappedItems]);
    }
  };
  const updatedTopRankOnAddedKeyword = () => {
    console.log("run updatedTopRankOnAddedKeyword");
    keywordTableData();
  };

  const cardData = {
    title: "keywords",
    data: cardCounts?.data?.map((item: any) => {
      return {
        title: item.title,
        data: item.data,
        id: item.id,
      };
    }),
    type: "card",
    totalKeywords: cardCounts?.totalKeywords || 0,
  };
  console.log(cardData, "cardDataok");

  return (
    <div className="w-full min-h-[80vh]  text-gray-100">
      {/* Header */}
      <div className=" backdrop-blur-md text-black  border border-white/10 rounded-xl p-6 ">
        <LiveKeyTrakingHeader
          sortedDataExel={sortedDataExel}
          setIsLoading={setIsLoading}
          campaignStatus={campaignStatus}
          tableHeader={tableHeader}
          tableData={tableBody}
          updatedTopRankOnAddedKeyword={updatedTopRankOnAddedKeyword}
          compaigndata={compaigndata}
          campaignId={campaignId}
          showAddedKeyword={showAddedKeyword}
          total={total}
          processed={processed}
          done={done}
          setRefresh={setRefreshKey}
        />
      </div>
      <div className="backdrop-blur-md text-black  border border-white/10 rounded-xl px-6  flex  justify-evenly  items-center">
        {/* <div className="flex justify-evenly items-center gap-5 w-full">
  {cardData?.data?.length === 0 ? (
    <div className="flex items-center gap-6 p-3 border-b border-slate-200 animate-pulse w-full justify-evenly">
      <div className="h-4 w-24 bg-slate-300 rounded"></div>
      <div className="h-4 w-32 bg-slate-300 rounded"></div>
      <div className="h-4 w-20 bg-slate-300 rounded"></div>
      <div className="h-4 w-16 bg-slate-300 rounded"></div>
    </div>
  ) : (
    cardData?.data?.map((item: any) => (
      <div key={item.id}>
        <CustomTrackingCard
          totalKeywords={cardData?.totalKeywords}
          className="w-[170px] h-[170px]"
          title={item?.title}
          data={item?.data}
        />
      </div>
    ))
  )}
</div> */}
        <div className="flex justify-evenly items-center gap-5 w-full">
          {!cardData || cardData?.data?.length === 0 ? (
            // Skeleton loader
            <>
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[170px] h-[170px] bg-slate-300 rounded-xl animate-pulse"
                />
              ))}
            </>
          ) : (
            cardData?.data?.map((item: any) => (
              <div key={item.id}>
                <CustomTrackingCard
                  totalKeywords={cardData?.totalKeywords}
                  className="w-[170px] h-[170px]"
                  title={item?.title}
                  data={item?.data}
                />
              </div>
            ))
          )}
        </div>

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

            {/* Table Rows */}
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
            filterCampaignLiveKeywordsData={filterCampaignLiveKeywordsData}
            fetchCardDatafilterLocation={fetchCardDataFilterLocation}
            setExelData={setExelData}
            tableHeader={tableHeader}
            setSortedDataForExel={setSortedDataForExel}
            tableData={tableBody}
            campaignId={campaignId}
            showAddedKeyword={showAddedKeyword}
            setTableBody={setTableBody}
          />
        )}
      </div>
    </div>
  );
};

export default LiveKeywordComponent;
