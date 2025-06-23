
// "use client";
// import React,{ReactNode} from "react";
// import CustomTrackingCard from "@/components/cards/CustomTrackingCard";
// import TrackingChart from "@/components/Chart/TrackingChart";
// import DropDownList from "@/components/DropDownList";
// import SearchBar from "@/components/searchBar/SearchBar";
// import CustomTable from "@/components/table/CustomTable";

// import CustomButton from "@/components/ui/CustomButton";


// import { FaStar } from "react-icons/fa6";
// import { FcGoogle } from "react-icons/fc";
// import { Checkbox } from "@radix-ui/react-checkbox";
// import LiveKeyTrakingHeader from "@/components/cards/LiveKeyTrakingHeader";


// type Tableitems = {
//   key: string;
//   label: string;
//   icon?:ReactNode
// };
// type TablebodyItems = {
//   select: boolean;
//   keyword: string;
//   location: string;
//   intent: string;
//   start: string;
//   page: string;
//   rank: string;
//   oneDay: string ;
//   sevenDays: string;
//   thirtyDays: string;
//   life: string;
//   comp: string;
//   sv: string;
//   date: string;
//   rankingUrl: string;
// };
// const LiveKeywordComponent = () => {
//      const tableHeader: Tableitems[] = [
//   { key: "select", label: "", icon: <Checkbox className="inline mr-1"  />   }, // Checkbox column
//   { key: "keyword", label: "Keyword" },
//   { key: "location", label: "Location" },
//   { key: "intent", label: "Intent" },
//   { key: "start", label: "Start" },
//   { key: "page", label: "Page", icon: <FcGoogle className="inline mr-1" /> }, 
//   { key: "page", label: "Rank", icon: <FcGoogle className="inline mr-1" /> }, 
//   { key: "one_day", label: "1 Day" },
//   { key: "seven_days", label: "7 Days" },
//   { key: "thirty_days", label: "30 Days" },
//   { key: "life", label: "Life" },
//   { key: "comp", label: "Comp" },
//   { key: "sv", label: "SV" },
//   { key: "date", label: "Date" },
//   { key: "ranking_url", label: "Ranking URL" },
// ];

 

//   const Tablebodyitems : TablebodyItems[] = [
//   {
//     select: false,
//     keyword: "public adjuster glen ridge",
//     location: "Florida, USA",
//     intent: "C",
//     start:"1",
//     page: "1",
//     rank: "2",
//     oneDay: "1",
//     sevenDays: "98",
//     thirtyDays: "-",
//     life: "-1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-glen-ridge",
//   },
//   {
//     select: false,
//     keyword: "public adjuster westlake",
//     location: "Florida, USA",
//     intent: "C",
//     start: "3",
//     page: "1",
//     rank: "2",
//     oneDay: "-",
//     sevenDays: "1",
//     thirtyDays: "1",
//     life: "1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-westlake",
//   },
//   {
//     select: false,
//     keyword: "public adjuster glen ridge",
//     location: "Florida, USA",
//     intent: "C",
//     start:"1",
//     page: "1",
//     rank: "2",
//     oneDay: "1",
//     sevenDays: "98",
//     thirtyDays: "-",
//     life: "-1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-glen-ridge",
//   },
//   {
//     select: false,
//     keyword: "public adjuster westlake",
//     location: "Florida, USA",
//     intent: "C",
//     start: "3",
//     page: "1",
//     rank: "2",
//     oneDay: "-",
//     sevenDays: "1",
//     thirtyDays: "1",
//     life: "1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-westlake",
//   },
//   {
//     select: false,
//     keyword: "public adjuster glen ridge",
//     location: "Florida, USA",
//     intent: "C",
//     start:"1",
//     page: "1",
//     rank: "2",
//     oneDay: "1",
//     sevenDays: "98",
//     thirtyDays: "-",
//     life: "-1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-glen-ridge",
//   },
//   {
//     select: false,
//     keyword: "public adjuster westlake",
//     location: "Florida, USA",
//     intent: "C",
//     start: "3",
//     page: "1",
//     rank: "2",
//     oneDay: "-",
//     sevenDays: "1",
//     thirtyDays: "1",
//     life: "1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-westlake",
//   },
//   {
//     select: false,
//     keyword: "public adjuster glen ridge",
//     location: "Florida, USA",
//     intent: "C",
//     start:"1",
//     page: "1",
//     rank: "2",
//     oneDay: "1",
//     sevenDays: "98",
//     thirtyDays: "-",
//     life: "-1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-glen-ridge",
//   },
//   {
//     select: false,
//     keyword: "public adjuster westlake",
//     location: "Florida, USA",
//     intent: "C",
//     start: "3",
//     page: "1",
//     rank: "2",
//     oneDay: "-",
//     sevenDays: "1",
//     thirtyDays: "1",
//     life: "1",
//     comp: "0",
//     sv: "0",
//     date: "07-Feb-25",
//     rankingUrl: "/public-adjuster-westlake",
//   },
// ];



