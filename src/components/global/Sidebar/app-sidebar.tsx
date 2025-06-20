import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,

} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { getUserCampaign } from "@/actions/campaign";
// import ClientCampaignLinks from "./ClientCampaignLinks";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbBrandCampaignmonitor } from "react-icons/tb";
// import { useCampaignData } from "@/app/context/CampaignContext";
import ClientCampaignsLink from "@/components/global/Sidebar/ClientCampaignLinks";

type campaignType = {
  success: true;
  message: "Campaign Successfully Found";
  campaign: [
    {
      _id: "";
      campaignName: "";
      projectUrl: "";
      userId: "";
      createdAt: "";
      updatedAt: "";
      __v: 0;
    }
  ];
};

export async function AppSidebar() {
  const campaign = await getUserCampaign();
// console.log(campaign);

const Convertedcampaign  = campaign?.campaign?.map((c) => {


 let obj={
  _id:'',
  campaignName:'',
  projectUrl:'',
  userId:'',
  createdAt: '' ,
  updatedAt: '',
  __v: 0
 }

 obj._id = c._id.toString();
 obj.campaignName = c.campaignName.toString();
 obj.projectUrl = c.projectUrl.toString();
 obj.userId = c.userId.toString();
 obj.createdAt = c.createdAt.toString();
 obj.updatedAt = c.updatedAt.toString();
 return obj


})


  //  const { campaignData, setCampaignData } = useCampaignData();

  return (
    <div className="w-64 min-h-screen border-r bg-gradient-to-b from-white to-slate-50 dark:from-sidebar-background dark:to-gray-800 shadow-md z-30">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-blue-700 font-semibold text-md px-2 py-3">
              <MdOutlineSpaceDashboard className="text-xl" />
              ANALYTICS DASHBOARD
            </SidebarGroupLabel>

            <SidebarGroupContent className="overflow-hidden transition-all data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center gap-2 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700 font-medium">
                        <TbBrandCampaignmonitor className="text-blue-500 text-lg" />
                        <span>Campaigns</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-1">
                        <ClientCampaignsLink campaign={campaign} />
                        {/* {campaign?.campaign?.length ? (
                          <ClientCampaignLinks
                            campaigns={campaign.campaign.map((c) => ({
                              _id: c._id.toString(),
                              projectUrl: c.projectUrl,
                            }))}
                          />
                        ) : (
                          <SidebarMenuSubItem className="text-gray-400 italic">
                            No campaigns found
                          </SidebarMenuSubItem>
                        )} */}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
