"use client"
import React, { useState } from 'react'
import LiveKeyword from './LiveKeyword'
import Header from '../Common/Header';
import KeywordtrackingGmb from './KeywordtrackingGmb';

const LiveKeywordComponent = ({campaignLiveKeywordsData,campaignId,campaignStatus}:any) => {

     const [openOptions, setOpenOptions] = useState("seo");
  return (
    <>
     
     <Header setOpenOptions={setOpenOptions} openOptions={openOptions} campaignStatus={campaignStatus} topRankData={campaignLiveKeywordsData.topRankData}  campaignId={campaignId} />
     {openOptions === "gmb" &&
     <KeywordtrackingGmb/>
     
     }
     {openOptions === "seo" && 
     
     <LiveKeyword
            // getrankingData={getrankingData}
            campaignLiveKeywordsData={campaignLiveKeywordsData}
            campaignId={campaignId}
          />
     }



    </>
  )
}

export default LiveKeywordComponent