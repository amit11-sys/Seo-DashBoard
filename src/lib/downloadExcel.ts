// // lib/downloadExcel.ts
// import * as XLSX from "xlsx";

// export function downloadExcelTwoSheets(
//   tableHeader: { key: string; label: string }[],
//   tableData: Record<string, any>[],
//   filename = "report.xlsx"
// ) {
//   const normalize = (key: string) => key.toLowerCase().replace(/[-_]/g, "");

//   // Map normalized key to label
//   const headerMap = tableHeader.reduce((map, col) => {
//     map[normalize(col.key)] = col.label;
//     return map;
//   }, {} as Record<string, string>);

//   // Format data according to headers
//   const formattedData = tableData.map((row) => {
//     const newRow: Record<string, any> = {};
//     tableHeader.forEach((col) => {
//       const normalizedKey = normalize(col.key);
//       const matchKey = Object.keys(row).find(
//         (rk) => normalize(rk) === normalizedKey
//       );
//       newRow[headerMap[normalizedKey]] =
//         matchKey && row[matchKey] !== undefined ? row[matchKey] : "";
//     });
//     return newRow;
//   });

//   const wb = XLSX.utils.book_new();

//   // Add extra title row
//   const titleRow = [["Keyword Live Data"]];
//   const headerRow = tableHeader.map((col) => col.label);
//   const sheetData = [...titleRow, headerRow, ...formattedData.map(Object.values)];

//   // Create sheet
//   const ws = XLSX.utils.aoa_to_sheet(sheetData);

//   // Merge first row for the title
//   const mergeRef = { s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } };
//   if (!ws["!merges"]) ws["!merges"] = [];
//   ws["!merges"].push(mergeRef);

//   // Style cells
//   const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
//   for (let C = range.s.c; C <= range.e.c; ++C) {
//     const headerCell = ws[XLSX.utils.encode_cell({ r: 1, c: C })];
//     if (headerCell) {
//       headerCell.s = {
//         font: { bold: true, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "4F81BD" } },
//         border: {
//           top: { style: "thin", color: { rgb: "000000" } },
//           bottom: { style: "thin", color: { rgb: "000000" } },
//           left: { style: "thin", color: { rgb: "000000" } },
//           right: { style: "thin", color: { rgb: "000000" } },
//         },
//       };
//     }
//   }

//   // Style title cell
//   const titleCell = ws["A1"];
//   if (titleCell) {
//     titleCell.s = {
//       font: { bold: true, sz: 16 },
//       alignment: { horizontal: "center" },
//     };
//   }

//   XLSX.utils.book_append_sheet(wb, ws, "Table Data");

//   // Save file
//   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
//   const blob = new Blob([wbout], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   window.URL.revokeObjectURL(url);
// }



// import * as XLSX from "xlsx";

// export function downloadExcelTwoSheets(
//   tableHeader: { key: string; label: string }[],
//   tableData: Record<string, any>[],
//   filename = "report.xlsx"
// ) {
//   const normalize = (key: string) => key.toLowerCase().replace(/[-_]/g, "");

//   // Map normalized key to label
//   const headerMap = tableHeader.reduce((map, col) => {
//     map[normalize(col.key)] = col.label;
//     return map;
//   }, {} as Record<string, string>);

//   // Format data according to headers
//   const formattedData = tableData.map((row) => {
//     const newRow: Record<string, any> = {};
//     tableHeader.forEach((col) => {
//       const normalizedKey = normalize(col.key);
//       const matchKey = Object.keys(row).find(
//         (rk) => normalize(rk) === normalizedKey
//       );
//       newRow[headerMap[normalizedKey]] =
//         matchKey && row[matchKey] !== undefined ? row[matchKey] : "";
//     });
//     return newRow;
//   });

//   const wb = XLSX.utils.book_new();

//   // Add extra title row
//   const titleRow = [["Keyword Live Data"]];
//   const headerRow = tableHeader.map((col) => col.label);
//   const sheetData = [...titleRow, headerRow, ...formattedData.map(Object.values)];

//   // Create sheet
//   const ws = XLSX.utils.aoa_to_sheet(sheetData);

//   // Merge first row for the title
//   const mergeRef = { s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } };
//   if (!ws["!merges"]) ws["!merges"] = [];
//   ws["!merges"].push(mergeRef);

//   // Style header cells
//   const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
//   for (let C = range.s.c; C <= range.e.c; ++C) {
//     const headerCell = ws[XLSX.utils.encode_cell({ r: 1, c: C })];
//     if (headerCell) {
//       headerCell.s = {
//         font: { bold: true, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "4F81BD" } }, // Header background color
//         border: {
//           top: { style: "thin", color: { rgb: "000000" } },
//           bottom: { style: "thin", color: { rgb: "000000" } },
//           left: { style: "thin", color: { rgb: "000000" } },
//           right: { style: "thin", color: { rgb: "000000" } },
//         },
//         alignment: { horizontal: "center" }, // Center align header text
//       };
//     }
//   }

//   // Style title cell
//   const titleCell = ws["A1"];
//   if (titleCell) {
//     titleCell.s = {
//       font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } }, // Title font color
//       fill: { fgColor: { rgb: "0070C0" } }, // Title background color
//       alignment: { horizontal: "center" },
//     };
//   }

//   XLSX.utils.book_append_sheet(wb, ws, "Table Data");

//   // Save file
//   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
//   const blob = new Blob([wbout], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   window.URL.revokeObjectURL(url);
// }
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
