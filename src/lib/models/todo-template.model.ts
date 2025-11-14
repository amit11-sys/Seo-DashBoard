// import mongoose, { Schema, Document, Types } from "mongoose";

// interface ISubTodoTemplate {
//   title: string;
//   description?: string;
// }

// interface ITodoTemplate {
//   title: string;
//   description?: string;
//   createdBy: Types.ObjectId;
//   todos: {
//     title: string;
//     description?: string;
//     subtodo: ISubTodoTemplate[];
//   }[];
// }

// export interface ITodoTemplateDocument extends ITodoTemplate, Document {}

// const subTodoTemplateSchema = new Schema<ISubTodoTemplate>({
//   title: { type: String, required: true },
//   description: { type: String },
// });

// const todoTemplateSchema = new Schema<ITodoTemplateDocument>(
//   {
//     title: { type: String, required: true },
//     description: { type: String },
//     createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     todos: [
//       {
//         title: { type: String, required: true },
//         description: { type: String },
//         subtodo: [subTodoTemplateSchema],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const TodoTemplate =
//   mongoose.models.TodoTemplate ||
//   mongoose.model<ITodoTemplateDocument>("TodoTemplate", todoTemplateSchema);

// export default TodoTemplate;



import mongoose, { Schema, Document, Types } from "mongoose";

// ✅ SubTodo Interface
interface ISubTodoTemplate {
  title: string;
  description?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  status?: string;
  comment?: string;
  commentsImgs?: string[];
}

// ✅ Main Todo Interface
interface ITodoTemplate {
  title: string;
  description?: string;
  createdBy: Types.ObjectId;
  todos: {
    title: string;
    description?: string;
    todoId?: Types.ObjectId;
    userId?: Types.ObjectId;
    campaignId?: string;
    assignedAt?: string;
    assignedTo?: string;
    assignedBy?: string;
    status?: string;
    isTempDisabled?: boolean;
    subtodo: ISubTodoTemplate[];
  }[];
}

// ✅ Document Interface
export interface ITodoTemplateDocument extends ITodoTemplate, Document {}

// ✅ SubTodo Schema
const subTodoTemplateSchema = new Schema<ISubTodoTemplate>({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: String },
  assignedBy: { type: String },
  assignedAt: { type: String },
  status: { type: String },
  comment: { type: String },
  commentsImgs: [{ type: String }],
});

// ✅ Todo Schema
const todoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  todoId: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId },
  campaignId: { type: String },
  assignedAt: { type: String },
  assignedTo: { type: String },
  assignedBy: { type: String },
  status: { type: String },
  isTempDisabled: { type: Boolean, default: false },
  subtodo: [subTodoTemplateSchema],
});

// ✅ TodoTemplate Schema
const todoTemplateSchema = new Schema<ITodoTemplateDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    todos: [],
  },
  { timestamps: true }
);

// ✅ Model
const TodoTemplate =
  mongoose.models.TodoTemplate ||
  mongoose.model<ITodoTemplateDocument>("TodoTemplate", todoTemplateSchema);

export default TodoTemplate;
