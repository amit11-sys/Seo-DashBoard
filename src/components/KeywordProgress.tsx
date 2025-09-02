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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (done) {
      // show bar immediately when completed
      setVisible(true);
      // hide after 3s
      timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
    } else {
      // reset visibility while processing
      setVisible(true);
    }
    return () => clearTimeout(timer);
  }, [done]);

  if (!total || total === 0 || !visible) return null;

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
          ? "✅ Completed"
          : `Processing keywords... (${processed}/${total})`}
      </span>
    </div>
  );
}
