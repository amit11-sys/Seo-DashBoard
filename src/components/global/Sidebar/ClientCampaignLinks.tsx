
"use client";

import { useRouter } from "next/navigation";
import { SidebarMenuSubItem } from "@/components/ui/sidebar";
import { HiOutlineLink } from "react-icons/hi";

export default function ClientCampaignsLink({ campaign }:any) {
  const router = useRouter();

  return (
    <>
      {campaign?.length ? (
        campaign.map((c:any) => (
          <SidebarMenuSubItem
            key={c._id}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            onClick={() => router.push(`/dashboard/${c._id}`)}
          >
            <HiOutlineLink className="text-blue-500" />
            {c.projectUrl}
          </SidebarMenuSubItem>
        ))
      ) : (
        <SidebarMenuSubItem className="text-gray-400 italic">
          No campaigns found
        </SidebarMenuSubItem>
      )}
    </>
  );
}
