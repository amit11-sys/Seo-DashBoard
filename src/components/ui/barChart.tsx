// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// // Register chart elements
// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const BarChart = ({}: any) => {
//     const chartData = {
//         "Organic Search": "620",
//         "Direct": "559",
//         "Referral": "75",
//         "Organic Social": "51",
//         "Unassigned": "18",
//         "Email": "17",
//         "Organic Video": "8"
//     };

//     // Convert data into chart format with attractive multi-color palette
//     const data = {
//         labels: Object.keys(chartData), // Categories (keys)
//         datasets: [
//             {
//                 label: "Traffic Sources",
//                 data: Object.values(chartData).map(Number), // Convert values to numbers
//                 backgroundColor: [
//                     "rgba(255, 99, 132, 0.7)",   // Red
//                     "rgba(54, 162, 235, 0.7)",   // Blue
//                     "rgba(255, 206, 86, 0.7)",   // Yellow
//                     "rgba(75, 192, 192, 0.7)",   // Teal
//                     "rgba(153, 102, 255, 0.7)",  // Purple
//                     "rgba(255, 159, 64, 0.7)",   // Orange
//                     "rgba(99, 255, 132, 0.7)",   // Green
//                 ],
//                 borderColor: [
//                     "rgba(255, 99, 132, 1)",
//                     "rgba(54, 162, 235, 1)",
//                     "rgba(255, 206, 86, 1)",
//                     "rgba(75, 192, 192, 1)",
//                     "rgba(153, 102, 255, 1)",
//                     "rgba(255, 159, 64, 1)",
//                     "rgba(99, 255, 132, 1)",
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     return (
//         <div style={{ width: "800px", margin: "auto", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
//             <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Traffic Source Breakdown</h2>
//             <Bar data={data} options={options} />
//         </div>
//     );
// };

// export default BarChart;



import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({chartData}: any) => {
    // console.log(chartData,"chartData in chart");    
    // console.log(Object.keys(chartData),"chartData in chart  (console data)");
    // {
    // "Direct": "27",
    // "Organic Search": "22",
    // "Referral": "17",
    // "Organic Social": "2"
    // } chartData in chart  (console data)




    // const chartData = {
    //     "Organic Search": "620",
    //     "Direct": "559",
    //     "Referral": "75",
    //     "Organic Social": "51",
    //     "Unassigned": "18",
    //     "Email": "17",
    //     "Organic Video": "8"
    // };
 

    // Convert data into chart format with attractive multi-color palette
    const data = {
        labels: Object?.keys(chartData || {}), // Categories (keys)
        datasets: [
            {
                label: "Traffic Sources",
                data: Object.values(chartData || {}).map(Number), // Convert values to numbers
                backgroundColor: [
                    "rgba(255, 99, 132, 0.7)",   // Red
                    "rgba(54, 162, 235, 0.7)",   // Blue
                    "rgba(255, 206, 86, 0.7)",   // Yellow
                    "rgba(75, 192, 192, 0.7)",   // Teal
                    "rgba(153, 102, 255, 0.7)",  // Purple
                    "rgba(255, 159, 64, 0.7)",   // Orange
                    "rgba(99, 255, 132, 0.7)",   // Green
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                    "rgba(99, 255, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: "800px", margin: "auto", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Traffic Source Breakdown</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;


