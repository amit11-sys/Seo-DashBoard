
"use client";

import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-sm ">
      {/* Search Icon on the right inside the input */}
      <div className="absolute bg-orange-600 p-2 rounded-full right-3 top-1/2 translate-x-[20%]  -translate-y-1/2 text-muted-foreground pointer-events-none">
        <IoSearchSharp className="text-xl text-white" />
      </div>

      <Input
        type="text"
        placeholder="Search..."
        className="rounded-full border border-black pr-10 pl-4 py-5"
      />
    </div>
  );
};

export default SearchBar;
