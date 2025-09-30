"use client";

import { FaGoogle, FaInfoCircle } from "react-icons/fa";
import { FcDeleteDatabase } from "react-icons/fc";

type Props = {
  disableConsole: () => void;
};

export default function SearchConsoleHead({ disableConsole }: Props) {
  return (
    <div className="flex flex-col items-center p-4 bg-white shadow rounded-md">
      <div className="flex items-center justify-between w-full gap-3">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <FaGoogle className="text-blue-600 text-4xl" />
          <div className="font-bold text-4xl">Search Console</div>
          <div className="text-gray-500 text-sm">
            <FaInfoCircle className="text-gray-400 text-sm ml-1 cursor-pointer" />
            {/* Example: Last Updated: 2 hours ago (Jun 30, 2025) */}
          </div>
        </div>

        {/* Right side - disable button */}
        <FcDeleteDatabase
          className="cursor-pointer text-4xl"
          title="Disable Search Console"
          onClick={disableConsole}
        />
      </div>
    </div>
  );
}
