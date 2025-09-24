// "use client";

// import { useState } from "react";
// import { DatePicker, Modal, Button } from "antd";
// import dayjs, { Dayjs } from "dayjs";
// import "antd/dist/reset.css";
// import { FcCalendar } from "react-icons/fc";

// const { RangePicker } = DatePicker;

// type DateRangeDialogProps = {
//   setDataWithDimension?: (v: { startDate: string; endDate: string }) => void;
//   setIsAnalyticsDataHandler?: (v: any) => void;
//   setDate?: (v: { startDate: string; endDate: string }) => void;
//   format?: string;
// };

// export default function DateRangeDialog({
//   // setDataWithDimension,
//   setIsAnalyticsDataHandler,
//   setDate,
//   format = "YYYY-MM-DD",
// }: DateRangeDialogProps) {
//   const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([
//     null,
//     dayjs(),
//   ]);
//   const [draftDates, setDraftDates] = useState<[Dayjs | null, Dayjs | null]>([
//     null,
//     dayjs(),
//   ]);
//   const [open, setOpen] = useState(false);

//   const openDialog = () => {
//     setDraftDates(dates);
//     setOpen(true);
//   };

//   const onCancel = () => setOpen(false);

//   const onApply = () => {
//     const [start, end] = draftDates;
//     const safeEnd = end ?? dayjs();
//     const applied: [Dayjs | null, Dayjs | null] = [start, safeEnd];

//     setDates(applied);
//     setOpen(false);

//     const payload = {
//       startDate: start ? start.format(format) : "",
//       endDate: safeEnd.format(format),
//     };

//     console.log("Applied range:", payload);
//     // setDataWithDimension(payload);
//     setDate?.(payload);
//     setIsAnalyticsDataHandler?.(payload);
//   };

//   const handleDraftChange = (values: [Dayjs | null, Dayjs | null] | null) => {
//     if (!values) {
//       setDraftDates([null, dayjs()]);
//     } else {
//       const [start, end] = values;
//       setDraftDates([start, end ?? dayjs()]);
//     }
//   };

//   // 🔹 Disable all dates after today
//   const disableFutureDates = (current: Dayjs) => {
//     return current && current > dayjs().endOf("day");
//   };

//   return (
//     <div className="p-4 flex gap-3 items-center">
//       {/* Calendar button */}
//       <Button
//         type="default"
//         className="flex  items-center gap-2 bg-transparent border-none"
//         icon={<FcCalendar className="text-4xl" />}
//         onClick={openDialog}

//       />

//       {/* Date range text */}
//       <p className="text-nowrap  mt-2 text-[12px] font-bold text-gray-600">
//         {dates[0]
//           ? `${dates[0]?.format(format)} → ${dates[1]?.format(format)}`
//           : `Last 3 months`}
//       </p>

//       {/* Modal */}
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
//           format={format}
//           style={{ width: "100%" }}
//           allowClear
//           disabledDate={disableFutureDates}
//         />
//       </Modal>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { DatePicker, Modal, Button, Tabs, Radio } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "antd/dist/reset.css";
import { FcCalendar } from "react-icons/fc";

const { RangePicker } = DatePicker;

type DateRangeDialogProps = {
  setDate?: (v: { startDate: string; endDate: string }) => void;
  setIsAnalyticsDataHandler?: (v: any) => void;
  format?: string;
};

