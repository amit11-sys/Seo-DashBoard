"use client";


import LiveKeywordTracking from "@/components/LiveKeywordTracking";
// import { useEffect } from "react";
// import { toast } from "sonner";
// type Props = {};
// const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
// const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;


export default function Home() {
  
  
  
//   const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

// // const basicAuth = btoa("username:password"); // replace with your credentials

// useEffect(() => {
//   const fetchCitiesByCountry = async () => {
//     try {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${basicAuth}`,
//         },
//       });

//       const data = await res.json();
//       console.log(data, "fetch");

   
//     } catch (error) {
//       console.error("Error fetching cities:", error);
//       toast.error("Failed to fetch cities.");
//     }
//   };

//   fetchCitiesByCountry();
// }, []);


  return (
    <>
      <div className="w-screen relative">
        
        {/* <LiveKeywordTracking /> */}
      </div>
    </>
  );
}
