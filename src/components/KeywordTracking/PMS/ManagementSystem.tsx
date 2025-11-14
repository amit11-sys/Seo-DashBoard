"use client";

import React, { useEffect, useState } from "react";
import { FaRegCommentDots, FaRegFileAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import MessageForm from "@/components/KeywordTracking/PMS/MessageForm";
import TodoForm from "./ToDoForm";
import { motion } from "framer-motion";

import { RiCalendarTodoLine } from "react-icons/ri";

const items = [
  {
    title: "Message Board",
    icon: <FaRegCommentDots className="text-4xl text-[#FFB900]" />,
    desc: "Post announcements, pitch ideas, and gather feedback.",
    type: "message",
  },
  {
    title: "To Dos",
    icon: <RiCalendarTodoLine className="text-4xl text-[#FFB900]" />,
    desc: "Create tasks, assign work, and track progress easily.",
    type: "todo",
  },
  {
    title: "Docs",
    icon: <FaRegFileAlt className="text-4xl text-[#FFB900]" />,
    desc: "Create tasks, assign work, and track progress easily.",
    type: "docs",
  },
];

export default function ManagementSystem({
  campaignId,
  campignDataWithId,
  templates,
}: any) {
  const [activeType, setActiveType] = useState("");
  const [projctUrl, setProjectUrl] = useState("");

  useEffect(() => {
    if (campignDataWithId?.campaign) {
      setProjectUrl(campignDataWithId?.campaign?.projectUrl);
    }
  }, []);

  function cleanDomain(url: string) {
    if (!url) return "";
    return url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .trim();
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#fafafa] to-[#ffffff] py-12">
      {/* ✅ Title */}
      {activeType === "" && (
        <h1 className="text-3xl font-extrabold text-center mb-12">
          <span className="text-black ">
            {/* {cleanDomain(projctUrl)} */}
            Our Projects
          </span>
        </h1>
      )}

      {/* ✅ Card Grid */}
      {!activeType && (
        <motion.div
          className="grid items-center grid-cols-1 bg-[#20364B] sm:grid-cols-3 gap-8 rounded-3xl   p-5 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {items.map((item) => (
            <motion.div
              key={item.type}
              onClick={() => setActiveType(item.type)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer bg-[#F0F8FF] max-h-[90%] rounded-2xl p-7 text-center shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-gray-200 backdrop-blur-md"
            >
              <div className="flex justify-center  mb-4">
                <motion.div
                  className="bg-[#20364B] p-5 rounded-full"
                  whileHover={{ rotate: 4, scale: 1.1 }}
                >
                  {item.icon}
                </motion.div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ✅ Active Form */}
      {activeType && (
        <>
          <h1 className="text-3xl font-extrabold text-center mb-12">
            <span className="text-black ">{cleanDomain(projctUrl)}</span>
          </h1>
          <motion.div
            className="max-w-full w-full  mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl px-4 font-semibold capitalize">
                Add {activeType}
              </h2>
              <Button
                variant="secondary"
                className="bg-[#20364B] text-white hover:bg-[#324a61] px-12 py-2 rounded-full shadow-sm"
                onClick={() => setActiveType("")}
              >
                Back
              </Button>
            </div>

            {activeType === "message" && (
              <MessageForm campaignId={campaignId} />
            )}

            {activeType === "todo" && (
              <TodoForm campaignId={campaignId} templates={templates} />
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