export default function DateRangeDialog({
  setDate,
  setIsAnalyticsDataHandler,
  format = "YYYY-MM-DD",
}: DateRangeDialogProps) {
  // const [dates, setDates] = useState<[Dayjs | null, Dayjs | null]>([
  //   null,
  //   dayjs(),
  // ]);
  const [dates, setDates] = useState<any>([
    dayjs().subtract(3, "month"),
    dayjs(),
  ]);
  const [compareDates, setCompareDates] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null]);
  const [compareMode, setCompareMode] = useState<string>("28d-prev");

  const [draftDates, setDraftDates] = useState<any>([
    dayjs().subtract(3, "month"), // default start date
    dayjs(), // default end date = today
  ]);
  const [draftCompareDates, setDraftCompareDates] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null]);

  const [open, setOpen] = useState(false);
  const [enableCompare, setEnableCompare] = useState(false);

  const openDialog = () => {
    setDraftDates(dates);
    setDraftCompareDates(compareDates);
    setOpen(true);
  };

  const onCancel = () => setOpen(false);

  // const onApply = () => {
  //   const [start, end] = draftDates;
  //   const safeEnd = end ?? dayjs();

  //   const applied: [Dayjs | null, Dayjs | null] = [start, safeEnd];
  //   setDates(applied);

  //   let payload: any = {
  //     startDate: start ? start.format(format) : "",
  //     endDate: safeEnd.format(format),
  //   };

  //   // If compare is enabled, add second range
  //   if (enableCompare) {
  //     let comparePayload: any;

  //     //      switch (compareMode) {
  //     //   case "24h-prev":
  //     //     comparePayload = {
  //     //       startDate: dayjs().subtract(48, "hour").format(format),
  //     //       endDate: dayjs().subtract(24, "hour").format(format),
  //     //     };
  //     //     break;

  //     //   case "24h-wow":
  //     //     comparePayload = {
  //     //       startDate: dayjs().subtract(1, "week").subtract(24, "hour").format(format),
  //     //       endDate: dayjs().subtract(1, "week").format(format),
  //     //     };
  //     //     break;

  //     //   case "7d-prev":
  //     //     comparePayload = {
  //     //       startDate: dayjs().subtract(14, "day").format(format),
  //     //       endDate: dayjs().subtract(7, "day").format(format),
  //     //     };
  //     //     break;

  //     //   case "7d-yoy":
  //     //     comparePayload = {
  //     //       startDate: dayjs(start).subtract(1, "year").format(format),
  //     //       endDate: dayjs(end).subtract(1, "year").format(format),
  //     //     };
  //     //     break;

  //     //   case "28d-prev":
  //     //     comparePayload = {
  //     //       startDate: dayjs().subtract(56, "day").format(format),
  //     //       endDate: dayjs().subtract(28, "day").format(format),
  //     //     };
  //     //     break;

  //     //   case "28d-yoy":
  //     //     comparePayload = {
  //     //       startDate: dayjs(start).subtract(1, "year").format(format),
  //     //       endDate: dayjs(end).subtract(1, "year").format(format),
  //     //     };
  //     //     break;

  //     //   case "3m-prev":
  //     //     comparePayload = {
  //     //       startDate: dayjs().subtract(6, "month").format(format),
  //     //       endDate: dayjs().subtract(3, "month").format(format),
  //     //     };
  //     //     break;

  //     //   case "3m-yoy":
  //     //     comparePayload = {
  //     //       startDate: dayjs(start).subtract(1, "year").format(format),
  //     //       endDate: dayjs(end).subtract(1, "year").format(format),
  //     //     };
  //     //     break;

  //     //   case "6m-prev":
  //     //     comparePayload = {
  //     //       startDate: dayjs().subtract(12, "month").format(format),
  //     //       endDate: dayjs().subtract(6, "month").format(format),
  //     //     };
  //     //     break;
  //     //   case "none":
  //     //     comparePayload = {
  //     //       startDate: "",
  //     //       endDate:"" ,
  //     //     };
  //     //     break;

  //     //   case "custom":
  //     //     const [cStart, cEnd] = draftCompareDates;
  //     //     comparePayload = {
  //     //       startDate: cStart ? cStart.format(format) : "",
  //     //       endDate: (cEnd ?? dayjs()).format(format),
  //     //     };
  //     //     break;

  //     //   // add other future cases here
  //     // }

  //     const format = "YYYY-MM-DD";

  //     switch (compareMode) {
  //       // case "24h-prev":
  //       //   comparePayload = {
  //       //     startDate: dayjs().subtract(48, "hour").format(format),
  //       //     endDate: dayjs().subtract(24, "hour").format(format),
  //       //   };
  //       //   break;

  //       // case "24h-wow":
  //       //   comparePayload = {
  //       //     startDate: dayjs()
  //       //       .subtract(1, "week")
  //       //       .subtract(24, "hour")
  //       //       .format(format),
  //       //     endDate: dayjs().subtract(1, "week").format(format),
  //       //   };
  //       //   break;

  //       case "7d-prev":
  //         comparePayload = {
  //           startDate: dayjs().subtract(6, "day").format(format), // last 7 days includes today;
  //           endDate: dayjs().format(format),
  //           compare: {
  //             startDate: dayjs().subtract(14, "day").format(format),
  //             endDate: dayjs().subtract(7, "day").format(format),
  //           },

  //           // startDate: dayjs().subtract(14, "day").format(format),
  //           // endDate: dayjs().subtract(7, "day").format(format),
  //         };
  //         break;

  //       case "7d-yoy":
  //         comparePayload = {
  //           startDate: start
  //             ? dayjs(start).subtract(1, "year").format(format)
  //             : "",
  //           endDate: end ? dayjs(end).subtract(1, "year").format(format) : "",
  //         };
  //         break;

  //       case "28d-prev":
  //         comparePayload = {
  //           startDate: dayjs().subtract(56, "day").format(format),
  //           endDate: dayjs().subtract(28, "day").format(format),
  //         };
  //         break;

  //       case "28d-yoy":
  //         comparePayload = {
  //           startDate: start
  //             ? dayjs(start).subtract(1, "year").format(format)
  //             : "",
  //           endDate: end ? dayjs(end).subtract(1, "year").format(format) : "",
  //         };
  //         break;

  //       case "3m-prev":
  //         comparePayload = {
  //           startDate: dayjs().subtract(6, "month").format(format),
  //           endDate: dayjs().subtract(3, "month").format(format),
  //         };
  //         break;

  //       case "3m-yoy":
  //         comparePayload = {
  //           startDate: start
  //             ? dayjs(start).subtract(1, "year").format(format)
  //             : "",
  //           endDate: end ? dayjs(end).subtract(1, "year").format(format) : "",
  //         };
  //         break;

  //       case "6m-prev":
  //         comparePayload = {
  //           startDate: dayjs().subtract(12, "month").format(format),
  //           endDate: dayjs().subtract(6, "month").format(format),
  //         };
  //         break;

  //       case "none":
  //         comparePayload = {
  //           startDate: "",
  //           endDate: "",
  //         };
  //         break;

  //       case "custom":
  //         const [cStart, cEnd] = draftCompareDates.map((d) =>
  //           d ? dayjs(d) : null
  //         );
  //         comparePayload = {
  //           startDate: cStart ? cStart.format(format) : "",
  //           endDate: cEnd ? cEnd.format(format) : dayjs().format(format),
  //         };
  //         break;

  //       default:
  //         comparePayload = {
  //           startDate: "",
  //           endDate: "",
  //         };
  //         break;
  //     }

  //     payload.compare = comparePayload;
  //   }

  //   console.log("Applied payload:", payload);

  //   setDate?.(payload);
  //   setIsAnalyticsDataHandler?.(payload);
  //   setOpen(false);
  // };




  const onApply = () => {
  const format = "YYYY-MM-DD";
  const [start, end] = draftDates;

  // Default normal dates
  let normalStart = start;
  let normalEnd = end ?? dayjs();

  let payload: any = {
    startDate: normalStart ? normalStart.format(format) : "",
    endDate: normalEnd.format(format),
  };

  // If compare is enabled, generate compare payload automatically
  if (enableCompare) {
    let comparePayload: any = {};

    switch (compareMode) {
      case "7d-prev":
        normalEnd = dayjs(); // today
        normalStart = normalEnd.subtract(6, "day"); // last 7 days

        comparePayload = {
          startDate: normalStart.subtract(7, "day").format(format),
          endDate: normalEnd.subtract(7, "day").format(format),
        };
        break;

      case "7d-yoy":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(6, "day");

        comparePayload = {
          startDate: normalStart.subtract(1, "year").format(format),
          endDate: normalEnd.subtract(1, "year").format(format),
        };
        break;

      case "28d-prev":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(27, "day"); // last 28 days

        comparePayload = {
          startDate: normalStart.subtract(28, "day").format(format),
          endDate: normalEnd.subtract(28, "day").format(format),
        };
        break;

      case "28d-yoy":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(27, "day");

        comparePayload = {
          startDate: normalStart.subtract(1, "year").format(format),
          endDate: normalEnd.subtract(1, "year").format(format),
        };
        break;

      case "3m-prev":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(3, "month").add(1, "day"); // last 3 months

        comparePayload = {
          startDate: normalStart.subtract(3, "month").format(format),
          endDate: normalEnd.subtract(3, "month").format(format),
        };
        break;

      case "3m-yoy":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(3, "month").add(1, "day");

        comparePayload = {
          startDate: normalStart.subtract(1, "year").format(format),
          endDate: normalEnd.subtract(1, "year").format(format),
        };
        break;

      case "6m-prev":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(6, "month").add(1, "day");

        comparePayload = {
          startDate: normalStart.subtract(6, "month").format(format),
          endDate: normalEnd.subtract(6, "month").format(format),
        };
        break;

      case "custom":
        const [cStart, cEnd] = draftCompareDates.map((d) => (d ? dayjs(d) : null));
        comparePayload = {
          startDate: cStart ? cStart.format(format) : "",
          endDate: cEnd ? cEnd.format(format) : dayjs().format(format),
        };
        break;

      case "none":
      default:
        comparePayload = {
          startDate: "",
          endDate: "",
        };
        break;
    }

    // Override normal dates in payload after calculation
    payload.startDate = normalStart.format(format);
    payload.endDate = normalEnd.format(format);
    payload.compare = comparePayload;
  }

  console.log("Applied payload:", payload);

  setDates([normalStart, normalEnd]);
  setDate?.(payload);
  setIsAnalyticsDataHandler?.(payload);
  setOpen(false);
};

  const disableFutureDates = (current: Dayjs) => {
    return current && current > dayjs().endOf("day");
  };



