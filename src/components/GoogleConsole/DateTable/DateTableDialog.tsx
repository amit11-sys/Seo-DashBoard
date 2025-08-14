// "use client";

// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { FaCalendarAlt } from "react-icons/fa";
// import { BsChevronDown } from "react-icons/bs";
// import { Switch } from "@/components/ui/switch";

// const DateRangeDialog = () => {
//   return (
//     <Dialog>
//       <DialogTrigger className="p-2 text-blue-600 rounded-full hover:bg-blue-100">
//         <FaCalendarAlt className="text-xl" />
//       </DialogTrigger>

//       <DialogContent className="max-w-md border-none shadow-2xl bg-white p-6 rounded-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-lg font-semibold text-gray-800 mb-4">
//             Date Range
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-4">
//           <span className="text-gray-600 text-sm">2025-05-27 - 2025-06-27</span>
//           <BsChevronDown className="text-gray-500" />
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <Switch defaultChecked />
//             <span className="text-gray-700 text-sm">Compare to:</span>
//           </div>
//           <div className="flex items-center gap-2 border rounded-xl px-4 py-2">
//             <span className="text-gray-600 text-sm">Previous period</span>
//             <BsChevronDown className="text-gray-500" />
//           </div>
//         </div>

//         <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-6">
//           <span className="text-gray-600 text-sm">2025-04-25 - 2025-05-26</span>
//           <BsChevronDown className="text-gray-500" />
//         </div>

//         <div className="flex justify-end gap-3">
//           <button className="px-6 py-2 rounded-full border text-gray-600 hover:bg-gray-100 transition">
//             Cancel
//           </button>
//           <button className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
//             Apply
//           </button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DateRangeDialog;



"use client";

import { useState } from "react";
import { DatePicker, Modal, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";
import { FcCalendar } from "react-icons/fc";

const { RangePicker } = DatePicker;

type DateRangeDialogProps = {
  setDataWithDimension: (v: { startDate: string; endDate: string }) => void;
  setDate?: (v: { startDate: string; endDate: string }) => void; // optional if you also keep another state
  format?: string; // default output format
};

export default function DateRangeDialog({
  setDataWithDimension,
  setDate,
  format = "YYYY-MM-DD",
}: DateRangeDialogProps) {
  // persisted (applied) dates -> start null, end today
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    dayjs(),
  ]);

  // temp dates edited inside the modal
  const [draftDates, setDraftDates] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    dayjs(),
  ]);

  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setDraftDates(dates);
    setOpen(true);
  };

  const onCancel = () => setOpen(false);

  const onApply = () => {
    const [start, end] = draftDates;
    const safeEnd = end ?? dayjs(); // ensure end is always set
    const applied: [Dayjs | null, Dayjs | null] = [start, safeEnd];

    setDates(applied);
    setOpen(false);

    const payload = {
      startDate: start ? start.format(format) : "",
      endDate: safeEnd.format(format),
    };

    console.log("Applied range:", payload);
    setDataWithDimension(payload);
    setDate?.(payload);
  };

  const handleDraftChange = (values: [Dayjs | null, Dayjs | null] | null) => {
    if (!values) {
      setDraftDates([null, dayjs()]);
    } else {
      const [start, end] = values;
      setDraftDates([start, end ?? dayjs()]);
    }
  };

  return (
    <div className="p-4">
      <Button
        type="default"
        className="flex items-center gap-2 bg-transparent border-none"
        icon={<FcCalendar className="text-4xl" />}
        onClick={openDialog}
      />

      <Modal
        title="Select date range"
        open={open}
        onCancel={onCancel}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={onApply}>
              Apply
            </Button>
          </div>
        }
        destroyOnClose
      >
        <RangePicker
          value={draftDates}
          onChange={handleDraftChange}
          format={format}
          style={{ width: "100%" }}
          allowClear
        />
      </Modal>
    </div>
  );
}

