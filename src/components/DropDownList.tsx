"use client"
import React from "react";
import { Switch } from "@/components/ui/switch"
import Select, {
 
  SingleValue,
  StylesConfig,
 
} from "react-select";

// Define the structure of an individual dropdown option
interface OptionType {
  value: string;
  label: string;
}

// Props for the DropDownList component
interface DropDownListProps {
  // className?: string; // Optional class name for the dropdown wrapper
  icon?: React.ReactNode; // Optional icon displayed before the dropdown
  listData?: string[];    // Plain array of strings to be converted into options
  listName?: string;      // Placeholder text
  value?: string;         // Currently selected value (string form)
  showArrow?: boolean;
  showSwitch?:boolean;
  switchName?:string;    // Show/hide the dropdown arrow
  onChange?: (selected: SingleValue<OptionType>) => void; // Change handler
}

const DropDownList= ({
  icon,
  listData = [],
  listName,
  showArrow = true,
  value,
  onChange,
  showSwitch,
  switchName,
  
}:DropDownListProps) => {
  // Convert plain listData strings to react-select option format
  const options: OptionType[] = listData.map((item) => ({
    value: item.toLowerCase(),
    label: item,
  }));

  // Customize the components: remove the separator and optionally the arrow
  const customComponents = {
    IndicatorSeparator: () => null,
    ...(showArrow ? {} : { DropdownIndicator: () => null }),
  };

  // Optional: define custom styles using react-select style overrides
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
    // <div className={`${className ? className : "w-full px-3 rounded-full flex justify-start gap-3 items-center border-2" }`}>
    <div className="w-full px-3 rounded-full flex justify-start gap-3 items-center border-[1px] border-slate-500">
      {icon}
      <div className="flex-1">

       { showSwitch ? <p className="py-3">{switchName}</p> : <Select
          onChange={onChange}
          value={options.find((option) => option.value === value)}
          options={options}
          placeholder={listName || "Select..."}
          className="react-select-container"
          classNamePrefix="react-select"
          styles={customStyles}
          components={customComponents}
        />}
      </div>
      {showSwitch && <Switch /> }

    </div>
  );
};

export default DropDownList;

