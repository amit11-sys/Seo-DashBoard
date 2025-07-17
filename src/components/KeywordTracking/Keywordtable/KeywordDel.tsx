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
import CustomButton from "../../ui/CustomButton";
import { toast } from "sonner"; // ✅ Import toast for notifications
import { deleteKeywordData } from "@/actions/keyword"; // ✅ Import action
import { getDbLiveKeywordData } from "@/actions/keywordTracking";

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
}

const DeleteConfirm = ({
  keywordId,
  campaignId,
  keyword,
  setTableBody,
}: DeleteConfirmProps) => {
  const [open, setOpen] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteKeywordData({ keywordId: id, campaignId });
      if (res.success) {
          const campaignLiveKeywordsData = await getDbLiveKeywordData(campaignId);
      let data: any = [];
      if (campaignLiveKeywordsData?.newLiveKeywordDbData) {
        data = campaignLiveKeywordsData?.newLiveKeywordDbData.map((item: any) => ({
          // select: false,
          status: item.status,
          keywordId: item.keywordId,
          keyword: item.keyword,
          location: item.location_name,
          // intent: "C",
          start: String(item.rank_group),
          page: Math.ceil(item.rank_absolute / 10).toString(),
          Absolute_Rank: String(item.rank_absolute),
          Group_Rank: String(item.rank_group),
          // oneDay: "1",
          sevenDays: "-",
          // thirtyDays: "-",
          life: String(item.rank_group),
          // comp: "0",
          // sv: "0",
          date: new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          }),
          rankingUrl: item.url,
          // rankingUrl: new URL(item.url) || "/",
        }));
      }
      setTableBody(data);
        toast.success("Keyword deleted successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to delete keyword");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2 text-red-600 rounded-full hover:bg-red-200">
        <MdDelete className="text-xl" />
      </DialogTrigger>

      <DialogContent className="max-w-md border-none shadow-2xl bg-white p-6">
        <DialogHeader className="flex items-center gap-2">
          <HiOutlineExclamationCircle className="text-2xl text-red-500" />
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Confirm Delete
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-gray-600 text-sm">
          Are you sure you want to delete <b>{keyword}</b>? This action cannot
          be undone.
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <CustomButton buttonName="Cancel" />
          </DialogClose>
          <DialogClose asChild>
            <CustomButton
              buttonName="Delete"
              onClick={() => handleDelete(keywordId)}
            />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirm;
