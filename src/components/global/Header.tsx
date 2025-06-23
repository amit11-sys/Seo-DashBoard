"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/user";
import { toast } from "sonner";

import { FaPlus,FaPowerOff  } from "react-icons/fa6";


import BlueButton from "../ui/CustomButton";
import { MdDashboard } from "react-icons/md";


const Header = () => {
  const router = useRouter();
  const onLogout = async () => {
    const logout = await logoutUser();
    if (logout) {
      router.push("/sign-in");
      toast("Logout Successfully");
    }
  };

  return (
    <div className=" z-10 fixed   h-16 bg-[#273F4F] shadow w-full">
      <nav className="bg-[#273F4F] p-3 shadow shadow-black px-2">
        <div className="ms-auto max-w-7xl">
          <div className="relative flex h-16 items-center justify-between">
            <div className="">
              <div 
              
              // className="flex flex-shrink-0 items-center transition-all duration-200 transform hover:scale-105 hover:from-[#d65d2d] cursor-pointer hover:to-[#FE7743] bg-gradient-to-r from-[#FE7743] to-[#d65d2d] text-white py-4 px-4 rounded-full bg-[#335488]">
                
              className="flex flex-shrink-0 items-center  text-white text-3xl transition-all duration-200 transform hover:scale-105 ">

                <Link className="flex justify-center items-center gap-4" href="/dashboard"> <MdDashboard />ANALYTICS-DASHBOARD</Link>
              </div>
            </div>
         
            <div className="flex justify-center items-center gap-5">
            <BlueButton icon={<FaPlus/>} onClick={() => router.push("/add-campaign")} buttonName="ADD CAMPAIGN" />
            
              <BlueButton icon={<FaPowerOff/>} onClick={onLogout} buttonName="LOG OUT" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
