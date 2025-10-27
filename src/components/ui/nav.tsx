// "use client";

// import { buttonVariants } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { cn } from "@/lib/utils";

// import { FaChevronDown } from "react-icons/fa";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import { IconType } from "react-icons/lib";

// import { motion } from "framer-motion";
// interface NavProps {
//   isCollapsed: boolean;
//   links: {
//     title: string;
//     label?: string;
//     icon: IconType;
//     variant?: "default" | "ghost";
//     href: string;
//     dropdownItems?: {
//       title: string;
//       href: string;
//       label?: string;
//       icon: IconType;
//       variant?: "default" | "ghost";
//     }[];
//   }[];
// }

// export function Nav({ links = [], isCollapsed }: NavProps) {
//   const pathName = usePathname();
//   const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
//     null
//   );



//   useEffect(() => {
//     links?.forEach((link, index) => {
//       if (link.dropdownItems) {
//         const isDropdownActive = link.dropdownItems.some(
//           (dropdownItem) => pathName === dropdownItem.href
//         );
//         if (isDropdownActive) {
//           setOpenDropdownIndex(index);
//         }
//       }
//     });
//   }, [pathName, links]);

//   const handleToggleDropdown = (index: number) => {
//     setOpenDropdownIndex(openDropdownIndex === index ? null : index);
//   };

//   return (
//     <div
//       data-collapsed={isCollapsed}
//       className="group flex min-h-[calc(100vh-48px)] flex-col gap-4 py-2 data-[collapsed=true]:gap-1 data-[collapsed=true]:py-2 dark:border-muted dark:bg-muted dark:text-muted-foreground  pr-5"
//     >
//       <nav className="grid gap-1  px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
//         {links?.map((link, index) => {
//           const isLinkActive = pathName === link.href;
//           const isDropdownActive = link.dropdownItems?.some(
//             (dropdownItem) => pathName === dropdownItem.href
//           );

//           return (
//             <div key={index} className="relative  w-full   ">
//               {isCollapsed ? (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Link
//                       href={link.href}
//                       className={cn(
//                         buttonVariants({
//                           variant:
//                             isLinkActive || isDropdownActive
//                               ? "default"
//                               : "ghost",
//                           size: "icon",
//                         }),
//                         "h-9 text-2xl  w-9 ",
//                         link.variant === "default" &&
//                           "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted bg-white dark:hover:text-white"
//                       )}
//                     >
//                       <link.icon className="h-4 text-2xl w-4 bg-slate-800 " />
//                       <span className="sr-only">
//                         {link.title.replace(/^https?:\/\/(www\.)?/, "")}
//                       </span>
//                     </Link>
//                   </PopoverTrigger>
//                   <PopoverContent
//                     side="right"
//                     className="flex w-64 flex-col gap-4 border-l-2 bg-white"
//                   >
//                     <div className="flex items-center justify-between gap-4">
//                       <span>
//                         {link.title.replace(/^https?:\/\/(www\.)?/, "")}
//                       </span>
//                       <div className="">
//                         {link.label && (
//                           <span className="ml-auto bg-slate-800 font-semibold ">
//                             {link.label}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     {link.dropdownItems && (
//                       <ScrollArea
//                         className={cn(
//                           link.dropdownItems.length > 5 ? "h-44" : "",
//                           "space-y-1 border-l-2 border-primary bg-background"
//                         )}
//                       >
//                         {link.dropdownItems.map((dropdownItem, i) => (
//                           <Link
//                             key={i}
//                             href={dropdownItem.href}
//                             className={cn(
//                               buttonVariants({
//                                 variant:
//                                   pathName === dropdownItem.href
//                                     ? "default"
//                                     : "ghost",
//                                 size: "sm",
//                               }),
//                               "flex items-center justify-start gap-2 rounded-none pl-0"
//                             )}
//                           >
//                             <dropdownItem.icon className="h-4 w-4 text-primary" />
//                             {dropdownItem.title.replace(
//                               /^https?:\/\/(www\.)?/,
//                               ""
//                             )}
//                             {dropdownItem.label && (
//                               <span
//                                 className={cn(
//                                   "ml-auto",
//                                   dropdownItem.variant === "default" &&
//                                     "text-background dark:text-white"
//                                 )}
//                               >
//                                 {dropdownItem.label}
//                               </span>
//                             )}
//                           </Link>
//                         ))}
//                       </ScrollArea>
//                     )}
//                   </PopoverContent>
//                 </Popover>
//               ) : (
//                 <>
//                   <div
//                     onClick={() => handleToggleDropdown(index)}
//                     className={cn(
//                       buttonVariants({
//                         variant:
//                           isLinkActive || isDropdownActive
//                             ? "default"
//                             : "ghost",
//                         size: "sm",
//                       }),
//                       link.variant === "default" &&
//                         "rounded-none dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
//                       "flex cursor-pointer items-center justify-start"
//                     )}
//                   >
//                     <Link
//                       href={link.href}
//                       className="flex w-full text-lg text-orange-600 items-center justify-between"
//                     >
//                       <div className="flex items-center justify-start">
//                         <link.icon className="mr-2 text-4xl" />
//                         {link.title.replace(/^https?:\/\/(www\.)?/, "")}
//                       </div>
//                       <div className="flex items-center justify-start">
//                         {link.label && (
//                           <span
//                             className={cn(
//                               "ml-auto",
//                               link.variant === "default" &&
//                                 "text-background  dark:text-white"
//                             )}
//                           >
//                             {link.label}
//                           </span>
//                         )}
//                         {link.dropdownItems && (
//                           <FaChevronDown
//                             className={cn(
//                               "ml-2 h-4 w-4  transition-transform",
//                               {
//                                 "rotate-180": openDropdownIndex === index,
//                               }
//                             )}
//                           />
//                         )}
//                       </div>
//                     </Link>
//                   </div>
//                   {link.dropdownItems && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 30, scale: 0.8 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 80,
//                         damping: 15,
//                         duration: 0.6,
//                       }}
//                       className={cn(
//                         "ml-5 mt-1  text-2xl space-y-1 border-l-2 overflow-y-auto   border-primary bg-background",
//                         "transition-opacity duration-300 ease-in-out",
//                         openDropdownIndex === index
//                           ? "block translate-y-0 opacity-100"
//                           : "hidden -translate-y-2 opacity-0",
//                         "max-h-72 overflow-y-auto pr-2"
//                       )}
//                     >
//                       {link.dropdownItems.map((dropdownItem, i) => (
                       
