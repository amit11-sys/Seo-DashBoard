import React, { ReactNode } from "react";
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

type Tableitems = {
  key: string;
  label: string;
  icon?: ReactNode;
};

type TablebodyItems = {
  // select: boolean;
  keyword: string;
  location: string;
  intent: string;
  start: string;
  page: string;
  Group_Rank: string;
  Absolute_Rank: string;
  oneDay: string;
  sevenDays: string;
  thirtyDays: string;
  life: string;
  comp: string;
  sv: string;
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
interface campaignLiveKeywordsData {
  campaignLiveKeywordsData: {
    success?: boolean;
    message?: string;
    error?: string;
    LiveKeywordDbData?: any[];
  };
  campaignId: string;
}

const LiveKeywordComponent = (
  campaignLiveKeywordsData: campaignLiveKeywordsData,
  campaignId: string
) => {
  console.log(
    campaignLiveKeywordsData.campaignLiveKeywordsData.LiveKeywordDbData,
    "real data in table compo"
  );

  const tableHeader: Tableitems[] = [
    // { key: "select", label: "", icon: <Checkbox className="inline mr-1" /> },
    { key: "keyword", label: "Keyword" },
    { key: "location", label: "Location" },
    { key: "intent", label: "Intent" },
    { key: "start", label: "Start" },
    { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> },
    { key: "Absolute-Rank", label: "Absolute-Rank", icon: <FcGoogle className="inline mr-1" /> },
    { key: "Group-Rank", label: "Group-Rank", icon: <FcGoogle className="inline mr-1" /> },
    { key: "one_day", label: "1 Day" },
    { key: "seven_days", label: "7 Days" },
    { key: "thirty_days", label: "30 Days" },
    { key: "life", label: "Life" },
    { key: "comp", label: "Comp" },
    { key: "sv", label: "SV" },
    { key: "date", label: "Date" },
    { key: "ranking_url", label: "Ranking URL" },
    { key: "edit", label: "Edit keyword" },
  ];

  let tableBody: TablebodyItems[] = [];

  if (campaignLiveKeywordsData.campaignLiveKeywordsData.LiveKeywordDbData) {
    tableBody =
      campaignLiveKeywordsData.campaignLiveKeywordsData.LiveKeywordDbData.map(
        (item: any) => ({
          // select: false,
          keyword: item.keyword,
          location: item.location_name,
          intent: "C",
          start: String(item.rank_group),
          page: Math.ceil(item.rank_absolute / 10).toString(),
          Absolute_Rank: String(item.rank_absolute),
          Group_Rank: String(item.rank_group),
          oneDay: "1",
          sevenDays: "98",
          thirtyDays: "-",
          life: "-1",
          comp: "0",
          sv: "0",
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item.url ,
          // rankingUrl: new URL(item.url) || "/",
        })
      );
  }

  console.log(tableBody, "table");

  const keywordList = tableBody.map((item) => item.keyword);

  // const top3 = tableBody
  //   .filter((item) => parseInt(item.rank) <= 3)
  //   .map((item) => item.keyword);
  // // const top3 = tableBody.filter((item) => {
  // // console.log(item,"items")
  // //   return parseInt(item.rank) <= 3

  // // }

  // // )

  // const top10 = tableBody
  //   .filter((item) => parseInt(item.rank) <= 10)
  //   .map((item) => item.keyword);
  // const top20 = tableBody
  //   .filter((item) => parseInt(item.rank) <= 20)
  //   .map((item) => item.keyword);
  // const top30 = tableBody
  //   .filter((item) => parseInt(item.rank) <= 30)
  //   .map((item) => item.keyword);
  // const top100 = tableBody
  //   .filter((item) => parseInt(item.rank) <= 100)
  //   .map((item) => item.keyword);

  // // Count keywords that improved (1-day change is a negative number)
  // const keywordsUp = tableBody
  //   .filter(
  //     (item) => !isNaN(parseInt(item.oneDay)) && parseInt(item.oneDay) < 0
  //   )
  //   .map((item) => item.keyword);

  const cardsData: CardDataProp[] = [
    { title: "Keywords up", data: [], type: "keyword" },
    { title: "In Top 3", data: [], type: "keyword" },
    { title: "In Top 10", data: [], type: "keyword" },
    { title: "In Top 20", data: [], type: "keyword" },
    { title: "In Top 30", data: [], type: "keyword" },
    { title: "In Top 100", data: [], type: "keyword" },
  ];

  return (
    <div className="w-full min-h-[80vh] text-gray-100 py-8 space-y-12">
      {/* Header */}
      <div className="my-14  backdrop-blur-md text-black  border border-white/10 rounded-xl p-6 ">
        <LiveKeyTrakingHeader campaignId={campaignId} />
      </div>

      {/* Cards & Chart Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-3 gap-5">
          {cardsData.map((card, i) => (
            // <div
            //   key={i}
            //   className="w-full h-[75%] backdrop-blur-md bg-white/10 border border-white/10 rounded-xl p-4 shadow-lg"
            // >
            <CustomTrackingCard key={i} cardData={card} />
            // </div>
          ))}
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-xl p-6 ">
          <TrackingChart />
        </div>
      </div>

      {/* Filter & Table Section */}
      <div className="backdrop-blur-md   rounded-xl p-6 ">
        <div className="flex justify-between items-start gap-6 mb-6">
          <div className="flex gap-4 items-center">
            <DropDownList
              icon={<FaStar className="text-yellow-400" />}
              listName="Group By"
              showSwitch
              switchName="Favourites"
            />
            <DropDownList listName="Location" />
            <DropDownList listName="Device" />
            <CustomButton buttonName="Reset Filter" />
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <span className="text-black">Show</span>
              <select className="bg-black border px-4 border-gray-600 text-white rounded-xl p-2">
                {[10, 20, 30, 40, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <SearchBar />
          </div>
        </div>

        <CustomTable tableHeader={tableHeader} tableData={tableBody} />
      </div>
    </div>
  );
};

export default LiveKeywordComponent;
