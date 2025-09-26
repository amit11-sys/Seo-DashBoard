import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FancyDualAxisChart from "@/components/GoogleConsole/Chartcomponent";
import TableComponent from "@/components/GoogleConsole/TableComponent";
import {
  FaGlobe,
  FaMobileAlt,
  FaFileAlt,
  FaSearch,
  FaCalendarAlt,
  FaSync,
} from "react-icons/fa";
// import CardsAnalysis from "../GoogleConsole/FancyStatsBar";
// import FancyStatsBar from "../GoogleConsole/FancyStatsBar";
// import AnimatedStats from "../GoogleConsole/AnimatedStats";
// import DashboardStats from "../GoogleConsole/CombinedCode";
import DashboardStatsCollage from "../GoogleConsole/CombinedCode";
// import { FaFileExcel } from "react-icons/fa6";
import DateRangeDialog from "../GoogleConsole/DateTable/DateTableDialog";
import DownloadExcelBtn from "../GoogleConsole/DownloadExcelBtn";
import FancyDualAxisChartJS from "@/components/GoogleConsole/Chartcomponent";
const AnalyticsChart = ({
  analyticData,
  tableData,
  setDimension,
  setDataWithDimension,
  setDate,
  setPdfTableConsoleData,
  setDimensionHandler,
  // handleGeneratePDF,
  setPdfChartData,
  dimension,
  consoleRef
}: {
  analyticData: any;
  tableData: any;
  setDimension: Dispatch<SetStateAction<string>>;
  setDimensionHandler: any
  dimension: string;
  setDataWithDimension: Dispatch<SetStateAction<any>>,
  setDate: Dispatch<SetStateAction<any>>,
  setPdfTableConsoleData?: Dispatch<SetStateAction<any>>
  // handleGeneratePDF?: () => void
  setPdfChartData?: Dispatch<SetStateAction<any>>
  consoleRef?: any
}) => {
  const [campareChartData, setCampareChartData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  console.log(analyticData,"analyticData");

  // useEffect(() => {
  //   if (analyticData) {
  //     const updatedChartData = Array.isArray(analyticData?.analyticData?.dateWise) &&
  //       analyticData?.analyticData?.dateWise?.map((item: any) => ({
  //         date: item.keys[0],
  //         Clicks: item.clicks,
  //         Impression: item.impressions,
  //         Ctr: item.ctr,
  //       }));

  //     setChartData(updatedChartData);
      
  //   }
  // }, [analyticData]);


 console.log(analyticData, "analyticData");
  console.log(tableData, " tableData")

// const consolehtmlForPdf = (tableData:any, analyticData:any) => {
//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="utf-8" />
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             padding: 20px;
//             background-color: #ffffff;
//             color: #333;
//           }

//           .stats-grid {
//             display: flex;
//             gap: 16px;
//             flex-wrap: wrap;
//             justify-content: space-between;
//             margin-bottom: 40px;
//           }

//           .stat-box {
//             flex: 1 1 22%;
//             background-color: #f3f3f3;
//             padding: 16px;
//             border-radius: 8px;
//             text-align: center;
//           }

//           .stat-label {
//             font-size: 14px;
//             margin-bottom: 8px;
//             color: #666;
//           }

//           .stat-value {
//             font-size: 22px;
//             font-weight: bold;
//             color: #000;
//           }

//           .chart-placeholder {
//             height: 300px;
//             border: 2px dashed #ccc;
//             border-radius: 8px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             color: #888;
//             font-size: 16px;
//           }
//         </style>
//       </head>
//       <body>
//         <h2 style="text-align:center; margin-bottom: 32px;">Analytics Report</h2>

//         <div class="stats-grid">
//          ${<DashboardStatsCollage analyticData={tableData} />}
//         </div>
//          <div className="mt-6">
//             ${<DualAxisChart data={analyticData} />}
//           </div>
//         <div class="chart-placeholder">
//           Chart Placeholder (DualAxisChart image or data not renderable in HTML string)
//         </div>
//       </body>
//     </html>
//   `;
// };

  
  //   useEffect(() => {
  //     setPdfChartData(consoleRef.current?.innerHTML))
  // },[handleGeneratePDF])

  return (
    <div className="space-y-6">
      {/* <CardsAnalysis /> */}
      {/* <FancyStatsBar analyticData={analyticData} /> */}
      <div ref={consoleRef}>


      {/* <AnimatedStats/> */}
      <DashboardStatsCollage analyticData={tableData} />

      {/* <DashboardStats/> */}
        <div className="flex justify-end shadow-md p-5 items-center w-full my-4 gap-3">
          <div className="p-2 rounded-full hover:bg-gray-100" title="generate excel">
         {/* <DownloadExcelBtn analyticData={analyticData} /> */}
      </div>
   
      <div className="p-2 rounded-full " title="Select Date">
        <DateRangeDialog 
        // setDataWithDimension={setDataWithDimension} 
        setDate={setDate}/>
      </div>
      {/* <button className="p-2 rounded-full hover:bg-gray-100" title="Refresh Data">
        <FaSync className="text-purple-500 text-4xl" />
      </button> */}
    </div>
      {analyticData ? (
        <>
          {/* Chart */}
          <div className="mt-6">
            <FancyDualAxisChart ChartData={analyticData} />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 mt-10">Loading chart data...</p>
      )}
      </div>

      {/* Tabs */}

      <Tabs defaultValue="country" className="w-full py-3 my-10">
        <TabsList className="flex w-full justify-center gap-3  p-4 rounded-xl shadow-md">
          <TabsTrigger
            value="country"
            onClick={() => setDimensionHandler("Country") }
            className="px-4 py-2 flex items-center gap-2 font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 rounded-xl data-[state=active]:text-white"
          >
            <FaGlobe size={16} /> COUNTRY
          </TabsTrigger>

          <TabsTrigger
            value="devices"
            onClick={() => setDimensionHandler("Device")}
            className="px-4 py-2 flex items-center gap-2 rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaMobileAlt size={16} /> DEVICES
          </TabsTrigger>

          <TabsTrigger
            value="pages"
            onClick={() => setDimensionHandler("Page")}
            className="px-4 py-2 flex items-center gap-2rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaFileAlt size={16} /> PAGES
          </TabsTrigger>

          <TabsTrigger
            value="query"
            onClick={() => setDimensionHandler("Query")}
            className="px-4 py-2 flex items-center gap-2 rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaSearch size={16} /> QUERIES
          </TabsTrigger>

          <TabsTrigger
            value="date"
            onClick={() => setDimensionHandler("Date")}
            className="px-4 py-2 flex items-center gap-2 rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaCalendarAlt size={16} /> DATE
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      {/* <div className="mt-6"> */}
      <TableComponent
      //  handleGeneratePDF={handleGeneratePDF} 
      //  setPdfTableConsoleData={setPdfTableConsoleData} 
       analyticData={tableData} 
       dimension={dimension} />
      {/* </div> */}
    </div>
  );
};

export default AnalyticsChart;
