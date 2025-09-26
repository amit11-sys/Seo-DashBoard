"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export interface OptionType {
  label: string;
  value: any;
}

interface AutocompleteInputProps {
  fetchOptions: (query: string) => Promise<OptionType[]>;
  onSelect: (option: OptionType) => void;
  placeholder?: string;
}

export default function AutocompleteInput({
  fetchOptions,
  onSelect,
  placeholder = "Type to search...",
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (inputValue.length < 3) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const fetchedOptions = await fetchOptions(inputValue);
      setOptions(fetchedOptions);
      setShowDropdown(true);
    }, 1000); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [inputValue, fetchOptions]);

  const handleSelect = (option: OptionType) => {
    setInputValue(option.label);
    setShowDropdown(false);
    onSelect(option);
  };

  return (
    <div className="relative max-w-md space-y-2">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {showDropdown && options.length > 0 && (
        <Card className="absolute w-full max-h-60 overflow-y-auto z-10">
          {options.map((opt, idx) =>{
              // console.log(opt,"options in autocmpt")
            return(
  <div
              key={idx}
              onClick={() => handleSelect(opt)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {/* {opt.label} */}
            </div>
          )}
            )
          } 
           
          
        </Card>
      )}
    </div>
  );
}
