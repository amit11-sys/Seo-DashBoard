"use client";

import React from "react";
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

interface DeleteConfirmProps {
  campaignId: string;
  keyword: string;
  keywordId: string;
}

const DeleteConfirm = ({ keywordId, campaignId, keyword }: DeleteConfirmProps) => {
  const handleDelete = async (id: string) => {
    try {
      const res = await deleteKeywordData({ keywordId: id, campaignId });

      if (res.success) {
        toast.success("Keyword deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete keyword");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
      console.error(err);
    }
  };

  return (
    <Dialog>
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
          Are you sure you want to delete <b>{keyword}</b>? This action cannot be undone.
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
