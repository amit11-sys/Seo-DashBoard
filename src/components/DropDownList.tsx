// "use client";
// import React from "react";
// import { Switch } from "@/components/ui/switch";
// import Select, { SingleValue, StylesConfig } from "react-select";

// interface OptionType {
//   value: string;
//   label: string;
// }

// interface DropDownListProps {
//   icon?: React.ReactNode;
//   listData?: string[];
//   listName?: string;
//   value?: string;
//   showArrow?: boolean;
//   showSwitch?: boolean;
//   switchName?: string;
//   onChange?: (selected: SingleValue<OptionType>) => void;
//   errorMessage?: string;
// }

// const DropDownList = ({
//   icon,
//   listData = [],
//   listName,
//   showArrow = true,
//   value,
//   onChange,
//   showSwitch,
//   switchName,
//   errorMessage,
// }: DropDownListProps) => {
  
//   const options: OptionType[] = listData.map((item) => ({
//     value: item.toLowerCase(),
//     label: item,
//   }));

//   const customComponents = {
//     IndicatorSeparator: () => null,
//     ...(showArrow ? {} : { DropdownIndicator: () => null }),
//   };

//   const customStyles: StylesConfig<OptionType, false> = {
//     control: (base) => ({
//       ...base,
//       background: "transparent",
//       border: "none",
//       boxShadow: "none",
//       minHeight: "48px",
//       paddingLeft: 0,
//     }),
//     placeholder: (base) => ({
//       ...base,
//       color: "#999",
//     }),
//     menu: (base) => ({
//       ...base,
//       backgroundColor: "#fff",
//       borderRadius: "8px",
//       marginTop: "4px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       zIndex: 10,
//     }),
//     menuList: (base) => ({
//       ...base,
//       padding: "8px 0",
//       maxHeight: "200px",
//       overflowY: "auto",
//     }),
//     option: (base, state) => ({
//       ...base,
//       padding: "10px 15px",
//       transition: "all 0.3s ease",
//       opacity: state.isFocused ? 1 : 0.9,
//       transform: state.isFocused ? "translateX(0)" : "translateX(-5px)",
//       backgroundColor: state.isSelected
//         ? "#e2e8f0"
//         : state.isFocused
//         ? "#f1f5f9"
//         : "transparent",
//       color: "#1a202c",
//       cursor: "pointer",
//     }),
//   };

//   return (
//     <>
//       <div
//         className={`w-full px-3 rounded-full flex justify-start gap-3 items-center border-[1px] ${
//           errorMessage ? "border-red-500" : "border-slate-500"
//         }`}
//       >
//         {icon}
//         <div className="flex-1">
//           {showSwitch ? (
//             <p className="py-3">{switchName}</p>
//           ) : (
//             <Select
//               onChange={onChange}
//               value={options.find((option) => option.value === value)}
//               options={options}
//               placeholder={listName || "Select..."}
//               className="react-select-container"
//               classNamePrefix="react-select"
//               styles={customStyles}
//               components={customComponents}
//             />
//           )}
//         </div>
//         {showSwitch && <Switch />}
//       </div>
//       {errorMessage && (
//         <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
//       )}
//     </>
//   );
// };

// export default DropDownList;


// "use client";
// import React from "react";
// import { Switch } from "@/components/ui/switch";
// import Select, { SingleValue, StylesConfig } from "react-select";
// import { cn } from "@/lib/utils"; // If you don't have a `cn` utility, you can simply use template strings.

// interface OptionType {
//   value: string;
//   label: string;
// }

// interface DropDownListProps {
//   icon?: React.ReactNode;
//   listData?: string[];
//   listName?: string;
//   value?: string;
//   showArrow?: boolean;
//   showSwitch?: boolean;
//   switchName?: string;
//   onChange?: (selected: SingleValue<OptionType>) => void;
//   errorMessage?: string;
// }

// const DropDownList = ({
//   icon,
//   listData = [],
//   listName,
//   showArrow = true,
//   value,
//   onChange,
//   showSwitch,
//   switchName,
//   errorMessage,
// }: DropDownListProps) => {

//   const options: OptionType[] = listData.map((item) => ({
//     value: item.toLowerCase(),
//     label: item,
//   }));

//   const customComponents = {
//     IndicatorSeparator: () => null,
//     ...(showArrow ? {} : { DropdownIndicator: () => null }),
//   };

