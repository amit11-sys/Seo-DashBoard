
import ExcelJS from "exceljs";

export async function downloadExcelTwoSheets(
  tableHeader: { key: string; label: string }[],
  tableData: Record<string, any>[],
  filename = "report.xlsx"
) {

  console.log(tableHeader, tableData ,"downloadExcelTwoSheets");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Table Data");

  // Title Row
  const titleRow = worksheet.addRow(["Keyword Live Data"]);
  titleRow.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleRow.alignment = { horizontal: "center", vertical: "middle" };
  titleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0070C0" },
  };
  worksheet.mergeCells(1, 1, 1, tableHeader?.length);

  // Header Row
  const headerRow = worksheet.addRow(tableHeader?.map((col) => col.label));
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4F81BD" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Normalize function for matching keys
  const normalize = (key: string) => key.toLowerCase().replace(/[-_]/g, "");

  // Data Rows
  tableData.forEach((row) => {
    const rowData = tableHeader.map((col) => {
      const matchKey = Object.keys(row).find(
        (rk) => normalize(rk) === normalize(col.key)
      );
      const value = matchKey ? row[matchKey] : "";
      return value !== undefined && value !== null
        ? value.toString()
        : "";
    });
    const addedRow = worksheet.addRow(rowData);
    addedRow.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
    });
  });

  // Auto-fit column widths
  worksheet.columns.forEach((col) => {
    let maxLength = 0;
   if (col && typeof col.eachCell === 'function') {
  col.eachCell({ includeEmpty: true }, (cell) => {
    const val = cell.value ? cell.value.toString() : "";
    maxLength = Math.max(maxLength, val.length);
  });
}
    col.width = Math.min(Math.max(maxLength + 2, 15), 50); // limit to 50 for readability
  });

  // Save and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
