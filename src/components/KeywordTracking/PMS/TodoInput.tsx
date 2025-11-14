// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import { Button } from "@/components/ui/button";
// import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";
// import { Plus } from "lucide-react";

// interface TodoInputProps {
//   campaignId: string;
//   onSubmit: (data: any) => void;
//   takeUserIdFromParent?: (selectedUserId: any) => void;
// }

// export default function TodoInput({
//   takeUserIdFromParent,
//   campaignId,
//   onSubmit,
// }: TodoInputProps) {
//   const [task, setTask] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any>([]);
//   const [description, setDescription] = useState("");

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: "Add task description…",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//     onUpdate: ({ editor }) => {
//       setDescription(editor.getHTML()); // ✅ store HTML
//     },
//   });

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetchUserForTodos();
//         setAssignedUserData(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleSubmitTodo = async () => {
//     if (!task.trim()) {
//       alert("Please enter a title");
//       return;
//     }

//     if (!description || description === "<p></p>") {
//       alert("Please enter task details");
//       return;
//     }

//     try {
//       const payload = {
//         todoTitle: task,
//         todoDescription: description,
//         assignedUser,
//         campaignId,
//       };

//       const res = await getAndSaveTodos(payload);
// if (takeUserIdFromParent) {
//   takeUserIdFromParent(assignedUser);
// }      console.log(res, "todofrontres");

//       if (!res?.success) {
//         alert(res.error || "Error saving task");
//         return;
//       }

//       onSubmit(res.data);
//       setTask("");
//       editor?.commands.clearContent();
//       setAssignedUser("");
//     } catch (err) {
//       console.error("Error:", err);
//       alert("Something went wrong in saving task!");
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

//       {/* Title */}
//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />

//       {/* Assign User */}
//       <select
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         value={assignedUser}
//         onChange={(e) => setAssignedUser(e.target.value)}
//       >
//         <option value="">Assign User</option>
//         {assignedUserData.map((user: any) => (
//           <option key={user._id} value={user._id}>
//             {user.email}
//           </option>
//         ))}
//       </select>

//       {/* Description Editor */}
//       <div className="border rounded-md bg-white min-h-[120px]">
//         <EditorContent editor={editor} className="p-3 text-sm" />
//       </div>

//       {/* Add Button */}
//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Smile,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";

// ✅ Types
interface UploadedImage {
  name: string;
  url: string;
}
interface TodoInputProps {
  campaignId: string;
  onSubmit: (data: any) => void;
  takeUserIdFromParent?: (selectedUserId: any) => void;
  onFileUpload?: (files: File[]) => Promise<string[]>; // upload callback
}

