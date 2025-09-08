"use client";

import React, { useEffect, useRef, useState } from "react";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import { start } from "repl";
import { useLoader } from "@/hooks/useLoader";
import SearchAnalytics from "./SearchAnalytics/SearchAnalytics";
import { getCurrentCampaignIdData } from "@/actions/campaign";

import { getfetchLocationId } from "@/actions/KeywordsGmb";
import { fetchLocations } from "@/actions/KeywordsGmb/queries";

export default function ClientDashboard({
  campaignLiveKeywordsData,
  campaignId,
  CurrentCampaignData
}: any) {
  const consoleRef = useRef<HTMLDivElement>(null);
  const { startLoading, stopLoading } = useLoader();
  const [pdfTableDatakeywords, setPdfTableDatakeywords] = useState();
  const [pdfTableConsoleData, setPdfTableConsoleData] = useState();
  const [pdfChartData, setPdfChartData] = useState();
  console.log(CurrentCampaignData, "CurrentCampaignData");
    // useEffect(() => {
    //       const fetchLocationId = async () => {
    //            const location = await fetchLocations(CurrentCampaignData?.access_token);
              
           
    //         console.log(location,"locationId");
    //       }


    //       fetchLocationId();
      
    // },[])
  const handleGeneratePDF = async () => {
    // if (!consoleRef.current) return;

    
    const htmlContent = `

   ${ consoleRef.current?.innerHTML }
  <div className="flex justify-center flex-col items-center p-4 bg-white shadow rounded-md">
    <div className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-4">
        <FaGoogle className="text-blue-600 text-4xl" />
        <div>
          <div className="font-bold text-4xl">Search Console</div>
          <div className="text-gray-500 text-sm">
            Last Updated: 2 hours ago (Jun 30, 2025)
          </div>
        </div>
        <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
      </div>
      <div>
        <button
          className="text-white font-semibold py-2 px-4 rounded"
          title="Whole Report"
        >
          <FaFileExcel className="text-green-600 text-3xl" />
        </button>
      </div>
    </div>

    ${pdfTableConsoleData}
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>

    <div className="flex flex-col md:flex-row items-center justify-between text-black rounded-xl gap-4 mt-4">
      <div className="flex items-center gap-4">
        <div className="text-3xl text-orange-500"></div>
        <div>
          <h2 className="text-xl font-bold text-black">
            Live Keyword Tracking
          </h2>
          <p className="text-sm text-black">
            Last Updated: 1 hour ago (Jun 19, 2025)
          </p>
        </div>
      </div>
    </div>

    ${pdfTableDatakeywords}
  </div>
`;

    startLoading();
    const res = await fetch("/api/GeneratePdf", {
      method: "POST",
      body: JSON.stringify({ html: htmlContent }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const blob = await res.blob();
    stopLoading();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard.pdf";
    link.click();
  };
  console.log(campaignId,"campaignId in client dashboard");
  return (
    <>
      <div className="flex justify-end mt-5 p-4">
        <button
          onClick={handleGeneratePDF}
          className="bg-orange-600 text-white px-4 py-2  hover:bg-orange-700 rounded-full p-10"
        >
          Download PDF
        </button>
      </div>

      <SearchConsoleData
      consoleRef={consoleRef}
      setPdfChartData={setPdfChartData}
        handleGeneratePDF={handleGeneratePDF}
        campaignId={campaignId}
        setPdfTableConsoleData={setPdfTableConsoleData}
      />
      <SearchAnalytics CurrentCampaignData={CurrentCampaignData}/>

      <LiveKeywordComponent
        campaignLiveKeywordsData={campaignLiveKeywordsData}
        campaignId={campaignId}
        setPdfTableDatakeywords={setPdfTableDatakeywords}
        handleGeneratePDF={handleGeneratePDF}
      />
    </>
  );
}
