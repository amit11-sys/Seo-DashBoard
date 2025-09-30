// import React, { useEffect, useState } from "react";
// import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
// import CountUp from "react-countup";

// const metrics = [
//   {
//     label: "Total Clicks",
//     icon: <FaMousePointer className="text-4xl text-indigo-500 animate-bounce" />,
//     colors: "from-indigo-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "clicks",
//   },
//   {
//     label: "Total Impressions",
//     icon: <FaEye className="text-4xl text-green-500 animate-spin-slow" />,
//     colors: "from-green-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "impressions",
//   },
//   {
//     label: "Total CTR",
//     icon: <FaCheckCircle className="text-4xl text-purple-500 animate-pulse" />,
//     colors: "from-purple-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "ctr",
//   },
//   {
//     label: "Average Position",
//     icon: <FaChartLine className="text-4xl text-yellow-500 animate-bounce-slow" />,
//     colors: "from-yellow-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "position",
//   },
// ];

// const DashboardStats = ({ analyticData }: any) => {
//   const [loadAnim, setLoadAnim] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoadAnim(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <style>
//         {`
//           @keyframes spin-slow {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           .animate-spin-slow {
//             animation: spin-slow 6s linear infinite;
//           }
//           @keyframes bounce-slow {
//             0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
//             50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
//           }
//           .animate-bounce-slow {
//             animation: bounce-slow 3s infinite;
//           }
//           .fade-in-up {
//             opacity: 0;
//             transform: translateY(20px);
//             animation-fill-mode: forwards;
//             animation-duration: 0.6s;
//             animation-timing-function: cubic-bezier(0.4,0,0.2,1);
//             animation-name: fadeInUp;
//           }
//           @keyframes fadeInUp {
//             to {
//               opacity: 1;
//               transform: translateY(0);
//               opacity: 1;
//             }
//           }
//         `}
//       </style>

//       <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {metrics.map((metric, idx) => (
//           <div
//             key={metric.label}
//             className={`relative ${metric.gradient} ${metric.colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between h-44 transition-transform hover:scale-[1.02] ${
//               loadAnim ? "fade-in-up" : ""
//             }`}
//             style={{ animationDelay: `${idx * 200}ms` }}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-gray-700">{metric.label}</h3>
//               {metric.icon}
//             </div>
//             <div className="space-y-2 text-gray-800">
//               {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
//                 <p key={index} className="text-xl font-extrabold">
//                   {metric.field === "ctr" || metric.field === "position" ? (
//                     <>
//                       {item[metric.field]}
//                       <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//                     </>
//                   ) : (
//                     <>
//                       <CountUp end={item[metric.field]} duration={1.5} />
//                       <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//                     </>
//                   )}
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default DashboardStats;




// import React, { useEffect, useState } from "react";
// import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
// import CountUp from "react-countup";

// const metrics = [
//   {
//     label: "Total Clicks",
//     icon: <FaMousePointer className="text-4xl text-indigo-500 animate-bounce" />,
//     colors: "from-indigo-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "clicks",
//   },
//   {
//     label: "Total Impressions",
//     icon: <FaEye className="text-4xl text-green-500 animate-spin-slow" />,
//     colors: "from-green-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "impressions",
//   },
//   {
//     label: "Total CTR",
//     icon: <FaCheckCircle className="text-4xl text-purple-500 animate-pulse" />,
//     colors: "from-purple-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "ctr",
//   },
//   {
//     label: "Average Position",
//     icon: <FaChartLine className="text-4xl text-yellow-500 animate-bounce-slow" />,
//     colors: "from-yellow-100 to-white",
//     gradient: "bg-gradient-to-br",
//     field: "position",
//   },
// ];

