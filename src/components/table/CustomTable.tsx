

"use client";
import React, { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface TableHeaderitems {
  key: string;
  label: string;
  icon?: ReactNode;
}
interface TablebodyItems {
  select: boolean;
  keyword: string;
  location: string;
  intent: string;
  start: string;
  page: string;
  rank: string;
  oneDay: string;
  sevenDays: string;
  thirtyDays: string;
  life: string;
  comp: string;
  sv: string;
  date: string;
  rankingUrl: string;
}
interface CustomTableProps {
  tableHeader: TableHeaderitems[];
  tableData: TablebodyItems[];
}

const CustomTable = ({ tableHeader, tableData }: any) => {
  const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
  const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

  const handleStartClick = (index: number) => {
    setEditableRowIndex(index);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    setTableValues((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, start: newValue } : row
      )
    );
  };

  const handleBlur = () => {
    setEditableRowIndex(null);
  };

  return (
    <div className="border border-white border-white/10 rounded-xl p-6 overflow-hidden">
      <Table className="min-w-full">
        <TableHeader className="bg-transparent text-white bg-black">
          <TableRow>
            {tableHeader.map((header:any, id:number) => (
              <TableHead
                key={id}
                className="px-4 text-center py-3 border-e-2 text-sm font-semibold text-gray-700"
              >
                {header.icon}
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableValues.map((data, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <TableCell className="text-center px-4 py-3 border-e-2">
                <Checkbox />
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.keyword}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.location}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.intent}
              </TableCell>

              {/* Editable Start Column */}
              <TableCell
                className="text-center px-4 py-3 border-e-2 cursor-pointer"
                onClick={() => handleStartClick(rowIndex)}
              >
                {editableRowIndex === rowIndex ? (
                  <input
                    type="text"
                    value={data.start}
                    onChange={(e) => handleStartChange(e, rowIndex)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleBlur();
                    }}
                    className="w-10 px-1 text-black focus:border-none border-none text-center"
                    autoFocus
                  />
                ) : (
                  data.start
                )}
              </TableCell>

              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.page}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.rank}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.oneDay}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.sevenDays}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.thirtyDays}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.life}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.comp}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.sv}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.date}
              </TableCell>
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.rankingUrl}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
