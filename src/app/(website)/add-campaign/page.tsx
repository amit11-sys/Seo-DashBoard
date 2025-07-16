export const dynamic = 'force-dynamic';
import React from "react";
import TabsComponents from "@/components/Compaign/TabsComponents";

const AddCamapign = async () => {




// const username = process.env.NEXT_PUBLIC_DATAFORSEO_USERNAME;
// const password = process.env.NEXT_PUBLIC_DATAFORSEO_PASSWORD;

// const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

// async function fetchLocations() {
//   const res = await fetch('https://api.dataforseo.com/v3/serp/google/locations', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Basic ${basicAuth}`,
//     }
//   });

//   if (!res.ok) {
//     console.error("Failed to fetch locations:", res.status);
//     return;
//   }

//   const data = await res.json();
//   console.log("Locations:", data.tasks[0].result);
// }

// fetchLocations();




  return (
    <div>
      <TabsComponents/>

    </div>
  );
};

export default AddCamapign;
