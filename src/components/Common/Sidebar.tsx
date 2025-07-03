// "use client";

import { Nav } from "@/components/ui/nav";
import {
  FaMinus, // Minus
  FaUsers, // Users
} from "react-icons/fa";


import { useCampaignData } from "@/app/context/CampaignContext";


type SidebarProps = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { campaignData } = useCampaignData();

  // console.log(campaignData);
  const organizeData = campaignData.map((c: any) => {
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

            dropdownItems: organizeData,
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
