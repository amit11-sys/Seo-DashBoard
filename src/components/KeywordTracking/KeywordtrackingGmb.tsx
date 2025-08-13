"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function KeywordtrackingGmb() {
  // Dynamic data for chart
  const searchData = [
    { label: "Search - mobile", value: 2034, color: "#FACC15" },
    { label: "Search - desktop", value: 749, color: "#22C55E" },
    { label: "Maps - mobile", value: 125, color: "#3B82F6" },
    { label: "Maps - desktop", value: 91, color: "#FB923C" },
  ];

  const totalSearches = searchData.reduce((sum, item) => sum + item.value, 0);

  // Chart.js data config
  const chartData = useMemo(() => ({
    labels: searchData.map(d => d.label),
    datasets: [
      {
        data: searchData.map(d => d.value),
        backgroundColor: searchData.map(d => d.color),
        borderWidth: 1,
      },
    ],
  }), []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.formattedValue}`,
        },
      },
    },
  };

  // Dynamic keywords table
  const keywordRows = [
    { no: 1, keyword: "barclays", count: 1451 },
    { no: 2, keyword: "barclay", count: 414 },
    { no: 3, keyword: "(561)221-4360", count: 0 },
    { no: 4, keyword: "alex poulson public adjuster", count: 0 },
    { no: 5, keyword: "barcaly", count: 0 },
    { no: 6, keyword: "barclay senior living", count: 0 },
    { no: 7, keyword: "barclay's", count: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        
        {/* Left: Donut Chart + Title */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-lg font-semibold mb-2">
            How customers search for your business
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Last Updated: 30 mins ago (Aug 13, 2025)
          </p>

          <div className="relative w-56 h-56">
            <Pie data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-lg font-bold">{totalSearches}</p>
              <p className="text-xs text-gray-500">All Searches</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-1">
            {searchData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.label} {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Table */}
        <div className="flex-1">
          <h3 className="text-md font-semibold mb-3">Top Search Keywords</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sr.no</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Keyword</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {keywordRows.map(row => (
                  <tr key={row.no}>
                    <td className="px-3 py-2 text-sm">{row.no}</td>
                    <td className="px-3 py-2 text-sm">{row.keyword}</td>
                    <td className="px-3 py-2 text-sm">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
