// import { BsPlus, BsTrash2 } from "react-icons/bs";
// import { MdEdit } from "react-icons/md";
// import { Switch } from "@/components/ui/switch";

// export default function TaskCard({
//   todo,
//   openSubTodoForm,
//   openTodoEditForm,
//   deleteTodo,
//   handleSwitchDisabledChange,
//   openSubDialog,
//   handleDeleteSub,
// }:any) {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
//       {/* Title + actions */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h2
//             className={`text-lg font-semibold ${
//               todo.isTempDisabled ? "text-gray-400 line-through" : ""
//             }`}
//           >
//             {todo.title} {todo.isTempDisabled && "🚫"}
//           </h2>

//           <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
//         </div>

//         {/* Action icons */}
//         <div className="flex gap-3">
//           <BsPlus
//             className="h-5 w-5 text-green-600 cursor-pointer"
//             onClick={() => openSubTodoForm(todo.id)}
//           />

//           <MdEdit
//             className="h-5 w-5 text-blue-500 cursor-pointer"
//             onClick={() => openTodoEditForm(todo)}
//           />

//           <Switch
//             checked={todo.isTempDisabled}
//             onCheckedChange={(checked) => handleSwitchDisabledChange(checked, todo)}
//             className="
//               h-4 w-7 transition-all duration-200
//               data-[state=checked]:bg-orange-500 
//               data-[state=unchecked]:bg-gray-300
//             "
//           />

//           <BsTrash2
//             className="h-5 w-5 text-red-500 cursor-pointer"
//             onClick={() => deleteTodo(todo.id)}
//           />
//         </div>
//       </div>

//       {/* Subtasks */}
//       {todo.subtodos?.length > 0 ? (
//         <div className="mt-4 space-y-2">
//           {todo.subtodos.map((sub:any) => (
//             <div
//               key={sub._id}
//               className="bg-gray-50 border rounded-lg p-3 flex justify-between items-center"
//             >
//               <div>
//                 <p className="text-sm font-medium text-gray-700">
//                   {sub.title}
//                 </p>
//                 <p className="text-xs text-gray-500">{sub.description}</p>
//               </div>

//               <div className="flex gap-3">
//                 <MdEdit
//                   className="h-4 w-4 text-blue-500 cursor-pointer"
//                   onClick={() => openSubDialog(sub)}
//                 />

//                 <BsTrash2
//                   className="h-4 w-4 text-red-500 cursor-pointer"
//                   onClick={() => handleDeleteSub(sub._id)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-xs text-gray-500 mt-3">No subtasks</p>
//       )}
//     </div>
//   );
// }








// import { BsPlus, BsTrash2 } from "react-icons/bs";
// import { MdEdit } from "react-icons/md";
// import { Switch } from "@/components/ui/switch";

// export default function TaskCard({
//   todo,
//   openSubTodoForm,
//   openTodoEditForm,
//   deleteTodo,
//   handleSwitchDisabledChange,
//   openSubDialog,
//   handleDeleteSub,
// }: any) {
//   return (
//     <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-xl transition-shadow duration-300">
//       {/* Title + actions */}
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex-1">
//           <h2
//             className={`text-xl font-bold text-gray-800 ${
//               todo.isTempDisabled ? "text-gray-500 line-through" : ""
//             }`}
//           >
//             {todo.title} {todo.isTempDisabled && "🚫"}
//           </h2>
//           <p className="text-sm text-gray-600 mt-2 leading-relaxed">{todo.description}</p>
//         </div>

//         {/* Action icons */}
//         <div className="flex gap-4 ml-4">
//           <BsPlus
//             className="h-6 w-6 text-green-500 cursor-pointer hover:text-green-700 transition-colors"
//             onClick={() => openSubTodoForm(todo.id)}
//           />

//           <MdEdit
//             className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
//             onClick={() => openTodoEditForm(todo)}
//           />

