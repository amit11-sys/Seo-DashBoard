

"use client";

import React, { useEffect, useState } from "react";
import { FaRegCommentDots, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import MessageForm from "@/components/KeywordTracking/PMS/MessageForm";
import TodoForm from "./ToDoForm";
import { motion } from "framer-motion";

const items = [
  {
    title: "Message Board",
    icon: <FaRegCommentDots className="text-4xl text-blue-500" />,
    desc: "Post announcements, pitch ideas, and gather feedback.",
    type: "message",
  },
  {
    title: "To Dos",
    icon: <FaCheckCircle className="text-4xl text-green-500" />,
    desc: "Create tasks, assign work, and track progress easily.",
    type: "todo",
  },
];

export default function ManagementSystem({ campaignId, campignDataWithId }: any) {
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
      <h1 className="text-3xl font-extrabold text-center mb-12">
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          {cleanDomain(projctUrl)}
        </span>
      </h1>

      {/* ✅ Card Grid */}
      {!activeType && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          {items.map((item) => (
            <motion.div
              key={item.type}
              onClick={() => setActiveType(item.type)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer bg-white rounded-2xl p-7 text-center shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-gray-200 backdrop-blur-md"
            >
              <div className="flex justify-center mb-4">
                <motion.div whileHover={{ rotate: 4, scale: 1.1 }}>
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
        <motion.div
          className="max-w-3xl mx-auto w-full px-6 mt-6"
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold capitalize">
              Add {activeType}
            </h2>
            <Button 
              variant="secondary"
              className="rounded-full shadow-sm"
              onClick={() => setActiveType("")}
            >
              Back
            </Button>
          </div>

          {activeType === "message" && (
            <MessageForm campaignId={campaignId} />
          )}

          {activeType === "todo" && (
            <TodoForm campaignId={campaignId} />
          )}
        </motion.div>
      )}
    </div>
  );
}
