"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import CustomButton from "@/components/ui/CustomButton";
import { toast } from "sonner";
import { deleteKeywordData } from "@/actions/keyword";
import {
  getDbLiveKeywordData,
  getDbLiveKeywordDataWithSatusCode,
} from "@/actions/keywordTracking";
import { getRefreshSingleKeyword } from "@/actions/campaignRefresh";
import { IoRefreshCircle } from "react-icons/io5";
import { getGetCampaignByid } from "@/actions/campaign";
import {useLoader} from "../../hooks/useLoader"

interface TablebodyItems {
  keyword: string;
  keywordId: string;
  status: number;
  location: string;
  intent: string;
  start: string;
  page: string;
  Absolute_Rank: string;
  Group_Rank: string;
  oneDay: string;
  sevenDays: string;
  thirtyDays: string;
  life: string;
  comp: string;
  sv: string;
  date: string;
  rankingUrl: string;
}

interface DeleteConfirmProps {
  campaignId: string;
  keyword: string;
  keywordId: string;
  setTableBody?: any;
  CardSetOnChanges?: any;
  getKeywordData: () => void;
}

const SingleKeywordRefresh = ({
  keywordId,
  campaignId,
  // CardSetOnChanges,
  keyword,
  setTableBody,
  getKeywordData,
}: DeleteConfirmProps) => {
  const [open, setOpen] = useState(false);
  const {stopLoading,startLoading} = useLoader()

  const handleSingleRefreshKeyword = async (keywordId: string) => {
    startLoading()
    try {
      const res = await getRefreshSingleKeyword(keywordId);
      if (res.success) {
      
        await getKeywordData();
       
        toast.success("Keyword Updated successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to refresh keyword");
      }
    } catch (err) {
      toast.error("An error occurred during refresh");
      console.error(err);
    } finally {
       stopLoading()
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2 text-red-600 rounded-full hover:bg-red-200">
        <IoRefreshCircle title="Refresh keyword" className="text-xl" />
      </DialogTrigger>

      <DialogContent className="max-w-md border-none shadow-2xl bg-white p-6">
        <DialogHeader className="flex items-center gap-2">
          <HiOutlineExclamationCircle className="text-2xl text-red-500" />
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Confirm Refresh
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-gray-600 text-sm">
          Are you sure you want to Refresh <b>{keyword}</b>? This action cannot
          be undone.
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <CustomButton buttonName="Cancel" />
          </DialogClose>
          <DialogClose asChild>
            <CustomButton
              buttonName="Update"
              onClick={() => handleSingleRefreshKeyword(keywordId)}
            />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleKeywordRefresh;
