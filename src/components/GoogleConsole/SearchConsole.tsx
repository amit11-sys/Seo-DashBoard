"use client";
import { useEffect, useState } from "react";
import AnalyticsChart from "../Chart/GoogleChart";
import {
  getDisableSearchConsole,
  getGoogleConsoleDataByDate,
  getGoogleSearchDataByDimension,
} from "@/actions/googleConsole";
import SearchConsoleHead from "./SearchConsoleHead";
import { Button } from "../ui/button";
import ConsoleSkeloton from "../Skeleton/ConsoleSkeloton";
import GoogleConnect from "../modals/GoogleConnect";
import { useSearchParams } from "next/navigation";

interface SearchConsoleDataProps {
  campaignId: any;
  setPdfTableConsoleData?: any;
  handleGeneratePDF?: any;
  setPdfChartData?: any;
  consoleRef?: any;
  ActiveUserData?:any
}

const SearchConsoleData = ({
  consoleRef,
  campaignId,
  setPdfTableConsoleData,
  // handleGeneratePDF,
  setPdfChartData,
  ActiveUserData,
}: SearchConsoleDataProps) => {
  const [searchConsoleGraphData, setSearchConsoleGraphData] = useState<any>();
  const [searchConsoleTableData, setSearchConsoleTableData] = useState<any>();
  const [loading, setLoading] = useState(true); // 🔹 Added loading state
  const searchParams = useSearchParams();
  const rerun = searchParams.get("rerun");
  // console.log(rerun, "rerun in search console");
  const [dataWithDimension, setDataWithDimension] = useState({
    startDate: "",
    endDate: "",
  });
  const [date, setDate] = useState({
    startDate: "",
    endDate: "",
    dimensions: "date",
  });
  const [dimension, setDimension] = useState("country");
  const [selectedIntegration, setSelectedIntegration] = useState("");

  const [isAnalyticsData, setIsAnalyticsData] = useState(false);
  const [isConsolesData, setIsConsoleData] = useState(false);

  const handleConnectClick = (integration: string) => {
    setSelectedIntegration(integration);
    if (integration === "Google Search Console") {
      setIsConsoleData(true);
    }
    if (integration === "Google Analytics") {
      setIsAnalyticsData(true);
    }
  };

  // console.log(dataWithDimension, "dataWithDimension in search console");
  // console.log(date, "date in search console");
  const disableConsole = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to disable this integration?"
    );
    if (!confirmed) return;

    try {
      await getDisableSearchConsole(campaignId);

      // maybe clear UI state or re-fetch data
      setSearchConsoleTableData(null);
      setSearchConsoleGraphData(null);
      alert("Search Console disabled successfully.");
    } catch (error) {
      console.error("Error disabling Search Console:", error);
      alert("Failed to disable Search Console. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tableRes, graphRes] = await Promise.all([
          getGoogleSearchDataByDimension(campaignId, dimension, date),
          getGoogleConsoleDataByDate(campaignId, date),
        ]);
        console.log(graphRes, "graphRes");
        console.log(tableRes, "tableRes");
        setSearchConsoleTableData(tableRes);
        // const normalData = graphRes?.normalData;
        // const campareData = graphRes?.compareData;
        setSearchConsoleGraphData(graphRes);
        // setSearchConsoleGraphData(graphRes);
        /// correct this data differntly
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // 🔹 Stop loading after fetch
      }
    };
    fetchData();
  }, [campaignId, date,rerun]);


   const fetchConsoleData = async () => {
      try {
        const [tableRes, graphRes] = await Promise.all([
          getGoogleSearchDataByDimension(campaignId, dimension, date),
          getGoogleConsoleDataByDate(campaignId, date),
        ]);
        console.log(graphRes, "graphRes");
        console.log(tableRes, "tableRes");
        setSearchConsoleTableData(tableRes);
        // const normalData = graphRes?.normalData;
        // const campareData = graphRes?.compareData;
        setSearchConsoleGraphData(graphRes);
        // setSearchConsoleGraphData(graphRes);
        /// correct this data differntly
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // 🔹 Stop loading after fetch
      }
    };
  const setDimensionHandler = async (dimension: any) => {
    const tableRes = await getGoogleSearchDataByDimension(
      campaignId,
      dimension,
      date
    );
    setDimension(dimension as string);
    setSearchConsoleTableData(tableRes);
  };

 
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
const handleConnect = () => {
  console.log("click")
  setIsConnectModalOpen(true);
};


  // 🔹 Show loading while fetching
  if (loading) {
    return (
      // <div className="relative w-full h-[70vh] flex flex-col items-center justify-center bg-gray-100">
      //   <div className=" bg-white/60 backdrop-blur-md">
      //     <SearchConsoleHead />
      //   </div>
      //   <div className="flex flex-col items-center gap-4">
      //     <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      //     <p className="text-gray-600 font-medium">
      //       Fetching Google Console data...
      //     </p>
      //   </div>
      // </div>

      <div className="relative w-full gap-10 flex flex-col items-center justify-center bg-gray-100">
        <div className=" w-full bg-white/60">
          <SearchConsoleHead ActiveUserData={ActiveUserData} disableConsole={disableConsole} />{" "}
        </div>
        {/* <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
           <p className="text-gray-600 font-medium">
            Fetching Google Console data...
          </p>
       </div> */}

        <ConsoleSkeloton />
      </div>
    );
  }

  if (
    searchConsoleGraphData?.normalData?.length === 0 &&
    searchConsoleTableData?.normalData?.length === 0
  ) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md">
          <SearchConsoleHead ActiveUserData={ActiveUserData} disableConsole={disableConsole} />{" "}
        </div>
        <div className="absolute z-10 bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Data Available
          </h2>
        </div>
      </div>
    );
  } else {
    if (!searchConsoleGraphData && !searchConsoleTableData) {
      return (
        <>
             {isConnectModalOpen && (
      <GoogleConnect
      fetchConsoleData={fetchConsoleData}
        campaignId={campaignId}
        open={isConnectModalOpen}
        onOpenChange={(open) => setIsConnectModalOpen(open)} 
        integrationType="gsc"
      />
    )}
        
        <div className="relative w-full h-[70vh] flex flex-col gap-10 items-center justify-center bg-gray-100">
          <div className=" w-full bg-white/60 ">
            <SearchConsoleHead ActiveUserData={ActiveUserData} disableConsole={disableConsole} />{" "}
          </div>
          <div className="  bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-500 mb-6">
              You need to connect Google Search Console Please Login.
            </p>
            {/* <a
              // href={handleLoginGoogle()}
              // onClick={() => handleConnectClick("Google Search Console")}
            > */}
            {ActiveUserData?.role === 2 && (

              <Button
                onClick={() => {
                  handleConnect();
                  
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white hover:opacity-90 transition"
              >
                Proceed
              </Button>

            ) }
            {/* </a> */}
          </div>
        </div>
        </>
      );
    }

    return (
      <>
   
      <div>
        <SearchConsoleHead ActiveUserData={ActiveUserData} disableConsole={disableConsole} />
        <AnalyticsChart
          analyticData={searchConsoleGraphData}
          tableData={searchConsoleTableData}
          setDimension={setDimension}
          setDimensionHandler={setDimensionHandler}
          dimension={dimension}
          setDataWithDimension={setDataWithDimension}
          setDate={setDate}
        />
      </div>
      </>
    );
  }
};

export default SearchConsoleData;



