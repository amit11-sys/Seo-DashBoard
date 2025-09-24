

"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DataPoint = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr?: number;
  position?: number;
};

type ChartDataShape = {
  normalData: DataPoint[];
  compareData?: DataPoint[];
};

export default function FancyDualAxisChart({
  ChartData,
}: {
  ChartData: ChartDataShape;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay, or replace with real async logic
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [ChartData]);

  const labels = ChartData.normalData.map((d) => d.keys[0]);
  const normalClicks = ChartData.normalData.map((d) => d.clicks);
  const normalImpressions = ChartData.normalData.map((d) => d.impressions);
  const compareClicks = ChartData.compareData?.map((d) => d.clicks);
  const compareImpressions = ChartData.compareData?.map((d) => d.impressions);
  const compareDates = ChartData.compareData?.map((d) => d.keys[0]);
  const primaryDates = ChartData.normalData?.map((d) => d.keys[0]);

  const datasets = [
    {
      label: "Clicks",
      data: normalClicks,
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      yAxisID: "yClicks",
    },
    {
      label: "Impressions",
      data: normalImpressions,
      borderColor: "rgba(75,100,192,1)",
      backgroundColor: "rgba(75,100,192,0.2)",
      yAxisID: "yImpressions",
    },
    compareClicks
      ? {
          label: "Compare Clicks",
          data: compareClicks,
          borderColor: "rgba(255,99,132,1)",
          backgroundColor: "rgba(255,99,132,0.2)",
          yAxisID: "yClicks",
          borderDash: [5, 5],
        }
      : undefined,
    compareImpressions
      ? {
          label: "Compare Impressions",
          data: compareImpressions,
          borderColor: "rgba(255,150,132,1)",
          backgroundColor: "rgba(255,150,132,0.2)",
          yAxisID: "yImpressions",
          borderDash: [5, 5],
        }
      : undefined,
  ].filter((d) => !!d);

  const data = { labels, datasets };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Clicks & Impressions Over Time",
      },
      tooltip: {
        callbacks: {
          title: () => "",
          label: (tooltipItem: any) => {
            const datasetLabel = tooltipItem.dataset.label || "";
            const value = tooltipItem.formattedValue;
            const dateLabel = datasetLabel.includes("Compare")
              ? compareDates?.[tooltipItem.dataIndex] || ""
              : primaryDates?.[tooltipItem.dataIndex] || "";
            return `${datasetLabel} (${dateLabel}): ${value}`;
          },
        },
      },
    },
    scales: {
      yClicks: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Clicks" },
      },
      yImpressions: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: { display: true, text: "Impressions" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="flex items-center justify-center ">
      {loading ? (
        // Tailwind CSS spinner
        <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      ) : (
        <div className="w-full">

          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}


