// "use client";

// import Header from "@/components/Common/Header";
// import Sidebar from "@/components/Common/Sidebar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";
// // import Link from "next/link";
// import { useState } from "react";
// import { MdDashboard } from "react-icons/md";

// type Props = {};

// export default function WebLayout({
//   children,
// }: Props & { children: React.ReactNode }) {
//   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

//   return (
//     <>
//       <div className={"flex h-screen w-full overflow-hidden"}>
//         <div
//           className={cn(
//             "h-screen border-r border-muted transition-all duration-300 ease-in-out",
//             isCollapsed ? "w-16" : "w-0 md:w-64",
//           )}
//         >
//           {/* <Link
//             href="/"
//             className="flex h-12 items-center justify-center bg-primary text-primary-foreground"
//           > */}
//             {isCollapsed ? (
//               <span className="text-lg font-semibold"><MdDashboard /></span>
//             ) : (
//               <span className="text-lg font-semibold">Dashboard</span>
//             )}
//           {/* </Link> */}
//           <ScrollArea className="h-[calc(100vh-48px)]">
//             <Sidebar isCollapsed={isCollapsed} />
//           </ScrollArea>
//         </div>
//         <div className="flex-1 transition-all  w-full  duration-300 ease-in-out">
//           <ScrollArea className=" h-[calc(100vh-48px)]">

//            <Header setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

//             {children}
//           </ScrollArea>

//         </div>
//       </div>
//     </>
//   );
// }

// app/layouts/WebLayout.tsx (Server Component)
import Header from "@/components/Common/Header";
import Sidebar from "@/components/Common/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MdDashboard } from "react-icons/md";
import SidebarWrapper from "@/components/Common/SidebarWrapper";
import { getUserCampaign } from "@/actions/campaign";
import { convertLegacyProps } from "antd/es/button";
import { useEffect } from "react";
import { useCampaignData } from "../context/CampaignContext";

type Props = {
  children: React.ReactNode;
};

export default async function WebLayout({ children }: Props) {
  const campaign = await getUserCampaign();
  const Convertedcampaign =
    campaign?.campaign?.map((c) => ({
      _id: c._id.toString(),
      campaignName: c.campaignName.toString(),
      projectUrl: c.projectUrl.toString(),
      userId: c.userId.toString(),
      createdAt: c.createdAt.toString(),
      updatedAt: c.updatedAt.toString(),
      __v: c.__v,
    })) || [];
    
//following is the response from the server
//      [ {
//     _id: '685a71597a50e6508ecf1fdd',
//     campaignName: 'mohit',
//     projectUrl: 'https://www.odk.com/',
//     userId: '6850fa5b93d3a11fcb0b698c',
//     createdAt: 'Tue Jun 24 2025 15:05:21 GMT+0530 (India Standard Time)',
//     updatedAt: 'Tue Jun 24 2025 15:05:21 GMT+0530 (India Standard Time)',
//     __v: 0
//   }
// ]

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarWrapper Convertedcampaign={Convertedcampaign} >{children}</SidebarWrapper>
    </div>
  );
}
