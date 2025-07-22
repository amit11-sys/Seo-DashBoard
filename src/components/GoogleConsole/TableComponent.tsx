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

const TableComponent = ({ analyticData, dimension }: any) => {
  return (
    <div className="w-full shadow-lg rounded-md mt-4 max-h-96 overflow-y-auto relative">
      <table className="min-w-[600px] w-full table-fixed">
        <thead>
          <tr className="sticky top-0  bg-gray-300 text-black z-0">
            <th className="px-4 py-2 text-left flex items-center gap-2">
              {dimension === "Country" && (
                <div className=" "><FaGlobe size={16} /></div>
              )}
              {dimension === "Device" && (
                <div className=" "> <FaMobileAlt size={16} /></div>
              )}
              {dimension === "Page" && (
                <div className=" "><FaFileAlt size={16} /></div>
              )}
              {dimension === "Query" && (
                <div className=" "> <FaSearch size={16} /></div>
              )}
              {dimension === "Date" && (
                <div className=" "> <FaCalendarAlt size={16} /></div>
              )}

              {dimension}
            </th>

            <th className="px-4 py-2 text-left">
              <FaMousePointer className="inline mr-1 text-blue-500" /> Clicks
            </th>
            <th className="px-4 py-2 text-left">
              <FaEye className="inline mr-1 text-green-500" /> Impressions
            </th>
            <th className="px-4 py-2 text-left">
              <FaCheckCircle className="inline mr-1 text-purple-505" /> CTR
            </th>
            <th className="px-4 py-2 text-left">
              <FaChartLine className="inline mr-1 text-orange-500" /> Position
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(analyticData?.analyticData) &&
            analyticData?.analyticData.map((item: any, index: number) => (
              <tr key={index} className="hover:bg-indigo-50 transition-colors">
                <td className="px-4 py-2 font-medium">{item.keys[0]}</td>
                <td className="px-4 py-2">{item?.clicks}</td>
                <td className="px-4 py-2">{item?.impressions}</td>
                <td className="px-4 py-2">{item?.ctr}</td>
                <td className="px-4 py-2">{item?.position}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
