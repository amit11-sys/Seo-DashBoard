// "use client";
// // import AnalyticsChart from "@/components/Chart/GoogleChart";
// import { useEffect, useState } from "react";
// // import { useSearchParams } from "react-router-dom";
// import googledata from "@/lib/googleData.json";
// import chartData from "@/lib/chartdata.json";
// import SearchConsoleHead from "./SearchConsoleHead";
// import AnalyticsChart from "../Chart/GoogleChart";
// import {
//   getGoogleConsoleDataByDate,
//   getGoogleSearchDataByDimension,
// } from "@/actions/googleConsole";
// // import { getTrackingData } from "@/actions/keywordTracking";

// const SearchConsoleData = (campaignId: any) => {
//   // let [searchParams] = useSearchParams();

//   const [searchConsoleGraphData, setSearchConsoleGraphData] = useState<any>();
//   const [searchConsoleTableData, setSearchConsoleTableData] = useState<any>();
//   const [searchConsoleTableData1, setSearchConsoleTableData1] = useState<any>();

//   const [dataWithDimension, setDataWithDimension] = useState({
//     startDate: "",
//     endDate: "",
//     dimensions: "Country",
//     // rowsPerPage: 10000,
//   });
//   const [date, setDate] = useState({
//     startDate: "",
//     endDate: "",
//     dimensions: "date",
//   });
//   const [dimension, setDimension] = useState("country");

//   // const accessToken = searchParams.get("access_token");
//   // const idToken = searchParams.get("id_token");

//   //   Fetch Google Analytics data after OAuth flow completes
//   const fetchAnalyticsData = async () => {
//     // setSearchConsoleGraphData(googledata?.analyticData[0]); // assuming the analytics data is inside `data.data`
//   };

//   // const fetchGoogleConsoleDataByDate = async () => {
//   //   setSearchConsoleTableData(googledata);
//   // };
//   // const fetchGoogleSearchDataByDimension = async () => {
//   //   setSearchConsoleTableData(googledata);
//   // };
//   // console.log(analyticData);

//   useEffect(() => {
//     const fetchAnalyticsDataAndSetState = async () => {
//       try {
//         // If tokens are present, fetch analytics data
//         // const analyticData = await fetchAnalyticsData();
//         // setSearchConsoleGraphData(analyticData);
//         const data = await getGoogleSearchDataByDimension(
//           campaignId?.campaignId
//         );
//         setSearchConsoleTableData(data);
//       } catch (error) {
//         console.error("Error fetching analytics data", error);
//       }
//     };

//     const fetchGoogleConsoleDataByDateAndSetState = async () => {
//       try {
//         const data = await getGoogleConsoleDataByDate(campaignId?.campaignId);
//         setSearchConsoleGraphData(data);
//       } catch (error) {
//         console.error("Error fetching Google Console data by date", error);
//       }
//     };

//     fetchAnalyticsDataAndSetState();
//     fetchGoogleConsoleDataByDateAndSetState();
//   }, []);

//   useEffect(() => {
//     const fetchAnalyticsDataAndSetState = async () => {
//       try {
//         // If tokens are present, fetch analytics data
//         // const analyticData = await fetchAnalyticsData();
//         // setSearchConsoleGraphData(analyticData);
//         const data = await getGoogleSearchDataByDimension(
//           campaignId?.campaignId
//         );
//         setSearchConsoleTableData(data);
//       } catch (error) {
//         console.error("Error fetching analytics data", error);
//       }
//     };
//     fetchAnalyticsDataAndSetState();
//   }, [dataWithDimension]);

//   useEffect(() => {
//     const fetchGoogleConsoleDataByDateAndSetState = async () => {
//       try {
//         const data = await getGoogleConsoleDataByDate(campaignId?.campaignId);
//         setSearchConsoleGraphData(data);
//       } catch (error) {
//         console.error("Error fetching Google Console data by date", error);
//       }
//     };
//     fetchGoogleConsoleDataByDateAndSetState();
//   }, [date]);

//   if (!searchConsoleGraphData && !searchConsoleTableData) {
//     return <div>Loading analytics data...</div>;
//   }
//   console.log(searchConsoleTableData1, "searchConsoleTableData1");
//   console.log(searchConsoleTableData, " searchConsoleTableData");
//   return (
//     <div>
//       {/* <h1 className="text-4xl p-4 text-center">Google Search Console</h1> */}
//       {/* <SearchConsoleHead /> */}
//       <AnalyticsChart
//         analyticData={searchConsoleGraphData}
//         // analyticData={chartData}
//         tableData={searchConsoleTableData}
//         setDimension={setDimension}
//         dimension={dimension}
//       />
//     </div>
//   );
// };

// export default SearchConsoleData;






