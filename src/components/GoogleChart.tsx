// import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DualAxisChart from "./ui/ChartComponent";
// import TableComponent from "./ui/Table";

// const AnalyticsChart = ({
//   analyticData,
//   tableData,
//   setDimension,
//   dimension,
// }: {
//   analyticData: any;
//   tableData: any;
//   setDimension: Dispatch<SetStateAction<string>>;
//   dimension: string;
// }) => {
//   console.log(tableData);

//   const [chartData, setChartData] = useState<any>(null);
//   // const [tableData, setTableData] = useState<any>([]);
//   // console.log(analyticData?.analyticData?.rows);

//   useEffect(() => {
//     if (analyticData) {
//       const updatedChartData =
//         Array.isArray(analyticData?.analyticData?.dateWise) &&
//         analyticData?.analyticData?.dateWise?.map((item: any) => ({
//           date: item.keys[0],
//           Clicks: item.clicks,
//           Impression: item.impressions,
//           Ctr: item.ctr,
//         }));
//       setChartData(updatedChartData);
//     }
//   }, [analyticData]);

//   return (
//     <div>
//       {chartData ? (
//         <>
//           <div className="grid grid-cols-4 text-center gap-4">
           
//             <div className="bg-[#8884d8] text-white p-2">
//               <p className="text-xl text-black">Total Clicks</p>
//               {Array.isArray(analyticData?.analyticData?.monthWise) &&
//                 analyticData?.analyticData?.monthWise?.map((item: any) => {
//                   console.log(item);
//                   return (
//                     <>
//                       <p className="text-lg">Clicks - {item?.clicks}</p>
//                       <p className="text-sm text-black">
//                         Timestamp - {item?.month}
//                       </p>

//                       {/* <p>{item?.impressions}</p> */}
//                     </>
//                   );
//                 })}
//             </div>
//             {/* <div></div> */}
//             <div className="bg-[#82ca9d] text-white p-2">
//               <p className="text-xl text-black">Total Impressions</p>
//               {Array.isArray(analyticData?.analyticData?.monthWise) &&
//                 analyticData?.analyticData?.monthWise?.map((item: any) => {
//                   console.log(item);
//                   return (
//                     <>
//                       <p className="text-lg">
//                         Impression - {item?.impressions}
//                       </p>
//                       <p className="text-sm text-black">
//                         Timestamp - {item?.month}
//                       </p>

//                       {/* <p>{item?.impressions}</p> */}
//                     </>
//                   );
//                 })}
//             </div>
//             <div className=" text-white bg-gray-800 p-2">
//               <p className="text-xl ">Total CTR</p>
//               {Array.isArray(analyticData?.analyticData?.monthWise) &&
//                 analyticData?.analyticData?.monthWise?.map((item: any) => {
//                   console.log(item);
//                   return (
//                     <>
//                       <p className="text-lg">
//                         CTR - {item?.ctr}
//                       </p>
//                       <p className="text-sm">
//                         Timestamp - {item?.month}
//                       </p>

//                       {/* <p>{item?.impressions}</p> */}
//                     </>
//                   );
//                 })}
//             </div>

//             <div className=" text-black bg-gray-400 p-2">
//               <p className="text-xl text-black">Total CTR</p>
//               {Array.isArray(analyticData?.analyticData?.monthWise) &&
//                 analyticData?.analyticData?.monthWise?.map((item: any) => {
//                   console.log(item);
//                   return (
//                     <>
//                       <p className="text-lg">
//                         POSITION - {item?.position}
//                       </p>
//                       <p className="text-sm text-black">
//                         Timestamp - {item?.month}
//                       </p>

//                       {/* <p>{item?.impressions}</p> */}
//                     </>
//                   );
//                 })}
//             </div>
//           </div>
//           <DualAxisChart data={chartData} />
//         </>
//       ) : (
//         <p>Loading chart data...</p>
//       )}
//       <Tabs defaultValue="country" className="w-full">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="country" onClick={() => setDimension("country")}>
//             COUNTRY
//           </TabsTrigger>
//           <TabsTrigger value="devices" onClick={() => setDimension("device")}>
//             DEVICES
//           </TabsTrigger>
//           <TabsTrigger value="pages" onClick={() => setDimension("page")}>
//             PAGES
//           </TabsTrigger>
//           <TabsTrigger value="query" onClick={() => setDimension("query")}>
//             QUERIES
//           </TabsTrigger>
//           <TabsTrigger value="date" onClick={() => setDimension("date")}>
//             DATE
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>
//       <TableComponent analyticData={tableData} dimension={dimension} />
//     </div>
//   );
// };

// export default AnalyticsChart;
