// // components/SearchBar.tsx
// "use client";

// import { Input } from "@/components/ui/input";
// import { IoSearchSharp } from "react-icons/io5";



// const SearchBar = () => {
//   return (
//     <div className="relative w-full rounded max-w-sm">
//         <div className="absolute bg-blue-500 p-3 rounded-full  text-white text-4xl right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ">

//       <IoSearchSharp className="text-lg"   />
//         </div>
//       <Input
//         type="text"
//         placeholder="Search..."
//         className="p-5 rounded-full"
//       />
//     </div>
//   );
// };

// export default SearchBar;



// components/SearchBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-sm ">
      {/* Search Icon on the right inside the input */}
      <div className="absolute bg-blue-600 p-2 rounded-full right-3 top-1/2 translate-x-[20%]  -translate-y-1/2 text-muted-foreground pointer-events-none">
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