//   import dayjs from "dayjs";

// const format = "YYYY-MM-DD";

// const getComparePayload = (compareMode: string, start?: string, end?: string) => {
//   let comparePayload: any = {};

//   switch (compareMode) {
//     case "24h-prev":
//       comparePayload = {
//         startDate: dayjs().subtract(48, "hour").format(format),
//         endDate: dayjs().subtract(24, "hour").format(format),
//         compare: {
//           startDate: dayjs().subtract(72, "hour").format(format),
//           endDate: dayjs().subtract(48, "hour").format(format),
//         },
//       };
//       break;

//     case "24h-wow":
//       comparePayload = {
//         startDate: dayjs().subtract(24, "hour").format(format),
//         endDate: dayjs().format(format),
//         compare: {
//           startDate: dayjs().subtract(1, "week").subtract(24, "hour").format(format),
//           endDate: dayjs().subtract(1, "week").format(format),
//         },
//       };
//       break;

//     case "7d-prev":
//       comparePayload = {
//         startDate: dayjs().subtract(6, "day").format(format), // last 7 days
//         endDate: dayjs().format(format),
//         compare: {
//           startDate: dayjs().subtract(13, "day").format(format),
//           endDate: dayjs().subtract(7, "day").format(format),
//         },
//       };
//       break;

