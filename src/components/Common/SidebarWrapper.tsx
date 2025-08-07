
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Common/Navbar";
import Sidebar from "@/components/Common/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MdDashboard } from "react-icons/md";
import { useCampaignData } from "@/app/context/CampaignContext";
import { FaHome } from "react-icons/fa";
import { getArchivedCampaign, getUserCampaign } from "@/actions/campaign";
import Link from "next/link";

interface Campaign {
  _id: string;
  campaignName: string;
  projectUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SidebarWrapperProps {
  // children: React.ReactNode;
  // Convertedcampaign: Campaign[];
  archivedCampaignData:any
  campaignId?:string
}

export default  function SidebarWrapper({
  // children,
  // Convertedcampaign,
  campaignId,
  archivedCampaignData
}: SidebarWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setCampaignData } = useCampaignData();
  // const archivedCampaignData = await getArchivedCampaign(campaignId);


  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserCampaign();
      console.log(data,"data in sidebar");
      if (Array.isArray(data?.campaign)) {
        setCampaignData(data.campaign);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div
        className={cn(
          "h-screen border-r  z-40 fixed pt-20   bg-white shadow-lg border-muted transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-0 md:w-64",
        )}
      >
        <div className="flex justify-center items-center pt-4">
          {isCollapsed ? (
            <span className="text-lg font-semibold">
              <MdDashboard className="text-2xl" />
            </span>
          ) : (
            <Link href="/dashboard">
            <span className="text-xl text-center flex gap-1 justify-center items-center font-semibold"><FaHome />Dashboard</span>
            </Link>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-48px)]">
          <Sidebar archivedCampaignData={archivedCampaignData} isCollapsed={isCollapsed} />
        </ScrollArea>
      </div>

      {/* <div className="flex-1 transition-all w-full duration-300 ease-in-out">
        <ScrollArea className="h-[calc(100vh-48px)]">
          <Header setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
          {children}
        </ScrollArea>
      </div> */}
    </>
  );
}
