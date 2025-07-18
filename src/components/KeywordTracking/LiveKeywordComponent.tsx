"use client";
import React, { ReactNode, useEffect, useState } from "react";
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
import Header from "../Common/Header";

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

type CardDataProp = {
  title: string;
  data?: string[];
  type?: string;
};

interface campaignId {
  campaignId: any;
}
interface LiveKeywordComponentProps {
  campaignLiveKeywordsData: {
    success?: boolean;
    message?: string;
    error?: string;
    newLiveKeywordDbData?: any[];
  };
  campaignId: string;
}

const LiveKeywordComponent = ({
  campaignLiveKeywordsData,
  campaignId,
}: LiveKeywordComponentProps) => {
  const [tableBody, setTableBody] = useState<any[]>([]);

  const tableHeader: Tableitems[] = [
    // { key: "select", label: "", icon: <Checkbox className="inline mr-1" /> },
    { key: "keyword", label: "Keyword" },
    { key: "location", label: "Location" },
    { key: "intent", label: "Intent" },
    { key: "start", label: "Start" },
    { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> },
    {
      key: "Absolute-Rank",
      label: "Absolute-Rank",
      icon: <FcGoogle className="inline mr-1" />,
    },

    {
      key: "Group-Rank",
      label: "Group-Rank",
      icon: <FcGoogle className="inline mr-1" />,
    },
    // { key: "one_day", label: "1 Day" },
    { key: "seven_days", label: "7 Days" },
    // { key: "thirty_days", label: "30 Days" },
    { key: "life", label: "Life" },
    { key: "comp", label: "Comp" },
    { key: "sv", label: "SV" },
    { key: "date", label: "Date" },
    { key: "ranking_url", label: "Ranking URL" },
    { key: "edit", label: "Edit keyword" },
  ];

  // let tableBody: TablebodyItems[] = [];
  useEffect(() => {
    // console.log(campaignLiveKeywordsData, "use effect");
    if (campaignLiveKeywordsData) {
      keywordTableData();
    }
  }, [campaignLiveKeywordsData]);
  // console.log(campaignLiveKeywordsData, "use effect data");

  const keywordTableData = async () => {
    if (campaignLiveKeywordsData.newLiveKeywordDbData) {
      const data = campaignLiveKeywordsData.newLiveKeywordDbData.map(
        (item: any) => ({
          keyword: item?.keyword || "",
          keywordId: item.keywordId,
          location: item?.location_name?.locationName?.locationName || "",
          intent: item?.intent || "",
          start: item?.start || 0,
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
        })
      );
      setTableBody(data);
    }
  };
  console.log(tableBody, "table body");

  // const showAddedKeyword = async (newItem: any) => {
  //   // console.log(newItem, "showadded ok hai");
  //   const trackingKeyword = await getDbLiveKeywordData(campaignId);

  //   // if (trackingKeyword && trackingKeyword?.newLiveKeywordDbData?.length > 0) {

  //   const mappedItems =
  //     trackingKeyword?.newLiveKeywordDbData?.map((item: any) => {
  //       console.log(item, "new added dataa");
  //       return {
  //         keyword: item.keyword,
  //         location: item?.location_name?.locationName?.locationName,
  //         intent: item.intent || "",
  //         start: String(item.start),
  //         page: Math.ceil(item.rank_absolute / 10).toString(),
  //         Absolute_Rank: String(item.rank_absolute),
  //         Group_Rank: String(item.rank_group),
  //         sevenDays: "-",
  //         life: String(item.rank_absolute),
  //         comp: item.competition || 0,
  //         sv: item.searchVolumn || 0,
  //         date: new Date(item.createdAt).toLocaleDateString("en-GB", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "2-digit",
  //         }),
  //         rankingUrl: item.url,
  //       };
  //     }) ?? [];

  //   setTableBody((prev) => [...prev, ...mappedItems]);

  //   // }
  // };
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

  return (
    <div className="w-full min-h-[80vh]  text-gray-100  space-y-12">
      {/* Header */}
      <div className="my-14  backdrop-blur-md text-black  border border-white/10 rounded-xl p-6 ">
        <LiveKeyTrakingHeader
          campaignId={campaignId}
          showAddedKeyword={showAddedKeyword}
        />
      </div>

      {/* Filter & Table Section */}
      <div className="backdrop-blur-md rounded-xl p-6 ">
        <CustomTable
          tableHeader={tableHeader}
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
