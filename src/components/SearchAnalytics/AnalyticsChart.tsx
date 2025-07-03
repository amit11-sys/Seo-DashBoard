import { useEffect, useState } from "react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DualAxisChart from "./ui/ChartComponent";
import BarChart from "@/components/ui/barChart";
// import TableComponent from "./Table";

const AnalyticsChart1 = ({
    analyticData,
    // tableData,
    // setDimension,
    // dimension,
}: {
    analyticData: any;
    // tableData: any;
    // setDimension: Dispatch<SetStateAction<string>>;
    // dimension: string;
}) => {
    // console.log(tableData);

    const [chartData, setChartData] = useState<any>(null);

    // console.log(analyticData);
 const chartData1 = {
        "Organic Search": "620",
        "Direct": "559",
        "Referral": "75",
        "Organic Social": "51",
        "Unassigned": "18",
        "Email": "17",
        "Organic Video": "8"
    };
    useEffect(() => {
        if (chartData1) {
            const updatedChartData =
                Array.isArray(analyticData?.analyticData?.rows) &&
                analyticData?.analyticData?.rows?.reduce((acc: any, item: any) => {
                    acc[item?.dimensionValues[0]?.value] = item?.metricValues[0]?.value;
                    return acc;
                }, {});
    
            setChartData(updatedChartData);
        }
    }, [analyticData]);


    return (
        <div>
            {!chartData ? (
                <>
                    
                    <BarChart chartData={chartData} />
                </>
            ) : (
                <p>Loading chart data...</p>
            )}
          
        </div>
    );
};

export default AnalyticsChart1;
