


"use client";
import { useEffect, useState } from "react";
import AnalyticsChart from "../Chart/GoogleChart";
import {
  getGoogleConsoleDataByDate,
  getGoogleSearchDataByDimension,
} from "@/actions/googleConsole";
import SearchConsoleHead from "./SearchConsoleHead";
import { Button } from "../ui/button";
import ConsoleSkeloton from "../Skeleton/ConsoleSkeloton";
interface SearchConsoleDataProps {
  campaignId: any;
  setPdfTableConsoleData?: any;
  handleGeneratePDF?: any;
  setPdfChartData?: any;
  consoleRef?: any;
}

const SearchConsoleData = ({
  consoleRef,
  campaignId,
  setPdfTableConsoleData,
  // handleGeneratePDF,
  setPdfChartData,
}: SearchConsoleDataProps) => {
  console.log(campaignId, "campaignId in search console");
  const [searchConsoleGraphData, setSearchConsoleGraphData] = useState<any>();
  const [searchConsoleTableData, setSearchConsoleTableData] = useState<any>();
  const [loading, setLoading] = useState(true); // 🔹 Added loading state

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

  console.log(dataWithDimension, "dataWithDimension in search console");
  console.log(date, "date in search console");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tableRes, graphRes] = await Promise.all([
          getGoogleSearchDataByDimension(campaignId, dimension, date),
          getGoogleConsoleDataByDate(campaignId, date),
        ]);
        console.log(graphRes, "graphRes");
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
  }, [campaignId, date]);
  const setDimensionHandler = async (dimension: any) => {
    const tableRes = await getGoogleSearchDataByDimension(
      campaignId,
      dimension,
      date
    );
    setDimension(dimension as string);
    setSearchConsoleTableData(tableRes);
  };

  
// const setDimensionHandler = async (dimension: string) => {
//   try {
//     setLoading(true); // start loader

//     const tableRes = await getGoogleSearchDataByDimension(
//       campaignId,
//       dimension,
//       date
//     );

   

