
import {
  FaTag,
  FaFilePdf,
  FaStar,
  FaPowerOff,
  FaTrash,
} from "react-icons/fa";
import { HiOutlineKey } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import { BsPlayCircle } from "react-icons/bs";
import { FcDataSheet } from "react-icons/fc";
import CustomButton from "../ui/CustomButton";
import { Dialog, DialogTrigger } from "../ui/dialog";
import DialogFrom from "../DialogForm/DialogFrom";

export default function LiveKeyTrakingHeader() {
  const iconButtons = [
    { icon: <FaTag />, color: "text-blue-500" },
    { icon: <FaFilePdf />, color: "text-red-400" },
    { icon: <FaStar />, color: "text-yellow-500" },
    { icon: <FcDataSheet />, color: "text-green-600" },
    { icon: <FaPowerOff />, color: "text-purple-500" },
    { icon: <MdEdit />, color: "text-orange-400" },
    { icon: <FaTrash />, color: "text-red-500" },
  ];

  return (
    <div className=" mt-6 flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-xl p-10 gap-4">
      {/* Left Side: Title and Subtitle */}
      <div className="flex items-center gap-4">
        <div className="text-3xl text-orange-500">
          <HiOutlineKey />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Live Keyword Tracking
          </h2>
          <p className="text-sm text-gray-500">
            Last Updated: 1 hour ago (Jun 19, 2025)
          </p>
        </div>
      
      </div>

      {/* Right Side: Action Icons */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
       <DialogFrom/>
       
        {iconButtons.map((item, idx) => (
          <div
            key={idx}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 shadow-sm flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer"
          >
            <span className={`text-xl ${item.color}`}>{item.icon}</span>
          </div>
        ))}
        
      </div>
    </div>
  );
}
