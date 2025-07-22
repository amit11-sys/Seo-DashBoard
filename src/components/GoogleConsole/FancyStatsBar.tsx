import { FaMousePointer, FaEye, FaCheckCircle, FaChartLine } from "react-icons/fa";
import CountUp from "react-countup";

const FancyStatsBar = ({ analyticData }: any) => {
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md overflow-hidden mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Search Console Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Total Clicks */}
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow hover:scale-[1.02] transition-transform">
          <FaMousePointer className="text-4xl" />
          <div>
            <p className="text-sm uppercase">Total Clicks</p>
            {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
              <p key={index} className="text-lg font-bold">
                <CountUp end={item.clicks} duration={1.5} /> <span className="text-xs text-gray-200 ml-2">({item.month})</span>
              </p>
            ))}
          </div>
        </div>

        {/* Total Impressions */}
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow hover:scale-[1.02] transition-transform">
          <FaEye className="text-4xl" />
          <div>
            <p className="text-sm uppercase">Total Impressions</p>
            {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
              <p key={index} className="text-lg font-bold">
                <CountUp end={item.impressions} duration={1.5} /> <span className="text-xs text-gray-200 ml-2">({item.month})</span>
              </p>
            ))}
          </div>
        </div>

        {/* Total CTR */}
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg shadow hover:scale-[1.02] transition-transform">
          <FaCheckCircle className="text-4xl" />
          <div>
            <p className="text-sm uppercase">Total CTR</p>
            {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
              <p key={index} className="text-lg font-bold">
                {item.ctr}
                <span className="text-xs text-gray-200 ml-2">({item.month})</span>
              </p>
            ))}
          </div>
        </div>

        {/* Avg. Position */}
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-lg shadow hover:scale-[1.02] transition-transform">
          <FaChartLine className="text-4xl" />
          <div>
            <p className="text-sm uppercase">Avg. Position</p>
            {analyticData?.analyticData?.monthWise?.map((item: any, index: number) => (
              <p key={index} className="text-lg font-bold">
                {item.position}
                <span className="text-xs text-gray-200 ml-2">({item.month})</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyStatsBar;
