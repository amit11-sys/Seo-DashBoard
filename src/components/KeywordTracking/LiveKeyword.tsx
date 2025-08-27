"use client"
import React, { useState } from 'react'
import Header from '../Common/Header';
// import KeywordtrackingGmb from './KeywordtrackingGmb';
import LiveKeywordComponent from './LiveKeywordComponent';
import KeywordtrackingGmb from '../KeywordsGmb/KeywordtrackingGmb';


const LiveKeyword = ({campaignLiveKeywordsData,campaignId,campaignStatus}:any) => {

     const [openOptions, setOpenOptions] = useState("seo");
  return (
    <>
     
     <Header setOpenOptions={setOpenOptions} openOptions={openOptions} campaignStatus={campaignStatus} topRankData={campaignLiveKeywordsData.topRankData}  campaignId={campaignId} />
     {openOptions === "gmb" &&
     <KeywordtrackingGmb/>
     
     }
     {openOptions === "seo" && 
     
     <LiveKeywordComponent
            // getrankingData={getrankingData}
            campaignLiveKeywordsData={campaignLiveKeywordsData}
            campaignId={campaignId}
          />
     }



    </>
  )
}

export default LiveKeyword