//   const customStyles: StylesConfig<OptionType, false> = {
//     control: (base) => ({
//       ...base,
//       background: "transparent",
//       border: "none",
//       boxShadow: "none",
//       minHeight: "48px",
//       paddingLeft: 0,
//     }),
//     placeholder: (base) => ({
//       ...base,
//       color: "#999",
//     }),
//     menu: (base) => ({
//       ...base,
//       backgroundColor: "#fff",
//       borderRadius: "8px",
//       marginTop: "4px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       zIndex: 10,
//     }),
//     menuList: (base) => ({
//       ...base,
//       padding: "8px 0",
//       maxHeight: "200px",
//       overflowY: "auto",
//     }),
//     option: (base, state) => ({
//       ...base,
//       padding: "10px 15px",
//       transition: "all 0.3s ease",
//       opacity: state.isFocused ? 1 : 0.9,
//       transform: state.isFocused ? "translateX(0)" : "translateX(-5px)",
//       backgroundColor: state.isSelected
//         ? "#e2e8f0"
//         : state.isFocused
//         ? "#f1f5f9"
//         : "transparent",
//       color: "#1a202c",
//       cursor: "pointer",
//     }),
//   };

//   return (
//     <>
//     <div
//       className={cn(
//         "w-full px-3  rounded-full flex justify-start gap-3 items-center border-[1px] transition-all duration-150",
//         errorMessage
//           ? "border-red-500 animate-shake"
//           : "border-slate-500"
//       )}
//     >
//       {icon}
//       <div className="flex-1">
//         {showSwitch ? (
//           <p className="py-3">{switchName}</p>
//         ) : (
//           <Select
//             onChange={onChange}
//             value={options.find((option) => option.value === value)}
//             options={options}
//             placeholder={listName || "Select..."}
//             className="react-select-container"
//             classNamePrefix="react-select"
//             styles={customStyles}
//             components={customComponents}
//           />
//         )}
//       </div>
//       {showSwitch && <Switch />}
//     </div>
//      {errorMessage && (
//         <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
//       )}
    
//     </>
//   );
// };

// export default DropDownList;


"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import Select, { SingleValue, StylesConfig } from "react-select";
import { cn } from "@/lib/utils"; // Utility for conditional classes

interface OptionType {
  value: string;
  label: string;
}

interface DropDownListProps {
  icon?: React.ReactNode;
  listData?: any;
  listName?: string;
  value?: any;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchName?: string;
  // onChange?: (selected: SingleValue<OptionType>) => void | Promise<void>;
  onChange?: any;

  errorMessage?: string;
  className?:string;
}

const DropDownList = ({
  icon,
  listData = [],
  listName,
  showArrow = true,
  value,
  onChange,
  showSwitch,
  switchName,
  errorMessage,
  className
}: DropDownListProps) => {

 const options: OptionType[] = listData.map((item: any) => {
  if (typeof item === "string") {
    return {
      value: item,
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    };
  } else if (typeof item === "object" && item !== null) {
    return {
      value: item.locationCode?.toString() || "",
      label: item.locationName || "",
    };
  } else {
    return { value: "", label: "" };
  }
});


  const customComponents = {
    IndicatorSeparator: () => null,
    ...(showArrow ? {} : { DropdownIndicator: () => null }),
  };

  const customStyles: StylesConfig<OptionType, false> = {
    control: (base) => ({
      ...base,
      background: "transparent",
      border: "none",
      boxShadow: "none",
      minHeight: "48px",
      paddingLeft: 0,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#999",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px",
      marginTop: "4px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 10,
    }),
    menuList: (base) => ({
      ...base,
      padding: "8px 0",
      maxHeight: "200px",
      overflowY: "auto",
    }),
    option: (base, state) => ({
      ...base,
      padding: "10px 15px",
      transition: "all 0.3s ease",
      opacity: state.isFocused ? 1 : 0.9,
      transform: state.isFocused ? "translateX(0)" : "translateX(-5px)",
      backgroundColor: state.isSelected
        ? "#e2e8f0"
        : state.isFocused
        ? "#f1f5f9"
        : "transparent",
      color: "#1a202c",
      cursor: "pointer",
    }),
  };

  return (
    <>
      <div
        className={cn(
          "w-full px-3 rounded-full flex justify-start gap-3 items-center border-[1px] transition-all duration-150",
          errorMessage ? "border-red-500 animate-shake" : "border-slate-500",
          className
        )}
      >
        {icon}
        <div className="flex-1">
          {showSwitch ? (
            <p className="py-3">{switchName}</p>
          ) : (
            <Select
              onChange={onChange}
              value={options.find((option) => option.value === value)}
              options={options}
              placeholder={listName || "Select..."}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={customStyles}
              components={customComponents}
            />
          )}
        </div>
        {showSwitch && <Switch />}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </>
  );
};

export default DropDownList;
