


"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { logoutUser } from "@/actions/user";
import GoogleConnect from "../modals/GoogleConnect";

import { MdDashboard } from "react-icons/md";
import { FaMagnifyingGlassChart, FaPlus, FaPowerOff } from "react-icons/fa6";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import BlueButton from "../ui/CustomButton";

export default function Navbar({ campaignId }: { campaignId?: string }) {
  const router = useRouter();
  const [connectModal, setConnectModal] = useState<{
    open: boolean;
    type: "gsc" | "ga" | "gbp" | null;
  }>({
    open: false,
    type: null,
  });

  const onLogout = async () => {
    const logout = await logoutUser();
    if (logout) {
      router.push("/sign-in");
      toast("Logout Successfully");
    }
  };

  return (
    <>
      {/* ✅ Single GoogleConnect Modal */}
      <GoogleConnect
        campaignId={campaignId}
        open={connectModal.open}
        onOpenChange={(open) => setConnectModal((prev) => ({ ...prev, open }))}
        integrationType={connectModal.type as any}
      />

      <div className="z-50 fixed top-0 left-0 bg-[#273F4F] shadow w-full">
        <nav className="px-5 py-2 shadow w-full mr-10">
          <div className="w-full">
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
              <div className="flex flex-wrap justify-start items-start gap-3 sm:gap-4 mt-4">
                {/* Dropdown Connect Menu */}
              <Link href="/add-campaign" className="!flex !items-center !justify-center 
                     bg-gradient-to-r from-[#FE7743] to-[#d65d2d]
                     text-white px-4 py-2 rounded-full 
                     text-xs sm:text-sm font-semibold 
                     shadow-md transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg 
                     focus:outline-none h-[38px] leading-none 
                     min-w-[110px] text-center tracking-wide">
                      + Add Campaign
                     </Link>
              

                {/* Logout Button */}
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
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
