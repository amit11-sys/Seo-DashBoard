
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
  select: boolean;
  keyword: string;
  location: string;
  intent: string;
  start: string;
  page: string;
  rank: string;
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

const tableHeader: Tableitems[] = [
  { key: "select", label: "", icon: <Checkbox className="inline mr-1" /> },
  { key: "keyword", label: "Keyword" },
  { key: "location", label: "Location" },
  { key: "intent", label: "Intent" },
  { key: "start", label: "Start" },
  { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> },
  { key: "rank", label: "Rank", icon: <FcGoogle className="inline mr-1" /> },
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

const tableBody: TablebodyItems[] = new Array(6).fill({
  select: false,
  keyword: "public adjuster glen ridge",
  location: "Florida, USA",
  intent: "C",
  start: "1",
  page: "1",
  rank: "2",
  oneDay: "1",
  sevenDays: "98",
  thirtyDays: "-",
  life: "-1",
  comp: "0",
  sv: "0",
  date: "07-Feb-25",
  rankingUrl: "/public-adjuster-glen-ridge",
  
});

const keywordList = tableBody.map((item) => item.keyword);

const cardsData: CardDataProp[] = [
  { title: "Keywords up", data: keywordList, type: "keyword" },
  { title: "In Top 3", data: keywordList, type: "keyword" },
  { title: "In Top 10", data: keywordList, type: "keyword" },
  { title: "In Top 20", data: keywordList, type: "keyword" },
  { title: "In Top 30", data: keywordList, type: "keyword" },
  { title: "In Top 100", data: keywordList, type: "keyword" },
];
interface campaignId {
    campaignId:any
}

const LiveKeywordComponent = ({campaignId}:campaignId) => {
  


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
              <CustomTrackingCard key={i}   cardData={card} />
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
