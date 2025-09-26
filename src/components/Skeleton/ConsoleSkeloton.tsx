import React from "react";

const ConsoleSkeloton = () => {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* 4 Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[150px] bg-gray-200 rounded-xl skeleton shadow-sm"
          ></div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-[100px] my-10 skeleton bg-gray-200 rounded-xl shadow-sm"></div>
      <div className="h-[400px] my-10 skeleton bg-gray-200 rounded-xl shadow-sm"></div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl  shadow-sm p-4">
        {/* Header Row */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 skeleton rounded w-1/5 mx-1"
            ></div>
          ))}
        </div>

        {/* Table Rows */}
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex"
            >
              {[...Array(5)].map((_, j) => (
                <div
                  key={j}
                  className="h-4 skeleton bg-gray-200 rounded w-1/5 mx-1"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsoleSkeloton;
