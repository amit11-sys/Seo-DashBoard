// "use client";

// import { useState } from "react";
// import { DatePicker, Modal, Button } from "antd";
// import dayjs, { Dayjs } from "dayjs";
// import "antd/dist/reset.css";

// import { FcCalendar } from "react-icons/fc";

// const { RangePicker } = DatePicker;

// export default function DateRangeDialog(setDataWithDimension: any, setDate: any) {
//   // persisted (applied) dates -> start null, end today
//   const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([
//     null,
//     dayjs(),
//   ]);

//   // temp dates edited inside the modal
//   const [draftDates, setDraftDates] = useState<[Dayjs | null, Dayjs | null]>([
//     null,
//     dayjs(),
//   ]);

//   const [open, setOpen] = useState(false);

//   const openDialog = () => {
//     // start with current persisted values
//     setDraftDates(dates);
//     setOpen(true);
//   };

//   const onCancel = () => setOpen(false);

//   const onApply = () => {
//     const [start, end] = draftDates;
//     const safeEnd = end ?? dayjs(); // ensure end is always set
//     const applied: [Dayjs | null, Dayjs | null] = [start, safeEnd];

//     setDates(applied);
//     setOpen(false);

//     console.log(
//       "Applied range:",
//       start ? start.format("DD-MM-YYYY") : "null",
//       safeEnd.format("DD-MM-YYYY")
//     );
//    setDataWithDimension({
//     startDate:  start ? start.format("DD-MM-YYYY") : "null",
//     endDate:  safeEnd.format("DD-MM-YYYY"),
   
//   }) 
//   };

//   const handleDraftChange = (values: [Dayjs | null, Dayjs | null] | null) => {
//     if (!values) {
//       setDraftDates([null, dayjs()]);
//     } else {
//       const [start, end] = values;
//       setDraftDates([start, end ?? dayjs()]);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Trigger */}
//       <Button
//         type="default"
//         className="flex items-center gap-2 bg-transparent border-none"
//         icon={<FcCalendar className="text-4xl" />}
//         onClick={openDialog}
//       ></Button>

      

//       {/* Modal with picker */}
//       <Modal
//         title="Select date range"
//         open={open}
//         onCancel={onCancel}
//         footer={
//           <div className="flex justify-end gap-2">
//             <Button onClick={onCancel}>Cancel</Button>
//             <Button type="primary" onClick={onApply}>
//               Apply
//             </Button>
//           </div>
//         }
//         destroyOnClose
//       >
//         <RangePicker
//           value={draftDates}
//           onChange={handleDraftChange}
//           format="DD-MM-YYYY"
//           style={{ width: "100%" }}
//           allowClear
//         />
//       </Modal>
//     </div>
//   );
// }


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

