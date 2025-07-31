"use client";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/user";
import { toast } from "sonner";

import { FaPlus, FaPowerOff } from "react-icons/fa6";

import BlueButton from "../ui/CustomButton";
import { MdDashboard } from "react-icons/md";
import { useEffect, useState } from "react";
import { getUserCampaign } from "@/actions/campaign";
import { getfirstCompaignData } from "@/actions/keywordTracking";

type Props = {
  // setIsCollapsed: (isCollapsed: boolean) => void;
  // isCollapsed: boolean;
};

export default function Header() {
  // const handleToggle = () => {
  //   setIsCollapsed(!isCollapsed);
  // };
  const [FirstCompaign, setFirstCompaign] = useState("");
  const router = useRouter();
  const onLogout = async () => {
    const logout = await logoutUser();
    if (logout) {
      router.push("/sign-in");
      toast("Logout Successfully");
    }
  };
  useEffect(() => {
    const fetchFirstCampaign = async () => {
      try {
        const fetchCompaigns = await getfirstCompaignData();
        // console.log(fetchCompaigns?.firstCompagin?._id, "first fetch");
        setFirstCompaign(fetchCompaigns?.firstCompagin?._id);
      } catch (error) {
        console.log(error, "failed to fetch compaign nav header");
      }
    };
    fetchFirstCampaign();
  }, []);

  return (
    <>
      <div className=" z-50 fixed top-0 left-0 bg-[#273F4F] shadow w-full ">
        <nav className=" px-5 py-2 shadow w-full mr-10 ">
          <div className="w-full">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex  gap-4">
                <button
                  // onClick={() => handleToggle()}
                  className="flex text-white  h-10 w-10 transform items-center justify-center rounded-md ring-1 ring-white/10 transition-colors duration-200 ease-in-out hover:bg-white/10"
                >
                  <>
                    {<LuPanelLeftOpen className="hidden h-10 w-10 md:block" />}
                    <LuPanelLeftClose className="block h-10 w-10 md:hidden" />
                  </>
                </button>
                <div
                  // className="flex flex-shrink-0 items-center transition-all duration-200 transform hover:scale-105 hover:from-[#d65d2d] cursor-pointer hover:to-[#FE7743] bg-gradient-to-r from-[#FE7743] to-[#d65d2d] text-white py-4 px-4 rounded-full bg-[#335488]">

                  className="flex  items-center  text-white text-3xl transition-all duration-200 transform hover:scale-105 "
                >
                  <Link
                    className="flex justify-center items-center gap-4"
                    href={`/dashboard/${FirstCompaign}`}
                  >
                    <MdDashboard />
                    ANALYTICS-DASHBOARD
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
