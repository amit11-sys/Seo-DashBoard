import mongoose, { Schema, Document, Types } from "mongoose";

interface ISubTodoTemplate {
  title: string;
  description?: string;
}

interface ITodoTemplate {
  title: string;
  description?: string;
  createdBy: Types.ObjectId;
  todos: {
    title: string;
    description?: string;
    subtodo: ISubTodoTemplate[];
  }[];
}

export interface ITodoTemplateDocument extends ITodoTemplate, Document {}

const subTodoTemplateSchema = new Schema<ISubTodoTemplate>({
  title: { type: String, required: true },
  description: { type: String },
});

const todoTemplateSchema = new Schema<ITodoTemplateDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    todos: [
      {
        title: { type: String, required: true },
        description: { type: String },
        subtodo: [subTodoTemplateSchema],
      },
    ],
  },
  { timestamps: true }
);

const TodoTemplate =
  mongoose.models.TodoTemplate ||
  mongoose.model<ITodoTemplateDocument>("TodoTemplate", todoTemplateSchema);

export default TodoTemplate;
