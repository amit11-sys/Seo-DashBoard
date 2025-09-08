"use client";
import AnalyticsChart1 from "@/components/SearchAnalytics/AnalyticsChart";
import { use, useEffect, useRef, useState } from "react";
import CustomButton from "../ui/CustomButton";
import { FaInfoCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaClock, FaStopwatch, FaUserPlus, FaUsers } from "react-icons/fa6";
import { getAnalyticsData } from "@/actions/analytics";
import { Button } from "../ui/button";
// import { useSearchParams } from "react-router-dom";

const SearchAnalytics = (CurrentCampaignData: any) => {
  const [chart, setChart] = useState<any>([]);
  const [country, setCountry] = useState<any>([]);
  const [pageTitle, setPageTitle] = useState<any>([]);
  const [keyData, setKeyData] = useState<any>([]);
  const [activeData, setActiveData] = useState<any>({});
  const reportRef = useRef<HTMLDivElement | null>(null); // ✅ Fix TypeScript error
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
  // console.log(activeData, "activeDataok");
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        //       function extractDomain(url: string): string | null {
        //   const match = url.match(/\/\/(.*?)\./);
        //   return match ? match[1] : null;
        // }

        // const campaignId = CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?._id;
        const access_token =
          CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData
            ?.googleAccessToken;
        // const CampaignUrl = CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?.projectUrl;
        const propertyId =
          CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData
            ?.propertyId;
        const analyticData = await getAnalyticsData(access_token, propertyId);
        // console.log(analyticData, "analyticDataFull");
        getUsers(analyticData?.getUserData);
        setChart(analyticData?.getUserData);
        getData1(analyticData?.countryData);
        getData2(analyticData?.pageTitleData);
        getData3(analyticData?.keyData);
      } catch (error) {
        console.log("Error during fetch analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, []);
  const handlePdf = async () => {
    if (!reportRef.current) {
      console.error("Report reference is null");
      return;
    }

    const htmlContent = reportRef.current.innerHTML;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/pdf/generate-pdf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SEO_Report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error("Failed to generate PDF");
    }
  };
  //   let [searchParams] = useSearchParams();

  //   const accessToken = searchParams.get("access_token");
  //   const idToken = searchParams.get("id_token");

  // const fetchAnalytics = async (access_token: string) => {
  //   try {
  //     const response = await fetch(
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${access_token}`, // Send the access token in the Authorization header
  //         },
  //         credentials: "include", // Optional: If you need to include cookies/session data
  //       }
  //     );
  //     const data = await response.json()
  //     console.log(data);

  //   } catch (error) {
  //     console.error("Error fetching analytics data", error);
  //   }
  // };
  //   useEffect(() => {
  //     if (accessToken && idToken) {
  //       // If tokens are present, fetch analytics data
  //       fetchAnalyticsData(accessToken);
  //       fetchAnalyticsData2(accessToken)
  //       fetchAnalyticsData3(accessToken)
  //       fetchAnalyticsData4(accessToken)
  //       // fetchAnalytics(accessToken)
  //     } else {
  //       console.log("No tokens found in URL");
  //     }
  //   }, [accessToken, idToken]);

  // const getUsers = (data: any) => {
  //   console.log(data,"dataInUser");

  //   let totalActiveUsers = 0;
  //   let totalNewUsers = 0;
  //   let totalEngagementTime = 0;
  //   let totalSessions = 0;

  //   data?.rows?.forEach((row: any) => {
  //     console.log(row,"inRow");

  //     // const channel = row.dimensionValues[0].value;
  //     const activeUsers = parseInt(row.metricValues[0].value); // Active users
  //     const newUsers = parseInt(row.metricValues[1].value); // New users
  //     // const averageEngagementTime = parseFloat(row.metricValues[2].value);
  //     const engagementTime = parseFloat(row.metricValues[3].value); // Total engagement time (in seconds)

  //     // Accumulate overall metrics
  //     totalActiveUsers += activeUsers;
  //     totalNewUsers += newUsers;
  //     totalEngagementTime += engagementTime;
  //     totalSessions += activeUsers; // Assuming activeUsers represents sessions

  //     // console.log(
  //     //   `Channel: ${channel}, Active Users: ${activeUsers}, New Users: ${newUsers}, Average Engagement Time: ${averageEngagementTime}s, Engagement Time: ${engagementTime}s`
  //     // );
  //   });

  //   // Calculate overall average engagement time
  //   const overallAverageEngagementTime = totalEngagementTime / totalSessions;

  //   // Display overall metrics
  //   // console.log('\nOverall Metrics:');
  //   // console.log(`Total Active Users: ${totalActiveUsers}`);
  //   // console.log(`Total New Users: ${totalNewUsers}`);
  //   // console.log(`Overall Average Engagement Time: ${overallAverageEngagementTime.toFixed(2)}s`);
  //   // console.log(`Total Engagement Time: ${totalEngagementTime}s`);
  //   setActiveData({
  //     totalActiveUsers,
  //     totalNewUsers,
  //     overallAverageEngagementTime,
  //     totalEngagementTime,
  //   });
  // };

  const getUsers = (data: any) => {
    // console.log(data, "dataInUser");

    let totalActiveUsers = 0;
    let totalNewUsers = 0;
    let totalEngagementTime = 0;
    let totalSessions = 0;

    data?.rows?.forEach((row: any) => {
      // console.log(row, "inRow");
      const metricValues = row.metricValues || [];

      const activeUsers = parseInt(metricValues[0]?.value || "0", 10); // activeUsers
      const newUsers = parseInt(metricValues[1]?.value || "0", 10); // newUsers
      const engagementTime = parseFloat(metricValues[3]?.value || "0"); // engagementTime in seconds

      totalActiveUsers += activeUsers;
      totalNewUsers += newUsers;
      totalEngagementTime += engagementTime;
      totalSessions += activeUsers; // You may change this if sessions are a separate metric
    });

    const overallAverageEngagementTime =
      totalSessions > 0 ? totalEngagementTime / totalSessions : 0;

    setActiveData({
      totalActiveUsers,
      totalNewUsers,
      overallAverageEngagementTime: parseFloat(
        overallAverageEngagementTime.toFixed(2)
      ),
      totalEngagementTime,
    });
  };

  // console.log(activeData, "activeDataggg");

  const getData1 = (data: any) => {
    // console.log(data, "dataInCountry");
    let activePageCount, countryCount, countryName;
    const countriesData: { countryName: string; countryCount: string }[] = [];
    // const searchTitle:{activePageCount:string, activePageHeading:string}[]=[];
    data?.rows?.forEach((row: any) => {
      // console.log(row);

      // const channel = row.dimensionValues[0].value;
      activePageCount = row.metricValues[0]?.value; // Active users
      countryCount = row.metricValues[0]?.value; // New users
      // const averageEngagementTime = parseFloat(row.metricValues[2].value);
      countryName = row.dimensionValues[0]?.value;
      // countryName = row.dimensionValues[2]?.value; // Total engagement time (in seconds)
      if (countryName && countryCount) {
        countriesData.push({ countryName, countryCount });
      }
      // if(activePageHeading && activePageCount){
      //   searchTitle.push({activePageHeading, activePageCount})
      // }
    });
    setCountry(countriesData);
    // setPageTitle(searchTitle)
    // console.log(activePageCount, countryCount, activePageHeading, countryName, 'data');
  };

  const getData2 = (data: any) => {
    // console.log(data);
    let pageTitle, userCount;
    // const countriesData: { countryName: string; countryCount: string }[] = [];
    const searchTitle: { pageTitle: string; userCount: string }[] = [];
    data?.rows?.forEach((row: any) => {
      // console.log(row);

      // const channel = row.dimensionValues[0].value;
      userCount = row.metricValues[0]?.value; // Active users
      pageTitle = row.dimensionValues[0]?.value;
      // countryName = row.dimensionValues[2]?.value; // Total engagement time (in seconds)
      if (userCount && pageTitle) {
        searchTitle.push({ userCount, pageTitle });
      }
      // if(activePageHeading && activePageCount){
      //   searchTitle.push({activePageHeading, activePageCount})
      // }
    });
    setPageTitle(searchTitle);
    // setPageTitle(searchTitle)
    // console.log(activePageCount, countryCount, activePageHeading, countryName, 'data');
  };
  // console.log(country, );
  // console.log(pageTitle, 'ans');

  const getData3 = (data: any) => {
    // data?.analyticData?.rows?.forEach((row: any) => {
    //   console.log(row);
    setKeyData(data?.rows);

    // });
  };

  const handleLoginGoogle = () => {
    const stateData = {
      campaignId:
        CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?._id,
      analyticsData: isAnalyticsData,
      consoleData: isConsolesData,
    };
    const state = encodeURIComponent(JSON.stringify(stateData));
        const url = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_O}`;

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

    // console.log("enter in functio");
    const qs = new URLSearchParams(options);
    return `${url}?${qs.toString()}`;
  };

 
  console.table({chart, country, pageTitle});

  if (country.length === 0 && pageTitle.length === 0) {
    return (
      <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
        {/* <div className="flex items-center justify-center">
            <img src="/images/google-search-console.png" alt="" className="w-[90%]" />
           </div> */}
        {/* Blurred Overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md">
          <div className="flex justify-center flex-col items-center  mt-20 p-4 bg-white shadow rounded-md">
            <div className="flex items-center justify-center w-full gap-3">
              <FcGoogle className="text-blue-600 text-4xl" />
              <div>
                <div className="font-bold text-4xl">
                  Google Analytics Overview
                </div>
                {/* <div className="text-gray-500 text-sm">
              Last Updated: 2 hours ago (Jun 30, 2025)
            </div> */}
              </div>
              <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* No Data Content */}
        <div className="absolute z-10 bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No Data Available
          </h2>
          <p className="text-gray-500 mb-6">
            You need to connect Google Search Analytics Please Login.
          </p>
        <a href={handleLoginGoogle()} onClick={(event) => handleConnectClick("Google Analytics")}>
  <Button className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white hover:opacity-90 transition">
    Proceed
  </Button>
</a>
        </div>
      </div>
    );
  }



  return (
    // <div ref={reportRef}>
    //   <h1 className="text-4xl my-4 text-center">Google Analytics</h1>
    //   <div className="grid grid-cols-4 w-3/4 mx-auto shadow shadow-gray-200 py-4 px-2 rounded-lg ">
    //     <div className="">
    //       <h2>Active Users</h2> <h3>{activeData?.totalActiveUsers}</h3>
    //     </div>
    //     <div className="">
    //       <h2>New Users</h2> <h3>{activeData?.totalNewUsers}</h3>
    //     </div>
    //     <div className="">
    //       <h2>Average Engagement Time</h2> <h3>{activeData?.overallAverageEngagementTime?.toFixed(2)}'s</h3>
    //     </div>
    //     <div className="">
    //       <h2>Total Engagement Time</h2> <h3>{activeData?.totalEngagementTime?.toFixed(2)}'s</h3>
    //     </div>
    //   </div>
    //   <h1 className="font-semibold my-6 text-2xl uppercase text-center">Traffic Sources</h1>
    //   <AnalyticsChart1
    //     analyticData={chart}
    //   />
    //   <div className="grid grid-cols-2">
    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Country</th>
    //           {/* </tr>
    //     <tr> */}
    //           <th>Users</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {country.map((item: any, index: number) => {
    //           // console.log(item);

    //           return (
    //             <div key={index}>
    //               <tr>
    //                 <td>{item?.countryName}</td>
    //                 <td>{item?.countryCount}</td>
    //               </tr>

    //             </div>)
    //         })}
    //         {/* <tr>
    //         <td></td>
    //         <td></td>
    //       </tr> */}
    //       </tbody>
    //     </table>

    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Title</th>
    //           {/* </tr>
    //     <tr> */}
    //           <th>Users</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {pageTitle.map((item: any, index: number) => {
    //           // console.log(item);

    //           return (
    //             <div key={index}>
    //               <tr>
    //                 <td>{item?.pageTitle}</td>
    //                 <td>{item?.userCount}</td>
    //               </tr>

    //             </div>)
    //         })}
    //         {/* <tr>
    //         <td></td>
    //         <td></td>
    //       </tr> */}
    //       </tbody>
    //     </table>
    //   </div>

    //   <table className="min-w-full bg-white border border-gray-300 table-fixed">
    //     <thead>
    //       <tr className="bg-blue-400 border-b text-white">
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           #
    //         </th>
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Users
    //         </th>
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Sessions
    //         </th>
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Engaged Session
    //         </th>
    //         {/* <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           DOS <br />Collection <br />Date
    //         </th> */}
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Avg. Engagement Time per session
    //         </th>
    //         {/* <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Engaged Session Per Year
    //         </th> */}
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Events per session
    //         </th>
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Engagement Rate
    //         </th>
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Event Count
    //         </th>
    //         {/* <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Key Count
    //         </th> */}
    //         <th style={{ whiteSpace: "nowrap" }} className="p-2 border-r sticky top-0 bg-blue-400 z-0">
    //           Total Revenue
    //         </th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {/* <tr key={"unique-data"} className="border-b bg-blue-100">
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">

    //         </td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">

    //         </td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //         <td
    //           style={{ whiteSpace: "nowrap" }}
    //           className="p-2 border-r"
    //         ></td>
    //       </tr> */}
    //       {/* {((searchTerm || dob || searchCase || searchIns || searchProv || policy) !== "" ? filterIntelli : patients)?.slice(0, visibleRecords)?.map((row, index) => ( */}
    //       {keyData?.map((row: any, index: number) => {
    //         console.log(row);

    //         return (
    //           <tr
    //             key={index + 1}

    //           >
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.dimensionValues[0]?.value}
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.metricValues[0]?.value}
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.metricValues[1]?.value}
    //             </td>
    //             <td
    //               style={{ whiteSpace: "nowrap" }}
    //               className="p-2 border-r"
    //             >
    //               {row?.metricValues[2]?.value}

    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.metricValues[3]?.value}
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.metricValues[4]?.value}
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.metricValues[5]?.value}
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //               {row?.metricValues[6]?.value}
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r ">
    //               {row?.metricValues[7]?.value}
    //             </td>
    //             {/* <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">
    //             </td>
    //             <td style={{ whiteSpace: "nowrap" }} className="p-2 border-r">

    //             </td> */}

    //           </tr>
    //         )
    //       })}

    //     </tbody>
    //   </table>
    //   <button onClick={handlePdf} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
    //     Download PDF
    //   </button>
    // </div>

    <div ref={reportRef} className="p-4 space-y-8">
      {/* Heading */}

      <div className="flex justify-center flex-col items-center  mt-20 p-4 bg-white shadow rounded-md">
        <div className="flex items-center justify-center w-full gap-3">
          <FcGoogle className="text-blue-600 text-4xl" />
          <div>
            <div className="font-bold text-4xl">Google Analytics Overview</div>
            {/* <div className="text-gray-500 text-sm">
              Last Updated: 2 hours ago (Jun 30, 2025)
            </div> */}
          </div>
          <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
        </div>
      </div>

      {/* Active User Metrics */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full md:w-4/5 mx-auto bg-white  rounded-2xl p-6 transition-all duration-300">
        {[
          {
            title: "Active Users",
            value: activeData?.totalActiveUsers || 0,
            icon: <FaUsers className="text-green-600 text-3xl mx-auto mb-2" />,
          },
          {
            title: "New Users",
            value: activeData?.totalNewUsers || 0,
            icon: (
              <FaUserPlus className="text-yellow-500 text-3xl mx-auto mb-2" />
            ),
          },
          {
            title: "Avg. Engagement Time",
            value:
              `${activeData?.overallAverageEngagementTime?.toFixed(2)}s` || 0,
            icon: <FaClock className="text-blue-600 text-3xl mx-auto mb-2" />,
          },
          {
            title: "Total Engagement Time",
            value: `${activeData?.totalEngagementTime?.toFixed(2)}s` || 0,
            icon: (
              <FaStopwatch className="text-purple-600 text-3xl mx-auto mb-2" />
            ),
          },
        ].map((item, index) => (
          <div
            key={index}
            className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-5 min-h-48 rounded-2xl hover:shadow-lg transition-all duration-300 border border-blue-100"
          >
            {item.icon}
            <h2 className="text-sm font-medium text-gray-500 mb-1 tracking-wide">
              {item.title}
            </h2>
            <h3 className="text-3xl mt-7 md:text-4xl font-bold text-blue-800">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Traffic Sources */}
      <h1 className="font-semibold text-2xl uppercase text-center text-gray-700">
        Traffic Sources
      </h1>
      <div className="w-full md:w-3/4 mx-auto">
        <AnalyticsChart1 analyticData={chart} />
      </div>

      {/* Country & Page Title Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Table */}
        <div className="overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2 text-gray-600">
            Country-wise Users
          </h2>
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="p-2 text-left">Country</th>
                <th className="p-2 text-left">Users</th>
              </tr>
            </thead>
            <tbody>
              {country.map((item: any, index: number) => (
                <tr key={index} className="border-b hover:bg-blue-50">
                  <td className="p-2">{item?.countryName}</td>
                  <td className="p-2">{item?.countryCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Page Title Table */}
        <div className="">
          <h2 className="text-lg font-semibold mb-2 text-gray-600">
            Page Title Users
          </h2>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-500 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Users</th>
                </tr>
              </thead>
            </table>
            <div
              className="max-h-[300px] overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              <table className="min-w-full table-fixed">
                <tbody>
                  {pageTitle.map((item: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-blue-50">
                      <td className="p-2">{item?.pageTitle}</td>
                      <td className="p-2">{item?.userCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Key Data Table */}

      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Detailed Analytics
        </h2>
        <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-500 text-black">
            <tr>
              <th className="p-3 border-b border-gray-300 text-left">Type</th>
              <th className="p-3 border-b border-gray-300 mr-auto text-left">
                Users
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Sessions
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Engaged Sessions
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Avg. Engagement Time
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Events per Session
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Engagement Rate
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Event Count
              </th>
              <th className="p-3 border-b border-gray-300 text-left">
                Total Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {keyData?.map((row: any, index: number) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50 transition duration-200"
              >
                <td className="p-3 border-b border-gray-300">
                  {row?.dimensionValues[0]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[0]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[1]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[2]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[3]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[4]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[5]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[6]?.value}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {row?.metricValues[7]?.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download Button */}
      <div className="flex justify-center items-center">
        {/* <button
      
      className="mt-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform"
    > */}

        <CustomButton onClick={handlePdf} buttonName=" Download PDF" />
        {/* </button> */}
      </div>
    </div>
  );
};

export default SearchAnalytics;