"use client";
import { useEffect, useState } from "react";
import AnalyticsChart from "../Chart/GoogleChart";
import {
  getGoogleConsoleDataByDate,
  getGoogleSearchDataByDimension,
} from "@/actions/googleConsole";
import SearchConsoleHead from "./SearchConsoleHead";
import { Button } from "../ui/button";
interface SearchConsoleDataProps {
  campaignId: any;
  setPdfTableConsoleData: any;
  handleGeneratePDF: any;
  setPdfChartData: any
  consoleRef: any
}
// import { getTrackingData } from "@/actions/keywordTracking";

const SearchConsoleData = ({consoleRef,campaignId,setPdfTableConsoleData,handleGeneratePDF,setPdfChartData}:SearchConsoleDataProps ) => {
  console.log(campaignId,"campaignId in search console");
  const [searchConsoleGraphData, setSearchConsoleGraphData] = useState<any>();
  const [searchConsoleTableData, setSearchConsoleTableData] = useState<any>();

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
console.log(dataWithDimension,"dataWithDimension in search console");
console.log(date,"date in search console");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const data = await getGoogleSearchDataByDimension(
        campaignId,
          dimension,
          date
        );
        setSearchConsoleTableData(data);
        console.log(data,"okokok")
      } catch (error) {
        console.error("Error fetching analytics data", error);
      }
    };

    const fetchGoogleConsoleDataByDateAndSetState = async () => {
      try {
        const data = await getGoogleConsoleDataByDate(campaignId,date);
        setSearchConsoleGraphData(data);
      } catch (error) {
        console.error("Error fetching Google Console data by date", error);
      }
    };

    fetchAnalyticsData();
    fetchGoogleConsoleDataByDateAndSetState();
  }, []);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const data = await getGoogleSearchDataByDimension(
         campaignId,

          dimension,
          date

        );
        setSearchConsoleTableData(data);
      } catch (error) {
        console.error("Error fetching analytics data", error);
      }
    };
    fetchAnalyticsData();
  }, [dimension,dataWithDimension]);

  useEffect(() => {
    const fetchGoogleConsoleDataByDate = async () => {
      try {
        const data = await getGoogleConsoleDataByDate(campaignId,date);
        setSearchConsoleGraphData(data);
      } catch (error) {
        console.error("Error fetching Google Console data by date", error);
      }
    };
    fetchGoogleConsoleDataByDate();
  }, [date]);


  console.log(searchConsoleGraphData, "searchConsoleGraphData");
  console.log(searchConsoleTableData, " searchConsoleTableData");
  
 const handleLoginGoogle = () => {
   const stateData = {
      campaignId:
        campaignId,
      analyticsData: isAnalyticsData,
      consoleData: isConsolesData,
    };

   const url =`${process.env.NEXT_PUBLIC_GOOGLE_AUTH}`;
   const options = {
     scope: [
       `${ process.env.NEXT_PUBLIC_USER_INFO_PROFILE}`,
        `${process.env.NEXT_PUBLIC_USER_INFO_EMAIL}`,
        `${ process.env.NEXT_PUBLIC_AUTH_ANALYTICS}`,
        `${process.env.NEXT_PUBLIC_AUTH_WEBMASTERS}`,
        `${process.env.NEXT_PUBLIC_AUTH_ANALYTICS_READONLY}`,
        `${process.env.NEXT_PUBLIC_AUTH_BUSINESS_MANAGE}`,

         
      ].join(" "),
      response_type: "code",
      state: encodeURIComponent(JSON.stringify(stateData)),
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/googleLogin`,
      access_type: "offline",
      prompt: "consent",
     client_id:
       `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    };
    
    console.log("enter in functio")
    const qs = new URLSearchParams(options);
    return `${url}?${qs.toString()}`;
  };
  // If no data, show "No Data" window


  if (!searchConsoleGraphData && !searchConsoleTableData) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
         {/* <div className="flex items-center justify-center">
          <img src="/images/google-search-console.png" alt="" className="w-[90%]" />
         </div> */}
        {/* Blurred Overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md">
          <SearchConsoleHead /> </div>

        {/* No Data Content */}
        <div className="absolute z-10 bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Data Available
          </h2>
          <p className="text-gray-500 mb-6">
            You need to connect Google Search Console Please Login.
          </p>
           <a href={handleLoginGoogle()} onClick={() => handleConnectClick("Google Search Console")}>
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
      <SearchConsoleHead/>
      <AnalyticsChart
      consoleRef={consoleRef}
      setPdfChartData={setPdfChartData}
      handleGeneratePDF={handleGeneratePDF}
      setPdfTableConsoleData={setPdfTableConsoleData}
        analyticData={searchConsoleGraphData}
        tableData={searchConsoleTableData}
        setDimension={setDimension}
        dimension={dimension}
        setDataWithDimension={setDataWithDimension}
        setDate={setDate}
      />
    </div>
  );
};

export default SearchConsoleData;