export default function TodoInput({
  takeUserIdFromParent,
  campaignId,
  onSubmit,
  onFileUpload,
}: TodoInputProps) {
  const [task, setTask] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [assignedUserData, setAssignedUserData] = useState<any[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  // 🧠 Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Add task description…",
      }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
  });

  // ✅ Fetch assignable users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchUserForTodos();
        setAssignedUserData(response?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Upload helper
  const uploadImages = async (files: File[]) => {
    if (!onFileUpload) return;
    try {
      setUploading(true);
      const urls = await onFileUpload(files);
      urls.forEach((url) => {
        editor?.chain().focus().setImage({ src: url }).run();
      });

      setUploadedImages((prev) => [
        ...prev,
        ...files.map((file, i) => ({
          name: file.name,
          url: urls[i],
        })),
      ]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle paste image
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      const file = e.clipboardData.files?.[0];
      if (!file || !onFileUpload) return;
      e.preventDefault();
      await uploadImages([file]);
    },
    [onFileUpload]
  );

  // ✅ File input upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length || !onFileUpload) return;
    await uploadImages(files);
  };

  // ✅ Remove image
  const removeImage = (name: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.name !== name));
  };

  // ✅ Emoji select
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    editor?.chain().focus().insertContent(emojiData.emoji).run();
    setShowEmoji(false);
  };

  // ✅ Submit
  const handleSubmitTodo = async () => {
    const description = editor?.getHTML() ?? "";

    if (!task.trim()) return alert("Please enter a title");
    if (!description || description === "<p></p>")
      return alert("Please enter task details");

    try {
      const payload = {
        todoTitle: task,
        todoDescription: description,
        assignedUser,
        campaignId,
        attachments: uploadedImages.map((img) => img.url),
      };

      const res = await getAndSaveTodos(payload);
      if (takeUserIdFromParent) takeUserIdFromParent(assignedUser);

      if (!res?.success) {
        alert(res.error || "Error saving task");
        return;
      }

      onSubmit(res.data);
      setTask("");
      setAssignedUser("");
      setUploadedImages([]);
      editor?.commands.clearContent();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <div className="p-4 space-y-4" onPaste={handlePaste}>
      <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

      {/* Title */}
      <input
        className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
        placeholder="Task Title"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      {/* Assign User */}
      <select
        className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
        value={assignedUser}
        onChange={(e) => setAssignedUser(e.target.value)}
      >
        <option value="">Assign User</option>
        {assignedUserData.map((user) => (
          <option key={user._id} value={user._id}>
            {user.email}
          </option>
        ))}
      </select>

      {/* Rich Text Editor */}
      <div className="border rounded-md bg-white shadow-sm p-3 space-y-2">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive("bold") ? "bg-gray-100" : ""}
          >
            <Bold size={16} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={editor?.isActive("italic") ? "bg-gray-100" : ""}
          >
            <Italic size={16} />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
          >
            <List size={16} />
          </Button>

          {/* Image upload */}
          {/* <label className="cursor-pointer flex items-center gap-1 px-2 py-1 text-sm border rounded-md hover:bg-gray-50">
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Upload</span>
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </label> */}

          {/* Emoji Picker */}
          {/* ✅ Emoji Picker */}
{/* <Popover open={showEmoji} onOpenChange={setShowEmoji}>
  <PopoverTrigger asChild>
    <Button size="sm" variant="ghost">
      <Smile size={16} />
    </Button>
  </PopoverTrigger>

  <PopoverContent
    className="p-0 border-none shadow-none bg-transparent"
    onClick={(e) => e.stopPropagation()} // Prevent popover from closing early
  >
    <EmojiPicker
      searchDisabled
      width={300}
      height={400}
      onEmojiClick={(emojiData, event) => {
        event.stopPropagation(); // ⛔ prevent closing popover
        editor?.chain().focus().insertContent(emojiData.emoji).run(); // ✅ insert
      }}
    />
  </PopoverContent>
</Popover> */}

        </div>

        {/* Editor area */}
        <div className="relative">
          <EditorContent
            editor={editor}
            className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
          />
          {uploading && (
            <div className="absolute top-2 right-3 text-xs text-gray-500">
              Uploading...
            </div>
          )}
        </div>

        {/* Uploaded images preview */}
        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-2">
            {uploadedImages.map((img) => (
              <div
                key={img.name}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
              >
                <span className="truncate max-w-[100px]" title={img.name}>
                  {img.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(img.name)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit button */}
      <Button onClick={handleSubmitTodo} className="w-full">
        <Plus className="w-4 h-4 mr-1" /> Add Task
      </Button>
    </div>
  );
}

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import Placeholder from "@tiptap/extension-placeholder";
// import Mention from "@tiptap/extension-mention";
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import {
//   Bold,
//   Italic,
//   List,
//   Smile,
//   X,
//   Plus,
//   AtSign,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";

// // ✅ Types
// interface UploadedImage {
//   name: string;
//   url: string;
// }
// interface MentionedUser {
//   id: string;
//   email: string;
// }
// interface TodoInputProps {
//   campaignId: string;
//   onSubmit: (data: any) => void;
//   takeUserIdFromParent?: (selectedUserId: any) => void;
//   onFileUpload?: (files: File[]) => Promise<string[]>; // upload callback
// }

// export default function TodoInput({
//   takeUserIdFromParent,
//   campaignId,
//   onSubmit,
//   onFileUpload,
// }: TodoInputProps) {
//   const [task, setTask] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any[]>([]);
//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [mentionedUsers, setMentionedUsers] = useState<MentionedUser[]>([]);

//   // 🧠 Fetch assignable users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetchUserForTodos();
//         setAssignedUserData(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ✅ TipTap Mention Extension
//   const MentionSuggestion = {
//     items: ({ query }: { query: string }) => {
//       return assignedUserData
//         .filter((user) =>
//           user.email.toLowerCase().includes(query.toLowerCase())
//         )
//         .slice(0, 5);
//     },
//     render: () => {
//       let component: any;
//       let popup: any;

//       return {
//         onStart: (props: any) => {
//           component = document.createElement("div");
//           component.classList.add(
//             "bg-white",
//             "border",
//             "rounded-md",
//             "shadow-md",
//             "p-1",
//             "text-sm",
//             "z-50"
//           );

//           update(props);

//           popup = tippy("body", {
//             getReferenceClientRect: props.clientRect,
//             appendTo: () => document.body,
//             content: component,
//             showOnCreate: true,
//             interactive: true,
//             trigger: "manual",
//             placement: "bottom-start",
//           });
//         },
//         onUpdate: update,
//         onExit: () => {
//           popup?.destroy();
//           component?.remove();
//         },
//       };

//       function update(props: any) {
//         const items = props.items;
//         component.innerHTML = "";
//         items.forEach((item: any) => {
//           const el = document.createElement("div");
//           el.className =
//             "px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md";
//           el.textContent = item.email;
//           el.addEventListener("click", () => {
//             props.command({ id: item._id, label: item.email });
//           });
//           component.appendChild(el);
//         });
//       }
//     },
//     command: ({ editor, range, props }: any) => {
//       editor
//         .chain()
//         .focus()
//         .insertContentAt(range, [
//           {
//             type: "mention",
//             attrs: props,
//           },
//           { type: "text", text: " " },
//         ])
//         .run();

//       setMentionedUsers((prev) => {
//         if (!prev.find((u) => u.id === props.id)) {
//           return [...prev, { id: props.id, email: props.label }];
//         }
//         return prev;
//       });
//     },
//   };

//   // ✅ Editor setup
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Image,
//       Mention.configure({
//         HTMLAttributes: {
//           class:
//             "bg-orange-100 text-orange-700 px-1 rounded font-medium cursor-pointer",
//         },
//         suggestion: MentionSuggestion,
//       }),
//       Placeholder.configure({
//         placeholder: "Add task description… (Type @ to mention someone)",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//   });

//   // ✅ Emoji select
//   const handleEmojiSelect = (emojiData: EmojiClickData) => {
//     editor?.chain().focus().insertContent(emojiData.emoji).run();
//     setShowEmoji(false);
//   };

//   // ✅ Submit
//   const handleSubmitTodo = async () => {
//     const description = editor?.getHTML() ?? "";

//     if (!task.trim()) return alert("Please enter a title");
//     if (!description || description === "<p></p>")
//       return alert("Please enter task details");

//     try {
//       const payload = {
//         todoTitle: task,
//         todoDescription: description,
//         assignedUser,
//         campaignId,
//         mentionedUsers,
//         attachments: uploadedImages.map((img) => img.url),
//       };

//       const res = await getAndSaveTodos(payload);
//       if (takeUserIdFromParent) takeUserIdFromParent(assignedUser);

//       if (!res?.success) {
//         alert(res.error || "Error saving task");
//         return;
//       }

//       onSubmit(res.data);
//       setTask("");
//       setAssignedUser("");
//       setUploadedImages([]);
//       setMentionedUsers([]);
//       editor?.commands.clearContent();
//     } catch (err) {
//       console.error("Error saving task:", err);
//     }
//   };

//   const removeMention = (id: string) => {
//     setMentionedUsers((prev) => prev.filter((u) => u.id !== id));
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

//       {/* Title */}
//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />

//       {/* Assign User */}
//       <select
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         value={assignedUser}
//         onChange={(e) => setAssignedUser(e.target.value)}
//       >
//         <option value="">Assign User</option>
//         {assignedUserData.map((user) => (
//           <option key={user._id} value={user._id}>
//             {user.email}
//           </option>
//         ))}
//       </select>

//       {/* Rich Text Editor */}
//       <div className="border rounded-md bg-white shadow-sm p-3 space-y-2">
//         {/* Toolbar */}
//         <div className="flex flex-wrap items-center gap-2 border-b pb-2">
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBold().run()}
//             className={editor?.isActive("bold") ? "bg-gray-100" : ""}
//           >
//             <Bold size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleItalic().run()}
//             className={editor?.isActive("italic") ? "bg-gray-100" : ""}
//           >
//             <Italic size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBulletList().run()}
//             className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
//           >
//             <List size={16} />
//           </Button>

//           {/* Emoji Picker */}
//           <Popover open={showEmoji} onOpenChange={setShowEmoji}>
//             <PopoverTrigger asChild>
//               <Button size="sm" variant="ghost">
//                 <Smile size={16} />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="p-0 border-none shadow-none bg-transparent">
//               <EmojiPicker onEmojiClick={handleEmojiSelect} searchDisabled />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Editor */}
//         <EditorContent
//           editor={editor}
//           className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
//         />
//       </div>

//       {/* Mentioned users chips */}
//       {mentionedUsers.length > 0 && (
//         <div className="flex flex-wrap gap-2 border-t pt-2">
//           {mentionedUsers.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
//             >
//               <AtSign size={12} />
//               <span>{user.email}</span>
//               <button
//                 type="button"
//                 onClick={() => removeMention(user.id)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Submit button */}
//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import Placeholder from "@tiptap/extension-placeholder";
// import Mention from "@tiptap/extension-mention";
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import { Bold, Italic, List, Smile, X, Plus, AtSign } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";

// interface UploadedImage {
//   name: string;
//   url: string;
// }
// interface MentionedUser {
//   id: string;
//   email: string;
// }
// interface TodoInputProps {
//   campaignId: string;
//   onSubmit: (data: any) => void;
//   takeUserIdFromParent?: (selectedUserId: any) => void;
//   onFileUpload?: (files: File[]) => Promise<string[]>; // upload callback
// }

// export default function TodoInput({
//   takeUserIdFromParent,
//   campaignId,
//   onSubmit,
//   onFileUpload,
// }: TodoInputProps) {
//   const [task, setTask] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any[]>([]);
//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [mentionedUsers, setMentionedUsers] = useState<MentionedUser[]>([]);

//   // ✅ Fetch users for mention suggestions
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetchUserForTodos();
//         setAssignedUserData(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ✅ Mention Suggestion
//   const MentionSuggestion = {
//     items: ({ query }: { query: string }) => {
//       return assignedUserData
//         .filter((user) =>
//           user.email.toLowerCase().includes(query.toLowerCase())
//         )
//         .slice(0, 5);
//     },
//     render: () => {
//       let component: HTMLDivElement;
//       let popup: any;

//       return {
//         onStart: (props: any) => {
//           component = document.createElement("div");
//           component.classList.add(
//             "bg-white",
//             "border",
//             "rounded-md",
//             "shadow-md",
//             "p-1",
//             "text-sm",
//             "z-50"
//           );

//           update(props);

//           popup = tippy("body", {
//             getReferenceClientRect: props.clientRect,
//             appendTo: () => document.body,
//             content: component,
//             showOnCreate: true,
//             interactive: true,
//             trigger: "manual",
//             placement: "bottom-start",
//           });
//         },
//         onUpdate: update,
//         onExit: () => {
//           popup?.destroy();
//           component?.remove();
//         },
//       };

//       function update(props: any) {
//         const items = props.items;
//         component.innerHTML = "";
//         items.forEach((item: any) => {
//           const el = document.createElement("div");
//           el.className =
//             "px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md";
//           el.textContent = item.email;
//           el.addEventListener("click", () => {
//             props.command({ id: item._id, label: item.email });
//           });
//           component.appendChild(el);
//         });
//       }
//     },
//     command: ({ editor, range, props }: any) => {
//       editor
//         .chain()
//         .focus()
//         .insertContentAt(range, [
//           {
//             type: "mention",
//             attrs: props,
//           },
//           { type: "text", text: " " },
//         ])
//         .run();

//       setMentionedUsers((prev) => {
//         if (!prev.find((u) => u.id === props.id)) {
//           return [...prev, { id: props.id, email: props.label }];
//         }
//         return prev;
//       });
//     },
//   };

//   // ✅ Editor setup
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Image,
//       Mention.configure({
//         HTMLAttributes: {
//           class:
//             "bg-orange-100 text-orange-700 px-1 rounded font-medium cursor-pointer",
//         },
//         suggestion: MentionSuggestion,
//       }),
//       Placeholder.configure({
//         placeholder: "Add task description… (Type @ to mention someone)",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//   });

//   const handleEmojiSelect = (emojiData: EmojiClickData) => {
//     editor?.chain().focus().insertContent(emojiData.emoji).run();
//     setShowEmoji(false);
//   };

//   // ✅ Remove mention chip
//   const removeMention = (id: string) => {
//     setMentionedUsers((prev) => prev.filter((u) => u.id !== id));
//   };

//   // ✅ Submit todo
//   const handleSubmitTodo = async () => {
//     const description = editor?.getHTML() ?? "";

//     if (!task.trim()) return alert("Please enter a title");
//     if (!description || description === "<p></p>")
//       return alert("Please enter task details");
//     if (mentionedUsers.length === 0)
//       return alert("Please mention at least one user using @");

//     try {
//       const payload = {
//         todoTitle: task,
//         todoDescription: description,
//         assignedUsers: mentionedUsers, // ✅ assign from mentions
//         campaignId,
//         attachments: uploadedImages.map((img) => img.url),
//       };

//       const res = await getAndSaveTodos(payload);
//       if (!res?.success) {
//         alert(res.error || "Error saving task");
//         return;
//       }

//       onSubmit(res.data);
//       setTask("");
//       setUploadedImages([]);
//       setMentionedUsers([]);
//       editor?.commands.clearContent();
//     } catch (err) {
//       console.error("Error saving task:", err);
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

//       {/* Title input */}
//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />

//       {/* Rich Text Editor */}
//       <div className="border rounded-md bg-white shadow-sm p-3 space-y-2">
//         {/* Toolbar */}
//         <div className="flex flex-wrap items-center gap-2 border-b pb-2">
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBold().run()}
//             className={editor?.isActive("bold") ? "bg-gray-100" : ""}
//           >
//             <Bold size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleItalic().run()}
//             className={editor?.isActive("italic") ? "bg-gray-100" : ""}
//           >
//             <Italic size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBulletList().run()}
//             className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
//           >
//             <List size={16} />
//           </Button>

//           {/* Emoji Picker */}
//           <Popover open={showEmoji} onOpenChange={setShowEmoji}>
//             <PopoverTrigger asChild>
//               <Button size="sm" variant="ghost">
//                 <Smile size={16} />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="p-0 border-none shadow-none bg-transparent">
//               <EmojiPicker onEmojiClick={handleEmojiSelect} searchDisabled />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Editor content */}
//         <EditorContent
//           editor={editor}
//           className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
//         />
//       </div>

//       {/* Mentioned Users Display */}
//       {mentionedUsers.length > 0 && (
//         <div className="flex flex-wrap gap-2 border-t pt-2">
//           {mentionedUsers.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
//             >
//               <AtSign size={12} />
//               <span>{user.email}</span>
//               <button
//                 type="button"
//                 onClick={() => removeMention(user.id)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Submit button */}
//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import { Bold, Italic, List, Smile, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";

// interface TodoInputProps {
//   campaignId: string;
//   onSubmit: (data: any) => void;
//   takeUserIdFromParent?: (selectedUserId: any) => void;
// }

// export default function TodoInput({
//   takeUserIdFromParent,
//   campaignId,
//   onSubmit,
// }: TodoInputProps) {
//   const [task, setTask] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any[]>([]);
//   const [showEmoji, setShowEmoji] = useState(false);

//   // 🧠 TipTap Editor setup
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Placeholder.configure({
//         placeholder: "Add task description…",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//   });

//   // ✅ Fetch assignable users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetchUserForTodos();
//         setAssignedUserData(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   // ✅ Emoji select
//   const handleEmojiSelect = (emojiData: EmojiClickData) => {
//     editor?.chain().focus().insertContent(emojiData.emoji).run();
//     setShowEmoji(false);
//   };

//   // ✅ Submit
//   const handleSubmitTodo = async () => {
//     const description = editor?.getHTML() ?? "";

//     if (!task.trim()) return alert("Please enter a title");
//     if (!description || description === "<p></p>")
//       return alert("Please enter task details");

//     try {
//       const payload = {
//         todoTitle: task,
//         todoDescription: description,
//         assignedUser,
//         campaignId,
//       };

//       const res = await getAndSaveTodos(payload);
//       if (takeUserIdFromParent) takeUserIdFromParent(assignedUser);

//       if (!res?.success) {
//         alert(res.error || "Error saving task");
//         return;
//       }

//       onSubmit(res.data);
//       setTask("");
//       setAssignedUser("");
//       editor?.commands.clearContent();
//     } catch (err) {
//       console.error("Error saving task:", err);
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

//       {/* Title */}
//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />

//       {/* Assign User */}
//       <select
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         value={assignedUser}
//         onChange={(e) => setAssignedUser(e.target.value)}
//       >
//         <option value="">Assign User</option>
//         {assignedUserData.map((user) => (
//           <option key={user._id} value={user._id}>
//             {user.email}
//           </option>
//         ))}
//       </select>

//       {/* Rich Text Editor */}
//       <div className="border rounded-md bg-white shadow-sm p-3 space-y-2">
//         {/* Toolbar */}
//         <div className="flex flex-wrap items-center gap-2 border-b pb-2">
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBold().run()}
//             className={editor?.isActive("bold") ? "bg-gray-100" : ""}
//           >
//             <Bold size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleItalic().run()}
//             className={editor?.isActive("italic") ? "bg-gray-100" : ""}
//           >
//             <Italic size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBulletList().run()}
//             className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
//           >
//             <List size={16} />
//           </Button>

//           {/* Emoji Picker */}
//           <Popover open={showEmoji} onOpenChange={setShowEmoji}>
//             <PopoverTrigger asChild>
//               <Button size="sm" variant="ghost">
//                 <Smile size={16} />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="p-0 border-none shadow-none bg-transparent">
//               <EmojiPicker onEmojiClick={handleEmojiSelect} searchDisabled />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Editor area */}
//         <EditorContent
//           editor={editor}
//           className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
//         />
//       </div>

//       {/* Submit button */}
//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>
//     </div>
//   );
// }







// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import Mention from "@tiptap/extension-mention";
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import { Bold, Italic, List, Smile, Plus, X, AtSign } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";

// interface TodoInputProps {
//   campaignId: string;
//   onSubmit: (data: any) => void;
//   takeUserIdFromParent?: (selectedUserId: any) => void;
// }

// export default function TodoInput({
//   takeUserIdFromParent,
//   campaignId,
//   onSubmit,
// }: TodoInputProps) {
//   const [task, setTask] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any[]>([]);
//   const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);
//   const [showEmoji, setShowEmoji] = useState(false);

//   // 🧠 Fetch assignable users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetchUserForTodos();
//         setAssignedUserData(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };
//     fetchUsers();
//   }, []);
//   // --- Replace your MentionSuggestion and editor creation with this code ---
  
//   console.log(assignedUserData,"kjkjkjk")
//   // ✅ Mention suggestion configuration (fixed)
// //   const MentionSuggestion = {
// //     // inside assignedUserData :
// // //     [
// // //     {
// // //         "_id": "690c786de7b4201553f2fd98",
// // //         "email": "singapore199706@gmail.com",
// // //         "password": "$2b$10$xXS505nkTGwJDQnJdKRVRepr5OKpfm/zRM4XpkBowz/SXo2GvRumq",
// // //         "role": 3,
// // //         "parentAdminId": "6850fa5b93d3a11fcb0b698c",
// // //         "isVerified": true,
// // //         "inviteTokenId": null,
// // //         "invitedAt": "2025-11-06T10:29:01.398Z",
// // //         "createdAt": "2025-11-06T10:29:01.398Z",
// // //         "updatedAt": "2025-11-06T10:34:06.520Z",
// // //         "__v": 2,
// // //         "totpSecret": "CIDASALAHRMF27ZJ",
// // //         "is2faEnabled": true,
// // //         "isScaned": true,
// // //         "trustedIPs": [
// // //             {
// // //                 "ip": "localhost",
// // //                 "lastVerified": "2025-11-06T10:31:40.308Z"
// // //             }
// // //         ],
// // //         "last2FAVerifiedAt": "2025-11-06T10:34:06.516Z"
// // //     }
// // // ]
// //   char: "@",
// //   items: ({ query }: { query: string }) => {
// //     // show first 5 when just '@'
// //     if (!query) return assignedUserData.slice(0, 5);
// //     return assignedUserData
// //       .filter((user: any) =>
// //         user.email.toLowerCase().includes(query.toLowerCase())
// //       )
// //       .slice(0, 5);
// //   },
// //   render: () => {
// //     let component: HTMLDivElement | null = null;
// //     let popup: any = null;

// //     return {
// //       onStart: (props: any) => {
// //         component = document.createElement("div");
// //         component.classList.add(
// //           "bg-white",
// //           "border",
// //           "rounded-md",
// //           "shadow-md",
// //           "p-1",
// //           "text-sm",
// //           "z-[9999]"
// //         );

// //         update(props);

// //         // tippy returns an array; take the instance [0]
// //         popup = (tippy(document.body, {
// //   getReferenceClientRect: props.clientRect,
// //   appendTo: () => document.body,
// //   content: component,
// //   showOnCreate: true,
// //   interactive: true,
// //   trigger: "manual",
// //   placement: "bottom-start",
// // }) as any)[0];
// //       },

// //       onUpdate: update,

// //       onKeyDown: (props: any) => {
// //         // allow escape to close
// //         if (props.event.key === "Escape") {
// //           popup?.hide?.();
// //           return true;
// //         }
// //         return false;
// //       },

// //       onExit: () => {
// //         try {
// //           popup?.destroy?.();
// //         } catch {}
// //         component?.remove();
// //         component = null;
// //         popup = null;
// //       },
// //     };

// //     function update(props: any) {
// //       if (!component) return;
// //       // DEBUG: see what items arrived
// //       // console.log("mention props.items:", props.items);
// //       const items = props.items as any[];
// //       component.innerHTML = "";

// //       if (!items || items.length === 0) {
// //         const empty = document.createElement("div");
// //         empty.className = "px-2 py-1 text-gray-400";
// //         empty.textContent = "No users";
// //         component.appendChild(empty);
// //         return;
// //       }

// //       items.forEach((item: any) => {
// //         const el = document.createElement("div");
// //         el.className =
// //           "px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md";
// //         el.textContent = item.email;
// //         el.addEventListener("click", () => {
// //           props.command({ id: item._id, label: item.email });
// //         });
// //         component!.appendChild(el);
// //       });
// //     }
// //   },

// //   command: ({ editor, range, props }: any) => {
// //     editor
// //       .chain()
// //       .focus()
// //       .insertContentAt(range, [
// //         { type: "mention", attrs: props },
// //         { type: "text", text: " " },
// //       ])
// //       .run();

// //     // add to mentionedUsers state
// //     setMentionedUsers((prev) => {
// //       if (!prev.find((u) => u.id === props.id)) {
// //         return [...prev, { id: props.id, email: props.label }];
// //       }
// //       return prev;
// //     });
// //   },
// // };

// // // 🧠 TipTap Editor setup (use the fixed suggestion)
// // const editor = useEditor({
// //   extensions: [
// //     StarterKit,
// //     Mention.configure({
// //       HTMLAttributes: {
// //         class:
// //           "bg-orange-100 text-orange-700 px-1 rounded font-medium cursor-pointer",
// //       },
// //       suggestion: MentionSuggestion,
// //     }),
// //     Placeholder.configure({
// //       placeholder: "Add task description… (Type @ to mention users)",
// //     }),
// //   ],
// //   content: "<p></p>",
// //   immediatelyRender: false,
// // });

// const [editor, setEditor] = useState<any>(null);

// useEffect(() => {
//   if (!assignedUserData.length) return; // wait until users fetched

//   const MentionSuggestion = {
//     char: "@",
//     items: ({ query }: { query: string }) => {
//       // use latest data from closure
//       if (!query) return assignedUserData.slice(0, 5);
//       return assignedUserData
//         .filter((user: any) =>
//           user.email.toLowerCase().includes(query.toLowerCase())
//         )
//         .slice(0, 5);
//     },
//     render: () => {
//       let component: HTMLDivElement | null = null;
//       let popup: any = null;

//       return {
//         onStart: (props: any) => {
//           component = document.createElement("div");
//           component.classList.add(
//             "bg-white",
//             "border",
//             "rounded-md",
//             "shadow-md",
//             "p-1",
//             "text-sm",
//             "z-[9999]"
//           );

//           update(props);

//           popup = (tippy(document.body, {
//             getReferenceClientRect: props.clientRect,
//             appendTo: () => document.body,
//             content: component,
//             showOnCreate: true,
//             interactive: true,
//             trigger: "manual",
//             placement: "bottom-start",
//           }) as any)[0];
//         },
//         onUpdate: update,
//         onKeyDown: (props: any) => {
//           if (props.event.key === "Escape") {
//             popup?.hide?.();
//             return true;
//           }
//           return false;
//         },
//         onExit: () => {
//           try {
//             popup?.destroy?.();
//           } catch {}
//           component?.remove();
//           component = null;
//           popup = null;
//         },
//       };

//       function update(props: any) {
//         if (!component) return;
//         const items = props.items as any[];
//         component.innerHTML = "";

//         if (!items || items.length === 0) {
//           const empty = document.createElement("div");
//           empty.className = "px-2 py-1 text-gray-400";
//           empty.textContent = "No users";
//           component.appendChild(empty);
//           return;
//         }

//         items.forEach((item: any) => {
//           const el = document.createElement("div");
//           el.className =
//             "px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md";
//           el.textContent = item.email;
//           el.addEventListener("click", () => {
//             props.command({ id: item._id, label: item.email });
//           });
//           component!.appendChild(el);
//         });
//       }
//     },
//     command: ({ editor, range, props }: any) => {
//       editor
//         .chain()
//         .focus()
//         .insertContentAt(range, [
//           { type: "mention", attrs: props },
//           { type: "text", text: " " },
//         ])
//         .run();

//       setMentionedUsers((prev) => {
//         if (!prev.find((u) => u.id === props.id)) {
//           return [...prev, { id: props.id, email: props.label }];
//         }
//         return prev;
//       });
//     },
//   };

//   const newEditor = useEditor({
//     extensions: [
//       StarterKit,
//       Mention.configure({
//         HTMLAttributes: {
//           class:
//             "bg-orange-100 text-orange-700 px-1 rounded font-medium cursor-pointer",
//         },
//         suggestion: MentionSuggestion,
//       }),
//       Placeholder.configure({
//         placeholder: "Add task description… (Type @ to mention users)",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//   });

//   setEditor(newEditor);

//   return () => newEditor?.destroy(); // cleanup
// }, [assignedUserData]);



//   // ✅ Emoji select
//   const handleEmojiSelect = (emojiData: EmojiClickData) => {
//     editor?.chain().focus().insertContent(emojiData.emoji).run();
//     setShowEmoji(false);
//   };

//   // ✅ Submit
//   const handleSubmitTodo = async () => {
//     const description = editor?.getHTML() ?? "";

//     if (!task.trim()) return alert("Please enter a title");
//     if (!description || description === "<p></p>")
//       return alert("Please enter task details");

//     try {
//       const payload = {
//         todoTitle: task,
//         todoDescription: description,
//         assignedUser,
//         mentionedUsers: mentionedUsers.map((u) => u.id),
//         campaignId,
//       };

//       const res = await getAndSaveTodos(payload);
//       if (takeUserIdFromParent)
//         takeUserIdFromParent(mentionedUsers.map((u) => u.id));

//       if (!res?.success) {
//         alert(res.error || "Error saving task");
//         return;
//       }

//       onSubmit(res.data);
//       setTask("");
//       setAssignedUser("");
//       setMentionedUsers([]);
//       editor?.commands.clearContent();
//     } catch (err) {
//       console.error("Error saving task:", err);
//     }
//   };

//   // ✅ Remove a mention from list
//   const removeMention = (id: string) => {
//     setMentionedUsers((prev) => prev.filter((u) => u.id !== id));
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

//       {/* Title */}
//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />

//       {/* Assign User */}
//       <select
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         value={assignedUser}
//         onChange={(e) => setAssignedUser(e.target.value)}
//       >
//         <option value="">Assign User</option>
//         {assignedUserData.map((user) => (
//           <option key={user._id} value={user._id}>
//             {user.email}
//           </option>
//         ))}
//       </select>

//       {/* Rich Text Editor */}
//       <div className="border rounded-md bg-white shadow-sm p-3 space-y-2">
//         {/* Toolbar */}
//         <div className="flex flex-wrap items-center gap-2 border-b pb-2">
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBold().run()}
//             className={editor?.isActive("bold") ? "bg-gray-100" : ""}
//           >
//             <Bold size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleItalic().run()}
//             className={editor?.isActive("italic") ? "bg-gray-100" : ""}
//           >
//             <Italic size={16} />
//           </Button>

//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBulletList().run()}
//             className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
//           >
//             <List size={16} />
//           </Button>

//           {/* Emoji Picker */}
//           <Popover open={showEmoji} onOpenChange={setShowEmoji}>
//             <PopoverTrigger asChild>
//               <Button size="sm" variant="ghost">
//                 <Smile size={16} />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="p-0 border-none shadow-none bg-transparent">
//               <EmojiPicker onEmojiClick={handleEmojiSelect} searchDisabled />
//             </PopoverContent>
//           </Popover>
//         </div>

//         {/* Editor area */}
//         <EditorContent
//           editor={editor}
//           className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
//         />
//       </div>

//       {/* Mentioned users display */}
//       {mentionedUsers.length > 0 && (
//         <div className="flex flex-wrap gap-2 border-t pt-2">
//           {mentionedUsers.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
//             >
//               <AtSign size={12} />
//               <span>{user.email}</span>
//               <button
//                 type="button"
//                 onClick={() => removeMention(user.id)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Submit button */}
//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>
//     </div>
//   );
// }





// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import Mention from "@tiptap/extension-mention";
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css";
// import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import { Bold, Italic, List, Smile, Plus, X, AtSign } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";

// export default function TodoInput({ campaignId, onSubmit, takeUserIdFromParent }: any) {
//   const [task, setTask] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any[]>([]);
//   const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);
//   const [showEmoji, setShowEmoji] = useState(false);

//   // 🧠 Fetch assignable users
//   useEffect(() => {
//     (async () => {
//       try {
//         const response = await fetchUserForTodos();
//         setAssignedUserData(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     })();
//   }, []);

//   // ✅ Define mention suggestion outside hooks
//   const MentionSuggestion = {
//     char: "@",
//     items: ({ query }: { query: string }) => {
//       if (!query) return assignedUserData.slice(0, 5);
//       return assignedUserData
//         .filter((user: any) =>{
//           console.log(assignedUserData,"insideMentions")
//   return user.email.toLowerCase().includes(query.toLowerCase());}
//         )
//         .slice(0, 5);
//     },
//     render: () => {
//       let component: HTMLDivElement | null = null;
//       let popup: any = null;
//         console.log("render")
//       return {
//         onStart: (props: any) => {
//           component = document.createElement("div");
//           component.classList.add(
//             "bg-white",
//             "border",
//             "rounded-md",
//             "shadow-md",
//             "p-1",
//             "text-sm",
//             "z-[9999]"
//           );
//           update(props);

//           popup = (tippy(document.body, {
//             getReferenceClientRect: props.clientRect,
//             appendTo: () => document.body,
//             content: component,
//             showOnCreate: true,
//             interactive: true,
//             trigger: "manual",
//             placement: "bottom-start",
//           }) as any)[0];
//         },
//         onUpdate: update,
//         onKeyDown: (props: any) => {
//           if (props.event.key === "Escape") {
//             popup?.hide?.();
//             return true;
//           }
//           return false;
//         },
//         onExit: () => {
//           try {
//             popup?.destroy?.();
//           } catch {}
//           component?.remove();
//           component = null;
//           popup = null;
//         },
//       };

//       function update(props: any) {
//         console.log(props,"updatedinside")
//         if (!component) return;
//         const items = props.items || ["noooo"];
//         component.innerHTML = "";

//         if (items.length === 0) {
//           const empty = document.createElement("div");
//           empty.className = "px-2 py-1 text-gray-400";
//           empty.textContent = "No users";
//           component.appendChild(empty);
//           return;
//         }

//         items.forEach((item: any) => {
//           const el = document.createElement("div");
//           el.className =
//             "px-2 py-1 hover:bg-gray-100 cursor-pointer rounded-md";
//           el.textContent = item.email;
//           el.addEventListener("click", () => {
//             props.command({ id: item._id, label: item.email });
//           });
//           component!.appendChild(el);
//         });
//       }
//     },
//     command: ({ editor, range, props }: any) => {
//       editor
//         .chain()
//         .focus()
//         .insertContentAt(range, [
//           { type: "mention", attrs: props },
//           { type: "text", text: " " },
//         ])
//         .run();

//       setMentionedUsers((prev) => {
//         if (!prev.find((u) => u.id === props.id)) {
//           return [...prev, { id: props.id, email: props.label }];
//         }
//         return prev;
//       });
//     },
//   };

//   // ✅ useEditor must be here (top-level, not inside useEffect)
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Mention.configure({
//         HTMLAttributes: {
//           class:
//             "bg-orange-100 text-orange-700 px-1 rounded font-medium cursor-pointer",
//         },
//         suggestion: MentionSuggestion,
//       }),
//       Placeholder.configure({
//         placeholder: "Add task description… (Type @ to mention users)",
//       }),
//     ],
//     content: "<p></p>",
//     immediatelyRender: false,
//   });

//   // ✅ Emoji select
//   const handleEmojiSelect = (emojiData: EmojiClickData) => {
//     editor?.chain().focus().insertContent(emojiData.emoji).run();
//     setShowEmoji(false);
//   };

//   // ✅ Submit
//   const handleSubmitTodo = async () => {
//     const description = editor?.getHTML() ?? "";
//     if (!task.trim()) return alert("Please enter a title");
//     if (!description || description === "<p></p>")
//       return alert("Please enter task details");

//     const payload = {
//       todoTitle: task,
//       todoDescription: description,
//       assignedUser,
//       mentionedUsers: mentionedUsers.map((u) => u.id),
//       campaignId,
//     };

//     const res = await getAndSaveTodos(payload);
//     if (takeUserIdFromParent)
//       takeUserIdFromParent(mentionedUsers.map((u) => u.id));

//     if (!res?.success) return alert(res.error || "Error saving task");

//     onSubmit(res.data);
//     setTask("");
//     setAssignedUser("");
//     setMentionedUsers([]);
//     editor?.commands.clearContent();
//   };

//   const removeMention = (id: string) =>
//     setMentionedUsers((prev) => prev.filter((u) => u.id !== id));

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-xl font-semibold text-center">✅ Add Task</h2>

//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />

//       <select
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         value={assignedUser}
//         onChange={(e) => setAssignedUser(e.target.value)}
//       >
//         <option value="">Assign User</option>
//         {assignedUserData.map((user) => (
//           <option key={user._id} value={user._id}>
//             {user.email}
//           </option>
//         ))}
//       </select>

//       <div className="border rounded-md bg-white shadow-sm p-3 space-y-2">
//         <div className="flex flex-wrap items-center gap-2 border-b pb-2">
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBold().run()}
//             className={editor?.isActive("bold") ? "bg-gray-100" : ""}
//           >
//             <Bold size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleItalic().run()}
//             className={editor?.isActive("italic") ? "bg-gray-100" : ""}
//           >
//             <Italic size={16} />
//           </Button>
//           <Button
//             size="sm"
//             variant="ghost"
//             onClick={() => editor?.chain().focus().toggleBulletList().run()}
//             className={editor?.isActive("bulletList") ? "bg-gray-100" : ""}
//           >
//             <List size={16} />
//           </Button>

//           <Popover open={showEmoji} onOpenChange={setShowEmoji}>
//             <PopoverTrigger asChild>
//               <Button size="sm" variant="ghost">
//                 <Smile size={16} />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="p-0 border-none shadow-none bg-transparent">
//               <EmojiPicker onEmojiClick={handleEmojiSelect} searchDisabled />
//             </PopoverContent>
//           </Popover>
//         </div>

//         <EditorContent
//           editor={editor}
//           className="min-h-[150px] p-2 focus:outline-none prose prose-sm max-w-none"
//         />
//       </div>

//       {mentionedUsers.length > 0 && (
//         <div className="flex flex-wrap gap-2 border-t pt-2">
//           {mentionedUsers.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs"
//             >
//               <AtSign size={12} />
//               <span>{user.email}</span>
//               <button
//                 type="button"
//                 onClick={() => removeMention(user.id)}
//                 className="text-gray-500 hover:text-red-500"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>
//     </div>
//   );
// }
