// import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";

// export default function MessageForm() {
//   const messages = [
//     {
//       id: 1,
//       title: "Welcome to the project!",
//       desc: "Kickoff meeting scheduled for Monday. Please review the docs before joining.",
//       author: "Admin",
//       time: "2 days ago",
//     },
//     {
//       id: 2,
//       title: "Design update available",
//       desc: "New UI files uploaded in the design folder. Check and give feedback.",
//       author: "UI Team",
//       time: "5 hrs ago",
//     },
//     {
//       id: 3,
//       title: "Client Feedback",
//       desc: "Client reviewed the first demo. Minor changes required in dashboard section.",
//       author: "Project Manager",
//       time: "1 hr ago",
//     },
//   ];

//   const hasMessages = messages.length > 0;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border p-6 w-full max-w-5xl mx-auto mt-8">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6 relative">
//         <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 text-sm">
//           + New Message
//         </Button>

//         <h1 className="text-2xl font-semibold absolute left-1/2 -translate-x-1/2">
//           Message Board
//         </h1>

//         <button className="border rounded-full px-4 py-2 text-sm flex items-center gap-1 text-gray-700">
//           All messages <ChevronDown size={16} />
//         </button>
//       </div>

//       <hr />

//       {!hasMessages && (
//         <div className="flex flex-col items-center justify-center mt-10 border border-yellow-300/50 bg-yellow-50 rounded-md p-6 text-center">
//           <div className="text-4xl mb-2">📄</div>
//           <h3 className="font-medium text-gray-800">No messages just yet</h3>
//           <p className="text-gray-600 text-sm mt-1 max-w-md">
//             Post announcements, pitch ideas, and gather feedback while keeping discussions organized and on-topic.
//           </p>
//         </div>
//       )}

//       {hasMessages && (
//         <div className="mt-6 space-y-4">
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer shadow-sm"
//             >
//               <h3 className="text-lg font-semibold text-gray-800">{msg.title}</h3>
//               <p className="text-gray-600 text-sm mt-1">{msg.desc}</p>
//               <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
//                 <span>👤 {msg.author}</span>
//                 <span>⏱ {msg.time}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import {
  fetchMessages,
  getAndSaveMessage,
  getdeleteMsg,
  getdeleteSubTodos,
} from "@/actions/managementSystem";
import DOMPurify from "dompurify";
import { LuDelete, LuLoader } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

interface Message {
  msgTitle: string;
  msgDescription: string;
  _id: string;
}
function SafeHTML({ html }: { html: string }) {
  const cleanHTML = DOMPurify.sanitize(html);

  return (
    <div
      className="prose prose-sm max-w-none text-xs mt-1 text-gray-500"
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
}

export default function MessageForm({ campaignId }: { campaignId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    // { id: 1, title: "Welcome to the project!", desc: "Kickoff meeting scheduled for Monday. Please review the docs before joining.", author: "Admin", time: "2 days ago" },
    // { id: 2, title: "Design update available", desc: "New UI files uploaded in the design folder. Check and give feedback.", author: "UI Team", time: "5 hrs ago" },
    // { id: 3, title: "Client Feedback", desc: "Client reviewed the first demo. Minor changes required in dashboard section.", author: "Project Manager", time: "1 hr ago" },
  ]);

  const [openMsg, setOpenMsg] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const handleOpenMsg = (msg: Message) => {
    setSelectedMsg(msg);
    setOpenMsg(true);
  };
  const fetchMsgs = async () => {
    setMessagesLoading(true);
    try {
      const response = await fetchMessages(campaignId);

      setMessages(response?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }finally{
      setMessagesLoading(false);
    }
  };
  useEffect(() => {
    fetchMsgs();
  }, []);

  // const handleAddMessage = (newMsg: {
  //   msgTitle: string;
  //   msgDescription: string;
  // }) => {
  //   console.log("run func", newMsg);
  //   const msg = {
  //     // id: messages.length + 1,
  //     msgTitle: newMsg.msgTitle,
  //     msgDescription: newMsg.msgDescription,
  //     // author: "You",
  //     // time: "Just now",
  //   };

  //   setMessages([msg, ...messages]);
  //   setShowAddForm(false);
  // };

  const handleDelete = async (deleteID: string) => {
    if (!deleteID) return;

    // const content = editor.getHTML();

    // if (!title.trim()) {
    //   alert("Please enter a title");
    //   return;
    // }
    // if (!content || content === "<p></p>") {
    //   alert("Please type a message");
    //   return;
    // }

    try {
      // setIsLoading(true);

      // const payload = {
      //   msgTitle: title,
      //   msgDescription: content,

      //   campaignId: campaignId,
      // };

      const res = await getdeleteMsg(deleteID);

      if (!res?.success) {
        alert(res.error || "Error deleting message");
        return;
      }

      // Update parent message list
      fetchMsgs();
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <>
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 w-full max-w-5xl mx-auto mt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative">
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + New Message
          </Button>

          <h1 className="text-2xl font-semibold absolute left-1/2 -translate-x-1/2">
            Message Board
          </h1>

          {/* <button className="border rounded-full px-4 py-2 text-sm flex items-center gap-1 text-gray-700">
            All messages <ChevronDown size={16} />
          </button> */}
        </div>

        {/* ✅ Render Add Form Inline */}
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-xl shadow-sm bg-gray-50">
            <MessageInput fetchMsgs={fetchMsgs} campaignId={campaignId}  />
          </div>
        )}

        <hr />

       {/* Messages List */}
<div className="mt-4">
  {messagesLoading ? (
    // ✅ Loading UI
    <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
      <LuLoader className="animate-spin" />
      <p className="text-sm font-medium">Loading messages...</p>
    </div>
  ) : messages?.length === 0 ? (
    // ✅ Empty State UI
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 p-4 rounded-full mb-3">
        📭
      </div>
      <p className="text-gray-700 text-sm font-medium">
        No messages yet
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Start by adding your first message!
      </p>

      <Button
        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
        onClick={() => setShowAddForm(true)}
      >
        + Add Message
      </Button>
    </div>
  ) : (
    // ✅ Messages Available UI
    <ul className="divide-y border rounded-xl bg-white shadow-sm">
      {messages?.map((msg, index) => (
        <li
          key={index}
          className="py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 px-3 rounded transition"
        >
          <div onClick={() => handleOpenMsg(msg)} className="flex-1">
            <div className="font-medium text-gray-800">
              {msg.msgTitle}
            </div>
            <div className="text-xs mt-1 text-gray-500">
              <SafeHTML html={msg.msgDescription} />
            </div>
          </div>

          <MdDelete
            onClick={() => handleDelete(msg._id)}
            size={20}
            className="text-red-600 hover:text-red-700 cursor-pointer ml-3"
          />
        </li>
      ))}
    </ul>
  )}
</div>

       
      </div>

      {/* 📩 View Message Dialog */}
      <Dialog open={openMsg} onOpenChange={setOpenMsg}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{selectedMsg?.msgTitle}</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 text-sm mt-2">
            {" "}
            <SafeHTML html={selectedMsg?.msgDescription || "no Msg"} />
          </p>

          {/* <div className="text-xs text-gray-500 mt-4 flex justify-between">
            <span>👤 {selectedMsg?.author}</span>
            <span>⏱ {selectedMsg?.time}</span>
          </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
