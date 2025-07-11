"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { BsGlobe } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import KeywordEdit from "./KeywordEdit";
import DeleteConfirm from "./KeywordDel";

interface TableHeaderitems {
  key: string;
  label: string;
  icon?: ReactNode;
}
interface TablebodyItems {
  keyword: string;
  keywordId: string;
  status: number;
  location: string;
  // intent: string;
  start: string;
  page: string;
  Absolute_Rank: string;
  Group_Rank: string;
  // oneDay: string;
  sevenDays: string;
  // thirtyDays: string;
  life: string;
  // comp: string;
  // sv: string;
  date: string;
  rankingUrl: string;
}
interface CustomTableProps {
  tableHeader: TableHeaderitems[];
  tableData: TablebodyItems[];
  campaignId: string;
  showAddedKeyword: any;
  setTableBody: React.Dispatch<React.SetStateAction<TablebodyItems[]>>;
}
const CustomTable = ({
  tableHeader,
  tableData,
  campaignId,
  showAddedKeyword,
  setTableBody,
}: CustomTableProps) => {
  const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
  // const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

  // useEffect(() => {
  //   setTableValues(tableData);
  // }, [tableData]);

  const handleStartClick = (index: number) => {
    setEditableRowIndex(index);
  };

  const handleStartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    setTableBody((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, start: newValue } : row
      )
    );
  };

  const handleBlur = () => {
    setEditableRowIndex(null);
  };

  return (
    <div className="w-full shadow-lg text-black rounded-md mt-4 max-h-96 overflow-x-auto relative">
      <table className="min-w-[1000px] w-full table-auto">
        <thead>
          <tr className="sticky top-0 bg-gradient-to-r bg-gray-300 text-black">
            {tableHeader.map((header, id) => (
              <th
                key={id}
                className="px-4 py-2 text-center text-sm font-medium"
              >
                <div className="flex items-center justify-center gap-1">
                  {header.icon && (
                    <span className="text-xl">{header.icon}</span>
                  )}
                  {header.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((data, rowIndex) => {
            // console.log(data,"inside loop data table")
            const keywordId = data.keywordId;
            return (
              <tr
                key={rowIndex}
                className="hover:bg-indigo-50 transition-colors"
              >
                <td className="text-center border font-medium p-3">
                  {data.keyword}
                </td>
                <td className="text-center border p-3">{data.location}</td>
                {/* <td className="text-center border p-3">{data.intent}</td> */}

                <td
                  className="text-center border cursor-pointer p-3"
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
                      className="w-14 px-2 text-black text-center rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <span className="font-semibold text-indigo-600">
                      {data.start}
                    </span>
                  )}
                </td>

                <td className="text-center border p-3">{data.page}</td>
                <td className="text-center border p-3">{data.Absolute_Rank}</td>
                <td className="text-center border p-3">{data.Group_Rank}</td>
                {/* <td className="text-center border p-3">{data.oneDay}</td> */}
                <td className="text-center border p-3">{data.sevenDays}</td>
                {/* <td className="text-center border p-3">{data.thirtyDays}</td> */}
                <td className="text-center border p-3">{data.life}</td>
                {/* <td className="text-center border p-3">{data.comp}</td> */}
                {/* <td className="text-center border p-3">{data.sv}</td> */}
                <td className="text-center border p-3">{data.date}</td>
                <td className="text-center border p-3">
                  <div className="flex justify-center items-center">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      href={data.rankingUrl}
                    >
                      View
                    </a>
                  </div>
                </td>
                <td className="text-center border p-3">
                  <div className="flex justify-center items-center gap-2">
                    <KeywordEdit
                      campaignId={campaignId}
                      keywordId={keywordId}
                      showAddedKeyword={showAddedKeyword}
                      setTableBody={setTableBody}
                      defaultData={{
                        url: data.rankingUrl,
                        keywordTag: "",
                        searchLocation: data.location,
                        volumeLocation: "",
                        language: "English",
                        SearchEngine: "US (google.com)",
                        serpType: "organic",
                        deviceType: "desktop",
                        keywords: [data.keyword],
                      }}
                    />
                    <DeleteConfirm
                      campaignId={campaignId}
                      keywordId={keywordId}
                      keyword={data.keyword}
                      setTableBody={setTableBody}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
