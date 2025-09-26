
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

  if (enableCompare) {
    let comparePayload: any = {};

    switch (compareMode) {
      case "7d-prev":
        normalEnd = dayjs();
        normalStart = normalEnd.subtract(6, "day"); 

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
        normalStart = normalEnd.subtract(27, "day");

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
        normalStart = normalEnd.subtract(3, "month").add(1, "day");

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
  {!enableCompare ? (
    // ✅ Only Date Picker when not comparing
    <RangePicker
      value={draftDates}
      onChange={(v) => setDraftDates(v ?? [null, dayjs()])}
      format={format}
      style={{ width: "100%" }}
      allowClear
      disabledDate={disableFutureDates}
    />
  ) : (
    // ✅ Tabs only when comparing
    <Tabs
      activeKey="compare"
      items={[
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
                  <Radio value="7d-prev">Compare last 7 days to previous period</Radio>
                  <Radio value="7d-yoy">Compare last 7 days year over year</Radio>
                  <Radio value="28d-prev">Compare last 28 days to previous period</Radio>
                  <Radio value="28d-yoy">Compare last 28 days year over year</Radio>
                  <Radio value="3m-prev">Compare last 3 months to previous period</Radio>
                  <Radio value="3m-yoy">Compare last 3 months year over year</Radio>
                  <Radio value="6m-prev">Compare last 6 months to previous period</Radio>
                  <Radio value="none">None</Radio>
                </div>
              </Radio.Group>
            </div>
          ),
        },
      ]}
    />
  )}
</Modal>

    </div>
  );
}
