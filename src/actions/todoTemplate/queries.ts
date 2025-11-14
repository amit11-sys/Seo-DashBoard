"use server";
import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import TodoTemplate from "@/lib/models/todo-template.model";
import Todo from "@/lib/models/todo.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
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

    // const cleanTodos = todos.map((t) => ({
    //   title: t.title,
    //   description: t.description || "",
    //   subtodo:todos,
    //   })),
    // }));

    // const newTemplate = new TodoTemplate({
    //   title: templateTitle,
    //   description: templateDescription || "",
    //   todos: cleanTodos,
    //   createdBy: (await getUserFromToken())?.id,
    // });

    // await newTemplate.save();

    const newTemplate = await TodoTemplate.create({
      title: templateTitle,
      description: templateDescription || "",
      todos,
      createdBy: (await getUserFromToken())?.id,
    });

    revalidatePath("/todos/templates");

    return {
      success: true,
      message: "Template saved successfully",
      templateId: newTemplate._id.toString(),
      template: JSON.parse(JSON.stringify(newTemplate)),
    };
  } catch (error: any) {
    console.error("Error saving todo template:", error);
    return { success: false, message: error.message };
  }
}


export async function SyncTodoTemplate( todoData : any, campaignId : string) {
  try {
    await connectToDB();

    if (!Array.isArray(todoData) || todoData.length === 0) {
      return { success: false, message: "No todos provided" };
    }

    if (!campaignId) {
      return { success: false, message: "Campaign ID is required" };
    }

    // ✅ Find and update the template where the FIRST todo has the matching campaignId
    const updatedTemplate = await TodoTemplate.findOneAndUpdate(
      { "todos.0.campaignId": campaignId },
      { $set: { todos:todoData } },
      { new: true }
    );

    // console.log(updatedTemplate, "SYncupdatedTemplate");
    if (!updatedTemplate) {
      return {
        success: false,
        message: "No template found with this campaign ID in the first todo",
      };
    }

    revalidatePath("/todos/templates");

    return {
      success: true,
      message: "Template updated successfully",
      template: JSON.parse(JSON.stringify(updatedTemplate)),
    };
  } catch (error: any) {
    console.error("Error updating todo template:", error);
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
    console.log(template, campaignId, "templateData");

    const newTodos = await Promise.all(
      template.todos.map(async (t: any) => {
        // ✅ Subtodos can be mapped synchronously since no async call here
        const subtodos = t.subtodo.map((s: any) => ({
          title: s.title,
          description: s.description || "",
          status: s.status ,
          assignedBy: s.assignedBy || user?.id,

         
          assignedTo: s.assignedTo || "",
          assignedAt: new Date().toISOString(),
          _id:`${s._id}-${campaignId}`,
          comment: s.comment || "",
          commentsImgs: s.commentsImgs || [],
        }));

    
        const newTodo = new Todo({
          // _id: t._id,
          title: t.title,
          description: t.description,
          campaignId,
          userId: t.userId,
          assignedAt: t.assignedAt,
          assignedTo: t.assignedTo,
          assignedBy: t.assignedBy,
          status: t.status,
          isTempDisabled: t.isTempDisabled,
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

    const templates = await TodoTemplate.find().sort({ createdAt: -1 }).lean();

    return { success: true, templates };
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return { success: false, message: error.message };
  }
}
export async function getTodoFortemplate(campaignId: string) {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    const userData = await User.findById({ _id: user.id });

    // const { msgTitle, msgDescription, campaignId } = data;
    let newTodo = [];

    if (userData?.role === 2) {
      newTodo = await Todo.find({
        campaignId,
      }).sort({ createdAt: -1 });
    } else {
      newTodo = await Todo.find({
        campaignId,
        assignedTo: user.id,
      }).sort({ createdAt: -1 });
    }

    return {
      success: true,
      message: "Message fetched successfully",
      data: newTodo,
      userRole: userData?.role,
    };
  } catch (error: any) {
    console.error("Error fetching todo:", error);
    return { success: false, message: error.message };
  }
}
