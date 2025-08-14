"use client";

import React, { ReactNode, useEffect, useState } from "react";
import KeywordEdit from "./KeywordEdit";
import DeleteConfirm from "./KeywordDel";

import { getTrackingData, updateStartDB } from "@/actions/keywordTracking";
import { SearchIcon } from "lucide-react";
import { useLoader } from "@/hooks/useLoader";

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
  intent: string;
  start: string;
  page: string;
  Absolute_Rank: string;
  Group_Rank: string;
  checkUrl: string;
  // oneDay: string;
  sevenDays: string;
  // thirtyDays: string;
  life: string;
  comp: any;
  sv: any;
  date: string;
  rankingUrl: string;
}
interface CustomTableProps {
  tableHeader: TableHeaderitems[];
  tableData: TablebodyItems[];
  campaignId?: string;
  showAddedKeyword?: any;
  setTableBody?: React.Dispatch<React.SetStateAction<TablebodyItems[]>>;
}
const CustomTable = ({
  tableHeader,
  tableData,
  campaignId,
  showAddedKeyword,
  setTableBody,
}: CustomTableProps) => {
  const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
  const { startLoading, stopLoading } = useLoader();
  // console.log(tableData, "table data");
  const [keywordDbData, setkeywordDbData] = useState<any>([]);
  const [defaultData, setDefaultData] = useState<any>([]);
  useEffect(() => {
    const FetchKeyWordsDb = async () => {
      const CampaignId = campaignId;
      try {
        const res = await getTrackingData({ CampaignId });
        // console.log(campaignId)
        const data = res.campaignKeywords;
        setkeywordDbData(data);
      } catch (error) {
        console.log(error, "DB DATA NOT FOUND");
      }
    };
    FetchKeyWordsDb();
  }, []);
  // console.log(keywordDbData, "keyworddb data");
  // const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

  // useEffect(() => {
  //   setTableValues(tableData);
  // }, [tableData]);

  const handleStartClick = (index: number) => {
    setEditableRowIndex(index);
  };

  const handleStartChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    keywordId: string
  ) => {
    const newValue = e.target.value;
    const startValue = Number(newValue);
    const startRespomse = await updateStartDB(keywordId, startValue);
    if (setTableBody) {
      setTableBody((prev) =>
        prev.map((row, rowIndex) =>
          rowIndex === index ? { ...row, start: newValue } : row
        )
      );
    }
  };

  const handleBlur = () => {
    setEditableRowIndex(null);
  };

  const addEditkeywordsData = async (data: any) => {
    console.log(data, "default function");

    // Transform and set default data
    const transformed = data.map((item: any) => ({
      url: item.url || "",
      keywordTag: item.keywordTag || "",
      searchLocationCode: item.searchLocationCode || "",
      volumeLocationCode: item.volumeLocationCode || "",
      language: item.language || "",
      SearchEngine: item.SearchEngine || "",
      serpType: item.serpType || "",
      deviceType: item.deviceType || "",
      keywords: item.keywords,
    }));

    // Example: Set only first one (or you can pass entire array)
    setDefaultData(transformed[0]);
  };
  const handleClick = (spyglassBase: string) => {
    try {
      startLoading();
      // const urlObj = new URL(spyglassBase);
      // console.log(urlObj, "urlOOK");
      console.log(spyglassBase, "spyglass base");
      // urlObj.searchParams.set("highlight", keyword);
      window.open(spyglassBase.toString(), "_blank");
      stopLoading();
    } catch (err) {
      console.error("Invalid URL:", err);
    }
  };

  // const handleHighlightClick = async (url: string) => {
  //   startLoading();
  //   try {
  //     const highlightedHTML = await sethighlightKeyword(url);
  //     // Open in new tab
  //     const blob = new Blob([highlightedHTML], { type: "text/html" });
  //     const newTab = window.open();
  //     if (newTab) {
  //       const blobUrl = URL.createObjectURL(blob); // Create a URL for the blob
  //       newTab.location.href = blobUrl; // Set the new tab's location to the blob URL
  //       newTab.onload = () => {
  //         URL.revokeObjectURL(blobUrl); // Clean up the blob URL after the new tab loads
  //       };
  //     }
  //   } catch (err) {
  //     console.error("Error highlighting keyword:", err);
  //   } finally {
  //     stopLoading(); // Ensure loading state is stopped
  //   }
  // };

  return (
    <div className="w-full shadow-lg text-black rounded-md  max-h-[700px] overflow-x-auto relative">
      <table className="min-w-[1000px] w-full table-auto">
        <thead>
          <tr className="sticky  top-0 bg-gradient-to-r bg-gray-200  text-black">
            {tableHeader.map((header, id) => (
              <th
                key={id}
                className="py-3 px-1 text-center text-sm font-medium"
              >
                <div className="flex  items-center text-sm justify-center gap-1">
                  {header.icon && (
                    <span className="text-sm">{header.icon}</span>
                  )}
                  {header.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.length === 0 ? (
            <tr>
              <td colSpan={15} className="text-center text-gray-500 py-6">
                No keyword data found
              </td>
            </tr>
          ) : (
            tableData.map((data, rowIndex) => {
              const keywordId = data.keywordId;

              const matchedKeywordData = keywordDbData?.find(
                (item: { _id: string }) => item._id === keywordId
              );

              return (
                <tr
                  key={rowIndex}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  {/* <td
                    className="text-center text-[14px] text-wrap min-w-[200px]  border  p-1"
                    title={data.keyword}
                  >
                    {data.keyword}
                  </td> */}

                  <td
                    className="text-center text-[14px] overflow-hidden text-wrap min-w-[200px] border p-1 relative group"
                    title={data.keyword}
                  >
                    {data.keyword}

                    {/* Eye/Search icon animation */}
                    {data?.checkUrl && (
                      <div
                        className="flex justify-center w-full h-full bg-white items-center absolute right-0 top-0 -translate-y-[20px] opacity-0 
                 group-hover:opacity-100 group-hover:translate-y-0
                 transition-all duration-300 ease-out"
                      >
                        <button onClick={() => handleClick(data?.checkUrl)}>
                          <SearchIcon className="text-orange-500" />
                        </button>
                        {/* // </a> */}
                      </div>
                    )}
                  </td>

                  <td className="text-center text-[12px] border  min-w-[50px] p-1">
                    {data.location}
                  </td>
                  <td className="text-center text-[12px] border p-3">
                    {data.intent}
                  </td>

                  <td
                    className="text-center text-[12px] border cursor-pointer p-1"
                    onClick={() => handleStartClick(rowIndex)}
                  >
                    {editableRowIndex === rowIndex ? (
                      <input
                        type="text"
                        value={data.start}
                        onChange={(e) =>
                          handleStartChange(e, rowIndex, keywordId)
                        }
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

                  <td className="text-center text-[12px] border p-1">
                    {data.page}
                  </td>
                  <td className="text-center text-[12px] border p-3">
                    {data.Absolute_Rank}
                  </td>
                  <td className="text-center text-[12px] border p-1">
                    {data.Group_Rank}
                  </td>
                  <td className="text-center text-[12px] border p-1">
                    {data.sevenDays}
                  </td>
                  <td className="text-center text-[12px] border p-1">
                    {data.life}
                  </td>
                  {/* <td className="text-center text-[12px] text-black border p-1">
                    {data.comp}
                  </td> */}
                  {/* <td className="text-center text-[12px] text-black border p-1">
                    {data.sv}
                  </td> */}
                  <td className="text-center text-[12px] border text-nowrap p-1">
                    {data.date}
                  </td>

                  <td className="text-center text-[12px] border p-1">
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

                  <td className="text-center text-[12px] border p-1">
                    <div className="flex justify-center items-center gap-2">
                      <KeywordEdit
                        campaignId={campaignId || ""}
                        keywordId={keywordId}
                        addEditkeywordsData={addEditkeywordsData}
                        showAddedKeyword={showAddedKeyword}
                        setTableBody={setTableBody}
                        defaultData={defaultData}
                      />

                      <DeleteConfirm
                        campaignId={campaignId || ""}
                        keywordId={keywordId}
                        keyword={data.keyword}
                        setTableBody={setTableBody}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
