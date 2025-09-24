
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";

type DateWiseRow = {
  keys?: string[]; // ["2024-09-17"]
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date?: string; // in case you already flatten it somewhere else
};

type ChartPayload = {
  dateWise?: DateWiseRow[];
  monthWise?: any[];
} | DateWiseRow[];

const FancyDualAxisChart = ({ data }: { data: ChartPayload }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Normalize your input into the shape Recharts expects
  const chartData = useMemo(() => {
    // if the prop is the plain array
    const rows: DateWiseRow[] = Array.isArray(data)
      ? data
      : (data?.dateWise ?? []);

    return rows.map((r) => ({
      date: r.date ?? r.keys?.[0] ?? "", // prefer r.date, fallback to keys[0]
      Clicks: r.clicks,
      Impression: r.impressions,
    }));
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!chartData?.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center rounded-xl border border-dashed text-gray-500">
        No data to display
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-xl shadow-lg p-4 overflow-hidden transform transition-all duration-700 relative ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Semi-transparent white overlay to make chart readable */}
      <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl backdrop-blur-sm"></div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          📊 Clicks & Impressions Dual Axis Chart
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorClicksLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient
                id="colorImpressionsLine"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              label={{ value: "Clicks", angle: -90, position: "insideLeft" }}
              stroke="#6366F1"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Impressions",
                angle: -90,
                position: "insideRight",
              }}
              stroke="#34D399"
            />
            <Tooltip />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Clicks"
              stroke="url(#colorClicksLine)"
              strokeWidth={1}
              dot={{ r: 4, fill: "#6366F1" }}
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Impression"
              stroke="url(#colorImpressionsLine)"
              strokeWidth={1}
              dot={{ r: 4, fill: "#34D399" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FancyDualAxisChart;
