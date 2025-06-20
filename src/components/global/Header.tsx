"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/user";
import { toast } from "sonner";
import { CampaignModal } from "../modals/CampaignModal";
import { Button } from "../ui/button";
import { Plus, PowerCircle, PowerIcon, PowerOff } from "lucide-react";
import ButtonComponent from "./ButtonComponent";

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
    <div className=" z-10 h-16 bg-white shadow w-full">
      <nav className="bg-white shadow shadow-black px-2">
        <div className="mx-auto max-w-7xl">
          <div className="relative flex h-16 items-center justify-between">
            <div className="">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/">ANALYTICS-DASHBOARD</Link>
              </div>
            </div>
            {/* <CampaignModal buttonText="ADD CAMPAIGN" /> */}
            <ButtonComponent
              Icon={Plus}
              onClick={() => router.push("/add-campaign")}
            >
              ADD CAMPAIGN
            </ButtonComponent>
            <div>
              <ButtonComponent Icon={PowerIcon} onClick={onLogout}>LOG OUT</ButtonComponent>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
