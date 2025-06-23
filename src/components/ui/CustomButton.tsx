import React, {FC} from "react";

// Define prop types for BlueButton
interface CustomButton {
  buttonName: string;
   type?: "button" | "submit" | "reset";
  transparent?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const CustomButton = ({type, buttonName, transparent = false, onClick ,icon}:CustomButton) => {
  return (
    <button
      onClick={onClick}
      type={type}
      // 
      className={`${
  transparent
    ? "bg-transparent text-black border"
    : "bg-gradient-to-r from-[#FE7743] to-[#d65d2d] text-white"
} px-5 text-nowrap py-4 rounded-full  text-sm font-medium shadow-md transition-all duration-200 transform hover:scale-105 hover:from-[#d65d2d] hover:to-[#FE7743] flex items-center `}

    >
      {icon && <span className="mr-2">{icon}</span>  }
      {buttonName}
    </button>
  );
};

export default CustomButton;
