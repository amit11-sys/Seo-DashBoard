import React, { useEffect, useState } from "react";

export function ProgressBar({
  processed,
  total,
  done,
}: {
  processed: number;
  total: number;
  done: boolean;
}) {
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (done) {
      setShowCompleted(true);
      // hide after 3 seconds
      timer = setTimeout(() => {
        setShowCompleted(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [done]);

  if (!total || total === 0) return null;

  const percent = Math.round((processed / total) * 100);

  return (
    <div className="flex flex-col items-start space-y-1 w-52">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            done ? "bg-green-500" : "bg-orange-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-700">
        {done
          ? showCompleted
            ? "✅ Completed"
            : null
          : `Processing keywords... (${processed}/${total})`}
      </span>
    </div>
  );
}
