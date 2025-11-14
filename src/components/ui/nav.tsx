
"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FaChevronDown, FaGlobe, FaHome, FaLink } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { motion } from "framer-motion";
import { MdDashboard } from "react-icons/md";
import { arch } from "os";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: IconType;
    variant?: "default" | "ghost";
    href: string;
    dropdownItems?: {
      title: string;
      href: string;
      label?: string;
      icon: IconType;
      variant?: "default" | "ghost";
    }[];
  }[];
}

export function Nav({ links = [], isCollapsed }: NavProps) {
  const pathName = usePathname();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    links?.forEach((link, index) => {
      if (link.dropdownItems) {
        const isDropdownActive = link.dropdownItems.some(
          (dropdownItem) => pathName === dropdownItem.href
        );
        if (isDropdownActive) setOpenDropdownIndex(index);
      }
    });
  }, [pathName, links]);

  

  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");

  const handleActiveClick = () => setActiveTab("active");
  const handleArchivedClick = () => setActiveTab("archived");

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex min-h-[calc(100vh-48px)] flex-col gap-3 mt-[70px] rounded-t-[40px] ms-3 py-3  bg-[#273F4F] text-[#FF7A00] border-r border-[#FF7A00]/20"
    >
      <div className="flex justify-center items-center pt-3 ">
        {isCollapsed ? (
          <span className="text-lg text-white font-semibold">
            <MdDashboard className="text-2xl text-white" />
          </span>
        ) : (
          <Link href="/dashboard">
            <span className="text-xl text-white text-center flex gap-1 justify-center items-center font-semibold">
              <FaHome />
              Dashboard
            </span>
          </Link>
        )}
      </div>

   
      <>
        {/* TAB BUTTONS */}
        <div className="w-full flex gap-4 mt-4">
          <div className="w-full flex justify-center items-center rounded-lg">
            {/* Active Tab */}
            <button
              onClick={handleActiveClick}
              className={`w-[110px] px-4 py-[7px] rounded-l-full font-semibold shadow-sm transition
              ${
                activeTab === "active"
                  ? "bg-[#FFB900] text-black hover:bg-[#e6a800]"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Active
            </button>

            {/* Archived Tab */}
            <button
              onClick={handleArchivedClick}
              className={`w-[110px] px-4 py-[7px] rounded-r-full font-medium transition
              ${
                activeTab === "archived"
                  ? "bg-[#ecad00] text-black hover:bg-[#e6a800]"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="mt-6">
          {activeTab === "active" && <ActiveList links={links} />  }
          
         {activeTab === "archived" && <ArchivedList links={links} />}
        </div>
      </>
    </div>
  );
}


// export function ActiveList({ links }: any) {
//   const activeBlock = links.find((i: any) => i.title === "User Campaigns");
//   const campaigns = activeBlock?.dropdownItems || [];

//   return (
//     <div className="px-3">
//       <ScrollArea className="h-[70vh] pr-2">
//         <div className="flex flex-col gap-3">
//           {campaigns.map((item: any, index: number) => (
//             <motion.div
//               key={item.href}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.05, duration: 0.3 }}
//             >
//               <Link
//                 href={item.href}
//                 className="flex items-center justify-between bg-white rounded-full px-3 py-2 
//                   hover:bg-gray-100 transition-all duration-200
//                   hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
//               >
//                 <div className="flex items-center gap-1 truncate">
//                   <FaGlobe className="text-gray-600 text-sm transition-transform duration-200 group-hover:rotate-6" />
//                   <span className="text-[#273F4F] text-[12px] truncate max-w-[150px]">
//                     {item.title}
//                   </span>
//                 </div>
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }

export function ActiveList({ links }: any) {
  const pathName = usePathname();

  const activeBlock = links.find((i: any) => i.title === "User Campaigns");
  const campaigns = activeBlock?.dropdownItems || [];

  return (
    <div className="px-3">
      <ScrollArea className="h-[70vh] pr-2">
        <div className="flex flex-col gap-3">
          {campaigns.map((item: any, index: number) => {
            const isActive = pathName === item.href;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center justify-between rounded-full px-3 py-2 transition-all duration-200
                  ${isActive ? "bg-[#FFB900] text-black shadow-md" : "bg-white hover:bg-gray-100"}
                  ${!isActive && "hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"}
                `}
                >
                  <div className="flex items-center gap-1 truncate">
                    <FaGlobe className={`text-sm transition-transform duration-200 ${isActive ? "text-black" : "text-gray-600"}`} />
                    <span className={`truncate max-w-[150px] text-[12px] ${isActive ? "text-black font-semibold" : "text-[#273F4F]"}`}>
                      {item.title}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}



// export function ArchivedList({ links }: any) {
//   const archivedBlock = links.find((i: any) => i.title === "Archived Campaigns");
//   const archived = archivedBlock?.dropdownItems || [];

//   return (
//     <div className="px-3">
//       <ScrollArea className="h-[70vh] pr-2">
//         <div className="flex flex-col gap-3">
//           {archived.length === 0 ? (
//             <p className="text-gray-300 text-sm">No archived campaigns</p>
//           ) : (
//             archived.map((item: any, index: number) => (
//               <motion.div
//                 key={item.href}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05, duration: 0.3 }}
//               >
//                 <Link
//                   href={item.href}
//                   className="flex items-center justify-between bg-white rounded-full px-3 py-2 
//                     hover:bg-gray-100 transition-all duration-200
//                     hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"
//                 >
//                   <div className="flex items-center gap-1 truncate">
//                     <FaGlobe className="text-gray-600 text-sm transition-transform duration-200 group-hover:rotate-6" />
//                     <span className="text-[#273F4F] text-[10px] truncate max-w-[150px]">
//                       {item.title}
//                     </span>
//                   </div>
//                 </Link>
//               </motion.div>
//             ))
//           )}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }



export function ArchivedList({ links }: any) {
  const pathName = usePathname();

  const archivedBlock = links.find((i: any) => i.title === "Archived Campaigns");
  const archived = archivedBlock?.dropdownItems || [];

  return (
    <div className="px-3">
      <ScrollArea className="h-[70vh] pr-2">
        <div className="flex flex-col gap-3">
          {archived.length === 0 ? (
            <p className="text-gray-300 text-sm">No archived campaigns</p>
          ) : (
            archived.map((item: any, index: number) => {
              const isActive = pathName === item.href;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between rounded-full px-3 py-2 transition-all duration-200
                    ${isActive ? "bg-[#FFB900] text-black shadow-md" : "bg-white hover:bg-gray-100"}
                    ${!isActive && "hover:shadow-md hover:scale-[1.02] active:scale-[0.99]"}
                  `}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <FaGlobe className={`text-sm transition-transform duration-200 ${isActive ? "text-black" : "text-gray-600"}`} />
                      <span className={`truncate max-w-[150px] text-[10px] ${isActive ? "text-black font-semibold" : "text-[#273F4F]"}`}>
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