//     setDimension(dimension);
//     setSearchConsoleTableData(tableRes);
//   } catch (error: any) {
//     console.error("Error fetching table data:", error);
//   } finally {
//     setLoading(false); // stop loader
//   }
// };

  console.log(searchConsoleGraphData, "searchConsoleGraphData");
  console.log(searchConsoleTableData, " searchConsoleTableData");

  const handleLoginGoogle = () => {
    const stateData = {
      campaignId: campaignId,
      analyticsData: isAnalyticsData,
      consoleData: isConsolesData,
    };

    const url = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH}`;
    const options = {
      scope: [
        `${process.env.NEXT_PUBLIC_USER_INFO_PROFILE}`,
        `${process.env.NEXT_PUBLIC_USER_INFO_EMAIL}`,
        `${process.env.NEXT_PUBLIC_AUTH_ANALYTICS}`,
        `${process.env.NEXT_PUBLIC_AUTH_WEBMASTERS}`,
        `${process.env.NEXT_PUBLIC_AUTH_ANALYTICS_READONLY}`,
        `${process.env.NEXT_PUBLIC_AUTH_BUSINESS_MANAGE}`,
      ].join(" "),
      response_type: "code",
      state: encodeURIComponent(JSON.stringify(stateData)),
      redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
      access_type: "offline",
      prompt: "consent",
      client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    };

    const qs = new URLSearchParams(options);
    return `${url}?${qs.toString()}`;
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
          <SearchConsoleHead />{" "}
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
    searchConsoleGraphData?.length === 0 &&
    searchConsoleTableData?.length === 0
  ) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md">
          <SearchConsoleHead />{" "}
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
        <div className="relative w-full h-[70vh] flex flex-col gap-10 items-center justify-center bg-gray-100">
          <div className=" w-full bg-white/60 ">
            <SearchConsoleHead />{" "}
          </div>
          <div className="  bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-500 mb-6">
              You need to connect Google Search Console Please Login.
            </p>
            <a
              href={handleLoginGoogle()}
              onClick={() => handleConnectClick("Google Search Console")}
            >
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white hover:opacity-90 transition">
                Proceed
              </Button>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div>
        <SearchConsoleHead />
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
    );
  }
};

export default SearchConsoleData;

// "use client";
// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { FaInfoCircle } from "react-icons/fa";
// import {
//   getGoogleSearchDataByDimension,
//   getGoogleConsoleDataByDate,
// } from "@/actions/googleConsole";
// import SearchConsoleHead from "./SearchConsoleHead";
// import AnalyticsChart from "../Chart/GoogleChart";

// interface SearchConsoleDataProps {
//   consoleRef: React.RefObject<HTMLDivElement>;
//   campaignId: string;
//   setPdfTableConsoleData: any;
//   setPdfChartData: any;
// }

// const SearchConsoleData = ({
//   consoleRef,
//   campaignId,
//   setPdfTableConsoleData,
//   setPdfChartData,
// }: SearchConsoleDataProps) => {
//   const [tableData, setTableData] = useState<any>();
//   const [graphData, setGraphData] = useState<any>();
//   const [loading, setLoading] = useState(true);

//   const [date, setDate] = useState({
//     startDate: "",
//     endDate: "",
//     dimensions: "date",
//   });
//   const [dimension, setDimension] = useState("country");

//   const [selectedIntegration, setSelectedIntegration] = useState("");
//   const [isAnalyticsData, setIsAnalyticsData] = useState(false);
//   const [isConsolesData, setIsConsoleData] = useState(false);

//   const handleConnectClick = (integration: string) => {
//     setSelectedIntegration(integration);
//     setIsConsoleData(integration === "Google Search Console");
//     setIsAnalyticsData(integration === "Google Analytics");
//   };

//   const handleLoginGoogle = () => {
//     const stateData = {
//       campaignId,
//       analyticsData: isAnalyticsData,
//       consoleData: isConsolesData,
//     };

//     const url = process.env.NEXT_PUBLIC_GOOGLE_AUTH!;
//     const options:any = {
//       scope: [
//         process.env.NEXT_PUBLIC_USER_INFO_PROFILE,
//         process.env.NEXT_PUBLIC_USER_INFO_EMAIL,
//         process.env.NEXT_PUBLIC_AUTH_ANALYTICS,
//         process.env.NEXT_PUBLIC_AUTH_WEBMASTERS,
//         process.env.NEXT_PUBLIC_AUTH_ANALYTICS_READONLY,
//         process.env.NEXT_PUBLIC_AUTH_BUSINESS_MANAGE,
//       ].join(" "),
//       response_type: "code",
//       state: encodeURIComponent(JSON.stringify(stateData)),
//       redirect_uri: `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`,
//       access_type: "offline",
//       prompt: "consent",
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//     };

//     return `${url}?${new URLSearchParams(options).toString()}`;
//   };

// // Fetch table and graph data once on mount
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const [tableRes, graphRes] = await Promise.all([
//         getGoogleSearchDataByDimension(campaignId, dimension, date),
//         getGoogleConsoleDataByDate(campaignId, date),
//       ]);
//       setTableData(tableRes);
//       setGraphData(graphRes);
//     } catch (error) {
//       console.error("Error fetching Google Console data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchData();
// }, [campaignId, dimension, date]);

//   // 🔹 Loading fallback
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[70vh] bg-gray-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//           <p className="text-gray-600 font-medium">Fetching search console data...</p>
//         </div>
//       </div>
//     );
//   }

//   // 🔹 No data fallback
//   if (!tableData && !graphData) {
//     return (
//       <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
//         <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col justify-center items-center">
//           <div className="flex items-center gap-3 mb-6">
//             <FcGoogle className="text-blue-600 text-4xl" />
//             <div className="font-bold text-4xl">Google Search Console</div>
//             <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Data Available</h2>
//             <p className="text-gray-500 mb-6">
//               Please connect your Google Search Console to fetch analytics.
//             </p>
//             <a href={handleLoginGoogle()} onClick={() => handleConnectClick("Google Search Console")}>
//               <Button className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white hover:opacity-90 transition">
//                 Connect Google
//               </Button>
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 🔹 Main UI
//   return (
//     <div>
//       <SearchConsoleHead />
//       <AnalyticsChart
//         analyticData={searchConsoleGraphData}
//         tableData={searchConsoleTableData}
//        setDimension={setDimension}
//           dimension={dimension}
//          setDataWithDimension={setDataWithDimension}
//          setDate={setDate}
//        />
//     </div>
//   );
// };

// export default SearchConsoleData;
