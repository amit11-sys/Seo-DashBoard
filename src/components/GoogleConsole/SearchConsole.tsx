import AnalyticsChart from "@/components/Chart/GoogleChart";
import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
import googledata from "@/lib/googleData.json";
import chartData from "@/lib/chartdata.json";
import SearchConsoleHead from "./SearchConsoleHead";

const SearchConsoleData = () => {
  // let [searchParams] = useSearchParams();
  const [
    searchConsoleGraphData,
    // setSearchConsoleGraphData
  ] = useState<any>();
  const [searchConsoleTableData, setSearchConsoleTableData] = useState<any>();
  const [dimension, setDimension] = useState("Country");
  // const accessToken = searchParams.get("access_token");
  // const idToken = searchParams.get("id_token");

  //   Fetch Google Analytics data after OAuth flow completes
  const fetchAnalyticsData = async () => {
    // setSearchConsoleGraphData(googledata?.analyticData[0]); // assuming the analytics data is inside `data.data`
  };

  const fetchSearchConsoleByDimension = async () => {
    setSearchConsoleTableData(googledata);
  };
  // console.log(analyticData);

  useEffect(() => {
    // if (accessToken && idToken) {
    // If tokens are present, fetch analytics data
    fetchAnalyticsData();
    // } else {
    //   console.log("No tokens found in URL");
    // }
  }, []);

  useEffect(() => {
    // if (accessToken && idToken) {
    fetchSearchConsoleByDimension();
    // } else {
    //   console.log("No tokens found in URL");
    // }
  }, [dimension]);

  if (!searchConsoleGraphData && !searchConsoleTableData) {
    return <div>Loading analytics data...</div>;
  }

  return (
    <div>
      {/* <h1 className="text-4xl p-4 text-center">Google Search Console</h1> */}
      <SearchConsoleHead/>
      <AnalyticsChart
        // analyticData={searchConsoleGraphData}
        analyticData={chartData}
        tableData={searchConsoleTableData}
        setDimension={setDimension}
        dimension={dimension}
      />
    </div>
  );
};

export default SearchConsoleData;
