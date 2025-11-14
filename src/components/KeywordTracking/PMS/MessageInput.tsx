// "use client";

// import { useState } from "react";
// import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// // ✅ Tiptap
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Link from "@tiptap/extension-link";
// import Strike from "@tiptap/extension-strike";

// export default function MessageInput({ onSubmit }: { onSubmit: (data: any) => void }) {
//   const [audience, setAudience] = useState("team");


// const editor = useEditor({
//   extensions: [
//     StarterKit,
//     Link,
//     Strike
//   ],
//   content: "",
//   immediatelyRender: false
// });


//   const setLink = () => {
//     const url = prompt("Enter URL");
//     if (!url) return;
//     editor?.chain().focus().setLink({ href: url }).run();
//   };

//   const handleSubmit = () => {
//     const html = editor?.getHTML() ?? "";
//     onSubmit({
//       audience,
//       message: html,
//     });
//   };

//   // Prevent rendering before editor is ready
//   if (!editor) return null;

//   return (
//     <div className=" p-6 max-w-4xl mx-auto mt-6">
//       {/* Message filter */}
//       <Select defaultValue="all">
//         <SelectTrigger className="w-40 mb-4">
//           <SelectValue placeholder="All messages" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All messages</SelectItem>
//           <SelectItem value="important">Important</SelectItem>
//           <SelectItem value="announcement">Announcements</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* Title */}
//       <Input
//         placeholder="Type a Title…."
//         className="text-xl font-semibold border-none shadow-none p-0 mb-4"
//       />

//       {/* Toolbar */}
// <div className="border-b pb-2 mb-2 flex gap-2 text- items-center flex-wrap">

//   <Button title="bold" variant="ghost" size="lg" 
//     onClick={() => editor.chain().focus().toggleBold().run()}
//     className={cn(editor.isActive("bold") && "bg-gray-200")}>B</Button>

//   <Button title="italic" variant="ghost" size="lg" 
//     onClick={() => editor.chain().focus().toggleItalic().run()}
//     className={cn(editor.isActive("italic") && "bg-gray-200")}>I</Button>

//   <Button title="strike" variant="ghost" size="lg" 
//     onClick={() => editor.chain().focus().toggleStrike().run()}
//     className={cn(editor.isActive("strike") && "bg-gray-200")}>S</Button>

//   <Button title="link" variant="ghost" size="lg" onClick={setLink}>🔗</Button>

//   {/* <Button title="blockquote" variant="ghost" size="lg" 
//     onClick={() => editor.chain().focus().toggleBlockquote().run()}
//     className={cn(editor.isActive("blockquote") && "bg-gray-200")}>❝</Button> */}

//   {/* <Button title="code block" variant="ghost" size="lg" 
//     onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//     className={cn(editor.isActive("codeBlock") && "bg-gray-200")}>&lt;&gt;</Button> */}

 

//   {/* <Button title="bullet list" variant="ghost" size="lg" 
//     onClick={() => editor.chain().focus().toggleBulletList().run()}
//     className={cn(editor.isActive("bulletList") && "bg-gray-200")}>•</Button> */}

//   <Button title="ordered list" variant="ghost" size="lg"
//     onClick={() => editor.chain().focus().toggleOrderedList().run()}
//     className={cn(editor.isActive("orderedList") && "bg-gray-200")}>1.</Button>

//   {/* Attachment Input (hidden) */}
//   {/* <input  type="file" className="hidden" id="fileInput" onChange={console.log} />
//   <Button title="attachment" variant="ghost" size="lg" onClick={() => document.getElementById("fileInput")?.click()}>
//     📎
//   </Button> */}

//   {/* Undo / Redo */}
//   <Button title="undo" variant="ghost" size="lg" onClick={() => editor.chain().focus().undo().run()}>↩</Button>
//   <Button title="redo" variant="ghost" size="lg" onClick={() => editor.chain().focus().redo().run()}>↪</Button>

// </div>


//       {/* Editor */}
//       <div className="border rounded-md p-4 min-h-[200px]">
//         <EditorContent editor={editor} />
//       </div>

//       <Button className="mt-4 w-full" onClick={handleSubmit}>Post Message</Button>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import Placeholder from "@tiptap/extension-placeholder";

// // Tiptap
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Link from "@tiptap/extension-link";
// import Strike from "@tiptap/extension-strike";
// import { getAndSaveMessage } from "@/actions/managementSystem";
// import { on } from "events";



// export default function MessageInput({ campaignId,fetchMsgs }: { fetchMsgs: () => void , campaignId: string}) {
//   const [audience, setAudience] = useState("team");
//   const [title, setTitle] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Link,
//       Strike,
//       Placeholder.configure({
//         placeholder: "Write here...",
//         emptyNodeClass: "text-gray-400",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//   });

//   const setLink = () => {
//     const url = prompt("Enter URL:");
//     if (!url) return;
//     editor?.chain().focus().setLink({ href: url }).run();
//   };

//   const handleSubmit = async () => {
//     if (!editor) return;

//     const content = editor.getHTML();

//     if (!title.trim()) {
//       alert("Please enter a title");
//       return;
//     }
//     if (!content || content === "<p></p>") {
//       alert("Please type a message");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const payload = {
//         msgTitle: title,
//         msgDescription: content,
       
