// "use client";

import { Nav } from "@/components/ui/nav";
import {
  FaBook, // BookText
  FaUserGraduate, // BookUserIcon (closest equivalent - user with book feel)
  FaCreditCard, // CreditCard
  FaDatabase, // Database
  FaDownload, // Download
  FaHome, // House
  FaEnvelope, // Mail
  FaMinus, // Minus
  FaBox, // Package
  FaFileInvoiceDollar, // Receipt
  FaCog, // Settings
  FaTruck, // Truck
  FaUpload, // Upload
  FaUsers, // Users
} from "react-icons/fa";

import { usePathname } from "next/navigation";
import { useCampaignData } from "@/app/context/CampaignContext";
import { useEffect } from "react";
import { getUserCampaign } from "@/actions/campaign";

type SidebarProps = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { campaignData } = useCampaignData();

  console.log(campaignData);
  let organizeData = campaignData.map((c: any) => {
    // console.log(c)
    return {
      title: c.projectUrl,
      href: `/dashboard/${c._id}`,
      label: "",
      icon: FaMinus,
     
    };
  });
  

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
         
          {
            title: "User Campaigns",
            href: "#",
            label: "",
            icon: FaUsers,

            dropdownItems: organizeData
          },
       
        ]}
      />
      {/* <Separator />
      {!isCollapsed && (
        <h4 className="mt-3 px-4 text-base font-semibold tracking-tight">
          Discover
        </h4>
      )} */}
    </>
  );
};

export default Sidebar;