//     case "28d-prev":
//       comparePayload = {
//         startDate: dayjs().subtract(27, "day").format(format),
//         endDate: dayjs().format(format),
//         compare: {
//           startDate: dayjs().subtract(55, "day").format(format),
//           endDate: dayjs().subtract(28, "day").format(format),
//         },
//       };
//       break;

//     case "3m-prev":
//       comparePayload = {
//         startDate: dayjs().subtract(3, "month").add(1, "day").format(format),
//         endDate: dayjs().format(format),
//         compare: {
//           startDate: dayjs().subtract(6, "month").format(format),
//           endDate: dayjs().subtract(3, "month").format(format),
//         },
//       };
//       break;

//     case "6m-prev":
//       comparePayload = {
//         startDate: dayjs().subtract(6, "month").add(1, "day").format(format),
//         endDate: dayjs().format(format),
//         compare: {
//           startDate: dayjs().subtract(12, "month").format(format),
//           endDate: dayjs().subtract(6, "month").format(format),
//         },
//       };
//       break;

//     case "7d-yoy":
//     case "28d-yoy":
//     case "3m-yoy":
//     case "6m-yoy":
//       comparePayload = {
//         startDate: start ? dayjs(start).subtract(1, "year").format(format) : "",
//         endDate: end ? dayjs(end).subtract(1, "year").format(format) : "",
//       };
//       break;