// const DashboardStatsCollage = ({ analyticData }: any) => {
//   const [loadAnim, setLoadAnim] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoadAnim(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <style>
//         {`
//           @keyframes spin-slow {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           .animate-spin-slow {
//             animation: spin-slow 6s linear infinite;
//           }
//           @keyframes bounce-slow {
//             0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
//             50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
//           }
//           .animate-bounce-slow {
//             animation: bounce-slow 3s infinite;
//           }
//           .fade-in-up {
//             opacity: 0;
//             transform: translateY(20px);
//             animation-fill-mode: forwards;
//             animation-duration: 0.6s;
//             animation-timing-function: cubic-bezier(0.4,0,0.2,1);
//             animation-name: fadeInUp;
//           }
//           @keyframes fadeInUp {
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>

//       <div className="w-full px-4 py-8 grid grid-cols-12 grid-rows-6 gap-4 relative">
        
//         {/* Total Clicks - Large top-left */}
//         <div
//           className={`col-span-6 row-span-3 ${metrics[0].gradient} ${metrics[0].colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//             loadAnim ? "fade-in-up" : ""
//           }`}
//           style={{ animationDelay: `0ms` }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-gray-700">{metrics[0].label}</h3>
//             {metrics[0].icon}
//           </div>
//           <div className="space-y-2 text-gray-800">
//             {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
//               <p key={index} className="text-2xl font-extrabold">
//                 <CountUp end={item[metrics[0].field]} duration={1.5} />{" "}
//                 <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//               </p>
//             ))}
//           </div>
//         </div>

//         {/* Total Impressions - Tall right */}
//         <div
//           className={`col-span-6 row-span-4 ${metrics[1].gradient} ${metrics[1].colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//             loadAnim ? "fade-in-up" : ""
//           }`}
//           style={{ animationDelay: `200ms` }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-gray-700">{metrics[1].label}</h3>
//             {metrics[1].icon}
//           </div>
//           <div className="space-y-2 text-gray-800">
//             {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
//               <p key={index} className="text-2xl font-extrabold">
//                 <CountUp end={item[metrics[1].field]} duration={1.5} />{" "}
//                 <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//               </p>
//             ))}
//           </div>
//         </div>

//         {/* Total CTR - Bottom-left */}
//         <div
//           className={`col-span-4 row-span-3 ${metrics[2].gradient} ${metrics[2].colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//             loadAnim ? "fade-in-up" : ""
//           }`}
//           style={{ animationDelay: `400ms` }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-gray-700">{metrics[2].label}</h3>
//             {metrics[2].icon}
//           </div>
//           <div className="space-y-2 text-gray-800">
//             {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
//               <p key={index} className="text-2xl font-extrabold">
//                 {item[metrics[2].field]}{" "}
//                 <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//               </p>
//             ))}
//           </div>
//         </div>

//         {/* Average Position - Bottom-center */}
//         <div
//           className={`col-span-4 row-span-3 ${metrics[3].gradient} ${metrics[3].colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//             loadAnim ? "fade-in-up" : ""
//           }`}
//           style={{ animationDelay: `600ms` }}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-gray-700">{metrics[3].label}</h3>
//             {metrics[3].icon}
//           </div>
//           <div className="space-y-2 text-gray-800">
//             {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
//               <p key={index} className="text-2xl font-extrabold">
//                 {item[metrics[3].field]}{" "}
//                 <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//               </p>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default DashboardStatsCollage;




// import React, { useEffect, useState } from "react";
// import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
// import CountUp from "react-countup";

// const metrics = [
//   {
//     label: "Total Clicks",
//     icon: <FaMousePointer className="text-4xl text-indigo-500 animate-bounce" />,
//     colors: "from-indigo-100 to-indigo-600",
//     gradient: "bg-gradient-to-br",
//     field: "clicks",
//   },
//   {
//     label: "Total Impressions",
//     icon: <FaEye className="text-4xl text-green-500 animate-spin-slow" />,
//     colors: "from-green-100 to-green-600",
//     gradient: "bg-gradient-to-br",
//     field: "impressions",
//   },
//   {
//     label: "Total CTR",
//     icon: <FaCheckCircle className="text-4xl text-purple-500 animate-pulse" />,
//     colors: "from-purple-100 to-purple-600",
//     gradient: "bg-gradient-to-br",
//     field: "ctr",
//   },
//   {
//     label: "Average Position",
//     icon: <FaChartLine className="text-4xl text-yellow-500 animate-bounce-slow" />,
//     colors: "from-yellow-100 to-yellow-600",
//     gradient: "bg-gradient-to-br",
//     field: "position",
//   },
// ];

