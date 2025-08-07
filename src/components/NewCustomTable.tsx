"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableHeaderItem {
  key: string;
  label: string;
  // icon?: React.ReactNode; // Uncomment if needed later
}

interface CustomTableProps {
  tableHeader: TableHeaderItem[];
  tableData: any;
  campaignStatus: number;
}

const NewCustomTable: React.FC<CustomTableProps> = ({
  tableHeader,
  tableData,
  campaignStatus,
}) => {
  return (
    <div className="border border-white  rounded-xl p-6 overflow-hidden">
      <Table className="min-w-full">
        <TableHeader className="bg-transparent text-white ">
          <TableRow>
            {tableHeader.map((header) => (
              <TableHead
                key={header.key}
                className="px-4 text-center py-3 border-e-2 text-sm font-semibold text-gray-700"
              >
                {/* {header.icon} */}
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableHeader.length}
                className="text-center py-4"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            tableData.map((row: any, rowIndex: number) => (
              <TableRow
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {tableHeader.map((header) => (
                  <TableCell
                    key={header.key}
                    className="text-center px-4 py-3 border-e-2"
                  >
                    {row[header.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NewCustomTable;
