"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import CustomButton from "../../ui/CustomButton";

const DeleteConfirm = () => {
  return (
    <Dialog>
      <DialogTrigger className="p-2  text-red-600 rounded-full hover:bg-red-200">
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
          Are you sure you want to delete this item? This action cannot be undone.
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <CustomButton
            buttonName="Cancel"
            
          />
          <CustomButton
            buttonName="Delete"
           
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirm;
