// "use client";

// import React, { useEffect, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { FaRegCommentDots, FaCheckCircle, FaRegFileAlt } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
// import MessageForm from "@/components/KeywordTracking/PMS/MessageForm"

// const items = [
//   {
//     title: "Message Board",
//     icon: <FaRegCommentDots className="text-4xl text-blue-600" />,
//     desc: "Post announcements, pitch ideas, and gather feedback while keeping discussions organized and on-topic.",
//     type: "message"
//   },
//   {
//     title: "To Dos",
//     icon: <FaCheckCircle className="text-4xl text-green-600" />,
//     desc: "Create tasks, assign work, and track progress easily with clear lists & workflows.",
//     type: "todo"
//   },
// //   {
// //     title: "Docs & Files",
// //     icon: <FaRegFileAlt className="text-4xl text-yellow-500" />,
// //     desc: "A centralized place to organize and share docs, spreadsheets, images, and other files.",
// //     type: "files"
// //   }
// ];

// export default function ManagementSystem({campaignId,campignDataWithId}:{campaignId:string,campignDataWithId:any}) {
//   const [open, setOpen] = useState(false);
//   const [activeType, setActiveType] = useState("");
//   const [projctUrl,setProjectUrl] = useState("")
//   console.log(campignDataWithId,"hi data")

//   const handleOpen = (type: string) => {
//     setActiveType(type);
//     setOpen(true);
//   };
 
//   useEffect(() => {
//     if (campignDataWithId?.campaign) {
//       setProjectUrl(campignDataWithId?.campaign?.projectUrl);
//     }
//   }, []);
//   const fetchData = () =>{


//   }
//   function cleanDomain(url: string) {
//   if (!url) return "";

//   return url
//     .replace(/^https?:\/\//, "") // remove http or https
//     .replace(/^www\./, "")       // remove www.
//     .split("/")[0]               // remove path after domain
//     .trim();
// }


//   return (
//    <div className="w-full py-12 bg-white">
//   {/* ✅ Centered, Attractive Heading */}
//   <h1 className="text-xl font-extrabold text-center bg-gradient-to-r from-orange-100 to-orange-600 bg-clip-text text-transparent mb-10 tracking-wide drop-shadow-sm">
//     {cleanDomain(projctUrl)}
//   </h1>

//   {/* ✅ Grid */}
//   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-5">

//     {items.map((item) => (
//       <div
//         key={item.type}
//         onClick={() => handleOpen(item.type)}
//         className="cursor-pointer bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition border hover:border-gray-300"
//       >
//         <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
//         <div className="flex justify-center mb-3 text-4xl">{item.icon}</div>
//         <p className="text-sm text-gray-600">{item.desc}</p>
//       </div>
//     ))}

//   </div>

  
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="bg-white  w-full h-screen">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold capitalize">
//               Add {activeType === "message" && "Message"}
//               {activeType === "todo" && "To-Do"}
//               {activeType === "files" && "File"}
//             </DialogTitle>
//           </DialogHeader>

//           {/* --- Form Here --- */}
//           <div className="mt-2 space-y-3">

//             {
//               activeType === "message" && (
//                <MessageForm/>
//               )
//             }
//             <input
//               className="w-full border p-2 rounded-md"
//               placeholder={
//                 activeType === "message"
//                   ? "Enter message title"
//                   : activeType === "todo"
//                   ? "Enter task name"
//                   : "Upload file link / name"
//               }
//             />

//             <textarea
//               className="w-full border p-2 rounded-md"
//               rows={3}
//               placeholder="Write details…"
//             ></textarea>

//             <Button className="w-full">Add</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
// </div>


//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import { FaRegCommentDots, FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import MessageForm from "@/components/KeywordTracking/PMS/MessageForm";
import Link from "next/link";
import TodoForm from "./ToDoForm";

const items = [
  {
    title: "Message Board",
    icon: <FaRegCommentDots className="text-4xl text-blue-600" />,
    desc: "Post announcements, pitch ideas, and gather feedback.",
    type: "message",
  },
  {
    title: "To Dos",
    icon: <FaCheckCircle className="text-4xl text-green-600" />,
    desc: "Create tasks, assign work, and track progress easily.",
    type: "todo",
  }
];

export default function ManagementSystem({ campaignId, campignDataWithId }:any) {
  const [activeType, setActiveType] = useState("");
  const [projctUrl, setProjectUrl] = useState("");

  useEffect(() => {
    if (campignDataWithId?.campaign) {
      setProjectUrl(campignDataWithId?.campaign?.projectUrl);
    }
  }, []);

  function cleanDomain(url:string) {
    if (!url) return "";
    return url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .trim();
  }

  return (
    <div className="w-full py-10 bg-white">

     

      {/* ✅ Centered Title */}
      <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-orange-300 to-orange-600 bg-clip-text text-transparent mb-10">
        {cleanDomain(projctUrl)}
      </h1>

      {/* ✅ Grid Select */}
      {!activeType && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto w-full px-5">
          {items.map((item) => (
            <div
              key={item.type}
              onClick={() => setActiveType(item.type)}
              className="cursor-pointer bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition border hover:border-gray-300"
            >
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <div className="flex justify-center mb-3 text-4xl">{item.icon}</div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Render Form on Page */}
      {activeType && (
        <div className="max-w-3xl mx-auto w-full px-5 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold capitalize">Add {activeType}</h2>
            <Button variant="outline" className="rounded-full" onClick={() => setActiveType("")}>Back</Button>
          </div>

          {activeType === "message" && <MessageForm campaignId={campaignId} />}

          {activeType === "todo" && (
            <>
            <TodoForm campaignId={campaignId}/>
            </>
          )}
        </div>
      )}
    </div>
  );
}