//   const [state, setState] = React.useState<any>();
//   return (
//     <>
//     <div className="w-full h-auto">
//             <div className="liveTracking-Header">
//             <LiveKeyTrakingHeader/>
    
//             </div>
    
//             <div className="w-full mt-7  gap-2 flex">
              
//               <div className="w-full grid grid-cols-3  gap-4  ">
//                 <CustomTrackingCard />
//                 <CustomTrackingCard />
//                 <CustomTrackingCard />
//                 <CustomTrackingCard />
//                 <CustomTrackingCard />
//                 <CustomTrackingCard />
//               </div>
//                <div className="w-full  flex   ">
//                 <TrackingChart />
//               </div>
             
//             </div>
//           </div>
       
//           <div className="table-container">
//             <div className="table-filter flex gap-4 justify-between items-center my-10">
//               <div className=" flex gap-3">
//                 <div className="filterFav flex items-center gap-2 text-nowrap  ">
//                   Group By
//                   <DropDownList
//                     icon={<FaStar className="text-2xl" />}
//                     showSwitch={true}
//                     switchName="Favourites"
//                   />
//                 </div>
//                 <div className="filterLocation">
//                   <DropDownList listName="Location" />
//                 </div>
//                 <div className="filterDevice">
//                   <DropDownList listName="Device" />
//                 </div>
//                 {/* <div className="filterReset flex items-center"> */}
//                 <CustomButton buttonName="Reset Filter" />
    
//                 {/* </div> */}
//               </div>
//               <div className="flex gap-2">
//                 <div className=" flex items-center gap-2 ">
//                   {/* <DropDownList
//                   showArrow={false}
//                   listData={["1","2","3","4","5"]}
//                   listName="1"
//                 />  */}
//                   <p>Show</p>
//                   <select
//                     className=" p-2 border rounded-xl "
//                     name="Table-row-count"
//                     id="tableCount"
//                   >
//                     <option value="10">10</option>
//                     <option value="20">20</option>
//                     <option value="30">30</option>
//                     <option value="40">40</option>
//                     <option value="50">50</option>
//                   </select>
//                 </div>
//                 <div className="seach_container">
//                   <SearchBar />
//                 </div>
//               </div>
//             </div>
    
//             <div className="mainTable">
//               <CustomTable tableHeader={tableHeader} tableData={Tablebodyitems} />
//             </div>
//           </div>
    
//     </>
//   )
// }

// export default LiveKeywordComponent



"use client";
import React, { ReactNode, useState } from "react";
import CustomTrackingCard from "@/components/cards/CustomTrackingCard";
import TrackingChart from "@/components/Chart/TrackingChart";
import DropDownList from "@/components/DropDownList";
import SearchBar from "@/components/searchBar/SearchBar";
import CustomTable from "@/components/table/CustomTable";
import CustomButton from "@/components/ui/CustomButton";
import { FaStar } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "@radix-ui/react-checkbox";
import LiveKeyTrakingHeader from "@/components/cards/LiveKeyTrakingHeader";

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

const LiveKeywordComponent = () => {
  const [state, setState] = useState<any>();

  return (
    <div className="w-full min-h-[80vh]  text-gray-100 ps-[300px] py-8 space-y-12">
      <div className="my-14 backdrop-blur-md text-black bg-white/10 border border-white/10 rounded-xl p-6 shadow-lg">
        <LiveKeyTrakingHeader />
      </div>
      <div className="grid grid-cols-2 gap-4">
    <div className="grid grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className=" w-full h-[75%] backdrop-blur-md bg-white/10 border border-white/10 rounded-xl p-4 shadow-lg"
          >
            <CustomTrackingCard />
          </div>
        ))}
      </div>

      <div className="backdrop-blur-md bg-white/10 border   border-white/10 rounded-xl p-6 shadow-lg">
        <TrackingChart />
      </div>


      </div>
      

      <div className="backdrop-blur-md  bg-white/10 border border-white/10 rounded-xl p-6 shadow-lg">
        {/* Filter Controls */}
        <div className="flex  justify-between items-start gap-6 mb-6">
          <div className="flex  gap-4 items-center">
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

        {/* Table */}
        <CustomTable tableHeader={tableHeader} tableData={tableBody} />
      </div>
    </div>
  );
};

export default LiveKeywordComponent;
