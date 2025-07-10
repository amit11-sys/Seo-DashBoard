// // "use client";
// // import React, { ReactNode, useState } from "react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Checkbox } from "@/components/ui/checkbox";

// // interface TableHeaderitems {
// //   key: string;
// //   label: string;
// //   icon?: ReactNode;
// // }
// // interface TablebodyItems {
// //   select: boolean;
// //   keyword: string;
// //   location: string;
// //   intent: string;
// //   start: string;
// //   page: string;
// //   rank: string;
// //   oneDay: string;
// //   sevenDays: string;
// //   thirtyDays: string;
// //   life: string;
// //   comp: string;
// //   sv: string;
// //   date: string;
// //   rankingUrl: string;
// // }
// // interface CustomTableProps {
// //   tableHeader: TableHeaderitems[];
// //   tableData: TablebodyItems[];
// // }

// // const CustomTable = ({ tableHeader, tableData }: CustomTableProps) => {
// //   const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
// //   const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

// //   const handleStartClick = (index: number) => {
// //     setEditableRowIndex(index);
// //   };

// //   const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
// //     const newValue = e.target.value;
// //     setTableValues((prev) =>
// //       prev.map((row, rowIndex) =>
// //         rowIndex === index ? { ...row, start: newValue } : row
// //       )
// //     );
// //   };

// //   const handleBlur = () => {
// //     setEditableRowIndex(null);
// //   };

// //   return (
// //     <div className="border border-white border-white/10 rounded-xl p-6 overflow-hidden">
// //       <Table className="min-w-full">
// //         <TableHeader className="bg-transparent text-white bg-black">
// //           <TableRow>
// //             {tableHeader.map((header, id) => (
// //               <TableHead
// //                 key={id}
// //                 className="px-4 text-center py-3 border-e-2 text-sm font-semibold text-gray-700"
// //               >
// //                 {header.icon}
// //                 {header.label}
// //               </TableHead>
// //             ))}
// //           </TableRow>
// //         </TableHeader>

// //         <TableBody>
// //           {tableValues.map((data, rowIndex) => (
// //             <TableRow
// //               key={rowIndex}
// //               className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
// //             >
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 <Checkbox />
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.keyword}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.location}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.intent}
// //               </TableCell>

// //               {/* Editable Start Column */}
// //               <TableCell
// //                 className="text-center px-4 py-3 border-e-2 cursor-pointer"
// //                 onClick={() => handleStartClick(rowIndex)}
// //               >
// //                 {editableRowIndex === rowIndex ? (
// //                   <input
// //                     type="text"
// //                     value={data.start}
// //                     onChange={(e) => handleStartChange(e, rowIndex)}
// //                     onBlur={handleBlur}
// //                     onKeyDown={(e) => {
// //                       if (e.key === "Enter") handleBlur();
// //                     }}
// //                     className="w-10 px-1 text-black focus:border-none border-none text-center"
// //                     autoFocus
// //                   />
// //                 ) : (
// //                   data.start
// //                 )}
// //               </TableCell>

// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.page}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.rank}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.oneDay}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.sevenDays}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.thirtyDays}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.life}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.comp}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.sv}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.date}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 border-e-2">
// //                 {data.rankingUrl}
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>
// //     </div>
// //   );
// // };

// // export default CustomTable;

// // "use client";
// // import React, { ReactNode, useState } from "react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Checkbox } from "@/components/ui/checkbox";

// // interface TableHeaderitems {
// //   key: string;
// //   label: string;
// //   icon?: ReactNode;
// // }
// // interface TablebodyItems {
// //   select: boolean;
// //   keyword: string;
// //   location: string;
// //   intent: string;
// //   start: string;
// //   page: string;
// //   rank: string;
// //   oneDay: string;
// //   sevenDays: string;
// //   thirtyDays: string;
// //   life: string;
// //   comp: string;
// //   sv: string;
// //   date: string;
// //   rankingUrl: string;
// // }
// // interface CustomTableProps {
// //   tableHeader: TableHeaderitems[];
// //   tableData: TablebodyItems[];
// // }

