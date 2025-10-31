import { Nav } from "@/components/ui/nav";
import {
  FaMinus, // Minus
  FaUsers, // Users
  FaArchive,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { getArchivedCampaign, getUserCampaign } from "@/actions/campaign";

type SidebarProps = {
  isCollapsed: boolean;
  // archivedCampaignData?: any;
  campaignId?: string;
};

const Sidebar = ({
  isCollapsed,
  // archivedCampaignData,
  campaignId,
}: SidebarProps) => {
  const [campaignData, setCampaignData] = useState<any>();
  const [archivedCampaignData, setArchivedCampaignData] = useState<any>();
  useEffect(() => {
    const fetchArchivedCampaign = async () => {
      const fetchData:any = await getArchivedCampaign();

      // console.log(fetchData,"fetchData in sidebar");

      setArchivedCampaignData(fetchData?.KeywordTrackingDataArchived || []);
    };

    fetchArchivedCampaign();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserCampaign();
      // console.log(data,"data in sidebar");
      if (Array.isArray(data?.campaign)) {
        setCampaignData(data?.campaign);
      }
    };
    fetchData();
  }, []);

  // console.log(campaignData);
  const organizeCompaignData = campaignData?.map((c: any) => {
    // console.log(c)
    return {
      title: c.projectUrl,
      href: `/dashboard/${c._id}`,
      label: "",
      icon: FaMinus,
    };
  });
  const organizedArchivedCompaignData = archivedCampaignData?.map((c: any) => {
    return {
      title: c.projectUrl,
      href: `/dashboard/${c._id}`,
      label: "",
      icon: FaMinus,
    };
  });
  // console.log(organizedArchivedCompaignData,"organizedArchivedCompaignData");

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

            dropdownItems:
              campaignData?.length > 0
                ? organizeCompaignData
                : [
                    {
                      title: "No campaigns",
                      href: "#",
                      label: "",
                      icon: FaMinus,
                    },
                  ],
          },
          {
            title: "Archived Campaigns",
            href: "#",
            label: "",
            icon: FaArchive,

            dropdownItems:
              organizedArchivedCompaignData?.length > 0
                ? organizedArchivedCompaignData
                : [
                    {
                      title: "No Archived campaigns",
                      href: "#",
                      label: "",
                      icon: FaMinus,
                    },
                  ],
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
