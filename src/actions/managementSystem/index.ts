import { deleteMsg, deleteSubTodos, deleteTodos, editSubTodos, Messages, saveMessage, saveSubTodos, saveTodos, Todos, UserForTodos } from "./queries";

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

export const getAndSaveMessage = async (data: SaveMessageParams) => {


    const saveddata = await saveMessage(data);

    return saveddata
}
export const fetchMessages = async (campaignId: string) => {


    const saveddata = await Messages(campaignId);

    return saveddata
}
export const getdeleteMsg = async (msgID: string) => {


    const data = await deleteMsg(msgID);

    return data
}
export const fetchTodos = async (campaignId: string) => {


    const saveddata = await Todos(campaignId);

    return saveddata
}
export const getsaveSubTodos = async (data: any) => {


    const saveTodo = await saveSubTodos(data);

    return saveTodo
}
export const fetchUserForTodos = async () => {


    const saveddata = await UserForTodos();

    return saveddata
}
export const getdeleteTodos = async (toDoId : string) => {


    const deleteData = await deleteTodos(toDoId);

    return deleteData
}
export const getAndSaveTodos = async (data: SaveTodoParams) => {


    const saveddata = await saveTodos(data);

    return saveddata
}
export const geteditSubTodos = async (todoId : string, status : string) => {


    const data = await editSubTodos(todoId  , status);

    return data
}
export const getdeleteSubTodos = async (todoId : string) => {


    const data = await deleteSubTodos(todoId);

    return data
}