// // const CustomTable = ({ tableHeader, tableData }: CustomTableProps) => {
// //   const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
// //   const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

// //   const handleStartClick = (index: number) => {
// //     setEditableRowIndex(index);
// //   };

// //   const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
// //     const newValue = e.target.value;
// //     setTableValues((prev) =>
// //       prev.map((row, rowIndex) =>
// //         rowIndex === index ? { ...row, start: newValue } : row
// //       )
// //     );
// //   };

// //   const handleBlur = () => {
// //     setEditableRowIndex(null);
// //   };

// //   return (
// //     <div className=" border-gray-200  shadow-xl    overflow-x-auto ">
// //       <Table className="min-w-full">
// //         <TableHeader className="bg-gradient-to-r  hover:text-black from-indigo-400 to-purple-500 text-white">
// //           <TableRow>
// //             {tableHeader.map((header, id) => (
// //               <TableHead
// //                 key={id}
// //                 className="px-4   text-center py-3 text-sm font-semibold tracking-wide"
// //               >
// //                 {header.icon && <span className="mr-1">{header.icon}</span>}
// //                 {header.label}
// //               </TableHead>
// //             ))}
// //           </TableRow>
// //         </TableHeader>

// //         <TableBody>
// //           {tableValues.map((data, rowIndex) => (
// //             <TableRow
// //               key={rowIndex}
// //               className="hover:bg-indigo-50 transition-colors"
// //             >
// //               <TableCell className="text-center px-4 py-3">
// //                 <Checkbox />
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3 font-medium">
// //                 {data.keyword}
// //               </TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.location}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.intent}</TableCell>

// //               {/* Editable Start Column */}
// //               <TableCell
// //                 className="text-center px-4 py-3 cursor-pointer"
// //                 onClick={() => handleStartClick(rowIndex)}
// //               >
// //                 {editableRowIndex === rowIndex ? (
// //                   <input
// //                     type="text"
// //                     value={data.start}
// //                     onChange={(e) => handleStartChange(e, rowIndex)}
// //                     onBlur={handleBlur}
// //                     onKeyDown={(e) => {
// //                       if (e.key === "Enter") handleBlur();
// //                     }}
// //                     className="w-14 px-2 text-black text-center rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                     autoFocus
// //                   />
// //                 ) : (
// //                   <span className="font-semibold text-indigo-600">{data.start}</span>
// //                 )}
// //               </TableCell>

// //               <TableCell className="text-center px-4 py-3">{data.page}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.rank}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.oneDay}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.sevenDays}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.thirtyDays}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.life}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.comp}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.sv}</TableCell>
// //               <TableCell className="text-center px-4 py-3">{data.date}</TableCell>
// //               <TableCell className="text-center px-4 py-3">
// //                 <a
// //                   href={data.rankingUrl}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="text-indigo-500 hover:underline"
// //                 >
// //                   View
// //                 </a>
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>
// //     </div>
// //   );
// // };

// // export default CustomTable;

// "use client";
// import React, { ReactNode, useState } from "react";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { BsGlobe } from "react-icons/bs";
// import { FaEdit } from "react-icons/fa";
// import  KeywordEdit  from "./KeywordEdit";
// import DeleteConfirm from "./KeywordDel";

// interface TableHeaderitems {
//   key: string;
//   label: string;
//   icon?: ReactNode;
// }
// interface TablebodyItems {
//   // select: boolean;
//   keyword: string;
//   location: string;
//   intent: string;
//   start: string;
//   page: string;
//   Absolute_Rank: string;
//   Group_Rank: string;
//   oneDay: string;
//   sevenDays: string;
//   thirtyDays: string;
//   life: string;
//   comp: string;
//   sv: string;
//   date: string;
//   rankingUrl: string;
// }
// interface CustomTableProps {
//   tableHeader: TableHeaderitems[];
//   tableData: TablebodyItems[];
// }

