
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiOutlineKey } from "react-icons/hi";
import { FaTag } from "react-icons/fa";
import { MdOutlineDevices } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { LiaLanguageSolid, LiaSearchLocationSolid } from "react-icons/lia";
import { BsPlus } from "react-icons/bs";
import CustomButton from "../ui/CustomButton";
import { FaLink  } from "react-icons/fa6";
import CustomInput from "../ui/CustomInput";

import { Textarea } from "@/components/ui/textarea";
import DropDownList from "../DropDownList";

const DialogForm = () => {
  return (
    <Dialog >
      <DialogTrigger  className=" bg-gradient-to-r from-[#FE7743] to-[#d65d2d]  text-white px-5 py-4 rounded-full  text-sm font-medium shadow-md transition-all duration-200 transform hover:scale-105 hover:to-[#d65d2d] hover:to-from-[#FE7743] flex items-center ">
      
        Add Keywords
      </DialogTrigger>

      <DialogContent className="max-w-5xl border-none shadow-2xl  bg-white p-6">
        <DialogHeader className="flex items-center  gap-2">
          <HiOutlineKey className="text-2xl text-blue-500" />
          <DialogTitle className="text-2xl text-start font-semibold text-gray-800">
            Add Keywords (0)
          </DialogTitle>
        </DialogHeader>

        <div className="">
          <div className="flex gap-5">
            <div className="flex flex-1 items-center gap-2  px-4 py-1  ">
              <CustomInput
                listName="https://barclayspublicadjusters.com/"
                icon={<FaLink className="text-3xl text-blue-500" />}
              />
              <select className="text-md text-gray-500 bg-transparent">
                <option>Root Domain</option>
                <option>Exact URL</option>
              </select>
            </div>

            <div className="flex flex-1 items-center gap-2  px-4 py-2 ">
              <CustomInput
                listName="Add Keywords tag"
                icon={<FaTag className="text-blue-500" />}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex-1 gap-2">
             
              <div className="flex gap-2 px-4 py-2">
                <button className="px-4 py-2 rounded-full bg-white border text-sm">
                  Florida, USA
                </button>
                
                <button className="px-4 py-2 rounded-full bg-white border text-sm">
                  United States
                </button>
                <button className="p-2 bg-blue-600 rounded-full text-white">
                  <BsPlus />
                </button>
              </div>
            </div>
            <div className=" flex-1 p-4 flex flex-col">
              <Textarea
                rows={10}
                placeholder="📈 Enter one keyword per line"
                className="w-full rounded-2xl  outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2  px-4 py-2 ">
              <DropDownList
                showArrow={true}
                icon={<FcGoogle className="text-blue-500 text-xl" />}
                listName="us (google.com)"
                onChange={(e: any) => console.log(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2  px-4 py-2 ">
           
              <DropDownList
                
                icon={<LiaLanguageSolid className="text-blue-500 text-xl" />}
                listName="Language"
                onChange={(e: any) => console.log(e.target.value)}
              
              />
            </div>

            <div className="flex items-center gap-2  px-4 py-2 ">
              <DropDownList
                      listData={["organic", "paid"]}
                      icon={
                        <LiaSearchLocationSolid className="text-blue-500 text-xl" />
                      }
                      listName="SERP Type"
                      onChange={(e: any) => console.log(e.target.value)}
                    
                    />
            </div>

            <div className="flex items-center gap-2  px-4 py-2 ">
              <DropDownList
                      listData={["desktop", "mobile"]}
                      icon={
                        <MdOutlineDevices className="text-blue-500 text-xl" />
                      }
                      listName="Device Type"
                      onChange={(e: any) => console.log(e.target.value)}
                     
                    />
            </div>
          </div>
        </div>

        <div className="flex justify-start px-4 py-2 ">
         
          <CustomButton  buttonName="Submit" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
