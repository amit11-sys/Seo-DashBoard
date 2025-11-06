"use client"
import React, { useState } from 'react'
import Navbar from '../Common/Navbar'
import SidebarWrapper from '../Common/SidebarWrapper'
import Header from '../Common/Header'
import LiveKeywordComponent from './LiveKeywordComponent'
import SearchConsoleData from '../GoogleConsole/SearchConsole'
import SearchAnalytics from '../SearchAnalytics/SearchAnalytics'
import Footer from '../Common/Footer'
import ManagementSystem from './PMS/ManagementSystem'

const KeywordComponent = ({ campaignId, campaignStatus, campaignLiveKeywordsData, ActiveUserData,campignDataWithId }: any) => {


const [activeTab, setactiveTab] = useState("SEO");

const handleTabChange = (tab: string) => {
    setactiveTab(tab);
};


  return (
    <>

    <section className="relative h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar ActiveUserData={ActiveUserData?.user as any} campaignId={campaignId as string} />
      </div>

      <div
        id="main-scroll-container"
        className="flex flex-1 pt-[80px] overflow-hidden"
      >
        <aside className="w-[250px]   h-full fixed left-0 top-[20px] z-40">
          <SidebarWrapper
            campaignId={campaignId as string}
            // archivedCampaignData={
            //   archivedCampaignData?.KeywordTrackingDataArchied ?? []
            // }
          />
        </aside>

        <main className="ml-[250px] relative flex-1 overflow-y-auto p-10 bg-gray-100">
                 <Header
            campaignStatus={campaignStatus}
            topRankData={campaignLiveKeywordsData.topRankData}
            campaignId={campaignId}
            ActiveUserData={ActiveUserData?.user as any}
            handleTabChange={handleTabChange}
            activeTab={activeTab}

          />
           
            <div>

                {activeTab === "SEO" && ( <div>

          <LiveKeywordComponent
          ActiveUserData={ActiveUserData?.user as any}
            campaignStatus={campaignStatus}
            campaignId={campaignId}
          />
          <SearchConsoleData ActiveUserData={ActiveUserData?.user as any} campaignId={campaignId} />
          <SearchAnalytics
          ActiveUserData={ActiveUserData?.user as any}
            campignDataWithId={campignDataWithId}
            campaignId={campaignId}
          />
                </div>)}
                {activeTab === "PMS" && ( <>
                <ManagementSystem campaignId={campaignId} campignDataWithId={campignDataWithId}  />
            </>)}
               
             

            </div>
        
          
          <Footer mainContainerId="main-scroll-container" />
        </main>
      </div>
    </section>
    
    
    
    </>
  )
}

export default KeywordComponent