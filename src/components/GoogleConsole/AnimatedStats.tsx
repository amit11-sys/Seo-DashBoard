import React, { useEffect, useState } from "react";

const statsData = [
  {
    label: "Total Clicks",
    icon: (
      <svg
        className="w-12 h-12 text-white animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect>
      </svg>
    ),
    colors: "bg-gradient-to-r from-purple-500 to-indigo-600",
  },
  {
    label: "Total Impressions",
    icon: (
      <svg
        className="w-12 h-12 text-white animate-spin-slow"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="3" ry="3"></rect>
      </svg>
    ),
    colors: "bg-gradient-to-r from-green-400 to-green-700",
  },
  {
    label: "Total CTR",
    icon: (
      <svg
        className="w-12 h-12 text-white animate-pulse"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="5" y="5" width="14" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
    colors: "bg-gradient-to-r from-gray-900 to-gray-700",
  },
  {
    label: "Average Position",
    icon: (
      <svg
        className="w-12 h-12 text-white animate-bounce-slow"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="6" y="6" width="12" height="12" rx="1" ry="1"></rect>
      </svg>
    ),
    colors: "bg-gradient-to-r from-yellow-600 to-yellow-800",
  },
];

// Custom slow animations for Tailwind CSS
// we will add inline style for these animations

const AnimatedStats = () => {
  const [loadAnim, setLoadAnim] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadAnim(true), 100); // delay to trigger animations
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg);}
            to { transform: rotate(360deg);}
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1);}
            50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1);}
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }

          .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            animation-fill-mode: forwards;
            animation-duration: 0.6s;
            animation-timing-function: cubic-bezier(0.4,0,0.2,1);
            animation-name: fadeInUp;
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
<div className="flex flex-wrap justify-center gap-8 px-4 py-10">
  {statsData.map((stat, idx) => (
    <div
      key={stat.label}
      className={`flex items-center gap-6 rounded-xl shadow-xl p-8 min-w-[280px] max-w-[320px] ${stat.colors} text-white select-none cursor-default ${
        loadAnim ? "fade-in-up" : ""
      }`}
      style={{ animationDelay: `${idx * 200}ms` }}
    >
      <div className="text-4xl">{stat.icon}</div>
      <div>
        <h3 className="text-xl font-extrabold  tracking-wide">{stat.label}</h3>
      </div>
    </div>
  ))}
</div>

    </>
  );
};

export default AnimatedStats;

