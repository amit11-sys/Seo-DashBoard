"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {  Trash2 } from "lucide-react";
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

export default function TodoForm({ campaignId }: { campaignId: string }) {
  const [openSubTodoDialog, setOpenSubTodoDialog] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<any>("");
  const [subTodoTitle, setSubTodoTitle] = useState("");
  const [subTodoDesc, setSubTodoDesc] = useState("");
  const addSubTodofn = () => {
    if (!subTodoTitle.trim() || currentTodoId === null) return;

    setTodos(
      todos.map((t: any) =>
        t.id === currentTodoId
          ? {
              ...t,
              subtodos: [
                ...(t.subtodos || []),
                {
                  id: Date.now(),
                  title: subTodoTitle,
                  desc: subTodoDesc,
                  completed: false,
                },
              ],
            }
          : t
      )
    );

    setSubTodoTitle("");
    setSubTodoDesc("");
    setOpenSubTodoDialog(false);
  };

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
    }finally{
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

  const takeUserIdFromParent = (selectedUserId: any) => {
    setSelectedUserIdFromParent(selectedUserId);
  };

  // const [openTodo, setOpenTodo] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  const addSubTodo = async (todoId: string) => {
    if (!subTodoTitle.trim()) {
      alert("Sub-task title is required");
      return;
    }

    if (!subTodoDesc.trim()) {
      alert("Sub-task description is required");
      return;
    }

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
    // Save previous state for rollback
    // const previousTodos = [...todos];

    // Optimistic UI update

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

      // Rollback UI if API fails
      // setTodos(previousTodos);

      // Optional toast error
      // toast.error("Failed to delete todo. Try again.");
    }
  };

  const toggleComplete = async (subTodoId: string) => {};

  // const handleEditSub = (sub) => {

  //   console.log("edit sub", sub);
  // };

  const handleDeleteSub = async (subTodoId: string) => {
    await getdeleteSubTodos(subTodoId);
    fetchTodo();
  };
  const handleStatusChange = async (subTodoId: string, status: string) => {
    console.log("Update status:", subTodoId, status);
    setOpenDialog(false);

    try {
      // ✅ Call your API
      const res = await geteditSubTodos(subTodoId, status);

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

  console.log(todos, "inCOmp");
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border p-6 w-full max-w-5xl mx-auto mt-8">
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

        {showAddForm && (
          <div className="mb-6 p-4 border rounded-xl shadow-sm bg-gray-50">
            <TodoInput
              takeUserIdFromParent={takeUserIdFromParent}
              campaignId={campaignId}
              onSubmit={handleAddTodo}
            />
          </div>
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
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              📭
            </div>
            <p className="text-gray-700 text-sm font-medium">
              No Todos yet
            </p>
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
        ) :<>
        
        
             {/* ✅ Todo Accordions */}
          <Accordion type="multiple" className="w-full">
            {todos?.map((todo: any) => (
              <AccordionItem key={todo.id} value={todo.id}>
                <AccordionTrigger className="bg-gray-100 p-3 rounded-md [&>svg]:hidden font-semibold">
                  {todo.title}
                  {/* ✅ Add Sub-Todo & Delete Icons */}
                  <div className="flex gap-3">
                    <BsPlus
                      className="h-4 w-4 text-green-600 cursor-pointer"
                      onClick={() => openSubTodoForm(todo.id)}
                    />
                    <BsTrash2
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      onClick={() => deleteTodo(todo.id)}
                    />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pl-4">
                  {todo.subtodos?.length > 0 ? (
                    <ul className="space-y-1 mt-2">
                      {todo.subtodos.map((sub: any) => (
                        <li
                          key={sub._id}
                          // onClick={() => openSubDialog(sub)}
                          className="cursor-pointer flex justify-between bg-gray-50 hover:bg-gray-100 p-2 rounded text-sm border"
                        >
                          <div className="flex items-center justify-center">
                            <span
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
        </>
           
          }
        <>
        

         
        </>
      </div>
       {/* ✅ SubTask Dialog */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <DialogHeader className="flex flex-row items-start justify-between">
                <div>
                  <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    {selectedSub?.title}
                  </DialogTitle>
                  <p className="text-xs mt-1 text-gray-500">Sub-task details</p>
                </div>
              </DialogHeader>

              {/* Task Description */}
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 border">
                {selectedSub?.description}
              </div>

              {/* Status Dropdown */}
              <div className="bg-gray-50 p-3 rounded-lg border space-y-2">
                <p className="text-sm font-medium text-gray-700">Status</p>

                <Select
                  onValueChange={(value) =>
                    handleStatusChange(selectedSub._id, value)
                  }
                  defaultValue={selectedSub?.status}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent className="bg-white">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">
                      Work In Progress
                    </SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                  Close
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

      {/* View Todo Dialog */}
      <Dialog open={openTodo} onOpenChange={setOpenTodo}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle
              className={`${selectedTodo?.completed === "completed" ? "line-through text-gray-400" : ""}`}
            >
              {selectedTodo?.title}
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-700 text-sm mt-2">
            {" "}
            <SafeHTML html={selectedTodo?.desc} />{" "}
          </p>
        </DialogContent>
      </Dialog>

      {/* subTodo dilaog view */}
      <Dialog open={openSubTodoView} onOpenChange={setOpenSubTodoView}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{selectedSubTodo?.title}</DialogTitle>
          </DialogHeader>
          <h3>task:</h3>
          <p className="text-gray-700 text-sm mt-2">
            {selectedSubTodo?.description}
          </p>

          <div className="text-xs text-gray-500 mt-4 flex justify-between">
            <span>Sub-Task</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
