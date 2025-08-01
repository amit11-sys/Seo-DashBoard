"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { date: "18 May", keyword1: 100, keyword2: 50, keyword3: 30, keyword4: 10 },
  { date: "26 May", keyword1: 95, keyword2: 55, keyword3: 35, keyword4: 15 },
  { date: "03 Jun", keyword1: 85, keyword2: 60, keyword3: 25, keyword4: 20 },
  { date: "11 Jun", keyword1: 70, keyword2: 50, keyword3: 20, keyword4: 25 },
  { date: "17 Jun", keyword1: 60, keyword2: 48, keyword3: 22, keyword4: 18 },
];

export default function TrackingChart() {
  return (
    <div className="rounded-xl my-10 flex-1 p-6">
      <h2 className="text-2xl text-black font-semibold mb-4">
        📊 Keywords in Top Positions (Last 30 Days)
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barGap={8}>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="grad4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eab308" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#eab308" stopOpacity={0.5} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#000" tick={{ fill: "#000" }} />
          <YAxis stroke="#000" tick={{ fill: "#000" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            itemStyle={{ color: "#000" }}
            labelStyle={{ color: "#000" }}
          />
          <Legend wrapperStyle={{ color: "#000" }} />
          <Bar dataKey="keyword1" fill="url(#grad1)" />
          <Bar dataKey="keyword2" fill="url(#grad2)" />
          <Bar dataKey="keyword3" fill="url(#grad3)" />
          <Bar dataKey="keyword4" fill="url(#grad4)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
