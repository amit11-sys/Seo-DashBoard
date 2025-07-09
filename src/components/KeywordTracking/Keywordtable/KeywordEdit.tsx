import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiOutlineKey } from "react-icons/hi";
import { FaEdit, FaTag } from "react-icons/fa";
import { MdOutlineDevices } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { LiaLanguageSolid, LiaSearchLocationSolid } from "react-icons/lia";
import { BsPlus } from "react-icons/bs";
import CustomButton from "../../ui/CustomButton";
import { FaLink } from "react-icons/fa6";
import CustomInput from "../../ui/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import DropDownList from "../../DropDownList";

const KeywordEdit = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <FaEdit className="text-xl me-4   text-green-500 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="max-w-md md:max-w-xl border-none shadow-2xl bg-white p-6 rounded-2xl">
        <DialogHeader className="flex items-center gap-2 mb-4">
          <HiOutlineKey className="text-2xl text-orange-500" />
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Keywords
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-1 items-center gap-2 px-3 py-2 border rounded-lg">
              <FaLink className="text-blue-500 text-xl" />
              <input
                type="text"
                defaultValue="https://barclayspublicadjusters.com/"
                className="flex-1 text-sm outline-none"
              />
              <select className="text-sm text-gray-600 bg-transparent outline-none">
                <option>Root Domain</option>
                <option>Exact URL</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1 rounded-full border text-sm">Florida, USA</button>
            <button className="px-3 py-1 rounded-full border text-sm">United States</button>
            <button className="p-2 bg-blue-600 rounded-full text-white">
              <BsPlus />
            </button>
          </div>

          <Textarea
            rows={4}
            placeholder="📈 Enter one keyword per line"
            className="w-full rounded-lg border outline-none text-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DropDownList
              showArrow
              icon={<FcGoogle className="text-xl" />}
              listName="us (google.com)"
            //   onChange={(e) => console.log(e.target.value)}
            />

            <DropDownList
              icon={<LiaLanguageSolid className="text-xl" />}
              listName="English"
            //   onChange={(e) => console.log(e.target.value)}
            />

            <DropDownList
              listData={["Local + Organic", "Paid"]}
              icon={<LiaSearchLocationSolid className="text-xl" />}
              listName="Local + Organic"
            //   onChange={(e) => console.log(e.target.value)}
            />

            <DropDownList
              listData={["Desktop", "Mobile"]}
              icon={<MdOutlineDevices className="text-xl" />}
              listName="Desktop"
            //   onChange={(e) => console.log(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <CustomButton onClick={()=>console.log("change")} buttonName="Submit" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordEdit;
