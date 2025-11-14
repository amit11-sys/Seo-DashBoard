"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
import { getTemplates, saveTodoAsTemplate } from "@/actions/todoTemplate/queries";

type SubTodo = {
  title: string;
  description: string;
};

type TodoTemplate = {
  _id: string;
  title: string;
  description: string;
  subtodo?: SubTodo[];
  createdAt?: string;
};

interface TemplateContextType {
  templates: TodoTemplate[];
  loading: boolean;
  fetchTemplates: () => Promise<void>;
  addTemplate: any;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider = ({ children, initialTemplates = [] }: { children: React.ReactNode; initialTemplates?: any }) => {
  const [templates, setTemplates] = useState<any>(initialTemplates);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch templates from server (for import dialog refresh)
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTemplates();
      if (res?.success && res.templates) {
        setTemplates(res.templates);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Save new template and update state
  const addTemplate = useCallback(async (todos: any[], name: string, description: string) => {
    console.log(todos, 'abe chl');
    
    // if (!name.trim()) return toast.error("Please enter a template name");
    // if (!todos.length) return toast.error("No todos to save as template");

    // try {
    //   setLoading(true);
    //   const res = await saveTodoAsTemplate({ todos, templateTitle: name, templateDescription: description });
    //   if (res?.success && res?.template) {
    //     setTemplates((prev:any) => [res.template, ...prev]);
    //     toast.success("Template saved successfully");
    //   } else {
    //     toast.error(res?.message || "Failed to save template");
    //   }
    // } catch (err) {
    //   console.error("Error saving template:", err);
    //   toast.error("Error saving template");
    // } finally {
    //   setLoading(false);
    // }
     if (todos.length === 0) {
          toast.error("No todos to save as template");
          return;
        }
        if (!name.trim()) {
          toast.error("Template name is required");
          return;
        }
    
        const formattedTodos = todos.map((t) => ({
          title: t.title,
          description: t.desc || "",
          subtodo: t.subtodos.map((sub:any) => ({
            title: sub.title,
            description: sub.description || "",
          })),
        }));
    console.log(formattedTodos, 'abe');
    
        // setLoading(true);
        const res = await saveTodoAsTemplate({
          todos: formattedTodos,
          templateTitle: name,
          templateDescription: description,
        });
        // setLoading(false);
    
        if (res.success) {
          toast.success("Template saved successfully!");
    setTemplates((prev:any) => [res.template, ...prev]);
        } else {
          toast.error(res.message || "Failed to save template");
        }
  }, []);

  return (
    <TemplateContext.Provider value={{ templates, loading, fetchTemplates, addTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (!context) throw new Error("useTemplates must be used within a TemplateProvider");
  return context;
};
