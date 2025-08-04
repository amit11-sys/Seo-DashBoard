"use client";
import { getdeleteCampaign } from "@/actions/campaign";
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
import { getfirstCompaignData } from "@/actions/keywordTracking";


interface HeaderProps {
  campaignId: string;
}

const Header: React.FC<HeaderProps> = ({ campaignId }) => {
  const { startLoading, stopLoading } = useLoader();
  const [openDelete, setOpenDelete] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const router = useRouter();

  const handleCompaignDelete = async () => {
    setOpenDelete(false);
    startLoading();
    try {
      const DeletedCampaignData = await getdeleteCampaign(campaignId);

      if (!DeletedCampaignData) {
        console.error("Failed to delete campaign:", DeletedCampaignData);
        toast.error("Failed to delete campaign");
        stopLoading();
        return;
      }
      const firstCompaignData = await getfirstCompaignData();

      toast.success(DeletedCampaignData.message);
      router.push(`/dashboard/${firstCompaignData?.firstCompagin?._id}`);
    } catch (error) {
      toast.error("Something went wrong while deleting the campaign");
    } finally {
      stopLoading();
    }
  };
  const handleCompaignArchived = async (campaignId: string) => {
    setOpenArchive(false);
    startLoading();
    try {
      const DeletedCampaignData = await getdeleteCampaign(campaignId);

      if (!DeletedCampaignData) {
        console.error("Failed to delete campaign:", DeletedCampaignData);
        toast.error("Failed to delete campaign");
        stopLoading();
        return;
      }
      const firstCompaignData = await getfirstCompaignData();

      toast.success(DeletedCampaignData.message);
      router.push(`/dashboard/${firstCompaignData?.firstCompagin?._id}`);
    } catch (error) {
      toast.error("Something went wrong while deleting the campaign");
    } finally {
      stopLoading();
    }
  };

  return (
    <header className="flex items-center justify-between p-2 shadow-md rounded-md">
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
              className="flex items-center text-gray-600 px-4 py-2 rounded transition"
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
                  handleCompaignArchived(campaignId); // 👈 call your archive logic here
                  setOpenArchive(false); // close dialog after action
                }}
              >
                Archive
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Trigger for delete */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild>
            <button
              title="Delete Campaign"
              className="flex items-center text-red-700 px-4 py-2 rounded transition"
            >
              <FaTrashAlt className=" text-2xl" />
            </button>
          </DialogTrigger>

          {/* delete dialog */}

          <DialogContent className="bg-white flex flex-col">
            <DialogHeader>
              <DialogTitle>Delete Campaign?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this campaign? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setOpenDelete(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleCompaignDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
