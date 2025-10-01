"use client";

import React, { ReactNode, useEffect, useState } from "react";
import KeywordEdit from "./KeywordEdit";
import DeleteConfirm from "./KeywordDel";
import { TiArrowUp,TiArrowDown  } from "react-icons/ti";

import {
  getDbLiveKeywordData,
  getDbLiveKeywordDataWithSatusCode,
  getTrackingData,
  updateStartDB,
} from "@/actions/keywordTracking";
import { SearchIcon } from "lucide-react";
import { useLoader } from "@/hooks/useLoader";
import { Button } from "@/components/ui/button";
import { LuArrowUpDown, LuDelete } from "react-icons/lu";
import { FaCopy, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/Skeleton/TableSkeleton";
import SingleKeywordRefresh from "../SingleKeywordRefresh";
import { RiRefreshFill } from "react-icons/ri";
import { IoRefreshCircle } from "react-icons/io5";
import { MdDelete, MdDeleteSweep } from "react-icons/md";
import { deleteKeywordData } from "@/actions/keyword";
import { Checkbox } from "@/components/ui/checkbox";
import { getGetCampaignByid } from "@/actions/campaign";
import BulkDeleteDialog from "./KeywordDeleteDialog";

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
  sevenDays: number;
  changeDirection: string;
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
  // isLoading?: boolean;
  showAddedKeyword?: any;
  setTableBody?: React.Dispatch<React.SetStateAction<TablebodyItems[]>>;
  setSortedDataForExel?: any;
  sortedDataExel?: any;
  setExelData?: (data: any) => void;
  fetchCardDatafilterLocation?: any;
  filterCampaignLiveKeywordsData?: any;
  ShareCampaignStatus?: any;
  // setCampaignLiveKeywordsData ?: any
  updatedTopRankOnAddedKeyword?: any;
  keywordTableData?: any;
  setCardData?: any;
  CardSetOnChanges?: any;
  setFilterCampaignLiveKeywordsData?: any;
  locationFilter: string;
  setLocationFilter: React.Dispatch<React.SetStateAction<string>>;
  getKeywordData: () => void;
}

