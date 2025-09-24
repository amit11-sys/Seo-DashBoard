
"use client";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaMousePointer,
  FaEye,
  FaChartLine,
  FaMobileAlt,
  FaFileAlt,
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";

type Row = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number; // 0-1
  position: number;
};

type Props = {
  analyticData: any;
  dimension: "Country" | "Device" | "Page" | "Query" | "Date" | string;
  setPdfTableConsoleData?: React.Dispatch<React.SetStateAction<any>>;
  handleGeneratePDF?: any;
};

const TableComponent = ({
  analyticData,
  dimension,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const rows: Row[] = Array.isArray(analyticData?.normalData)
    ? analyticData?.normalData
    : (analyticData?.normalData ?? []);

  const headerIcon = (() => {
    switch (dimension) {
      case "Country":
        return <FaGlobe size={16} />;
      case "Device":
        return <FaMobileAlt size={16} />;
      case "Page":
        return <FaFileAlt size={16} />;
      case "Query":
        return <FaSearch size={16} />;
      case "Date":
        return <FaCalendarAlt size={16} />;
      default:
        return null;
    }
  })();



  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700); // simulate loading
    return () => clearTimeout(timeout);
  }, [dimension, analyticData]);

  if (loading) {
    return (
      <div className="w-full h-60 flex items-center justify-center">
        {/* Tailwind spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="w-full h-40 flex items-center justify-center rounded-md border border-dashed text-gray-500">
        No data
      </div>
    );
  }

 

  return (
    <div className="w-full shadow-lg rounded-md mt-4 max-h-96 overflow-y-auto relative">
      <table className="min-w-[600px] w-full table-fixed">
        <thead>
          <tr className="sticky top-0 bg-gray-300 text-black z-0">
            <th className="px-4 py-2 text-left">
              <div className="flex items-center gap-2">
                {headerIcon}
                <span>{dimension}</span>
              </div>
            </th>
            <th className="px-4 py-2 text-left">
              <FaMousePointer className="inline mr-1 text-blue-500" /> Clicks
            </th>
            <th className="px-4 py-2 text-left">
              <FaEye className="inline mr-1 text-green-500" /> Impressions
            </th>
            <th className="px-4 py-2 text-left">
              <FaCheckCircle className="inline mr-1 text-purple-500" /> CTR
            </th>
            <th className="px-4 py-2 text-left">
              <FaChartLine className="inline mr-1 text-orange-500" /> Position
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <td className="px-4 py-2 overflow-x-hidden font-medium">
                {item.keys?.[0] ?? "-"}
              </td>
              <td className="px-4 py-2">{item.clicks?.toLocaleString?.() ?? 0}</td>
              <td className="px-4 py-2">{item.impressions?.toLocaleString?.() ?? 0}</td>
              <td className="px-4 py-2">{(item.ctr * 100).toFixed(2)}%</td>
              <td className="px-4 py-2">{Number(item.position).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
