import { FaGoogle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaSync } from "react-icons/fa";

export default function SearchConsoleHead() {
  return (
    <div className="flex justify-center flex-col items-center  p-4 bg-white shadow rounded-md">
    
     
       <div className="flex items-center justify-center w-full gap-3">
        <FaGoogle className="text-blue-600 text-4xl" />
        <div>
          <div className="font-bold text-4xl">Search Console</div>
          <div className="text-gray-500 text-sm">
            {/* Last Updated: 2 hours ago (Jun 30, 2025) */}
          </div>
        </div>
        <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
      </div>
      

      
     
    </div>
  );
}
