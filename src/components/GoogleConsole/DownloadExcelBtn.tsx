"use client";

import { useState } from "react";
import {
  downloadExcelTwoSheets,
  // type AnalyticsPayload,
} from "@/lib/downloadExcel";
import { FaFileExcel } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// type Props = {
//   analyticData: AnalyticsPayload; // must be { dateWise: [...], monthWise: [...] }
//   filename?: string;
// };

export default function  DownloadExcelBtn({
  analyticData,
  filename = "console-report.xlsx",
}: any) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    downloadExcelTwoSheets(analyticData, filename);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className=" shadow-none p-0   text-green-600 hover:text-green-700"
          aria-label="Generate Excel" title="Generate Excel"
        >
          <FaFileExcel className="" />
         
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Excel Report</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to generate and download the Excel file?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleConfirm}
          >
            Yes, Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
