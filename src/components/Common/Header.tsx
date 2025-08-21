"use client";
import { CreateArchivedCampaign, getGetCampaignByid } from "@/actions/campaign";
import { useLoader } from "@/hooks/useLoader";
import React, { useEffect, useState } from "react";
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
import { getfirstCompaignData } from "@/actions/keywordTracking";
// import { useCampaignData } from "@/app/context/CampaignContext";

interface HeaderProps {
  campaignId: string;
  topRankData: any;

}

const Header: React.FC<HeaderProps> = ({
  campaignId,
  topRankData,
  
}) => {
  const { startLoading, stopLoading } = useLoader();
  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [statusCode, setStatusCode] = useState<number>();
  console.log(statusCode, "statusCode in header");
  const router = useRouter();
  useEffect(() => {
    // Fetch campaign data by ID
    const fetchCampignCode = async () => {
      const campignDataWithId: any = await getGetCampaignByid(campaignId);

      const campaignStatus = campignDataWithId?.campaign?.status;
      setStatusCode(campaignStatus);
    };
    fetchCampignCode();
  }, []);
  // const handleCompaignDelete = async () => {
  //   setOpenDelete(false);
  //   startLoading();
  //   try {
  //     const DeletedCampaignData = await CreateArchivedCampaign(campaignId);

  //     // if (!DeletedCampaignData) {
  //     //   console.error("Failed to delete campaign:", DeletedCampaignData);
  //     //   toast.error("Failed to delete campaign");
  //     //   stopLoading();
  //     //   return;
  //     // }
  //     // const firstCompaignData = await getfirstCompaignData();

  //     toast.success(DeletedCampaignData.message);
  //     router.push("/dashboard/");

  //   } catch (error) {
  //     toast.error("Something went wrong while deleting the campaign");
  //   } finally {
  //     stopLoading();
  //   }
  // };

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

      console.log(addedCampaignData, "addedCampaignDataIndata");

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
    <header className="flex items-center justify-between p-2 shadow-md rounded-md">
      {statusCode === 1 && (
        <div className="flex items-center space-x-4 ml-auto">
          <button
            title="Download PDF"
            className="flex items-center text-red-400 px-3 py-1.5 rounded transition"
          >
            <FaFilePdf className=" text-2xl" />
          </button>

          {/* Dialog Trigger for archive */}
          <Dialog open={openArchive} onOpenChange={setOpenArchive}>
            <DialogTrigger asChild>
              <button
                title="Archive Campaign"
                className="flex items-center text-green-500 px-4 py-2 rounded transition"
              >
                <FaArchive className="text-2xl" />
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
                <Button variant="ghost" onClick={() => setOpenArchive(false)}>
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
        </div>
      )}
    </header>
  );
};

export default Header;