// const CustomTable = ({ tableHeader, tableData }: CustomTableProps) => {
//   const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
//   const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

//   const handleStartClick = (index: number) => {
//     setEditableRowIndex(index);
//   };

//   const handleStartChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     const newValue = e.target.value;
//     setTableValues((prev) =>
//       prev.map((row, rowIndex) =>
//         rowIndex === index ? { ...row, start: newValue } : row
//       )
//     );
//   };

//   const handleBlur = () => {
//     setEditableRowIndex(null);
//   };

//   return (
//     <div className="w-full shadow-lg text-black rounded-md mt-4 max-h-96 overflow-x-auto  relative">
//       <table className="min-w-[1000px] w-full table-auto">
//         <thead>
//           <tr className="sticky top-0 bg-gradient-to-r bg-gray-300 text-black  -z-0">
//             {tableHeader.map((header, id) => (
//               <th
//                 key={id}
//                 className="px-4 py-2   text-center text-sm font-medium"
//               >
//                 <div className="">
//                 {header.icon && <span className="mr-1 text-xl">{header.icon}</span>}
//                 {header.label}

//                 </div>
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {tableValues.map((data, rowIndex) => (
//             <tr key={rowIndex} className="hover:bg-indigo-50 transition-colors">
//               {/* <td className="text-center  border p-3">
//                 <Checkbox />
//               </td> */}
//               <td className="text-center border font-medium p-3  ">{data.keyword}</td>
//               <td className="text-center border p-3">{data.location}</td>
//               <td className="text-center border p-3">{data.intent}</td>

//               <td
//                 className="text-center border cursor-pointer p-3"
//                 onClick={() => handleStartClick(rowIndex)}
//               >
//                 {editableRowIndex === rowIndex ? (
//                   <input
//                     type="text"
//                     value={data.start}
//                     onChange={(e) => handleStartChange(e, rowIndex)}
//                     onBlur={handleBlur}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") handleBlur();
//                     }}
//                     className="w-14 px-2 text-black text-center rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     autoFocus
//                   />
//                 ) : (
//                   <span className="font-semibold text-indigo-600">
//                     {data.start}
//                   </span>
//                 )}
//               </td>

//               <td className="text-center border p-3">{data.page}</td>
//               <td className="text-center border p-3">{data.Absolute_Rank}</td>
//               <td className="text-center border p-3">{data.Group_Rank}</td>
//               <td className="text-center border p-3">{data.oneDay}</td>
//               <td className="text-center border p-3">{data.sevenDays}</td>
//               <td className="text-center border p-3">{data.thirtyDays}</td>
//               <td className="text-center border p-3">{data.life}</td>
//               <td className="text-center border p-3">{data.comp}</td>
//               <td className="text-center border p-3">{data.sv}</td>
//               <td className="text-center border p-3">{data.date}</td>
//               <td className="text-center    border p-3">

//                 <div className="flex justify-center w-20overflow-auto items-center">

               
//                 <a
//                   target="_blank"
//                   className="text-blue-600"
//                   href={data.rankingUrl}
//                 >
                  
//                   {/* {data.rankingUrl} */}
//                   view 
//                 </a>

//                 </div>
//               </td>
//               <td className="text-center border p-3">
//                 <div className="flex justify-center items-center">
//                <KeywordEdit/>
//                <DeleteConfirm/>
//                 </div>
                
//               </td>


//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CustomTable;










"use client";

import React, { ReactNode, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { BsGlobe } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import KeywordEdit from "./KeywordEdit";
import DeleteConfirm from "./KeywordDel";

interface TableHeaderitems {
  key: string;
  label: string;
  icon?: ReactNode;
}
interface TablebodyItems {

  keyword: string;
  keywordId:string;
  status : number;
  location: string;
  intent: string;
  start: string;
  page: string;
  Absolute_Rank: string;
  Group_Rank: string;
  oneDay: string;
  sevenDays: string;
  thirtyDays: string;
  life: string;
  comp: string;
  sv: string;
  date: string;
  rankingUrl: string;
}
interface CustomTableProps {
  tableHeader: TableHeaderitems[];
  tableData: TablebodyItems[];
  campaignId: string;
}

const CustomTable = ({ tableHeader, tableData, campaignId }: CustomTableProps) => {
  const [editableRowIndex, setEditableRowIndex] = useState<number | null>(null);
  const [tableValues, setTableValues] = useState<TablebodyItems[]>(tableData);

  const handleStartClick = (index: number) => {
    setEditableRowIndex(index);
  };

  const handleStartChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    setTableValues((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, start: newValue } : row
      )
    );
  };

  const handleBlur = () => {
    setEditableRowIndex(null);
  };

  return (
    <div className="w-full shadow-lg text-black rounded-md mt-4 max-h-96 overflow-x-auto relative">
      <table className="min-w-[1000px] w-full table-auto">
        <thead>
          <tr className="sticky top-0 bg-gradient-to-r bg-gray-300 text-black">
            {tableHeader.map((header, id) => (
              <th key={id} className="px-4 py-2 text-center text-sm font-medium">
                <div className="flex items-center justify-center gap-1">
                  {header.icon && <span className="text-xl">{header.icon}</span>}
                  {header.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableValues.map((data, rowIndex) => {
              // console.log(data,"inside loop data table")
                    const  keywordId = data.keywordId
            return (
             
              <tr key={rowIndex} className="hover:bg-indigo-50 transition-colors">
                <td className="text-center border font-medium p-3">{data.keyword}</td>
                <td className="text-center border p-3">{data.location}</td>
                <td className="text-center border p-3">{data.intent}</td>
  
                <td
                  className="text-center border cursor-pointer p-3"
                  onClick={() => handleStartClick(rowIndex)}
                >
                  {editableRowIndex === rowIndex ? (
                    <input
                      type="text"
                      value={data.start}
                      onChange={(e) => handleStartChange(e, rowIndex)}
                      onBlur={handleBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleBlur();
                      }}
                      className="w-14 px-2 text-black text-center rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <span className="font-semibold text-indigo-600">
                      {data.start}
                    </span>
                  )}
                </td>
  
                <td className="text-center border p-3">{data.page}</td>
                <td className="text-center border p-3">{data.Absolute_Rank}</td>
                <td className="text-center border p-3">{data.Group_Rank}</td>
                <td className="text-center border p-3">{data.oneDay}</td>
                <td className="text-center border p-3">{data.sevenDays}</td>
                <td className="text-center border p-3">{data.thirtyDays}</td>
                <td className="text-center border p-3">{data.life}</td>
                <td className="text-center border p-3">{data.comp}</td>
                <td className="text-center border p-3">{data.sv}</td>
                <td className="text-center border p-3">{data.date}</td>
                <td className="text-center border p-3">
                  <div className="flex justify-center items-center">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      href={data.rankingUrl}
                    >
                      View
                    </a>
                  </div>
                </td>
                <td className="text-center border p-3">
                  <div className="flex justify-center items-center gap-2">
                    <KeywordEdit
                      campaignId={campaignId}
                     keywordId={keywordId}
                      defaultData={{
                        url: data.rankingUrl,
                        keywordTag:'',
                        searchLocation: data.location,
                        volumeLocation: "",
                        language: "English",
                        SearchEngine: "US (google.com)",
                        serpType: "organic",
                        deviceType: "desktop",
                        keywords: [data.keyword],
                      }}
                    />
                    <DeleteConfirm
                      campaignId={campaignId}
                         keywordId={keywordId}
                      keyword={data.keyword}
                     
                    />
                  </div>
                </td>
              </tr>
            )
            
          }

          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
