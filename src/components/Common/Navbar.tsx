"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { logoutUser } from "@/actions/user";

import { MdDashboard, MdOutlineDashboardCustomize } from "react-icons/md";
import {
  FaMagnifyingGlassChart,
  FaPlus,
  FaPowerOff,
  FaUser,
} from "react-icons/fa6";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function Navbar({
  campaignId,
  ActiveUserData,
  role,
}: {
  campaignId?: string;
  ActiveUserData?: { role: number; email: string };
  role?: any;
}) {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const onLogout = async () => {
    const logout = await logoutUser();
    if (logout) {
      router.push("/sign-in");
      toast("Logout Successfully");
    }
  };

  const userEmail = role?.email || ActiveUserData?.email;

  return (
    <div className="z-50 fixed top-0 left-0 bg-[#273F4F] shadow w-full">
      <nav className="px-5 py-2 shadow w-full mr-10">
        <div className="relative flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center justify-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-6 py-3 rounded-full text-white text-2xl font-bold tracking-wide shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
            >
              <MdDashboard className="text-white text-4xl drop-shadow-sm" />
              <span className="flex items-center">
                Track
                <span className="text-orange-500 text-4xl font-extrabold px-1">
                  S
                </span>
                cop
              </span>
              <FaMagnifyingGlassChart className="text-white text-3xl drop-shadow-sm" />
            </Link>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-4">
            {(role?.role === 2 || ActiveUserData?.role === 2) && (
              <Link
                href="/add-campaign"
                className="!flex !items-center !justify-center 
                     bg-gradient-to-r from-[#FE7743] to-[#d65d2d]
                     text-white px-4 py-2 rounded-full 
                     text-xs sm:text-sm font-semibold 
                     shadow-md transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg 
                     focus:outline-none h-[38px] leading-none 
                     min-w-[110px] text-center tracking-wide"
              >
                + Add Campaign
              </Link>
            )}

            {/* Logout Button */}

            {(role?.role === 3 || ActiveUserData?.role === 3) && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-1
               bg-gradient-to-r from-[#FE7743] to-[#d65d2d]
               text-white px-4 py-2 rounded-full 
               text-xs sm:text-sm font-semibold 
               shadow-md transition-all duration-300 
               transform hover:scale-105 hover:shadow-lg 
               focus:outline-none h-[38px] leading-none 
               min-w-[110px] text-center tracking-wide"
              >
                <FaPowerOff className="text-xs sm:text-sm" />
                LOG OUT
              </button>
            )}

            {(role?.role === 2 || ActiveUserData?.role === 2) && (
              <>
                <Link
                  href="/admin-dashboard"
                  className="flex items-center justify-center gap-1
               bg-gradient-to-r from-[#FE7743] to-[#d65d2d]
               text-white px-4 py-2 rounded-full 
               text-xs sm:text-sm font-semibold 
               shadow-md transition-all duration-300 
               transform hover:scale-105 hover:shadow-lg 
               focus:outline-none h-[38px] leading-none 
               min-w-[110px] text-center tracking-wide"
                >
                  <MdOutlineDashboardCustomize className="text-xs sm:text-sm" />
                  Admin Dashboard
                </Link>
              </>
            )}

            {/* User Icon with Dropdown */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-center text-white text-xl drop-shadow-sm p-2 rounded-full hover:bg-[#FF7A00]/20 transition">
                  <FaUser title={userEmail} />
                </button>
              </PopoverTrigger>
              {(role?.role === 2 || ActiveUserData?.role === 2) && (
                <PopoverContent className="w-52 bg-white text-black rounded-lg shadow-lg p-4 mr-6 mt-4">
                  <div className="flex flex-col gap-2">
                    <span className="truncate font-light">{userEmail}</span>
                    {/* {(role?.role === 2 || ActiveUserData?.role === 2) && (
                    <Link
                      href="/admin-dashboard"
                      className="text-sm text-[#FF7A00] hover:underline"
                    >
                      Admin Dashboard
                    </Link>
                  )} */}
                    <button
                      onClick={onLogout}
                      className="mt-2 px-2 py-1 text-sm bg-[#d65d2d] text-white rounded hover:bg-orange-600"
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>
      </nav>
    </div>
  );
}
