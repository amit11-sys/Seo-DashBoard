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
import { getDbLiveKeywordData } from "@/actions/keywordTracking";
import { log, table } from "console";
import KeywordTextArea from "../KeywordTextArea";
import KeywordTracking from "@/lib/models/keywordTracking.model";
import Header from "../Common/Navbar";
import { useCampaignData } from "@/app/context/CampaignContext";
import { set } from "mongoose";
import DeleteConfirm from "./Keywordtable/KeywordDel";

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
  campaignLiveKeywordsData: {
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
  campaignStatus?: number
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
  campaignLiveKeywordsData,
  campaignId,
  // campaignStatus

  
}: LiveKeywordComponentProps) => {
  const [tableBody, setTableBody] = useState<any[]>([]);
  const [cardCounts, setCardCounts] = useState<any>([]);
  const [topRankData, setTopRankData] = useState<any[]>([]);
  const [totalKeywords, setTotalKeywords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortedDataExel, setSortedDataForExel] = useState<TablebodyItems[]>([]);

  console.log(cardCounts, "cardCounts");
  const { setActiveSingleCampaign } = useCampaignData();
  // console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData");
const setExelData = (data:any) => {
setSortedDataForExel(data);

}
  useEffect(() => {
    const fetchDBLiveDatagain = async () => {
      const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);

      if (campaignLiveKeywordsData.newLiveKeywordDbData) {
        const rawData = campaignLiveKeywordsData?.newLiveKeywordDbData;
        const topRankData = campaignLiveKeywordsData?.topRankData;

        const data = rawData.map((item: any) => {
          return {
            keyword: item?.keyword || "",
            keywordId: item.keywordId,
            location: item?.location_name?.locationName?.locationName || "",
            intent: item?.intent || "",
            start: item?.start || 0,
            checkUrl: item?.CheckUrl || "",
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

        if (topRankData) {
          setCardCounts(topRankData);
        }
      }
    };
    fetchDBLiveDatagain();
  }, [tableBody]);

  const compaigndata = campaignLiveKeywordsData?.newLiveKeywordDbData?.map(
    (item: any) => {
      return item.campaignId;
    }
  );
  // console.log(compaigndata, "compaign data new");

  const tableHeader: Tableitems[] = [
    // { key: "select", label: "", icon: <Checkbox className="inline mr-1" /> },
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
    // { key: "one_day", label: "1 Day" },
    { key: "seven_days", label: "7 Days" },
    // { key: "thirty_days", label: "30 Days" },
    { key: "life", label: "Life" },
    // { key: "comp", label: "Comp" },
    // { key: "sv", label: "SV" },
    { key: "date", label: "Date" },
    { key: "ranking_url", label: "Ranking URL" },
    { key: "edit", label: "Edit keyword" },
  ];
  // console.log(campaignLiveKeywordsData, "campaignLiveKeywordsData");

  // let tableBody: TablebodyItems[] = [];
  useEffect(() => {
    // console.log(campaignLiveKeywordsData, "use effect");
    if (campaignLiveKeywordsData) {
      keywordTableData();
    }
  }, [campaignLiveKeywordsData]);

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
  //     {
  //       title: "Keywords Up",
  //       data: tableBody?.length,
  //       id: 1,
  //     },
  //     {
  //       title: "In Top 3",
  //       data: cardCounts.top3,
  //       id: 2,
  //     },
  //     {
  //       title: "In Top 10",
  //       data: cardCounts.top10,
  //       id: 3,
  //     },
  //     {
  //       title: "In Top 20",
  //       data: cardCounts.top20,
  //       id: 4,
  //     },
  //     {
  //       title: "In Top 30",
  //       data: cardCounts.top30,
  //       id: 5,
  //     },
  //     {
  //       title: "In Top 100",
  //       data: cardCounts.top100,
  //       id: 6,
  //     },
  //   ],

  return (
    <div className="w-full min-h-[80vh]  text-gray-100">
      {/* Header */}
      <div className=" backdrop-blur-md text-black  border border-white/10 rounded-xl p-6 ">
        <LiveKeyTrakingHeader
        sortedDataExel={sortedDataExel}
        setIsLoading={setIsLoading}
          // campaignStatus={campaignStatus}
          tableHeader={tableHeader}
          tableData={tableBody}
          updatedTopRankOnAddedKeyword={updatedTopRankOnAddedKeyword}
          compaigndata={compaigndata}
          campaignId={campaignId}
          showAddedKeyword={showAddedKeyword}
        />
      </div>
      <div className="backdrop-blur-md text-black  border border-white/10 rounded-xl px-6  flex  justify-evenly  items-center">
        <div className="flex justify-evenly items-center gap-5 w-full">
          {cardData?.data?.map((item: any) => {
            return (
              <div key={item.id}>
                <CustomTrackingCard
                  totalKeywords={cardData?.totalKeywords}
                  className="w-[170px] h-[170px]"
                  title={item?.title}
                  data={item?.data}
                />
              </div>
            );
          })}
        </div>
        {/* <div className="w-[60%]">
        <TrackingChart/>
      </div> */}
      </div>

      {/* Filter & Table Section */}
      <div className="rounded-xl p-6 ">
      

        <CustomTable
          setExelData={setExelData}
          tableHeader={tableHeader}
          setSortedDataForExel={setSortedDataForExel}
          tableData={tableBody}
          campaignId={campaignId}
          showAddedKeyword={showAddedKeyword}
          setTableBody={setTableBody}
        /> 
      </div>
    </div>
  );
};

export default LiveKeywordComponent;
