// "use client";

// import { use, useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Trash2, Plus } from "lucide-react";
// import { fetchUserForTodos, getAndSaveTodos } from "@/actions/managementSystem";

// export default function TodoInput(campaignId: any,onSubmit: (data: any) => void) {
//   const [todos, setTodos] = useState<any>([]);
// const [description, setDescription] = useState("");

//   const [task, setTask] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [assignedUserData, setAssignedUserData] = useState<any>([]);

// //   console.table({task,description,ok:"mkmkkk"})

//   // TipTap for detailed notes on the task
//   const editor = useEditor({
//   extensions: [
//     StarterKit,
//     Placeholder.configure({
//       placeholder: "Add task description…",
//     }),
//   ],
//   content: "<p></p>",
//   immediatelyRender: false,
//   onUpdate: ({ editor }) => {
//     // setDescription(editor.getHTML());   // ✅ Save HTML content
//     setDescription(editor.getText());  // if you only want text
//   },
// });

//   // Add new task
// //   const addTodo = () => {
// //     if (!task.trim()) return;
// //     setTodos([
// //       ...todos,
// //       {
// //         id: Date.now(),
// //         title: task,
// //         desc: editor?.getHTML() || "",
// //         done: false
// //       }
// //     ]);

// //     setTask("");
// //     editor?.commands.setContent(""); // clear editor text
// //   };
// const fetchUsers = async () => {
//   try {
//     const response = await fetchUserForTodos();
//     setAssignedUserData(response?.data || []);

//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return [];
//   }
// }
// useEffect(() => {
//   fetchUsers();
// }, []);

//    const handleSubmitTodo = async () => {
//       if (!editor) return;

//     //   const content = editor.getHTML();

//          if (!task.trim()) {
//         alert("Please enter a title");
//         return;
//       }
//     //   if (!content || content === "<p></p>") {
//     //     alert("Please type a message");
//     //     return;
//     //   }

//       try {
//         // setIsLoading(true);

//         const payload = {
//           todoTitle: task,
//           todoDescription: description,
//             assignedUser: assignedUser,
//           campaignId: campaignId?.campaignId
// ,
//         };
//         console.log(payload,"todoPayload")
// //         interface SaveTodoParams {
// //   campaignId: string;
// //   todoTitle: string;
// //   todoDescription: string;
// //   assignedUser:string
// // }

//         const res = await getAndSaveTodos(payload);
//         console.log(res,"todoressss")
//         onSubmit(res?.data);
//         if (!res?.success) {
//           alert(res.error || "Error saving message");
//           return;
//         }

//         // Update parent message list
//         onSubmit(payload);

//         // Reset form
//         setTask("");
//         editor.commands.clearContent();

//       } catch (err) {
//         console.error("Error:", err);
//         alert("Something went wrong!");
//       } finally {
//         // setIsLoading(false);
//       }
//     };

// //   Toggle complete

//   const toggleDone = (id:any) => {
//     setTodos(
//       todos.map((t:any) =>
//         t.id === id ? { ...t, done: !t.done } : t
//       )
//     );
//   };

//   // Delete task
//   const removeTodo = (id:any) => {
//     setTodos(todos.filter((t:any) => t.id !== id));
//   };

//   return (
//     <div className="p-4 space-y-4">

//       <h2 className="text-xl font-semibold mb-2 text-center">
//         ✅ To-Do List
//       </h2>

//       {/* Task Input */}
//       <input
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         placeholder="Task Title"
//         value={task}
//         onChange={(e) => setTask(e.target.value)}
//       />
//       {/* Assigned User */}
//       <select
//         className="w-full border rounded-md p-2 text-sm focus:border-black outline-none"
//         value={assignedUser}
//         onChange={(e) => setAssignedUser(e.target.value)}
//       >
//         <option value="">Select User</option>
//         {assignedUserData.map((user: any) => (
//           <option key={user._id} value={user._id}>
//             {user.email}
//           </option>
//         ))}
//       </select>

//       {/* Description / Notes Editor */}
//       <div className="border rounded-md bg-white min-h-[100px]">
//         <EditorContent editor={editor} className="p-3 text-sm" />
//       </div>

//       <Button onClick={handleSubmitTodo} className="w-full">
//         <Plus className="w-4 h-4 mr-1" /> Add Task
//       </Button>

//       {/* List */}
//       {/* <div className="space-y-3 mt-4">
//         {todos.map((t:any) => (
//           <div
//             key={t.id}
//             className="flex justify-between items-start gap-3 p-3 rounded-md border bg-gray-50"
//           >
//             <div className="flex gap-3 items-start">
//               <Checkbox
//                 checked={t.done}
//                 onCheckedChange={() => toggleDone(t.id)}
//               />
//               <div>
//                 <p className={`font-medium ${t.done ? "line-through text-gray-400" : ""}`}>
//                   {t.title}
//                 </p>

//                 {t.desc && (
//                   <div
//                     dangerouslySetInnerHTML={{ __html: t.desc }}
//                     className="text-xs text-gray-500 mt-1"
//                   />
//                 )}
//               </div>
//             </div>

//             <Trash2
//               className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110"
//               onClick={() => removeTodo(t.id)}
//             />
//           </div>
//         ))}
//       </div> */}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { getAndSaveTodos, fetchUserForTodos } from "@/actions/managementSystem";
import { Plus } from "lucide-react";

interface TodoInputProps {
  campaignId: string;
  onSubmit: (data: any) => void;
  takeUserIdFromParent?: (selectedUserId: any) => void;
}

export default function TodoInput({
  takeUserIdFromParent,
  campaignId,
  onSubmit,
}: TodoInputProps) {
  const [task, setTask] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [assignedUserData, setAssignedUserData] = useState<any>([]);
  const [description, setDescription] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add task description…",
      }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML()); // ✅ store HTML
    },
  });

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

  const handleSubmitTodo = async () => {
    if (!task.trim()) {
      alert("Please enter a title");
      return;
    } 

    if (!description || description === "<p></p>") {
      alert("Please enter task details");
      return;
    }

    try {
      const payload = {
        todoTitle: task,
        todoDescription: description,
        assignedUser,
        campaignId,
      };

      const res = await getAndSaveTodos(payload);
if (takeUserIdFromParent) {
  takeUserIdFromParent(assignedUser);
}      console.log(res, "todofrontres");

      if (!res?.success) {
        alert(res.error || "Error saving task");
        return;
      }

      onSubmit(res.data);
      setTask("");
      editor?.commands.clearContent();
      setAssignedUser("");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong in saving task!");
    }
  };

  return (
    <div className="p-4 space-y-4">
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
        {assignedUserData.map((user: any) => (
          <option key={user._id} value={user._id}>
            {user.email}
          </option>
        ))}
      </select>

      {/* Description Editor */}
      <div className="border rounded-md bg-white min-h-[120px]">
        <EditorContent editor={editor} className="p-3 text-sm" />
      </div>

      {/* Add Button */}
      <Button onClick={handleSubmitTodo} className="w-full">
        <Plus className="w-4 h-4 mr-1" /> Add Task
      </Button>
    </div>
  );
}
