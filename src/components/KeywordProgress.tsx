import React from "react";

export function ProgressBar({ processed, total }: { processed: number; total: number }) {
  if (!total || total === 0) return null;

  const percent = Math.round((processed / total) * 100);

  return (
    <div className="w-40 bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}
// 33a - npi
// 33b - taxonomy code
// 32a- npi
// 32b- taxonomy code for service location