//         campaignId: campaignId,
//       };

//       const res = await getAndSaveMessage(payload);
//       if (!res?.success) {
//         alert(res.error || "Error saving message");
//         return;
//       }

//       // Update parent message list
// fetchMsgs();
//       // Reset form
//       setTitle("");
//       editor.commands.clearContent();

//     } catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong!");
//     } finally {
//       setIsLoading(false);
//     }
//   };
 

//   if (!editor) return null;

//   return (
//     <div className="p-6 max-w-4xl mx-auto mt-6 space-y-4">

//       {/* Message Filter */}
//       <Select defaultValue="all">
//         <SelectTrigger className="w-40">
//           <SelectValue placeholder="All messages" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All messages</SelectItem>
//           <SelectItem value="important">Important</SelectItem>
//           <SelectItem value="announcement">Announcements</SelectItem>
//         </SelectContent>
//       </Select>

//       {/* Title */}
//       <Input
//         placeholder="Type a Title…."
//         className="text-xl font-semibold border-none shadow-none p-0"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       {/* Toolbar */}
//       <div className="border rounded-md p-2 flex flex-wrap items-center gap-1 bg-white">

//         <button
//           title="Bold"
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={cn("toolbar-btn", editor.isActive("bold") && "bg-gray-200")}
//         > B </button>

//         <button
//           title="Italic"
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={cn("toolbar-btn", editor.isActive("italic") && "bg-gray-200")}
//         > I </button>

//         <button
//           title="Strikethrough"
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           className={cn("toolbar-btn", editor.isActive("strike") && "bg-gray-200")}
//         > S </button>

//         <button title="Insert Link" onClick={setLink} className="toolbar-btn"> 🔗 </button>

//         {/* <button
//           title="Number List"
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={cn("toolbar-btn", editor.isActive("orderedList") && "bg-gray-200")}
//         > 1. </button> */}

//         <input id="fileInput" type="file" className="hidden" onChange={console.log} />
//         <button title="Attach File" onClick={() => document.getElementById("fileInput")?.click()} className="toolbar-btn"> 📎 </button>

//         <button title="Undo" onClick={() => editor.chain().focus().undo().run()} className="toolbar-btn"> ↩ </button>
//         <button title="Redo" onClick={() => editor.chain().focus().redo().run()} className="toolbar-btn"> ↪ </button>
//       </div>

//       {/* Editor */}
//       <div className="border rounded-md p-2 bg-white">
//         <EditorContent editor={editor} className="p-0" />
//       </div>

//       {/* Submit */}
//       <Button className="w-full" onClick={handleSubmit} disabled={isLoading}>
//         {isLoading ? "Posting..." : "Post Message"}
//       </Button>
//     </div>
//   );
// }





"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";

// Tiptap
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Strike from "@tiptap/extension-strike";
import { getAndSaveMessage } from "@/actions/managementSystem";
import { FaFile } from "react-icons/fa6";

export default function MessageInput({ campaignId, fetchMsgs }: { fetchMsgs: () => void; campaignId: string }) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Strike,
      Placeholder.configure({
        placeholder: "Write here...",
        emptyNodeClass: "text-gray-400",
      }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
  });

  const setLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  };

  const handleSubmit = async () => {
    if (!editor) return;

    const content = editor.getHTML();

    if (!title.trim()) return alert("Please enter a title");
    if (!content || content === "<p></p>") return alert("Please type a message");

    try {
      setIsLoading(true);

      const payload = {
        msgTitle: title,
        msgDescription: content,
        campaignId,
      };

      const res = await getAndSaveMessage(payload);
      if (!res?.success) return alert(res.error || "Error saving message");

      fetchMsgs();
      setTitle("");
      editor.commands.clearContent();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="">


      {/* Dark Container */}
      <div className="bg-[#20364B] p-6 rounded-xl space-y-4">

        {/* Select Filter */}
        <Select defaultValue="all">
          <SelectTrigger className="w-40 bg-white rounded-full px-4">
            <SelectValue placeholder="All Messages" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="announcement">Announcements</SelectItem>
          </SelectContent>
        </Select>

        {/* Title Input */}
        <Input
          placeholder="Type a Title….."
          className=" rounded-full text-white border-none focus:border-none px-4 py-3 text-base"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Toolbar */}
        <div className="bg-white rounded-full px-4 py-2 flex items-center gap-6">

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("text-sm", editor.isActive("bold") && "font-extrabold underline")}
          >
            B
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("text-sm italic", editor.isActive("italic") && "underline")}
          >
            I
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn("text-sm line-through", editor.isActive("strike") && "underline")}
          >
            S
          </button>

          {/* Link */}
          <button onClick={setLink} className="text-lg">🔗</button>

          {/* Attach File */}
          <input id="fileInput" type="file" className="hidden" />
          <button onClick={() => document.getElementById("fileInput")?.click()} className="text-lg">
            <FaFile/>
          </button>

          {/* Undo / Redo */}
          <button onClick={() => editor.chain().focus().undo().run()}>↩</button>
          <button onClick={() => editor.chain().focus().redo().run()}>↪</button>
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-xl p-4 h-40 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            className="bg-[#FFB900] text-black px-10 py-1  rounded-full hover:bg-yellow-500"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}
