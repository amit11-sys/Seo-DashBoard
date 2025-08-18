"use client";

import { useState } from "react";

export default function ScanInformation() {
  const [keywords, setKeywords] = useState([
    { keyword: "public adjuster boca raton", rank: 3, searchVolume: 1200 },
    { keyword: "insurance claims help", rank: 5, searchVolume: 800 },
  ]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-bold">Scan Information</h2>
        <div className="flex items-center gap-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded">Excel</button>
          <button className="bg-purple-500 text-white px-3 py-1 rounded">Refresh</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          <button className="bg-blue-600 text-white px-4 py-1 rounded">+ Add Keywords</button>
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="font-semibold">Barclays Public Adjusters</h3>
          <p className="text-gray-600">
            7601 N Federal Highway, Suite 130, Boca Raton, 33487, FL, US
          </p>
          <p className="text-yellow-500">⭐⭐⭐⭐⭐ (82 Reviews)</p>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Local Rankings Table */}
        <div className="bg-white shadow rounded-lg p-4 overflow-auto">
          <h4 className="font-semibold mb-2">Local Rankings</h4>
          {keywords.length === 0 ? (
            <p className="text-gray-500">No Keyword found</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Keyword</th>
                  <th className="text-left p-2">Rank</th>
                  <th className="text-left p-2">Search Volume</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{k.keyword}</td>
                    <td className="p-2">{k.rank}</td>
                    <td className="p-2">{k.searchVolume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Map */}
        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="font-semibold mb-2">Map View</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3585.218229564951!2d-80.0802!3d26.4115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI0JzQxLjQiTiA4MMKwMDQnNDguNyJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            width="100%"
            height="300"
            loading="lazy"
            className="rounded-lg border"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
