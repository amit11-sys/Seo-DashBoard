import { deleteMsg, deleteSubTodos, deleteTodos, editMainTodos, editSubTodos, fetchSingleTodos, Messages, saveMessage, saveSubTodos, saveTodos, Todos, todoTempDisabled, UserForTodos } from "./queries";

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
export const gettodoTempDisabled = async (toDoId : string) => {


    const deleteData = await todoTempDisabled(toDoId);

    return deleteData
}
export const getAndSaveTodos = async (data: SaveTodoParams) => {


    const saveddata = await saveTodos(data);

    return saveddata
}
export const geteditSubTodos = async ({ id, status, description, comment,subtaskTitle }:{ id: string, status: string, description: string, comment: string ,subtaskTitle:string}) => {


    const data = await editSubTodos({ id, status, description, comment ,subtaskTitle});

    return data
}
export const geteditMainTodos = async ({ id, description,subtaskTitle }:{ id: string, description: string,subtaskTitle:string}) => {


    const data = await editMainTodos({ id, description ,subtaskTitle});

    return data
}
export const getdeleteSubTodos = async (todoId : string) => {


    const data = await deleteSubTodos(todoId);

    return data
}

// +++++++++++++++++++++++++++++++
export const getfetchSingleTodos = async (todoId : string) => {


    const data = await fetchSingleTodos(todoId);

    return data
}