// const DashboardStatsCollage = ({ analyticData }: any) => {
//   const [loadAnim, setLoadAnim] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoadAnim(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <style>
//         {`
//           /* Your keyframes and animations here */
//           /* Same styles as before */
//         `}
//       </style>

//       <div className="w-full px-4 py-8 grid grid-cols-2 gap-4">
        
//         {metrics.map((metric, index) => (
//           <div
//             key={index}
//             className={`col-span-1 ${metric.gradient} ${metric.colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//               loadAnim ? "fade-in-up" : ""
//             }`}
//             style={{ animationDelay: `${index * 200}ms` }}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-gray-700">{metric.label}</h3>
//               {metric.icon}
//             </div>
//             <div className="space-y-2 text-gray-800">
//               {analyticData?.analyticData?.monthWise?.map((item: any, idx: number) => (
//                 <p key={idx} className="text-2xl font-extrabold">
//                   {metric.field === 'ctr' 
//                     ? item[metric.field].toFixed(10) 
//                     : item[metric.field]
//                   }{" "}
//                   <span className="text-xs text-gray-500 ml-1">({item.month})</span>
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default DashboardStatsCollage;



// import React, { useEffect, useState } from "react";
// import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
// import CountUp from "react-countup";

// const metrics = [
//   {
//     label: "Total Clicks",
//     icon: <FaMousePointer className="text-4xl text-indigo-600 animate-bounce" />,
//     colors: "from-indigo-100 to-indigo-600",
//     gradient: "bg-gradient-to-br",
//     field: "clicks",
//   },
//   {
//     label: "Total Impressions",
//     icon: <FaEye className="text-4xl text-green-600 animate-spin-slow" />,
//     colors: "from-green-100 to-green-600",
//     gradient: "bg-gradient-to-br",
//     field: "impressions",
//   },
//   {
//     label: "Total CTR",
//     icon: <FaCheckCircle className="text-4xl text-purple-600 animate-pulse" />,
//     colors: "from-purple-100 to-purple-600",
//     gradient: "bg-gradient-to-br",
//     field: "ctr",
//   },
//   {
//     label: "Average Position",
//     icon: <FaChartLine className="text-4xl text-yellow-600 animate-bounce-slow" />,
//     colors: "from-yellow-100 to-yellow-600",
//     gradient: "bg-gradient-to-br",
//     field: "position",
//   },
// ];

// const DashboardStatsCollage = ({ analyticData }: any) => {
//   const [loadAnim, setLoadAnim] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoadAnim(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <style>
//         {`
//           @keyframes spin-slow {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           .animate-spin-slow {
//             animation: spin-slow 6s linear infinite;
//           }
//           @keyframes bounce-slow {
//             0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
//             50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
//           }
//           .animate-bounce-slow {
//             animation: bounce-slow 3s infinite;
//           }
//           .fade-in-up {
//             opacity: 0;
//             transform: translateY(20px);
//             animation-fill-mode: forwards;
//             animation-duration: 0.6s;
//             animation-timing-function: cubic-bezier(0.4,0,0.2,1);
//             animation-name: fadeInUp;
//           }
//           @keyframes fadeInUp {
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>