const CustomTable = ({
  setExelData,
  // CardSetOnChanges,
  tableHeader,
  // setCardData,
  setFilterCampaignLiveKeywordsData,
  // setCampaignLiveKeywordsData,
  // updatedTopRankOnAddedKeyword,
  ShareCampaignStatus,
  // keywordTableData,
  tableData,
  campaignId,
  showAddedKeyword,
  setTableBody,
  filterCampaignLiveKeywordsData,
  // fetchCardDatafilterLocation,
  locationFilter,
  setLocationFilter,
  getKeywordData,
}: CustomTableProps) => {
  const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
  const { startLoading, stopLoading } = useLoader();
  // const [keywordDbData, setkeywordDbData] = useState<any>([]);
  const [defaultData, setDefaultData] = useState<any>([]);

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const [selectAll, setSelectAll] = useState(false);
  // ✅ Sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<TablebodyItems[]>([]);

  const [excludeZero, setExcludeZero] = useState<boolean>(false); // 👈 new toggle
  // sortMode can be: "normal" | "asc_all" | "desc_all" | "asc_nozero" | "desc_nozero"
  // const [sortMode, setSortMode] = useState<
  //   "normal" | "asc_all" | "desc_all" | "asc_nozero" | "desc_nozero"
  // >("normal");
  // console.log(tableData, "tableDataNew");
  // console.log(filterCampaignLiveKeywordsData, "filterCampaignLiveKeywordsData");
  const uniqueLocations = Array.from(
    new Set(filterCampaignLiveKeywordsData?.map((row: any) => row.location))
  );

  useEffect(() => {
    setSortedData(tableData);
  }, [tableData]);
  // const handleSort = () => {
  //   const sorted = [...sortedData].sort((a, b) => {
  //     const valA = Number(a.Group_Rank) || 0;
  //     const valB = Number(b.Group_Rank) || 0;
  //     return sortOrder === "asc" ? valA - valB : valB - valA;
  //   });
  //   setSortedData(sorted);
  //   if (setExelData) {
  //     setExelData(sorted);
  //   }
  //   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  // };

  useEffect(() => {
    let data = [...tableData];

    if (locationFilter !== "all") {
      data = data.filter((row) => row.location === locationFilter);
    }

    if (excludeZero) {
      data = data.filter((row) => Number(row.Group_Rank) > 0);
    }

    if (sortOrder) {
      data = data.sort((a, b) => {
        const valA = Number(a.Group_Rank) || 0;
        const valB = Number(b.Group_Rank) || 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      });
    }

    setSortedData(data);

    if (setExelData) {
      setExelData(data);
    }
  }, [tableData, sortOrder, excludeZero]);
  // useEffect(() => {
  //   if (locationFilter) {
  //     fetchCardDatafilterLocation(locationFilter);
  //   }
  // }, [locationFilter]);

  // console.log(locationFilter, "location filter");

  // useEffect(() => {
  //   const FetchKeyWordsDb = async () => {
  //     const CampaignId = campaignId;
  //     try {
  //       const res = await getTrackingData({ CampaignId });
  //       // console.log(campaignId)
  //       const data = res.campaignKeywords;
  //       setkeywordDbData(data);
  //     } catch (error) {
  //       console.log(error, "DB DATA NOT FOUND");
  //     }
  //   };
  //   FetchKeyWordsDb();
  // }, []);

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
    // console.log(data, "default function");

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
  const handleSpyGlass = (spyglassBase: string) => {
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
  const handleCopy = (keyword: string) => {
    navigator.clipboard
      .writeText(keyword)
      .then(() => {
        toast("keyword copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
      });
  };
  //   const handleBulkDelete = () => {
  //     console.log("delete")
  //   // setTableBody((prev) => prev.filter((row) => !selectedKeywords.includes(row.keywordId)));

  // };
  const handleBulkDelete = async (
    selectedKeywords: string[],
    campaignId: string
  ) => {
    // console.log(selectedKeywords, "selectedKeywords");
    try {
      const res = await deleteKeywordData(selectedKeywords);
      if (res.success) {
        toast.success("Keyword(s) deleted successfully");
        getKeywordData();
      } else {
        toast.error(res.error || "Failed to delete keyword");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
      console.error(err);
    }
  };

  // const handleBulkRefresh = () => {
  //   // call your API for each selected keywordId
  //   // selectedKeywords.forEach((id) => {
  //   //   // refreshKeywordApi(campaignId, id);
  //   // });
  //   console.log("refresh");
  //   setSelectedKeywords([]);
  //   setSelectAll(false);
  // };

  return (
    <div className="w-full shadow-lg text-black rounded-md max-h-[700px] overflow-x-auto relative">
      {/* {tableData.length === 0 ? <TableSkeleton/> : (  */}
      <div className="flex gap-3 mb-3">
        <BulkDeleteDialog
          selectedKeywords={selectedKeywords}
          campaignId={campaignId || ""}
          handleBulkDelete={handleBulkDelete}
        />

        {/* <button
    disabled={selectedKeywords.length === 0}
    onClick={handleBulkRefresh}
    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
  >
    Refresh Selected
  </button> */}
      </div>

      <table className="min-w-[1000px] w-full table-auto">
        <thead>
          <tr className="sticky top-0 bg-gradient-to-r bg-gray-200 text-black">
            {tableHeader.map((header, id) => {
              // skip select and edit headers if ShareCampaignStatus === 2
              if (
                (header.key === "select" || header.key === "edit") &&
                ShareCampaignStatus === 2
              ) {
                return null;
              }

              return (
                <th
                  key={id}
                  className="py-3 px-1 text-center text-sm font-medium"
                >
                  <div className="flex items-center text-sm justify-center gap-1">
                    {header.icon && (
                      <span className="text-sm">{header.icon}</span>
                    )}
                    {header.label}

                    {/* Group_Rank sorting button */}
                    {header.key === "Group_Rank" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                        >
                          <LuArrowUpDown className="h-4 w-4" />
                        </Button>

                        <Button
                          variant={excludeZero ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setExcludeZero(!excludeZero)}
                        >
                          {excludeZero ? (
                            <FaRegEyeSlash title="Show Zero" />
                          ) : (
                            <FaRegEye title="Hide Zero" />
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Select All checkbox */}
                    {header.key === "select" && (
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={(checked) => {
                          setSelectAll(!!checked);
                          if (checked) {
                            setSelectedKeywords(
                              sortedData.map((d) => d.keywordId)
                            );
                          } else {
                            setSelectedKeywords([]);
                          }
                        }}
                        className="data-[state=checked]:bg-orange-500 
                  data-[state=checked]:border-orange-500 
                  data-[state=checked]:text-white"
                      />
                    )}

                    {/* Location filter */}
                    {header.key === "location" && (
                      <select
                        className="ml-2 border-none rounded px-1 py-2 w-28 text-xs"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      >
                        <option value="all">All</option>
                        {uniqueLocations.map((loc: any) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={15} className="text-center text-gray-500 py-6">
                No keyword data found
              </td>
            </tr>
          ) : (
            sortedData.map((data, rowIndex) => {
              const keywordId = data.keywordId;
              // const matchedKeywordData = keywordDbData?.find(
              //   (item: { _id: string }) => item._id === keywordId
              // );

              return (
                <tr
                  key={rowIndex}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  {/* Checkbox column (hidden if ShareCampaignStatus === 2) */}
                  {ShareCampaignStatus !== 2 && (
                    <td className="text-center border p-1">
                      <Checkbox
                        className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 
                  data-[state=checked]:text-white"
                        checked={selectedKeywords.includes(data.keywordId)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedKeywords((prev) => [
                              ...prev,
                              data.keywordId,
                            ]);
                          } else {
                            setSelectedKeywords((prev) =>
                              prev.filter((id) => id !== data.keywordId)
                            );
                          }
                        }}
                      />
                    </td>
                  )}

                  {/* Keyword column */}
                  <td
                    className="text-center text-[14px] overflow-hidden text-wrap min-w-[200px] border p-1 relative group"
                    title={data.keyword}
                  >
                    {data.keyword}
                    {/* Hover actions */}
                    <div
                      className="flex gap-5 justify-center w-full h-full bg-white items-center absolute right-0 top-0 -translate-y-[20px] opacity-0 
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-300 ease-out"
                    >
                      <button onClick={() => handleSpyGlass(data?.checkUrl)}>
                        <BsSearch
                          title="Go To"
                          className="text-orange-500 text-xl"
                        />
                      </button>
                      <button onClick={() => handleCopy(data?.keyword)}>
                        <FaCopy
                          title="Copy"
                          className="text-blue-400 text-xl"
                        />
                      </button>
                    </div>
                  </td>

                  <td className="text-center text-[12px] border  min-w-[50px] p-1">
                    {data.location}
                  </td>
                  <td className="text-center text-[12px] border p-3">
                    <span
                      className="px-2 py-1 rounded text-white text-xs cursor-default"
                      title={data?.intent} // hover shows full string
                      style={{
                        backgroundColor: (() => {
                          if (!data?.intent) return "#999"; // default gray
                          const firstLetter = data.intent[0].toLowerCase(); // first letter only
                          switch (firstLetter) {
                            case "c": // commercial
                              return "#f97510"; // orange
                            case "i": // informational
                              return "#3b82f6"; // blue
                            case "n": // navigational
                              return "#10b981"; // green
                            case "t": // transactional
                              return "#ef4444"; // red
                            default:
                              return "#fff"; // white
                          }
                        })(),
                      }}
                    >
                      {data?.intent ? data.intent[0].toUpperCase() : "-"}
                    </span>
                  </td>

                  {/* Editable start column */}
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
                    {data?.sevenDays === 0 && "-"}

                    {/* ✅ if improved */}
                    {data.changeDirection === "up" && (
                      <span className="inline-flex items-center ml-1 text-green-500 text-[15px]">
                        {data.sevenDays}
                        <TiArrowUp className="ml-0.5" />
                      </span>
                    )}

                    {/* ✅ if dropped */}
                    {data.changeDirection === "down" && (
                      <span className="inline-flex items-center ml-1 text-red-500 text-[15px]">
                        {data.sevenDays}
                        <TiArrowDown className="ml-0.5" />
                      </span>
                    )}
                  </td>
                  <td className="text-center text-[12px] border p-1">
                    {data.life}
                  </td>
                  <td className="text-center text-[12px] border text-nowrap p-1">
                    {data.date}
                  </td>

                  <td className="text-center max-w-[150px] text-[12px] border p-1">
                    <div className="flex justify-center items-center">
                      {data.rankingUrl === "no ranking" ? (
                        <span className="text-black">__</span>
                      ) : (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate block max-w-[140px]"
                          href={data.rankingUrl}
                          title={data.rankingUrl} // full URL on hover
                        >
                          {data.rankingUrl}
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Edit/Action column (hidden if ShareCampaignStatus === 2) */}
                  {ShareCampaignStatus !== 2 && (
                    <td className="text-center text-[12px] border p-1">
                      <div className="flex justify-center items-center gap-2">
                        <KeywordEdit
                          // CardSetOnChanges={CardSetOnChanges}
                          campaignId={campaignId || ""}
                          keywordId={keywordId}
                          addEditkeywordsData={addEditkeywordsData}
                          // showAddedKeyword={showAddedKeyword}
                          setTableBody={setTableBody}
                          defaultData={defaultData}
                          getKeywordData={getKeywordData}
                        />

                        <SingleKeywordRefresh
                          // CardSetOnChanges={CardSetOnChanges}
                          campaignId={campaignId || ""}
                          keywordId={keywordId}
                          keyword={data.keyword}
                          setTableBody={setTableBody}
                          getKeywordData={getKeywordData}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* )}  */}
    </div>
  );
};

export default CustomTable;
