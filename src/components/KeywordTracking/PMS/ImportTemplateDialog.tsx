"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getTemplates,
  importTodosFromTemplate,
} from "@/actions/todoTemplate/queries";
import { log } from "console";
import { useTemplates } from "@/context/TemplateContext";

interface Template {
  _id: string;
  title: string;
  description?: string;
}

export function ImportTemplateDialog({
  campaignId,
  template,
  fetchTodo
}: {
  campaignId: string;
  template: any;
  fetchTodo: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { templates, fetchTemplates, loading } = useTemplates();
  // const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleImport = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template to import");
      return;
    }

    // setLoading(true);
    const res = await importTodosFromTemplate({
      templateId: selectedTemplate,
      campaignId,
    });
    // setLoading(false);

    if (res?.success) {
      toast.success(res?.message);
      fetchTodo();
      setOpen(false);
    } else {
      toast.error(res?.message || "Failed to import todos");
    }
  };
  console.log(templates);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-4 py-2 text-sm"
        >
          Import from Template
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Import Todo Template</DialogTitle>
          <DialogDescription>
            Select a template to import todos into your campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3">
          <label className="text-sm font-medium">Select Template</label>
          <Select onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {templates.map((t) => (
                <SelectItem key={t._id} value={t._id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* {loading ? (
          <p>Loading templates...</p>
        ) : (
          <select className="border p-2 rounded w-full">
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
        )} */}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