//                         <Link
//                           key={i}
//                           href={dropdownItem.href}
//                           className={cn(
//                             buttonVariants({
//                               variant:
//                                 pathName === dropdownItem.href
//                                   ? "default"
//                                   : "ghost",
//                               size: "sm",
//                             }),
//                             "flex hover:scale-[1.04] mt-3 border-1 rounded-sm items-center overflow-x-hidden text-sm justify-start gap-2 pl-0",
//                             pathName === dropdownItem.href &&
//                               "bg-primary/10 text-primary font-semibold border-l-4  border-primary"
//                           )}
//                         >
//                           <dropdownItem.icon className="h-4 w-4 text-primary" />
//                           {dropdownItem.title.replace(
//                             /^https?:\/\/(www\.)?/,
//                             ""
//                           )}
//                           {dropdownItem.label && (
//                             <span
//                               className={cn(
//                                 "ml-auto",
//                                 dropdownItem.variant === "default" &&
//                                   "text-background dark:text-white"
//                               )}
//                             >
//                               {dropdownItem.label}
//                             </span>
//                           )}
//                         </Link>
//                       ))}
//                     </motion.div>
//                   )}
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//       {/* ) : ( */}

//       {/* <div className="text-center text-muted-foreground py-10 text-sm">
//         No compaign
//       </div> */}

//       {/* )} */}
//     </div>
//   );
// }






"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import { motion } from "framer-motion";

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
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

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

  const handleToggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex min-h-[calc(100vh-48px)] flex-col gap-3 py-3 pr-4 bg-[#273F4F] text-[#FF7A00] border-r border-[#FF7A00]/20"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
        {links?.map((link, index) => {
          const isLinkActive = pathName === link.href;
          const isDropdownActive = link.dropdownItems?.some(
            (dropdownItem) => pathName === dropdownItem.href
          );

          return (
            <div key={index} className="relative w-full">
              {isCollapsed ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        buttonVariants({
                          variant:
                            isLinkActive || isDropdownActive
                              ? "default"
                              : "ghost",
                          size: "icon",
                        }),
                        "h-10 w-10 text-2xl rounded-lg bg-[#273F4F] text-[#FF7A00] hover:bg-[#FF7A00]/20 transition-all duration-200"
                      )}
                    >
                      <link.icon />
                    </Link>
                  </PopoverTrigger>

                  <PopoverContent
                    side="right"
                    className="flex w-64 flex-col gap-3 border-l-2 border-[#FF7A00]/50 bg-[#273F4F] text-[#FF7A00] rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{link.title}</span>
                      {link.label && (
                        <span className="text-xs bg-[#FF7A00]/20 px-2 py-0.5 rounded">
                          {link.label}
                        </span>
                      )}
                    </div>

                    {link.dropdownItems && (
                      <ScrollArea className="space-y-2 max-h-48">
                        {link.dropdownItems.map((dropdownItem, i) => (
                          <Link
                            key={i}
                            href={dropdownItem.href}
                            className={cn(
                              "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-[#FF7A00]/20 transition-all duration-200",
                              pathName === dropdownItem.href &&
                                "bg-[#FF7A00]/30 text-white"
                            )}
                          >
                            <dropdownItem.icon className="h-4 w-4 text-[#FF7A00]" />
                            {dropdownItem.title}
                          </Link>
                        ))}
                      </ScrollArea>
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  {/* 🔹 Main Link Row */}
                  <div
                    onClick={() => handleToggleDropdown(index)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[#FF7A00]/10",
                      isLinkActive || isDropdownActive
                        ? "bg-[#FF7A00]/20 text-white font-semibold"
                        : ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="text-2xl  text-white" />
                      <span className="text-sm">{link.title}</span>
                    </div>
                    {link.dropdownItems && (
                      <FaChevronDown
                        className={cn(
                          "ml-2 h-4 w-4 text-[#FF7A00] transition-transform",
                          { "rotate-180": openDropdownIndex === index }
                        )}
                      />
                    )}
                  </div>

                  {/* 🔸 Dropdown Items */}
                  {link.dropdownItems && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={
                        openDropdownIndex === index
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: -10 }
                      }
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={cn(
                        "ml-5 mt-1 space-y-1 overflow-y-auto transition-all duration-300",
                        openDropdownIndex === index
                          ? "max-h-72"
                          : "max-h-0 hidden"
                      )}
                    >
                      {link.dropdownItems.map((dropdownItem, i) => (
                        <Link
                          key={i}
                          href={dropdownItem.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-[#FF7A00]/10 transition-all duration-200",
                            pathName === dropdownItem.href &&
                              "bg-[#FF7A00]/30 text-white"
                          )}
                        >
                          <dropdownItem.icon className="h-4 w-4  text-white " />
                          {dropdownItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
