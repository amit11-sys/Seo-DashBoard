// lib/downloadExcel.ts
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

type DateWiseRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type MonthWiseRow = {
  month: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type Payload = {
  dateWise: DateWiseRow[];
  monthWise: MonthWiseRow[];
};

export function downloadExcelTwoSheets(
  data: Payload,
  filename = "report.xlsx"
) {
  const { dateWise, monthWise } = data;

  // Flatten dateWise: take keys[0] as "date"
  const flatDateWise = dateWise.map((d) => ({
    date: d.keys?.[0] ?? "",
    clicks: d.clicks,
    impressions: d.impressions,
    ctr: d.ctr,
    position: d.position,
  }));

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.json_to_sheet(flatDateWise);
  XLSX.utils.book_append_sheet(wb, ws1, "Date Wise");

  const ws2 = XLSX.utils.json_to_sheet(monthWise);
  XLSX.utils.book_append_sheet(wb, ws2, "Month Wise");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // saveAs(blob, filename);
}
