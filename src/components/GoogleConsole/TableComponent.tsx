// import {
//   FaCheckCircle,
//   FaMousePointer,
//   FaEye,
//   FaChartLine,
//   FaMobileAlt,
//   FaFileAlt,
//   FaSearch,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { FaGlobe } from "react-icons/fa6";

// const TableComponent = ({ analyticData, dimension }: any) => {
//   return (
//     <div className="w-full shadow-lg rounded-md mt-4 max-h-96 overflow-y-auto relative">
//       <table className="min-w-[600px] w-full table-fixed">
//         <thead>
//           <tr className="sticky top-0  bg-gray-300 text-black z-0">
//             <th className="px-4 py-2 text-left flex items-center gap-2">
//               {dimension === "Country" && (
//                 <div className=" "><FaGlobe size={16} /></div>
//               )}
//               {dimension === "Device" && (
//                 <div className=" "> <FaMobileAlt size={16} /></div>
//               )}
//               {dimension === "Page" && (
//                 <div className=" "><FaFileAlt size={16} /></div>
//               )}
//               {dimension === "Query" && (
//                 <div className=" "> <FaSearch size={16} /></div>
//               )}
//               {dimension === "Date" && (
//                 <div className=" "> <FaCalendarAlt size={16} /></div>
//               )}

//               {dimension}
//             </th>

//             <th className="px-4 py-2 text-left">
//               <FaMousePointer className="inline mr-1 text-blue-500" /> Clicks
//             </th>
//             <th className="px-4 py-2 text-left">
//               <FaEye className="inline mr-1 text-green-500" /> Impressions
//             </th>
//             <th className="px-4 py-2 text-left">
//               <FaCheckCircle className="inline mr-1 text-purple-505" /> CTR
//             </th>
//             <th className="px-4 py-2 text-left">
//               <FaChartLine className="inline mr-1 text-orange-500" /> Position
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.isArray(analyticData?.analyticData) &&
//             analyticData?.analyticData.map((item: any, index: number) => (
//               <tr key={index} className="hover:bg-indigo-50 transition-colors">
//                 <td className="px-4 py-2 font-medium">{item.keys[0]}</td>
//                 <td className="px-4 py-2">{item?.clicks}</td>
//                 <td className="px-4 py-2">{item?.impressions}</td>
//                 <td className="px-4 py-2">{item?.ctr}</td>
//                 <td className="px-4 py-2">{item?.position}</td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TableComponent;
"use client";
import { use, useEffect, useState } from "react";
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
  analyticData: Row[] | { analyticData?: Row[] } | undefined;
  dimension: "Country" | "Device" | "Page" | "Query" | "Date" | string;
  setPdfTableConsoleData?: React.Dispatch<React.SetStateAction<any>>;
  handleGeneratePDF: any;
};

const TableComponent = ({
  analyticData,
  dimension,
  setPdfTableConsoleData,
  handleGeneratePDF,
}: Props) => {
  // Normalize to an array of rows
  const [loading, setLoading] = useState<boolean>(true);

  const rows: Row[] = Array.isArray(analyticData)
    ? analyticData
    : (analyticData?.analyticData ?? []);
  
  
  
  //   useEffect(() => {
  //   setPdfTableConsoleData(getHtmlconsoleTable());
  // }, [handleGeneratePDF]);



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
    }, 500); // simulate delay
    return () => clearTimeout(timeout);
  }, [dimension, analyticData]);



 const getHtmlconsoleTable = () => {
    return `
    <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f3f3;
          }
          tr:hover {
            background-color: #eef2ff;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>🌍 Country</th>
              <th>🖱️ Clicks</th>
              <th>👁️ Impressions</th>
              <th>✅ CTR</th>
              <th>📈 Position</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map((item) => {
                return `
                  <tr>
                    <td>${item.keys?.[0] ?? "-"}</td>
                    <td>${item.clicks?.toLocaleString?.() ?? 0}</td>
                    <td>${item.impressions?.toLocaleString?.() ?? 0}</td>
                    <td>${(item.ctr * 100).toFixed(2)}%</td>
                    <td>${Number(item.position).toFixed(2)}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
  };





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
              <td className="px-4 py-2 overflow-x-hidden  font-medium">
                {item.keys?.[0] ?? "-"}
              </td>
              <td className="px-4 py-2">
                {item.clicks?.toLocaleString?.() ?? 0}
              </td>
              <td className="px-4 py-2">
                {item.impressions?.toLocaleString?.() ?? 0}
              </td>
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
