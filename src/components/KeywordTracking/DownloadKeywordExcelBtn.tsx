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
import { useLoader } from "@/hooks/useLoader";

// type Props = {
//   analyticData: AnalyticsPayload; // must be { dateWise: [...], monthWise: [...] }
//   filename?: string;
// };

export default function DownloadKeywordExcelBtn({
  // analyticData,
  sortedDataExel,
  tableHeader,
  tableData,
  filename = "Keywords-report.xlsx",
}: any) {
  const [open, setOpen] = useState(false);
  const { startLoading, stopLoading } = useLoader();
    
  const handleConfirm = () => {
    startLoading();
    downloadExcelTwoSheets(
  tableHeader,
  (sortedDataExel && sortedDataExel.length > 0 ? sortedDataExel : tableData),
  filename
);
    stopLoading();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button aria-label="Generate Excel" title="Generate Excel">
          <FaFileExcel className="shadow-none p-0 text-2xl   text-green-600 hover:text-green-700" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
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
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleConfirm}
          >
            Yes, Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
