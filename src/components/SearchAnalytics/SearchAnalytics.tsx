
"use client";
import AnalyticsChart1 from "@/components/SearchAnalytics/AnalyticsChart";
import { use, useEffect, useRef, useState } from "react";
import CustomButton from "../ui/CustomButton";
import { FaInfoCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaClock, FaStopwatch, FaUserPlus, FaUsers } from "react-icons/fa6";
import { getAnalyticsData } from "@/actions/analytics";
import { Button } from "../ui/button";
import DateRangeDialog from "../GoogleConsole/DateTable/DateTableDialog";
// import { useSearchParams } from "react-router-dom";

interface SearchAnalyticsProps {
  campaignId: string;
  campignDataWithId: any;
}

const SearchAnalytics = ({
  campaignId,
  campignDataWithId,
}: SearchAnalyticsProps) => {
  const [chart, setChart] = useState<any>([]);
  const [country, setCountry] = useState<any>([]);
  const [pageTitle, setPageTitle] = useState<any>([]);
  const [keyData, setKeyData] = useState<any>([]);
  const [activeData, setActiveData] = useState<any>({});
  const reportRef = useRef<HTMLDivElement | null>(null); // ✅ Fix TypeScript error
  const [selectedIntegration, setSelectedIntegration] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ loader state
  const [date, setDate] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
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
      setIsLoading(true);
      try {
        //       function extractDomain(url: string): string | null {
        //   const match = url.match(/\/\/(.*?)\./);
        //   return match ? match[1] : null;
        // }

        // const campaignId = CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?._id;
        const access_token = campignDataWithId?.campaign?.googleAccessToken;
        // const CampaignUrl = CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?.projectUrl;
        const propertyId = campignDataWithId?.campaign?.propertyId;
        // const campaignId = campignDataWithId?.campaign?._id;
        // console.log(access_token, "access_token");
        // console.log(propertyId, "propertyId");
        // const { accessToken, campaign } = await getSharedToken(campaignId);

        // const { accessToken } = await getSharedToken(campaignId);

        const analyticData = await getAnalyticsData(
          access_token,
          date,
          propertyId,
          campaignId,
        );
        // console.log(analyticData, "analyticDataFull");
        getUsers(analyticData?.results?.getUserData);
        setChart(analyticData?.results?.getUserData);
        getData1(analyticData?.results?.countryData);
        getData2(analyticData?.results?.pageTitleData);
        getData3(analyticData?.results?.keyData);
        // setDate(analyticData?.date)
      } catch (error) {
        console.log("Error during fetch analytics data:", error);
      } finally {
        setIsLoading(false); // ✅ stop loader
      }
    };

    fetchAnalyticsData();
  }, [campaignId]);

  const setIsAnalyticsDataHandler = (date: any) => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        //       function extractDomain(url: string): string | null {
        //   const match = url.match(/\/\/(.*?)\./);
        //   return match ? match[1] : null;
        // }

        // const campaignId = CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?._id;
        const access_token = campignDataWithId?.campaign?.googleAccessToken;
        // const CampaignUrl = CurrentCampaignData?.CurrentCampaignData?.CurrentCampaignIdData?.projectUrl;
        const propertyId = campignDataWithId?.campaign?.propertyId;
        // console.log(access_token, "access_token");
        // console.log(propertyId, "propertyId");
        const analyticData = await getAnalyticsData(
          access_token,
          date,
          propertyId,
          campaignId
        );
        // console.log(analyticData, "analyticDataFull");
        getUsers(analyticData?.results?.getUserData);
        setChart(analyticData?.results?.getUserData);
        getData1(analyticData?.results?.countryData);
        getData2(analyticData?.results?.pageTitleData);
        getData3(analyticData?.results?.keyData);
        setDate(analyticData?.date);
      } catch (error) {
        console.log("Error during fetch analytics data:", error);
      } finally {
        setIsLoading(false); // ✅ stop loader
      }
    };

    fetchAnalyticsData();
  };
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
      campaignId,

      analyticsData: isAnalyticsData,
      consoleData: isConsolesData,
    };
    // const state = encodeURIComponent(JSON.stringify(stateData));
    const url = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_O}`;
    const redirectURI = `${process.env.NEXT_PUBLIC_REDIRECT_URI}api/googleLogin`;
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
      redirect_uri: redirectURI,
      access_type: "offline",
      prompt: "consent",
      client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    };

    // console.log("enter in functio");
    const qs = new URLSearchParams(options);
    return `${url}?${qs.toString()}`;
  };

  //  const payload = {
  //     startDate: start ? start.format(format) : "",
  //     endDate: safeEnd.format(format),
  //   });

  // const updatePayload = (startDate: string, endDate: string) => {
  //   setPayloadState({ startDate, endDate });
  // };

  // console.table({ chart, country, pageTitle });

  // --- fallback screen if no data ---
  // if (country.length === 0 && pageTitle.length === 0) {
  //   return (
  //     <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
  //       <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col justify-center items-center">
  //         <div className="flex items-center gap-3 mb-6">
  //           <FcGoogle className="text-blue-600 text-4xl" />
  //           <div>
  //             <div className="font-bold text-4xl">
  //               Google Analytics Overview
  //             </div>
  //           </div>
  //           <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
  //         </div>

  //         <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
  //           <h2 className="text-2xl font-semibold text-gray-700 mb-4">
  //             No Data Available
  //           </h2>
  //           <p className="text-gray-500 mb-6">
  //             You need to connect Google Search Analytics. Please login to
  //             continue.
  //           </p>
  //           <a
  //             href={handleLoginGoogle()}
  //             onClick={(event) => handleConnectClick("Google Analytics")}
  //           >
  //             <Button className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white hover:opacity-90 transition">
  //               Proceed
  //             </Button>
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // console.log(activeData, "activeData");
  if (activeData?.totalActiveUsers === 0 && activeData?.totalNewUsers === 0) {
    return (
      <div className="relative w-full h-[70vh] flex flex-col gap-10 items-center justify-center bg-gray-100">
       <div className="flex items-center bg-white py-4 justify-center w-full gap-3">
            <FcGoogle className="text-blue-600 text-4xl" />
            <div>
              <div className="font-bold text-4xl">
                Google Analytics Overview
              </div>
            </div>
            <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
          </div>
        <div className=" bg-white shadow-lg rounded-xl p-8 text-center max-w-md mx-auto">
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
    <>
      <div ref={reportRef} className="p-4 space-y-8">
        {/* Heading */}
        <div className="flex justify-between items-center mt-20 p-4 bg-white shadow rounded-md">
          <div className="flex items-center justify-center w-full gap-3">
            <FcGoogle className="text-blue-600 text-4xl" />
            <div>
              <div className="font-bold text-4xl">
                Google Analytics Overview
              </div>
            </div>
            <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
          </div>
        
        </div>

        {isLoading ? (
          <div className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col justify-center items-center">
              <div className="flex justify-center items-center h-[70vh] bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">
                    Fetching analytics data...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Active User Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full md:w-4/5 mx-auto bg-white rounded-2xl p-6 transition-all duration-300">
              {[
                {
                  title: "Active Users",
                  value: activeData?.totalActiveUsers || 0,
                  icon: (
                    <FaUsers className="text-green-600 text-3xl mx-auto mb-2" />
                  ),
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
                    `${activeData?.overallAverageEngagementTime?.toFixed(2)}s` ||
                    0,
                  icon: (
                    <FaClock className="text-blue-600 text-3xl mx-auto mb-2" />
                  ),
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

            {/* Country & Page Title Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Table */}
              <div className="overflow-x-auto overflow-y-auto max-h-[400px] border rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-2 text-gray-600">
                  Country-wise Users
                </h2>
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-500 text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-2 text-left border-b border-gray-300">
                        Country
                      </th>
                      <th className="p-2 text-left border-b border-gray-300">
                        Users
                      </th>
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
              <div className="overflow-auto rounded-lg shadow-lg border border-gray-200 max-h-[400px]">
                <table className="min-w-[600px] w-full table-auto border-collapse">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-gray-600 shadow-md">
                      <th className="p-3 text-left text-sm font-medium uppercase tracking-wide text-white">
                        Title
                      </th>
                      <th className="p-3 text-left text-sm font-medium uppercase tracking-wide text-white">
                        Users
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {pageTitle.length > 0 ? (
                      pageTitle.map((item: any, index: number) => (
                        <tr
                          key={index}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-blue-50 transition`}
                        >
                          <td className="p-3 text-gray-800 text-sm">
                            {item?.pageTitle || "-"}
                          </td>
                          <td className="p-3 text-gray-800 text-sm">
                            {item?.userCount || "0"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="p-4 text-center text-gray-500"
                        >
                          No page title data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                    <th className="p-3 border-b border-gray-300 text-left">
                      Type
                    </th>
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

              {/* <CustomButton onClick={handlePdf} buttonName=" Download PDF" /> */}
              {/* </button> */}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SearchAnalytics;