//       <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {metrics.map((metric, index) => (
//           <div
//             key={index}
//             className={`${metric.gradient} ${metric.colors} backdrop-blur-md shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//               loadAnim ? "fade-in-up" : ""
//             }`}
//             style={{ animationDelay: `${index * 200}ms` }}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-bold text-gray-700">{metric.label}</h3>
//               {metric.icon}
//             </div>
//             <div className="space-y-2 text-gray-800">
//               {analyticData?.analyticData?.monthWise?.map((item: any, idx: number) => (
//                 <p key={idx} className="text-2xl font-extrabold">
//                   {metric.field === "ctr" || metric.field === "position" ? (
//                     <>
//                       {item[metric.field]}
//                       <span className="text-xs text-gray-100 ml-1">({item.month})</span>
//                     </>
//                   ) : (
//                     <>
//                       <CountUp end={item[metric.field]} duration={1.5} />
//                       <span className="text-xs text-gray-100 ml-1">({item.month})</span>
//                     </>
//                   )}
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default DashboardStatsCollage;








// import React, { useEffect, useMemo, useState } from "react";
// import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
// import CountUp from "react-countup";

// const metrics = [
//   {
//     label: "Total Clicks",
//     icon: <FaMousePointer className="text-4xl text-black animate-bounce" />,
//     gradient: "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200",
//     field: "clicks",
//     isFloat: false,
//   },
//   {
//     label: "Total Impressions",
//     icon: <FaEye className="text-4xl text-black animate-spin-slow" />,
//     gradient: "bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200",
//     field: "impressions",
//     isFloat: false,
//   },
//   {
//     label: "Total CTR",
//     icon: <FaCheckCircle className="text-4xl text-black animate-pulse" />,
//     gradient: "bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200",
//     field: "ctr",
//     isFloat: true,
//     suffix: "%",
//   },
//   {
//     label: "Average Position",
//     icon: <FaChartLine className="text-4xl text-black animate-bounce-slow" />,
//     gradient: "bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200",
//     field: "position",
//     isFloat: true,
//   },
// ];


// type Row = {
//   keys?: string[];
//   clicks: number;
//   impressions: number;
//   ctr: number;
//   position: number;
// };

// type MonthWiseItem = {
//   month: string;
//   clicks: number;
//   impressions: number;
//   ctr: number;
//   position: number;
// };

// type Props =
//   | {
//       // old shape
//       analyticData?: {
//         analyticData?: {
//           monthWise?: MonthWiseItem[];
//         };
//       };
//     }
//   | Row[] // new/raw rows shape
//   | {
//       monthWise?: MonthWiseItem[];
//       dateWise?: any[];
//     };

// const DashboardStatsCollage = ({ analyticData }: { analyticData: any }) => {
//   const [loadAnim, setLoadAnim] = useState(false);

//   // 1) Normalize input
//   const { monthWise, rows } = useMemo(() => {
//     // Array of rows (your country data)
//     if (Array.isArray(analyticData)) {
//       return { rows: analyticData as Row[], monthWise: undefined };
//     }

//     // object with monthWise/dateWise
//     if (
//       analyticData &&
//       typeof analyticData === "object" &&
//       ("monthWise" in analyticData || "dateWise" in analyticData)
//     ) {
//       const obj = analyticData as { monthWise?: MonthWiseItem[] };
//       return { rows: undefined, monthWise: obj.monthWise };
//     }

//     // old nested analyticData.analyticData.monthWise
//     const nested =
//       (analyticData as any)?.analyticData?.analyticData?.monthWise ??
//       (analyticData as any)?.analyticData?.monthWise ??
//       (analyticData as any)?.monthWise;

//     if (nested) return { rows: undefined, monthWise: nested as MonthWiseItem[] };

//     return { rows: undefined, monthWise: undefined };
//   }, [analyticData]);

//   // 2) If we only have raw rows, compute totals
//   const totals = useMemo(() => {
//     if (!rows) return null;

//     const clicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
//     const impressions = rows.reduce((s, r) => s + (r.impressions || 0), 0);
//     const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0; // percentage
//     // weighted avg position by impressions
//     const position =
//       impressions > 0
//         ? rows.reduce((s, r) => s + r.position * r.impressions, 0) /
//           impressions
//         : 0;

