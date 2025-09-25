
import React, { useEffect, useMemo, useState } from "react";
import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
import CountUp from "react-countup";

const metrics = [
  {
    label: "Total Clicks",
    icon: <FaMousePointer className="text-4xl text-black animate-bounce" />,
    gradient: "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200",
    field: "clicks",
    isFloat: false,
  },
  {
    label: "Total Impressions",
    icon: <FaEye className="text-4xl text-black animate-spin-slow" />,
    gradient: "bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200",
    field: "impressions",
    isFloat: false,
  },
  {
    label: "Total CTR",
    icon: <FaCheckCircle className="text-4xl text-black animate-pulse" />,
    gradient: "bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200",
    field: "ctr",
    isFloat: true,
    suffix: "%",
  },
  {
    label: "Average Position",
    icon: <FaChartLine className="text-4xl text-black animate-bounce-slow" />,
    gradient: "bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200",
    field: "position",
    isFloat: true,
  },
];


type Row = {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type MonthWiseItem = {
  month: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type Props =
  | {
      // old shape
      analyticData?: {
        analyticData?: {
          monthWise?: MonthWiseItem[];
        };
      };
    }
  | Row[] // new/raw rows shape
  | {
      monthWise?: MonthWiseItem[];
      dateWise?: any[];
    };

const DashboardStatsCollage = ({ analyticData }: { analyticData: Props }) => {
  const [loadAnim, setLoadAnim] = useState(false);

  // 1) Normalize input
  const { monthWise, rows } = useMemo(() => {
    // Array of rows (your country data)
    if (Array.isArray(analyticData)) {
      return { rows: analyticData as Row[], monthWise: undefined };
    }

    // object with monthWise/dateWise
    if (
      analyticData &&
      typeof analyticData === "object" &&
      ("monthWise" in analyticData || "dateWise" in analyticData)
    ) {
      const obj = analyticData as { monthWise?: MonthWiseItem[] };
      return { rows: undefined, monthWise: obj.monthWise };
    }

    // old nested analyticData.analyticData.monthWise
    const nested =
      (analyticData as any)?.analyticData?.analyticData?.monthWise ??
      (analyticData as any)?.analyticData?.monthWise ??
      (analyticData as any)?.monthWise;

    if (nested) return { rows: undefined, monthWise: nested as MonthWiseItem[] };

    return { rows: undefined, monthWise: undefined };
  }, [analyticData]);

  // 2) If we only have raw rows, compute totals
  const totals = useMemo(() => {
    if (!rows) return null;

    const clicks = rows.reduce((s, r) => s + (r.clicks || 0), 0);
    const impressions = rows.reduce((s, r) => s + (r.impressions || 0), 0);
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0; // percentage
    // weighted avg position by impressions
    const position =
      impressions > 0
        ? rows.reduce((s, r) => s + r.position * r.impressions, 0) /
          impressions
        : 0;

    return { clicks, impressions, ctr, position };
  }, [rows]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadAnim(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderValue = (value: number, isFloat: boolean, suffix?: string) => {
    if (isFloat) {
      return (
        <span className="text-2xl font-extrabold">
          {value.toFixed(2)}
          {suffix ?? ""}
        </span>
      );
    }
    return (
      <CountUp
        end={value}
        duration={1.5}
        separator=","
        className="text-2xl font-extrabold"
      />
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(-5%); }
            50% { transform: translateY(0); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
          .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s forwards;
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <div className="w-full px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          return (
            <div
              key={index}
              className={`${metric.gradient} text-black cursor-pointer shadow-xl rounded-xl px-6 py-5 flex flex-col justify-between transition-transform hover:scale-[1.02] ${
                loadAnim ? "fade-in-up" : ""
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">{metric.label}</h3>
                {metric.icon}
              </div>

              <div className="text-lg font-semibold space-y-2">
                {/* Case 1: We have monthWise -> list per month */}
                {monthWise?.length
                  ? monthWise.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm opacity-90">{item.month}</span>
                        {renderValue(
                          metric.field === "ctr"
                            ? item.ctr * 100 // assuming ctr is ratio (0-1)
                            : (item as any)[metric.field],
                          metric.isFloat,
                          metric.suffix
                        )}
                      </div>
                    ))
                  : // Case 2: Only rows -> show totals
                    totals && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">Total</span>
                        {renderValue(
                          (totals as any)[metric.field],
                          metric.isFloat,
                          metric.suffix
                        )}
                      </div>
                    )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DashboardStatsCollage;
