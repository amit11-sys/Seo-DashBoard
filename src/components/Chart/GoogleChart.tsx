import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DualAxisChart from "@/components/GoogleConsole/Chartcomponent";
import TableComponent from "@/components/GoogleConsole/TableComponent";
import {
  FaGlobe,
  FaMobileAlt,
  FaFileAlt,
  FaSearch,
  FaCalendarAlt,
  FaSync,
} from "react-icons/fa";
import CardsAnalysis from "../GoogleConsole/FancyStatsBar";
import FancyStatsBar from "../GoogleConsole/FancyStatsBar";
import AnimatedStats from "../GoogleConsole/AnimatedStats";
import DashboardStats from "../GoogleConsole/CombinedCode";
import DashboardStatsCollage from "../GoogleConsole/CombinedCode";
import { FaFileExcel } from "react-icons/fa6";
import DateRangeDialog from "../GoogleConsole/DateTable/DateTableDialog";
const AnalyticsChart = ({
  analyticData,
  tableData,
  setDimension,
  dimension,
}: {
  analyticData: any;
  tableData: any;
  setDimension: Dispatch<SetStateAction<string>>;
  dimension: string;
}) => {
  const [chartData, setChartData] = useState<any>(null);
  // console.log(analyticData);

  useEffect(() => {
    if (analyticData) {
      const updatedChartData =
        Array.isArray(analyticData?.analyticData?.dateWise) &&
        analyticData?.analyticData?.dateWise?.map((item: any) => ({
          date: item.keys[0],
          Clicks: item.clicks,
          Impression: item.impressions,
          Ctr: item.ctr,
        }));
      setChartData(updatedChartData);
    }
  }, [analyticData]);

  return (
    <div className="space-y-6">
      {/* <CardsAnalysis /> */}
      {/* <FancyStatsBar analyticData={analyticData} /> */}

      {/* <AnimatedStats/> */}
      <DashboardStatsCollage analyticData={analyticData} />

      {/* <DashboardStats/> */}
        <div className="flex justify-end shadow-md p-5 items-center w-full my-4 gap-3">
      <button className="p-2 rounded-full hover:bg-gray-100" title="Export to Excel">
        <FaFileExcel className="text-green-600 text-4xl" />
       
      </button>
      <div className="p-2 rounded-full hover:bg-gray-100" title="Select Date">
        <DateRangeDialog/>
      </div>
      <button className="p-2 rounded-full hover:bg-gray-100" title="Refresh Data">
        <FaSync className="text-purple-500 text-4xl" />
      </button>
    </div>
      {chartData ? (
        <>
          {/* Chart */}
          <div className="mt-6">
            <DualAxisChart data={chartData} />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 mt-10">Loading chart data...</p>
      )}

      {/* Tabs */}

      <Tabs defaultValue="country" className="w-full py-3 my-10">
        <TabsList className="flex w-full justify-center gap-3  p-4 rounded-xl shadow-md">
          <TabsTrigger
            value="country"
            onClick={() => setDimension("Country")}
            className="px-4 py-2 flex items-center gap-2 font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 rounded-xl data-[state=active]:text-white"
          >
            <FaGlobe size={16} /> COUNTRY
          </TabsTrigger>

          <TabsTrigger
            value="devices"
            onClick={() => setDimension("Device")}
            className="px-4 py-2 flex items-center gap-2 rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaMobileAlt size={16} /> DEVICES
          </TabsTrigger>

          <TabsTrigger
            value="pages"
            onClick={() => setDimension("Page")}
            className="px-4 py-2 flex items-center gap-2rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaFileAlt size={16} /> PAGES
          </TabsTrigger>

          <TabsTrigger
            value="query"
            onClick={() => setDimension("Query")}
            className="px-4 py-2 flex items-center gap-2 rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaSearch size={16} /> QUERIES
          </TabsTrigger>

          <TabsTrigger
            value="date"
            onClick={() => setDimension("Date")}
            className="px-4 py-2 flex items-center gap-2 rounded-xl font-medium transition-all text-black hover:bg-orange-100 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
          >
            <FaCalendarAlt size={16} /> DATE
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      {/* <div className="mt-6"> */}
      <TableComponent analyticData={tableData} dimension={dimension} />
      {/* </div> */}
    </div>
  );
};

export default AnalyticsChart;