//     return { clicks, impressions, ctr, position };
//   }, [rows]);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoadAnim(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const renderValue = (value: number, isFloat: boolean, suffix?: string) => {
//     if (isFloat) {
//       return (
//         <span className="text-2xl font-extrabold">
//           {value.toFixed(2)}
//           {suffix ?? ""}
//         </span>
//       );
//     }
//     return (
//       <CountUp
//         end={value}
//         duration={1.5}
//         separator=","
//         className="text-2xl font-extrabold"
//       />
//     );
//   };

//   return (
//     <>
//       <style>
//         {`
//           @keyframes spin-slow {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//           .animate-spin-slow {
//             animation: spin-slow 6s linear infinite;
//           }
//           @keyframes bounce-slow {
//             0%, 100% { transform: translateY(-5%); }
//             50% { transform: translateY(0); }
//           }
//           .animate-bounce-slow {
//             animation: bounce-slow 3s infinite;
//           }
//           .fade-in-up {
//             opacity: 0;
//             transform: translateY(20px);
//             animation: fadeInUp 0.6s forwards;
//           }
//           @keyframes fadeInUp {
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }
//         `}
//       </style>

//       <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {metrics.map((metric, index) => {
//           return (
//             <div
//               key={index}
//               className={`${metric.gradient} text-black cursor-pointer shadow-xl rounded-xl px-6 py-5 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//                 loadAnim ? "fade-in-up" : ""
//               }`}
//               style={{ animationDelay: `${index * 200}ms` }}
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-lg font-bold">{metric.label}</h3>
//                 {metric.icon}
//               </div>

//               <div className="text-lg font-semibold space-y-2">
//                 {/* Case 1: We have monthWise -> list per month */}
//                 {monthWise?.length
//                   ? monthWise.map((item, idx) => (
//                       <div key={idx} className="flex justify-between items-center">
//                         <span className="text-sm opacity-90">{item.month}</span>
//                         {renderValue(
//                           metric.field === "ctr"
//                             ? item.ctr * 100 // assuming ctr is ratio (0-1)
//                             : (item as any)[metric.field],
//                           metric.isFloat,
//                           metric.suffix
//                         )}
//                       </div>
//                     ))
//                   : // Case 2: Only rows -> show totals
//                     totals && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm opacity-90">Total</span>
//                         {renderValue(
//                           (totals as any)[metric.field],
//                           metric.isFloat,
//                           metric.suffix
//                         )}
//                       </div>
//                     )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default DashboardStatsCollage;












import React, { useEffect, useMemo, useState } from "react";
import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
import CountUp from "react-countup";

const metrics = [
  { label: "Total Clicks", icon: <FaMousePointer className="text-4xl animate-bounce" />, field: "clicks", isFloat: false },
  { label: "Total Impressions", icon: <FaEye className="text-4xl animate-spin-slow" />, field: "impressions", isFloat: false },
  { label: "Total CTR", icon: <FaCheckCircle className="text-4xl animate-pulse" />, field: "ctr", isFloat: true, suffix: "%" },
  { label: "Average Position", icon: <FaChartLine className="text-4xl animate-bounce-slow" />, field: "position", isFloat: true },
];

type Row = { clicks: number; impressions: number; ctr: number; position: number };

interface Props {
  analyticData: {
    normalData: Row[];
    compareData?: Row[];
    date?: any;
  };
}

// const DashboardStatsCompare = ({ analyticData }: Props) => {

//   console.log(analyticData, "analyticDataInCards");
//   const [loadAnim, setLoadAnim] = useState(false);

//   // Compute totals for both normal and compare
//   const { normalTotals, compareTotals } = useMemo(() => {
//     const calcTotals = (rows: Row[] | undefined) => {
//       if (!rows || rows.length === 0) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
//       const clicks = rows.reduce((s, r) => s + r.clicks, 0);
//       const impressions = rows.reduce((s, r) => s + r.impressions, 0);
//       const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
//       const position = impressions > 0 ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : 0;
//       return { clicks, impressions, ctr, position };
//     };