//     case "none":
//       comparePayload = {
//         startDate: "",
//         endDate: "",
//       };
//       break;

//     case "custom":
//       const [cStart, cEnd] = draftCompareDates.map(d => d ? dayjs(d) : null);
//       comparePayload = {
//         startDate: cStart ? cStart.format(format) : "",
//         endDate: cEnd ? cEnd.format(format) : dayjs().format(format),
//       };
//       break;

//     default:
//       comparePayload = {
//         startDate: "",
//         endDate: "",
//       };
//       break;
//   }

//   return comparePayload;
// };




  return (
    <div className="p-4 flex gap-3 items-center">
      {/* Calendar button */}
      <Button
        type="default"
        className="flex items-center gap-2 bg-transparent border-none"
        icon={<FcCalendar className="text-4xl" />}
        onClick={openDialog}
      />

      {/* Date range text */}
      <p className="text-nowrap mt-2 text-[12px] font-bold text-gray-600">
        {dates[0]
          ? `${dates[0]?.format(format)} → ${dates[1]?.format(format)}`
          : `Last 3 months`}
        {enableCompare && compareDates[0] && (
          <>
            {"  |  Compare: "}
            {compareDates[0]?.format(format)} → {" "} 
            {compareDates[1]?.format(format)}
          </>
        )}
      </p>

      {/* Modal */}
      <Modal
        title="Select date range"
        open={open}
        onCancel={onCancel}
        footer={
          <div className="flex justify-between items-center w-full">
            <Radio.Group
              value={enableCompare ? "compare" : "single"}
              onChange={(e) => setEnableCompare(e.target.value === "compare")}
            >
              <Radio value="single">Date</Radio>
              <Radio value="compare">Compare</Radio>
            </Radio.Group>
            <div className="flex gap-2">
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" onClick={onApply}>
                Apply
              </Button>
            </div>
          </div>
        }
        destroyOnClose
      >
        <Tabs
          activeKey={enableCompare ? "compare" : "single"}
          items={[
            {
              key: "single",
              label: "Date",
              children: (
                <RangePicker
                  value={draftDates}
                  onChange={(v) => setDraftDates(v ?? [null, dayjs()])}
                  format={format}
                  style={{ width: "100%" }}
                  allowClear
                  disabledDate={disableFutureDates}
                />
              ),
            },
            {
              key: "compare",
              label: "Compare",
              children: (
                <div className="space-y-3">
                  <Radio.Group
                    style={{ width: "100%" }}
                    value={compareMode}
                    onChange={(e) => setCompareMode(e.target.value)}
                  >
                    <div className="flex flex-col gap-2">
                      {/* <Radio value="24h-prev">
                        Compare last 24 hours to previous period
                      </Radio>
                      <Radio value="24h-wow">
                        Compare last 24 hours week over week
                      </Radio> */}
                      <Radio value="7d-prev">
                        Compare last 7 days to previous period
                      </Radio>
                      <Radio value="7d-yoy">
                        Compare last 7 days year over year
                      </Radio>
                      <Radio value="28d-prev">
                        Compare last 28 days to previous period
                      </Radio>
                      <Radio value="28d-yoy">
                        Compare last 28 days year over year
                      </Radio>
                      <Radio value="3m-prev">
                        Compare last 3 months to previous period
                      </Radio>
                      <Radio value="3m-yoy">
                        Compare last 3 months year over year
                      </Radio>
                      <Radio value="6m-prev">
                        Compare last 6 months to previous period
                      </Radio>
                      <Radio value="none">None</Radio>

                      {/* Custom Option */}
                      {/* <Radio value="custom">Custom</Radio>
                      {compareMode === "custom" && (
                        <RangePicker
                          value={draftCompareDates}
                          onChange={(v) =>
                            setDraftCompareDates(v ?? [null, null])
                          }
                          format={format}
                          style={{ width: "100%" }}
                          allowClear
                          disabledDate={disableFutureDates}
                        />
                      )} */}
                    </div>
                  </Radio.Group>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
}