//           <Switch
//             checked={todo.isTempDisabled}
//             onCheckedChange={(checked) => handleSwitchDisabledChange(checked, todo)}
//             className="
//               h-5 w-8 transition-all duration-300
//               data-[state=checked]:bg-orange-400 
//               data-[state=unchecked]:bg-gray-400
//             "
//           />

//           <BsTrash2
//             className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
//             onClick={() => deleteTodo(todo.id)}
//           />
//         </div>
//       </div>

//       {/* Subtasks */}
//       {todo.subtodos?.length > 0 ? (
//         <div className="mt-6 space-y-3">
//           {todo.subtodos.map((sub: any) => (
//             <div
//               key={sub._id}
//               className="bg-white border border-gray-300 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex-1">
//                 <p className="text-sm font-semibold text-gray-800">
//                   {sub.title}
//                 </p>
//                 <p className="text-xs text-gray-600 mt-1">{sub.description}</p>
//               </div>

//               <div className="flex gap-3 ml-4">
//                 <MdEdit
//                   className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
//                   onClick={() => openSubDialog(sub)}
//                 />

//                 <BsTrash2
//                   className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
//                   onClick={() => handleDeleteSub(sub._id)}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-xs text-gray-500 mt-4 italic">No subtasks yet</p>
//       )}
//     </div>
//   );
// }









import { BsPlus, BsTrash2 } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TaskCard({
  todo,
  openSubTodoForm,
  openTodoEditForm,
  deleteTodo,
  handleSwitchDisabledChange,
  openSubDialog,
  handleDeleteSub,
}: any) {
  return (
    <div className="bg-gray-100 mt-3 rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Header with title and description */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2
            className={` text-lg font-semibold  ${
              todo.isTempDisabled ? "text-gray-300 line-through" : "text-gray-800"
            }`}
            //  className={``}
          >
            {todo.title} {todo.isTempDisabled && "🚫"}
          </h2>
          <Switch
            checked={todo.isTempDisabled}
            onCheckedChange={(checked) => handleSwitchDisabledChange(checked, todo)}
            className="
              h-4 w-7 transition-all duration-200
              data-[state=checked]:bg-orange-500 
              data-[state=unchecked]:bg-gray-300
            "
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{todo.description}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mb-4">
        <BsPlus
          className="h-5 w-5 text-green-600 cursor-pointer hover:text-green-700 transition-colors"
          onClick={() => openSubTodoForm(todo.id)}
        />
        <MdEdit
          className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
          onClick={() => openTodoEditForm(todo)}
        />
        <BsTrash2
          className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
          onClick={() => deleteTodo(todo.id)}
        />
      </div>

      {/* Subtasks */}
      <div className="border-t border-gray-200 pt-4">
        {todo.subtodos?.length > 0 ? (
          <>
          <ScrollArea className="space-y-2 h-[200px]">
            {todo.subtodos.map((sub: any) => (
              <li
                key={sub._id}
                className="flex my-2 items-center justify-between bg-gray-50 rounded-2xl p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className={`${
                sub.status === "Completed"
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              } text-sm font-medium text-gray-700`}>
                    {sub.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{sub.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {/* we have pending, in progress and completed status add colro acording to its name */}
                  <div className="flex justify-center items-center">

                   <span className={`
                    ${sub.status === "Pending" ? "text-yellow-500" : 
                    sub.status === "In Progress" ? "text-blue-500" : 
                    "text-green-500"}
                    font-semibold text-[8px]`}>
                    {sub.status}
                  </span>
                  </div>
                  <MdEdit
                    className="h-4 w-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                    onClick={() => openSubDialog(sub)}
                  />
                  <BsTrash2
                    className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                    onClick={() => handleDeleteSub(sub._id)}
                  />
                </div>
              </li>
            ))}
          </ScrollArea>
          
          </>
        ) : (
          <p className="text-xs text-gray-500 italic">No subtasks</p>
        )}
      </div>
    </div>
  );
}
