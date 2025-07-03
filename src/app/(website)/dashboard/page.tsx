"use client";
import React, { useEffect } from "react";

import LiveKeywordComponent from "@/components/KeywordTracking/LiveKeywordComponent";
import SearchConsoleData from "@/components/GoogleConsole/SearchConsole";
import SearchAnalytics from "@/components/SearchAnalytics/SearchAnalytics";
import { getUserKeywordData } from "@/actions/liveKeywords/queries";

const page = () => {

 
  
  return (
    <>
      <section className=" liveKeywordTracking p-3">
        <SearchConsoleData />
        <SearchAnalytics />
        <LiveKeywordComponent />
      </section>
    </>
  );
};

export default page;
