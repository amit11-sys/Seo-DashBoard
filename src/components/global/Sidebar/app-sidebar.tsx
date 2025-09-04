
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
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbBrandCampaignmonitor } from "react-icons/tb";
import ClientCampaignsLink from "@/components/global/Sidebar/ClientCampaignLinks";

export async function AppSidebar() {
  const campaign = await getUserCampaign();

  const Convertedcampaign = campaign?.campaign?.map((c) => ({
    _id: c._id.toString(),
    campaignName: c.campaignName.toString(),
    projectUrl: c.projectUrl.toString(),
    userId: c.userId.toString(),
    createdAt: c.createdAt.toString(),
    updatedAt: c.updatedAt.toString(),
    __v: c.__v,
  })) || [];

  return (
    <div className="w-64 fixed min-h-screen border-r bg-gradient-to-b from-[#273F4F] to-[#273F4F] dark:from-sidebar-background dark:to-gray-800 shadow-lg z-30 ">
      <Sidebar className=" fixed h-full  bg-gradient-to-b z-30   from-[#273F4F] to-[#273F4F]">
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-blue-700 font-semibold text-md px-2 py-3">
              <MdOutlineSpaceDashboard className="text-4xl" />
              <span className="truncate">ANALYTICS DASHBOARD</span>
               {/* <SidebarTrigger  /> */}
            </SidebarGroupLabel>

            <SidebarGroupContent className="overflow-hidden transition-all data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center gap-2 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700 font-medium">
                        <TbBrandCampaignmonitor className="text-blue-500 text-lg" />
                        <span className="font-bold uppercase">Campaigns</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="mt-1 pl-4">
                        <ClientCampaignsLink campaign={Convertedcampaign} />
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


