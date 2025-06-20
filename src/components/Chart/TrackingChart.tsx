
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
  {
    date: "18 May",
    keyword1: 100,
    keyword2: 50,
    keyword3: 30,
    keyword4: 10,
  },
  {
    date: "26 May",
    keyword1: 95,
    keyword2: 55,
    keyword3: 35,
    keyword4: 15,
  },
  {
    date: "03 Jun",
    keyword1: 85,
    keyword2: 60,
    keyword3: 25,
    keyword4: 20,
  },
  {
    date: "11 Jun",
    keyword1: 70,
    keyword2: 50,
    keyword3: 20,
    keyword4: 25,
  },
  {
    date: "17 Jun",
    keyword1: 60,
    keyword2: 48,
    keyword3: 22,
    keyword4: 18,
  },
];

export default function TrackingChart() {
  return (
    <div className="rounded-xl my-10  flex-1 p-4 shadow-sm">
      <h2 className="text-2xl font-medium mb-4 text-muted-foreground">
        Keywords in top positions for the last 30 days
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={6}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="keyword1" fill="#78350f" />
          <Bar dataKey="keyword2" fill="#f97316" />
          <Bar dataKey="keyword3" fill="#0ea5e9" />
          <Bar dataKey="keyword4" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
