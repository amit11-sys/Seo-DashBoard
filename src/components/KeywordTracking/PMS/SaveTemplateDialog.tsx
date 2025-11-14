// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { getTodoFortemplate, saveTodoAsTemplate } from "@/actions/todoTemplate/queries";
// import { toast } from "sonner";
// import { useTemplates } from "@/context/TemplateContext";
// import { fetchUserForTodos } from "@/actions/managementSystem";

// interface SubTodo {
//   title: string;
//   description?: string;
// }

// interface Todo {
//   id: string;
//   title: string;
//   desc?: string;
//   subtodos: SubTodo[];
// }

// export const SaveTemplateDialog = ({ todos, campaignId }: any) => {
//   const [open, setOpen] = useState(false);
//     const { addTemplate, loading } = useTemplates();
//   const [templateName, setTemplateName] = useState("");
//   const [templateDesc, setTemplateDesc] = useState("");
//   const [todoData, setTodoData] = useState<any>();
//   // const [loading, setLoading] = useState(false);

//   // const handleSave = async () => {
//   //   if (todos.length === 0) {
//   //     toast.error("No todos to save as template");
//   //     return;
//   //   }
//   //   if (!templateName.trim()) {
//   //     toast.error("Template name is required");
//   //     return;
//   //   }

//   //   const formattedTodos = todos.map((t:any) => ({
//   //     title: t.title,
//   //     description: t.desc || "",
//   //     subtodo: t.subtodos.map((sub:any) => ({
//   //       title: sub.title,
//   //       description: sub.description || "",
//   //     })),
//   //   }));

//   //   // setLoading(true);
//   //   const res = await saveTodoAsTemplate({
//   //     todos: formattedTodos,
//   //     templateTitle: templateName,
//   //     templateDescription: templateDesc,
//   //   });
//   //   // setLoading(false);

//   //   if (res.success) {
//   //     toast.success("Template saved successfully!");
//   //     setTemplateName("");
//   //     setTemplateDesc("");
//   //     setOpen(false);
//   //   } else {
//   //     toast.error(res.message || "Failed to save template");
//   //   }
//   // };
//   console.log(todos, 'are they fine here');
// useEffect(() => {
//   const todoUser = async () => {

//     const todo = await getTodoFortemplate(campaignId)
//     console.log(todo,"todoDAtata")
//     setTodoData(todo?.data)
//   }
//   todoUser()
// },[])

// // inside todoData we have this :
// // [
// //     {
// //         "_id": "691462a92183fd2ea7f25b96",
// //         "title": "ffffffff",
// //         "description": "<p><strong><em>@go</em></strong></p>",
// //         "userId": "6850fa5b93d3a11fcb0b698c",
// //         "campaignId": "68a46bf5b70739c5f4b2502f",
// //         "assignedAt": "2025-11-12T10:34:17.818Z",
// //         "assignedTo": "690c786de7b4201553f2fd98",
// //         "assignedBy": "6850fa5b93d3a11fcb0b698c",
// //         "status": "pending",
// //         "isTempDisabled": false,
// //         "subtodo": [],
// //         "createdAt": "2025-11-12T10:34:17.849Z",
// //         "updatedAt": "2025-11-12T10:34:17.849Z",
// //         "__v": 0
// //     },
// // ]
// const handleClose = () => {
//   if (!loading) {
//     setOpen(false);
//   }
// }
// const handleAdd = async (todos: any[], name: string, description: string) => {
//     await addTemplate(todos, name, description);
//     handleClose();
//   }
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
//         >
//           Save as Template
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md bg-white">
//         <DialogHeader>
//           <DialogTitle>Save Todo Template</DialogTitle>
//           <DialogDescription>
//             Create a reusable template from selected todos and subtasks.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-3 py-2">
//           <div>
//             <label className="text-sm font-medium">Template Name</label>
//             <Input
//               placeholder="Enter template name"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//             />
//           </div>
//           {/* add dropdown to select Todos */}

//           {/* textarea */}
//           <div>
//             <label className="text-sm font-medium">Description</label>
//             <Textarea
//               placeholder="Add short description (optional)"
//               value={templateDesc}
//               onChange={(e) => setTemplateDesc(e.target.value)}
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//          <Button onClick={() => handleAdd(todos, templateName, templateDesc)} disabled={loading}>
//           {loading ? "Saving..." : "Save Template"}
//         </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   getTodoFortemplate,
//   saveTodoAsTemplate,
// } from "@/actions/todoTemplate/queries";
// import { toast } from "sonner";
// import { useTemplates } from "@/context/TemplateContext";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { ChevronDown } from "lucide-react";

