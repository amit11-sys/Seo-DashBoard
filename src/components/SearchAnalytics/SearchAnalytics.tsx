
import AnalyticsChart1 from "@/components/SearchAnalytics/AnalyticsChart";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../ui/CustomButton";
import { FaInfoCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaClock, FaStopwatch, FaUserPlus, FaUsers } from "react-icons/fa6";
// import { useSearchParams } from "react-router-dom";


const SearchAnalytics = () => {
  const reportRef = useRef<HTMLDivElement | null>(null); // ✅ Fix TypeScript error

  const handlePdf = async () => {
    if (!reportRef.current) {
      console.error("Report reference is null");
      return;
    }

    const htmlContent = reportRef.current.innerHTML;

    const response = await fetch("http://localhost:8000/api/v1/pdf/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ htmlContent }),
    });

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
  const [chart, setChart] = useState<any>([])
  const [activeData, setActiveData] = useState<any>({})
  const [country, setCountry] = useState<any>([])
  const [pageTitle, setPageTitle] = useState<any>([])
  const [keyData, setKeyData] = useState<any>([])
//   const accessToken = searchParams.get("access_token");
//   const idToken = searchParams.get("id_token");
  const fetchAnalyticsData = async (access_token: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/google/search-analytics/searchAnalyticsData",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`, // Send the access token in the Authorization header
          },
          credentials: "include", // Optional: If you need to include cookies/session data
        }
      );
      const data = await response.json()
      getUsers(data)
      setChart(data)

    } catch (error) {
      console.error("Error fetching analytics data", error);
    }
  };

  const fetchAnalyticsData2 = async (access_token: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/google/search-analytics/search",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`, // Send the access token in the Authorization header
          },
          credentials: "include", // Optional: If you need to include cookies/session data
        }
      );
      const data = await response.json()
      // return data
      // getUsers(data)
      // setChart(data)
      getData1(data)

    } catch (error) {
      console.error("Error fetching analytics data", error);
    }
  };

  const fetchAnalyticsData3 = async (access_token: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/google/search-analytics/searchKrle",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`, // Send the access token in the Authorization header
          },
          credentials: "include", // Optional: If you need to include cookies/session data
        }
      );
      const data = await response.json()
      // return data
      // getUsers(data)
      // setChart(data)
      getData2(data)

    } catch (error) {
      console.error("Error fetching analytics data", error);
    }
  };


  const fetchAnalyticsData4 = async (access_token: string) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/google/search-analytics/searchKrleYr",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`, // Send the access token in the Authorization header
          },
          credentials: "include", // Optional: If you need to include cookies/session data
        }
      );
      const data = await response.json()
      // return data
      // getUsers(data)
      // setChart(data)
      getData3(data)

    } catch (error) {
      console.error("Error fetching analytics data", error);
    }
  };

  // const fetchAnalytics = async (access_token: string) => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8000/api/v1/google/search-analytics/searchAnalytics",
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

  const getUsers = (data: any) => {
    // console.log(data);

    let totalActiveUsers = 0;
    let totalNewUsers = 0;
    let totalEngagementTime = 0;
    let totalSessions = 0;
    data?.analyticData?.rows?.forEach((row: any) => {
      // console.log(row);

      // const channel = row.dimensionValues[0].value;
      const activeUsers = parseInt(row.metricValues[0].value); // Active users
      const newUsers = parseInt(row.metricValues[1].value); // New users
      // const averageEngagementTime = parseFloat(row.metricValues[2].value);
      const engagementTime = parseFloat(row.metricValues[3].value); // Total engagement time (in seconds)

      // Accumulate overall metrics
      totalActiveUsers += activeUsers;
      totalNewUsers += newUsers;
      totalEngagementTime += engagementTime;
      totalSessions += activeUsers; // Assuming activeUsers represents sessions

      // console.log(
      //   `Channel: ${channel}, Active Users: ${activeUsers}, New Users: ${newUsers}, Average Engagement Time: ${averageEngagementTime}s, Engagement Time: ${engagementTime}s`
      // );
    });

    // Calculate overall average engagement time
    const overallAverageEngagementTime = totalEngagementTime / totalSessions;

    // Display overall metrics
    // console.log('\nOverall Metrics:');
    // console.log(`Total Active Users: ${totalActiveUsers}`);
    // console.log(`Total New Users: ${totalNewUsers}`);
    // console.log(`Overall Average Engagement Time: ${overallAverageEngagementTime.toFixed(2)}s`);
    // console.log(`Total Engagement Time: ${totalEngagementTime}s`);
    setActiveData({ totalActiveUsers, totalNewUsers, overallAverageEngagementTime, totalEngagementTime })
  }
  // console.log(activeData);


  const getData1 = (data: any) => {
    // console.log(data);
    let activePageCount, countryCount,countryName
    const countriesData: { countryName: string; countryCount: string }[] = [];
    // const searchTitle:{activePageCount:string, activePageHeading:string}[]=[];
    data?.analyticData?.rows?.forEach((row: any) => {
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
    setCountry(countriesData)
    // setPageTitle(searchTitle)
    // console.log(activePageCount, countryCount, activePageHeading, countryName, 'data');
  }


  const getData2 = (data: any) => {
    // console.log(data);
    let pageTitle, userCount;
    // const countriesData: { countryName: string; countryCount: string }[] = [];
    const searchTitle: { pageTitle: string, userCount: string }[] = [];
    data?.analyticData?.rows?.forEach((row: any) => {
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
    setPageTitle(searchTitle)
    // setPageTitle(searchTitle)
    // console.log(activePageCount, countryCount, activePageHeading, countryName, 'data');
  }
  // console.log(country, );
  // console.log(pageTitle, 'ans');


  const getData3 = (data: any) => {

    // data?.analyticData?.rows?.forEach((row: any) => {
    //   console.log(row);
    setKeyData(data?.analyticData?.rows)

    // });

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
          <div className="text-gray-500 text-sm">
            Last Updated: 2 hours ago (Jun 30, 2025)
          </div>
        </div>
        <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
      </div>
      

      
     
    </div>

{/* Active User Metrics */}

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full md:w-4/5 mx-auto bg-white  rounded-2xl p-6 transition-all duration-300">

  {[
    {
      title: "Active Users",
      value: activeData?.totalActiveUsers || 45,
      icon: <FaUsers className="text-green-600 text-3xl mx-auto mb-2" />,
    },
    {
      title: "New Users",
      value: activeData?.totalNewUsers || 456 ,
      icon: <FaUserPlus className="text-yellow-500 text-3xl mx-auto mb-2" />,
    },
    {
      title: "Avg. Engagement Time",
      value:
      //  `${activeData?.overallAverageEngagementTime?.toFixed(2)}s` || 
       6786,
      icon: <FaClock className="text-blue-600 text-3xl mx-auto mb-2" />,
    },
    {
      title: "Total Engagement Time",
      value:
      //  `${activeData?.totalEngagementTime?.toFixed(2)}s`
       45,
      icon: <FaStopwatch className="text-purple-600 text-3xl mx-auto mb-2" />,
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
  <h1 className="font-semibold text-2xl uppercase text-center text-gray-700">Traffic Sources</h1>
  <div className="w-full md:w-3/4 mx-auto">
    <AnalyticsChart1 analyticData={chart} />
  </div>

  {/* Country & Page Title Tables */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Country Table */}
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-600">Country-wise Users</h2>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-blue-500 text-white">
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
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-600">Page Title Users</h2>
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Users</th>
          </tr>
        </thead>
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

  {/* Detailed Key Data Table */}
  <div className="overflow-x-auto">
    <h2 className="text-lg font-semibold mb-2 text-gray-600">Detailed Analytics</h2>
    <table className="min-w-full bg-white border border-gray-300 table-fixed shadow rounded-lg">
      <thead className="bg-blue-500 text-white sticky top-0">
        <tr>
          <th className="p-2 border-r">#</th>
          <th className="p-2 border-r">Users</th>
          <th className="p-2 border-r">Sessions</th>
          <th className="p-2 border-r">Engaged Sessions</th>
          <th className="p-2 border-r">Avg. Engagement Time</th>
          <th className="p-2 border-r">Events per Session</th>
          <th className="p-2 border-r">Engagement Rate</th>
          <th className="p-2 border-r">Event Count</th>
          <th className="p-2">Total Revenue</th>
        </tr>
      </thead>
      <tbody>
        {keyData?.map((row: any, index: number) => (
          <tr key={index} className="border-b hover:bg-blue-50 text-center">
            <td className="p-2 border-r">{row?.dimensionValues[0]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[0]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[1]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[2]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[3]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[4]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[5]?.value}</td>
            <td className="p-2 border-r">{row?.metricValues[6]?.value}</td>
            <td className="p-2">{row?.metricValues[7]?.value}</td>
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
     
      <CustomButton onClick={handlePdf} buttonName=" Download PDF"/>
    {/* </button> */}
  </div>
</div>

  )
}

export default SearchAnalytics
