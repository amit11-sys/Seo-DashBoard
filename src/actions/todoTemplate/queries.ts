'use server'
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import TodoTemplate from "@/lib/models/todo-template.model";
import Todo from "@/lib/models/todo.model";
import { revalidatePath } from "next/cache";

interface SubTodoInput {
  title: string;
  description?: string;
}

interface TodoInput {
  title: string;
  description?: string;
  subtodo: SubTodoInput[];
}

interface SaveTodoTemplateParams {
  todos: TodoInput[];
  templateTitle: string;
  templateDescription?: string;
}
interface ImportTemplateParams {
  templateId: string;
  campaignId: string;
//   assignedBy: string;
}

export async function saveTodoAsTemplate({
  todos,
  templateTitle,
  templateDescription,
}: SaveTodoTemplateParams) {
  try {
    await connectToDB();

    if (!Array.isArray(todos) || todos.length === 0) {
      return { success: false, message: "No todos provided" };
    }

    if (!templateTitle.trim()) {
      return { success: false, message: "Template name is required" };
    }

    // 🔍 Check for duplicate template name (case-insensitive)
    const existing = await TodoTemplate.findOne({
      title: { $regex: new RegExp(`^${templateTitle}$`, "i") },
    });

    if (existing) {
      return {
        success: false,
        message: `A template named "${templateTitle}" already exists.`,
      };
    }

    const cleanTodos = todos.map((t) => ({
      title: t.title,
      description: t.description || "",
      subtodo: (t.subtodo || []).map((s) => ({
        title: s.title,
        description: s.description || "",
      })),
    }));

    const newTemplate = new TodoTemplate({
      title: templateTitle,
      description: templateDescription || "",
      todos: cleanTodos,
      createdBy: (await getUserFromToken())?.id,
    });

    await newTemplate.save();

    revalidatePath("/todos/templates");

    return {
      success: true,
      message: "Template saved successfully",
      templateId: newTemplate._id.toString(),
      template: JSON.parse(JSON.stringify(newTemplate)) 
    };
  } catch (error: any) {
    console.error("Error saving todo template:", error);
    return { success: false, message: error.message };
  }
}

export async function importTodosFromTemplate({
  templateId,
  campaignId,
//   assignedBy,
}: ImportTemplateParams) {
  try {
    await connectToDB();
  const user = await getUserFromToken(); 
    const template = await TodoTemplate.findById(templateId);
    if (!template) {
      return { success: false, message: "Template not found" };
    }
    console.log(template);
    
  const newTodos = await Promise.all(
      template.todos.map(async (t: any) => {
        // ✅ Subtodos can be mapped synchronously since no async call here
        const subtodos = t.subtodo.map((s: any) => ({
          title: s.title,
          description: s.description || "",
          status: "pending",
          assignedBy: user?.id,
        }));

        const newTodo = new Todo({
          title: t.title,
          description: t.description,
          campaignId,
          assignedBy: user?.id,
          status: "pending",
          subtodo: subtodos,
        });

        await newTodo.save();
        return newTodo;
      })
    );
    console.log(newTodos);
    
    revalidatePath(`/campaign/${campaignId}/todos`);

    return {
      success: true,
      message: `Imported ${newTodos.length} todos from template "${template.title}"`,
      count: newTodos.length,
    };
  } catch (error: any) {
    console.error("Error importing todos from template:", error);
    return { success: false, message: error.message };
  }
}

export async function getTemplates() {
  try {
    await connectToDB();

    const templates = await TodoTemplate.find()
      .sort({ createdAt: -1 }).lean();

    return { success: true, templates };
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return { success: false, message: error.message };
  }
}