import React from 'react';

// Define the props type
interface CustomInputProps {
  icon?: React.ReactNode; // Optional icon displayed inside the input wrapper
  listName: string;       // Placeholder text
  value?: string;  // Input value
 type?: "text" | "email" | "password" | "number" | "tel" | "search" | "url";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
}

// Functional component using TypeScript
const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  listName,
  value,
  onChange,
}) => {
  return (
    <div className="w-full px-3 rounded-full flex justify-start gap-3 items-center border-2">
      {icon}
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={listName || 'Enter text'}
          className="w-full py-3 bg-transparent focus:outline-none placeholder:text-gray-500 text-gray-900"
        />
      </div>
    </div>
  );
};

export default CustomInput;
