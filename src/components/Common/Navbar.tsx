"use client";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/user";
import { toast } from "sonner";

import { FaMagnifyingGlassChart, FaPlus, FaPowerOff } from "react-icons/fa6";


import BlueButton from "../ui/CustomButton";
import { MdDashboard } from "react-icons/md";
import { useEffect, useState } from "react";
import { getArchivedCampaign, getUserCampaign } from "@/actions/campaign";
// import { getfirstCompaignData } from "@/actions/keywordTracking";
import { useCampaignData } from "@/app/context/CampaignContext";

type Props = {
  // setIsCollapsed: (isCollapsed: boolean) => void;
  // isCollapsed: boolean;
  campaignId?: string
};

export default  function Navbar({campaignId}: Props) {
  // const handleToggle = () => {
  //   setIsCollapsed(!isCollapsed);
  // };
  const [FirstCompaign, setFirstCompaign] = useState("");
  
  const router = useRouter();
  //  const { campaignId } = useCampaignData();
  //  const archivedCampaignData = await getArchivedCampaign(campaignId);

  const onLogout = async () => {
    const logout = await logoutUser();
    if (logout) {
      router.push("/sign-in");
      toast("Logout Successfully");
    }
  };
  
  // useEffect(() => {
  //   const fetchFirstCampaign = async () => {
  //     try {
  //       const fetchCompaigns = await getfirstCompaignData();
  //       console.log(fetchCompaigns?.firstCompagin?._id, "first fetch");
  //       setFirstCompaign(fetchCompaigns?.firstCompagin?._id);
  //     } catch (error) {
  //       console.log(error, "failed to fetch compaign nav header");
  //     }
  //   };
  //   fetchFirstCampaign();
  // }, []);

  return (
    <>
      <div className=" z-50 fixed top-0 left-0 bg-[#273F4F] shadow w-full ">
        <nav className=" px-5 py-2 shadow w-full mr-10 ">
          <div className="w-full">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex  gap-4">
               
                {/* <div
                  // className="flex flex-shrink-0 items-center transition-all duration-200 transform hover:scale-105 hover:from-[#d65d2d] cursor-pointer hover:to-[#FE7743] bg-gradient-to-r from-[#FE7743] to-[#d65d2d] text-white py-4 px-4 rounded-full bg-[#335488]">

                  className="flex  items-center  text-white text-3xl transition-all duration-200 transform hover:scale-105 "
                >
                  <Link
                    className="flex justify-center items-center gap-4"
                    href={`/dashboard`}
                  >
                    <MdDashboard className="text-orange-500" />
                   Track<span className="text-orange-500 text-3xl border-none p-0 m-0">S</span>cope<FaMagnifyingGlassChart className="text-orange-500" />
                  </Link>
                </div> */}
                <div className="flex items-center justify-center">
  <Link
    href="/dashboard"
    className="flex items-center gap-3 px-6 py-3 rounded-full 
      
      text-white text-2xl font-bold tracking-wide
      shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
  >
    {/* Left Icon */}
    <MdDashboard className="text-white text-4xl drop-shadow-sm" />

    {/* Brand Name */}
    <span className="flex items-center">
      Track
      <span className="text-orange-500 text-4xl font-extrabold px-1">S</span>
      cop
    </span>

    {/* Right Icon */}
    <FaMagnifyingGlassChart className="text-white text-3xl drop-shadow-sm" />
  </Link>
</div>

              </div>

              <div className="flex justify-center items-center gap-5">
                <BlueButton
                  icon={<FaPlus />}
                  onClick={() => router.push("/add-campaign")}
                  buttonName="ADD CAMPAIGN"
                />

                <BlueButton
                  icon={<FaPowerOff />}
                  onClick={onLogout}
                  buttonName="LOG OUT"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