// export const SaveTemplateDialog = ({ todos, campaignId }: any) => {
//   const [open, setOpen] = useState(false);
//   const { addTemplate, loading } = useTemplates();
//   const [templateName, setTemplateName] = useState("");
//   const [templateDesc, setTemplateDesc] = useState("");
//   const [todoData, setTodoData] = useState<any[]>([]);
//   const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
//   const [popoverOpen, setPopoverOpen] = useState(false);

//   useEffect(() => {
//     const todoUser = async () => {
//       const todoRes = await getTodoFortemplate(campaignId);
//       const list = todoRes?.todo || todoRes?.data || [];
//       setTodoData(list);
//     };
//     todoUser();
//   }, [campaignId]);

//   const handleClose = () => {
//     if (!loading) setOpen(false);
//   };

//   const toggleTodoSelection = (id: string) => {
//     setSelectedTodoIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleAdd = async () => {
//     if (!templateName.trim()) {
//       toast.error("Template name is required");
//       return;
//     }

//     if (selectedTodoIds.length === 0) {
//       toast.error("Please select at least one Todo");
//       return;
//     }

//     const selectedTodos = todoData.filter((t) =>
//       selectedTodoIds.includes(t._id)
//     );

//     const formattedTodos = selectedTodos.map((t) => ({
//       title: t.title,
//       description: t.description || "",
//       subtodo:
//         t.subtodo?.map((sub: any) => ({
//           title: sub.title,
//           description: sub.description || "",
//         })) || [],
//     }));

//     await addTemplate(formattedTodos, templateName, templateDesc);
//     toast.success("Template saved successfully!");
//     handleClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
//         >
//           Save as Template
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md bg-white">
//         <DialogHeader>
//           <DialogTitle>Save Todo Template</DialogTitle>
//           <DialogDescription>
//             Create a reusable template from existing todos.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-3 py-2">
//           {/* Template Name */}
//           <div>
//             <label className="text-sm font-medium">Template Name</label>
//             <Input
//               placeholder="Enter template name"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//             />
//           </div>

//           {/* Multi-select dropdown */}
//           <div>
//             <label className="text-sm font-medium">Select Todos</label>
//             <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-between bg-white text-black border"
//                 >
//                   {selectedTodoIds.length > 0
//                     ? `${selectedTodoIds.length} selected`
//                     : "Choose Todos"}
//                   <ChevronDown className="w-4 h-4 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-2 bg-white shadow-md rounded-md border">
//                 <div className="max-h-48 overflow-y-auto">
//                   {todoData.length > 0 ? (
//                     todoData.map((t) => (
//                       <div
//                         key={t._id}
//                         className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded"
//                         onClick={() => toggleTodoSelection(t._id)}
//                       >
//                         <Checkbox
//                           checked={selectedTodoIds.includes(t._id)}
//                           onCheckedChange={() => toggleTodoSelection(t._id)}
//                         />
//                         <span className="text-sm">{t.title || "Untitled Todo"}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-400 p-2">No todos found</p>
//                   )}
//                 </div>
//               </PopoverContent>
//             </Popover>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="text-sm font-medium">Description</label>
//             <Textarea
//               placeholder="Add short description (optional)"
//               value={templateDesc}
//               onChange={(e) => setTemplateDesc(e.target.value)}
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleAdd} disabled={loading}>
//             {loading ? "Saving..." : "Save Template"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getTodoFortemplate } from "@/actions/todoTemplate/queries";
import { toast } from "sonner";
import { useTemplates } from "@/context/TemplateContext";
import { ChevronDown, Check } from "lucide-react";

