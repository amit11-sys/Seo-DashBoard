import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: any; cols?: any }) {
  return (
    <div className="w-full shadow-lg rounded-md overflow-hidden">
      <table className="min-w-[1000px] w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} className="border-b">
              {Array.from({ length: cols }).map((_, col) => (
                <td key={col} className="p-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
