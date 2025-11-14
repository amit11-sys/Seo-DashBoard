"use client";
import { CreateArchivedCampaign, getGetCampaignByid } from "@/actions/campaign";
import { useLoader } from "@/hooks/useLoader";
import React, { useState } from "react";
import { FaTrashAlt, FaFilePdf, FaArchive } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RiArchive2Line } from "react-icons/ri";
import { BsArchive } from "react-icons/bs";

// import { getfirstCompaignData } from "@/actions/keywordTracking";
// import { useCampaignData } from "@/app/context/CampaignContext";

interface HeaderProps {
  campaignId: string;
  topRankData: any;
  campaignStatus: any;
  ActiveUserData?: any;
  handleTabChange?: (tab: string) => void | undefined;
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
   handleTabChange = () => {},
  campaignId,
  topRankData,
  campaignStatus,
  ActiveUserData,
}) => {
  const { startLoading, stopLoading } = useLoader();
  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const router = useRouter();

  //TAb Name is - SEO ,PMS

  const handleCompaignArchived = async (
    campaignId: string,
    topRankData: any
  ) => {
    setOpenArchive(false);
    startLoading();
    const status = 2;
    try {
      const addedCampaignData = await CreateArchivedCampaign(
        campaignId,
        status,
        topRankData
      );

      // console.log(addedCampaignData, "addedCampaignDataIndata");
      if (addedCampaignData.error === "Unauthorized please login") {
        window.dispatchEvent(new Event("session-expired"));
        return;
      }

      // const {setCampaignId} = useCampaignData()

      // setCampaignId(addedCampaignData?.CompaignId as string)

      if (!addedCampaignData) {
        console.error("Failed to add Acrhived campaign:", addedCampaignData);
        toast.error("Failed to add Acrhived campaign");
        stopLoading();
        return;
      }
      // const firstCompaignData = await getfirstCompaignData();

      router.push(`/dashboard/`);
      toast.success(addedCampaignData.message);
      stopLoading();
    } catch (error) {
      toast.error("Something went wrong while deleting the campaign");
    }
  };

  return (
    <>
      <header className="flex items-center  justify-between  px-3 py-4 shadow-md bg-[#20364B] rounded-full">
        {/* Tabs */}
        <div className="flex ml-5 gap-4">
          <button
            className={`px-10 py-2 rounded-full text-sm font-medium ${
              activeTab === "SEO"
                ? "bg-[#FFB900] text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTabChange("SEO")}
          >
            SEO
          </button>

          <button
            className={`px-10 py-2 rounded-full text-sm font-medium ${
              activeTab === "PMS"
                ? "bg-[#FFB900] text-black"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTabChange("PMS")}
          >
            PMS
          </button>
        </div>

        {/* Archive button (your existing code) */}
        {campaignStatus === 1 && (
          <div className="flex items-center space-x-4 ml-auto">
            {ActiveUserData?.role === 2 && (
              <Dialog open={openArchive} onOpenChange={setOpenArchive}>
                <DialogTrigger asChild>
                  <button
                    title="Archive Campaign"
                    className="flex items-center text-[#FFB900] px-4 py-2 rounded transition"
                  >
                    <BsArchive className="text-2xl " />
                  </button>
                </DialogTrigger>

                <DialogContent className="bg-white flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Archive Campaign?</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to archive this campaign? You can
                      restore it later.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setOpenArchive(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const status = 2;
                        handleCompaignArchived(campaignId, topRankData);
                        setOpenArchive(false);
                      }}
                    >
                      Archive
                    </Button>
                    {/* <Button
                variant="destructive"
                onClick={() => {
                  handleCompaignArchived(campaignId,topRankData, 3); 
                  setOpenArchive(false); 
                }}
              >
                Delete
              </Button> */}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </header>
    </>

    // <header className="flex items-end my-6 justify-end p-2 shadow-md rounded-md">

    //   {campaignStatus === 1 && (
    //      <div className="flex items-center space-x-4 ml-auto">
    //     <button
    //       title="Download PDF"
    //       className="flex items-center text-red-400 px-3 py-1.5 rounded transition"
    //     >

    //     </button>
    //       {ActiveUserData?.role === 2 && (

    //  <Dialog open={openArchive} onOpenChange={setOpenArchive}>
    // <DialogTrigger asChild>
    //   <button
    //     title="Archive Campaign"
    //     className="flex items-center text-green-500 px-4 py-2 rounded transition"
    //   >
    //     <FaArchive className="text-2xl" />
    //   </button>
    // </DialogTrigger>

    // <DialogContent className="bg-white flex flex-col">
    //   <DialogHeader>
    //     <DialogTitle>Archive Campaign?</DialogTitle>
    //     <DialogDescription>
    //       Are you sure you want to archive this campaign? You can restore
    //       it later.
    //     </DialogDescription>
    //   </DialogHeader>

    //   <DialogFooter className="mt-4">
    //     <Button variant="ghost" onClick={() => setOpenArchive(false)}>
    //       Cancel
    //     </Button>
    //     <Button
    //       variant="destructive"
    //       onClick={() => {
    //         const status = 2
    //         handleCompaignArchived(campaignId,topRankData);
    //         setOpenArchive(false);
    //       }}
    //     >
    //       Archive
    //     </Button>
    //      {/* <Button
    //       variant="destructive"
    //       onClick={() => {
    //         handleCompaignArchived(campaignId,topRankData, 3);
    //         setOpenArchive(false);
    //       }}
    //     >
    //       Delete
    //     </Button> */}
    //   </DialogFooter>
    // </DialogContent>
    //   </Dialog>
    //     )}

    //   </div>
    //   )}

    // </header>
  );
};

export default Header;
