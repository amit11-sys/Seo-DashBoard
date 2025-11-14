"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import TodoInput from "./TodoInput";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  fetchTodos,
  getdeleteSubTodos,
  getdeleteTodos,
  geteditSubTodos,
  getsaveSubTodos,
} from "@/actions/managementSystem/index";
import DOMPurify from "dompurify";
import { toast } from "sonner";
// import TodoAccordion from "./TodoAccordian";
import { BsCheckSquare, BsPlus, BsSquare, BsTrash2 } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LuLoader } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { SaveTemplateDialog } from "./SaveTemplateDialog";
import { ImportTemplateDialog } from "./ImportTemplateDialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
function SafeHTML({ html }: { html: string }) {
  const cleanHTML = DOMPurify.sanitize(html);

  return (
    <div
      className="prose prose-sm max-w-none text-xs mt-1 text-gray-500"
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
}
interface SubTodo {
  id: number;
  title: string;
  completed: boolean;
}

interface Todo {
  id: string;
  title: string;
  desc: string;
  subtodos: any;
}

export default function TodoForm({ campaignId, templates }: { campaignId: string, templates:any }) {
  const [openSubTodoDialog, setOpenSubTodoDialog] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<any>("");
  const [subTodoTitle, setSubTodoTitle] = useState("");
  const [subTodoDesc, setSubTodoDesc] = useState("");
  // const addSubTodofn = () => {
  //   if (!subTodoTitle.trim() || currentTodoId === null) return;

  //   setTodos(
  //     todos.map((t: any) =>
  //       t.id === currentTodoId
  //         ? {
  //             ...t,
  //             subtodos: [
  //               ...(t.subtodos || []),
  //               {
  //                 id: Date.now(),
  //                 title: subTodoTitle,
  //                 desc: subTodoDesc,
  //                 completed: false,
  //               },
  //             ],
  //           }
  //         : t
  //     )
  //   );

  //   setSubTodoTitle("");
  //   setSubTodoDesc("");
  //   setOpenSubTodoDialog(false);
  // };

  const [todos, setTodos] = useState<any>([]);

  const [openTodo, setOpenTodo] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openSubTodoView, setOpenSubTodoView] = useState(false);
  const [selectedSubTodo, setSelectedSubTodo] = useState<any>(null);
  const [selectedUserIdFromParent, setSelectedUserIdFromParent] =
    useState<any>(null);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [todoLoading, setTodoLoading] = useState(false);
  const [statusChange, setStatusChange] = useState("");

  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");

  //   const [subtaskTitle, setSubtaskTitle] = useState(selectedSub?.title || "");
  // const [description, setDescription] = useState(selectedSub?.description || "");
  // const [comment, setComment] = useState("");
  // const [statusChange, setStatusChange] = useState(selectedSub?.status || "");

  // For toggling edit mode
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const [isOpenEditForm, setisOpenEditForm] = useState(false);
  const [editTodoFormData, setEditTodoFormData] = useState(null);

  const openSubDialog = (sub: any) => {
    setSelectedSub(sub);
    setOpenDialog(true);
  };

  const fetchTodo = async () => {
    setTodoLoading(true);
    try {
      const response = await fetchTodos(campaignId);
      console.log(response, "todoresponse");
      const data = response?.data?.map((todo: any) => ({
        id: todo._id.toString(),
        title: todo.title,
        desc: todo.description,
        status: todo.status,
        subtodos: todo.subtodo,
      }));
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setTodoLoading(false);
    }
  };
  useEffect(() => {
    fetchTodo();
  }, []);

  const handleOpenTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setOpenTodo(true);
  };

  const handleAddTodo = (newTodo: {
    title: string;
    description: string;
    subtodo: any;
    _id: any;
    status: any;
  }) => {
    const todo: any = {
      id: newTodo?._id,
      title: newTodo?.title,
      desc: newTodo?.description,
      status: newTodo?.status,
      subtodos: newTodo?.subtodo,
    };

    setTodos([todo, ...todos]);
    setShowAddForm(false);
  };

  const openSubTodoForm = (todoId: any) => {
    setCurrentTodoId(todoId);
    setOpenSubTodoDialog(true);
  };
  const openTodoEditForm = (todoData: any) => {
    setEditTodoFormData(todoData);
    setisOpenEditForm(true);
  };

  const takeUserIdFromParent = (selectedUserId: any) => {
    setSelectedUserIdFromParent(selectedUserId);
  };

  const addSubTodo = async (todoId: string) => {
    const payload = {
      todoId,
      todoTitle: subTodoTitle,
      todoDescription: subTodoDesc,
      campaignId: campaignId,
      assignedUser: selectedUserIdFromParent, // if you have assigned user field
    };

    try {
      console.log("Payload for sub-todo:", payload);

      const res = await getsaveSubTodos(payload);

      if (!res?.success) {
        alert(res.error || "Error adding sub-task");
        return;
      }

      // ✅ Update UI (if parent passed a callback)
      // if (onSubTodoSaved) {
      //   onSubTodoSaved(res.data);
      // }
      //
      // ✅ Reset Inputs
      fetchTodo();
      setSubTodoTitle("");
      setOpenSubTodoDialog(false);
      setSubTodoDesc("");

      console.log("Sub-todo saved:", res.data);
    } catch (error) {
      console.error("Sub-todo save failed:", error);
      alert("Something went wrong while saving sub-task");
    }
  };

  // ✅ Delete todo
  const deleteTodo = async (id: string) => {

    try {
      const response = await getdeleteTodos(id);

      if (!response?.success) {
        throw new Error(response?.error || "Delete failed");
      }
      setTodos((prev: any) => prev.filter((todo: any) => todo._id !== id));
      // Optional: toast success
      toast.success("Todo deleted");
      await fetchTodo();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (subTodoId: string) => {};

  const handleDeleteSub = async (subTodoId: string) => {
    await getdeleteSubTodos(subTodoId);
    fetchTodo();
  };

  const handleSubEditSave = async ({
    id,
    status,
    description,
    comment,
    subtaskTitle,
  }: {
    id: string;
    status: string;
    description: string;
    comment: string;
    subtaskTitle: string;
  }) => {
    // console.log("Update status:", id, status, description, comment);
    setOpenDialog(false);

    try {
      // ✅ Call your API
      const res = await geteditSubTodos({
        id,
        status,
        description,
        comment,
        subtaskTitle,
      });

      if (!res.success) {
        toast.error("Failed to update status ❌");
        return;
      }

      // ✅ Refresh todos
      await fetchTodo();

      toast.success(
        status === "Completed"
          ? "Task marked as completed ✅"
          : status === "In Progress"
            ? "Task moved to In Progress 🚀"
            : "Task set to Pending ⏳"
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };
  const handleMainTOdoEditSave = async ({
    id,
    status,
    description,
    comment,
    subtaskTitle,
  }: {
    id: string;
    status: string;
    description: string;
    comment: string;
    subtaskTitle: string;
  }) => {
    console.log("Update status:", id, status, description, comment);
    setOpenDialog(false);

    try {
      // ✅ Call your API
      const res = await geteditSubTodos({
        id,
        status,
        description,
        comment,
        subtaskTitle,
      });

      if (!res.success) {
        toast.error("Failed to update status ❌");
        return;
      }

      // ✅ Refresh todos
      await fetchTodo();

      toast.success(
        status === "Completed"
          ? "Task marked as completed ✅"
          : status === "In Progress"
            ? "Task moved to In Progress 🚀"
            : "Task set to Pending ⏳"
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };
  useEffect(() => {
    if (selectedSub) {
      setStatusChange(selectedSub.status || "");
      setDescription(selectedSub.description || "");
      setComment(selectedSub.comment || "");
      setSubtaskTitle(selectedSub.title || "");
    }
  }, [selectedSub]);

console.log(todos);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm shadow-gray-600 p-6 w-full max-w-5xl mx-auto mt-8">
         <div className="flex justify-end mb-4">
       <SaveTemplateDialog todos={todos} />
       <ImportTemplateDialog campaignId={campaignId} template={templates} fetchTodo={fetchTodo} />
  {/* <Button
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm ml-4"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + Import Template
          </Button> */}
          </div>
        <div className="flex items-center justify-between mb-6 relative">
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + New Task
          </Button>

          <h1 className="text-2xl font-semibold absolute left-1/2 -translate-x-1/2">
            To-Do Board
          </h1>
        </div>

        {/* {showAddForm && (
          <div className="mb-6 p-4 border rounded-xl shadow-sm bg-gray-50">
            <TodoInput
              takeUserIdFromParent={takeUserIdFromParent}
              campaignId={campaignId}
              onSubmit={handleAddTodo}
            />
          </div>
        )} */}
        {showAddForm && (
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogContent className="bg-white max-w-md rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
              </DialogHeader>

              <div className="mt-4">
                <TodoInput
                  takeUserIdFromParent={takeUserIdFromParent}
                  campaignId={campaignId}
                  onSubmit={handleAddTodo}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        <hr />
        {/* <TodoAccordion deleteTodo={deleteTodo} todos={todos} /> */}
        {todoLoading ? (
          // ✅ Loading UI
          <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
            <LuLoader className="animate-spin" />
            <p className="text-sm font-medium">Loading Todos...</p>
          </div>
        ) : todos?.length === 0 ? (
          // ✅ Empty State UI
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 p-4 rounded-full mb-3">📭</div>
            <p className="text-gray-700 text-sm font-medium">No Todos yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Start by adding your first Todo!
            </p>

            <Button
              className="mt-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
              onClick={() => setShowAddForm(true)}
            >
              + Add Todo
            </Button>
          </div>
        ) : (
          <>
            {/* ✅ Todo Accordions */}
            {/* ✅ Scrollable Accordion Container */}
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <Accordion type="multiple" className="w-full">
                {todos?.map((todo: any) => (
                  <AccordionItem key={todo.id} value={todo.id}>
                    <AccordionTrigger className="bg-gray-100 p-3 rounded-md [&>svg]:hidden font-semibold">
                      <span onClick={() => handleOpenTodo(todo)}>
                        {todo.title}
                      </span>
                      {/* ✅ Add Sub-Todo & Delete Icons */}
                      <div className="flex gap-3">
                        <BsPlus
                          className="h-4 w-4 text-green-600 cursor-pointer"
                          onClick={() => openSubTodoForm(todo.id)}
                        />
                        {/* edit button  */}
                        {/* <MdEdit
                          className="h-4 w-4 text-blue-500 cursor-pointer"
                          onClick={() => openTodoEditForm(todo)}
                        /> */}
                        <BsTrash2
                          className="h-4 w-4 text-red-500 cursor-pointer"
                          onClick={() => deleteTodo(todo.id)}
                        />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pl-14">
                      {todo.subtodos?.length > 0 ? (
                        <ul className="space-y-1 mt-2">
                          {todo.subtodos.map((sub: any) => (
                            <li
                              key={sub._id}
                              // onClick={() => openSubDialog(sub)}
                              className="cursor-pointer flex justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded text-sm border-b border-s"
                            >
                              <div className="flex items-center justify-center">
                                <span
                                  onClick={() => {
                                    setSelectedSubTodo(sub);
                                    setOpenSubTodoView(true);
                                  }}
                                  className={`text-sm ${
                                    sub.status === "Completed"
                                      ? "line-through text-gray-400"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {sub.title}
                                </span>
                              </div>
                              <div className="flex">
                                <div className="flex items-center gap-2"></div>
                                <div className="flex justify-center items-center gap-2">
                                  {sub.status === "Completed" ? (
                                    <span className="text-xs text-green-600">
                                      Completed
                                    </span>
                                  ) : sub.status === "In Progress" ? (
                                    <span className="text-xs text-orange-600">
                                      In Progress
                                    </span>
                                  ) : (
                                    <span className="text-xs text-gray-600">
                                      Pending
                                    </span>
                                  )}
                                  <button
                                    // onClick={() => handleEditSub(selectedSub._id)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <FaEdit
                                      onClick={() => {
                                        openSubDialog(sub);
                                      }}
                                      className="h-4 w-4 text-blue-600"
                                    />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteSub(sub._id)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500">No Sub Tasks</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </>
        )}
        <></>
      </div>

      {/* ✅ SubTask Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6 max-w-lg transition-all">
          {/* 🧭 Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Sub-Task Details
            </h2>
            {/* <button
        onClick={() => setOpenDialog(false)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        ✖
      </button> */}
          </div>

          {/* 📝 Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            {isEditingTitle ? (
              <Textarea
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                className="resize-none font-semibold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-2 border border-transparent hover:border-gray-200"
              >
                {subtaskTitle || "Click to add title..."}
              </div>
            )}
          </div>

          {/* 🧾 Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            {isEditingDesc ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setIsEditingDesc(false)}
                autoFocus
                placeholder="Edit description..."
                className="resize-none min-h-[90px] text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className="cursor-pointer text-gray-700 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-2 border border-transparent hover:border-gray-200"
              >
                {description || "Click to add description..."}
              </div>
            )}
          </div>

          {/* 📊 Status Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              value={statusChange}
              onValueChange={(value) => setStatusChange(value)}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md border border-gray-200 rounded-lg">
                <SelectItem value="Pending">🕒 Pending</SelectItem>
                <SelectItem value="In Progress">⚙️ Work In Progress</SelectItem>
                <SelectItem value="Completed">✅ Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 💬 Comments */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            {isEditingComment ? (
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onBlur={() => setIsEditingComment(false)}
                autoFocus
                placeholder="Write a comment..."
                className="resize-none min-h-[80px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div
                onClick={() => setIsEditingComment(true)}
                className="cursor-pointer text-gray-700 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-2 border border-transparent hover:border-gray-200"
              >
                {comment || "Click to add a comment..."}
              </div>
            )}
          </div>

          {/* ⚙️ Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="rounded-lg border-gray-300 hover:bg-gray-100"
            >
              Close
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
              onClick={() =>
                handleSubEditSave({
                  id: selectedSub._id,
                  status: statusChange,
                  description,
                  comment,
                  subtaskTitle,
                })
              }
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      {/* ✅ Task Edit Dialog */}
      <Dialog open={isOpenEditForm} onOpenChange={setisOpenEditForm}>
        <DialogContent className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6 max-w-lg transition-all">
          {/* 🧭 Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Task Details
            </h2>
           
          </div>

          {/* 📝 Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            {isEditingTitle ? (
              <Textarea
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                className="resize-none font-semibold text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-2 border border-transparent hover:border-gray-200"
              >
                {subtaskTitle || "Click to add title..."}
              </div>
            )}
          </div>

          {/* 🧾 Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            {isEditingDesc ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setIsEditingDesc(false)}
                autoFocus
                placeholder="Edit description..."
                className="resize-none min-h-[90px] text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div
                onClick={() => setIsEditingDesc(true)}
                className="cursor-pointer text-gray-700 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-2 border border-transparent hover:border-gray-200"
              >
                {description || "Click to add description..."}
              </div>
            )}
          </div>

          {/* 📊 Status Dropdown
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              value={statusChange}
              onValueChange={(value) => setStatusChange(value)}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md border border-gray-200 rounded-lg">
                <SelectItem value="Pending">🕒 Pending</SelectItem>
                <SelectItem value="In Progress">⚙️ Work In Progress</SelectItem>
                <SelectItem value="Completed">✅ Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 💬 Comments */}
          {/* <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            {isEditingComment ? (
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onBlur={() => setIsEditingComment(false)}
                autoFocus
                placeholder="Write a comment..."
                className="resize-none min-h-[80px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <div
                onClick={() => setIsEditingComment(true)}
                className="cursor-pointer text-gray-700 bg-gray-50 hover:bg-gray-100 transition rounded-lg p-2 border border-transparent hover:border-gray-200"
              >
                {comment || "Click to add a comment..."}
              </div>
            )}
          </div> */} 

          {/* ⚙️ Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setisOpenEditForm(false)}
              className="rounded-lg border-gray-300 hover:bg-gray-100"
            >
              Close
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
              onClick={() =>
                handleMainTOdoEditSave({
                  id: selectedSub._id,
                  subtaskTitle,
                  status: statusChange,
                  description,
                  comment,
                  
                })
              }
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Add Sub-Todo Dialog */}

      <Dialog open={openSubTodoDialog} onOpenChange={setOpenSubTodoDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add Sub-Task</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Sub task title..."
            value={subTodoTitle}
            onChange={(e) => setSubTodoTitle(e.target.value)}
            className="mb-2"
          />

          <Textarea
            placeholder="Sub task description..."
            value={subTodoDesc}
            onChange={(e) => setSubTodoDesc(e.target.value)}
            className="mb-2"
            rows={3}
          />

          <Button
            className="w-full"
            onClick={() => addSubTodo(currentTodoId || "")}
          >
            Add Sub-Task
          </Button>
        </DialogContent>
      </Dialog>

      {/* ✅ View Todo Dialog */}
      <Dialog open={openTodo} onOpenChange={setOpenTodo}>
        <DialogContent className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md sm:max-w-lg p-6 sm:p-8 transition-all">
          {/* 🧭 Header */}
          <DialogHeader className="border-b border-gray-100 ">
            <div className="flex items-start justify-between">
              <DialogTitle
                className={`text-xl font-semibold tracking-tight ${
                  selectedTodo?.completed === "completed"
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                <h1>Title</h1>
                {selectedTodo?.title || "Untitled Todo"}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* 📝 Description */}
          <div className="">
            {selectedTodo?.desc ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <h1>Description</h1>
                <SafeHTML html={selectedTodo.desc} />
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4">
                No description provided.
              </p>
            )}
          </div>

          {/* 📅 Status & Meta Info */}
          <div className=" border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
            {/* <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          selectedTodo?.completed === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {selectedTodo?.completed === "completed" ? "Completed" : "Pending"}
      </span>

      <span className="text-gray-400 text-xs">
        Last updated:{" "}
        {selectedTodo?.updatedAt
          ? new Date(selectedTodo.updatedAt).toLocaleString()
          : "N/A"}
      </span> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* subTodo dilaog view */}
      <Dialog open={openSubTodoView} onOpenChange={setOpenSubTodoView}>
        <DialogContent className="bg-white gap-0">
          <DialogHeader className="flex flex-col">
            {/* <DialogTitle>{selectedSubTodo?.title}</DialogTitle> */}
            <h1>Title</h1>
            <DialogTitle>{selectedSubTodo?.title}</DialogTitle>
          </DialogHeader>
          <h1 className="mt-4">Sub-Task</h1>
          <p className="text-gray-700 text-sm ">
            {/* {selectedSubTodo?.description} */}
            {selectedSubTodo?.description}
          </p>
          <h1 className="mt-4">Comment</h1>
          <p className="text-gray-700 text-sm ">
            {/* {selectedSubTodo?.description} */}
            {selectedSubTodo?.comment}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
