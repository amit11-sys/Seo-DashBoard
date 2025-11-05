// "use client";

// import { useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { BsPlus, BsTrash2 } from "react-icons/bs";

// function TodoAccordion({ todos, onEditSub, onDeleteSub }) {
//   const [selectedSub, setSelectedSub] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);

//   const openSubDialog = (sub) => {
//     setSelectedSub(sub);
//     setOpenDialog(true);
//   };

//   return (
//     <>
//       {/* ✅ Todo Accordions */}
//       <Accordion type="multiple" className="w-full">
//         {todos?.map((todo) => (
//           <AccordionItem key={todo.id} value={todo.id}>
//             <AccordionTrigger className="bg-gray-100 p-3 rounded-md font-semibold">
//               {todo.title}  
//               {/* ✅ Add Sub-Todo & Delete Icons */}
//                <div className="flex gap-3">
//                   <BsPlus
//                     className="h-4 w-4 text-green-600 cursor-pointer"
//                     onClick={() => openSubTodoForm(todo.id)}
//                   />
//                   <BsTrash2
//                     className="h-4 w-4 text-red-500 cursor-pointer"
//                     onClick={() => deleteTodo(todo.id)}
//                   />
//                 </div>
//             </AccordionTrigger>

//             <AccordionContent className="pl-4">
//               {todo.subtodos?.length > 0 ? (
//                 <ul className="space-y-1 mt-2">
//                   {todo.subtodos.map((sub) => (
//                     <li
//                       key={sub._id}
//                       onClick={() => openSubDialog(sub)}
//                       className="cursor-pointer bg-gray-50 hover:bg-gray-100 p-2 rounded text-sm border"
//                     >
//                       {sub.title} 
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-xs text-gray-500">No Sub Tasks</p>
//               )}
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>

//       {/* ✅ SubTask Dialog */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent className="bg-white">
//           <DialogHeader>
//             <DialogTitle>{selectedSub?.title}</DialogTitle>
//           </DialogHeader>

//           <p className="text-sm text-gray-700 mt-2">
//             {selectedSub?.description}
//           </p>

//           <div className="mt-3 text-xs text-gray-500 border-t pt-2">
//             Assigned To:
//             <span className="font-medium">
//               {" "}
//               {selectedSub?.assignedTo || "Not assigned"}
//             </span>
//           </div>

//           <DialogFooter className="mt-4 flex gap-2 justify-end">
//             <Button
//               variant="outline"
//               onClick={() => onEditSub && onEditSub(selectedSub)}
//             >
//               Edit
//             </Button>

//             <Button
//               variant="destructive"
//               onClick={() => onDeleteSub && onDeleteSub(selectedSub)}
//             >
//               Delete
//             </Button>

//             <Button onClick={() => setOpenDialog(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default TodoAccordion;
