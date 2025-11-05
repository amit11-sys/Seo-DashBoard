"use server";

import { getUserFromToken } from "@/app/utils/auth";
import { connectToDB } from "@/lib/db";
import Message from "@/lib/models/message.model";
import Todo from "@/lib/models/todo.model";
import User from "@/lib/models/user.model";
interface SaveMessageParams {
  campaignId: string;
  msgTitle: string;
  msgDescription: string;
}
interface SaveTodoParams {
  campaignId: string;
  todoTitle: string;
  todoDescription: string;
  assignedUser:string
}
interface SaveTodoSubParams {
  campaignId: string;
  todoTitle: string;
  todoDescription: string;
  assignedUser:string
  todoId:string
}

export const saveMessage = async (data: SaveMessageParams) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    const { msgTitle, msgDescription, campaignId } = data;

    const newMessage = await Message.create({
      msgTitle,
      msgDescription,
      userId: user.id,
      campaignId,
      postedAt: Date.now(),
    });

    return {
      success: true,
      message: "Message saved successfully",
      data: newMessage,
    };

  } catch (error: any) {
    console.error("Error saving message:", error);
    return {
      success: false,
      error: "Something went wrong while saving the message.",
    };
  }
};
export const deleteMsg = async (msgID: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }


    const newMessage = await Message.deleteOne({
      _id:msgID
    });

    return {
      success: true,
      message: "Message Deleted successfully",
      data: newMessage,
    };

  } catch (error: any) {
    console.error("Error Deleting message:", error);
    return {
      success: false,
      error: "Something went wrong while deleting the message.",
    };
  }
};
export const Messages = async (campaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    // const { msgTitle, msgDescription, campaignId } = data;

    const newMessage = await Message.find({
      campaignId,
        
    });

    return {
      success: true,
      message: "Message fetched successfully",
      data: newMessage,
    };

  } catch (error: any) {
    console.error("Error saving message:", error);
    return {
      success: false,
      error: "Something went wrong while saving the message.",
    };
  }
};
export const Todos = async (campaignId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    // const { msgTitle, msgDescription, campaignId } = data;

    const newTodo = await Todo.find({
      campaignId,
        
    });

    return {
      success: true,
      message: "Message fetched successfully",
      data: newTodo,
    };

  } catch (error: any) {
    console.error("Error saving message:", error);
    return {
      success: false,
      error: "Something went wrong while saving the message.",
    };
  }
};
export const saveTodos = async (data: SaveTodoParams) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }
    console.log(data,"severDatafor todo")
    // const assinedUSerData = await User.findOne({parentAdminId: user.id});
  

    const { todoTitle, todoDescription, campaignId,assignedUser } = data;

     const newTodo = await Todo.create({
     title: todoTitle,
         description: todoDescription,
         userId: user.id,
         campaignId:campaignId,
         assignedAt: Date.now(),
         assignedTo: assignedUser,
         assignedBy: user.id,
        //  subtodo: [],
    });

    console.log(newTodo,"newtototo")


    return {
      success: true,
      message: "todo fetched successfully",
      data: newTodo,
    };

  } catch (error: any) {
    console.error("Error saving message:", error);
    return {
      success: false,
      error: "Something went wrong while saving the message.",
    };
  }
};
export const deleteTodos = async (todoId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }
  



     const deleteTodo = await Todo.deleteOne({
      _id: todoId
    });



    return {
      success: true,
      message: "todo fetched successfully",
      data: deleteTodo,
    };

  } catch (error: any) {
    console.error("Error saving message:", error);
    return {
      success: false,
      error: "Something went wrong while saving the message.",
    };
  }
};
export const UserForTodos = async () => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }
    const assinedUSerData = await User.find({parentAdminId: user.id});
  


    return {
      success: true,
      message: "todo fetched successfully",
      data: assinedUSerData,
    };

  } catch (error: any) {
    console.error("Error saving message:", error);
    return {
      success: false,
      error: "Something went wrong while saving the message.",
    };
  }
};
export const saveSubTodos = async (data: SaveTodoSubParams) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    const { todoId, todoTitle, todoDescription, assignedUser } = data;

    if (!todoId) {
      return {
        success: false,
        error: "Todo ID is required",
      };
    }

    const newSubTodo = {
      title: todoTitle,
      description: todoDescription,
      assignedTo: assignedUser || null,
      assignedBy: user.id,
      assignedAt: new Date(),
      status: "pending",
      _id: new Date().valueOf().toString(), // 👈 unique id for subtask
    };

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { $push: { subtodo: newSubTodo } },
      { new: true } // return updated document
    );

    if (!updatedTodo) {
      return {
        success: false,
        error: "Todo not found",
      };
    }

    return {
      success: true,
      message: "Sub-todo added successfully",
      data: updatedTodo,
    };

  } catch (error: any) {
    console.error("Error saving sub-todo:", error);
    return {
      success: false,
      error: "Something went wrong while saving sub-todo.",
    };
  }
};

export const editSubTodos = async (subTodoId: string , status : string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    // ✅ Update subtodo status in DB
    const updatedTodo = await Todo.findOneAndUpdate(
      { "subtodo._id": subTodoId, userid: user.id },
      { 
        $set: { 
          "subtodo.$.status": status,
        } 
      },
      { new: true }
    );

    if (!updatedTodo) {
      return {
        success: false,
        message: "Sub todo not found",
      };
    }

    return {
      success: true,
      message: "Sub todo marked as Completed successfully",
      data: updatedTodo,
    };

  } catch (error: any) {
    console.error("Error updating sub todo:", error);
    return {
      success: false,
      error: "Something went wrong while updating.",
    };
  }
};
export const deleteSubTodos = async (subTodoId: string) => {
  try {
    await connectToDB();

    const user = await getUserFromToken();
    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please login.",
      };
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { userid: user.id, "subtodo._id": subTodoId },
      {
        $pull: {
          subtodo: { _id: subTodoId }
        }
      },
      { new: true }
    );

    if (!updatedTodo) {
      return {
        success: false,
        message: "Sub todo not found",
      };
    }

    return {
      success: true,
      message: "Sub todo deleted successfully",
      data: updatedTodo,
    };

  } catch (error: any) {
    console.error("Error deleting sub todo:", error);
    return {
      success: false,
      error: "Something went wrong while deleting.",
    };
  }
};



