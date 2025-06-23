"use client";
import React, { ReactNode } from "react";
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

const CustomTable = ({ tableHeader, tableData }: CustomTableProps) => {
  return (
    <div className="border border-white border-white/10 rounded-xl p-6    overflow-hidden ">
      <Table className="min-w-full ">
        <TableHeader className="bg-transparent text-white bg-black">
          <TableRow className="">
            {tableHeader.map((header, id) => (
              <TableHead
                key={id}
                className="px-4 text-center py-3 border-e-2 text-sm font-semibold text-gray-700"
              >
                {header.icon} {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {tableData.map((data, rowIndex) => (
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
              <TableCell className="text-center px-4 py-3 border-e-2">
                {data.start}
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