//     return {
//       normalTotals: calcTotals(analyticData.normalData),
//       compareTotals: calcTotals(analyticData.compareData),
//     };
//   }, [analyticData]);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoadAnim(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const renderValue = (value: number, isFloat: boolean, suffix?: string) => {
//     if (isFloat) return <span className="text-2xl font-extrabold">{value.toFixed(2)}{suffix ?? ""}</span>;
//     return <CountUp end={value} duration={1.5} separator="," className="text-2xl font-extrabold" />;
//   };

//   return (
//     <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {metrics.map((metric, index) => (
//         <div
//           key={index}
//           className={`bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 text-black shadow-xl rounded-xl px-6 py-5 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
//             loadAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//           }`}
//           style={{ animationDelay: `${index * 200}ms` }}
//         >
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-bold">{metric.label}</h3>
//             {metric.icon}
//           </div>

//           <div className="text-lg font-semibold space-y-2">
//             {analyticData.compareData && analyticData.compareData.length > 0 ? (
//               <>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm opacity-80">Current</span>
//                   {renderValue((normalTotals as any)[metric.field], metric.isFloat, metric.suffix)}
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm opacity-60">Compare</span>
//                   {renderValue((compareTotals as any)[metric.field], metric.isFloat, metric.suffix)}
//                 </div>
//               </>
//             ) : (
//               <div className="flex justify-between items-center">
//                 <span className="text-sm opacity-90">Total</span>
//                 {renderValue((normalTotals as any)[metric.field], metric.isFloat, metric.suffix)}
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
const DashboardStatsCompare = ({ analyticData }: Props) => {
  // console.log(analyticData, "analyticDataInCards");
  const [loadAnim, setLoadAnim] = useState(false);

  const { normalTotals, compareTotals } = useMemo(() => {
    const calcTotals = (rows: Row[] | undefined) => {
      if (!rows || rows.length === 0) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      const clicks = rows.reduce((s, r) => s + r.clicks, 0);
      const impressions = rows.reduce((s, r) => s + r.impressions, 0);
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const position = impressions > 0 ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : 0;
      return { clicks, impressions, ctr, position };
    };

    return {
      normalTotals: calcTotals(analyticData?.normalData),
      compareTotals: calcTotals(analyticData?.compareData),
    };
  }, [analyticData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadAnim(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderValue = (value: number, isFloat: boolean, suffix?: string) => {
    if (isFloat) return <span className="text-2xl font-extrabold">{value.toFixed(2)}{suffix ?? ""}</span>;
    return <CountUp end={value} duration={1.5} separator="," className="text-2xl font-extrabold" />;
  };

  // Determine date ranges
  const showCompare = analyticData?.compareData && analyticData?.compareData?.length > 0;
  const normalDateRange = `${analyticData?.date?.startDate} - ${analyticData?.date?.endDate}`;
  const compareDateRange = showCompare
    ? `${analyticData?.date?.compare?.startDate} - ${analyticData?.date?.compare?.endDate}`
    : null;

  return (
    <div>
      <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 text-black shadow-xl rounded-xl px-6 py-5 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
              loadAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{metric.label}</h3>
              {metric.icon}
            </div>

            <div className="text-lg font-semibold space-y-2">
              {showCompare ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">Current</span>
                    {renderValue((normalTotals as any)[metric.field], metric.isFloat, metric.suffix)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-60">Compare</span>
                    {renderValue((compareTotals as any)[metric.field], metric.isFloat, metric.suffix)}
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Total</span>
                  {renderValue((normalTotals as any)[metric.field], metric.isFloat, metric.suffix)}
                </div>
              )}
            </div>

            {/* Date ranges at bottom */}
            <div className="mt-3 text-xs text-gray-700 text-right space-y-1">
              <div>Current: {normalDateRange}</div>
              {compareDateRange && <div>Compare: {compareDateRange}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default DashboardStatsCompare;
