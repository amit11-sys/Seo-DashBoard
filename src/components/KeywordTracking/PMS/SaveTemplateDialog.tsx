"use client";

import { useState } from "react";
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
import { saveTodoAsTemplate } from "@/actions/todoTemplate/queries";
import { toast } from "sonner";
import { useTemplates } from "@/context/TemplateContext";

interface SubTodo {
  title: string;
  description?: string;
}

interface Todo {
  id: string;
  title: string;
  desc?: string;
  subtodos: SubTodo[];
}

export const SaveTemplateDialog = ({ todos }: any) => {
  const [open, setOpen] = useState(false);
    const { addTemplate, loading } = useTemplates();
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  // const [loading, setLoading] = useState(false);

  // const handleSave = async () => {
  //   if (todos.length === 0) {
  //     toast.error("No todos to save as template");
  //     return;
  //   }
  //   if (!templateName.trim()) {
  //     toast.error("Template name is required");
  //     return;
  //   }

  //   const formattedTodos = todos.map((t:any) => ({
  //     title: t.title,
  //     description: t.desc || "",
  //     subtodo: t.subtodos.map((sub:any) => ({
  //       title: sub.title,
  //       description: sub.description || "",
  //     })),
  //   }));

  //   // setLoading(true);
  //   const res = await saveTodoAsTemplate({
  //     todos: formattedTodos,
  //     templateTitle: templateName,
  //     templateDescription: templateDesc,
  //   });
  //   // setLoading(false);

  //   if (res.success) {
  //     toast.success("Template saved successfully!");
  //     setTemplateName("");
  //     setTemplateDesc("");
  //     setOpen(false);
  //   } else {
  //     toast.error(res.message || "Failed to save template");
  //   }
  // };
  console.log(todos, 'are they fine here');
  
const handleClose = () => {
  if (!loading) {
    setOpen(false);
  }
}
const handleAdd = async (todos: any[], name: string, description: string) => {
    await addTemplate(todos, name, description);
    handleClose();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
        >
          Save as Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Save Todo Template</DialogTitle>
          <DialogDescription>
            Create a reusable template from selected todos and subtasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="text-sm font-medium">Template Name</label>
            <Input
              placeholder="Enter template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
         <Button onClick={() => handleAdd(todos, templateName, templateDesc)} disabled={loading}>
          {loading ? "Saving..." : "Save Template"}
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
