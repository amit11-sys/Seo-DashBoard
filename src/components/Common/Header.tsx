"use client";
import { CreateArchivedCampaign } from "@/actions/campaign";
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


interface HeaderProps {
  campaignId: string;
  topRankData:any
  campaignStatus:any
}

const Header: React.FC<HeaderProps> = ({ campaignId,topRankData,campaignStatus }) => {
  const { startLoading, stopLoading } = useLoader();
  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const router = useRouter();

 
  const handleCompaignArchived = async (campaignId: string,topRankData:any, status:any) => {
    setOpenArchive(false);
    startLoading();
    try {
      const addedCampaignData = await CreateArchivedCampaign(campaignId,topRankData, status);

      console.log(addedCampaignData, "addedCampaignDataIndata");



      if (!addedCampaignData) {
        console.error("Failed to add Acrhived campaign:", addedCampaignData);
        toast.error("Failed to add Acrhived campaign");
        stopLoading();
        return;
      }

      router.push(`/dashboard/`);
      toast.success(addedCampaignData.message);
      stopLoading();
    } catch (error) {
      toast.error("Something went wrong while deleting the campaign");
    } 
  };

  return (

    <header className="flex items-center justify-between p-2 shadow-md rounded-md">
      {campaignStatus === 1 && (
         <div className="flex items-center space-x-4 ml-auto">
        <button
          title="Download PDF"
          className="flex items-center text-red-400 px-3 py-1.5 rounded transition"
        >
         {/* <FaFilePdf className="text-red-600 text-3xl"/> */}
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
                Are you sure you want to archive this campaign? You can restore
                it later.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setOpenArchive(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const status = 2
                  handleCompaignArchived(campaignId, status,topRankData); 
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