export const SaveTemplateDialog = ({ todos, campaignId }: any) => {
  const [open, setOpen] = useState(false);
  const { addTemplate, loading } = useTemplates();
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [todoData, setTodoData] = useState<any[]>([]);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const todoUser = async () => {
      const todoRes = await getTodoFortemplate(campaignId);
      const list = todoRes?.data || [];
      setTodoData(list);
    };
    todoUser();
  }, [campaignId, open]);

  const toggleTodoSelection = (id: string) => {
    setSelectedTodoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (!templateName.trim()) return toast.error("Template name is required");
    if (selectedTodoIds.length === 0)
      return toast.error("Please select at least one Todo");

    const selectedTodos = todoData.filter((t) =>
      selectedTodoIds.includes(t._id)
    );
    console.log(selectedTodos, "selectedTodos");
    //     [
    //     {
    //         "_id": "69148286b2b9420feaf3006b",
    //         "title": "seoooo",
    //         "description": "<p>seo1</p>",
    //         "userId": "6850fa5b93d3a11fcb0b698c",
    //         "campaignId": "68a46bf5b70739c5f4b2502f",
    //         "assignedAt": "2025-11-12T12:50:14.920Z",
    //         "assignedTo": "690c786de7b4201553f2fd98",
    //         "assignedBy": "6850fa5b93d3a11fcb0b698c",
    //         "status": "pending",
    //         "isTempDisabled": false,
    //         "subtodo": [
    //             {
    //                 "title": "hello",
    //                 "description": "hnjiikoo",
    //                 "assignedTo": null,
    //                 "assignedBy": "6850fa5b93d3a11fcb0b698c",
    //                 "assignedAt": "2025-11-12T13:06:20.651Z",
    //                 "status": "In Progress",
    //                 "_id": "1762952780651",
    //                 "comment": "<p>ikiki</p>",
    //                 "commentsImgs": []
    //             }
    //         ],
    //         "createdAt": "2025-11-12T12:50:14.921Z",
    //         "updatedAt": "2025-11-12T13:07:01.147Z",
    //         "__v": 0
    //     },
    //     {
    //         "_id": "69148222b2b9420feaf30003",
    //         "title": "google1",
    //         "description": "<p>google 1</p>",
    //         "userId": "6850fa5b93d3a11fcb0b698c",
    //         "campaignId": "68a46bf5b70739c5f4b2502f",
    //         "assignedAt": "2025-11-12T12:48:34.835Z",
    //         "assignedTo": "690c786de7b4201553f2fd98",
    //         "assignedBy": "6850fa5b93d3a11fcb0b698c",
    //         "status": "pending",
    //         "isTempDisabled": false,
    //         "subtodo": [],
    //         "createdAt": "2025-11-12T12:48:34.907Z",
    //         "updatedAt": "2025-11-12T12:48:34.907Z",
    //         "__v": 0
    //     }
    // ]
    
    // const formattedTodos = selectedTodos.map((t) => ({
    //   title: t.title || "",
    //   description: t.description || "",
    //   todoId: t?._id,

    //   userId: t.userId,
    //   campaignId: t?.campaignId || "",
    //   assignedAt: t?.assignedAt || ""  ,
    //   assignedTo: t?.assignedTo || "",
    //   assignedBy: t?.assignedBy || "",
    //   status: t?.status || "",
    //   isTempDisabled: t?.isTempDisabled,
    //   subtodo:
    //     t?.subtodo?.map((sub: any) => ({
    //       title: sub?.title,
    //       description: sub?.description || "",

    //       assignedTo: sub?.assignedTo || "",
    //       assignedBy: sub?.assignedBy || "",
    //       assignedAt: sub?.assignedAt || "",
    //       status: sub?.status,
    //       _id: sub?._id || "",
    //       comment: sub?.comment || "",
    //       commentsImgs:sub?.commentsImgs || "",
    //     })) || [],
    // }));
    await addTemplate(selectedTodos, templateName, templateDesc);
    toast.success("Template saved successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="" asChild>
        <button className=" text-black bg-[#FFB900] hover:bg-[#cf9902] border rounded-full px-8 py-2 text-sm">
          Save as Template
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Save Todo Template</DialogTitle>
          <DialogDescription>
            Create a reusable template from existing todos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Template Name */}
          <div>
            <label className="text-sm font-medium">Template Name</label>
            <Input
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          {/* Custom Select */}
          <div className="relative">
            <label className="text-sm font-medium">Select Todos</label>
            <div
              className="w-full border rounded-md bg-white px-3 py-2 text-sm flex justify-between items-center cursor-pointer hover:border-gray-400"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span>
                {selectedTodoIds.length > 0
                  ? `${selectedTodoIds.length} selected`
                  : "Choose Todos"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {todoData.length > 0 ? (
                  todoData.map((t) => {
                    const isSelected = selectedTodoIds.includes(t._id);
                    return (
                      <div
                        key={t._id}
                        className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                          isSelected ? "bg-orange-50" : ""
                        }`}
                        onClick={() => toggleTodoSelection(t._id)}
                      >
                        <span className="truncate">
                          {t.title || "Untitled Todo"}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-400 p-2">No todos found</p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Add short description (optional)"
              value={templateDesc}
              onChange={(e) => setTemplateDesc(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
